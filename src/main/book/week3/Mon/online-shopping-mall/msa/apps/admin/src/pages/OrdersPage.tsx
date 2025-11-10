import React, { useState } from 'react'
import { Table, Button, Space, Tag, Input, Select, DatePicker } from 'antd'
import { SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

const OrdersPage: React.FC = () => {
  const [orders] = useState([
    {
      key: '1',
      id: 'ORDER-001',
      customer: '김철수',
      customerEmail: 'kim@example.com',
      products: ['무선 이어폰', '백팩'],
      totalAmount: 134000,
      status: 'delivered',
      paymentStatus: 'completed',
      shippingAddress: '서울시 강남구 테헤란로 123',
      orderDate: '2024-09-07',
      deliveryDate: '2024-09-09'
    },
    {
      key: '2',
      id: 'ORDER-002', 
      customer: '이영희',
      customerEmail: 'lee@example.com',
      products: ['스마트 워치'],
      totalAmount: 250000,
      status: 'shipped',
      paymentStatus: 'completed',
      shippingAddress: '부산시 해운대구 센텀로 456',
      orderDate: '2024-09-06',
      deliveryDate: null
    },
    {
      key: '3',
      id: 'ORDER-003',
      customer: '박민수', 
      customerEmail: 'park@example.com',
      products: ['텀블러', '텀블러'],
      totalAmount: 50000,
      status: 'processing',
      paymentStatus: 'completed',
      shippingAddress: '대구시 수성구 범어로 789',
      orderDate: '2024-09-05',
      deliveryDate: null
    },
    {
      key: '4',
      id: 'ORDER-004',
      customer: '최지영',
      customerEmail: 'choi@example.com', 
      products: ['무선 이어폰'],
      totalAmount: 89000,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: '인천시 연수구 송도로 321',
      orderDate: '2024-09-04',
      deliveryDate: null
    }
  ])

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'gold',
      processing: 'blue', 
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red'
    }
    return statusMap[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '주문대기',
      processing: '처리중',
      shipped: '배송중', 
      delivered: '배송완료',
      cancelled: '취소됨'
    }
    return statusMap[status] || status
  }

  const getPaymentStatusColor = (status: string) => {
    return status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'
  }

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: '결제완료',
      pending: '결제대기',
      failed: '결제실패',
      refunded: '환불완료'
    }
    return statusMap[status] || status
  }

  const columns = [
    {
      title: '주문번호',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '고객정보',
      key: 'customer',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.customer}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customerEmail}</div>
        </div>
      ),
    },
    {
      title: '상품',
      dataIndex: 'products',
      key: 'products',
      width: 200,
      render: (products: string[]) => (
        <div>
          {products.map((product, index) => (
            <div key={index} style={{ fontSize: '12px' }}>
              • {product}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '주문금액',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>
          ₩{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '주문상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '결제상태',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '주문일',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 100,
    },
    {
      title: '액션',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          >
            상세
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            수정
          </Button>
        </Space>
      ),
    },
  ]

  const handleView = (orderId: string) => {
    console.log('View order details:', orderId)
  }

  const handleEdit = (orderId: string) => {
    console.log('Edit order:', orderId)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>주문 관리</h2>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 16,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Input.Search
          placeholder="주문번호, 고객명으로 검색"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 250 }}
          onSearch={(value) => console.log('Search:', value)}
        />
        
        <Select
          placeholder="주문상태"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => console.log('Status filter:', value)}
          options={[
            { value: 'pending', label: '주문대기' },
            { value: 'processing', label: '처리중' },
            { value: 'shipped', label: '배송중' },
            { value: 'delivered', label: '배송완료' },
            { value: 'cancelled', label: '취소됨' },
          ]}
        />

        <Select
          placeholder="결제상태"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => console.log('Payment filter:', value)}
          options={[
            { value: 'completed', label: '결제완료' },
            { value: 'pending', label: '결제대기' },
            { value: 'failed', label: '결제실패' },
            { value: 'refunded', label: '환불완료' },
          ]}
        />

        <RangePicker
          placeholder={['시작일', '종료일']}
          style={{ width: 250 }}
          onChange={(dates) => console.log('Date range:', dates)}
        />
      </div>

      <Table 
        columns={columns}
        dataSource={orders}
        pagination={{
          total: orders.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  )
}

export default OrdersPage