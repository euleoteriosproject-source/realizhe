import type { Product, ProductRow } from "./types";

const storageBucketDefault = "produtos";
export const placeholderSvg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial,sans-serif" font-size="32">Imagem indisponível</text></svg>`,
  );

function ensureTrailing(path: string) {
  return path.replace(/^\/+/, "");
}

export function resolveStorageBase() {
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  const storageUrl =
    import.meta.env.VITE_SUPABASE_STORAGE_URL?.replace(/\/$/, "") ??
    (supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/${
          import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ??
          storageBucketDefault
        }`
      : "");

  return storageUrl;
}

export function mapProduct(row: ProductRow): Product {
  const storageBase = resolveStorageBase();
  const path = row.imagem_path ?? "";

  let imageUrl = placeholderSvg;
  if (path.startsWith("http")) {
    imageUrl = path;
  } else if (path && storageBase) {
    imageUrl = `${storageBase}/${ensureTrailing(path)}`;
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.nome,
    description: row.descricao ?? "",
    price: row.preco != null ? Number(row.preco) : 0,
    imageUrl,
    category: row.categoria,
    highlights: Array.isArray(row.destaques) ? row.destaques : [],
  };
}

const CATEGORY_NAMES: Record<string, string> = {
  equilibrio: "Equilíbrio",
  gourmet: "Gourmet",
  lowcarb: "Low Carb",
  bemestar: "Bem-estar",
  comfort: "Comfort",
  lanches: "Lanches",
};

export function formatCategory(label: string) {
  const key = label?.toLowerCase();
  if (key && CATEGORY_NAMES[key]) {
    return CATEGORY_NAMES[key];
  }

  return label
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function groupByCategory<T extends { category: string | null }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = item.category?.trim() || "Outros";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}
