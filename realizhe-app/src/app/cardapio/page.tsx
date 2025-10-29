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
    <div className="py-12 sm:py-16">
      <section className="container space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Cardápio completo
        </span>
        <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
          Escolha os boxes para sua semana
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Adicione os produtos preferidos ao carrinho. Ao finalizar, registramos os dados no Supabase e abrimos o WhatsApp com o resumo pronto para envio.
        </p>
      </section>

      <section className="container mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <ProductGrid products={products} />
        <div className="lg:pl-4">
          <CartSummary />
        </div>
      </section>
    </div>
  );
}

