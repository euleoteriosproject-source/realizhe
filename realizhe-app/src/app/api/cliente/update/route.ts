import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabaseRoute";
import { upsertCliente } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Nao autenticado." },
        { status: 401 },
      );
    }

    const updated = await upsertCliente({
      user_id: user.id,
      ...body,
    });

    return NextResponse.json({ success: true, cliente: updated });
  } catch (error) {
    console.error("Cliente update error", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar dados do cliente." },
      { status: 500 },
    );
  }
}
