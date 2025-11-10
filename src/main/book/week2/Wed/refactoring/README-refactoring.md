# Claude Code Refactoring Script

자동화된 리팩토링 스크립트로, Claude Code의 print 모드를 활용하여 체계적인 코드 개선을 수행합니다.

## 주요 특징

- 🚀 **Claude Code Print Mode 통합**: Claude Code CLI를 활용한 자동 리팩토링
- 🌿 **브랜치 기반 작업**: 각 리팩토링 전략마다 별도 브랜치 생성
- 📋 **체계적 전략**: 우선순위 기반의 8가지 핵심 리팩토링 전략
- ⚙️ **완전 설정 가능**: JSON 기반 설정으로 전략과 동작 커스터마이징
- 🧪 **테스트 통합**: 리팩토링 후 자동 테스트 실행
- 📊 **상세 로깅**: 모든 과정의 상세한 로그 기록

## 사용 방법

### 기본 실행
```bash
./refactoring-script.sh
```

### 특정 전략만 실행
```bash
./refactoring-script.sh --strategy extract-functions
```

### 설정 파일 초기화
```bash
./refactoring-script.sh --init
```

### 사용 가능한 전략 확인
```bash
./refactoring-script.sh --list
```

### 도움말
```bash
./refactoring-script.sh --help
```

## 리팩토링 전략

기본으로 포함된 8가지 리팩토링 전략:

1. **extract-functions**: 긴 메서드를 작은 함수들로 분리
2. **remove-duplications**: 코드 중복 제거 및 재사용 가능한 모듈 생성
3. **improve-naming**: 변수, 함수, 클래스 명명 규칙 개선
4. **simplify-conditionals**: 복잡한 조건문 단순화
5. **optimize-imports**: import 문 정리 및 최적화
6. **add-error-handling**: 에러 처리 및 유효성 검증 추가
7. **improve-performance**: 성능 병목 현상 최적화
8. **enhance-readability**: 코드 가독성 및 문서화 개선

## 설정 파일 (refactoring-config.json)

```json
{
  "strategies": [
    {
      "name": "extract-functions",
      "description": "Extract long methods into smaller, focused functions",
      "priority": 1,
      "files": ["**/*.js", "**/*.ts", "**/*.py"],
      "prompt": "커스텀 프롬프트..."
    }
  ],
  "settings": {
    "create_backup": true,
    "run_tests": true,
    "commit_changes": true,
    "push_branches": false,
    "cleanup_branches": false,
    "max_concurrent": 1
  }
}
```

## 워크플로우

1. **브랜치 생성**: 각 리팩토링 전략마다 `refactor/{strategy}-{timestamp}` 브랜치 생성
2. **Claude Code 실행**: print 모드로 리팩토링 명령 실행
3. **테스트 실행**: 변경사항이 기존 기능을 해치지 않는지 확인
4. **커밋**: 성공적인 리팩토링 결과를 커밋 (설정에 따라)
5. **정리**: 원래 브랜치로 복귀

## 사용 예제

### 프로젝트 초기 설정
```bash
# 설정 파일 생성
./refactoring-script.sh --init

# 사용 가능한 전략 확인
./refactoring-script.sh --list
```

### 전체 리팩토링 실행
```bash
# 모든 전략을 우선순위 순으로 실행
./refactoring-script.sh
```

### 선택적 리팩토링
```bash
# 함수 추출만 실행
./refactoring-script.sh --strategy extract-functions

# 중복 제거만 실행
./refactoring-script.sh --strategy remove-duplications
```

### 커스텀 설정 사용
```bash
# 커스텀 설정 파일 사용
./refactoring-script.sh --config my-custom-config.json
```

### 브랜치 정리
```bash
# 생성된 리팩토링 브랜치들 정리
./refactoring-script.sh --cleanup
```

## 결과 확인

### 생성된 브랜치 확인
```bash
git branch | grep refactor/
```

### 로그 확인
```bash
cat refactoring.log
```

### 변경사항 리뷰
각 브랜치에서 변경사항을 리뷰하고 필요시 메인 브랜치에 병합:
```bash
git checkout refactor/extract-functions-20231201-143022
git diff main
```

## 필수 조건

- Git 저장소 내에서 실행
- Claude Code CLI 설치 (`npm install -g @anthropic/claude-code`)
- `jq` 명령어 설치 (JSON 처리용)

## 커스터마이징

`refactoring-config.json` 파일을 수정하여:

- 새로운 리팩토링 전략 추가
- 기존 전략의 프롬프트 수정
- 파일 패턴 변경
- 설정 옵션 조정

## 주의사항

- 중요한 변경사항이므로 실행 전 백업 권장
- 테스트 설정이 활성화되어 있으면 테스트 통과가 필수
- 각 전략은 독립적인 브랜치에서 실행되어 안전성 확보

## 로그 및 디버깅

모든 실행 과정은 `refactoring.log` 파일에 기록되며, 색상 코드로 구분된 출력을 통해 실시간 진행상황을 확인할 수 있습니다.

- 🔵 INFO: 일반적인 진행 정보
- 🟢 SUCCESS: 성공적인 작업 완료
- 🟡 WARNING: 주의가 필요한 상황
- 🔴 ERROR: 오류 발생