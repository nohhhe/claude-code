[API Documentation - v1.0.0](README.md) / Exports

# API Documentation - v1.0.0

**`Fileoverview`**

API 서비스들의 메인 엔트리 포인트

## Table of contents

### Classes

- [ApiError](classes/ApiError.md)
- [PaymentFailedError](classes/PaymentFailedError.md)
- [InvalidOrderError](classes/InvalidOrderError.md)
- [RefundFailedError](classes/RefundFailedError.md)
- [PaymentNotFoundError](classes/PaymentNotFoundError.md)
- [UserNotFoundError](classes/UserNotFoundError.md)
- [UnauthorizedError](classes/UnauthorizedError.md)
- [ValidationError](classes/ValidationError.md)
- [ApiService](classes/ApiService.md)
- [OrderService](classes/OrderService.md)
- [PaymentService](classes/PaymentService.md)
- [UserService](classes/UserService.md)

### Interfaces

- [CreateOrderRequest](interfaces/CreateOrderRequest.md)
- [UpdateOrderRequest](interfaces/UpdateOrderRequest.md)
- [OrderSearchFilter](interfaces/OrderSearchFilter.md)
- [OrderStatistics](interfaces/OrderStatistics.md)
- [PaymentMethod](interfaces/PaymentMethod.md)
- [PaymentResult](interfaces/PaymentResult.md)
- [RefundResult](interfaces/RefundResult.md)
- [PaymentStatus](interfaces/PaymentStatus.md)
- [Order](interfaces/Order.md)
- [OrderItem](interfaces/OrderItem.md)
- [User](interfaces/User.md)
- [ApiResponse](interfaces/ApiResponse.md)
- [CreateUserRequest](interfaces/CreateUserRequest.md)
- [UpdateUserRequest](interfaces/UpdateUserRequest.md)
- [UserSearchFilter](interfaces/UserSearchFilter.md)
- [PaginationOptions](interfaces/PaginationOptions.md)
- [PaginatedResult](interfaces/PaginatedResult.md)

### Type Aliases

- [PaymentType](modules.md#paymenttype)
- [PaymentState](modules.md#paymentstate)
- [OrderStatus](modules.md#orderstatus)
- [UserRole](modules.md#userrole)

## Type Aliases

### PaymentType

Ƭ **PaymentType**: ``"card"`` \| ``"bank"`` \| ``"wallet"`` \| ``"crypto"``

결제 방법 유형

#### Defined in

[types.ts:9](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L9)

___

### PaymentState

Ƭ **PaymentState**: ``"pending"`` \| ``"processing"`` \| ``"completed"`` \| ``"failed"`` \| ``"cancelled"``

결제 상태

#### Defined in

[types.ts:14](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L14)

___

### OrderStatus

Ƭ **OrderStatus**: ``"created"`` \| ``"paid"`` \| ``"shipped"`` \| ``"delivered"`` \| ``"cancelled"``

주문 상태

#### Defined in

[types.ts:19](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L19)

___

### UserRole

Ƭ **UserRole**: ``"admin"`` \| ``"user"`` \| ``"manager"`` \| ``"guest"``

사용자 역할

#### Defined in

[types.ts:24](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L24)
