"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const { cliente, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!cliente) {
    return (
      <Button asChild variant="secondary" size="md">
        <Link href="/login">Entrar</Link>
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40"
      >
        <span>{cliente.nome ?? "Minha conta"}</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 min-w-[220px] rounded-2xl border border-border bg-white p-3 text-sm shadow-card">
          <div className="mb-3 border-b border-border pb-3 text-xs text-muted-foreground">
            {cliente.email}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/perfil"
              className="rounded-xl px-3 py-2 text-left transition hover:bg-accent/60"
              onClick={() => setOpen(false)}
            >
              Ver meus dados
            </Link>
            <Link
              href="/meus-pedidos"
              className="rounded-xl px-3 py-2 text-left transition hover:bg-accent/60"
              onClick={() => setOpen(false)}
            >
              Meus pedidos
            </Link>
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-left text-primary transition hover:bg-accent/60"
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
            >
              Sair
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
