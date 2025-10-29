"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { getCategoryLabel } from "@/constants/productCategories";

type CardProdutoProps = {
  product: Product;
};

export function CardProduto({ product }: CardProdutoProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="card-surface flex h-full min-h-[560px] flex-col overflow-hidden shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl || "/images/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(min-width: 1280px) 320px, 100vw"
          priority={product.slug === "box-gourmet"}
        />
        <div className="absolute left-4 top-4">
          <Badge variant="accent">{getCategoryLabel(product.category)}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 px-7 py-7">
        <div className="space-y-3.5">
          <h3 className="text-[1.4rem] font-display font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
        {product.highlights.length ? (
          <ul className="space-y-2">
            {product.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Investimento
            </p>
            <span className="block whitespace-nowrap text-[2.1rem] font-display font-semibold text-primary">
              R$ {product.price.toFixed(2)}
            </span>
            <p className="text-xs text-muted-foreground">+ taxa de entrega.</p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center gap-2"
            onClick={() => addItem(product.id)}
          >
            <Plus className="h-4 w-4" />
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
