[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / User

# Interface: User

사용자 정보

**`Example`**

```typescript
const user: User = {
  userId: 'USER001',
  email: 'user@example.com',
  name: '김철수',
  role: 'user',
  createdAt: new Date(),
  isActive: true
};
```

## Table of contents

### Properties

- [userId](User.md#userid)
- [email](User.md#email)
- [name](User.md#name)
- [role](User.md#role)
- [createdAt](User.md#createdat)
- [isActive](User.md#isactive)
- [lastLoginAt](User.md#lastloginat)
- [updatedAt](User.md#updatedat)

## Properties

### userId

• **userId**: `string`

사용자 ID

#### Defined in

[types.ts:212](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L212)

___

### email

• **email**: `string`

이메일

#### Defined in

[types.ts:214](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L214)

___

### name

• **name**: `string`

사용자명

#### Defined in

[types.ts:216](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L216)

___

### role

• **role**: [`UserRole`](../modules.md#userrole)

사용자 역할

#### Defined in

[types.ts:218](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L218)

___

### createdAt

• **createdAt**: `Date`

생성 시각

#### Defined in

[types.ts:220](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L220)

___

### isActive

• **isActive**: `boolean`

활성 상태

#### Defined in

[types.ts:222](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L222)

___

### lastLoginAt

• `Optional` **lastLoginAt**: `Date`

마지막 로그인 시각

#### Defined in

[types.ts:224](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L224)

___

### updatedAt

• `Optional` **updatedAt**: `Date`

수정 시각

#### Defined in

[types.ts:226](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/types.ts#L226)
