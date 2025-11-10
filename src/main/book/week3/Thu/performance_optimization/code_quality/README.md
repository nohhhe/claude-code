# 코드 품질 메트릭 데모

이 프로젝트는 SonarQube를 사용한 코드 품질 메트릭 측정을 위한 예제입니다. 다양한 코드 품질 이슈들을 의도적으로 포함하여 SonarQube가 어떻게 이러한 문제들을 탐지하는지 보여줍니다.

## 포함된 코드 품질 이슈들

### 1. 복잡도 (Cyclomatic Complexity) 이슈
- `src/index.ts` - `processUserData()`: 복잡한 중첩 조건문들
- `src/utils/Calculator.ts` - `calculateDiscount()`: 많은 분기 조건들
- `src/utils/DataProcessor.ts` - `validateAndTransformData()`: 매우 높은 복잡도
- `src/services/UserService.ts` - `createUser()`: 복잡한 유효성 검사

### 2. 중복 코드 (Code Duplication) 이슈
- `src/index.ts` - `validateEmail()`, `validatePhone()`: 유사한 검증 로직
- `src/utils/Calculator.ts` - `addNumbers()`, `multiplyNumbers()`: 동일한 매개변수 검증
- `src/utils/DataProcessor.ts` - `processUserArray()`, `processProductArray()`: 거의 동일한 처리 로직
- `src/services/UserService.ts` - `getUserById()`, `getUserByEmail()`: 유사한 에러 처리

### 3. 코드 커버리지 (Code Coverage) 이슈
의도적으로 테스트되지 않는 메서드들:
- `Application.unusedMethod()`, `Application.anotherUntestedMethod()`
- `Calculator.divideNumbers()`, `Calculator.calculateTax()`
- `DataProcessor.formatDate()`, `DataProcessor.generateId()`
- `UserService.deleteUser()`, `UserService.updateUserLastLogin()`

### 4. 사용되지 않는 코드 (Dead Code)
- 호출되지 않는 private 메서드들
- 사용되지 않는 public 메서드들

## 프로젝트 구조

```
src/
├── __tests__/              # 테스트 파일들 (부분적 커버리지)
│   ├── Application.test.ts
│   ├── Calculator.test.ts
│   └── DataProcessor.test.ts
├── services/
│   └── UserService.ts      # 사용자 서비스 (복잡도 & 중복코드 이슈)
├── utils/
│   ├── Calculator.ts       # 계산 유틸리티 (중복코드 이슈)
│   └── DataProcessor.ts    # 데이터 처리 (복잡도 이슈)
└── index.ts               # 메인 애플리케이션 (복잡도 이슈)
```

## 설정 파일들

### SonarQube 설정 (`sonar-project.properties`)
```properties
sonar.projectKey=my-project
sonar.sources=src
sonar.tests=src/__tests__
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts
sonar.cpd.exclusions=**/*.generated.ts
sonar.qualitygate.wait=true
sonar.coverage.minimum=80
sonar.duplications.maximum=3
sonar.complexity.maximum=10
```

### Jest 설정 (`jest.config.js`)
- TypeScript 지원
- 코드 커버리지 리포트 생성
- LCOV 형식 출력 (SonarQube 연동용)

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 테스트 및 커버리지 실행
```bash
# 테스트 실행
npm test

# 커버리지 포함 테스트 실행
npm run test:coverage
```

### 3. ESLint 실행
```bash
npm run lint
```

### 4. SonarQube 분석 실행
```bash
# SonarQube 서버가 실행 중이어야 합니다
npm run sonar
```

## 예상되는 품질 메트릭 결과

### 복잡도 (Complexity)
- 여러 메서드가 설정된 최대값(10)을 초과할 것입니다
- SonarQube가 높은 복잡도의 메서드들을 식별합니다

### 중복 코드 (Duplications)
- 설정된 최대값(3%)을 초과하는 중복 코드가 탐지됩니다
- 유사한 로직을 가진 메서드들이 식별됩니다

### 코드 커버리지 (Coverage)
- 설정된 최소값(80%)에 도달하지 못할 것입니다
- 테스트되지 않는 메서드들과 분기들이 식별됩니다

### 기타 이슈들
- 사용되지 않는 변수들
- 너무 긴 매개변수 리스트
- 사용되지 않는 imports
- 복잡한 조건문들

## Quality Gate 실패 시나리오

이 프로젝트는 의도적으로 다음 Quality Gate 조건들을 실패하도록 설계되었습니다:

1. **복잡도**: 여러 메서드가 최대 허용 복잡도(10)를 초과
2. **중복 코드**: 중복 코드 비율이 최대 허용치(3%)를 초과
3. **코드 커버리지**: 커버리지가 최소 요구사항(80%)에 미달

## 개선 방안

각 품질 이슈를 해결하기 위한 일반적인 방법들:

### 복잡도 개선
- 메서드를 더 작은 단위로 분할
- 복잡한 조건문을 별도 메서드로 추출
- Guard clauses 사용으로 중첩 감소

### 중복 코드 제거
- 공통 로직을 별도 함수로 추출
- 추상화 레벨을 높여 재사용성 증대
- 유틸리티 클래스나 헬퍼 함수 활용

### 커버리지 향상
- 누락된 메서드들에 대한 테스트 추가
- Edge case 테스트 케이스 보강
- Integration 테스트 추가

이 프로젝트를 통해 SonarQube의 다양한 품질 메트릭과 Quality Gate 기능을 실습하고 이해할 수 있습니다.
