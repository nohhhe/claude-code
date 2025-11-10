[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / RefundFailedError

# Class: RefundFailedError

환불 실패 에러

**`Example`**

```typescript
throw new RefundFailedError('Refund period expired');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`RefundFailedError`**

## Table of contents

### Constructors

- [constructor](RefundFailedError.md#constructor)

### Properties

- [statusCode](RefundFailedError.md#statuscode)
- [errorCode](RefundFailedError.md#errorcode)

## Constructors

### constructor

• **new RefundFailedError**(`message`): [`RefundFailedError`](RefundFailedError.md)

RefundFailedError 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 환불 실패 사유 |

#### Returns

[`RefundFailedError`](RefundFailedError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:90](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L90)

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
