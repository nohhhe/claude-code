[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / UnauthorizedError

# Class: UnauthorizedError

권한 없음 에러

**`Example`**

```typescript
throw new UnauthorizedError('Admin access required');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`UnauthorizedError`**

## Table of contents

### Constructors

- [constructor](UnauthorizedError.md#constructor)

### Properties

- [statusCode](UnauthorizedError.md#statuscode)
- [errorCode](UnauthorizedError.md#errorcode)

## Constructors

### constructor

• **new UnauthorizedError**(`message?`): [`UnauthorizedError`](UnauthorizedError.md)

UnauthorizedError 생성자

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `'Unauthorized access'` | 권한 에러 메시지 |

#### Returns

[`UnauthorizedError`](UnauthorizedError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:150](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L150)

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
