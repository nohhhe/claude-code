import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../services/api'

interface Service {
  name: string
  status: string
  port: number
}

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkServices()
  }, [])

  const checkServices = async () => {
    const serviceList = [
      { name: 'User Service', port: 3001 },
      { name: 'Product Service', port: 3002 },
      { name: 'Order Service', port: 3003 },
      { name: 'Payment Service', port: 3004 },
      { name: 'Shipping Service', port: 3005 },
      { name: 'Cart Service', port: 3006 },
      { name: 'Review Service', port: 3007 },
      { name: 'Notification Service', port: 3008 },
    ]

    const results = await Promise.allSettled(
      serviceList.map(async (service) => {
        try {
          const response = await fetch(`http://localhost:${service.port}/health`)
          const data = await response.json()
          return { ...service, status: data.status || 'Unknown' }
        } catch (error) {
          return { ...service, status: 'Offline' }
        }
      })
    )

    const serviceStatuses = results.map((result, index) => 
      result.status === 'fulfilled' ? result.value : { ...serviceList[index], status: 'Error' }
    )

    setServices(serviceStatuses)
    setLoading(false)
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          온라인 쇼핑몰에 오신 것을 환영합니다! 🎉
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          최고의 상품을 합리적인 가격에 만나보세요
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>🛍️ 상품 둘러보기</h3>
          <p>다양한 카테고리의 상품을 확인해보세요</p>
          <Link to="/products" className="btn" style={{ marginTop: '1rem' }}>
            상품 보기
          </Link>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3>📦 주문 관리</h3>
          <p>주문 내역과 배송 상태를 확인하세요</p>
          <Link to="/orders" className="btn" style={{ marginTop: '1rem' }}>
            주문 내역
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>🔧 시스템 상태</h3>
        {loading ? (
          <p>서비스 상태를 확인하는 중...</p>
        ) : (
          <div className="grid grid-3">
            {services.map((service) => (
              <div 
                key={service.name} 
                style={{ 
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{service.name}</div>
                <div style={{ 
                  color: service.status === 'OK' ? 'green' : 'red',
                  marginTop: '0.5rem'
                }}>
                  {service.status === 'OK' ? '✅ 정상' : '❌ 오프라인'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Port: {service.port}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage