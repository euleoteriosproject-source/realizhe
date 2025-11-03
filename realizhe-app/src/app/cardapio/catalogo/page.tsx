import type { Metadata } from "next";
import { fetchProductsServer } from "@/lib/productService";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "Realizhe Real Food | Cardápio",
  description:
    "Visualização estática do cardápio Realizhe Real Food para compartilhamento ou impressão.",
};

export default async function CardapioCatalogoPage() {
  const products = await fetchProductsServer({ onlyActive: true });

  return <CatalogClient products={products} />;
}
