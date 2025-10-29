import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabaseRoute";
import { fetchClienteByUserId } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      const message =
        typeof error?.message === "string" ? error.message.toLowerCase() : "";
      const status = (error as { status?: number })?.status;
      if (message.includes("auth session missing") || status === 400) {
        return NextResponse.json({ user: null, cliente: null });
      }
      throw error;
    }

    if (!user) {
      return NextResponse.json({ user: null, cliente: null });
    }

    const cliente = await fetchClienteByUserId(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      cliente,
    });
  } catch (error) {
    console.error("Session fetch error", error);
    return NextResponse.json(
      { user: null, cliente: null },
      { status: 200 },
    );
  }
}
