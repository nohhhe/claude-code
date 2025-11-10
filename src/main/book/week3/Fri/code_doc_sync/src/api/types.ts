/**
 * @fileoverview API 서비스에서 사용되는 타입 정의
 * @module types
 */

/**
 * 결제 방법 유형
 */
export type PaymentType = 'card' | 'bank' | 'wallet' | 'crypto';

/**
 * 결제 상태
 */
export type PaymentState = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * 주문 상태
 */
export type OrderStatus = 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

/**
 * 사용자 역할
 */
export type UserRole = 'admin' | 'user' | 'manager' | 'guest';

/**
 * 결제 수단 정보
 * 
 * @example
 * ```typescript
 * const cardPayment: PaymentMethod = {
 *   type: 'card',
 *   cardNumber: '4242424242424242',
 *   expiryMonth: 12,
 *   expiryYear: 2025,
 *   cvv: '123'
 * };
 * ```
 */
export interface PaymentMethod {
  /** 결제 방법 유형 */
  type: PaymentType;
  /** 카드 번호 (카드 결제 시 필수) */
  cardNumber?: string;
  /** 카드 만료 월 (카드 결제 시 필수) */
  expiryMonth?: number;
  /** 카드 만료 연도 (카드 결제 시 필수) */
  expiryYear?: number;
  /** CVV 번호 (카드 결제 시 필수) */
  cvv?: string;
  /** 은행 계좌 정보 (계좌 이체 시 필수) */
  bankAccount?: string;
  /** 전자지갑 ID (전자지갑 결제 시 필수) */
  walletId?: string;
}

/**
 * 결제 처리 결과
 * 
 * @example
 * ```typescript
 * const paymentResult: PaymentResult = {
 *   success: true,
 *   transactionId: 'TXN123456789',
 *   amount: 25000,
 *   currency: 'KRW',
 *   processedAt: new Date()
 * };
 * ```
 */
export interface PaymentResult {
  /** 결제 성공 여부 */
  success: boolean;
  /** 트랜잭션 ID */
  transactionId: string;
  /** 결제 금액 */
  amount: number;
  /** 통화 코드 */
  currency: string;
  /** 결제 처리 시각 */
  processedAt: Date;
  /** 에러 메시지 (실패 시) */
  errorMessage?: string;
}

/**
 * 환불 처리 결과
 * 
 * @example
 * ```typescript
 * const refundResult: RefundResult = {
 *   success: true,
 *   refundId: 'REF123456789',
 *   originalPaymentId: 'PAY123456789',
 *   refundAmount: 10000,
 *   processedAt: new Date()
 * };
 * ```
 */
export interface RefundResult {
  /** 환불 성공 여부 */
  success: boolean;
  /** 환불 ID */
  refundId: string;
  /** 원본 결제 ID */
  originalPaymentId: string;
  /** 환불 금액 */
  refundAmount: number;
  /** 환불 처리 시각 */
  processedAt: Date;
  /** 에러 메시지 (실패 시) */
  errorMessage?: string;
}

/**
 * 결제 상태 정보
 * 
 * @example
 * ```typescript
 * const paymentStatus: PaymentStatus = {
 *   paymentId: 'PAY123456789',
 *   state: 'completed',
 *   amount: 25000,
 *   currency: 'KRW',
 *   createdAt: new Date('2023-01-01T00:00:00Z'),
 *   completedAt: new Date('2023-01-01T00:05:00Z')
 * };
 * ```
 */
export interface PaymentStatus {
  /** 결제 ID */
  paymentId: string;
  /** 현재 상태 */
  state: PaymentState;
  /** 결제 금액 */
  amount: number;
  /** 통화 코드 */
  currency: string;
  /** 결제 생성 시각 */
  createdAt: Date;
  /** 결제 완료 시각 (완료된 경우) */
  completedAt?: Date;
  /** 실패 사유 (실패한 경우) */
  failureReason?: string;
}

/**
 * 주문 정보
 * 
 * @example
 * ```typescript
 * const order: Order = {
 *   orderId: 'ORDER123456789',
 *   userId: 'USER001',
 *   items: [
 *     { productId: 'PROD001', name: 'Product 1', quantity: 2, price: 10000 }
 *   ],
 *   totalAmount: 20000,
 *   status: 'created',
 *   createdAt: new Date()
 * };
 * ```
 */
export interface Order {
  /** 주문 ID */
  orderId: string;
  /** 사용자 ID */
  userId: string;
  /** 주문 상품 목록 */
  items: OrderItem[];
  /** 총 주문 금액 */
  totalAmount: number;
  /** 주문 상태 */
  status: OrderStatus;
  /** 주문 생성 시각 */
  createdAt: Date;
  /** 주문 업데이트 시각 */
  updatedAt?: Date;
}

/**
 * 주문 상품 정보
 */
export interface OrderItem {
  /** 상품 ID */
  productId: string;
  /** 상품명 */
  name: string;
  /** 수량 */
  quantity: number;
  /** 단가 */
  price: number;
}

/**
 * 사용자 정보
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   userId: 'USER001',
 *   email: 'user@example.com',
 *   name: '김철수',
 *   role: 'user',
 *   createdAt: new Date(),
 *   isActive: true
 * };
 * ```
 */
export interface User {
  /** 사용자 ID */
  userId: string;
  /** 이메일 */
  email: string;
  /** 사용자명 */
  name: string;
  /** 사용자 역할 */
  role: UserRole;
  /** 생성 시각 */
  createdAt: Date;
  /** 활성 상태 */
  isActive: boolean;
  /** 마지막 로그인 시각 */
  lastLoginAt?: Date;
  /** 수정 시각 */
  updatedAt?: Date;
}

/**
 * API 응답 기본 형태
 * 
 * @template T 응답 데이터의 타입
 * 
 * @example
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: {
 *     userId: 'USER001',
 *     email: 'user@example.com',
 *     name: '김철수',
 *     role: 'user',
 *     createdAt: new Date(),
 *     isActive: true
 *   },
 *   timestamp: new Date()
 * };
 * ```
 */
export interface ApiResponse<T> {
  /** 요청 성공 여부 */
  success: boolean;
  /** 응답 데이터 */
  data?: T;
  /** 에러 메시지 (실패 시) */
  error?: string;
  /** 에러 코드 (실패 시) */
  errorCode?: string;
  /** 응답 시각 */
  timestamp: Date;
}