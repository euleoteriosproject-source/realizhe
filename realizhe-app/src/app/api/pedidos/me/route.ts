export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabaseRoute";
import { fetchClienteByUserId } from "@/lib/supabaseClient";
import { getSupabaseServiceClient } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Nao autenticado." },
        { status: 401 },
      );
    }

    const cliente = await fetchClienteByUserId(user.id);
    if (!cliente) {
      return NextResponse.json({ success: true, pedidos: [] });
    }

    const service = getSupabaseServiceClient();

    const [{ data: pedidos, error: pedidosError }, { data: personalizados, error: personalizadosError }] =
      await Promise.all([
        service
          .from("pedidos")
          .select("*")
          .eq("cliente_id", cliente.id)
          .order("criado_em", { ascending: false }),
        service
          .from("pedidos_personalizados")
          .select("*")
          .eq("cliente_id", cliente.id)
          .order("criado_em", { ascending: false }),
      ]);

    if (pedidosError) throw pedidosError;
    if (personalizadosError) throw personalizadosError;

    return NextResponse.json({
      success: true,
      pedidos,
      personalizados,
    });
  } catch (error) {
    console.error("Fetch meus pedidos error", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar pedidos." },
      { status: 500 },
    );
  }
}
