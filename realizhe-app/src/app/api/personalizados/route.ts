export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";
import { getSupabaseServiceClient } from "@/lib/supabaseClient";
import { getTermsHash, getTermsVersion } from "@/lib/legal";
import { buildCustomPlanMessage, normalizePhone } from "@/lib/whatsapp";

type PersonalizadoPayload = {
  customer: {
    nome: string;
    email?: string;
    telefone: string;
    endereco: string;
    cidade?: string;
    cep?: string;
    formaPagamento: string;
  };
  plano: {
    frequencia: string;
    preferencias: string[];
    objetivos: string;
    observacoes?: string;
    valorEstimado?: number;
    arquivoPlano?: {
      name?: string;
      type?: string;
      data: string;
    };
  };
  termsAccepted: boolean;
};

const CUSTOM_PLAN_BUCKET =
  process.env.SUPABASE_CUSTOM_PLAN_BUCKET ?? "planos-personalizados";

function parseBase64File(
  file:
    | {
        name?: string;
        type?: string;
        data: string;
      }
    | undefined,
) {
  if (!file?.data) {
    return null;
  }

  const dataUrlMatch = file.data.match(/^data:(.*?);base64,(.*)$/);
  const base64 = dataUrlMatch ? dataUrlMatch[2] : file.data;
  const mimeType =
    dataUrlMatch?.[1] || file.type || "application/octet-stream";

  return {
    buffer: Buffer.from(base64, "base64"),
    mimeType,
    extension: (file.name ?? "arquivo").split(".").pop() ?? "bin",
    originalName: file.name ?? `anexo-${Date.now()}`,
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PersonalizadoPayload;

    if (!payload.termsAccepted) {
      return NextResponse.json(
        { success: false, message: "Aceite dos termos obrigatorio." },
        { status: 400 },
      );
    }

    const {
      customer: { nome, email, telefone, endereco, cidade, cep, formaPagamento },
      plano,
    } = payload;

    if (!nome || !telefone || !endereco) {
      return NextResponse.json(
        { success: false, message: "Dados do cliente incompletos." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServiceClient();
    const normalizedPhone = normalizePhone(telefone);

    const acceptanceTimestamp = new Date().toISOString();
    const termsVersion = getTermsVersion();
    const termsHash = getTermsHash();

    const headers = request.headers;
    const forwardedFor = headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim();

    const { data: ensuredCliente, error: ensureError } = await supabase.rpc(
      "ensure_cliente_with_terms",
      {
        p_email: email,
        p_phone: normalizedPhone,
        p_nome: nome,
        p_cpf: null,
        p_endereco: endereco,
        p_cidade: cidade,
        p_cep: cep,
        p_terms_version: termsVersion,
        p_terms_hash: termsHash,
        p_terms_acceptance: acceptanceTimestamp,
        p_terms_ip: clientIp ?? null,
      },
    );

    if (ensureError) {
      throw ensureError;
    }

    let clienteId: string | undefined;
    if (Array.isArray(ensuredCliente) && ensuredCliente.length > 0) {
      clienteId = (ensuredCliente[0] as { id?: string })?.id;
    } else if (ensuredCliente && typeof ensuredCliente === "object") {
      clienteId = (ensuredCliente as { id?: string }).id;
    }

    if (!clienteId) {
      const { data: fallback, error: fallbackError } = await supabase
        .from("clientes")
        .select("id")
        .or(
          `telefone.eq.${normalizedPhone}${
            email ? `,email.eq.${email}` : ""
          }`.trim(),
        )
        .maybeSingle();
      if (fallbackError) throw fallbackError;
      clienteId = fallback?.id as string | undefined;
    }

    if (!clienteId) {
      return NextResponse.json(
        {
          success: false,
          message: "Nao foi possivel identificar o cliente.",
        },
        { status: 400 },
      );
    }

    let attachmentUrl: string | null = null;
    const parsedFile = parseBase64File(plano.arquivoPlano);

    if (clienteId && parsedFile) {
      const filePath = `${clienteId}/${Date.now()}-${randomUUID()}.${
        parsedFile.extension
      }`;

      const { error: uploadError } = await supabase.storage
        .from(CUSTOM_PLAN_BUCKET)
        .upload(filePath, parsedFile.buffer, {
          contentType: parsedFile.mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error("Custom plan attachment upload error", uploadError);
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from(CUSTOM_PLAN_BUCKET)
        .getPublicUrl(filePath);

      attachmentUrl = publicData?.publicUrl ?? null;

      if (!attachmentUrl) {
        const { data: signedData, error: signedError } = await supabase.storage
          .from(CUSTOM_PLAN_BUCKET)
          .createSignedUrl(filePath, 60 * 60 * 24 * 30);

        if (signedError) {
          console.error("Custom plan signed URL error", signedError);
          throw signedError;
        }

        attachmentUrl = signedData?.signedUrl ?? null;
      }
    }

    const { error: customError } = await supabase
      .from("pedidos_personalizados")
      .insert({
        cliente_id: clienteId,
        plano: {
          preferencias: plano.preferencias,
          objetivos: plano.objetivos,
        },
        frequencia: plano.frequencia,
        forma_pagamento: formaPagamento,
        valor_estimado: plano.valorEstimado ?? null,
        observacoes: plano.observacoes ?? null,
        arquivo_plano: attachmentUrl,
      });
    if (customError) throw customError;

    const resumo = [
      `Frequencia: ${plano.frequencia}`,
      `Preferencias: ${plano.preferencias.join(", ")}`,
      `Objetivos: ${plano.objetivos}`,
    ];
    if (plano.observacoes) {
      resumo.push(`Observacoes: ${plano.observacoes}`);
    }

    const encodedMessage = buildCustomPlanMessage(
      {
        customerName: nome,
        address: endereco,
        city: cidade,
        phone: normalizedPhone,
        payment: formaPagamento,
      },
      resumo.join("\n"),
      attachmentUrl ?? undefined,
    );

    return NextResponse.json({
      success: true,
      whatsappUrl: `https://wa.me/5551992476399?text=${encodedMessage}`,
    });
  } catch (error) {
    console.error("Personalizado submission error", error);
    if (
      error instanceof Error &&
      error.message.includes("Supabase service key not configured")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Configuração do Supabase ausente. Defina NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error && error.message
            ? `Erro ao registrar plano personalizado: ${error.message}`
            : "Erro ao registrar plano personalizado.",
      },
      { status: 500 },
    );
  }
}
