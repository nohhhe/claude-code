[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / PaymentNotFoundError

# Class: PaymentNotFoundError

결제 정보를 찾을 수 없는 에러

**`Example`**

```typescript
throw new PaymentNotFoundError('Payment ID: PAY123');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`PaymentNotFoundError`**

## Table of contents

### Constructors

- [constructor](PaymentNotFoundError.md#constructor)

### Properties

- [statusCode](PaymentNotFoundError.md#statuscode)
- [errorCode](PaymentNotFoundError.md#errorcode)

## Constructors

### constructor

• **new PaymentNotFoundError**(`paymentId`): [`PaymentNotFoundError`](PaymentNotFoundError.md)

PaymentNotFoundError 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | 찾을 수 없는 결제 ID |

#### Returns

[`PaymentNotFoundError`](PaymentNotFoundError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:110](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L110)

## Properties

### statusCode

• **statusCode**: `number`

HTTP 상태 코드

#### Inherited from

[ApiError](ApiError.md).[statusCode](ApiError.md#statuscode)

#### Defined in

[errors.ts:16](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L16)

___

### errorCode

• **errorCode**: `string`

에러 코드

#### Inherited from

[ApiError](ApiError.md).[errorCode](ApiError.md#errorcode)

#### Defined in

[errors.ts:18](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L18)
