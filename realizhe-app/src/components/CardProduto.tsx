"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { KeyboardEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getCategoryLabel } from "@/constants/productCategories";
import type { Product } from "@/types/product";

type CardProdutoProps = {
  product: Product;
  onViewDetails?: (product: Product) => void;
};

export function CardProduto({ product, onViewDetails }: CardProdutoProps) {
  const { addItem, decreaseItem, items } = useCart();
  const quantity =
    items.find((item) => item.id === product.id)?.quantity ?? 0;

  const handleAdd = () => {
    addItem(product.id);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleDecrease = () => {
    decreaseItem(product.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleViewDetails();
    }
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-white shadow-[0_22px_55px_-34px_rgba(214,40,40,0.4)]"
    >
      <div
        role={onViewDetails ? "button" : undefined}
        tabIndex={onViewDetails ? 0 : undefined}
        onClick={onViewDetails ? handleViewDetails : undefined}
        onKeyDown={onViewDetails ? handleKeyDown : undefined}
        className={`group flex flex-col gap-5 px-7 pt-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          onViewDetails ? "cursor-pointer" : ""
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={product.imageUrl || "/images/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 320px, 100vw"
            priority={product.slug === "box-gourmet"}
          />
          <div className="absolute left-4 top-4">
            <Badge
              variant="accent"
              className="rounded-full px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]"
            >
              {getCategoryLabel(product.category)}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 pb-4">
          <h3 className="text-[1.45rem] font-display font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          {onViewDetails ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Ver detalhes
              <span aria-hidden>→</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-auto space-y-4 px-7 pb-7">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Investimento
          </p>
          <span className="block whitespace-nowrap text-[2.1rem] font-display font-semibold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground">+ taxa de entrega.</p>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5">
            <p className="text-sm font-semibold text-primary">
              {quantity} {quantity === 1 ? "item" : "itens"} no carrinho
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-primary/30 text-primary hover:bg-primary/10"
                onClick={handleDecrease}
                aria-label="Remover uma unidade"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="primary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleAdd}
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
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Adicionar ao carrinho
          </Button>
        )}
      </div>
    </motion.article>
  );
}
