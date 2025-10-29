import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials not configured for browser client.");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase service key not configured.");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function fetchClienteByUserId(userId: string) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function upsertCliente(data: {
  user_id: string;
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
  cpf?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  cep?: string | null;
  aceite_termos?: boolean;
  hash_termos?: string | null;
  data_aceite?: string;
}) {
  const supabase = getSupabaseServiceClient();
  const { data: result, error } = await supabase
    .from("clientes")
    .upsert(
      {
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return result;
}
