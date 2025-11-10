import React from 'react'
import { Product } from '@shopping-mall/shared'
import { Card } from '../Card'
import { Button } from '../Button'

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  const handleAddToCart = () => {
    onAddToCart?.(product)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-400 text-4xl">📦</div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg truncate" title={product.name}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {product.stock !== undefined && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </span>
          )}
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          variant={product.stock === 0 ? 'secondary' : 'primary'}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  )
}