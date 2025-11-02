export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabaseClient";
import { getTermsHash, getTermsVersion } from "@/lib/legal";
import { buildStandardOrderMessage, normalizePhone } from "@/lib/whatsapp";

type OrderItemPayload = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type RequestPayload = {
  customer: {
    nome: string;
    email?: string;
    telefone: string;
    cpf?: string;
    endereco: string;
    cidade?: string;
    cep?: string;
    formaPagamento: string;
  };
  order: {
    tipo: string;
    itens: OrderItemPayload[];
    valorTotal?: number;
    observacoes?: string;
  };
  termsAccepted: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload;
    if (!body.termsAccepted) {
      return NextResponse.json(
        { success: false, message: "Aceite dos termos obrigatorio." },
        { status: 400 },
      );
    }

    const {
      customer: {
        nome,
        email,
        telefone,
        cpf,
        endereco,
        cidade,
        cep,
        formaPagamento,
      },
      order,
    } = body;

    if (!nome || !telefone || !endereco) {
      return NextResponse.json(
        { success: false, message: "Dados do cliente incompletos." },
        { status: 400 },
      );
    }

    if (!order?.itens?.length) {
      return NextResponse.json(
        { success: false, message: "Nenhum item informado." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServiceClient();

    const normalizedPhone = normalizePhone(telefone);
    const acceptedAt = new Date().toISOString();
    const termsVersion = getTermsVersion();
    const termsHash = getTermsHash();

    const { data: existingClient, error: selectError } = await supabase
      .from("clientes")
      .select("id, aceite_termos")
      .or(
        `telefone.eq.${normalizedPhone}${
          email ? `,email.eq.${email}` : ""
        }`.trim(),
      )
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    const acceptedFromRequest = Boolean(body.termsAccepted);
    const alreadyAccepted = existingClient?.aceite_termos === true;

    if (!alreadyAccepted && !acceptedFromRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Aceite os termos para concluir o pedido.",
        },
        { status: 400 },
      );
    }

    const headers = request.headers;
    const forwardedFor = headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim();

    const { data: ensuredCliente, error: ensureError } = await supabase.rpc(
      "ensure_cliente_with_terms",
      {
        p_email: email,
        p_phone: normalizedPhone,
        p_nome: nome,
        p_cpf: cpf ?? null,
        p_endereco: endereco,
        p_cidade: cidade,
        p_cep: cep,
        p_terms_version: termsVersion,
        p_terms_hash: termsHash,
        p_terms_acceptance: acceptedAt,
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
        { success: false, message: "Nao foi possivel identificar o cliente." },
        { status: 400 },
      );
    }

    const { error: orderError } = await supabase.from("pedidos").insert({
      cliente_id: clienteId,
      tipo_pedido: order.tipo,
      itens: order.itens,
      valor_total: order.valorTotal ?? null,
      forma_pagamento: formaPagamento,
      observacoes: order.observacoes ?? null,
    });
    if (orderError) throw orderError;

    const whatsappMessage = buildStandardOrderMessage(
      {
        customerName: nome,
        address: endereco,
        city: cidade,
        phone: normalizedPhone,
        payment: formaPagamento,
        total: order.valorTotal,
      },
      order.itens.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    );

    return NextResponse.json({
      success: true,
      whatsappUrl: `https://wa.me/5551982895068?text=${whatsappMessage}`,
    });
  } catch (error) {
    console.error("Order submission error", error);
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
            ? `Erro ao registrar pedido: ${error.message}`
            : "Erro ao registrar pedido.",
      },
      { status: 500 },
    );
  }
}

