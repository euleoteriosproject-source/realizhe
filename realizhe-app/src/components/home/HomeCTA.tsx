import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container overflow-hidden rounded-[32px] border border-primary/15 bg-primary text-primary-foreground shadow-floating">
        <div className="grid gap-8 px-8 py-12 sm:px-12 md:grid-cols-[2fr_1fr] md:items-center md:gap-12">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Plano personalizado
            </span>
            <h2 className="text-3xl font-display font-semibold sm:text-4xl">
              Vamos desenhar um cardápio exclusivo para sua rotina
            </h2>
            <p className="max-w-2xl text-sm text-white/80">
              Nossa equipe de nutrição analisa suas preferências, objetivos e
              horários para montar um plano completo. Envie seu plano atual ou
              fale com a gente para criar algo do zero.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link href="/personalizadas">Quero meu plano sob medida</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
