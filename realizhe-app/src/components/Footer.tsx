import Link from "next/link";

const footerLinks = [
  { label: "Termos de uso", href: "/termos" },
  { label: "Privacidade", href: "/privacidade" },
  { label: "Cardapio", href: "/cardapio" },
  { label: "Personalizadas", href: "/personalizadas" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:justify-between md:gap-12">
        <div className="max-w-sm space-y-4">
          <div>
            <p className="font-display text-lg font-semibold text-primary">
              Realizhe Real Food
            </p>
            <p className="text-sm text-muted-foreground">
              Alimentacao com proposito. Marmitas saudaveis, sopas funcionais e
              crepiocas pensadas por nutricionistas e chefs.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>CNPJ: 29.255.549/0001-09</p>
            <p>Rua Dr. Carlos Barbosa, 480 - Porto Alegre/RS</p>
            <p>Responsavel: Aline Chaves Guerreiro</p>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="font-display text-base font-semibold text-foreground">
            Atendimento
          </h4>
          <p>
            WhatsApp:{" "}
            <Link
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href="https://wa.me/5551982895068"
            >
              (51) 98289-5068
            </Link>
          </p>
          <p>
            Instagram:{" "}
            <Link
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href="https://instagram.com/realizherealfood"
              target="_blank"
              rel="noopener noreferrer"
            >
              @realizherealfood
            </Link>
          </p>
          <p className="text-muted-foreground">
            Atendimento de segunda a sexta das 9h as 18h.
          </p>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="font-display text-base font-semibold text-foreground">
            Navegacao rapida
          </h4>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border bg-accent/50 py-4">
        <div className="container flex flex-col items-center gap-2 text-center text-xs text-muted-foreground md:flex-row md:justify-between">
          <span>
            {new Date().getFullYear()} - Realizhe Real Food. Todos os direitos
            reservados.
          </span>
          <span>Slogan: Alimentacao com Proposito.</span>
        </div>
      </div>
    </footer>
  );
}
