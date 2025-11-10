import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}

interface ProductListProps {
  products: Product[];
  filters: Array<(product: Product) => boolean>;
}

// 메모이제이션되지 않은 ProductCard - 매번 재렌더링됨
const ProductCard: React.FC<{
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ product, isSelected, onSelect }) => {
  // 매번 새로운 함수 생성 - 성능 저하 요인
  const handleClick = () => {
    onSelect(product.id);
  };

  // 불필요한 계산이 매번 실행됨
  const discountedPrice = product.price * 0.9;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <img
        src={product.image}
        alt={product.name}
        // lazy loading이나 최적화 속성이 없음
      />
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
      <p>할인가: {formatPrice(discountedPrice)}</p>
      <div>평점: {product.rating}</div>
    </div>
  );
};

// 메모이제이션되지 않은 메인 컴포넌트
function ProductList({ products, filters }: ProductListProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // 매 렌더링마다 필터링과 정렬 연산이 실행됨 - 성능 저하
  console.time('Processing products');
  const filteredProducts = products.filter(product =>
    filters.every(filter => filter(product))
  );
  
  // 원본 배열을 직접 수정하는 위험한 코드
  const sortedProducts = filteredProducts.sort((a, b) => b.rating - a.rating);
  console.timeEnd('Processing products');

  // 매번 새로운 함수 생성
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // 불필요한 useEffect - 의존성 배열이 너무 자주 변경됨
  useEffect(() => {
    console.log('Products updated:', sortedProducts.length);
  }, [sortedProducts]); // sortedProducts는 매번 새로운 배열이므로 매번 실행

  // 데이터가 없을 때의 처리
  if (sortedProducts.length === 0) {
    return <div className="no-products">상품이 없습니다</div>;
  }

  // 가상화 없이 모든 아이템을 직접 렌더링 - 대용량 데이터에서 성능 문제
  return (
    <div className="product-list-container">
      <h2>상품 목록 ({sortedProducts.length}개)</h2>
      <div className="product-grid">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.has(product.id)}
            onSelect={handleSelectProduct}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;