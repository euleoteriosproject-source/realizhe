import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "Cozinha - Realizhe Real Food",
  description:
    "Conheça a estrutura da cozinha Realizhe: processos, equipamentos e controles de qualidade aplicados.",
};

const setores = [
  {
    title: "Recebimento e mise en place",
    description:
      "Conferência de insumos, higienização e fracionamento com etiquetagem para rastreabilidade.",
  },
  {
    title: "Cozimento inteligente",
    description:
      "Uso combinado de forno combinado, sous-vide e salteados rápidos para preservar textura e nutrientes.",
  },
  {
    title: "Resfriamento rápido",
    description:
      "Abatimento térmico com blast chiller garantindo segurança alimentar e prolongando shelf-life.",
  },
  {
    title: "Porcionamento e selagem",
    description:
      "Pesagem por balanças digitais, selagem a quente, identificação com lote e validade individual.",
  },
];

const controles = [
  "Plano APPCC implementado e revisado trimestralmente",
  "Check-lists diários de temperatura e sanitização",
  "Equipe treinada em Boas Práticas de Manipulação (BPM)",
  "Certificações de fornecedores homologados",
  "Relatórios digitais armazenados no Supabase",
];

export default function CozinhaPage() {
  return (
    <div className="space-y-16 py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Cozinha Realizhe
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Infraestrutura pensada para nutrição segura e saborosa
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Operamos em cozinha industrial licenciada pela vigilância sanitária de
          Porto Alegre/RS, com processos integrados ao Supabase para monitorar
          lotes, terminais e períodos de armazenamento.
        </p>
      </section>

      <section className="bg-secondary py-12 sm:py-16">
        <div className="container grid gap-6 md:grid-cols-2">
          {setores.map((setor) => (
            <div key={setor.title} className="card-surface border border-border p-6">
              <h3 className="text-lg font-display font-semibold text-foreground">
                {setor.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {setor.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Controles e monitoramento
        </h2>
        <div className="card-surface border border-primary/10 p-8">
          <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {controles.map((item) => (
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
