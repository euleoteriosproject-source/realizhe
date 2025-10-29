
import { useEffect, useMemo, useState } from "react";
import type { Product, ProductRow } from "./types";
import {
  formatCategory,
  groupByCategory,
  mapProduct,
  placeholderSvg,
} from "./lib";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: Product[] };

const SUPABASE_REST_PATH =
  "/rest/v1/produtos?select=id,slug,nome,descricao,preco,imagem_path,categoria,destaques&ativo=eq.true&order=nome.asc";

const ALL_CATEGORY_KEY = "__all__";

function getSupabaseHeaders() {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) {
    return null;
  }
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };
}

function buildRestUrl() {
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}${SUPABASE_REST_PATH}`;
}

function normalizeCategory(category?: string | null) {
  return category?.trim() || "Outros";
}

function anchorIdFromCategory(category: string) {
  return `categoria-${normalizeCategory(category)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export default function App() {
  const [state, setState] = useState<FetchState>({ status: "idle" });
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORY_KEY);

  useEffect(() => {
    const headers = getSupabaseHeaders();
    const url = buildRestUrl();

    if (!headers || !url) {
      setState({
        status: "error",
        message:
          "Variáveis do Supabase não configuradas. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
      });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    fetch(url, { headers })
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.text();
          throw new Error(
            `Falha ao carregar produtos (${response.status}): ${body}`,
          );
        }
        return response.json() as Promise<ProductRow[]>;
      })
      .then((rows) => {
        if (!cancelled) {
          const mapped = rows.map(mapProduct);
          setState({ status: "success", data: mapped });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Erro inesperado ao carregar o catálogo.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const products = state.status === "success" ? state.data : [];

  const availableCategories = useMemo(() => {
    const uniqueKeys = new Set<string>();
    products.forEach((product) => {
      uniqueKeys.add(normalizeCategory(product.category));
    });
    return [ALL_CATEGORY_KEY, ...uniqueKeys];
  }, [products]);

  useEffect(() => {
    if (!availableCategories.includes(selectedCategory)) {
      setSelectedCategory(ALL_CATEGORY_KEY);
    }
  }, [availableCategories, selectedCategory]);

  const grouped = useMemo(() => {
    const source =
      selectedCategory === ALL_CATEGORY_KEY
        ? products
        : products.filter(
            (product) =>
              normalizeCategory(product.category) === selectedCategory,
          );
    return groupByCategory(source);
  }, [products, selectedCategory]);

  return (
    <div className="page">
      <div className="sheet">
        <header className="header">
          <p className="eyebrow">Catálogo</p>
          <h1>Cardápio Realizhe Real Food</h1>
          <p className="lead">
            Catálogo digital para consulta rápida do cardápio. Valores e
            disponibilidade podem variar conforme a semana de produção.
          </p>
          <div className="cta">
            <a
              className="cta-link"
              href="https://wa.me/5551992476399?text=Olá%20Realizhe!%20Cheguei%20pelo%20menu%20online%20e%20quero%20saber%20mais%20sobre%20os%20boxes."
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
        </header>

        {state.status === "success" && products.length ? (
          <nav className="category-nav" aria-label="Navegação de categorias">
            <button
              type="button"
              className={`category-pill${
                selectedCategory === ALL_CATEGORY_KEY ? " active" : ""
              }`}
              onClick={() => setSelectedCategory(ALL_CATEGORY_KEY)}
            >
              Todos
            </button>
            {availableCategories
              .filter((category) => category !== ALL_CATEGORY_KEY)
              .map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`category-pill${
                    selectedCategory === category ? " active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {formatCategory(category)}
                </button>
              ))}
          </nav>
        ) : null}

        {state.status === "loading" ? (
          <p className="status">Carregando informações...</p>
        ) : null}

        {state.status === "error" ? (
          <div className="status error">
            <p>Não foi possível carregar o catálogo.</p>
            <p className="details">{state.message}</p>
          </div>
        ) : null}

        {state.status === "success" ? (
          <main className="catalog" id="todos">
            {Object.entries(grouped).map(([category, categoryProducts]) => (
              <section
                className="category"
                key={category}
                id={anchorIdFromCategory(category)}
              >
                <div className="category-header">
                  <h2>{formatCategory(category)}</h2>
                  <div className="divider" />
                </div>
                <div className="products">
                  {categoryProducts.map((product) => (
                    <article className="card" key={product.id}>
                      <div className="thumb">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src = placeholderSvg;
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <div className="card-headline">
                          <h3>{product.name}</h3>
                          <span className="price-tag">
                            {product.price > 0
                              ? `R$ ${product.price.toFixed(2)}`
                              : "Sob consulta"}
                          </span>
                        </div>
                        {product.description ? (
                          <p className="description">{product.description}</p>
                        ) : null}
                        {product.highlights.length ? (
                          <ul className="highlights">
                            {product.highlights.map((highlight) => (
                              <li key={highlight}>{highlight}</li>
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
        ) : null}

        <footer className="footer">
          <p>
            Realizhe Real Food · CNPJ 29.255.549/0001-09 · Rua Dr. Carlos
            Barbosa, 480 - Porto Alegre/RS
          </p>
          <p>Contato: (55) 51 99247-6399 · @realizherealfood</p>
        </footer>
      </div>
    </div>
  );
}
