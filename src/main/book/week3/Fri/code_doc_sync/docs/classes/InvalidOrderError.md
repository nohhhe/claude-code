[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / InvalidOrderError

# Class: InvalidOrderError

유효하지 않은 주문 에러

**`Example`**

```typescript
throw new InvalidOrderError('Order not found');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`InvalidOrderError`**

## Table of contents

### Constructors

- [constructor](InvalidOrderError.md#constructor)

### Properties

- [statusCode](InvalidOrderError.md#statuscode)
- [errorCode](InvalidOrderError.md#errorcode)

## Constructors

### constructor

• **new InvalidOrderError**(`message`): [`InvalidOrderError`](InvalidOrderError.md)

InvalidOrderError 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 에러 메시지 |

#### Returns

[`InvalidOrderError`](InvalidOrderError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:70](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L70)

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
