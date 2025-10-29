export const CATEGORY_LABELS: Record<string, string> = {
  equilibrio: "Linha Equilibrio",
  gourmet: "Linha Gourmet",
  lowcarb: "Linha Performance",
  bemestar: "Linha Bem-estar",
  comfort: "Linha Comfort",
  lanches: "Linha Lanches",
};

export function getCategoryLabel(category?: string | null) {
  if (!category) return "Outros";
  return CATEGORY_LABELS[category] ?? category;
}

