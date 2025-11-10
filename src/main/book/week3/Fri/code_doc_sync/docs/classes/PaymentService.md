[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / PaymentService

# Class: PaymentService

결제 처리를 담당하는 서비스 클래스

이 클래스는 다양한 결제 방식을 지원하며, 결제 처리, 환불, 상태 조회 기능을 제공합니다.
모든 메서드는 비동기로 작동하며, 적절한 에러 처리를 포함하고 있습니다.

**`Example`**

```typescript
const paymentService = new PaymentService();
const result = await paymentService.processPayment('ORDER123', {
  type: 'card',
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 2025,
  cvv: '123'
});

if (result.success) {
  console.log(`Payment successful: ${result.transactionId}`);
}
```

**`Since`**

1.0.0

## Table of contents

### Constructors

- [constructor](PaymentService.md#constructor)

### Properties

- [\_apiKey](PaymentService.md#_apikey)
- [\_baseUrl](PaymentService.md#_baseurl)

### Methods

- [processPayment](PaymentService.md#processpayment)
- [refund](PaymentService.md#refund)
- [getPaymentStatus](PaymentService.md#getpaymentstatus)
- [getBatchPaymentStatus](PaymentService.md#getbatchpaymentstatus)
- [validateOrder](PaymentService.md#validateorder)
- [validatePaymentMethod](PaymentService.md#validatepaymentmethod)
- [getOrderAmount](PaymentService.md#getorderamount)

## Constructors

### constructor

• **new PaymentService**(`apiKey?`, `baseUrl?`): [`PaymentService`](PaymentService.md)

PaymentService 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey?` | `string` | 결제 API 키 (기본값: 환경변수에서 로드) |
| `baseUrl?` | `string` | API 기본 URL (기본값: 환경변수에서 로드) |

#### Returns

[`PaymentService`](PaymentService.md)

**`Example`**

```typescript
// 기본 설정 사용
const paymentService = new PaymentService();

// 커스텀 설정 사용
const customPaymentService = new PaymentService('custom-api-key', 'https://api.example.com');
```

#### Defined in

[payment.service.ts:52](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L52)

## Properties

### \_apiKey

• `Private` `Readonly` **\_apiKey**: `string`

#### Defined in

[payment.service.ts:34](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L34)

___

### \_baseUrl

• `Private` `Readonly` **\_baseUrl**: `string`

#### Defined in

[payment.service.ts:35](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L35)

## Methods

### processPayment

▸ **processPayment**(`orderId`, `paymentMethod`): `Promise`\<[`PaymentResult`](../interfaces/PaymentResult.md)\>

주문에 대한 결제를 처리합니다

이 메서드는 다양한 결제 수단(카드, 계좌이체, 전자지갑, 암호화폐)을 지원하며,
결제 처리 결과를 반환합니다. 결제 실패 시 적절한 에러를 발생시킵니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | 결제할 주문의 고유 식별자 |
| `paymentMethod` | [`PaymentMethod`](../interfaces/PaymentMethod.md) | 결제 수단 정보 |

#### Returns

`Promise`\<[`PaymentResult`](../interfaces/PaymentResult.md)\>

결제 처리 결과를 포함하는 Promise

**`Throws`**

[PaymentFailedError](PaymentFailedError.md) 결제 처리 실패 시

**`Throws`**

[InvalidOrderError](InvalidOrderError.md) 유효하지 않은 주문 ID

**`Throws`**

[ValidationError](ValidationError.md) 결제 수단 정보가 유효하지 않을 때

**`Example`**

```typescript
// 카드 결제
try {
  const result = await paymentService.processPayment('ORDER123', {
    type: 'card',
    cardNumber: '4242424242424242',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '123'
  });
  console.log('Payment successful:', result.transactionId);
} catch (error) {
  if (error instanceof PaymentFailedError) {
    console.error('Payment failed:', error.message);
  } else if (error instanceof InvalidOrderError) {
    console.error('Invalid order:', error.message);
  }
}
```

**`Example`**

```typescript
// 계좌이체 결제
const bankPaymentResult = await paymentService.processPayment('ORDER456', {
  type: 'bank',
  bankAccount: '123-456-789'
});
```

**`Example`**

```typescript
// 전자지갑 결제
const walletPaymentResult = await paymentService.processPayment('ORDER789', {
  type: 'wallet',
  walletId: 'WALLET123'
});
```

**`Since`**

1.0.0

#### Defined in

[payment.service.ts:112](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L112)

___

### refund

▸ **refund**(`paymentId`, `amount?`): `Promise`\<[`RefundResult`](../interfaces/RefundResult.md)\>

결제 건에 대한 환불을 처리합니다

전액 환불 또는 부분 환불을 지원하며, 환불 처리 결과를 반환합니다.
환불 가능 여부는 결제 완료 후 30일 이내, 환불 금액은 원래 결제 금액을 초과할 수 없습니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | 환불할 결제의 고유 식별자 |
| `amount?` | `number` | 환불 금액 (지정하지 않으면 전액 환불) |

#### Returns

`Promise`\<[`RefundResult`](../interfaces/RefundResult.md)\>

환불 처리 결과를 포함하는 Promise

**`Throws`**

[RefundFailedError](RefundFailedError.md) 환불 처리 실패 시

**`Throws`**

[PaymentNotFoundError](PaymentNotFoundError.md) 결제 정보를 찾을 수 없음

**`Example`**

```typescript
// 전액 환불
try {
  const fullRefund = await paymentService.refund('PAY123456789');
  console.log('Full refund processed:', fullRefund.refundId);
} catch (error) {
  console.error('Refund failed:', error.message);
}
```

**`Example`**

```typescript
// 부분 환불
const partialRefund = await paymentService.refund('PAY123456789', 5000);
console.log('Partial refund of 5000 processed:', partialRefund.refundId);
```

**`Example`**

```typescript
// 환불 실패 처리
try {
  await paymentService.refund('INVALID_PAYMENT_ID');
} catch (error) {
  if (error instanceof PaymentNotFoundError) {
    console.error('Payment not found for refund');
  } else if (error instanceof RefundFailedError) {
    console.error('Refund failed:', error.message);
  }
}
```

**`Since`**

1.0.0

#### Defined in

[payment.service.ts:193](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L193)

___

### getPaymentStatus

▸ **getPaymentStatus**(`paymentId`): `Promise`\<[`PaymentStatus`](../interfaces/PaymentStatus.md)\>

결제 상태를 조회합니다

지정된 결제 ID의 현재 상태, 금액, 처리 시간 등의 정보를 반환합니다.
결제 상태는 실시간으로 업데이트되며, 결제 진행 상황을 추적할 수 있습니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | 조회할 결제의 고유 식별자 |

#### Returns

`Promise`\<[`PaymentStatus`](../interfaces/PaymentStatus.md)\>

현재 결제 상태 정보를 포함하는 Promise

**`Throws`**

[PaymentNotFoundError](PaymentNotFoundError.md) 결제 정보를 찾을 수 없음

**`Example`**

```typescript
// 결제 상태 조회
try {
  const status = await paymentService.getPaymentStatus('PAY123456789');
  
  switch (status.state) {
    case 'completed':
      console.log('Payment completed at:', status.completedAt);
      break;
    case 'pending':
      console.log('Payment is still pending');
      break;
    case 'failed':
      console.log('Payment failed:', status.failureReason);
      break;
  }
} catch (error) {
  console.error('Payment not found:', error.message);
}
```

**`Example`**

```typescript
// 결제 완료 대기
const waitForCompletion = async (paymentId: string) => {
  const maxAttempts = 10;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const status = await paymentService.getPaymentStatus(paymentId);
    
    if (status.state === 'completed') {
      return status;
    } else if (status.state === 'failed') {
      throw new Error('Payment failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error('Payment timeout');
};
```

**`Since`**

1.0.0

#### Defined in

[payment.service.ts:286](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L286)

___

### getBatchPaymentStatus

▸ **getBatchPaymentStatus**(`paymentIds`): `Promise`\<[`PaymentStatus`](../interfaces/PaymentStatus.md)[]\>

여러 결제의 상태를 일괄 조회합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentIds` | `string`[] | 조회할 결제 ID 목록 |

#### Returns

`Promise`\<[`PaymentStatus`](../interfaces/PaymentStatus.md)[]\>

결제 상태 정보 배열을 포함하는 Promise

**`Example`**

```typescript
const statuses = await paymentService.getBatchPaymentStatus(['PAY123', 'PAY456', 'PAY789']);
statuses.forEach(status => {
  console.log(`Payment ${status.paymentId}: ${status.state}`);
});
```

**`Since`**

1.1.0

#### Defined in

[payment.service.ts:327](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L327)

___

### validateOrder

▸ **validateOrder**(`orderId`): `Promise`\<`void`\>

주문 유효성을 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | 검증할 주문 ID |

#### Returns

`Promise`\<`void`\>

**`Throws`**

[InvalidOrderError](InvalidOrderError.md) 주문이 유효하지 않을 때

#### Defined in

[payment.service.ts:350](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L350)

___

### validatePaymentMethod

▸ **validatePaymentMethod**(`paymentMethod`): `void`

결제 수단 유효성을 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentMethod` | [`PaymentMethod`](../interfaces/PaymentMethod.md) | 검증할 결제 수단 |

#### Returns

`void`

**`Throws`**

[ValidationError](ValidationError.md) 결제 수단이 유효하지 않을 때

#### Defined in

[payment.service.ts:370](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L370)

___

### getOrderAmount

▸ **getOrderAmount**(`_orderId`): `Promise`\<`number`\>

주문 금액을 조회하는 내부 메서드

#### Parameters

| Name | Type |
| :------ | :------ |
| `_orderId` | `string` |

#### Returns

`Promise`\<`number`\>

주문 금액

#### Defined in

[payment.service.ts:398](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/payment.service.ts#L398)
