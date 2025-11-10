# 리팩토링 예시 (Refactoring Examples)

이 폴더는 TypeScript에서 클린 코드 원칙을 적용한 리팩토링 예시를 담고 있습니다.

## 📁 구조

```
refactoring/
├── README.md                    # 이 파일
├── orderCalculator.ts          # 리팩토링 이전 코드 (Before)
├── example.ts                  # 이전 코드 사용 예시
└── result/                     # 리팩토링 결과
    ├── orderCalculator.ts      # 리팩토링 이후 코드 (After)
    └── example.ts              # 이후 코드 사용 예시
```

## 🔍 리팩토링 내용

### Before (리팩토링 이전)
- **파일**: `orderCalculator.ts`, `example.ts`
- **문제점**:
  - 타입 안전성 부족 (`any` 타입 사용)
  - 매직 넘버 하드코딩 (0.1, 0.2, 100 등)
  - 복잡한 중첩 if문
  - 단일 함수에 모든 로직 집중
  - 런타임 에러 가능성 (오타, 잘못된 데이터 구조)

### After (리팩토링 이후)
- **파일**: `result/orderCalculator.ts`, `result/example.ts`
- **개선사항**:
  - **강한 타입 시스템**: Interface와 타입 안전성
  - **상수 추출**: 매직 넘버를 의미있는 상수로 변경
  - **클래스 기반 설계**: 단일 책임 원칙 적용
  - **메소드 분리**: 각 계산 로직을 별도 메소드로 분리
  - **설정 기반**: 할인 규칙을 데이터로 관리
  - **컴파일 타임 에러 체크**: TypeScript의 이점 활용

## 🎯 적용된 클린 코드 원칙

1. **단일 책임 원칙 (SRP)**: 각 메소드는 하나의 책임만 가짐
2. **DRY (Don't Repeat Yourself)**: 중복 코드 제거
3. **의미있는 네이밍**: 변수와 함수명이 목적을 명확히 표현
4. **매직 넘버 제거**: 상수로 추출하여 의미 부여
5. **타입 안전성**: 컴파일 타임 에러 방지

## 🚀 실행 방법

### 리팩토링 이전 코드 실행
```bash
npx ts-node orderCalculator.ts
npx ts-node example.ts
```

### 리팩토링 이후 코드 실행
```bash
npx ts-node result/orderCalculator.ts
npx ts-node result/example.ts
```

## 📊 개선 효과

| 항목 | Before | After |
|------|--------|--------|
| 타입 안전성 | ❌ any 타입 사용 | ✅ 강한 타입 시스템 |
| 가독성 | ❌ 복잡한 중첩 조건문 | ✅ 명확한 메소드 분리 |
| 유지보수성 | ❌ 하드코딩된 값들 | ✅ 설정 기반 관리 |
| 확장성 | ❌ 새로운 요구사항 대응 어려움 | ✅ 쉬운 규칙 추가/변경 |
| 테스트 용이성 | ❌ 단일 거대 함수 | ✅ 개별 메소드 테스트 가능 |

## 💡 학습 포인트

이 예시를 통해 다음을 학습할 수 있습니다:

- TypeScript 인터페이스와 타입 시스템 활용
- 클린 아키텍처 원칙 적용
- 레거시 코드 리팩토링 프로세스
- 코드 품질 향상 기법
- 유지보수 가능한 코드 작성법