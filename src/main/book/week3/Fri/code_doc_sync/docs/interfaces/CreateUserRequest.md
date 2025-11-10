[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / CreateUserRequest

# Interface: CreateUserRequest

사용자 생성 시 필요한 정보

## Table of contents

### Properties

- [email](CreateUserRequest.md#email)
- [name](CreateUserRequest.md#name)
- [password](CreateUserRequest.md#password)
- [role](CreateUserRequest.md#role)

## Properties

### email

• **email**: `string`

이메일 주소

#### Defined in

[user.service.ts:14](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L14)

___

### name

• **name**: `string`

사용자명

#### Defined in

[user.service.ts:16](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L16)

___

### password

• **password**: `string`

비밀번호

#### Defined in

[user.service.ts:18](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L18)

___

### role

• `Optional` **role**: [`UserRole`](../modules.md#userrole)

사용자 역할 (기본값: 'user')

#### Defined in

[user.service.ts:20](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L20)
