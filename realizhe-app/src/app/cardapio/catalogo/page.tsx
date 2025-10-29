import type { Metadata } from "next";
import Image from "next/image";
import { fetchProductsServer } from "@/lib/productService";

export const metadata: Metadata = {
  title: "Catálogo do Cardápio - Realizhe Real Food",
  description:
    "Visualização estática do cardápio Realizhe Real Food para compartilhamento ou impressão.",
};

function groupByCategory<T extends { category: string | null }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = item.category?.trim() || "Outros";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

function formatCategory(label: string) {
  return label
    .split(" ")
    .map((word) =>
      word
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");
}

export default async function CardapioCatalogoPage() {
  const products = await fetchProductsServer({ onlyActive: true });
  const grouped = groupByCategory(products);

  return (
    <div className="bg-white py-12 print:bg-white print:py-8">
      <div className="container max-w-4xl space-y-10">
        <header className="space-y-3 text-center print:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Catálogo
          </p>
          <h1 className="text-3xl font-display font-semibold text-foreground sm:text-4xl">
            Cardápio Realizhe Real Food
          </h1>
          <p className="text-sm text-muted-foreground">
            Versão estática para consulta rápida e impressão. Valores e
            disponibilidade podem variar conforme a semana de produção.
          </p>
        </header>

        <main className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="space-y-4">
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">
                  {formatCategory(category)}
                </h2>
                <div className="h-0.5 w-14 rounded-full bg-primary" />
              </div>
              <div className="space-y-4">
                {items.map((product) => (
                  <article
                    key={product.id}
                    className="grid gap-4 rounded-3xl border border-border/70 bg-white p-5 shadow-sm print:border-muted print:shadow-none md:grid-cols-[150px_minmax(0,1fr)]"
                  >
                    <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-muted md:h-full">
                      <Image
                        src={product.imageUrl || "/images/placeholder.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 150px"
                        className="h-full w-full object-cover"
                        priority={false}
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <span className="text-base font-semibold text-primary">
                          {product.price > 0
                            ? `R$ ${product.price.toFixed(2)}`
                            : "Sob consulta"}
                        </span>
                      </div>
                      {product.description ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {product.description}
                        </p>
                      ) : null}
                      {product.highlights.length ? (
                        <ul className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {product.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="rounded-full border border-border/80 px-3 py-1"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            Realizhe Real Food · CNPJ 29.255.549/0001-09 · Rua Dr. Carlos
            Barbosa, 480 - Porto Alegre/RS
          </p>
          <p>
            Contato: (51) 98289-5068 · atendimento@realizhe.com.br ·
            @realizherealfood
          </p>
        </footer>
      </div>
    </div>
  );
}
