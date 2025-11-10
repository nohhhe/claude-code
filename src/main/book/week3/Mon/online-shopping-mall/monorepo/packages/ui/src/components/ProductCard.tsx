import React from 'react';
import { Product } from '@monorepo/shared';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ₩{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">재고: {product.stock}개</span>
        </div>
        {onAddToCart && (
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? '품절' : '장바구니에 추가'}
          </Button>
        )}
      </div>
    </div>
  );
};