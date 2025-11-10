import React, { useMemo, useCallback, memo, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

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

// ProductCard를 메모이제이션하여 불필요한 재렌더링 방지
const ProductCard = memo<{
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
}>(({ product, isSelected, onSelect }) => {
  // useCallback으로 함수 메모이제이션
  const handleClick = useCallback(() => {
    onSelect(product.id);
  }, [product.id, onSelect]);

  // 비싼 계산을 useMemo로 메모이제이션
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(product.price);
  }, [product.price]);

  const discountedPrice = useMemo(() => {
    const discounted = product.price * 0.9;
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(discounted);
  }, [product.price]);

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"         // 지연 로딩으로 초기 로드 성능 향상
        decoding="async"       // 비동기 디코딩으로 메인 스레드 차단 방지
      />
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
      <p>할인가: {discountedPrice}</p>
      <div>평점: {product.rating}</div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

function ProductList({ products, filters }: ProductListProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // 필터링과 정렬을 useMemo로 메모이제이션하여 불필요한 재계산 방지
  const processedProducts = useMemo(() => {
    console.time('Processing products');
    const filtered = products.filter(product =>
      filters.every(filter => filter(product))
    );
    // 원본 배열 수정을 방지하기 위해 복사본 생성
    const sorted = [...filtered].sort((a, b) => b.rating - a.rating);
    console.timeEnd('Processing products');
    return sorted;
  }, [products, filters]);

  // 선택 핸들러를 useCallback으로 메모이제이션
  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  // 가상화된 리스트 아이템 렌더러를 useCallback으로 메모이제이션
  const Row = useCallback(({ index, style }: { 
    index: number; 
    style: React.CSSProperties 
  }) => {
    const product = processedProducts[index];
    return (
      <div style={style}>
        <ProductCard
          product={product}
          isSelected={selectedProducts.has(product.id)}
          onSelect={handleSelectProduct}
        />
      </div>
    );
  }, [processedProducts, selectedProducts, handleSelectProduct]);

  // 데이터가 없을 때 처리
  if (processedProducts.length === 0) {
    return <div className="no-products">상품이 없습니다</div>;
  }

  // react-window을 사용한 가상화로 대용량 데이터 성능 최적화
  return (
    <div className="product-list-container" style={{ height: '100vh' }}>
      <h2>상품 목록 ({processedProducts.length}개)</h2>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - 60} // 헤더 높이만큼 빼기
            itemCount={processedProducts.length}
            itemSize={200} // 각 아이템의 높이
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

// 메인 컴포넌트도 memo로 감싸서 props 변경 시에만 재렌더링
export default memo(ProductList);