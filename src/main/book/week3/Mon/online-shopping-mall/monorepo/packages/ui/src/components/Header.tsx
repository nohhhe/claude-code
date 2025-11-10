import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            온라인 쇼핑몰
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-200">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-200">
                  상품
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-blue-200">
                  장바구니
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-200">
                  주문
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};