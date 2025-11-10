import React, { useState } from 'react';
import styles from '../styles/Form.module.css';

const FormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    priority: 'medium',
    description: '',
    agreeToTerms: false,
    newsletter: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요.';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '이용약관에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      alert('폼이 성공적으로 제출되었습니다!');
      console.log('Form data:', formData);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>문의하기</h1>
        <p>궁금한 사항이나 요청사항을 남겨주세요.</p>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 기본 정보 섹션 */}
          <section className={styles.section}>
            <h3>기본 정보</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                이름 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="홍길동"
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                이메일 <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="example@email.com"
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                전화번호 <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="010-1234-5678"
              />
              {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>
          </section>

          {/* 문의 내용 섹션 */}
          <section className={styles.section}>
            <h3>문의 내용</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="category" className={styles.label}>
                카테고리 <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
              >
                <option value="">카테고리를 선택해주세요</option>
                <option value="general">일반 문의</option>
                <option value="technical">기술 지원</option>
                <option value="billing">결제 문의</option>
                <option value="partnership">제휴 문의</option>
                <option value="other">기타</option>
              </select>
              {errors.category && <span className={styles.errorMessage}>{errors.category}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>우선순위</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={formData.priority === 'low'}
                    onChange={handleInputChange}
                  />
                  낮음
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={formData.priority === 'medium'}
                    onChange={handleInputChange}
                  />
                  보통
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={formData.priority === 'high'}
                    onChange={handleInputChange}
                  />
                  높음
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="priority"
                    value="urgent"
                    checked={formData.priority === 'urgent'}
                    onChange={handleInputChange}
                  />
                  긴급
                </label>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description" className={styles.label}>
                상세 설명 <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="문의 내용을 상세히 작성해주세요."
                rows={5}
              />
              {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
            </div>
          </section>

          {/* 약관 동의 섹션 */}
          <section className={styles.section}>
            <h3>약관 동의</h3>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <span className={styles.checkboxText}>
                  이용약관에 동의합니다 <span className={styles.required}>*</span>
                </span>
              </label>
              {errors.agreeToTerms && <span className={styles.errorMessage}>{errors.agreeToTerms}</span>}
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                />
                <span className={styles.checkboxText}>
                  뉴스레터 구독에 동의합니다 (선택사항)
                </span>
              </label>
            </div>
          </section>

          {/* 버튼 섹션 */}
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              제출하기
            </button>
          </div>
        </form>

        {/* 사이드바 정보 */}
        <aside className={styles.sidebar}>
          <div className={styles.contactInfo}>
            <h4>빠른 연락처</h4>
            <div className={styles.contactItem}>
              <strong>전화:</strong> 02-1234-5678
            </div>
            <div className={styles.contactItem}>
              <strong>이메일:</strong> support@example.com
            </div>
            <div className={styles.contactItem}>
              <strong>운영시간:</strong> 평일 9:00-18:00
            </div>
          </div>

          <div className={styles.faqSection}>
            <h4>자주 묻는 질문</h4>
            <ul className={styles.faqList}>
              <li>배송은 얼마나 걸리나요?</li>
              <li>환불 정책이 어떻게 되나요?</li>
              <li>회원가입 혜택이 있나요?</li>
              <li>대량 구매 할인이 있나요?</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default FormPage;