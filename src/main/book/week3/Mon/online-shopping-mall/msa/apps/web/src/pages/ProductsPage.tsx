import React, { useEffect, useState } from 'react'
import { apiClient } from '../services/api'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      // Mock data since backend doesn't have real product endpoints yet
      const mockProducts: Product[] = [
        {
          id: '1',
          name: '무선 이어폰',
          price: 89000,
          description: '고음질 무선 이어폰입니다.',
          category: '전자제품'
        },
        {
          id: '2', 
          name: '스마트 워치',
          price: 250000,
          description: '건강 관리와 알림 기능이 있는 스마트 워치입니다.',
          category: '전자제품'
        },
        {
          id: '3',
          name: '백팩',
          price: 45000,
          description: '튼튼하고 실용적인 백팩입니다.',
          category: '패션'
        },
        {
          id: '4',
          name: '텀블러',
          price: 25000,
          description: '보온보냉이 뛰어난 스테인리스 텀블러입니다.',
          category: '생활용품'
        }
      ]
      
      setTimeout(() => {
        setProducts(mockProducts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('상품 로드 실패:', error)
      setLoading(false)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      // Mock cart functionality
      alert('장바구니에 추가되었습니다!')
    } catch (error) {
      console.error('장바구니 추가 실패:', error)
      alert('장바구니 추가에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 20px', textAlign: 'center' }}>
        <p>상품을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 style={{ marginBottom: '2rem' }}>상품 목록</h1>
      
      <div className="grid grid-2">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div style={{ 
              width: '100%', 
              height: '200px', 
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              📦 상품 이미지
            </div>
            
            <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              {product.description}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '0.9rem', color: '#888' }}>
                {product.category}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
                ₩{product.price.toLocaleString()}
              </span>
            </div>
            
            <button 
              className="btn" 
              onClick={() => addToCart(product.id)}
              style={{ width: '100%' }}
            >
              장바구니 담기
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage