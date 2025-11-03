import type { Metadata } from "next";
import { FormPersonalizado } from "@/components/FormPersonalizado";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "Refeições Personalizadas - Realizhe Real Food",
  description:
    "Solicite planos de alimentação sob medida com acompanhamento nutricional e integração direta ao WhatsApp.",
};

const beneficios = [
  "Cardápio criado junto com nossa nutricionista responsável",
  "Opção de enviar plano do seu profissional de saúde",
  "Adequação de calorias, macros e restrições alimentares",
  "Monitoramento mensal com ajustes de cardápio",
];

export default function PersonalizadasPage() {
  return (
    <div className="space-y-16 py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Personalização
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Plano alimentar feito exclusivamente para você
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Preencha o formulário em etapas para contar sobre sua rotina,
          preferências e objetivos. Registraremos tudo no Supabase, geraremos o
          aceite LGPD e enviaremos um resumo pelo WhatsApp.
        </p>
      </section>

      <section className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="card-surface border border-border p-8">
          <FormPersonalizado />
        </div>
        <div className="space-y-6 rounded-[32px] border border-primary/10 bg-accent/60 p-8">
          <h2 className="text-xl font-display font-semibold text-foreground">
            Benefícios do plano Realizhe
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {beneficios.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-primary/20 bg-white/80 p-4 text-sm text-muted-foreground">
            <p>
              Precisa de suporte imediato? Chame no WhatsApp{" "}
              <a
                className="font-semibold text-primary underline-offset-4 hover:underline"
                href="https://wa.me/5551992476399?text=Olá%20Realizhe!%20Cheguei%20pelo%20site%20e%20e%20preciso%20de%20suporte."
              >
                (51) 99247-6399
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
