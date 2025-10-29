
import type { Metadata } from "next";
import { termsText, TERMS_VERSION } from "@/data/legal";

export const metadata: Metadata = {
  title: "Termos e Condições - Realizhe Real Food",
  description:
    "Leia os Termos de Fornecimento da Realizhe Real Food, incluindo políticas de entrega, cancelamento e LGPD.",
};

export default function TermosPage() {
  const paragraphs = termsText.split("\n\n");
  return (
    <div className="py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Termos legais
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Termos de Fornecimento Realizhe
        </h1>
        <p className="text-sm text-muted-foreground">
          Versão {TERMS_VERSION}. Ao finalizar pedidos pelo site ou canais de
          atendimento, você concorda com as condições descritas abaixo.
        </p>
      </section>

      <section className="container mt-8 space-y-4 rounded-[32px] border border-border bg-white p-8 text-sm text-muted-foreground shadow-card sm:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}
