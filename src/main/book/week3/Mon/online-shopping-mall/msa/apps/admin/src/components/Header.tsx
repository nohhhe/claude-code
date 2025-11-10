import React from 'react'
import { Layout, Button, Space, Badge } from 'antd'
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const handleLogout = () => {
    console.log('로그아웃')
  }

  return (
    <AntHeader style={{ 
      padding: '0 24px', 
      background: '#fff', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div>
        <h2 style={{ margin: 0 }}>온라인 쇼핑몰 관리자</h2>
      </div>
      
      <Space>
        <Badge count={3}>
          <Button type="text" icon={<BellOutlined />} />
        </Badge>
        
        <Button type="text" icon={<UserOutlined />}>
          관리자
        </Button>
        
        <Button 
          type="text" 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </Space>
    </AntHeader>
  )
}

export default Header