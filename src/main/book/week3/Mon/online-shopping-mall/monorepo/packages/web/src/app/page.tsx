import { Header } from '@monorepo/ui'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          온라인 쇼핑몰에 오신 것을 환영합니다
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">상품 둘러보기</h2>
            <p className="text-gray-600 mb-4">다양한 상품을 확인해보세요</p>
            <Link 
              href="/products" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              상품 보기
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">장바구니</h2>
            <p className="text-gray-600 mb-4">선택한 상품을 확인하세요</p>
            <Link 
              href="/cart" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              장바구니 보기
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">주문 관리</h2>
            <p className="text-gray-600 mb-4">주문 내역을 관리하세요</p>
            <Link 
              href="/orders" 
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              주문 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}