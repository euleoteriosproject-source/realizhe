"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormCadastro } from "@/components/FormCadastro";

export function CartSummary() {
  const { items, addItem, decreaseItem, removeItem, total } = useCart();
  const [open, setOpen] = useState(false);

  const deliveryNote =
    "Entrega em Porto Alegre/RS e regiao mediante agendamento.";

  return (
    <div id="carrinho" className="card-surface sticky top-28 flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Seu pedido
        </h2>
        <p className="text-sm text-muted-foreground">
          Revise os itens selecionados e finalize em segundos pelo WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            Adicione produtos para montar seu pedido.
          </p>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex items-center gap-4 rounded-2xl border border-border p-3"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                <Image
                  src={item.imageUrl || "/images/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  R$ {item.price.toFixed(2)} cada
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => decreaseItem(item.id)}
                    aria-label={`Remover uma unidade de ${item.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addItem(item.id)}
                    aria-label={`Adicionar uma unidade de ${item.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">
                R$ {item.lineTotal.toFixed(2)}
              </span>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm">
        <span>Total estimado</span>
        <span className="text-lg font-display font-semibold text-primary">
          R$ {total.toFixed(2)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{deliveryNote}</p>

      <Button
        className="w-full justify-center gap-2"
        onClick={() => setOpen(true)}
        disabled={items.length === 0}
      >
        Finalizar pedido
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Finalizar pedido</DialogTitle>
            <DialogDescription>
              Preencha seus dados para registrar o pedido no Supabase e concluir
              via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <FormCadastro onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
