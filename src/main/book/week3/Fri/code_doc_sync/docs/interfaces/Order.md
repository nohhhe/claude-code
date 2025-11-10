[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / Order

# Interface: Order

주문 정보

**`Example`**

```typescript
const order: Order = {
  orderId: 'ORDER123456789',
  userId: 'USER001',
  items: [
    { productId: 'PROD001', name: 'Product 1', quantity: 2, price: 10000 }
  ],
  totalAmount: 20000,
  status: 'created',
  createdAt: new Date()
};
```

## Table of contents

### Properties

- [orderId](Order.md#orderid)
- [userId](Order.md#userid)
- [items](Order.md#items)
- [totalAmount](Order.md#totalamount)
- [status](Order.md#status)
- [createdAt](Order.md#createdat)
- [updatedAt](Order.md#updatedat)

## Properties

### orderId

• **orderId**: `string`

주문 ID

#### Defined in

[types.ts:166](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L166)

___

### userId

• **userId**: `string`

사용자 ID

#### Defined in

[types.ts:168](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L168)

___

### items

• **items**: [`OrderItem`](OrderItem.md)[]

주문 상품 목록

#### Defined in

[types.ts:170](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L170)

___

### totalAmount

• **totalAmount**: `number`

총 주문 금액

#### Defined in

[types.ts:172](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L172)

___

### status

• **status**: [`OrderStatus`](../modules.md#orderstatus)

주문 상태

#### Defined in

[types.ts:174](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L174)

___

### createdAt

• **createdAt**: `Date`

주문 생성 시각

#### Defined in

[types.ts:176](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L176)

___

### updatedAt

• `Optional` **updatedAt**: `Date`

주문 업데이트 시각

#### Defined in

[types.ts:178](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L178)
