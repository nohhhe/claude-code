import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import ThemeToggle from '../components/ThemeToggle';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Visual Regression Test Demo</h1>
            <p className={styles.subtitle}>Percy와 Chromatic을 사용한 시각적 회귀 테스트 예제</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/product-list" className={styles.card}>
            <h3>상품 목록 페이지</h3>
            <p>다양한 상품들을 확인할 수 있는 페이지입니다.</p>
          </Link>

          <Link href="/dashboard" className={styles.card}>
            <h3>대시보드</h3>
            <p>데이터 차트와 그래프가 포함된 대시보드 페이지입니다.</p>
          </Link>

          <Link href="/form" className={styles.card}>
            <h3>폼 페이지</h3>
            <p>다양한 입력 요소가 포함된 폼 페이지입니다.</p>
          </Link>

          <Link href="/modal-example" className={styles.card}>
            <h3>모달 예제</h3>
            <p>모달과 오버레이 요소들의 시각적 테스트 페이지입니다.</p>
          </Link>
        </div>

        <section className={styles.features}>
          <h2>테스트 기능</h2>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <h4>Percy 테스트</h4>
              <p>Playwright와 연동된 자동 스크린샷 비교</p>
            </div>
            <div className={styles.feature}>
              <h4>Chromatic 테스트</h4>
              <p>Storybook 기반 컴포넌트 시각적 테스트</p>
            </div>
            <div className={styles.feature}>
              <h4>반응형 테스트</h4>
              <p>다양한 화면 크기에서의 시각적 일관성 검증</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Visual Regression Testing Example - 2024</p>
      </footer>
    </div>
  );
};

export default Home;