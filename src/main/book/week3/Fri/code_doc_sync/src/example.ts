/**
 * @fileoverview API 사용 예제 모음
 * @module examples
 */

import { ApiService, PaymentService, UserService, OrderService } from './api';
import { PaymentFailedError, InvalidOrderError, UserNotFoundError } from './api/errors';

/**
 * 통합 API 사용 예제
 * 
 * 사용자 생성부터 주문, 결제까지의 전체 플로우를 보여줍니다.
 * 
 * @example
 * ```typescript
 * await fullWorkflowExample();
 * ```
 */
async function fullWorkflowExample(): Promise<void> {
  console.log('=== 통합 API 워크플로우 예제 ===');
  
  const api = new ApiService();
  
  try {
    // 1. 사용자 생성
    console.log('1. 사용자 생성 중...');
    const user = await api.users.createUser({
      email: 'customer@example.com',
      name: '김고객',
      password: 'SecurePassword123!'
    }, 'ADMIN001');
    console.log('사용자 생성 완료:', user.userId);
    
    // 2. 주문 생성
    console.log('2. 주문 생성 중...');
    const order = await api.orders.createOrder({
      userId: user.userId,
      items: [
        { productId: 'PROD001', name: '스마트폰', quantity: 1, price: 800000 },
        { productId: 'PROD002', name: '케이스', quantity: 1, price: 25000 }
      ],
      shippingAddress: '서울시 강남구 테헤란로 123'
    });
    console.log('주문 생성 완료:', order.orderId, '총액:', order.totalAmount.toLocaleString() + '원');
    
    // 3. 결제 처리
    console.log('3. 결제 처리 중...');
    const payment = await api.payments.processPayment(order.orderId, {
      type: 'card',
      cardNumber: '4242424242424242',
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: '123'
    });
    
    if (payment.success) {
      console.log('결제 성공:', payment.transactionId);
      
      // 4. 주문 상태 업데이트
      console.log('4. 주문 상태 업데이트 중...');
      await api.orders.updateOrderStatus(order.orderId, 'paid', 'ADMIN001');
      console.log('주문 상태가 결제 완료로 변경되었습니다.');
    }
    
  } catch (error) {
    console.error('워크플로우 실행 중 에러 발생:', error);
  }
}

/**
 * 결제 서비스 사용 예제
 * 
 * 다양한 결제 방식과 에러 처리 방법을 보여줍니다.
 * 
 * @example
 * ```typescript
 * await paymentServiceExamples();
 * ```
 */
async function paymentServiceExamples(): Promise<void> {
  console.log('\n=== 결제 서비스 예제 ===');
  
  const paymentService = new PaymentService();
  
  // 카드 결제 예제
  try {
    console.log('카드 결제 처리 중...');
    const cardPayment = await paymentService.processPayment('ORDER001', {
      type: 'card',
      cardNumber: '4242424242424242',
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: '123'
    });
    console.log('카드 결제 성공:', cardPayment.transactionId);
  } catch (error) {
    if (error instanceof PaymentFailedError) {
      console.error('카드 결제 실패:', error.message);
    }
  }
  
  // 계좌이체 결제 예제
  try {
    console.log('계좌이체 결제 처리 중...');
    const bankPayment = await paymentService.processPayment('ORDER002', {
      type: 'bank',
      bankAccount: '123-456-789012'
    });
    console.log('계좌이체 결제 성공:', bankPayment.transactionId);
  } catch (error) {
    console.error('계좌이체 결제 실패:', error);
  }
  
  // 결제 상태 조회 예제
  try {
    console.log('결제 상태 조회 중...');
    const status = await paymentService.getPaymentStatus('PAY123456789');
    console.log(`결제 상태: ${status.state}, 금액: ${status.amount.toLocaleString()}원`);
    
    if (status.state === 'completed' && status.completedAt) {
      console.log('결제 완료 시각:', status.completedAt.toLocaleString());
    }
  } catch (error) {
    console.error('결제 상태 조회 실패:', error);
  }
  
  // 환불 처리 예제
  try {
    console.log('부분 환불 처리 중...');
    const refund = await paymentService.refund('PAY123456789', 50000);
    console.log('환불 완료:', refund.refundId, '환불액:', refund.refundAmount.toLocaleString() + '원');
  } catch (error) {
    console.error('환불 처리 실패:', error);
  }
}

/**
 * 사용자 서비스 사용 예제
 * 
 * 사용자 관리 기능들과 권한 처리를 보여줍니다.
 * 
 * @example
 * ```typescript
 * await userServiceExamples();
 * ```
 */
async function userServiceExamples(): Promise<void> {
  console.log('\n=== 사용자 서비스 예제 ===');
  
  const userService = new UserService();
  
  // 사용자 생성 예제
  try {
    console.log('새 사용자 생성 중...');
    const newUser = await userService.createUser({
      email: 'newuser@example.com',
      name: '새사용자',
      password: 'StrongPassword123!'
    }, 'ADMIN001');
    console.log('사용자 생성 완료:', newUser.name, newUser.email);
    
    // 사용자 정보 조회
    console.log('사용자 정보 조회 중...');
    const user = await userService.getUserById(newUser.userId, newUser.userId);
    console.log('조회된 사용자:', user.name, user.role);
    
    // 사용자 정보 업데이트
    console.log('사용자 이름 변경 중...');
    const updatedUser = await userService.updateUser(newUser.userId, {
      name: '변경된이름'
    }, newUser.userId);
    console.log('이름 변경 완료:', updatedUser.name);
    
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error('사용자를 찾을 수 없습니다:', error.message);
    } else {
      console.error('사용자 서비스 에러:', error);
    }
  }
  
  // 사용자 목록 조회 예제
  try {
    console.log('활성 사용자 목록 조회 중...');
    const activeUsers = await userService.getUsers(
      { isActive: true },
      { page: 1, limit: 5 },
      'ADMIN001'
    );
    console.log(`활성 사용자 ${activeUsers.data.length}명 조회 완료 (총 ${activeUsers.total}명)`);
    
    activeUsers.data.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
  }
}

/**
 * 주문 서비스 사용 예제
 * 
 * 주문 생성, 상태 관리, 통계 조회 기능을 보여줍니다.
 * 
 * @example
 * ```typescript
 * await orderServiceExamples();
 * ```
 */
async function orderServiceExamples(): Promise<void> {
  console.log('\n=== 주문 서비스 예제 ===');
  
  const orderService = new OrderService();
  
  // 단일 상품 주문 예제
  try {
    console.log('단일 상품 주문 생성 중...');
    const simpleOrder = await orderService.createOrder({
      userId: 'USER123',
      items: [
        { productId: 'BOOK001', name: 'TypeScript 완벽 가이드', quantity: 1, price: 35000 }
      ]
    });
    console.log('주문 생성:', simpleOrder.orderId, '총액:', simpleOrder.totalAmount.toLocaleString() + '원');
    
  } catch (error) {
    if (error instanceof InvalidOrderError) {
      console.error('유효하지 않은 주문:', error.message);
    }
  }
  
  // 복수 상품 주문 예제
  try {
    console.log('복수 상품 주문 생성 중...');
    const multiItemOrder = await orderService.createOrder({
      userId: 'USER456',
      items: [
        { productId: 'LAPTOP001', name: '노트북', quantity: 1, price: 1500000 },
        { productId: 'MOUSE001', name: '마우스', quantity: 1, price: 50000 },
        { productId: 'KEYBOARD001', name: '키보드', quantity: 1, price: 120000 }
      ],
      shippingAddress: '부산시 해운대구 센텀로 99',
      notes: '조심히 배송 부탁드립니다'
    });
    console.log('복수 상품 주문 생성:', multiItemOrder.orderId);
    console.log('주문 항목 수:', multiItemOrder.items.length);
    console.log('총액:', multiItemOrder.totalAmount.toLocaleString() + '원');
    
    // 주문 상태 변경 시퀀스
    const orderStatuses = ['paid', 'shipped', 'delivered'] as const;
    for (const status of orderStatuses) {
      console.log(`주문 상태를 ${status}로 변경 중...`);
      await orderService.updateOrderStatus(multiItemOrder.orderId, status, 'ADMIN001');
      console.log('상태 변경 완료');
    }
    
  } catch (error) {
    console.error('주문 처리 중 에러:', error);
  }
  
  // 주문 통계 조회 예제
  try {
    console.log('주문 통계 조회 중...');
    const stats = await orderService.getOrderStatistics(
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'ADMIN001'
    );
    
    console.log('=== 주문 통계 ===');
    console.log('총 주문 수:', stats.totalOrders);
    console.log('총 주문 금액:', stats.totalAmount.toLocaleString() + '원');
    console.log('평균 주문 금액:', Math.round(stats.averageOrderAmount).toLocaleString() + '원');
    console.log('상태별 주문 수:');
    Object.entries(stats.ordersByStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}건`);
    });
    
  } catch (error) {
    console.error('통계 조회 실패:', error);
  }
}

/**
 * 에러 처리 예제
 * 
 * 다양한 에러 상황과 적절한 처리 방법을 보여줍니다.
 * 
 * @example
 * ```typescript
 * await errorHandlingExamples();
 * ```
 */
async function errorHandlingExamples(): Promise<void> {
  console.log('\n=== 에러 처리 예제 ===');
  
  const api = new ApiService();
  
  // 잘못된 결제 정보로 결제 시도
  try {
    console.log('잘못된 카드 정보로 결제 시도...');
    await api.payments.processPayment('ORDER999', {
      type: 'card',
      cardNumber: '1234', // 잘못된 카드 번호
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: '123'
    });
  } catch (error) {
    if (error instanceof PaymentFailedError) {
      console.error('결제 실패 (예상된 에러):', error.message);
      console.error('에러 코드:', error.errorCode);
      console.error('HTTP 상태:', error.statusCode);
    }
  }
  
  // 존재하지 않는 사용자 조회 시도
  try {
    console.log('존재하지 않는 사용자 조회 시도...');
    await api.users.getUserById('NONEXISTENT_USER', 'ADMIN001');
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error('사용자 없음 (예상된 에러):', error.message);
    }
  }
  
  // 권한 없는 작업 시도
  try {
    console.log('권한 없는 작업 시도...');
    await api.orders.updateOrderStatus('ORDER123', 'delivered', 'REGULAR_USER');
  } catch (error) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      console.error('권한 없음 (예상된 에러):', error.message);
    }
  }
}

/**
 * 모든 예제를 실행하는 메인 함수
 * 
 * @example
 * ```typescript
 * // 개별 예제 실행
 * await fullWorkflowExample();
 * await paymentServiceExamples();
 * await userServiceExamples();
 * await orderServiceExamples();
 * await errorHandlingExamples();
 * 
 * // 또는 모든 예제 실행
 * await runAllExamples();
 * ```
 */
export async function runAllExamples(): Promise<void> {
  console.log('🚀 API 문서화 예제 실행 시작\n');
  
  await fullWorkflowExample();
  await paymentServiceExamples();
  await userServiceExamples();
  await orderServiceExamples();
  await errorHandlingExamples();
  
  console.log('\n✅ 모든 예제 실행 완료');
}

// 스크립트로 직접 실행할 때
if (require.main === module) {
  runAllExamples().catch(console.error);
}