"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { CardProduto } from "@/components/CardProduto";
import { getCategoryLabel } from "@/constants/productCategories";

const ALL_KEY = "__all";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        unique.add(product.category);
      }
    });
    return Array.from(unique).sort((a, b) =>
      getCategoryLabel(a).localeCompare(getCategoryLabel(b)),
    );
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_KEY);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === ALL_KEY) return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-sm text-muted-foreground">
        Nenhum produto ativo encontrado. Atualize o cadastro no Supabase para liberar o cardapio.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {[ALL_KEY, ...categories].map((category) => {
            const isAll = category === ALL_KEY;
            const isActive = selectedCategory === category;
            return (
              <Button
                key={category}
                variant={isActive ? "primary" : "outline"}
                size="sm"
                className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
              >
                {isAll ? "Todos" : getCategoryLabel(category)}
              </Button>
            );
          })}
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <CardProduto key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
