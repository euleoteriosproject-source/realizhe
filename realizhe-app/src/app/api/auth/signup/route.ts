import { NextResponse } from "next/server";
import { getSupabaseServiceClient, upsertCliente } from "@/lib/supabaseClient";
import { getTermsHash, getTermsVersion } from "@/lib/legal";

const FK_RETRY_ATTEMPTS = 5;
const FK_RETRY_DELAY = 200;

function normalizeErrorMessage(message: string | undefined) {
  if (!message) return "Erro ao criar conta.";
  const lower = message.toLowerCase();
  if (lower.includes("already exists") || lower.includes("duplicate")) {
    return "Ja existe uma conta cadastrada com este e-mail.";
  }
  if (lower.includes("database error creating new user")) {
    return "Ja existe uma conta cadastrada com este e-mail.";
  }
  if (lower.includes("password")) {
    return "A senha informada nao atende aos requisitos.";
  }
  if (lower.includes("invalid email")) {
    return "Informe um e-mail valido.";
  }
  return message;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      nome,
      telefone,
      cpf,
      endereco,
      cidade,
      cep,
      aceiteTermos,
    } = body;

    if (!aceiteTermos) {
      return NextResponse.json(
        { success: false, message: "Aceite os termos para continuar." },
        { status: 400 },
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "E-mail e senha sao obrigatorios." },
        { status: 400 },
      );
    }

    const serviceSupabase = getSupabaseServiceClient();

    const { data, error } = await serviceSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nome,
        telefone,
      },
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          message: normalizeErrorMessage(error?.message),
        },
        { status: 400 },
      );
    }

    const termsHash = getTermsHash();
    const termsVersion = getTermsVersion();
    const now = new Date().toISOString();

    let attempts = 0;
    while (true) {
      try {
        await upsertCliente({
          user_id: data.user.id,
          nome,
          email,
          telefone,
          cpf,
          endereco,
          cidade,
          cep,
          aceite_termos: true,
          hash_termos: `${termsVersion}:${termsHash}`,
          data_aceite: now,
        });
        break;
      } catch (error: any) {
        if (error?.code === "23503" && attempts < FK_RETRY_ATTEMPTS) {
          attempts += 1;
          await new Promise((resolve) => setTimeout(resolve, FK_RETRY_DELAY));
          continue;
        }
        throw error;
      }
    }

    const supabase = getSupabaseServiceClient();
    await supabase.auth.admin.generateLink({
      type: "signup",
      email,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Signup error", error);
    return NextResponse.json(
      {
        success: false,
        message: normalizeErrorMessage(error?.message) ?? "Erro ao criar conta.",
      },
      { status: 500 },
    );
  }
}
