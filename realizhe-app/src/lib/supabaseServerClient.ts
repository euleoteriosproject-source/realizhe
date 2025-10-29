import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials missing for server client.");
  }

  const cookieStore = cookies();

  return createServerComponentClient(
    { cookies: () => cookieStore },
    { supabaseUrl, supabaseKey: supabaseAnonKey },
  );
}
