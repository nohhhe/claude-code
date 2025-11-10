[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / PaymentResult

# Interface: PaymentResult

결제 처리 결과

**`Example`**

```typescript
const paymentResult: PaymentResult = {
  success: true,
  transactionId: 'TXN123456789',
  amount: 25000,
  currency: 'KRW',
  processedAt: new Date()
};
```

## Table of contents

### Properties

- [success](PaymentResult.md#success)
- [transactionId](PaymentResult.md#transactionid)
- [amount](PaymentResult.md#amount)
- [currency](PaymentResult.md#currency)
- [processedAt](PaymentResult.md#processedat)
- [errorMessage](PaymentResult.md#errormessage)

## Properties

### success

• **success**: `boolean`

결제 성공 여부

#### Defined in

[types.ts:73](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L73)

___

### transactionId

• **transactionId**: `string`

트랜잭션 ID

#### Defined in

[types.ts:75](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L75)

___

### amount

• **amount**: `number`

결제 금액

#### Defined in

[types.ts:77](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L77)

___

### currency

• **currency**: `string`

통화 코드

#### Defined in

[types.ts:79](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L79)

___

### processedAt

• **processedAt**: `Date`

결제 처리 시각

#### Defined in

[types.ts:81](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L81)

___

### errorMessage

• `Optional` **errorMessage**: `string`

에러 메시지 (실패 시)

#### Defined in

[types.ts:83](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L83)
