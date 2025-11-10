[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / RefundResult

# Interface: RefundResult

환불 처리 결과

**`Example`**

```typescript
const refundResult: RefundResult = {
  success: true,
  refundId: 'REF123456789',
  originalPaymentId: 'PAY123456789',
  refundAmount: 10000,
  processedAt: new Date()
};
```

## Table of contents

### Properties

- [success](RefundResult.md#success)
- [refundId](RefundResult.md#refundid)
- [originalPaymentId](RefundResult.md#originalpaymentid)
- [refundAmount](RefundResult.md#refundamount)
- [processedAt](RefundResult.md#processedat)
- [errorMessage](RefundResult.md#errormessage)

## Properties

### success

• **success**: `boolean`

환불 성공 여부

#### Defined in

[types.ts:102](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L102)

___

### refundId

• **refundId**: `string`

환불 ID

#### Defined in

[types.ts:104](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L104)

___

### originalPaymentId

• **originalPaymentId**: `string`

원본 결제 ID

#### Defined in

[types.ts:106](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L106)

___

### refundAmount

• **refundAmount**: `number`

환불 금액

#### Defined in

[types.ts:108](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L108)

___

### processedAt

• **processedAt**: `Date`

환불 처리 시각

#### Defined in

[types.ts:110](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L110)

___

### errorMessage

• `Optional` **errorMessage**: `string`

에러 메시지 (실패 시)

#### Defined in

[types.ts:112](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L112)
