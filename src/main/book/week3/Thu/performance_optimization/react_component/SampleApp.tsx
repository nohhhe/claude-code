import React, { useState, useMemo } from 'react';
import ProductListBefore from './ProductListBefore';
import ProductListAfter from './ProductListAfter';
import { Product } from './types';
import './styles.css';

// 샘플 데이터 생성
const generateSampleProducts = (count: number): Product[] => {
  const categories = ['전자제품', '의류', '가구', '도서', '스포츠'];
  const products: Product[] = [];

  for (let i = 1; i <= count; i++) {
    products.push({
      id: `product-${i}`,
      name: `상품 ${i}`,
      price: Math.floor(Math.random() * 100000) + 10000,
      rating: Math.floor(Math.random() * 50) / 10,
      image: `https://via.placeholder.com/300x200?text=Product+${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      inStock: Math.random() > 0.1,
    });
  }

  return products;
};

function SampleApp() {
  const [showOptimized, setShowOptimized] = useState(false);
  const [productCount, setProductCount] = useState(1000);
  const [minPrice, setMinPrice] = useState(0);
  const [minRating, setMinRating] = useState(0);

  // 대용량 샘플 데이터
  const products = useMemo(() => generateSampleProducts(productCount), [productCount]);

  // 필터 함수들
  const filters = useMemo(() => [
    (product: Product) => product.price >= minPrice,
    (product: Product) => product.rating >= minRating,
    (product: Product) => product.inStock !== false,
  ], [minPrice, minRating]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h1>React 컴포넌트 성능 최적화 예제</h1>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowOptimized(!showOptimized)}
            style={{
              padding: '10px 20px',
              backgroundColor: showOptimized ? '#28a745' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showOptimized ? '최적화된 버전' : '최적화 전 버전'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>상품 개수:</label>
            <select
              value={productCount}
              onChange={(e) => setProductCount(Number(e.target.value))}
              style={{ padding: '5px' }}
            >
              <option value={100}>100개</option>
              <option value={500}>500개</option>
              <option value={1000}>1,000개</option>
              <option value={5000}>5,000개</option>
              <option value={10000}>10,000개</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>최소 가격:</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              style={{ padding: '5px', width: '100px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>최소 평점:</label>
            <input
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              step="0.1"
              max="5"
              min="0"
              style={{ padding: '5px', width: '100px' }}
            />
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>성능 차이를 확인하는 방법:</strong></p>
          <ul>
            <li>브라우저 개발자 도구의 Performance 탭을 사용해보세요</li>
            <li>콘솔에서 "Processing products" 시간을 비교해보세요</li>
            <li>상품 개수를 늘려가며 성능 차이를 체험해보세요</li>
            <li>필터 값을 변경할 때의 반응 속도를 비교해보세요</li>
          </ul>
        </div>
      </div>

      {showOptimized ? (
        <ProductListAfter products={products} filters={filters} />
      ) : (
        <ProductListBefore products={products} filters={filters} />
      )}
    </div>
  );
}

export default SampleApp;