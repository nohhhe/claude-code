import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    try {
      // Mock data
      const mockCartItems: CartItem[] = [
        {
          id: '1',
          productId: '1',
          name: '무선 이어폰',
          price: 89000,
          quantity: 1
        },
        {
          id: '2',
          productId: '3',
          name: '백팩',
          price: 45000,
          quantity: 2
        }
      ]
      
      setTimeout(() => {
        setCartItems(mockCartItems)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('장바구니 로드 실패:', error)
      setLoading(false)
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const proceedToCheckout = () => {
    alert('주문 기능은 곧 구현될 예정입니다!')
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 20px', textAlign: 'center' }}>
        <p>장바구니를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 style={{ marginBottom: '2rem' }}>장바구니</h1>
      
      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
            장바구니가 비어있습니다
          </p>
          <Link to="/products" className="btn">
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div>
          <div className="card">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{item.name}</h4>
                  <p style={{ color: '#666' }}>₩{item.price.toLocaleString()}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: '1px solid #ddd',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: '1px solid #ddd',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                  </div>
                  
                  <div style={{ minWidth: '100px', textAlign: 'right' }}>
                    <strong>₩{(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#dc3545',
                      cursor: 'pointer',
                      padding: '0.5rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '2px solid #007bff'
            }}>
              <h3>총 금액</h3>
              <h3 style={{ color: '#007bff' }}>
                ₩{getTotalPrice().toLocaleString()}
              </h3>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '2rem',
              justifyContent: 'flex-end'
            }}>
              <Link to="/products" className="btn" style={{ backgroundColor: '#6c757d' }}>
                쇼핑 계속하기
              </Link>
              <button 
                className="btn"
                onClick={proceedToCheckout}
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage