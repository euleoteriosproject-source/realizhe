"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileMenu } from "@/components/ProfileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/cozinha", label: "Cozinha" },
  { href: "/processos", label: "Processos" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/personalizadas", label: "Personalizadas" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { cliente } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-white/80 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center">
          <span className="rounded-full bg-primary px-4 py-2 text-base font-semibold uppercase tracking-[0.28em] text-white">
            Realizhe
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  "text-muted-foreground hover:text-primary",
                  isActive && "text-primary",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-1 rounded-full bg-primary/20" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="secondary"
            size="md"
            className="hidden items-center gap-2 lg:flex"
          >
            <Link href="/cardapio#carrinho">
              <ShoppingBag className="h-4 w-4" />
              <span>Carrinho</span>
              <motion.span
                key={totalItems}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white"
              >
                {totalItems}
              </motion.span>
            </Link>
          </Button>

          <div className="hidden lg:block">
            <ProfileMenu />
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-white lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                      "text-muted-foreground hover:bg-accent/60 hover:text-primary",
                      isActive && "bg-accent/50 text-primary",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button
                asChild
                variant="primary"
                className="mt-2 w-full justify-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Link href="/cardapio#carrinho">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Ver carrinho ({totalItems})</span>
                </Link>
              </Button>
            </div>
            <div className="container border-t border-border px-4 pb-4 pt-3">
              {cliente ? (
                <div className="space-y-3 text-sm">
                  <p className="font-semibold text-foreground">
                    {cliente.nome ?? cliente.email ?? "Cliente Realizhe"}
                  </p>
                  <Link
                    href="/meus-pedidos"
                    className="block rounded-xl px-4 py-2 font-semibold text-muted-foreground transition hover:bg-accent/60 hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    Meus pedidos
                  </Link>
                  <Link
                    href="/logout"
                    className="block rounded-xl px-4 py-2 font-semibold text-primary transition hover:bg-accent/60"
                    onClick={() => setOpen(false)}
                  >
                    Sair
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40"
                  onClick={() => setOpen(false)}
                >
                  Fazer login
                </Link>
              )}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
