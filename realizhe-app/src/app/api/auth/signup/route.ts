export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseServiceClient, upsertCliente } from "@/lib/supabaseClient";
import { getTermsHash, getTermsVersion } from "@/lib/legal";

const FK_RETRY_ATTEMPTS = 5;
const FK_RETRY_DELAY = 200;
const DUPLICATE_EMAIL_MESSAGE =
  "Já existe uma conta cadastrada com este e-mail.";

type AdminClient = ReturnType<typeof getSupabaseServiceClient>["auth"]["admin"];

const digitsOnly = (value: unknown): string =>
  typeof value === "string" ? value.replace(/\D/g, "") : "";

const toTrimmed = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

async function getUserIdByEmail(email: string) {
  if (!email) {
    return null;
  }

  const supabase = getSupabaseServiceClient();
  try {
    const { data, error } = await supabase.rpc("auth_user_id_by_email", {
      p_email: email,
    });
    if (error) {
      console.error("auth_user_id_by_email error", error);
      return null;
    }
    return (data ?? null) as string | null;
  } catch (error) {
    console.error("auth_user_id_by_email exception", error);
    return null;
  }
}

function mapSupabaseError(message: string | undefined) {
  const fallback = "Erro ao criar conta.";
  if (!message) {
    return { status: 500, message: fallback };
  }

  const lower = message.toLowerCase();

  if (
    lower.includes("already exists") ||
    lower.includes("already registered") ||
    lower.includes("duplicate")
  ) {
    return { status: 409, message: DUPLICATE_EMAIL_MESSAGE };
  }

  if (lower.includes("violates foreign key constraint")) {
    return {
      status: 409,
      message:
        "Não foi possível vincular o usuário ao cadastro. Tente novamente em instantes.",
    };
  }

  if (lower.includes("database error creating new user")) {
    return { status: 500, message: "Erro interno ao criar o usuário." };
  }

  if (lower.includes("password")) {
    return {
      status: 400,
      message: "A senha informada não atende aos requisitos.",
    };
  }

  if (lower.includes("invalid email")) {
    return { status: 400, message: "Informe um e-mail válido." };
  }

  return { status: 400, message };
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
    } = body ?? {};

    if (aceiteTermos !== true) {
      return errorResponse("Aceite os termos para continuar.", 400);
    }

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const passwordValue = typeof password === "string" ? password : "";

    if (!normalizedEmail || !passwordValue) {
      return errorResponse("E-mail e senha são obrigatórios.", 400);
    }

    if (passwordValue.length < 6) {
      return errorResponse("A senha deve ter pelo menos 6 caracteres.", 400);
    }

    const nomeCompleto = toTrimmed(nome);
    if (!nomeCompleto) {
      return errorResponse("Informe seu nome completo.", 400);
    }

    const telefoneOriginal = toTrimmed(telefone);
    const telefoneNormalizado = digitsOnly(telefoneOriginal);
    if (telefoneNormalizado.length < 10) {
      return errorResponse("Informe um telefone válido.", 400);
    }

    const cpfNormalizado = digitsOnly(cpf);
    if (cpfNormalizado && cpfNormalizado.length !== 11) {
      return errorResponse("Informe um CPF válido.", 400);
    }

    const enderecoCompleto = toTrimmed(endereco);
    if (!enderecoCompleto) {
      return errorResponse("Informe o endereço completo.", 400);
    }

    const cidadeFormatada = toTrimmed(cidade);
    if (!cidadeFormatada) {
      return errorResponse("Informe a cidade.", 400);
    }

    const cepNormalizado = digitsOnly(cep);
    if (cepNormalizado.length < 8) {
      return errorResponse("Informe um CEP válido.", 400);
    }

    const supabase = getSupabaseServiceClient();
    const admin: AdminClient = supabase.auth.admin;
    const termsHash = getTermsHash();
    const termsVersion = getTermsVersion();
    const acceptedAt = new Date().toISOString();

    const metadata = {
      nome: nomeCompleto,
      telefone: telefoneOriginal || telefoneNormalizado,
    } as Record<string, string | null | undefined>;

    let createdUserId = await getUserIdByEmail(normalizedEmail);
    const isNewUser = !createdUserId;

    if (createdUserId) {
      const { error: updateError } = await admin.updateUserById(
        createdUserId,
        {
          password: passwordValue,
          user_metadata: metadata,
          email_confirm: true,
        },
      );

      if (updateError) {
        const mapped = mapSupabaseError(updateError.message);
        return NextResponse.json(
          { success: false, message: mapped.message },
          { status: mapped.status },
        );
      }
    } else {
      const { data, error } = await admin.createUser({
        email: normalizedEmail,
        password: passwordValue,
        email_confirm: true,
        user_metadata: metadata,
      });

      if (error || !data?.user) {
        const mapped = mapSupabaseError(error?.message);
        return NextResponse.json(
          { success: false, message: mapped.message },
          { status: mapped.status },
        );
      }

      createdUserId = data.user.id;
    }

    if (!createdUserId) {
      return errorResponse("Não foi possível criar o usuário.", 500);
    }

    let attempts = 0;
    let clienteRecord: any = null;
    while (true) {
      try {
        clienteRecord = await upsertCliente({
          user_id: createdUserId,
          nome: nomeCompleto,
          email: normalizedEmail,
          telefone: telefoneNormalizado,
          cpf: cpfNormalizado || null,
          endereco: enderecoCompleto,
          cidade: cidadeFormatada,
          cep: cepNormalizado,
          aceite_termos: true,
          hash_termos: `${termsVersion}:${termsHash}`,
          data_aceite: acceptedAt,
        });
        break;
      } catch (upsertError: any) {
        if (upsertError?.code === "23503" && attempts < FK_RETRY_ATTEMPTS) {
          attempts += 1;
          await new Promise((resolve) =>
            setTimeout(resolve, FK_RETRY_DELAY),
          );
          continue;
        }

        if (isNewUser) {
          await admin.deleteUser(createdUserId).catch((deleteError) => {
            console.error(
              "Failed to rollback user after upsert error",
              deleteError,
            );
          });
        }

        throw upsertError;
      }
    }

    const clienteId = clienteRecord?.id;
    if (clienteId) {
      const { error: termsInsertError } = await supabase
        .from("termos_aceite")
        .upsert(
          {
            cliente_id: clienteId,
            versao_termos: termsVersion,
            hash_termos: termsHash,
            data_aceite: acceptedAt,
            aceitou_lgpd: true,
          },
          { onConflict: "cliente_id" },
        );

      if (termsInsertError) {
        console.error("Failed to persist termos_aceite on signup", termsInsertError);
        return errorResponse("Nao foi possivel registrar o aceite dos termos.", 500);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Signup error", error);
    const mapped = mapSupabaseError(error?.message);
    const status =
      mapped.status >= 400 && mapped.status < 600 ? mapped.status : 500;
    return NextResponse.json(
      { success: false, message: mapped.message },
      { status },
    );
  }
}
