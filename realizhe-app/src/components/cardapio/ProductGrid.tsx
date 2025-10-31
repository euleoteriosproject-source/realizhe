"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardProduto } from "@/components/CardProduto";
import { useCart } from "@/contexts/CartContext";
import { getCategoryLabel } from "@/constants/productCategories";
import type { Product } from "@/types/product";

const ALL_KEY = "__all";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_KEY);
  const [activeProduct, setActiveProduct] = useState<Product | null>(
    null,
  );
  const { addItem, decreaseItem, items } = useCart();

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

  const filteredProducts = useMemo(() => {
    if (selectedCategory === ALL_KEY) return products;
    return products.filter(
      (product) => product.category === selectedCategory,
    );
  }, [products, selectedCategory]);

  const modalQuantity = activeProduct
    ? items.find((item) => item.id === activeProduct.id)?.quantity ?? 0
    : 0;

  const handleModalAdd = () => {
    if (!activeProduct) return;
    addItem(activeProduct.id);
    toast.success(`${activeProduct.name} adicionado ao carrinho`);
  };

  const handleModalDecrease = () => {
    if (!activeProduct) return;
    decreaseItem(activeProduct.id);
  };

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white/95 p-8 text-sm text-muted-foreground shadow-sm">
        Nenhum produto ativo encontrado. Atualize o cadastro no Supabase para liberar o cardápio.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.length > 0 && (
        <nav
          className="flex flex-wrap items-center gap-2 rounded-full border border-border/70 bg-white/90 p-3 shadow-sm"
          aria-label="Filtrar por categoria"
        >
          {[ALL_KEY, ...categories].map((category) => {
            const isAll = category === ALL_KEY;
            const isActive = selectedCategory === category;
            return (
              <Button
                key={category}
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                className={
                  isActive
                    ? "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                    : "rounded-full border border-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary hover:border-primary/40 hover:bg-primary/10"
                }
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
              >
                {isAll ? "Todos" : getCategoryLabel(category)}
              </Button>
            );
          })}
        </nav>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <CardProduto
            key={product.id}
            product={product}
            onViewDetails={setActiveProduct}
          />
        ))}
      </div>

      <Dialog
        open={Boolean(activeProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl overflow-hidden border-none bg-transparent p-0 shadow-none">
          {activeProduct ? (
            <article className="flex max-h-[90vh] flex-col overflow-hidden rounded-[2.5rem] border border-border/70 bg-white shadow-[0_40px_120px_-60px_rgba(214,40,40,0.45)]">
              <header className="space-y-4 bg-gradient-to-b from-primary/10 via-white to-white px-10 py-8 text-left">
                <Badge
                  variant="accent"
                  className="w-fit rounded-full px-5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]"
                >
                  {getCategoryLabel(activeProduct.category)}
                </Badge>
                <DialogTitle className="text-3xl font-display font-semibold leading-tight text-foreground">
                  {activeProduct.name}
                </DialogTitle>
                {activeProduct.description ? (
                  <DialogDescription className="text-base leading-relaxed text-muted-foreground">
                    {activeProduct.description}
                  </DialogDescription>
                ) : null}
              </header>

              <div className="flex flex-col gap-8 overflow-hidden px-10 pb-8">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-inner">
                  <Image
                    src={activeProduct.imageUrl || "/images/placeholder.png"}
                    alt={activeProduct.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 560px, 100vw"
                  />
                </div>

                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Itens inclusos
                  </p>
                  {activeProduct.highlights.length ? (
                    <div className="max-h-[220px] overflow-y-auto pr-1">
                      <ul className="space-y-3">
                        {activeProduct.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-white/85 px-5 py-3 text-sm text-foreground shadow-sm"
                          >
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                      Nenhum item detalhado foi informado para este produto.
                    </p>
                  )}
                </section>

                <footer className="flex flex-col gap-4 rounded-2xl border border-border bg-white/80 p-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Investimento
                    </p>
                    <span className="block text-3xl font-display font-semibold text-primary">
                      R$ {activeProduct.price.toFixed(2)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      + taxa de entrega.
                    </p>
                  </div>

                  {modalQuantity > 0 ? (
                    <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5">
                      <p className="text-sm font-semibold text-primary">
                        {modalQuantity}{" "}
                        {modalQuantity === 1 ? "item" : "itens"} no carrinho
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full border border-primary/30 text-primary hover:bg-primary/10"
                          onClick={handleModalDecrease}
                          aria-label="Remover uma unidade"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="primary"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={handleModalAdd}
                          aria-label="Adicionar uma unidade"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center gap-2"
                      onClick={handleModalAdd}
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar ao carrinho
                    </Button>
                  )}
                </footer>
              </div>
            </article>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
