[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / PaymentFailedError

# Class: PaymentFailedError

결제 실패 에러

**`Example`**

```typescript
throw new PaymentFailedError('Card declined');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`PaymentFailedError`**

## Table of contents

### Constructors

- [constructor](PaymentFailedError.md#constructor)

### Properties

- [statusCode](PaymentFailedError.md#statuscode)
- [errorCode](PaymentFailedError.md#errorcode)

## Constructors

### constructor

• **new PaymentFailedError**(`message`, `errorCode?`): [`PaymentFailedError`](PaymentFailedError.md)

PaymentFailedError 생성자

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | 결제 실패 사유 |
| `errorCode` | `string` | `'PAYMENT_FAILED'` | 세부 에러 코드 |

#### Returns

[`PaymentFailedError`](PaymentFailedError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:50](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L50)

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
