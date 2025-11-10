import { Header } from '@monorepo/ui'

export default function CartPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">장바구니</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-center">장바구니가 비어있습니다.</p>
        </div>
      </div>
    </>
  )
}