import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type RouteSupabaseClient = SupabaseClient;

export function createSupabaseRouteClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials missing for route handler client.");
  }

  const cookieStore = cookies();

  return createRouteHandlerClient(
    { cookies: () => cookieStore },
    {
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    },
  );
}
