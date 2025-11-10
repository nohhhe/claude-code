[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / CreateOrderRequest

# Interface: CreateOrderRequest

주문 생성 요청 데이터

## Table of contents

### Properties

- [userId](CreateOrderRequest.md#userid)
- [items](CreateOrderRequest.md#items)
- [shippingAddress](CreateOrderRequest.md#shippingaddress)
- [notes](CreateOrderRequest.md#notes)

## Properties

### userId

• **userId**: `string`

주문자 사용자 ID

#### Defined in

[order.service.ts:14](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L14)

___

### items

• **items**: [`OrderItem`](OrderItem.md)[]

주문 상품 목록

#### Defined in

[order.service.ts:16](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L16)

___

### shippingAddress

• `Optional` **shippingAddress**: `string`

배송지 주소

#### Defined in

[order.service.ts:18](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L18)

___

### notes

• `Optional` **notes**: `string`

주문 메모

#### Defined in

[order.service.ts:20](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/order.service.ts#L20)
