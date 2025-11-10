import React, { useState } from 'react'
import { Table, Button, Space, Tag, Input } from 'antd'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'

const UsersPage: React.FC = () => {
  const [users] = useState([
    {
      key: '1',
      id: 'U001',
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      status: 'active',
      joinDate: '2024-01-15',
      orderCount: 5
    },
    {
      key: '2',
      id: 'U002', 
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      status: 'active',
      joinDate: '2024-02-20',
      orderCount: 12
    },
    {
      key: '3',
      id: 'U003',
      name: '박민수',
      email: 'park@example.com', 
      phone: '010-3456-7890',
      status: 'inactive',
      joinDate: '2024-03-10',
      orderCount: 2
    },
    {
      key: '4',
      id: 'U004',
      name: '최지영',
      email: 'choi@example.com',
      phone: '010-4567-8901', 
      status: 'active',
      joinDate: '2024-04-05',
      orderCount: 8
    }
  ])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '전화번호',
      dataIndex: 'phone', 
      key: 'phone',
      width: 140,
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '활성' : '비활성'}
        </Tag>
      ),
    },
    {
      title: '가입일',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
    },
    {
      title: '주문수',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 80,
      render: (count: number) => <span style={{ fontWeight: 'bold' }}>{count}</span>,
    },
    {
      title: '액션',
      key: 'action',
      width: 150,
      render: (_, record: any) => (
        <Space size="small">
          <Button size="small" onClick={() => handleEdit(record.id)}>
            수정
          </Button>
          <Button 
            size="small" 
            danger
            onClick={() => handleToggleStatus(record.id)}
          >
            {record.status === 'active' ? '비활성화' : '활성화'}
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (userId: string) => {
    console.log('Edit user:', userId)
  }

  const handleToggleStatus = (userId: string) => {
    console.log('Toggle status for user:', userId)
  }

  const handleAddUser = () => {
    console.log('Add new user')
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h2>사용자 관리</h2>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />}
          onClick={handleAddUser}
        >
          사용자 추가
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="이름, 이메일, 전화번호로 검색"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
          onSearch={(value) => console.log('Search:', value)}
        />
      </div>

      <Table 
        columns={columns}
        dataSource={users}
        pagination={{
          total: users.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  )
}

export default UsersPage