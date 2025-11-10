[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / ApiResponse

# Interface: ApiResponse\<T\>

API 응답 기본 형태

**`Example`**

```typescript
const response: ApiResponse<User> = {
  success: true,
  data: {
    userId: 'USER001',
    email: 'user@example.com',
    name: '김철수',
    role: 'user',
    createdAt: new Date(),
    isActive: true
  },
  timestamp: new Date()
};
```

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | 응답 데이터의 타입 |

## Table of contents

### Properties

- [success](ApiResponse.md#success)
- [data](ApiResponse.md#data)
- [error](ApiResponse.md#error)
- [errorCode](ApiResponse.md#errorcode)
- [timestamp](ApiResponse.md#timestamp)

## Properties

### success

• **success**: `boolean`

요청 성공 여부

#### Defined in

[types.ts:252](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L252)

___

### data

• `Optional` **data**: `T`

응답 데이터

#### Defined in

[types.ts:254](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L254)

___

### error

• `Optional` **error**: `string`

에러 메시지 (실패 시)

#### Defined in

[types.ts:256](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L256)

___

### errorCode

• `Optional` **errorCode**: `string`

에러 코드 (실패 시)

#### Defined in

[types.ts:258](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L258)

___

### timestamp

• **timestamp**: `Date`

응답 시각

#### Defined in

[types.ts:260](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L260)
