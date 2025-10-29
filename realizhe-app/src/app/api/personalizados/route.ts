import { NextResponse } from "next/server";
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
    arquivoPlano?: string;
  };
  termsAccepted: boolean;
};

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

    const { data: existingClient, error: selectError } = await supabase
      .from("clientes")
      .select("id")
      .or(
        `telefone.eq.${normalizedPhone}${
          email ? `,email.eq.${email}` : ""
        }`.trim(),
      )
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    let clienteId = existingClient?.id;

    if (!clienteId) {
      const { data: insertedClient, error: insertClientError } = await supabase
        .from("clientes")
        .insert({
          nome,
          email,
          telefone: normalizedPhone,
          endereco,
          cidade,
          cep,
        })
        .select("id")
        .single();
      if (insertClientError) throw insertClientError;
      clienteId = insertedClient.id;
    }

    const headers = request.headers;
    const forwardedFor = headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim();

    const { error: termsError } = await supabase.from("termos_aceite").insert({
      cliente_id: clienteId,
      versao_termos: getTermsVersion(),
      hash_termos: getTermsHash(),
      ip_cliente: clientIp ?? null,
      aceitou_lgpd: true,
    });
    if (termsError) throw termsError;

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
        arquivo_plano: plano.arquivoPlano ?? null,
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
    );

    return NextResponse.json({
      success: true,
      whatsappUrl: `https://wa.me/5551982895068?text=${encodedMessage}`,
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
