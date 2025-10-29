export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePath?: string | null;
  category: string | null;
  highlights: string[];
  isActive: boolean;
};
