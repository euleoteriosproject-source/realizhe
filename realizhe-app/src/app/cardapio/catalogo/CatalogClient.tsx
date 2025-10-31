"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import type { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type CatalogClientProps = {
  products: Product[];
};

const ALL_CATEGORY_KEY = "__all__";
const FALLBACK_IMAGE = "/images/placeholder.png";

const CATEGORY_LABELS: Record<string, string> = {
  equilibrio: "Equilíbrio",
  gourmet: "Gourmet",
  lowcarb: "Low Carb",
  bemestar: "Bem-estar",
  comfort: "Comfort",
  lanches: "Lanches",
};

function normalizeCategory(category?: string | null) {
  return category?.trim() || "Outros";
}

function anchorIdFromCategory(category: string) {
  return `categoria-${normalizeCategory(category)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function formatCategory(label: string) {
  const key = label?.toLowerCase();
  if (key && CATEGORY_LABELS[key]) {
    return CATEGORY_LABELS[key];
  }

  return label
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) => word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

function groupByCategory(items: Product[]) {
  return items.reduce<Record<string, Product[]>>((acc, item) => {
    const key = normalizeCategory(item.category);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

function handleImageError(
  event: SyntheticEvent<HTMLImageElement, Event>,
) {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === "true") {
    return;
  }
  target.dataset.fallbackApplied = "true";
  target.src = FALLBACK_IMAGE;
}

export default function CatalogClient({ products }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORY_KEY);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [ALL_CATEGORY_KEY];

    products.forEach((product) => {
      const normalized = normalizeCategory(product.category);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        ordered.push(normalized);
      }
    });

    return ordered;
  }, [products]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(ALL_CATEGORY_KEY);
    }
  }, [categories, selectedCategory]);

  const groupedEntries = useMemo(() => {
    const filteredProducts =
      selectedCategory === ALL_CATEGORY_KEY
        ? products
        : products.filter(
            (product) =>
              normalizeCategory(product.category) === selectedCategory,
          );

    return Object.entries(groupByCategory(filteredProducts));
  }, [products, selectedCategory]);

  const whatsappHref =
    "https://wa.me/5551992476399?text=Ol%C3%A1%20Realizhe!%20Cheguei%20pelo%20menu%20online%20e%20quero%20saber%20mais%20sobre%20os%20boxes.";

  const showCategoryNav = categories.length > 2;
  const isModalOpen = Boolean(activeProduct);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-rose-50 py-12 print:bg-white print:py-8">
      <div className="container">
        <div className="mx-auto w-full max-w-5xl space-y-10 rounded-[2.5rem] border border-primary/10 bg-white/95 p-8 shadow-[0_36px_96px_-40px_rgba(214,40,40,0.45)] backdrop-blur-sm sm:p-12 print:border-none print:bg-white print:p-0 print:shadow-none">
          <header className="space-y-5 text-center print:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Catálogo
            </p>
            <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
              Cardápio Realizhe Real Food
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
              Catálogo digital para consulta rápida do cardápio. Valores e disponibilidade podem variar conforme a semana de produção.
            </p>
            <div className="flex justify-center print:hidden">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-rose-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_-18px_rgba(214,40,40,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-18px_rgba(214,40,40,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Falar no WhatsApp
              </a>
            </div>
          </header>

          {showCategoryNav ? (
            <nav
              className="flex flex-wrap justify-center gap-2 rounded-full border border-primary/10 bg-white/80 p-2 text-sm shadow-sm backdrop-blur md:gap-3 print:hidden"
              aria-label="Navegação por categorias"
            >
              {categories.map((category) => {
                const isActive = category === selectedCategory;
                return (
                  <button
                    type="button"
                    key={category}
                    className={clsx(
                      "flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      isActive
                        ? "bg-gradient-to-r from-primary to-rose-500 text-white shadow-[0_18px_28px_-18px_rgba(214,40,40,0.6)]"
                        : "bg-primary/10 text-primary hover:bg-primary/15",
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === ALL_CATEGORY_KEY
                      ? "Todos"
                      : formatCategory(category)}
                  </button>
                );
              })}
            </nav>
          ) : null}

          {groupedEntries.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border bg-white/80 p-8 text-center text-sm text-muted-foreground">
              Nenhum produto ativo encontrado no momento.
            </p>
          ) : (
            <main className="space-y-10">
              {groupedEntries.map(([category, categoryProducts]) => (
                <section
                  key={category}
                  id={anchorIdFromCategory(category)}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-display font-semibold text-foreground sm:text-2xl">
                      {formatCategory(category)}
                    </h2>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-rose-400" />
                  </div>
                  <div className="space-y-6">
                    {categoryProducts.map((product) => (
                      <article
                        key={product.id}
                        className="grid gap-5 rounded-3xl border border-border/70 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(17,24,39,0.35)] transition-shadow hover:shadow-[0_30px_60px_-36px_rgba(214,40,40,0.35)] md:grid-cols-[minmax(0,240px)_1fr] md:items-center print:border-border print:shadow-none"
                      >
                        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-muted md:aspect-[4/3]">
                          <Image
                            src={product.imageUrl || FALLBACK_IMAGE}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 240px"
                            className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              {product.name}
                            </h3>
                            <span className="inline-flex min-w-[108px] items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                              {product.price > 0
                                ? `R$ ${product.price.toFixed(2)}`
                                : "Sob consulta"}
                            </span>
                          </div>
                          {product.description ? (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {product.description}
                            </p>
                          ) : null}
                          {product.highlights.length ? (
                            <button
                              type="button"
                              className="inline-flex w-fit items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                              onClick={() => setActiveProduct(product)}
                            >
                              Ver itens do box
                            </button>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </main>
          )}

          <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground sm:text-sm print:border-t print:border-border print:pt-4 print:text-left">
            <p>
              Realizhe Real Food - CNPJ 29.255.549/0001-09 - Rua Dr. Carlos
              Barbosa, 480 - Porto Alegre/RS
            </p>
            <p>Contato: (55) 51 99247-6399 - @realizherealfood</p>
          </footer>
        </div>
      </div>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setActiveProduct(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeProduct?.name}</DialogTitle>
            {activeProduct?.description ? (
              <DialogDescription>
                {activeProduct.description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          {activeProduct?.highlights.length ? (
            <ul className="space-y-3 text-sm text-foreground">
              {activeProduct.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-border bg-muted/40 px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma variação cadastrada para este box.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
