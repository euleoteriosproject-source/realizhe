import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseMiddlewareClient(opts: {
  req: NextRequest;
  res: NextResponse;
}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials missing for middleware client.");
  }

  return createMiddlewareClient(
    { req: opts.req, res: opts.res },
    {
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    },
  );
}
