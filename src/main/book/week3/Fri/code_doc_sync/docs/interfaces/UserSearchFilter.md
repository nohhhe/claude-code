[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / UserSearchFilter

# Interface: UserSearchFilter

사용자 검색 필터

## Table of contents

### Properties

- [email](UserSearchFilter.md#email)
- [role](UserSearchFilter.md#role)
- [isActive](UserSearchFilter.md#isactive)
- [createdAfter](UserSearchFilter.md#createdafter)
- [createdBefore](UserSearchFilter.md#createdbefore)

## Properties

### email

• `Optional` **email**: `string`

이메일로 검색

#### Defined in

[user.service.ts:40](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L40)

___

### role

• `Optional` **role**: [`UserRole`](../modules.md#userrole)

역할로 필터링

#### Defined in

[user.service.ts:42](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L42)

___

### isActive

• `Optional` **isActive**: `boolean`

활성 상태로 필터링

#### Defined in

[user.service.ts:44](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L44)

___

### createdAfter

• `Optional` **createdAfter**: `Date`

생성일 범위 시작

#### Defined in

[user.service.ts:46](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L46)

___

### createdBefore

• `Optional` **createdBefore**: `Date`

생성일 범위 종료

#### Defined in

[user.service.ts:48](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L48)
