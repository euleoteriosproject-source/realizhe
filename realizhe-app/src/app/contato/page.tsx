
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contato - Realizhe Real Food",
  description:
    "Fale com a Realizhe Real Food por WhatsApp, e-mail ou redes sociais. Atendimento humanizado para tirar dúvidas.",
};

const canais = [
  {
    title: "WhatsApp comercial",
    value: "(51) 99247-6399",
    href: "https://wa.me/5551992476399",
    description: "Atendimento de segunda a sexta, 9h às 18h.",
  },
  {
    title: "E-mail",
    value: "atendimento@realizhe.com.br",
    href: "mailto:atendimento@realizhe.com.br",
    description: "Respostas em até 1 dia útil.",
  },
  {
    title: "Instagram",
    value: "@realizherealfood",
    href: "https://instagram.com/realizherealfood",
    description: "Cardápios semanais, bastidores e novidades.",
  },
];

export default function ContatoPage() {
  return (
    <div className="space-y-16 py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Contato
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Estamos prontos para cuidar da sua alimentação
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Escolha o canal preferido ou comece agora mesmo pelo WhatsApp. Nossa
          equipe responde rapidamente para tirar dúvidas, ajustar pedidos e
          montar planos personalizados.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="https://wa.me/5551992476399" target="_blank">
              Falar no WhatsApp
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="px-8">
            <Link href="/personalizadas">Solicitar plano personalizado</Link>
          </Button>
        </div>
      </section>

      <section className="bg-secondary py-12 sm:py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {canais.map((canal) => (
            <div
              key={canal.title}
              className="card-surface h-full border border-border p-6"
            >
              <h3 className="text-lg font-display font-semibold text-foreground">
                {canal.title}
              </h3>
              <Link
                href={canal.href}
                className="mt-3 block text-sm font-semibold text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {canal.value}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                {canal.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-4">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Endereço e horário
        </h2>
        <div className="card-surface border border-border p-8 text-sm text-muted-foreground">
          <p>Rua Dr. Carlos Barbosa, 480 - Porto Alegre/RS</p>
          <p>Horários de retirada: terça a quinta, das 14h às 18h (com agendamento).</p>
          <p>Entregas sob agendamento com janela de 2 horas.</p>
        </div>
      </section>
    </div>
  );
}
