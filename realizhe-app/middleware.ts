import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabaseMiddleware";

const PROTECTED_PATHS = ["/cardapio", "/personalizadas", "/meus-pedidos", "/perfil"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const supabase = createSupabaseMiddlewareClient({ req, res });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const requiresAuth = PROTECTED_PATHS.some((path) =>
      req.nextUrl.pathname.startsWith(path),
    );

    if (requiresAuth && !user) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error("Middleware auth error", error);
  }

  return res;
}

export const config = {
  matcher: ["/cardapio/:path*", "/personalizadas/:path*", "/meus-pedidos/:path*", "/perfil/:path*"],
};
