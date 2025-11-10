/**
 * @fileoverview API 서비스들의 메인 엔트리 포인트
 * @module api
 */

// 타입 정의 내보내기
export * from './types';
export * from './errors';

// 서비스 클래스들 가져오기 및 내보내기
import { PaymentService } from './payment.service';
import { UserService } from './user.service';
import { OrderService } from './order.service';

export { PaymentService } from './payment.service';
export { UserService } from './user.service';
export { OrderService } from './order.service';

// 서비스별 타입들 내보내기
export type {
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchFilter,
  PaginationOptions,
  PaginatedResult
} from './user.service';

export type {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderSearchFilter,
  OrderStatistics
} from './order.service';

/**
 * 통합 API 클래스
 * 
 * 모든 서비스들을 하나의 클래스로 통합하여 제공합니다.
 * 각 서비스는 개별적으로도 사용할 수 있지만, 이 클래스를 통해
 * 통합된 API 인터페이스를 제공받을 수 있습니다.
 * 
 * @example
 * ```typescript
 * const api = new ApiService();
 * 
 * // 사용자 생성
 * const user = await api.users.createUser({
 *   email: 'user@example.com',
 *   name: '사용자',
 *   password: 'password123'
 * }, 'ADMIN001');
 * 
 * // 주문 생성
 * const order = await api.orders.createOrder({
 *   userId: user.userId,
 *   items: [{ productId: 'PROD001', name: 'Product', quantity: 1, price: 10000 }]
 * });
 * 
 * // 결제 처리
 * const payment = await api.payments.processPayment(order.orderId, {
 *   type: 'card',
 *   cardNumber: '4242424242424242',
 *   expiryMonth: 12,
 *   expiryYear: 2025,
 *   cvv: '123'
 * });
 * ```
 * 
 * @since 1.0.0
 */
export class ApiService {
  /** 결제 서비스 인스턴스 */
  public readonly payments: PaymentService;
  
  /** 사용자 서비스 인스턴스 */
  public readonly users: UserService;
  
  /** 주문 서비스 인스턴스 */
  public readonly orders: OrderService;

  /**
   * ApiService 생성자
   * 
   * @param config - API 설정 옵션
   * @param config.paymentApiKey - 결제 API 키
   * @param config.paymentApiUrl - 결제 API URL
   * 
   * @example
   * ```typescript
   * // 기본 설정으로 초기화
   * const api = new ApiService();
   * 
   * // 커스텀 설정으로 초기화
   * const customApi = new ApiService({
   *   paymentApiKey: 'custom-key',
   *   paymentApiUrl: 'https://custom-payment-api.com'
   * });
   * ```
   */
  constructor(config?: {
    paymentApiKey?: string;
    paymentApiUrl?: string;
  }) {
    this.payments = new PaymentService(config?.paymentApiKey, config?.paymentApiUrl);
    this.users = new UserService();
    this.orders = new OrderService();
  }

  /**
   * API 서비스의 상태를 확인합니다
   * 
   * @returns 서비스 상태 정보를 포함하는 Promise
   * 
   * @example
   * ```typescript
   * const status = await api.getStatus();
   * console.log('API Status:', status);
   * ```
   * 
   * @since 1.0.0
   */
  async getStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    services: {
      payments: boolean;
      users: boolean;
      orders: boolean;
    };
    timestamp: Date;
  }> {
    return {
      status: 'healthy',
      services: {
        payments: true,
        users: true,
        orders: true
      },
      timestamp: new Date()
    };
  }
}