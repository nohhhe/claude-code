/**
 * @fileoverview API 서비스에서 사용되는 커스텀 에러 클래스들
 * @module errors
 */

/**
 * API 기본 에러 클래스
 * 
 * @example
 * ```typescript
 * throw new ApiError('Something went wrong', 500, 'INTERNAL_ERROR');
 * ```
 */
export class ApiError extends Error {
  /** HTTP 상태 코드 */
  public statusCode: number;
  /** 에러 코드 */
  public errorCode: string;

  /**
   * ApiError 생성자
   * 
   * @param message - 에러 메시지
   * @param statusCode - HTTP 상태 코드
   * @param errorCode - 에러 코드
   */
  constructor(message: string, statusCode: number = 500, errorCode: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

/**
 * 결제 실패 에러
 * 
 * @example
 * ```typescript
 * throw new PaymentFailedError('Card declined');
 * ```
 */
export class PaymentFailedError extends ApiError {
  /**
   * PaymentFailedError 생성자
   * 
   * @param message - 결제 실패 사유
   * @param errorCode - 세부 에러 코드
   */
  constructor(message: string, errorCode: string = 'PAYMENT_FAILED') {
    super(message, 400, errorCode);
    this.name = 'PaymentFailedError';
  }
}

/**
 * 유효하지 않은 주문 에러
 * 
 * @example
 * ```typescript
 * throw new InvalidOrderError('Order not found');
 * ```
 */
export class InvalidOrderError extends ApiError {
  /**
   * InvalidOrderError 생성자
   * 
   * @param message - 에러 메시지
   */
  constructor(message: string) {
    super(message, 404, 'INVALID_ORDER');
    this.name = 'InvalidOrderError';
  }
}

/**
 * 환불 실패 에러
 * 
 * @example
 * ```typescript
 * throw new RefundFailedError('Refund period expired');
 * ```
 */
export class RefundFailedError extends ApiError {
  /**
   * RefundFailedError 생성자
   * 
   * @param message - 환불 실패 사유
   */
  constructor(message: string) {
    super(message, 400, 'REFUND_FAILED');
    this.name = 'RefundFailedError';
  }
}

/**
 * 결제 정보를 찾을 수 없는 에러
 * 
 * @example
 * ```typescript
 * throw new PaymentNotFoundError('Payment ID: PAY123');
 * ```
 */
export class PaymentNotFoundError extends ApiError {
  /**
   * PaymentNotFoundError 생성자
   * 
   * @param paymentId - 찾을 수 없는 결제 ID
   */
  constructor(paymentId: string) {
    super(`Payment not found: ${paymentId}`, 404, 'PAYMENT_NOT_FOUND');
    this.name = 'PaymentNotFoundError';
  }
}

/**
 * 사용자를 찾을 수 없는 에러
 * 
 * @example
 * ```typescript
 * throw new UserNotFoundError('USER123');
 * ```
 */
export class UserNotFoundError extends ApiError {
  /**
   * UserNotFoundError 생성자
   * 
   * @param userId - 찾을 수 없는 사용자 ID
   */
  constructor(userId: string) {
    super(`User not found: ${userId}`, 404, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundError';
  }
}

/**
 * 권한 없음 에러
 * 
 * @example
 * ```typescript
 * throw new UnauthorizedError('Admin access required');
 * ```
 */
export class UnauthorizedError extends ApiError {
  /**
   * UnauthorizedError 생성자
   * 
   * @param message - 권한 에러 메시지
   */
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

/**
 * 유효성 검증 실패 에러
 * 
 * @example
 * ```typescript
 * throw new ValidationError('Invalid email format');
 * ```
 */
export class ValidationError extends ApiError {
  /**
   * ValidationError 생성자
   * 
   * @param message - 유효성 검증 에러 메시지
   */
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}