import React from 'react';
import styles from '../styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  const data = {
    sales: [
      { month: '1월', value: 1200000 },
      { month: '2월', value: 1500000 },
      { month: '3월', value: 1800000 },
      { month: '4월', value: 1650000 },
      { month: '5월', value: 2100000 },
      { month: '6월', value: 2400000 }
    ],
    metrics: {
      totalSales: 12650000,
      totalOrders: 342,
      avgOrderValue: 37000,
      newCustomers: 89
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>대시보드</h1>
        <div className={styles.dateRange}>
          <input type="date" className={styles.dateInput} defaultValue="2024-01-01" />
          <span>~</span>
          <input type="date" className={styles.dateInput} defaultValue="2024-06-30" />
        </div>
      </header>

      <main className={styles.main}>
        {/* 주요 지표 */}
        <section className={styles.metricsSection}>
          <div className={styles.metricCard}>
            <h3>총 매출</h3>
            <div className={styles.metricValue}>₩{data.metrics.totalSales.toLocaleString()}</div>
            <div className={styles.metricChange}>+12.5%</div>
          </div>
          <div className={styles.metricCard}>
            <h3>총 주문</h3>
            <div className={styles.metricValue}>{data.metrics.totalOrders}건</div>
            <div className={styles.metricChange}>+8.2%</div>
          </div>
          <div className={styles.metricCard}>
            <h3>평균 주문액</h3>
            <div className={styles.metricValue}>₩{data.metrics.avgOrderValue.toLocaleString()}</div>
            <div className={styles.metricChange}>+3.7%</div>
          </div>
          <div className={styles.metricCard}>
            <h3>신규 고객</h3>
            <div className={styles.metricValue}>{data.metrics.newCustomers}명</div>
            <div className={styles.metricChange}>+15.3%</div>
          </div>
        </section>

        {/* 차트 섹션 */}
        <section className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <h3>월별 매출 추이</h3>
            <div className={styles.barChart}>
              {data.sales.map((item, index) => (
                <div key={index} className={styles.bar}>
                  <div 
                    className={styles.barFill} 
                    style={{ height: `${(item.value / 2400000) * 100}%` }}
                  ></div>
                  <span className={styles.barLabel}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3>카테고리별 판매량</h3>
            <div className={styles.pieChart}>
              <div className={styles.pieSlice} style={{"--percentage": "35"} as React.CSSProperties}>
                <span>전자제품 35%</span>
              </div>
              <div className={styles.pieSlice} style={{"--percentage": "25"} as React.CSSProperties}>
                <span>의류 25%</span>
              </div>
              <div className={styles.pieSlice} style={{"--percentage": "20"} as React.CSSProperties}>
                <span>도서 20%</span>
              </div>
              <div className={styles.pieSlice} style={{"--percentage": "20"} as React.CSSProperties}>
                <span>기타 20%</span>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 활동 */}
        <section className={styles.activitySection}>
          <h3>최근 활동</h3>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>📦</div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>새 주문이 접수되었습니다</div>
                <div className={styles.activityTime}>5분 전</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>👤</div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>신규 고객이 가입했습니다</div>
                <div className={styles.activityTime}>1시간 전</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>💳</div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>결제가 완료되었습니다</div>
                <div className={styles.activityTime}>2시간 전</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>📊</div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>월간 리포트가 생성되었습니다</div>
                <div className={styles.activityTime}>1일 전</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;