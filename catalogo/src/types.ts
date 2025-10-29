export type ProductRow = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  imagem_path: string | null;
  categoria: string | null;
  destaques: string[] | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string | null;
  highlights: string[];
};
