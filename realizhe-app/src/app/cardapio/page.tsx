import type { Metadata } from "next";
import { CartSummary } from "@/components/cart/CartSummary";
import { fetchProductsServer } from "@/lib/productService";
import { ProductGrid } from "@/components/cardapio/ProductGrid";

export const metadata: Metadata = {
  title: "Cardápio - Realizhe Real Food",
  description:
    "Veja os boxes de marmitas saudáveis, sopas funcionais e crepiocas da Realizhe Real Food.",
};

export const revalidate = 60;

export default async function CardapioPage() {
  const products = await fetchProductsServer({ onlyActive: true });

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-rose-50 py-14 sm:py-20">
      <section className="container">
        <div className="rounded-[2.5rem] border border-primary/10 bg-white/95 p-10 shadow-[0_40px_110px_-60px_rgba(214,40,40,0.55)] backdrop-blur md:p-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Cardápio completo
          </span>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div className="space-y-6">
              <h1 className="text-3xl font-display font-semibold leading-tight text-foreground sm:text-5xl">
                Escolha os boxes para uma semana prática, nutritiva e cheia de sabor.
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                Monte o pedido com as linhas Realizhe. Ao finalizar, guardamos os dados com segurança no Supabase e abrimos o WhatsApp com o resumo pronto para você confirmar com o atendimento.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl border border-primary/15 bg-accent/40 p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-primary">
                Experiência Realizhe
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  Boxes pensados por nutricionista, com equilíbrio entre sabor, performance e bem-estar.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  Entregas semanais em Porto Alegre e região, com produção fresca e rastreável.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  Atendimento humano pelo WhatsApp para ajustes finos e orientações personalizadas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <ProductGrid products={products} />
        <div className="lg:pl-6">
          <CartSummary />
        </div>
      </section>
    </div>
  );
}
