"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SpinnerIcon } from "@/components/icons/SpinnerIcon";

type Pedido = {
  id: string;
  criado_em: string;
  itens: Array<{ name: string; quantity: number }>;
  valor_total: number | null;
  forma_pagamento: string | null;
  observacoes: string | null;
};

type PedidoPersonalizado = {
  id: string;
  criado_em: string;
  plano: Record<string, unknown>;
  frequencia: string | null;
  forma_pagamento: string | null;
};

export default function MeusPedidosPage() {
  const { cliente } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [personalizados, setPersonalizados] = useState<PedidoPersonalizado[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("/api/pedidos/me", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message ?? "Falha ao carregar pedidos.");
        }
        setPedidos(data.pedidos ?? []);
        setPersonalizados(data.personalizados ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos().catch(console.error);
  }, []);

  return (
    <div className="py-12 sm:py-16">
      <div className="container space-y-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Histórico
          </span>
          <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
            Meus pedidos
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize os pedidos recentes feitos com a Realizhe Real Food.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <SpinnerIcon className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-primary/20 bg-accent/60 p-6 text-sm text-primary">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card-surface border border-border p-6">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Pedidos do cardápio
              </h2>
              {pedidos.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nenhum pedido registrado ainda.
                </p>
              ) : (
                <ul className="mt-4 space-y-4 text-sm">
                  {pedidos.map((pedido) => (
                    <li key={pedido.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(pedido.criado_em), "dd/MM/yyyy HH:mm")}
                        </span>
                        <span>ID: {pedido.id.slice(0, 6)}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="font-semibold text-foreground">Itens:</span>
                          <ul className="mt-1 list-disc space-y-1 pl-4">
                            {(pedido.itens ?? []).map((item) => (
                              <li key={item.name}>
                                {item.quantity}x {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p>
                          <span className="font-semibold text-foreground">
                            Total:
                          </span>{" "}
                          {pedido.valor_total != null
                            ? `R$ ${pedido.valor_total.toFixed(2)}`
                            : "A definir"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Pagamento:
                          </span>{" "}
                          {pedido.forma_pagamento ?? "Não informado"}
                        </p>
                        {pedido.observacoes ? (
                          <p className="text-muted-foreground">
                            Obs: {pedido.observacoes}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card-surface border border-border p-6">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Personalizados
              </h2>
              {personalizados.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nenhum pedido personalizado registrado ainda.
                </p>
              ) : (
                <ul className="mt-4 space-y-4 text-sm">
                  {personalizados.map((pedido) => (
                    <li key={pedido.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(pedido.criado_em), "dd/MM/yyyy HH:mm")}
                        </span>
                        <span>ID: {pedido.id.slice(0, 6)}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p>
                          <span className="font-semibold text-foreground">
                            Frequência:
                          </span>{" "}
                          {pedido.frequencia ?? "Não informada"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Pagamento:
                          </span>{" "}
                          {pedido.forma_pagamento ?? "Não informado"}
                        </p>
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                        >
                          <a
                            href={`mailto:atendimento@realizhe.com.br?subject=Pedido personalizado ${pedido.id}`}
                          >
                            Falar sobre este pedido
                          </a>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-white p-6 text-sm text-muted-foreground">
          <p>
            Precisa ajustar algum dado cadastral? Entre em contato com nossa equipe
            pelo WhatsApp ou envie um e-mail para{" "}
            <a
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href="mailto:atendimento@realizhe.com.br"
            >
              atendimento@realizhe.com.br
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
