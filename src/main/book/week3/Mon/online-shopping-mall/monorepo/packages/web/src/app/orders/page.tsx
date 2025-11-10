import { Header } from '@monorepo/ui'

export default function OrdersPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">주문 내역</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-center">주문 내역이 없습니다.</p>
        </div>
      </div>
    </>
  )
}