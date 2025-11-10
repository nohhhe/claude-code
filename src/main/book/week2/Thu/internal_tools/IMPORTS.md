# TypeScript Import Structure Analysis

## 프로젝트 개요
이 문서는 TypeScript/TSX 파일들의 import 구조를 분석한 결과를 담고 있습니다.

## 분석된 파일 목록
- `vite.config.ts` - Vite 설정 파일
- `src/main.tsx` - React 애플리케이션 진입점
- `src/App.tsx` - 메인 애플리케이션 컴포넌트
- `src/components/Header.tsx` - 헤더 컴포넌트
- `src/components/Button.tsx` - 재사용 가능한 버튼 컴포넌트
- `src/components/UserDisplay.tsx` - 사용자 데이터 표시 컴포넌트
- `src/services/userService.ts` - 사용자 데이터 서비스
- `src/utils/logger.ts` - 로깅 유틸리티

## Import 구조 상세 분석

### 1. 설정 파일 (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
```
- **외부 라이브러리**: 
  - `vite` - 빌드 도구 설정
  - `@vitejs/plugin-react` - React 플러그인

### 2. 애플리케이션 진입점 (`src/main.tsx`)
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
```
- **React 관련**:
  - `react` - React 핵심 라이브러리
  - `react-dom/client` - React 18 클라이언트 렌더링
- **내부 컴포넌트**:
  - `./App` - 메인 앱 컴포넌트 (상대 경로)

### 3. 메인 앱 컴포넌트 (`src/App.tsx`)
```typescript
import React, { useState } from 'react'
import Header from './components/Header'
import UserDisplay from './components/UserDisplay'
import { Logger } from './utils/logger'
```
- **React 관련**:
  - `react` - React와 useState 훅
- **내부 컴포넌트**:
  - `./components/Header` - 헤더 컴포넌트
  - `./components/UserDisplay` - 사용자 표시 컴포넌트
- **유틸리티**:
  - `./utils/logger` - 로거 클래스 (named import)

### 4. 헤더 컴포넌트 (`src/components/Header.tsx`)
```typescript
import React from 'react'
```
- **React 관련**:
  - `react` - React 핵심 라이브러리

### 5. 버튼 컴포넌트 (`src/components/Button.tsx`)
```typescript
import React, { forwardRef } from 'react'
```
- **React 관련**:
  - `react` - React와 forwardRef (특정 기능만 import)

### 6. 사용자 표시 컴포넌트 (`src/components/UserDisplay.tsx`)
```typescript
import React, { useState } from 'react'
import { User, getUserData, getUserById } from '../services/userService'
import { Logger } from '../utils/logger'
```
- **React 관련**:
  - `react` - React와 useState 훅
- **서비스 레이어**:
  - `../services/userService` - 다중 named import (타입과 함수들)
- **유틸리티**:
  - `../utils/logger` - Logger 클래스

### 7. 사용자 서비스 (`src/services/userService.ts`)
```typescript
// 이 파일은 import가 없고 export만 있음
```
- **특징**: Pure TypeScript 파일로 외부 의존성 없음

### 8. 로거 유틸리티 (`src/utils/logger.ts`)
```typescript
// 이 파일은 import가 없고 export만 있음
```
- **특징**: Pure TypeScript 파일로 외부 의존성 없음

## Import 패턴 분석

### 1. Import 스타일별 분류

#### Default Import
- `import React from 'react'` - React 컴포넌트들에서
- `import App from './App'` - 메인 진입점에서
- `import Header from './components/Header'` - 컴포넌트 간 참조
- `import UserDisplay from './components/UserDisplay'`
- `import react from '@vitejs/plugin-react'` - 설정 파일에서

#### Named Import
- `import { useState } from 'react'` - React 훅들
- `import { forwardRef } from 'react'` - React 유틸리티
- `import { defineConfig } from 'vite'` - 설정 함수들
- `import { User, getUserData, getUserById } from '../services/userService'` - 다중 named import
- `import { Logger } from './utils/logger'` - 클래스 import

#### Mixed Import (Default + Named)
- `import React, { useState } from 'react'`
- `import React, { forwardRef } from 'react'`

### 2. 경로 패턴별 분류

#### 외부 라이브러리 (node_modules)
- `'react'` - React 핵심
- `'react-dom/client'` - React DOM
- `'vite'` - 빌드 도구
- `'@vitejs/plugin-react'` - Vite 플러그인

#### 상대 경로 - 같은 레벨
- `'./App'` - 같은 디렉토리의 파일

#### 상대 경로 - 하위 디렉토리
- `'./components/Header'` - 하위 components 폴더
- `'./components/UserDisplay'`
- `'./utils/logger'` - 하위 utils 폴더

#### 상대 경로 - 상위 디렉토리
- `'../services/userService'` - 한 단계 위의 services 폴더
- `'../utils/logger'` - 한 단계 위의 utils 폴더

### 3. 의존성 그래프

```
main.tsx
└── App.tsx
    ├── components/Header.tsx
    ├── components/UserDisplay.tsx
    │   ├── services/userService.ts
    │   └── utils/logger.ts
    └── utils/logger.ts

components/Button.tsx (독립적)

vite.config.ts (독립적)
```

### 4. 특징 및 패턴

#### 강점
1. **명확한 구조**: 컴포넌트, 서비스, 유틸리티가 명확히 분리됨
2. **일관성**: React import 스타일이 일관됨
3. **타입 안전성**: TypeScript 인터페이스와 타입들이 적절히 export/import됨
4. **순환 의존성 없음**: 단방향 의존성 구조

#### 개선 가능한 점
1. **절대 경로 사용**: `../services/userService` 대신 `@/services/userService` 사용 고려
2. **배럴 export**: 각 폴더에 `index.ts` 추가하여 import 단순화
3. **타입 전용 import**: `import type { User }` 사용 고려

### 5. 권장사항

1. **절대 경로 설정**: tsconfig.json에 path mapping 추가
2. **Import 정렬**: ESLint import 순서 규칙 적용
3. **타입/인터페이스 분리**: 별도의 types 폴더 고려
4. **재사용 가능한 컴포넌트**: components/ui 폴더에 공통 컴포넌트 모음

## TODO 개선사항

1. **TODO**: Absolute path mapping 설정 추가 - tsconfig.json에 baseUrl과 paths 설정으로 import 경로 단순화
2. **TODO**: ESLint import 순서 규칙 추가 - 외부 라이브러리, 내부 모듈, 상대 경로 순으로 정렬
3. **TODO**: 타입 정의 분리 - src/types/index.ts 생성하여 공통 타입들을 중앙화
4. **TODO**: 배럴 export 패턴 도입 - 각 폴더에 index.ts 추가하여 import 구문 단순화
5. **TODO**: 컴포넌트 분류 개선 - UI 컴포넌트와 비즈니스 로직 컴포넌트 분리