"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/60 via-white to-secondary" />
      <div className="container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Alimentação com propósito
          </span>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[52px]">
            Marmitas saudáveis feitas por nutricionistas e entregues com carinho
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            A Realizhe Real Food combina gastronomia afetiva com nutrição
            inteligente para abastecer sua rotina com refeições completas,
            sopas funcionais e crepiocas artesanais.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/cardapio">Ver cardápio completo</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="gap-2 px-8"
            >
              <Link href="/personalizadas">Montar plano personalizado</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <span className="text-2xl font-display font-semibold text-primary">
                +3.500
              </span>
              <p>Refeições entregues no último semestre</p>
            </div>
            <div>
              <span className="text-2xl font-display font-semibold text-primary">
                5 anos
              </span>
              <p>Atuando em Porto Alegre e região</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-white shadow-floating">
            <Image
              src="/images/box-gourmet.png"
              alt="Kit de refeições Realizhe"
              width={640}
              height={480}
              className="w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-3xl border border-white/80 bg-white/90 p-4 text-sm shadow-card backdrop-blur">
            <p className="font-semibold text-foreground">
              Planos semanais sob medida
            </p>
              <p className="text-muted-foreground">
                Boxes de marmitas prontas, sopas funcionais e crepiocas de autoria
                própria.
              </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
