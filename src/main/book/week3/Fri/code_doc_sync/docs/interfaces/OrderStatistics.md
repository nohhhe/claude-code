[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / OrderStatistics

# Interface: OrderStatistics

주문 통계 정보

## Table of contents

### Properties

- [totalOrders](OrderStatistics.md#totalorders)
- [totalAmount](OrderStatistics.md#totalamount)
- [ordersByStatus](OrderStatistics.md#ordersbystatus)
- [averageOrderAmount](OrderStatistics.md#averageorderamount)
- [period](OrderStatistics.md#period)

## Properties

### totalOrders

• **totalOrders**: `number`

총 주문 수

#### Defined in

[order.service.ts:58](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L58)

___

### totalAmount

• **totalAmount**: `number`

총 주문 금액

#### Defined in

[order.service.ts:60](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L60)

___

### ordersByStatus

• **ordersByStatus**: `Record`\<[`OrderStatus`](../modules.md#orderstatus), `number`\>

상태별 주문 수

#### Defined in

[order.service.ts:62](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L62)

___

### averageOrderAmount

• **averageOrderAmount**: `number`

평균 주문 금액

#### Defined in

[order.service.ts:64](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L64)

___

### period

• **period**: `Object`

기간

#### Type declaration

| Name | Type |
| :------ | :------ |
| `startDate` | `Date` |
| `endDate` | `Date` |

#### Defined in

[order.service.ts:66](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L66)
