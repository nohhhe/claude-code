export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category?: string;
  description?: string;
  inStock?: boolean;
}

export interface ProductListProps {
  products: Product[];
  filters: Array<(product: Product) => boolean>;
}

export interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
}