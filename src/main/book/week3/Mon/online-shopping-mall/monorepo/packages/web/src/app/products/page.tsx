import { Header } from '@monorepo/ui'
import { Product } from '@monorepo/shared'

async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from your API
  return [
    { 
      id: '1', 
      name: '스마트폰', 
      price: 500000, 
      description: '최신 스마트폰',
      categoryId: 'electronics',
      stock: 10,
      imageUrl: '/placeholder-product.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: '2', 
      name: '노트북', 
      price: 1200000, 
      description: '고성능 노트북',
      categoryId: 'electronics',
      stock: 5,
      imageUrl: '/placeholder-product.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">상품 목록</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                ₩{product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">재고: {product.stock}개</p>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                장바구니에 추가
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}