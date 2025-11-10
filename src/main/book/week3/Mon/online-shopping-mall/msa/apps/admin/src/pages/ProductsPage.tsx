import React, { useState } from 'react'
import { Table, Button, Space, Tag, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const ProductsPage: React.FC = () => {
  const [products] = useState([
    {
      key: '1',
      id: 'P001',
      name: '무선 이어폰',
      category: '전자제품',
      price: 89000,
      stock: 25,
      status: 'active',
      createdAt: '2024-08-01'
    },
    {
      key: '2',
      id: 'P002',
      name: '스마트 워치',
      category: '전자제품', 
      price: 250000,
      stock: 15,
      status: 'active',
      createdAt: '2024-08-05'
    },
    {
      key: '3',
      id: 'P003',
      name: '백팩',
      category: '패션',
      price: 45000,
      stock: 3,
      status: 'low_stock',
      createdAt: '2024-08-10'
    },
    {
      key: '4',
      id: 'P004',
      name: '텀블러',
      category: '생활용품',
      price: 25000,
      stock: 0,
      status: 'out_of_stock',
      createdAt: '2024-08-15'
    }
  ])

  const columns = [
    {
      title: '상품 ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '상품명',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: '가격',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `₩${price.toLocaleString()}`,
    },
    {
      title: '재고',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock: number) => (
        <span style={{ 
          color: stock === 0 ? 'red' : stock < 10 ? 'orange' : 'green',
          fontWeight: 'bold'
        }}>
          {stock}
        </span>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '판매중' },
          low_stock: { color: 'orange', text: '재고부족' },
          out_of_stock: { color: 'red', text: '품절' },
          inactive: { color: 'gray', text: '판매중단' }
        }
        const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '등록일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '액션',
      key: 'action',
      width: 150,
      render: (_, record: any) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            수정
          </Button>
          <Button 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (productId: string) => {
    console.log('Edit product:', productId)
  }

  const handleDelete = (productId: string) => {
    console.log('Delete product:', productId)
  }

  const handleAddProduct = () => {
    console.log('Add new product')
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h2>상품 관리</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
        >
          상품 추가
        </Button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 16,
        alignItems: 'center'
      }}>
        <Input.Search
          placeholder="상품명, 상품 ID로 검색"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
          onSearch={(value) => console.log('Search:', value)}
        />
        
        <Select
          placeholder="카테고리 선택"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => console.log('Category filter:', value)}
          options={[
            { value: '전자제품', label: '전자제품' },
            { value: '패션', label: '패션' },
            { value: '생활용품', label: '생활용품' },
          ]}
        />

        <Select
          placeholder="상태 선택"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => console.log('Status filter:', value)}
          options={[
            { value: 'active', label: '판매중' },
            { value: 'low_stock', label: '재고부족' },
            { value: 'out_of_stock', label: '품절' },
            { value: 'inactive', label: '판매중단' },
          ]}
        />
      </div>

      <Table 
        columns={columns}
        dataSource={products}
        pagination={{
          total: products.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  )
}

export default ProductsPage