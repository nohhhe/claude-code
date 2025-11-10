[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / OrderService

# Class: OrderService

주문 관리를 담당하는 서비스 클래스

이 클래스는 주문 생성, 조회, 수정, 취소 기능을 제공하며,
주문 상태 관리와 통계 조회 기능을 포함합니다.

**`Example`**

```typescript
const orderService = new OrderService();

// 새 주문 생성
const newOrder = await orderService.createOrder({
  userId: 'USER123',
  items: [
    { productId: 'PROD001', name: 'Product 1', quantity: 2, price: 10000 }
  ]
});

// 주문 상태 업데이트
await orderService.updateOrderStatus(newOrder.orderId, 'paid', 'ADMIN001');
```

**`Since`**

1.0.0

## Table of contents

### Constructors

- [constructor](OrderService.md#constructor)

### Methods

- [createOrder](OrderService.md#createorder)
- [getOrderById](OrderService.md#getorderbyid)
- [getUserOrders](OrderService.md#getuserorders)
- [updateOrderStatus](OrderService.md#updateorderstatus)
- [cancelOrder](OrderService.md#cancelorder)
- [searchOrders](OrderService.md#searchorders)
- [getOrderStatistics](OrderService.md#getorderstatistics)
- [validateOrderData](OrderService.md#validateorderdata)
- [validateUser](OrderService.md#validateuser)
- [validateInventory](OrderService.md#validateinventory)
- [calculateTotalAmount](OrderService.md#calculatetotalamount)
- [validateOrderAccess](OrderService.md#validateorderaccess)
- [validateStatusTransition](OrderService.md#validatestatustransition)
- [isAdmin](OrderService.md#isadmin)
- [findOrderById](OrderService.md#findorderbyid)
- [generateMockOrders](OrderService.md#generatemockorders)

## Constructors

### constructor

• **new OrderService**(): [`OrderService`](OrderService.md)

OrderService 생성자

#### Returns

[`OrderService`](OrderService.md)

#### Defined in

[order.service.ts:100](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L100)

## Methods

### createOrder

▸ **createOrder**(`orderData`): `Promise`\<[`Order`](../interfaces/Order.md)\>

새로운 주문을 생성합니다

주문 항목 유효성 검증, 재고 확인, 총액 계산을 수행하고
새로운 주문을 생성합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderData` | [`CreateOrderRequest`](../interfaces/CreateOrderRequest.md) | 주문 생성 정보 |

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

생성된 주문 정보를 포함하는 Promise

**`Throws`**

[ValidationError](ValidationError.md) 주문 데이터가 유효하지 않을 때

**`Throws`**

[UserNotFoundError](UserNotFoundError.md) 사용자를 찾을 수 없을 때

**`Example`**

```typescript
try {
  const order = await orderService.createOrder({
    userId: 'USER123456789',
    items: [
      {
        productId: 'PROD001',
        name: '스마트폰',
        quantity: 1,
        price: 800000
      },
      {
        productId: 'PROD002',
        name: '케이스',
        quantity: 2,
        price: 15000
      }
    ],
    shippingAddress: '서울시 강남구 테헤란로 123',
    notes: '문 앞 배치 부탁드립니다'
  });
  
  console.log('Order created:', order.orderId);
  console.log('Total amount:', order.totalAmount);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid order data:', error.message);
  }
}
```

**`Example`**

```typescript
// 단일 상품 주문
const simpleOrder = await orderService.createOrder({
  userId: 'USER999',
  items: [
    { productId: 'BOOK001', name: '프로그래밍 책', quantity: 1, price: 35000 }
  ]
});
```

**`Since`**

1.0.0

#### Defined in

[order.service.ts:161](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L161)

___

### getOrderById

▸ **getOrderById**(`orderId`, `requesterId`): `Promise`\<[`Order`](../interfaces/Order.md)\>

주문 ID로 주문 정보를 조회합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | 조회할 주문 ID |
| `requesterId` | `string` | 요청자 ID (본인 주문이거나 관리자만 조회 가능) |

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

주문 정보를 포함하는 Promise

**`Throws`**

[InvalidOrderError](InvalidOrderError.md) 주문을 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
try {
  const order = await orderService.getOrderById('ORDER123456789', 'USER123');
  
  console.log('Order details:');
  console.log('Status:', order.status);
  console.log('Total:', order.totalAmount);
  console.log('Items:', order.items.length);
  
  order.items.forEach(item => {
    console.log(`- ${item.name}: ${item.quantity}개 x ${item.price}원`);
  });
} catch (error) {
  if (error instanceof InvalidOrderError) {
    console.error('Order not found');
  }
}
```

**`Since`**

1.0.0

#### Defined in

[order.service.ts:222](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L222)

___

### getUserOrders

▸ **getUserOrders**(`userId`, `filter?`, `requesterId`): `Promise`\<[`Order`](../interfaces/Order.md)[]\>

사용자의 주문 목록을 조회합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 사용자 ID |
| `filter` | [`OrderSearchFilter`](../interfaces/OrderSearchFilter.md) | 검색 필터 |
| `requesterId` | `string` | 요청자 ID |

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)[]\>

주문 목록을 포함하는 Promise

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
// 사용자의 모든 주문 조회
const orders = await orderService.getUserOrders('USER123', {}, 'USER123');
console.log(`Found ${orders.length} orders`);

// 특정 상태의 주문만 조회
const paidOrders = await orderService.getUserOrders('USER123', {
  status: 'paid'
}, 'USER123');
```

**`Example`**

```typescript
// 날짜 범위로 주문 조회
const recentOrders = await orderService.getUserOrders('USER123', {
  createdAfter: new Date('2024-01-01'),
  createdBefore: new Date('2024-12-31')
}, 'ADMIN001');
```

**`Since`**

1.0.0

#### Defined in

[order.service.ts:267](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L267)

___

### updateOrderStatus

▸ **updateOrderStatus**(`orderId`, `status`, `requesterId`): `Promise`\<[`Order`](../interfaces/Order.md)\>

주문 상태를 업데이트합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | 주문 ID |
| `status` | [`OrderStatus`](../modules.md#orderstatus) | 새로운 상태 |
| `requesterId` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

업데이트된 주문 정보를 포함하는 Promise

**`Throws`**

[InvalidOrderError](InvalidOrderError.md) 주문을 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Throws`**

[ValidationError](ValidationError.md) 상태 변경이 유효하지 않을 때

**`Example`**

```typescript
// 주문을 결제 완료 상태로 변경
const updatedOrder = await orderService.updateOrderStatus(
  'ORDER123456789', 
  'paid', 
  'ADMIN001'
);

console.log('Order status updated to:', updatedOrder.status);
```

**`Example`**

```typescript
// 상태 변경 시퀀스
const orderStatuses: OrderStatus[] = ['created', 'paid', 'shipped', 'delivered'];

for (const status of orderStatuses) {
  await orderService.updateOrderStatus('ORDER123', status, 'ADMIN001');
  console.log(`Status updated to: ${status}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
}
```

**`Since`**

1.0.0

#### Defined in

[order.service.ts:317](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L317)

___

### cancelOrder

▸ **cancelOrder**(`orderId`, `requesterId`): `Promise`\<[`Order`](../interfaces/Order.md)\>

주문을 취소합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | 취소할 주문 ID |
| `requesterId` | `string` | 요청자 ID |

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

취소된 주문 정보를 포함하는 Promise

**`Throws`**

[InvalidOrderError](InvalidOrderError.md) 주문을 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Throws`**

[ValidationError](ValidationError.md) 취소할 수 없는 상태일 때

**`Example`**

```typescript
try {
  const cancelledOrder = await orderService.cancelOrder('ORDER123', 'USER123');
  console.log('Order cancelled:', cancelledOrder.orderId);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Cannot cancel order:', error.message);
  }
}
```

**`Since`**

1.0.0

#### Defined in

[order.service.ts:363](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L363)

___

### searchOrders

▸ **searchOrders**(`filter`, `requesterId?`): `Promise`\<[`Order`](../interfaces/Order.md)[]\>

주문 검색을 수행합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | [`OrderSearchFilter`](../interfaces/OrderSearchFilter.md) | 검색 필터 |
| `requesterId?` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)[]\>

검색된 주문 목록을 포함하는 Promise

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
// 특정 금액 범위의 주문 검색
const expensiveOrders = await orderService.searchOrders({
  minAmount: 100000,
  maxAmount: 1000000,
  status: 'paid'
}, 'ADMIN001');

console.log(`Found ${expensiveOrders.length} expensive orders`);
```

**`Since`**

1.0.0

#### Defined in

[order.service.ts:397](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L397)

___

### getOrderStatistics

▸ **getOrderStatistics**(`startDate`, `endDate`, `requesterId`): `Promise`\<[`OrderStatistics`](../interfaces/OrderStatistics.md)\>

주문 통계를 조회합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startDate` | `Date` | 조회 시작일 |
| `endDate` | `Date` | 조회 종료일 |
| `requesterId` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<[`OrderStatistics`](../interfaces/OrderStatistics.md)\>

주문 통계 정보를 포함하는 Promise

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
const stats = await orderService.getOrderStatistics(
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  'ADMIN001'
);

console.log('Order Statistics:');
console.log('Total Orders:', stats.totalOrders);
console.log('Total Amount:', stats.totalAmount.toLocaleString());
console.log('Average Order:', stats.averageOrderAmount.toLocaleString());
console.log('By Status:', stats.ordersByStatus);
```

**`Since`**

1.1.0

#### Defined in

[order.service.ts:442](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L442)

___

### validateOrderData

▸ **validateOrderData**(`orderData`): `void`

주문 데이터 유효성을 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderData` | [`CreateOrderRequest`](../interfaces/CreateOrderRequest.md) | 검증할 주문 데이터 |

#### Returns

`void`

**`Throws`**

[ValidationError](ValidationError.md) 데이터가 유효하지 않을 때

#### Defined in

[order.service.ts:484](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L484)

___

### validateUser

▸ **validateUser**(`userId`): `Promise`\<`void`\>

사용자 존재를 확인하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 확인할 사용자 ID |

#### Returns

`Promise`\<`void`\>

**`Throws`**

[UserNotFoundError](UserNotFoundError.md) 사용자를 찾을 수 없을 때

#### Defined in

[order.service.ts:516](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L516)

___

### validateInventory

▸ **validateInventory**(`items`): `Promise`\<`void`\>

상품 재고를 확인하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | [`OrderItem`](../interfaces/OrderItem.md)[] | 확인할 상품 목록 |

#### Returns

`Promise`\<`void`\>

**`Throws`**

[ValidationError](ValidationError.md) 재고가 부족할 때

#### Defined in

[order.service.ts:532](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L532)

___

### calculateTotalAmount

▸ **calculateTotalAmount**(`items`): `number`

총 주문 금액을 계산하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | [`OrderItem`](../interfaces/OrderItem.md)[] | 주문 상품 목록 |

#### Returns

`number`

총 금액

#### Defined in

[order.service.ts:549](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L549)

___

### validateOrderAccess

▸ **validateOrderAccess**(`order`, `requesterId`): `Promise`\<`void`\>

주문 접근 권한을 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](../interfaces/Order.md) | 주문 정보 |
| `requesterId` | `string` | 요청자 ID |

#### Returns

`Promise`\<`void`\>

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

#### Defined in

[order.service.ts:561](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L561)

___

### validateStatusTransition

▸ **validateStatusTransition**(`currentStatus`, `newStatus`): `void`

상태 변경이 유효한지 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currentStatus` | [`OrderStatus`](../modules.md#orderstatus) | 현재 상태 |
| `newStatus` | [`OrderStatus`](../modules.md#orderstatus) | 새로운 상태 |

#### Returns

`void`

**`Throws`**

[ValidationError](ValidationError.md) 유효하지 않은 상태 변경

#### Defined in

[order.service.ts:578](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L578)

___

### isAdmin

▸ **isAdmin**(`userId`): `Promise`\<`boolean`\>

관리자 권한을 확인하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 확인할 사용자 ID |

#### Returns

`Promise`\<`boolean`\>

관리자 여부

#### Defined in

[order.service.ts:599](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L599)

___

### findOrderById

▸ **findOrderById**(`_orderId`): `Promise`\<``null`` \| [`Order`](../interfaces/Order.md)\>

주문 ID로 주문을 찾는 내부 메서드

#### Parameters

| Name | Type |
| :------ | :------ |
| `_orderId` | `string` |

#### Returns

`Promise`\<``null`` \| [`Order`](../interfaces/Order.md)\>

주문 정보 또는 null

#### Defined in

[order.service.ts:611](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L611)

___

### generateMockOrders

▸ **generateMockOrders**(`count`): [`Order`](../interfaces/Order.md)[]

모의 주문 데이터를 생성하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `count` | `number` | 생성할 주문 수 |

#### Returns

[`Order`](../interfaces/Order.md)[]

모의 주문 배열

#### Defined in

[order.service.ts:629](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L629)
