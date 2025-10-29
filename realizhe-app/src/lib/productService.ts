import { createSupabaseServerClient } from "./supabaseServerClient";
import { getSupabaseServiceClient } from "./supabaseClient";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/types/product";

const storageBucketDefault = "produtos";
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const storageBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? storageBucketDefault;

const storageBaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL?.replace(/\/$/, "") ??
  (supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/${storageBucket}`
    : "");

type ProdutoRow = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  imagem_path: string | null;
  categoria: string | null;
  destaques: string[] | null;
  ativo: boolean | null;
};

function resolveImageUrl(row: ProdutoRow) {
  const path = row.imagem_path ?? "";
  if (!path) return "/images/placeholder.png";

  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  if (storageBaseUrl) {
    return `${storageBaseUrl}/${path.replace(/^\/+/, "")}`;
  }

  return "/images/placeholder.png";
}

function mapProduto(row: ProdutoRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.nome,
    description: row.descricao ?? "",
    price: row.preco != null ? Number(row.preco) : 0,
    imageUrl: resolveImageUrl(row),
    imagePath: row.imagem_path,
    category: row.categoria,
    highlights: Array.isArray(row.destaques) ? row.destaques : [],
    isActive: row.ativo ?? true,
  };
}

async function queryProdutos(
  client: SupabaseClient,
  options?: { onlyActive?: boolean },
) {
  let query = client
    .from("produtos")
    .select(
      "id, slug, nome, descricao, preco, imagem_path, categoria, destaques, ativo",
    )
    .order("nome", { ascending: true });

  if (options?.onlyActive) {
    query = query.eq("ativo", true);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapProduto);
}

export async function fetchProductsServer(options?: { onlyActive?: boolean }) {
  const supabase = createSupabaseServerClient();
  return queryProdutos(supabase, options);
}

export async function fetchProductsService(options?: {
  onlyActive?: boolean;
}) {
  const supabase = getSupabaseServiceClient();
  return queryProdutos(supabase, options);
}
