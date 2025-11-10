[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / OrderSearchFilter

# Interface: OrderSearchFilter

주문 검색 필터

## Table of contents

### Properties

- [userId](OrderSearchFilter.md#userid)
- [status](OrderSearchFilter.md#status)
- [minAmount](OrderSearchFilter.md#minamount)
- [maxAmount](OrderSearchFilter.md#maxamount)
- [createdAfter](OrderSearchFilter.md#createdafter)
- [createdBefore](OrderSearchFilter.md#createdbefore)

## Properties

### userId

• `Optional` **userId**: `string`

사용자 ID

#### Defined in

[order.service.ts:40](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L40)

___

### status

• `Optional` **status**: [`OrderStatus`](../modules.md#orderstatus)

주문 상태

#### Defined in

[order.service.ts:42](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L42)

___

### minAmount

• `Optional` **minAmount**: `number`

최소 주문 금액

#### Defined in

[order.service.ts:44](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L44)

___

### maxAmount

• `Optional` **maxAmount**: `number`

최대 주문 금액

#### Defined in

[order.service.ts:46](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L46)

___

### createdAfter

• `Optional` **createdAfter**: `Date`

주문 생성일 범위 시작

#### Defined in

[order.service.ts:48](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L48)

___

### createdBefore

• `Optional` **createdBefore**: `Date`

주문 생성일 범위 종료

#### Defined in

[order.service.ts:50](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L50)
