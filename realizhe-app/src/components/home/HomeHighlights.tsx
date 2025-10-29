import { Leaf, Sparkles, Timer } from "lucide-react";

const highlights = [
  {
    icon: Leaf,
    title: "Ingredientes selecionados",
    description:
      "Produzimos em cozinha certificada, com fornecedores locais e rastreabilidade completa dos insumos.",
  },
  {
    icon: Timer,
    title: "Planejamento semanal rápido",
    description:
      "Escolha entre boxes prontos ou planos personalizados. Entregamos conforme a sua agenda.",
  },
  {
    icon: Sparkles,
    title: "Experiência acolhedora",
    description:
      "Cardápios assinados por nutricionistas e chefs para garantir sabor, macro e conforto em cada refeição.",
  },
];

export function HomeHighlights() {
  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="container grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-3 lg:text-left">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="card-surface h-full space-y-4 border border-primary/10 p-6 text-left"
          >
            <item.icon className="h-9 w-9 text-primary" />
            <h3 className="text-xl font-display font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
