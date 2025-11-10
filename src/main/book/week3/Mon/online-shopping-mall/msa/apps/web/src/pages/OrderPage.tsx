import React, { useState, useEffect } from 'react'

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  totalAmount: number
  items: {
    productName: string
    quantity: number
    price: number
  }[]
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      // Mock data
      const mockOrders: Order[] = [
        {
          id: 'ORDER-001',
          date: '2024-09-07',
          status: 'delivered',
          totalAmount: 134000,
          items: [
            { productName: '무선 이어폰', quantity: 1, price: 89000 },
            { productName: '백팩', quantity: 1, price: 45000 }
          ]
        },
        {
          id: 'ORDER-002',
          date: '2024-09-06',
          status: 'shipped',
          totalAmount: 250000,
          items: [
            { productName: '스마트 워치', quantity: 1, price: 250000 }
          ]
        },
        {
          id: 'ORDER-003',
          date: '2024-09-05',
          status: 'processing',
          totalAmount: 50000,
          items: [
            { productName: '텀블러', quantity: 2, price: 25000 }
          ]
        }
      ]
      
      setTimeout(() => {
        setOrders(mockOrders)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('주문 내역 로드 실패:', error)
      setLoading(false)
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return { text: '주문 대기', color: '#ffc107' }
      case 'processing': return { text: '처리 중', color: '#17a2b8' }
      case 'shipped': return { text: '배송 중', color: '#007bff' }
      case 'delivered': return { text: '배송 완료', color: '#28a745' }
      default: return { text: '알 수 없음', color: '#6c757d' }
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 20px', textAlign: 'center' }}>
        <p>주문 내역을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 style={{ marginBottom: '2rem' }}>주문 내역</h1>
      
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem' }}>주문 내역이 없습니다</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            const statusInfo = getStatusText(order.status)
            return (
              <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <h3>주문번호: {order.id}</h3>
                    <p style={{ color: '#666', margin: '0.5rem 0' }}>
                      주문일: {new Date(order.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      background: statusInfo.color,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      {statusInfo.text}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      ₩{order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>주문 상품</h4>
                  {order.items.map((item, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: index < order.items.length - 1 ? '1px solid #f5f5f5' : 'none'
                      }}
                    >
                      <div>
                        <span>{item.productName}</span>
                        <span style={{ color: '#666', marginLeft: '1rem' }}>
                          x{item.quantity}
                        </span>
                      </div>
                      <div>
                        ₩{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '1rem',
                  justifyContent: 'flex-end'
                }}>
                  {order.status === 'shipped' && (
                    <button 
                      className="btn" 
                      style={{ backgroundColor: '#17a2b8' }}
                      onClick={() => alert('배송 조회 기능은 곧 구현될 예정입니다!')}
                    >
                      배송 조회
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button 
                      className="btn" 
                      style={{ backgroundColor: '#28a745' }}
                      onClick={() => alert('리뷰 작성 기능은 곧 구현될 예정입니다!')}
                    >
                      리뷰 작성
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderPage