# Visual Regression Testing Example

Percy와 Chromatic을 사용한 시각적 회귀 테스트 예제 프로젝트입니다.

## 🎯 프로젝트 개요

이 프로젝트는 다음과 같은 시각적 회귀 테스트 도구들을 사용합니다:

- **Percy**: Playwright와 연동된 자동 스크린샷 비교
- **Chromatic**: Storybook 기반 컴포넌트 시각적 테스트
- **Playwright**: End-to-End 테스트 프레임워크
- **Storybook**: 컴포넌트 개발 및 테스트 환경

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# Playwright 브라우저 설치
npx playwright install
```

### 환경 설정

1. `.env.example` 파일을 `.env`로 복사
2. Percy와 Chromatic 토큰 설정

```bash
cp .env.example .env
```

`.env` 파일에서 다음 토큰들을 설정하세요:

```env
PERCY_TOKEN=your_percy_token_here
CHROMATIC_PROJECT_TOKEN=your_chromatic_token_here
```

## 🖥️ 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📱 테스트 페이지

프로젝트에는 다음과 같은 테스트 페이지들이 포함되어 있습니다:

1. **홈페이지** (`/`) - 메인 랜딩 페이지
2. **상품 목록** (`/product-list`) - 상품 카드 그리드와 필터
3. **대시보드** (`/dashboard`) - 차트와 메트릭 위젯
4. **폼 페이지** (`/form`) - 다양한 입력 요소와 검증
5. **모달 예제** (`/modal-example`) - 모달, 드로어, 툴팁 등

## 🎨 Storybook

컴포넌트 개발 및 테스트를 위한 Storybook을 실행할 수 있습니다:

```bash
npm run storybook
```

Storybook이 [http://localhost:6006](http://localhost:6006)에서 실행됩니다.

## 🧪 테스트 실행

### Percy 시각적 테스트

Percy를 사용한 시각적 회귀 테스트:

```bash
npm run test:percy
```

### Chromatic 테스트

Storybook 컴포넌트의 시각적 테스트:

```bash
npm run test:chromatic
```

### Playwright E2E 테스트

일반적인 End-to-End 테스트:

```bash
npm run test
```

## 📊 시각적 회귀 테스트 전략

### Percy 테스트 범위

- **데스크톱 테스트**: 1280px, 1920px 너비
- **모바일 테스트**: 390px 너비 (iPhone 12)
- **테스트 시나리오**:
  - 페이지 기본 상태
  - 인터랙션 후 상태 (모달 열림, 폼 에러 등)
  - 다양한 뷰포트 크기

### Chromatic 테스트 범위

- **컴포넌트 단위 테스트**
- **다양한 상태 테스트** (기본, 호버, 선택, 비활성화)
- **반응형 레이아웃 테스트**
- **다크모드/라이트모드 테스트**

### 테스트 커버리지

| 페이지/컴포넌트 | Percy | Chromatic | Playwright |
|----------------|-------|-----------|------------|
| 홈페이지        | ✅     | -         | ✅         |
| 상품 목록       | ✅     | ✅        | ✅         |
| 대시보드        | ✅     | ✅        | ✅         |
| 폼 페이지       | ✅     | ✅        | ✅         |
| 모달 예제       | ✅     | ✅        | ✅         |

## 🔧 설정 파일 설명

### Percy 설정 (`percy.config.js`)

```javascript
module.exports = defineConfig({
  testDir: './tests/visual',
  projects: [
    {
      name: 'percy-chromium',
      use: { viewport: { width: 1280, height: 720 } }
    },
    {
      name: 'percy-mobile', 
      use: { viewport: { width: 390, height: 844 } }
    }
  ]
});
```

### Playwright 설정 (`playwright.config.ts`)

- 다중 브라우저 테스트 (Chrome, Firefox, Safari)
- 모바일 뷰포트 테스트
- 자동 스크린샷 및 트레이스
- 개발 서버 자동 시작

### Storybook 설정 (`.storybook/main.ts`)

- Next.js 프레임워크 통합
- Essential 애드온 포함
- 자동 문서화 설정

## 📈 CI/CD 통합

GitHub Actions 워크플로우가 다음을 자동으로 실행합니다:

1. **Percy 테스트**: PR과 main 브랜치 푸시 시
2. **Chromatic 테스트**: 컴포넌트 변경사항 감지
3. **Playwright E2E**: 전체 애플리케이션 테스트

### 워크플로우 트리거

- `main`, `develop` 브랜치로의 push
- Pull Request 생성/업데이트
- 수동 실행 (`workflow_dispatch`)

## 🛠️ 개발 가이드라인

### 새로운 페이지 추가 시

1. `pages/` 디렉토리에 페이지 컴포넌트 생성
2. `styles/` 디렉토리에 CSS 모듈 생성
3. `tests/visual/pages.spec.ts`에 Percy 테스트 추가
4. 필요 시 `stories/` 디렉토리에 Storybook 스토리 추가

### 새로운 컴포넌트 추가 시

1. 컴포넌트 생성 및 스타일링
2. Storybook 스토리 작성
3. 다양한 상태별 스토리 포함 (기본, 호버, 선택, 에러 등)
4. 반응형 테스트 스토리 추가

## 📚 참고 자료

- [Percy Documentation](https://docs.percy.io/)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [Storybook Documentation](https://storybook.js.org/)

## 🤝 기여하기

1. 이 저장소를 Fork
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## ❓ 문제 해결

### 일반적인 문제

**Q: Percy 테스트가 실패합니다**
A: PERCY_TOKEN이 올바르게 설정되었는지 확인하고, Percy 대시보드에서 프로젝트 상태를 확인하세요.

**Q: Chromatic 빌드가 느립니다**
A: Storybook 빌드 시간을 단축하려면 불필요한 애드온을 제거하거나 stories 파일을 최적화하세요.

**Q: Playwright 테스트가 불안정합니다**
A: `page.waitForSelector()`와 같은 대기 조건을 추가하여 페이지 로딩을 보장하세요.

### 디버깅

```bash
# Playwright 디버그 모드
npx playwright test --debug

# Percy 로컬 비교
npx percy exec -- playwright test --headed

# Storybook 빌드 문제 확인
npm run build-storybook --verbose
```