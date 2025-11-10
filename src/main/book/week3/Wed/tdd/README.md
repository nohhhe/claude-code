# TDD 예제: UserService

이 프로젝트는 Test-Driven Development (TDD)의 RED-GREEN-REFACTOR 사이클을 보여주는 간단한 예제입니다.

## 설정

```bash
npm install
```

## 테스트 실행

```bash
# 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch
```

## TDD 과정

1. **RED**: 실패하는 테스트 작성 (`userService.test.ts`)
2. **GREEN**: 테스트를 통과하는 최소한의 코드 작성 (`userService.ts`)  
3. **REFACTOR**: 코드 개선

## 기능

- 사용자 등록
- 이메일 중복 확인
- 비밀번호 해싱