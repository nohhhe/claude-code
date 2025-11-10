[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / ApiError

# Class: ApiError

API 기본 에러 클래스

**`Example`**

```typescript
throw new ApiError('Something went wrong', 500, 'INTERNAL_ERROR');
```

## Hierarchy

- `Error`

  ↳ **`ApiError`**

  ↳↳ [`PaymentFailedError`](PaymentFailedError.md)

  ↳↳ [`InvalidOrderError`](InvalidOrderError.md)

  ↳↳ [`RefundFailedError`](RefundFailedError.md)

  ↳↳ [`PaymentNotFoundError`](PaymentNotFoundError.md)

  ↳↳ [`UserNotFoundError`](UserNotFoundError.md)

  ↳↳ [`UnauthorizedError`](UnauthorizedError.md)

  ↳↳ [`ValidationError`](ValidationError.md)

## Table of contents

### Constructors

- [constructor](ApiError.md#constructor)

### Properties

- [statusCode](ApiError.md#statuscode)
- [errorCode](ApiError.md#errorcode)

## Constructors

### constructor

• **new ApiError**(`message`, `statusCode?`, `errorCode?`): [`ApiError`](ApiError.md)

ApiError 생성자

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | 에러 메시지 |
| `statusCode` | `number` | `500` | HTTP 상태 코드 |
| `errorCode` | `string` | `'UNKNOWN_ERROR'` | 에러 코드 |

#### Returns

[`ApiError`](ApiError.md)

#### Overrides

Error.constructor

#### Defined in

[errors.ts:27](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L27)

## Properties

### statusCode

• **statusCode**: `number`

HTTP 상태 코드

#### Defined in

[errors.ts:16](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L16)

___

### errorCode

• **errorCode**: `string`

에러 코드

#### Defined in

[errors.ts:18](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L18)
