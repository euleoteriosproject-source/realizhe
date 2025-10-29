import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre - Realizhe Real Food",
  description:
    "Conheça a história da Realizhe Real Food, empresa de marmitas saudáveis fundada por Aline Chaves Guerreiro em Porto Alegre.",
};

const valores = [
  {
    title: "Sabor com memória afetiva",
    description:
      "Resgatamos receitas afetivas em versões equilibradas, privilegiando temperos frescos e técnicas leves.",
  },
  {
    title: "Nutricionismo consciente",
    description:
      "Planos desenvolvidos por nutricionistas com foco em macronutrientes, restrições alimentares e bem-estar.",
  },
  {
    title: "Transparência total",
    description:
      "Ficha técnica completa, informação nutricional e rastreabilidade de cada ingrediente utilizado.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "Fundação",
    description:
      "Aline Chaves Guerreiro inicia a Realizhe com propostas personalizadas para pacientes de nutrição.",
  },
  {
    year: "2021",
    title: "Crescimento",
    description:
      "Lançamento dos primeiros boxes assinatura com sopas, crepiocas e planos semanais.",
  },
  {
    year: "2023",
    title: "Cozinha certificada",
    description:
      "Expansão para cozinha industrial em Porto Alegre com selo de boas práticas e equipe multidisciplinar.",
  },
  {
    year: "2024",
    title: "Experiência digital",
    description:
      "Integramos sistemas de pedidos, Supabase e WhatsApp para agilizar o atendimento e a gestão.",
  },
];

export default function SobrePage() {
  return (
    <div className="space-y-16 py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Sobre nós
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Alimentação com propósito para transformar rotinas
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          A Realizhe Real Food nasceu na cozinha da nutricionista Aline Chaves
          Guerreiro com o objetivo de levar comida de verdade para agendas
          corridas. Hoje atendemos famílias, empresas e atletas com cardápios
          que equilibram sabor, nutrição e praticidade.
        </p>
        <div className="grid gap-6 rounded-[32px] border border-primary/15 bg-white p-8 shadow-card md:grid-cols-2">
          <div>
            <h2 className="text-xl font-display font-semibold">
              Nossa missão
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Entregar refeições saudáveis com afeto, respeitando preferências,
              restrições e objetivos individuais.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold">
              Onde estamos
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Rua Dr. Carlos Barbosa, 480 - Porto Alegre/RS. Atendemos a região
              metropolitana com entregas agendadas.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-12 sm:py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {valores.map((valor) => (
            <div key={valor.title} className="card-surface border border-border p-6">
              <h3 className="text-lg font-display font-semibold text-foreground">
                {valor.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {valor.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-8">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Nossa jornada
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {timeline.map((item) => (
            <div
              key={item.year}
              className="card-surface border border-primary/10 p-6"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {item.year}
              </span>
              <h3 className="mt-2 text-lg font-display font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
