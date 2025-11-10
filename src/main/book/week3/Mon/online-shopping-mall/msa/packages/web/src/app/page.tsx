'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@shopping-mall/ui'
import { Product } from '@shopping-mall/shared'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/product`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.slice(0, 6)) // Show first 6 products
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Online Shopping Mall
        </h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 mb-4">No products available</p>
                  <p className="text-sm text-gray-400">Make sure the backend services are running</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="text-center bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">About Our Mall</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best products at amazing prices. Our modern microservices architecture 
            ensures fast, reliable shopping experience with seamless navigation and secure checkout.
          </p>
        </section>
      </div>
    </main>
  )
}