/**
 * @fileoverview 주문 관리를 담당하는 서비스 클래스
 * @module OrderService
 */

import { Order, OrderItem, OrderStatus } from './types';
import { InvalidOrderError, UserNotFoundError, ValidationError, UnauthorizedError } from './errors';

/**
 * 주문 생성 요청 데이터
 */
export interface CreateOrderRequest {
  /** 주문자 사용자 ID */
  userId: string;
  /** 주문 상품 목록 */
  items: OrderItem[];
  /** 배송지 주소 */
  shippingAddress?: string;
  /** 주문 메모 */
  notes?: string;
}

/**
 * 주문 업데이트 요청 데이터
 */
export interface UpdateOrderRequest {
  /** 주문 상태 */
  status?: OrderStatus;
  /** 배송지 주소 */
  shippingAddress?: string;
  /** 주문 메모 */
  notes?: string;
}

/**
 * 주문 검색 필터
 */
export interface OrderSearchFilter {
  /** 사용자 ID */
  userId?: string;
  /** 주문 상태 */
  status?: OrderStatus;
  /** 최소 주문 금액 */
  minAmount?: number;
  /** 최대 주문 금액 */
  maxAmount?: number;
  /** 주문 생성일 범위 시작 */
  createdAfter?: Date;
  /** 주문 생성일 범위 종료 */
  createdBefore?: Date;
}

/**
 * 주문 통계 정보
 */
export interface OrderStatistics {
  /** 총 주문 수 */
  totalOrders: number;
  /** 총 주문 금액 */
  totalAmount: number;
  /** 상태별 주문 수 */
  ordersByStatus: Record<OrderStatus, number>;
  /** 평균 주문 금액 */
  averageOrderAmount: number;
  /** 기간 */
  period: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * 주문 관리를 담당하는 서비스 클래스
 * 
 * 이 클래스는 주문 생성, 조회, 수정, 취소 기능을 제공하며,
 * 주문 상태 관리와 통계 조회 기능을 포함합니다.
 * 
 * @example
 * ```typescript
 * const orderService = new OrderService();
 * 
 * // 새 주문 생성
 * const newOrder = await orderService.createOrder({
 *   userId: 'USER123',
 *   items: [
 *     { productId: 'PROD001', name: 'Product 1', quantity: 2, price: 10000 }
 *   ]
 * });
 * 
 * // 주문 상태 업데이트
 * await orderService.updateOrderStatus(newOrder.orderId, 'paid', 'ADMIN001');
 * ```
 * 
 * @since 1.0.0
 */
export class OrderService {
  /**
   * OrderService 생성자
   */
  constructor() {
    // 초기화 로직
  }

  /**
   * 새로운 주문을 생성합니다
   * 
   * 주문 항목 유효성 검증, 재고 확인, 총액 계산을 수행하고
   * 새로운 주문을 생성합니다.
   * 
   * @param orderData - 주문 생성 정보
   * @returns 생성된 주문 정보를 포함하는 Promise
   * 
   * @throws {@link ValidationError} 주문 데이터가 유효하지 않을 때
   * @throws {@link UserNotFoundError} 사용자를 찾을 수 없을 때
   * 
   * @example
   * ```typescript
   * try {
   *   const order = await orderService.createOrder({
   *     userId: 'USER123456789',
   *     items: [
   *       {
   *         productId: 'PROD001',
   *         name: '스마트폰',
   *         quantity: 1,
   *         price: 800000
   *       },
   *       {
   *         productId: 'PROD002',
   *         name: '케이스',
   *         quantity: 2,
   *         price: 15000
   *       }
   *     ],
   *     shippingAddress: '서울시 강남구 테헤란로 123',
   *     notes: '문 앞 배치 부탁드립니다'
   *   });
   *   
   *   console.log('Order created:', order.orderId);
   *   console.log('Total amount:', order.totalAmount);
   * } catch (error) {
   *   if (error instanceof ValidationError) {
   *     console.error('Invalid order data:', error.message);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 단일 상품 주문
   * const simpleOrder = await orderService.createOrder({
   *   userId: 'USER999',
   *   items: [
   *     { productId: 'BOOK001', name: '프로그래밍 책', quantity: 1, price: 35000 }
   *   ]
   * });
   * ```
   * 
   * @since 1.0.0
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // 입력 데이터 검증
    this.validateOrderData(orderData);
    
    // 사용자 존재 확인
    await this.validateUser(orderData.userId);
    
    // 상품 재고 확인 (실제 구현에서는 상품 서비스 호출)
    await this.validateInventory(orderData.items);
    
    // 총액 계산
    const totalAmount = this.calculateTotalAmount(orderData.items);
    
    // 주문 ID 생성
    const orderId = `ORDER${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    // 주문 생성
    const order: Order = {
      orderId,
      userId: orderData.userId,
      items: orderData.items,
      totalAmount,
      status: 'created',
      createdAt: new Date()
    };
    
    return order;
  }

  /**
   * 주문 ID로 주문 정보를 조회합니다
   * 
   * @param orderId - 조회할 주문 ID
   * @param requesterId - 요청자 ID (본인 주문이거나 관리자만 조회 가능)
   * @returns 주문 정보를 포함하는 Promise
   * 
   * @throws {@link InvalidOrderError} 주문을 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * try {
   *   const order = await orderService.getOrderById('ORDER123456789', 'USER123');
   *   
   *   console.log('Order details:');
   *   console.log('Status:', order.status);
   *   console.log('Total:', order.totalAmount);
   *   console.log('Items:', order.items.length);
   *   
   *   order.items.forEach(item => {
   *     console.log(`- ${item.name}: ${item.quantity}개 x ${item.price}원`);
   *   });
   * } catch (error) {
   *   if (error instanceof InvalidOrderError) {
   *     console.error('Order not found');
   *   }
   * }
   * ```
   * 
   * @since 1.0.0
   */
  async getOrderById(orderId: string, requesterId: string): Promise<Order> {
    const order = await this.findOrderById(orderId);
    if (!order) {
      throw new InvalidOrderError(`Order not found: ${orderId}`);
    }
    
    // 권한 검증 (본인 주문이거나 관리자)
    await this.validateOrderAccess(order, requesterId);
    
    return order;
  }

  /**
   * 사용자의 주문 목록을 조회합니다
   * 
   * @param userId - 사용자 ID
   * @param filter - 검색 필터
   * @param requesterId - 요청자 ID
   * @returns 주문 목록을 포함하는 Promise
   * 
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * // 사용자의 모든 주문 조회
   * const orders = await orderService.getUserOrders('USER123', {}, 'USER123');
   * console.log(`Found ${orders.length} orders`);
   * 
   * // 특정 상태의 주문만 조회
   * const paidOrders = await orderService.getUserOrders('USER123', {
   *   status: 'paid'
   * }, 'USER123');
   * ```
   * 
   * @example
   * ```typescript
   * // 날짜 범위로 주문 조회
   * const recentOrders = await orderService.getUserOrders('USER123', {
   *   createdAfter: new Date('2024-01-01'),
   *   createdBefore: new Date('2024-12-31')
   * }, 'ADMIN001');
   * ```
   * 
   * @since 1.0.0
   */
  async getUserOrders(userId: string, filter: OrderSearchFilter = {}, requesterId: string): Promise<Order[]> {
    // 권한 검증 (본인 주문이거나 관리자)
    if (userId !== requesterId && !(await this.isAdmin(requesterId))) {
      throw new UnauthorizedError('Access denied');
    }
    
    // 필터에 사용자 ID 추가
    const searchFilter: OrderSearchFilter = { ...filter, userId };
    
    return this.searchOrders(searchFilter);
  }

  /**
   * 주문 상태를 업데이트합니다
   * 
   * @param orderId - 주문 ID
   * @param status - 새로운 상태
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 업데이트된 주문 정보를 포함하는 Promise
   * 
   * @throws {@link InvalidOrderError} 주문을 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * @throws {@link ValidationError} 상태 변경이 유효하지 않을 때
   * 
   * @example
   * ```typescript
   * // 주문을 결제 완료 상태로 변경
   * const updatedOrder = await orderService.updateOrderStatus(
   *   'ORDER123456789', 
   *   'paid', 
   *   'ADMIN001'
   * );
   * 
   * console.log('Order status updated to:', updatedOrder.status);
   * ```
   * 
   * @example
   * ```typescript
   * // 상태 변경 시퀀스
   * const orderStatuses: OrderStatus[] = ['created', 'paid', 'shipped', 'delivered'];
   * 
   * for (const status of orderStatuses) {
   *   await orderService.updateOrderStatus('ORDER123', status, 'ADMIN001');
   *   console.log(`Status updated to: ${status}`);
   *   await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
   * }
   * ```
   * 
   * @since 1.0.0
   */
  async updateOrderStatus(orderId: string, status: OrderStatus, requesterId: string): Promise<Order> {
    // 관리자 권한 확인
    if (!(await this.isAdmin(requesterId))) {
      throw new UnauthorizedError('Admin permission required');
    }
    
    const order = await this.getOrderById(orderId, requesterId);
    
    // 상태 변경 유효성 검증
    this.validateStatusTransition(order.status, status);
    
    // 주문 상태 업데이트
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date()
    };
    
    return updatedOrder;
  }

  /**
   * 주문을 취소합니다
   * 
   * @param orderId - 취소할 주문 ID
   * @param requesterId - 요청자 ID
   * @returns 취소된 주문 정보를 포함하는 Promise
   * 
   * @throws {@link InvalidOrderError} 주문을 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * @throws {@link ValidationError} 취소할 수 없는 상태일 때
   * 
   * @example
   * ```typescript
   * try {
   *   const cancelledOrder = await orderService.cancelOrder('ORDER123', 'USER123');
   *   console.log('Order cancelled:', cancelledOrder.orderId);
   * } catch (error) {
   *   if (error instanceof ValidationError) {
   *     console.error('Cannot cancel order:', error.message);
   *   }
   * }
   * ```
   * 
   * @since 1.0.0
   */
  async cancelOrder(orderId: string, requesterId: string): Promise<Order> {
    const order = await this.getOrderById(orderId, requesterId);
    
    // 취소 가능한 상태인지 확인
    if (!['created', 'paid'].includes(order.status)) {
      throw new ValidationError(`Cannot cancel order in ${order.status} status`);
    }
    
    return this.updateOrderStatus(orderId, 'cancelled', requesterId);
  }

  /**
   * 주문 검색을 수행합니다
   * 
   * @param filter - 검색 필터
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 검색된 주문 목록을 포함하는 Promise
   * 
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * // 특정 금액 범위의 주문 검색
   * const expensiveOrders = await orderService.searchOrders({
   *   minAmount: 100000,
   *   maxAmount: 1000000,
   *   status: 'paid'
   * }, 'ADMIN001');
   * 
   * console.log(`Found ${expensiveOrders.length} expensive orders`);
   * ```
   * 
   * @since 1.0.0
   */
  async searchOrders(filter: OrderSearchFilter, requesterId?: string): Promise<Order[]> {
    // 관리자 권한이 필요한 경우 검증
    if (requesterId && !filter.userId && !(await this.isAdmin(requesterId))) {
      throw new UnauthorizedError('Admin permission required for global search');
    }
    
    // 모의 검색 결과 반환 (실제 구현에서는 데이터베이스 쿼리)
    return this.generateMockOrders(20).filter(order => {
      if (filter.userId && order.userId !== filter.userId) return false;
      if (filter.status && order.status !== filter.status) return false;
      if (filter.minAmount && order.totalAmount < filter.minAmount) return false;
      if (filter.maxAmount && order.totalAmount > filter.maxAmount) return false;
      if (filter.createdAfter && order.createdAt < filter.createdAfter) return false;
      if (filter.createdBefore && order.createdAt > filter.createdBefore) return false;
      return true;
    });
  }

  /**
   * 주문 통계를 조회합니다
   * 
   * @param startDate - 조회 시작일
   * @param endDate - 조회 종료일
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 주문 통계 정보를 포함하는 Promise
   * 
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * const stats = await orderService.getOrderStatistics(
   *   new Date('2024-01-01'),
   *   new Date('2024-12-31'),
   *   'ADMIN001'
   * );
   * 
   * console.log('Order Statistics:');
   * console.log('Total Orders:', stats.totalOrders);
   * console.log('Total Amount:', stats.totalAmount.toLocaleString());
   * console.log('Average Order:', stats.averageOrderAmount.toLocaleString());
   * console.log('By Status:', stats.ordersByStatus);
   * ```
   * 
   * @since 1.1.0
   */
  async getOrderStatistics(startDate: Date, endDate: Date, requesterId: string): Promise<OrderStatistics> {
    if (!(await this.isAdmin(requesterId))) {
      throw new UnauthorizedError('Admin permission required');
    }
    
    const orders = await this.searchOrders({
      createdAfter: startDate,
      createdBefore: endDate
    });
    
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderAmount = totalOrders > 0 ? totalAmount / totalOrders : 0;
    
    const ordersByStatus: Record<OrderStatus, number> = {
      created: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    orders.forEach(order => {
      ordersByStatus[order.status]++;
    });
    
    return {
      totalOrders,
      totalAmount,
      ordersByStatus,
      averageOrderAmount,
      period: { startDate, endDate }
    };
  }

  /**
   * 주문 데이터 유효성을 검증하는 내부 메서드
   * 
   * @private
   * @param orderData - 검증할 주문 데이터
   * @throws {@link ValidationError} 데이터가 유효하지 않을 때
   */
  private validateOrderData(orderData: CreateOrderRequest): void {
    if (!orderData.userId) {
      throw new ValidationError('User ID is required');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }
    
    orderData.items.forEach((item, index) => {
      if (!item.productId) {
        throw new ValidationError(`Item ${index + 1}: Product ID is required`);
      }
      if (!item.name) {
        throw new ValidationError(`Item ${index + 1}: Product name is required`);
      }
      if (item.quantity <= 0) {
        throw new ValidationError(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.price < 0) {
        throw new ValidationError(`Item ${index + 1}: Price cannot be negative`);
      }
    });
  }

  /**
   * 사용자 존재를 확인하는 내부 메서드
   * 
   * @private
   * @param userId - 확인할 사용자 ID
   * @throws {@link UserNotFoundError} 사용자를 찾을 수 없을 때
   */
  private async validateUser(userId: string): Promise<void> {
    // 실제 구현에서는 사용자 서비스 호출
    const userExists = Math.random() > 0.1; // 90% 확률로 사용자 존재
    
    if (!userExists) {
      throw new UserNotFoundError(userId);
    }
  }

  /**
   * 상품 재고를 확인하는 내부 메서드
   * 
   * @private
   * @param items - 확인할 상품 목록
   * @throws {@link ValidationError} 재고가 부족할 때
   */
  private async validateInventory(items: OrderItem[]): Promise<void> {
    // 실제 구현에서는 상품 서비스 호출
    items.forEach(item => {
      const hasStock = Math.random() > 0.05; // 95% 확률로 재고 있음
      if (!hasStock) {
        throw new ValidationError(`Insufficient stock for product: ${item.name}`);
      }
    });
  }

  /**
   * 총 주문 금액을 계산하는 내부 메서드
   * 
   * @private
   * @param items - 주문 상품 목록
   * @returns 총 금액
   */
  private calculateTotalAmount(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * 주문 접근 권한을 검증하는 내부 메서드
   * 
   * @private
   * @param order - 주문 정보
   * @param requesterId - 요청자 ID
   * @throws {@link UnauthorizedError} 권한이 없을 때
   */
  private async validateOrderAccess(order: Order, requesterId: string): Promise<void> {
    const isOwner = order.userId === requesterId;
    const isAdminUser = await this.isAdmin(requesterId);
    
    if (!isOwner && !isAdminUser) {
      throw new UnauthorizedError('Access denied');
    }
  }

  /**
   * 상태 변경이 유효한지 검증하는 내부 메서드
   * 
   * @private
   * @param currentStatus - 현재 상태
   * @param newStatus - 새로운 상태
   * @throws {@link ValidationError} 유효하지 않은 상태 변경
   */
  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      created: ['paid', 'cancelled'],
      paid: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new ValidationError(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
  }

  /**
   * 관리자 권한을 확인하는 내부 메서드
   * 
   * @private
   * @param userId - 확인할 사용자 ID
   * @returns 관리자 여부
   */
  private async isAdmin(userId: string): Promise<boolean> {
    // 실제 구현에서는 사용자 서비스 호출
    return userId.includes('ADMIN');
  }

  /**
   * 주문 ID로 주문을 찾는 내부 메서드
   * 
   * @private
   * @param orderId - 찾을 주문 ID
   * @returns 주문 정보 또는 null
   */
  private async findOrderById(_orderId: string): Promise<Order | null> {
    // 실제 구현에서는 데이터베이스 쿼리
    const orderExists = Math.random() > 0.1; // 90% 확률로 주문 존재
    
    if (!orderExists) {
      return null;
    }
    
    return this.generateMockOrders(1)[0];
  }

  /**
   * 모의 주문 데이터를 생성하는 내부 메서드
   * 
   * @private
   * @param count - 생성할 주문 수
   * @returns 모의 주문 배열
   */
  private generateMockOrders(count: number): Order[] {
    const orders: Order[] = [];
    const statuses: OrderStatus[] = ['created', 'paid', 'shipped', 'delivered', 'cancelled'];
    const products = [
      { id: 'PROD001', name: '스마트폰', price: 800000 },
      { id: 'PROD002', name: '노트북', price: 1500000 },
      { id: 'PROD003', name: '태블릿', price: 600000 },
      { id: 'PROD004', name: '이어폰', price: 200000 },
      { id: 'PROD005', name: '케이스', price: 25000 }
    ];
    
    for (let i = 0; i < count; i++) {
      const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3개 상품
      const items: OrderItem[] = [];
      
      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        items.push({
          productId: product.id,
          name: product.name,
          quantity,
          price: product.price
        });
      }
      
      const totalAmount = this.calculateTotalAmount(items);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // 90일 내
      
      orders.push({
        orderId: `ORDER${Date.now() + i}`,
        userId: `USER${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        items,
        totalAmount,
        status,
        createdAt,
        updatedAt: status !== 'created' ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
      });
    }
    
    return orders;
  }
}