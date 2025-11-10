[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / ApiService

# Class: ApiService

통합 API 클래스

모든 서비스들을 하나의 클래스로 통합하여 제공합니다.
각 서비스는 개별적으로도 사용할 수 있지만, 이 클래스를 통해
통합된 API 인터페이스를 제공받을 수 있습니다.

**`Example`**

```typescript
const api = new ApiService();

// 사용자 생성
const user = await api.users.createUser({
  email: 'user@example.com',
  name: '사용자',
  password: 'password123'
}, 'ADMIN001');

// 주문 생성
const order = await api.orders.createOrder({
  userId: user.userId,
  items: [{ productId: 'PROD001', name: 'Product', quantity: 1, price: 10000 }]
});

// 결제 처리
const payment = await api.payments.processPayment(order.orderId, {
  type: 'card',
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 2025,
  cvv: '123'
});
```

**`Since`**

1.0.0

## Table of contents

### Constructors

- [constructor](ApiService.md#constructor)

### Properties

- [payments](ApiService.md#payments)
- [users](ApiService.md#users)
- [orders](ApiService.md#orders)

### Methods

- [getStatus](ApiService.md#getstatus)

## Constructors

### constructor

• **new ApiService**(`config?`): [`ApiService`](ApiService.md)

ApiService 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | API 설정 옵션 |
| `config.paymentApiKey?` | `string` | 결제 API 키 |
| `config.paymentApiUrl?` | `string` | 결제 API URL |

#### Returns

[`ApiService`](ApiService.md)

**`Example`**

```typescript
// 기본 설정으로 초기화
const api = new ApiService();

// 커스텀 설정으로 초기화
const customApi = new ApiService({
  paymentApiKey: 'custom-key',
  paymentApiUrl: 'https://custom-payment-api.com'
});
```

#### Defined in

[index.ts:100](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/index.ts#L100)

## Properties

### payments

• `Readonly` **payments**: [`PaymentService`](PaymentService.md)

결제 서비스 인스턴스

#### Defined in

[index.ts:73](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/index.ts#L73)

___

### users

• `Readonly` **users**: [`UserService`](UserService.md)

사용자 서비스 인스턴스

#### Defined in

[index.ts:76](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/index.ts#L76)

___

### orders

• `Readonly` **orders**: [`OrderService`](OrderService.md)

주문 서비스 인스턴스

#### Defined in

[index.ts:79](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/index.ts#L79)

## Methods

### getStatus

▸ **getStatus**(): `Promise`\<\{ `status`: ``"healthy"`` \| ``"degraded"`` \| ``"down"`` ; `services`: \{ `payments`: `boolean` ; `users`: `boolean` ; `orders`: `boolean`  } ; `timestamp`: `Date`  }\>

API 서비스의 상태를 확인합니다

#### Returns

`Promise`\<\{ `status`: ``"healthy"`` \| ``"degraded"`` \| ``"down"`` ; `services`: \{ `payments`: `boolean` ; `users`: `boolean` ; `orders`: `boolean`  } ; `timestamp`: `Date`  }\>

서비스 상태 정보를 포함하는 Promise

**`Example`**

```typescript
const status = await api.getStatus();
console.log('API Status:', status);
```

**`Since`**

1.0.0

#### Defined in

[index.ts:122](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/index.ts#L122)
