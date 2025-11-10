[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / UserNotFoundError

# Class: UserNotFoundError

사용자를 찾을 수 없는 에러

**`Example`**

```typescript
throw new UserNotFoundError('USER123');
```

## Hierarchy

- [`ApiError`](ApiError.md)

  ↳ **`UserNotFoundError`**

## Table of contents

### Constructors

- [constructor](UserNotFoundError.md#constructor)

### Properties

- [statusCode](UserNotFoundError.md#statuscode)
- [errorCode](UserNotFoundError.md#errorcode)

## Constructors

### constructor

• **new UserNotFoundError**(`userId`): [`UserNotFoundError`](UserNotFoundError.md)

UserNotFoundError 생성자

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 찾을 수 없는 사용자 ID |

#### Returns

[`UserNotFoundError`](UserNotFoundError.md)

#### Overrides

[ApiError](ApiError.md).[constructor](ApiError.md#constructor)

#### Defined in

[errors.ts:130](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/errors.ts#L130)

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
