"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { termsText } from "@/data/legal";

type ModalTermosProps = {
  triggerLabel?: string;
};

export function ModalTermos({
  triggerLabel = "Ler Termos e Condições",
}: ModalTermosProps) {
  const [open, setOpen] = useState(false);
  const paragraphs = termsText.split("\n\n");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        {triggerLabel}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Termos e Condições Realizhe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
