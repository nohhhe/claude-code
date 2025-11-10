[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / ValidationError

# Class: ValidationError

유효성 검증 실패 에러

**`Example`**

```typescript
throw new ValidationError('Invalid email format');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`ValidationError`**

## Table of contents

### Constructors

- [constructor](ValidationError.md#constructor)

### Properties

- [statusCode](ValidationError.md#statuscode)
- [errorCode](ValidationError.md#errorcode)

## Constructors

### constructor

• **new ValidationError**(`message`): [`ValidationError`](ValidationError.md)

ValidationError 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 유효성 검증 에러 메시지 |

#### Returns

[`ValidationError`](ValidationError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:170](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L170)

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
