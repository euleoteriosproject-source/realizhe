import { NextResponse } from "next/server";
import { fetchProductsService } from "@/lib/productService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get("active") !== "false";
    const products = await fetchProductsService({ onlyActive });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Fetch produtos error", error);
    return NextResponse.json(
      { success: false, products: [], message: "Erro ao carregar produtos." },
      { status: 500 },
    );
  }
}
