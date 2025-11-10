import React, { useState } from 'react';
import styles from '../styles/ModalExample.module.css';

const ModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>모달 & 오버레이 예제</h1>
        <p>다양한 모달과 오버레이 요소들의 시각적 테스트</p>
      </header>

      <main className={styles.main}>
        {/* 버튼 그룹 */}
        <section className={styles.buttonSection}>
          <h3>모달 트리거</h3>
          <div className={styles.buttonGrid}>
            <button 
              className={styles.primaryButton}
              onClick={() => setIsModalOpen(true)}
            >
              기본 모달 열기
            </button>
            
            <button 
              className={styles.warningButton}
              onClick={() => setIsConfirmModalOpen(true)}
            >
              확인 모달 열기
            </button>
            
            <button 
              className={styles.secondaryButton}
              onClick={() => setIsDrawerOpen(true)}
            >
              사이드 드로어 열기
            </button>
            
            <div className={styles.tooltipWrapper}>
              <button 
                className={styles.infoButton}
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
              >
                툴팁 버튼
              </button>
              {isTooltipVisible && (
                <div className={styles.tooltip}>
                  이것은 툴팁 메시지입니다!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 알림 버튼 */}
        <section className={styles.notificationSection}>
          <h3>알림</h3>
          <div className={styles.buttonGrid}>
            <button onClick={() => showNotification('성공 메시지입니다!')}>
              성공 알림
            </button>
            <button onClick={() => showNotification('경고 메시지입니다!')}>
              경고 알림
            </button>
            <button onClick={() => showNotification('오류가 발생했습니다!')}>
              오류 알림
            </button>
          </div>
        </section>

        {/* 다양한 상태의 카드들 */}
        <section className={styles.cardSection}>
          <h3>상태별 카드</h3>
          <div className={styles.cardGrid}>
            <div className={`${styles.card} ${styles.defaultCard}`}>
              <h4>기본 카드</h4>
              <p>일반적인 카드 상태입니다.</p>
              <button className={styles.cardButton}>액션</button>
            </div>
            
            <div className={`${styles.card} ${styles.hoverCard}`}>
              <h4>호버 카드</h4>
              <p>마우스를 올렸을 때의 상태입니다.</p>
              <button className={styles.cardButton}>액션</button>
            </div>
            
            <div className={`${styles.card} ${styles.selectedCard}`}>
              <h4>선택된 카드</h4>
              <p>선택된 상태의 카드입니다.</p>
              <button className={styles.cardButton}>액션</button>
            </div>
            
            <div className={`${styles.card} ${styles.disabledCard}`}>
              <h4>비활성화 카드</h4>
              <p>사용할 수 없는 상태입니다.</p>
              <button className={styles.cardButton} disabled>액션</button>
            </div>
          </div>
        </section>
      </main>

      {/* 기본 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>기본 모달</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>이것은 기본 모달의 내용입니다.</p>
              <p>모달 안에 다양한 컨텐츠를 넣을 수 있습니다.</p>
              
              <div className={styles.inputGroup}>
                <label>이름:</label>
                <input type="text" placeholder="이름을 입력하세요" />
              </div>
              
              <div className={styles.inputGroup}>
                <label>이메일:</label>
                <input type="email" placeholder="이메일을 입력하세요" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button className={styles.confirmButton}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {isConfirmModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsConfirmModalOpen(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>⚠️</div>
            <h3>정말로 삭제하시겠습니까?</h3>
            <p>이 작업은 되돌릴 수 없습니다.</p>
            <div className={styles.confirmButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsConfirmModalOpen(false)}
              >
                취소
              </button>
              <button 
                className={styles.deleteButton}
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  showNotification('삭제가 완료되었습니다.');
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 사이드 드로어 */}
      {isDrawerOpen && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)} />
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h3>사이드 드로어</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.drawerContent}>
              <ul className={styles.drawerMenu}>
                <li><a href="#">메뉴 1</a></li>
                <li><a href="#">메뉴 2</a></li>
                <li><a href="#">메뉴 3</a></li>
                <li><a href="#">메뉴 4</a></li>
              </ul>
              
              <div className={styles.drawerSection}>
                <h4>설정</h4>
                <div className={styles.switchGroup}>
                  <label>
                    <input type="checkbox" />
                    알림 활성화
                  </label>
                  <label>
                    <input type="checkbox" />
                    다크 모드
                  </label>
                  <label>
                    <input type="checkbox" />
                    자동 저장
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 알림 토스트 */}
      {notification && (
        <div className={styles.toast}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default ModalExample;