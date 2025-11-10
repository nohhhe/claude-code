import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag } from 'antd'
import { 
  UserOutlined, 
  ShoppingOutlined, 
  ShoppingCartOutlined,
  DollarOutlined 
} from '@ant-design/icons'

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    users: 1250,
    products: 45,
    orders: 328,
    revenue: 12500000
  })

  const [recentOrders, setRecentOrders] = useState([
    {
      key: '1',
      orderId: 'ORDER-001',
      customer: '김철수',
      amount: 89000,
      status: 'delivered',
      date: '2024-09-07'
    },
    {
      key: '2', 
      orderId: 'ORDER-002',
      customer: '이영희',
      amount: 250000,
      status: 'shipped',
      date: '2024-09-06'
    },
    {
      key: '3',
      orderId: 'ORDER-003', 
      customer: '박민수',
      amount: 45000,
      status: 'processing',
      date: '2024-09-05'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green'
      case 'shipped': return 'blue'
      case 'processing': return 'orange'
      case 'pending': return 'yellow'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return '배송완료'
      case 'shipped': return '배송중'
      case 'processing': return '처리중'
      case 'pending': return '대기'
      default: return status
    }
  }

  const columns = [
    {
      title: '주문번호',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '고객명',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '금액',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₩${amount.toLocaleString()}`,
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '주문일',
      dataIndex: 'date',
      key: 'date',
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="총 사용자"
              value={stats.users}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="총 상품"
              value={stats.products}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="총 주문"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="총 매출"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
              formatter={(value) => `₩${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      <Card title="최근 주문" style={{ marginBottom: 24 }}>
        <Table 
          columns={columns} 
          dataSource={recentOrders}
          pagination={false}
          size="middle"
        />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="시스템 상태" style={{ height: 300 }}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ marginBottom: '20px' }}>
                🔧 모든 서비스가 정상 동작 중입니다
              </div>
              <div style={{ color: '#52c41a', fontSize: '18px', fontWeight: 'bold' }}>
                ✅ 시스템 정상
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="알림" style={{ height: 300 }}>
            <div style={{ padding: '10px' }}>
              <div style={{ marginBottom: '15px', padding: '10px', background: '#fff7e6', borderRadius: '4px' }}>
                <div style={{ fontWeight: 'bold', color: '#faad14' }}>⚠️ 재고 부족</div>
                <div>무선 이어폰의 재고가 5개 이하입니다</div>
              </div>
              <div style={{ marginBottom: '15px', padding: '10px', background: '#f6ffed', borderRadius: '4px' }}>
                <div style={{ fontWeight: 'bold', color: '#52c41a' }}>✅ 새 주문</div>
                <div>3건의 새로운 주문이 있습니다</div>
              </div>
              <div style={{ padding: '10px', background: '#e6f7ff', borderRadius: '4px' }}>
                <div style={{ fontWeight: 'bold', color: '#1890ff' }}>📦 배송 업데이트</div>
                <div>5건의 주문이 배송 시작되었습니다</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage