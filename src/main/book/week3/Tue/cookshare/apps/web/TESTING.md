# 테스트 가이드

CookShare 웹 애플리케이션의 테스트 환경 설정 및 사용 가이드입니다.

## 📋 테스트 구성

### 1. Unit Tests (Jest + React Testing Library)
- **프레임워크**: Jest 29.7.0
- **라이브러리**: React Testing Library 16.3.0
- **환경**: jsdom
- **설정 파일**: `jest.config.js`, `jest.setup.js`

### 2. E2E Tests (Playwright)
- **프레임워크**: Playwright 1.55.0
- **브라우저**: Chromium, Firefox, Safari, Mobile
- **설정 파일**: `playwright.config.ts`

### 3. Test Coverage
- **임계값**: 각 항목 70%
- **보고서**: HTML, LCOV, JSON, Text
- **출력 디렉터리**: `coverage/`

## 🚀 테스트 실행 명령어

### Jest (Unit/Component Tests)

```bash
# 모든 테스트 실행
pnpm test

# Watch 모드로 테스트 실행
pnpm test:watch

# 커버리지와 함께 테스트 실행
pnpm test:coverage

# 특정 파일 테스트
pnpm test button.test.tsx

# 특정 패턴으로 테스트
pnpm test --testNamePattern="Button Component"
```

### Playwright (E2E Tests)

```bash
# E2E 테스트 실행
pnpm test:e2e

# UI 모드로 E2E 테스트 실행
pnpm test:e2e:ui

# 디버그 모드로 E2E 테스트 실행
pnpm test:e2e:debug

# 특정 브라우저로 테스트
pnpm test:e2e --project=chromium

# 헤드풀 모드로 테스트
pnpm test:e2e --headed
```

## 📁 테스트 파일 구조

```
apps/web/
├── app/
│   └── __tests__/
│       └── page.test.tsx           # 페이지 컴포넌트 테스트
├── components/
│   └── ui/
│       └── __tests__/
│           └── button.test.tsx     # UI 컴포넌트 테스트
├── lib/
│   ├── __tests__/
│   │   └── utils.test.ts          # 유틸리티 함수 테스트
│   └── test-utils.tsx             # 테스트 유틸리티
├── e2e/
│   ├── homepage.spec.ts           # E2E 테스트
│   └── mvp.spec.ts
├── jest.config.js                 # Jest 설정
├── jest.setup.js                  # Jest 설정 파일
└── playwright.config.ts           # Playwright 설정
```

## 🔧 테스트 작성 가이드

### Unit Test 예시

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button');
    
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Component Test 예시

```tsx
import { render } from '@/lib/test-utils'; // 커스텀 렌더 함수
import { mockRecipes } from '@/lib/test-utils';
import RecipeCard from '../RecipeCard';

describe('RecipeCard', () => {
  it('displays recipe information', () => {
    render(<RecipeCard recipe={mockRecipes[0]} />);
    
    expect(screen.getByText('김치찌개')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });
});
```

### E2E Test 예시

```ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/CookShare/);
    await expect(page.getByRole('heading', { name: /당신의.*요리/i })).toBeVisible();
  });

  test('should navigate to recipes page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /레시피 둘러보기/i }).click();
    await expect(page).toHaveURL(/.*recipes/);
  });
});
```

## 🎯 테스트 모범 사례

### 1. 테스트 네이밍
- 테스트 파일: `*.test.tsx` 또는 `*.spec.tsx`
- 설명적인 테스트 이름 사용
- Given-When-Then 패턴 고려

### 2. 컴포넌트 테스트
- 사용자 관점에서 테스트 작성
- 역할(role)과 접근 가능한 이름으로 요소 찾기
- 실제 사용자 상호작용 시뮬레이션

### 3. Mock 사용
```tsx
// Next.js 라우터 Mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// API 호출 Mock
import { mockFetch } from '@/lib/test-utils';
mockFetch({ recipes: mockRecipes });
```

### 4. 비동기 테스트
```tsx
// Loading 상태 테스트
it('shows loading state', async () => {
  render(<AsyncComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

### 5. 접근성 테스트
```tsx
// 스크린 리더 호환성
it('is accessible', () => {
  render(<Button>Submit</Button>);
  
  const button = screen.getByRole('button', { name: 'Submit' });
  expect(button).toHaveAccessibleName('Submit');
});
```

## 📊 커버리지 보고서

### 현재 커버리지 상태
- **Statements**: 26.7%
- **Branches**: 12.19%
- **Functions**: 11.32%
- **Lines**: 26.71%

### 커버리지 향상 방법
1. 더 많은 컴포넌트에 대한 테스트 추가
2. 엣지 케이스 테스트 추가
3. 에러 핸들링 테스트 추가
4. 통합 테스트 추가

### 커버리지 보고서 확인
```bash
# HTML 보고서 생성 후 브라우저에서 확인
pnpm test:coverage
open coverage/lcov-report/index.html
```

## 🔍 디버깅

### Jest 디버깅
```bash
# Node.js 디버거로 테스트 실행
node --inspect-brk node_modules/.bin/jest --runInBand

# VS Code에서 디버그 설정
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Playwright 디버깅
```bash
# 디버그 모드로 특정 테스트 실행
pnpm test:e2e --debug homepage.spec.ts

# 브라우저를 열고 단계별 실행
pnpm test:e2e --headed --slowMo=1000
```

## 🚨 트러블슈팅

### 자주 발생하는 문제들

1. **테스트가 찾아지지 않을 때**
   - `jest.config.js`의 `testMatch` 패턴 확인
   - 파일 경로와 네이밍 컨벤션 확인

2. **Mock이 작동하지 않을 때**
   - `jest.setup.js`에서 전역 mock 설정 확인
   - Mock 호출 순서와 스코프 확인

3. **E2E 테스트가 실패할 때**
   - 개발 서버가 실행 중인지 확인
   - 브라우저가 설치되어 있는지 확인: `npx playwright install`

4. **커버리지 임계값을 만족하지 못할 때**
   - `jest.config.js`에서 `coverageThreshold` 조정
   - 테스트가 부족한 파일에 대한 테스트 추가

## 🔄 CI/CD 통합

### GitHub Actions 예시
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test:coverage
      - run: pnpm test:e2e
```

## 📚 추가 리소스

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [React Testing Library 가이드](https://testing-library.com/docs/react-testing-library/intro)
- [Playwright 문서](https://playwright.dev/docs/intro)
- [테스트 모범 사례](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

테스트 환경이 완전히 구성되었습니다! 🎉