
import type { Metadata } from "next";
import { privacyText } from "@/data/legal";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "Política de Privacidade - Realizhe Real Food",
  description:
    "Política de Privacidade e LGPD da Realizhe Real Food, incluindo direitos do titular e canais de atendimento.",
};

export default function PrivacidadePage() {
  const sections = privacyText.split("\n\n");
  return (
    <div className="py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          LGPD
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Política de Privacidade Realizhe
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo transparente sobre como coletamos, tratamos e compartilhamos
          dados pessoais para oferecer nossos produtos e serviços.
        </p>
      </section>

      <section className="container mt-8 space-y-4 rounded-[32px] border border-border bg-white p-8 text-sm text-muted-foreground shadow-card sm:text-base">
        {sections.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}
