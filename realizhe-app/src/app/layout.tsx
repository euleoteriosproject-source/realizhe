import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "../components/providers/Providers";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { cn } from "../lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Realizhe Real Food",
  description:
    "Realizhe Real Food - alimentação com propósito. Marmitas saudáveis, sopas funcionais e crepiocas artesanais feitas por nutricionistas.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://realizhe-app.vercel.app"),
  openGraph: {
    title: "Realizhe Real Food",
    description:
      "Planos de alimentação saudável com marmitas personalizadas e boxes semanais.",
    url: "https://realizhe-app.vercel.app",
    siteName: "Realizhe Real Food",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          poppins.variable,
          nunito.variable,
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
