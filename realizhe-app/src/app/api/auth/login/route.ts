import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabaseRoute";
import { fetchClienteByUserId } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Informe e-mail e senha." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message ?? "Credenciais invalidas.",
        },
        { status: 400 },
      );
    }

    const cliente = await fetchClienteByUserId(data.user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      cliente,
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { success: false, message: "Erro ao autenticar." },
      { status: 500 },
    );
  }
}
