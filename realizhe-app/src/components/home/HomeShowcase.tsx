import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProductsServer } from "@/lib/productService";
import Image from "next/image";

export async function HomeShowcase() {
  const products = await fetchProductsServer({ onlyActive: true });
  const featured = products.slice(0, 3);
  return (
    <section className="py-16 sm:py-20">
      <div className="container space-y-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Cardápio signature
            </span>
            <h2 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
              Boxes que resolvem sua semana
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Planos pensados para quem busca praticidade sem abrir mão do sabor.
              Escolha boxes prontos ou personalize com nossa equipe de nutrição.
            </p>
          </div>
          <Button asChild variant="outline" className="px-6">
            <Link href="/cardapio">Ver todos os produtos</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-6 text-sm text-muted-foreground">
              Cadastre ou ative produtos no Supabase para destacar o cardápio.
            </div>
          ) : (
            featured.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={product.imageUrl || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    R$ {product.price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
