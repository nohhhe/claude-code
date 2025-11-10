[API Documentation - v1.0.0](../README.md) / [Exports](../modules.md) / UserService

# Class: UserService

사용자 관리를 담당하는 서비스 클래스

이 클래스는 사용자 CRUD 작업, 인증, 권한 관리 기능을 제공합니다.
모든 메서드는 적절한 권한 검증과 에러 처리를 포함하고 있습니다.

**`Example`**

```typescript
const userService = new UserService();

// 새 사용자 생성
const newUser = await userService.createUser({
  email: 'user@example.com',
  name: '김철수',
  password: 'securePassword123'
});

// 사용자 조회
const user = await userService.getUserById(newUser.userId);
```

**`Since`**

1.0.0

## Table of contents

### Constructors

- [constructor](UserService.md#constructor)

### Properties

- [adminRole](UserService.md#adminrole)

### Methods

- [createUser](UserService.md#createuser)
- [getUserById](UserService.md#getuserbyid)
- [getUserByEmail](UserService.md#getuserbyemail)
- [updateUser](UserService.md#updateuser)
- [deleteUser](UserService.md#deleteuser)
- [getUsers](UserService.md#getusers)
- [updateLastLogin](UserService.md#updatelastlogin)
- [isAdmin](UserService.md#isadmin)
- [validateAdminPermission](UserService.md#validateadminpermission)
- [validateUserAccess](UserService.md#validateuseraccess)
- [validateUserData](UserService.md#validateuserdata)
- [findUserById](UserService.md#finduserbyid)
- [findUserByEmail](UserService.md#finduserbyemail)
- [generateMockUsers](UserService.md#generatemockusers)

## Constructors

### constructor

• **new UserService**(): [`UserService`](UserService.md)

UserService 생성자

#### Returns

[`UserService`](UserService.md)

**`Example`**

```typescript
const userService = new UserService();
```

#### Defined in

[user.service.ts:115](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L115)

## Properties

### adminRole

• `Private` `Readonly` **adminRole**: ``"admin"``

#### Defined in

[user.service.ts:105](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L105)

## Methods

### createUser

▸ **createUser**(`userData`, `requesterId`): `Promise`\<[`User`](../interfaces/User.md)\>

새로운 사용자를 생성합니다

이메일 중복 검증, 비밀번호 강도 검증을 수행하고,
새로운 사용자 계정을 생성합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userData` | [`CreateUserRequest`](../interfaces/CreateUserRequest.md) | 사용자 생성 정보 |
| `requesterId` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

생성된 사용자 정보를 포함하는 Promise

**`Throws`**

[ValidationError](ValidationError.md) 입력 데이터가 유효하지 않을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
try {
  const newUser = await userService.createUser({
    email: 'newuser@example.com',
    name: '새사용자',
    password: 'SecurePass123!',
    role: 'user'
  }, 'ADMIN001');
  
  console.log('User created:', newUser.userId);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid user data:', error.message);
  }
}
```

**`Example`**

```typescript
// 관리자 계정 생성
const adminUser = await userService.createUser({
  email: 'admin@company.com',
  name: '관리자',
  password: 'AdminPass123!',
  role: 'admin'
}, 'SUPERADMIN001');
```

**`Since`**

1.0.0

#### Defined in

[user.service.ts:163](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L163)

___

### getUserById

▸ **getUserById**(`userId`, `requesterId`): `Promise`\<[`User`](../interfaces/User.md)\>

사용자 ID로 사용자 정보를 조회합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 조회할 사용자 ID |
| `requesterId` | `string` | 요청자 ID (본인 또는 관리자만 조회 가능) |

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

사용자 정보를 포함하는 Promise

**`Throws`**

[UserNotFoundError](UserNotFoundError.md) 사용자를 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
try {
  const user = await userService.getUserById('USER123456789', 'USER123456789');
  console.log('User info:', {
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  });
} catch (error) {
  if (error instanceof UserNotFoundError) {
    console.error('User not found');
  }
}
```

**`Since`**

1.0.0

#### Defined in

[user.service.ts:220](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L220)

___

### getUserByEmail

▸ **getUserByEmail**(`email`, `requesterId`): `Promise`\<[`User`](../interfaces/User.md)\>

이메일로 사용자 정보를 조회합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | 조회할 이메일 주소 |
| `requesterId` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

사용자 정보를 포함하는 Promise

**`Throws`**

[UserNotFoundError](UserNotFoundError.md) 사용자를 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
const user = await userService.getUserByEmail('user@example.com', 'ADMIN001');
console.log('Found user:', user.name);
```

**`Since`**

1.0.0

#### Defined in

[user.service.ts:250](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L250)

___

### updateUser

▸ **updateUser**(`userId`, `updateData`, `requesterId`): `Promise`\<[`User`](../interfaces/User.md)\>

사용자 정보를 업데이트합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 업데이트할 사용자 ID |
| `updateData` | [`UpdateUserRequest`](../interfaces/UpdateUserRequest.md) | 업데이트할 데이터 |
| `requesterId` | `string` | 요청자 ID |

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

업데이트된 사용자 정보를 포함하는 Promise

**`Throws`**

[UserNotFoundError](UserNotFoundError.md) 사용자를 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Throws`**

[ValidationError](ValidationError.md) 업데이트 데이터가 유효하지 않을 때

**`Example`**

```typescript
const updatedUser = await userService.updateUser('USER123', {
  name: '새로운 이름',
  isActive: true
}, 'ADMIN001');

console.log('User updated:', updatedUser.name);
```

**`Example`**

```typescript
// 사용자 역할 변경
const promotedUser = await userService.updateUser('USER123', {
  role: 'manager'
}, 'ADMIN001');
```

**`Since`**

1.0.0

#### Defined in

[user.service.ts:293](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L293)

___

### deleteUser

▸ **deleteUser**(`userId`, `requesterId`): `Promise`\<`boolean`\>

사용자를 삭제합니다 (비활성화)

실제로는 사용자 데이터를 삭제하지 않고 비활성화 처리합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 삭제할 사용자 ID |
| `requesterId` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<`boolean`\>

삭제 성공 여부를 포함하는 Promise

**`Throws`**

[UserNotFoundError](UserNotFoundError.md) 사용자를 찾을 수 없을 때

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
const success = await userService.deleteUser('USER123', 'ADMIN001');
if (success) {
  console.log('User successfully deactivated');
}
```

**`Since`**

1.0.0

#### Defined in

[user.service.ts:341](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L341)

___

### getUsers

▸ **getUsers**(`filter?`, `pagination?`, `requesterId`): `Promise`\<[`PaginatedResult`](../interfaces/PaginatedResult.md)\<[`User`](../interfaces/User.md)\>\>

사용자 목록을 조회합니다 (페이지네이션 지원)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | [`UserSearchFilter`](../interfaces/UserSearchFilter.md) | 검색 필터 |
| `pagination` | [`PaginationOptions`](../interfaces/PaginationOptions.md) | 페이지네이션 옵션 |
| `requesterId` | `string` | 요청자 ID (관리자 권한 필요) |

#### Returns

`Promise`\<[`PaginatedResult`](../interfaces/PaginatedResult.md)\<[`User`](../interfaces/User.md)\>\>

페이지네이션된 사용자 목록을 포함하는 Promise

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

**`Example`**

```typescript
// 모든 활성 사용자 조회
const result = await userService.getUsers(
  { isActive: true },
  { page: 1, limit: 10 },
  'ADMIN001'
);

console.log(`Found ${result.total} users`);
result.data.forEach(user => {
  console.log(`${user.name} (${user.email})`);
});
```

**`Example`**

```typescript
// 관리자만 조회
const admins = await userService.getUsers(
  { role: 'admin' },
  { page: 1, limit: 5 },
  'SUPERADMIN001'
);
```

**`Since`**

1.0.0

#### Defined in

[user.service.ts:393](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L393)

___

### updateLastLogin

▸ **updateLastLogin**(`userId`): `Promise`\<`boolean`\>

사용자의 마지막 로그인 시간을 업데이트합니다

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 사용자 ID |

#### Returns

`Promise`\<`boolean`\>

업데이트 성공 여부를 포함하는 Promise

**`Example`**

```typescript
await userService.updateLastLogin('USER123');
```

**`Since`**

1.1.0

#### Defined in

[user.service.ts:452](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L452)

___

### isAdmin

▸ **isAdmin**(`userId`): `Promise`\<`boolean`\>

사용자가 관리자인지 확인하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 확인할 사용자 ID |

#### Returns

`Promise`\<`boolean`\>

관리자 여부

#### Defined in

[user.service.ts:471](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L471)

___

### validateAdminPermission

▸ **validateAdminPermission**(`requesterId`): `Promise`\<`void`\>

관리자 권한을 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requesterId` | `string` | 요청자 ID |

#### Returns

`Promise`\<`void`\>

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 관리자가 아닐 때

#### Defined in

[user.service.ts:483](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L483)

___

### validateUserAccess

▸ **validateUserAccess**(`userId`, `requesterId`): `Promise`\<`void`\>

사용자 접근 권한을 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 접근 대상 사용자 ID |
| `requesterId` | `string` | 요청자 ID |

#### Returns

`Promise`\<`void`\>

**`Throws`**

[UnauthorizedError](UnauthorizedError.md) 권한이 없을 때

#### Defined in

[user.service.ts:498](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L498)

___

### validateUserData

▸ **validateUserData**(`userData`): `void`

사용자 생성 데이터를 검증하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userData` | [`CreateUserRequest`](../interfaces/CreateUserRequest.md) | 검증할 사용자 데이터 |

#### Returns

`void`

**`Throws`**

[ValidationError](ValidationError.md) 데이터가 유효하지 않을 때

#### Defined in

[user.service.ts:514](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L514)

___

### findUserById

▸ **findUserById**(`userId`): `Promise`\<``null`` \| [`User`](../interfaces/User.md)\>

사용자 ID로 사용자를 찾는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | 찾을 사용자 ID |

#### Returns

`Promise`\<``null`` \| [`User`](../interfaces/User.md)\>

사용자 정보 또는 null

#### Defined in

[user.service.ts:535](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L535)

___

### findUserByEmail

▸ **findUserByEmail**(`email`): `Promise`\<``null`` \| [`User`](../interfaces/User.md)\>

이메일로 사용자를 찾는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | 찾을 이메일 |

#### Returns

`Promise`\<``null`` \| [`User`](../interfaces/User.md)\>

사용자 정보 또는 null

#### Defined in

[user.service.ts:561](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L561)

___

### generateMockUsers

▸ **generateMockUsers**(`count`, `filter`): [`User`](../interfaces/User.md)[]

모의 사용자 데이터를 생성하는 내부 메서드

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `count` | `number` | 생성할 사용자 수 |
| `filter` | [`UserSearchFilter`](../interfaces/UserSearchFilter.md) | 적용할 필터 |

#### Returns

[`User`](../interfaces/User.md)[]

모의 사용자 배열

#### Defined in

[user.service.ts:585](https://github.com/sysnet4admin/_Book_Claude-Code/blob/main/week3/Fri/code_doc_sync/src/api/user.service.ts#L585)
