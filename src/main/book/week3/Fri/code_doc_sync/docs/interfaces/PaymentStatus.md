[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / PaymentStatus

# Interface: PaymentStatus

결제 상태 정보

**`Example`**

```typescript
const paymentStatus: PaymentStatus = {
  paymentId: 'PAY123456789',
  state: 'completed',
  amount: 25000,
  currency: 'KRW',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  completedAt: new Date('2023-01-01T00:05:00Z')
};
```

## Table of contents

### Properties

- [paymentId](PaymentStatus.md#paymentid)
- [state](PaymentStatus.md#state)
- [amount](PaymentStatus.md#amount)
- [currency](PaymentStatus.md#currency)
- [createdAt](PaymentStatus.md#createdat)
- [completedAt](PaymentStatus.md#completedat)
- [failureReason](PaymentStatus.md#failurereason)

## Properties

### paymentId

• **paymentId**: `string`

결제 ID

#### Defined in

[types.ts:132](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L132)

___

### state

• **state**: [`PaymentState`](../modules.md#paymentstate)

현재 상태

#### Defined in

[types.ts:134](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L134)

___

### amount

• **amount**: `number`

결제 금액

#### Defined in

[types.ts:136](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L136)

___

### currency

• **currency**: `string`

통화 코드

#### Defined in

[types.ts:138](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L138)

___

### createdAt

• **createdAt**: `Date`

결제 생성 시각

#### Defined in

[types.ts:140](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L140)

___

### completedAt

• `Optional` **completedAt**: `Date`

결제 완료 시각 (완료된 경우)

#### Defined in

[types.ts:142](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L142)

___

### failureReason

• `Optional` **failureReason**: `string`

실패 사유 (실패한 경우)

#### Defined in

[types.ts:144](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L144)
