[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / PaymentMethod

# Interface: PaymentMethod

결제 수단 정보

**`Example`**

```typescript
const cardPayment: PaymentMethod = {
  type: 'card',
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 2025,
  cvv: '123'
};
```

## Table of contents

### Properties

- [type](PaymentMethod.md#type)
- [cardNumber](PaymentMethod.md#cardnumber)
- [expiryMonth](PaymentMethod.md#expirymonth)
- [expiryYear](PaymentMethod.md#expiryyear)
- [cvv](PaymentMethod.md#cvv)
- [bankAccount](PaymentMethod.md#bankaccount)
- [walletId](PaymentMethod.md#walletid)

## Properties

### type

• **type**: [`PaymentType`](../modules.md#paymenttype)

결제 방법 유형

#### Defined in

[types.ts:42](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L42)

___

### cardNumber

• `Optional` **cardNumber**: `string`

카드 번호 (카드 결제 시 필수)

#### Defined in

[types.ts:44](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L44)

___

### expiryMonth

• `Optional` **expiryMonth**: `number`

카드 만료 월 (카드 결제 시 필수)

#### Defined in

[types.ts:46](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L46)

___

### expiryYear

• `Optional` **expiryYear**: `number`

카드 만료 연도 (카드 결제 시 필수)

#### Defined in

[types.ts:48](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L48)

___

### cvv

• `Optional` **cvv**: `string`

CVV 번호 (카드 결제 시 필수)

#### Defined in

[types.ts:50](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L50)

___

### bankAccount

• `Optional` **bankAccount**: `string`

은행 계좌 정보 (계좌 이체 시 필수)

#### Defined in

[types.ts:52](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L52)

___

### walletId

• `Optional` **walletId**: `string`

전자지갑 ID (전자지갑 결제 시 필수)

#### Defined in

[types.ts:54](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L54)
