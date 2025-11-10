import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            🛒 온라인 쇼핑몰
          </Link>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/products">상품</Link></li>
            <li><Link to="/cart">장바구니</Link></li>
            <li><Link to="/orders">주문내역</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header