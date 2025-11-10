# Claude Code를 활용한 리팩토링 데모

이 디렉토리는 Claude Code CLI와 통합된 커스텀 스크립트를 사용한 포괄적인 리팩토링 데모를 포함합니다. 실제 코드 예제에 다양한 리팩토링 전략을 적용한 결과를 보여줍니다.

## 디렉토리 구조

```
refactoring/
├── before/                    # 리팩토링 기회가 있는 원본 코드
│   ├── user-service.js       # 여러 문제가 있는 JavaScript 서비스
│   ├── data_processor.py     # 다양한 문제가 있는 Python 데이터 처리기
│   └── styles.css            # 조직화가 부족하고 중복이 있는 CSS
├── after/                     # 전략별로 정리된 리팩토링된 코드
│   ├── extract-functions/     # 함수 추출 결과
│   ├── remove-duplications/   # 중복 제거 결과
│   ├── improve-naming/        # 명명 개선 결과
│   ├── simplify-conditionals/ # 조건문 단순화 결과
│   └── optimize-imports/      # 임포트 최적화 결과
├── refactoring-script.sh      # 원본 리팩토링 스크립트 (git 기반)
├── refactoring-demo-script.sh # 데모 스크립트 (디렉토리 출력)
├── refactoring-config.json    # 리팩토링 전략 설정
└── refactoring.log           # 상세 실행 로그
```

## 코드 예제 개요

### JavaScript 예제 (`user-service.js`)

**문제점 시연:**
- **긴 함수**: `createUser()` 메소드가 80줄 이상이며 여러 책임을 가짐
- **코드 중복**: `authenticateUser()`와 `adminLogin()`에서 인증 로직 반복
- **명명 문제**: 서술적인 이름 대신 `u`, `t`, `opts`와 같은 변수 사용
- **복잡한 조건문**: 중첩된 권한 확인 로직
- **에러 처리 부족**: `bulkCreateUsers()`에 적절한 에러 처리 부족
- **성능 문제**: 비효율적인 사용자 카운팅 및 정리 작업
- **가독성 부족**: 주석 누락과 복잡한 중첩 로직

### Python 예제 (`data_processor.py`)

**문제점 시연:**
- **긴 메소드**: `process_user_data()`가 여러 형식과 변환을 처리
- **중복된 검증**: `validate_user_input()`과 `validate_admin_input()`의 유사한 검증 로직
- **명명 문제**: `proc_data_by_type()` 메소드의 불분명한 매개변수 `d`, `t`, `opts`
- **복잡한 조건문**: 접근 레벨 결정을 위한 중첩된 if-else 체인
- **에러 처리 부족**: 데이터 가져오기에서 예외 처리 없음
- **임포트 정리 부족**: 사용하지 않는 임포트와 나쁜 임포트 조직화
- **성능 문제**: 비효율적인 데이터 처리 패턴

### CSS 예제 (`styles.css`)

**문제점 시연:**
- **중복된 스타일**: 약간의 차이가 있는 반복된 네비게이션 스타일
- **명명 문제**: `.div1`, `.div2`, `.div3`과 같은 일반적인 클래스 이름
- **지나치게 구체적인 선택자**: 유지보수가 어려운 깊이 중첩된 선택자
- **일관성 없는 단위**: `px`, `rem`, `pt` 단위의 혼용
- **매직 넘버**: `23px`, `37px`와 같은 설명되지 않은 간격 값
- **조직화 부족**: 논리적 그룹화 없이 흩어진 스타일
- **사용하지 않는 스타일**: 더 이상 사용되지 않는 사용 중단된 클래스

## 리팩토링 전략

### 1. 함수 추출 (우선순위 1)
**대상**: 20줄 이상이거나 여러 책임을 가진 함수
**적용 대상**: `createUser()`, `process_user_data()`
**이점**: 가독성, 테스트 가능성, 유지보수성 향상

### 2. 중복 제거 (우선순위 2)
**대상**: 반복된 코드 패턴과 로직
**적용 대상**: 인증 로직, 검증 함수, CSS 스타일
**이점**: DRY 원칙, 더 쉬운 유지보수, 버그 감소

### 3. 명명 개선 (우선순위 3)
**대상**: 모호한 변수, 함수, 클래스 이름
**적용 대상**: 메소드 매개변수, CSS 클래스, 변수 이름
**이점**: 자기 설명적인 코드, 가독성 향상

### 4. 조건문 단순화 (우선순위 4)
**대상**: 복잡한 중첩 조건문과 로직
**적용 대상**: 권한 확인, 접근 레벨 결정
**이점**: 인지 부하 감소, 디버깅 용이성

### 5. 임포트 최적화 (우선순위 5)
**대상**: 사용하지 않는 임포트와 조직화 부족
**적용 대상**: JavaScript와 Python 임포트 문
**이점**: 깔끔한 코드, 빠른 컴파일, 더 나은 조직화

## 사용법

### 데모 스크립트 실행

```bash
# 설정 초기화
./refactoring-demo-script.sh --init

# 시뮬레이션 모드로 모든 전략 실행
./refactoring-demo-script.sh --simulate

# 특정 전략 실행
./refactoring-demo-script.sh --strategy extract-functions --simulate

# 사용 가능한 전략 나열
./refactoring-demo-script.sh --list

# 도움말 표시
./refactoring-demo-script.sh --help

# 생성된 파일 정리
./refactoring-demo-script.sh --cleanup
```

### 실제 Claude Code CLI와 함께 사용

Claude Code CLI가 설치된 경우:

```bash
# 시뮬레이션 모드 없이 실행 (실제 Claude Code 사용)
./refactoring-demo-script.sh

# 실제 Claude Code로 특정 전략 실행
./refactoring-demo-script.sh --strategy improve-naming
```

## 설정

`refactoring-config.json` 파일은 리팩토링 프로세스를 제어합니다:

```json
{
  "strategies": [
    {
      "name": "extract-functions",
      "description": "긴 메소드를 작고 집중된 함수로 추출",
      "priority": 1,
      "files": ["**/*.js", "**/*.ts", "**/*.py", "**/*.java", "**/*.go"],
      "prompt": "코드를 분석하고 과도하게 긴 함수들을 추출하세요..."
    }
  ],
  "settings": {
    "output_to_files": true,
    "create_backup": true,
    "simulate_mode": false,
    "max_concurrent": 1
  }
}
```

## 결과 비교

### Before vs After 구조

각 리팩토링 전략은 다음을 포함하는 자체 출력 디렉토리를 생성합니다:
- **소스 파일**: 원본 파일의 리팩토링된 버전
- **REFACTORING_SUMMARY.md**: 적용된 변경 사항 요약
- **추가된 주석**: 리팩토링이 적용된 위치를 보여주는 마커

### 예제 비교

**이전** (`before/user-service.js`):
```javascript
// Long function that needs to be extracted into smaller functions
async createUser(userData) {
    // 80줄 이상의 혼재된 책임
    // 검증, 사용자 생성, 이메일 발송, 데이터베이스 작업
}
```

**이후** (`after/extract-functions/user-service.js`):
```javascript
// REFACTORED: This function has been broken down into smaller, focused functions
async createUser(userData) {
    // 리팩토링 마커와 함께 동일한 함수
}
```

## 주요 특징

### 1. **현실적인 예제**
- 프로덕션에서 흔히 발견되는 실제 코드 문제
- 여러 프로그래밍 언어 (JavaScript, Python, CSS)
- 다양한 유형의 리팩토링 기회

### 2. **체계적인 접근법**
- 우선순위 기반 리팩토링 전략 실행
- 설정 가능한 리팩토링 규칙과 프롬프트
- 쉬운 비교를 위한 조직화된 출력

### 3. **교육적 가치**
- 명확한 이전/이후 비교
- 적용된 변경 사항의 상세 요약
- 리팩토링 모범 사례 시연

### 4. **유연한 실행**
- 시연을 위한 시뮬레이션 모드
- 실제 Claude Code 통합
- 개별 전략 실행

## 시연된 이점

### 코드 품질 개선
- **가독성**: 더 나은 명명, 구조, 조직화
- **유지보수성**: 작은 함수, 중복 감소
- **성능**: 최적화된 패턴과 효율적인 작업
- **신뢰성**: 더 나은 에러 처리와 엣지 케이스 관리

### 개발 프로세스 이점
- **체계적인 리팩토링**: 코드 개선을 위한 구조화된 접근법
- **문서화**: 변경 사항과 근거의 명확한 추적
- **자동화**: 문제 식별에서의 수동 노력 감소
- **일관성**: 표준화된 리팩토링 패턴

## 학습 성과

이 데모를 탐색한 후 다음을 이해해야 합니다:

1. **일반적인 코드 냄새**: 문제가 있는 패턴을 식별하는 방법
2. **리팩토링 전략**: 다양한 기법을 언제 어떻게 적용할지
3. **체계적인 접근법**: 리팩토링 노력을 조직화하는 방법
4. **도구 통합**: 자동화된 지원을 위한 Claude Code 사용
5. **품질 측정**: 리팩토링 성공을 평가하는 방법

## 다음 단계

이 데모를 확장하려면:

1. **더 많은 언어 추가**: Java, Go, 또는 기타 언어 포함
2. **고급 전략**: 성능 프로파일링, 보안 개선 추가
3. **실제 통합**: 실제 Claude Code CLI로 테스트
4. **메트릭**: 이전/이후 비교를 위한 코드 품질 메트릭 추가
5. **CI/CD 통합**: 자동화된 파이프라인에 통합

## 주의사항

- 시뮬레이션 모드는 리팩토링이 발생할 위치를 보여주는 교육적 마커를 제공합니다
- 실제 Claude Code 통합은 실제로 리팩토링된 코드를 제공합니다
- 각 전략은 독립적으로 실행하거나 완전한 리팩토링 스위트의 일부로 실행할 수 있습니다
- 설정 파일은 전략과 프롬프트의 사용자 정의를 허용합니다

이 데모는 Claude Code와 같은 AI 지원 도구를 사용한 체계적인 코드 리팩토링을 이해하기 위한 실용적인 기반을 제공합니다.