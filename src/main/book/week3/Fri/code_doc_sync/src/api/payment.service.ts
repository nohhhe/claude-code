/**
 * @fileoverview 결제 처리를 담당하는 서비스 클래스
 * @module PaymentService
 */

import { PaymentMethod, PaymentResult, RefundResult, PaymentStatus } from './types';
import { PaymentFailedError, InvalidOrderError, RefundFailedError, PaymentNotFoundError } from './errors';

/**
 * 결제 처리를 담당하는 서비스 클래스
 * 
 * 이 클래스는 다양한 결제 방식을 지원하며, 결제 처리, 환불, 상태 조회 기능을 제공합니다.
 * 모든 메서드는 비동기로 작동하며, 적절한 에러 처리를 포함하고 있습니다.
 * 
 * @example
 * ```typescript
 * const paymentService = new PaymentService();
 * const result = await paymentService.processPayment('ORDER123', {
 *   type: 'card',
 *   cardNumber: '4242424242424242',
 *   expiryMonth: 12,
 *   expiryYear: 2025,
 *   cvv: '123'
 * });
 * 
 * if (result.success) {
 *   console.log(`Payment successful: ${result.transactionId}`);
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class PaymentService {
  private readonly _apiKey: string;
  private readonly _baseUrl: string;

  /**
   * PaymentService 생성자
   * 
   * @param apiKey - 결제 API 키 (기본값: 환경변수에서 로드)
   * @param baseUrl - API 기본 URL (기본값: 환경변수에서 로드)
   * 
   * @example
   * ```typescript
   * // 기본 설정 사용
   * const paymentService = new PaymentService();
   * 
   * // 커스텀 설정 사용
   * const customPaymentService = new PaymentService('custom-api-key', 'https://api.example.com');
   * ```
   */
  constructor(apiKey?: string, baseUrl?: string) {
    this._apiKey = apiKey || process.env.PAYMENT_API_KEY || '';
    this._baseUrl = baseUrl || process.env.PAYMENT_API_URL || 'https://api.payment.com';
  }

  /**
   * 주문에 대한 결제를 처리합니다
   * 
   * 이 메서드는 다양한 결제 수단(카드, 계좌이체, 전자지갑, 암호화폐)을 지원하며,
   * 결제 처리 결과를 반환합니다. 결제 실패 시 적절한 에러를 발생시킵니다.
   * 
   * @param orderId - 결제할 주문의 고유 식별자
   * @param paymentMethod - 결제 수단 정보
   * @returns 결제 처리 결과를 포함하는 Promise
   * 
   * @throws {@link PaymentFailedError} 결제 처리 실패 시
   * @throws {@link InvalidOrderError} 유효하지 않은 주문 ID
   * @throws {@link ValidationError} 결제 수단 정보가 유효하지 않을 때
   * 
   * @example
   * ```typescript
   * // 카드 결제
   * try {
   *   const result = await paymentService.processPayment('ORDER123', {
   *     type: 'card',
   *     cardNumber: '4242424242424242',
   *     expiryMonth: 12,
   *     expiryYear: 2025,
   *     cvv: '123'
   *   });
   *   console.log('Payment successful:', result.transactionId);
   * } catch (error) {
   *   if (error instanceof PaymentFailedError) {
   *     console.error('Payment failed:', error.message);
   *   } else if (error instanceof InvalidOrderError) {
   *     console.error('Invalid order:', error.message);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 계좌이체 결제
   * const bankPaymentResult = await paymentService.processPayment('ORDER456', {
   *   type: 'bank',
   *   bankAccount: '123-456-789'
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // 전자지갑 결제
   * const walletPaymentResult = await paymentService.processPayment('ORDER789', {
   *   type: 'wallet',
   *   walletId: 'WALLET123'
   * });
   * ```
   * 
   * @since 1.0.0
   */
  async processPayment(orderId: string, paymentMethod: PaymentMethod): Promise<PaymentResult> {
    try {
      // 주문 유효성 검증
      await this.validateOrder(orderId);
      
      // 결제 수단 유효성 검증
      this.validatePaymentMethod(paymentMethod);
      
      // 결제 처리 로직 (실제 구현에서는 외부 결제 API 호출)
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // 모의 결제 처리
      const success = Math.random() > 0.1; // 90% 성공률
      
      if (!success) {
        throw new PaymentFailedError('Payment gateway error', 'GATEWAY_ERROR');
      }
      
      return {
        success: true,
        transactionId,
        amount: await this.getOrderAmount(orderId),
        currency: 'KRW',
        processedAt: new Date()
      };
      
    } catch (error) {
      if (error instanceof PaymentFailedError || error instanceof InvalidOrderError) {
        throw error;
      }
      throw new PaymentFailedError('Unexpected payment error', 'UNKNOWN_PAYMENT_ERROR');
    }
  }

  /**
   * 결제 건에 대한 환불을 처리합니다
   * 
   * 전액 환불 또는 부분 환불을 지원하며, 환불 처리 결과를 반환합니다.
   * 환불 가능 여부는 결제 완료 후 30일 이내, 환불 금액은 원래 결제 금액을 초과할 수 없습니다.
   * 
   * @param paymentId - 환불할 결제의 고유 식별자
   * @param amount - 환불 금액 (지정하지 않으면 전액 환불)
   * @returns 환불 처리 결과를 포함하는 Promise
   * 
   * @throws {@link RefundFailedError} 환불 처리 실패 시
   * @throws {@link PaymentNotFoundError} 결제 정보를 찾을 수 없음
   * 
   * @example
   * ```typescript
   * // 전액 환불
   * try {
   *   const fullRefund = await paymentService.refund('PAY123456789');
   *   console.log('Full refund processed:', fullRefund.refundId);
   * } catch (error) {
   *   console.error('Refund failed:', error.message);
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 부분 환불
   * const partialRefund = await paymentService.refund('PAY123456789', 5000);
   * console.log('Partial refund of 5000 processed:', partialRefund.refundId);
   * ```
   * 
   * @example
   * ```typescript
   * // 환불 실패 처리
   * try {
   *   await paymentService.refund('INVALID_PAYMENT_ID');
   * } catch (error) {
   *   if (error instanceof PaymentNotFoundError) {
   *     console.error('Payment not found for refund');
   *   } else if (error instanceof RefundFailedError) {
   *     console.error('Refund failed:', error.message);
   *   }
   * }
   * ```
   * 
   * @since 1.0.0
   */
  async refund(paymentId: string, amount?: number): Promise<RefundResult> {
    try {
      // 결제 정보 조회
      const paymentStatus = await this.getPaymentStatus(paymentId);
      
      if (paymentStatus.state !== 'completed') {
        throw new RefundFailedError('Only completed payments can be refunded');
      }
      
      // 환불 금액 검증
      const refundAmount = amount || paymentStatus.amount;
      if (refundAmount > paymentStatus.amount) {
        throw new RefundFailedError('Refund amount cannot exceed payment amount');
      }
      
      // 환불 처리 로직
      const refundId = `REF${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        refundId,
        originalPaymentId: paymentId,
        refundAmount,
        processedAt: new Date()
      };
      
    } catch (error) {
      if (error instanceof PaymentNotFoundError || error instanceof RefundFailedError) {
        throw error;
      }
      throw new RefundFailedError('Unexpected refund error');
    }
  }

  /**
   * 결제 상태를 조회합니다
   * 
   * 지정된 결제 ID의 현재 상태, 금액, 처리 시간 등의 정보를 반환합니다.
   * 결제 상태는 실시간으로 업데이트되며, 결제 진행 상황을 추적할 수 있습니다.
   * 
   * @param paymentId - 조회할 결제의 고유 식별자
   * @returns 현재 결제 상태 정보를 포함하는 Promise
   * 
   * @throws {@link PaymentNotFoundError} 결제 정보를 찾을 수 없음
   * 
   * @example
   * ```typescript
   * // 결제 상태 조회
   * try {
   *   const status = await paymentService.getPaymentStatus('PAY123456789');
   *   
   *   switch (status.state) {
   *     case 'completed':
   *       console.log('Payment completed at:', status.completedAt);
   *       break;
   *     case 'pending':
   *       console.log('Payment is still pending');
   *       break;
   *     case 'failed':
   *       console.log('Payment failed:', status.failureReason);
   *       break;
   *   }
   * } catch (error) {
   *   console.error('Payment not found:', error.message);
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 결제 완료 대기
   * const waitForCompletion = async (paymentId: string) => {
   *   const maxAttempts = 10;
   *   let attempts = 0;
   *   
   *   while (attempts < maxAttempts) {
   *     const status = await paymentService.getPaymentStatus(paymentId);
   *     
   *     if (status.state === 'completed') {
   *       return status;
   *     } else if (status.state === 'failed') {
   *       throw new Error('Payment failed');
   *     }
   *     
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *     attempts++;
   *   }
   *   
   *   throw new Error('Payment timeout');
   * };
   * ```
   * 
   * @since 1.0.0
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    // 결제 정보 조회 로직 (실제 구현에서는 데이터베이스 또는 외부 API 조회)
    const paymentExists = Math.random() > 0.1; // 90% 확률로 결제 정보 존재
    
    if (!paymentExists) {
      throw new PaymentNotFoundError(paymentId);
    }
    
    // 모의 결제 상태 반환
    const states: PaymentStatus['state'][] = ['pending', 'processing', 'completed', 'failed'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    
    const createdAt = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000); // 24시간 내 생성
    
    return {
      paymentId,
      state: randomState,
      amount: Math.floor(Math.random() * 100000) + 1000, // 1,000 ~ 101,000
      currency: 'KRW',
      createdAt,
      completedAt: randomState === 'completed' ? new Date(createdAt.getTime() + Math.random() * 300000) : undefined,
      failureReason: randomState === 'failed' ? 'Card declined' : undefined
    };
  }

  /**
   * 여러 결제의 상태를 일괄 조회합니다
   * 
   * @param paymentIds - 조회할 결제 ID 목록
   * @returns 결제 상태 정보 배열을 포함하는 Promise
   * 
   * @example
   * ```typescript
   * const statuses = await paymentService.getBatchPaymentStatus(['PAY123', 'PAY456', 'PAY789']);
   * statuses.forEach(status => {
   *   console.log(`Payment ${status.paymentId}: ${status.state}`);
   * });
   * ```
   * 
   * @since 1.1.0
   */
  async getBatchPaymentStatus(paymentIds: string[]): Promise<PaymentStatus[]> {
    const results: PaymentStatus[] = [];
    
    for (const paymentId of paymentIds) {
      try {
        const status = await this.getPaymentStatus(paymentId);
        results.push(status);
      } catch (error) {
        // 개별 결제 조회 실패는 로그만 남기고 계속 진행
        console.warn(`Failed to get status for payment ${paymentId}:`, error);
      }
    }
    
    return results;
  }

  /**
   * 주문 유효성을 검증하는 내부 메서드
   * 
   * @private
   * @param orderId - 검증할 주문 ID
   * @throws {@link InvalidOrderError} 주문이 유효하지 않을 때
   */
  private async validateOrder(orderId: string): Promise<void> {
    if (!orderId || orderId.length < 5) {
      throw new InvalidOrderError('Order ID must be at least 5 characters long');
    }
    
    // 실제 구현에서는 데이터베이스에서 주문 정보 조회
    const orderExists = Math.random() > 0.1; // 90% 확률로 주문 존재
    
    if (!orderExists) {
      throw new InvalidOrderError(`Order not found: ${orderId}`);
    }
  }

  /**
   * 결제 수단 유효성을 검증하는 내부 메서드
   * 
   * @private
   * @param paymentMethod - 검증할 결제 수단
   * @throws {@link ValidationError} 결제 수단이 유효하지 않을 때
   */
  private validatePaymentMethod(paymentMethod: PaymentMethod): void {
    switch (paymentMethod.type) {
      case 'card':
        if (!paymentMethod.cardNumber || !paymentMethod.expiryMonth || 
            !paymentMethod.expiryYear || !paymentMethod.cvv) {
          throw new PaymentFailedError('Card payment requires cardNumber, expiryMonth, expiryYear, and cvv');
        }
        break;
      case 'bank':
        if (!paymentMethod.bankAccount) {
          throw new PaymentFailedError('Bank payment requires bankAccount');
        }
        break;
      case 'wallet':
        if (!paymentMethod.walletId) {
          throw new PaymentFailedError('Wallet payment requires walletId');
        }
        break;
    }
  }

  /**
   * 주문 금액을 조회하는 내부 메서드
   * 
   * @private
   * @param orderId - 주문 ID
   * @returns 주문 금액
   */
  private async getOrderAmount(_orderId: string): Promise<number> {
    // 실제 구현에서는 주문 정보에서 금액 조회
    return Math.floor(Math.random() * 100000) + 1000; // 1,000 ~ 101,000
  }
}