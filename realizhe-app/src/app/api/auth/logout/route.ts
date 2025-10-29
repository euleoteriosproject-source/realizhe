import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabaseRoute";

export async function POST() {
  try {
    const supabase = createSupabaseRouteClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error", error);
    return NextResponse.json(
      { success: false, message: "Erro ao encerrar sessao." },
      { status: 500 },
    );
  }
}
