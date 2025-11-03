import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "Processos - Realizhe Real Food",
  description:
    "Conheça os processos de atendimento, pedido, produção e entrega da Realizhe Real Food.",
};

const passos = [
  {
    title: "1. Descoberta e briefing",
    description:
      "Entendemos preferências, restrições, objetivos nutricionais e rotina semanal do cliente.",
  },
  {
    title: "2. Planejamento de cardápio",
    description:
      "Equipe de nutrição e gastronomia monta propostas com ingredientes da estação e fichas técnicas completas.",
  },
  {
    title: "3. Produção e controle",
    description:
      "Preparo em lotes pequenos com monitoramento de temperatura, registros e aprovação final.",
  },
  {
    title: "4. Logística e acompanhamento",
    description:
      "Entrega com checklist assinado, notificação por WhatsApp e acompanhamento pós-consumo.",
  },
];

const integracoes = [
  "Supabase armazena pedidos, clientes e registros de aceite.",
  "Automação com WhatsApp para confirmação imediata.",
  "Painel interno acompanha status dos pedidos em tempo real.",
  "Dashboards de produção e resíduos alimentares.",
];

export default function ProcessosPage() {
  return (
    <div className="space-y-16 py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Como trabalhamos
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Processos conectados para cuidar de cada detalhe
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Do primeiro contato até a última colherada, mapeamos cada etapa para
          garantir qualidade, segurança alimentar e encantamento.
        </p>
      </section>

      <section className="bg-secondary py-12 sm:py-16">
        <div className="container grid gap-6 md:grid-cols-2">
          {passos.map((passo) => (
            <div
              key={passo.title}
              className="card-surface border border-primary/10 p-6"
            >
              <h3 className="text-lg font-display font-semibold text-foreground">
                {passo.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {passo.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Sistemas e integrações
        </h2>
        <div className="card-surface border border-border p-8">
          <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {integracoes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
