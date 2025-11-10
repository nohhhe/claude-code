# Git Hooks Configuration

**프로젝트**: CookShare  
**설정 완료일**: 2025-09-09  
**관리 도구**: Husky v9.1.7

---

## 📋 개요

이 프로젝트는 코드 품질과 일관성을 보장하기 위해 3가지 Git hooks를 구성했습니다:

- **pre-commit**: 코드 린팅 및 포맷팅 자동화
- **commit-msg**: 커밋 메시지 규칙 검증
- **pre-push**: 테스트 실행 및 빌드 검증

---

## 🛠 설치된 도구

### Core Tools
- **Husky**: `^9.1.7` - Git hooks 관리
- **lint-staged**: `^16.1.6` - 스테이징된 파일만 처리
- **Prettier**: `^3.6.2` - 코드 포맷팅
- **@commitlint/cli**: `^19.8.1` - 커밋 메시지 검증

### 설치 명령어
```bash
npm install --save-dev husky lint-staged prettier @commitlint/cli @commitlint/config-conventional
```

---

## 🔗 Hook 구성

### 1. pre-commit Hook
**파일**: `.husky/pre-commit`

```bash
# Run lint-staged for formatting and linting
npx lint-staged
```

**동작**:
- 스테이징된 파일에 대해서만 실행
- JavaScript/TypeScript: ESLint 자동 수정 + Prettier 포맷팅
- JSON/CSS/Markdown: Prettier 포맷팅

**처리 파일 패턴**:
```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,md,mdx}": [
    "prettier --write"
  ]
}
```

### 2. commit-msg Hook
**파일**: `.husky/commit-msg`

```bash
# Validate commit message format with commitlint
npx --no -- commitlint --edit "$1"
```

**동작**:
- Conventional Commits 규칙 검증
- 커밋 메시지 형식 강제
- 잘못된 형식 시 커밋 중단

### 3. pre-push Hook
**파일**: `.husky/pre-push`

```bash
# Run tests before pushing
echo "🧪 Running tests before push..."
npm run test

# Run type checking
echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

# Run build to ensure everything compiles
echo "🏗️ Running build check..."
npm run build
```

**동작**:
- 테스트 실행 (현재는 placeholder)
- TypeScript 타입 체크
- 프로덕션 빌드 검증

---

## 📝 Conventional Commits 규칙

### 커밋 메시지 형식
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 지원하는 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가, 테스트 리팩토링
- `chore`: 빌드 업무, 패키지 매니저 설정 등
- `perf`: 성능 개선
- `ci`: CI 설정 파일 수정
- `build`: 빌드 시스템 수정
- `revert`: 커밋 되돌리기

### 올바른 커밋 메시지 예시
```bash
# ✅ 올바른 예시
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve login button styling issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve error handling logic"

# ❌ 잘못된 예시  
git commit -m "Add feature"           # 타입 없음
git commit -m "Fix Bug"               # 대문자 사용
git commit -m "feat:"                 # 설명 없음
git commit -m "feat: Add new feature." # 마침표 사용
```

---

## 🎨 Code Formatting 설정

### Prettier 구성 (`.prettierrc`)
```json
{
  "semi": true,
  "trailingComma": "es5", 
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "bracketSameLine": false
}
```

### ESLint 구성
- Next.js + TypeScript 규칙 적용
- 자동 수정 가능한 문제들은 pre-commit에서 해결
- `next-env.d.ts` 파일 무시 설정

---

## 🚀 사용법

### 일반적인 개발 플로우

1. **코드 작성 및 스테이징**:
```bash
git add .
```

2. **커밋** (pre-commit hook 자동 실행):
```bash
git commit -m "feat: add new feature"
```

3. **푸시** (pre-push hook 자동 실행):
```bash
git push origin main
```

### 수동 실행 명령어

```bash
# 포맷팅 수동 실행
npm run format

# 포맷팅 확인만
npm run format:check

# 린팅 수동 실행
npm run lint

# 린팅 자동 수정
npm run lint:fix

# 테스트 실행
npm run test

# 빌드 확인
npm run build
```

---

## 🔧 문제 해결

### Hook이 실행되지 않는 경우

1. **Husky 재설정**:
```bash
rm -rf .husky
npx husky init
```

2. **실행 권한 확인**:
```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

3. **Git 저장소 확인**:
```bash
git rev-parse --git-dir
```

### 린팅/포맷팅 오류

1. **수동으로 문제 해결**:
```bash
npm run lint:fix
npm run format
```

2. **특정 파일만 처리**:
```bash
npx prettier --write "src/**/*.{js,ts,tsx}"
npx eslint --fix "src/**/*.{js,ts,tsx}"
```

### 커밋 메시지 오류

**일반적인 오류와 해결**:
```bash
# ❌ 오류: type may not be empty
git commit -m "add feature"

# ✅ 수정: 
git commit -m "feat: add feature"

# ❌ 오류: subject may not be empty  
git commit -m "feat:"

# ✅ 수정:
git commit -m "feat: add new user dashboard"
```

---

## 🎯 Hook 비활성화 (비상시에만 사용)

### 임시 비활성화
```bash
# 특정 커밋에서만 hook 건너뛰기
git commit -m "feat: emergency fix" --no-verify

# 특정 푸시에서만 hook 건너뛰기  
git push --no-verify
```

### 완전 비활성화 (권장하지 않음)
```bash
# Husky 완전 비활성화
rm -rf .husky
```

---

## 📊 성능 영향

### Hook 실행 시간 (평균)
- **pre-commit**: 3-10초 (파일 수에 따라)
- **commit-msg**: 1-2초
- **pre-push**: 30-60초 (빌드 포함)

### 최적화 팁
- `lint-staged`로 변경된 파일만 처리
- ESLint 캐시 활용
- Prettier 캐시 활용 가능

---

## 🔄 업데이트 및 유지보수

### 정기 업데이트 체크
```bash
# 패키지 업데이트 확인
npm outdated

# Husky 최신 버전 확인
npm list husky

# commitlint 규칙 업데이트 확인
npx commitlint --version
```

### 새로운 개발자를 위한 설정
```bash
# 저장소 클론 후
npm install

# Husky hooks 자동 설정됨 (prepare 스크립트)
```

---

## 📚 참고 자료

- [Husky 공식 문서](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged 공식 문서](https://github.com/okonet/lint-staged)
- [Commitlint 공식 문서](https://commitlint.js.org/)
- [Prettier 공식 문서](https://prettier.io/)

---

**설정 완료**: 2025-09-09  
**담당자**: Claude Code  
**다음 검토**: 2025-12-09