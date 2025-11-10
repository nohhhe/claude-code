import React from 'react';
import styles from '../styles/ProductList.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const products: Product[] = [
  { id: 1, name: "스마트폰", price: 899000, image: "/api/placeholder/200/200", description: "최신 기술이 적용된 스마트폰", category: "전자제품" },
  { id: 2, name: "노트북", price: 1299000, image: "/api/placeholder/200/200", description: "고성능 게이밍 노트북", category: "전자제품" },
  { id: 3, name: "헤드폰", price: 199000, image: "/api/placeholder/200/200", description: "노이즈 캔슬링 헤드폰", category: "오디오" },
  { id: 4, name: "키보드", price: 129000, image: "/api/placeholder/200/200", description: "기계식 게이밍 키보드", category: "액세서리" },
  { id: 5, name: "마우스", price: 79000, image: "/api/placeholder/200/200", description: "무선 게이밍 마우스", category: "액세서리" },
  { id: 6, name: "모니터", price: 399000, image: "/api/placeholder/200/200", description: "4K UHD 모니터", category: "전자제품" }
];

const ProductList: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>상품 목록</h1>
        <div className={styles.filters}>
          <select className={styles.categoryFilter}>
            <option value="">모든 카테고리</option>
            <option value="전자제품">전자제품</option>
            <option value="오디오">오디오</option>
            <option value="액세서리">액세서리</option>
          </select>
          <input 
            type="text" 
            placeholder="상품 검색..." 
            className={styles.searchInput}
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.productGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <div className={styles.placeholder}>
                  {product.name[0]}
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productMeta}>
                  <span className={styles.category}>{product.category}</span>
                  <span className={styles.price}>₩{product.price.toLocaleString()}</span>
                </div>
                <button className={styles.addToCartBtn}>장바구니 담기</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className={styles.sidebar}>
        <div className={styles.priceRange}>
          <h4>가격 범위</h4>
          <input type="range" min="0" max="2000000" className={styles.priceSlider} />
          <div className={styles.priceLabels}>
            <span>₩0</span>
            <span>₩2,000,000</span>
          </div>
        </div>
        
        <div className={styles.quickActions}>
          <h4>빠른 작업</h4>
          <button className={styles.actionBtn}>전체 선택</button>
          <button className={styles.actionBtn}>비교하기</button>
          <button className={styles.actionBtn}>위시리스트</button>
        </div>
      </aside>
    </div>
  );
};

export default ProductList;