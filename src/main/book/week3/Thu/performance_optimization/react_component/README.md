# React 컴포넌트 성능 최적화 예제

이 프로젝트는 React 컴포넌트의 성능 최적화 전후를 비교할 수 있는 실습 예제입니다.

## 주요 최적화 기법

### 1. React.memo 사용
- **Before**: 컴포넌트가 매번 재렌더링됨
- **After**: props가 변경될 때만 재렌더링

### 2. useMemo 훅 사용
- **Before**: 매 렌더링마다 필터링/정렬 연산 실행
- **After**: 의존성 배열이 변경될 때만 연산 실행

### 3. useCallback 훅 사용
- **Before**: 매번 새로운 함수 생성
- **After**: 함수 참조를 메모이제이션

### 4. 가상화 (react-window)
- **Before**: 모든 아이템을 DOM에 렌더링
- **After**: 화면에 보이는 아이템만 렌더링

### 5. 이미지 최적화
- `loading="lazy"`: 지연 로딩
- `decoding="async"`: 비동기 디코딩

## 파일 구조

```
├── ProductListBefore.tsx    # 최적화 전 컴포넌트
├── ProductListAfter.tsx     # 최적화 후 컴포넌트
├── SampleApp.tsx           # 데모 앱
├── types.ts                # 타입 정의
├── styles.css              # 스타일시트
└── package.json            # 의존성 관리
```

## 설치 및 실행

```bash
npm install
npm run dev
```

## 성능 측정 방법

1. **브라우저 개발자 도구 Performance 탭 사용**
   - 녹화 시작 → 컴포넌트 상호작용 → 녹화 종료
   - Before/After 버전의 렌더링 시간 비교

2. **콘솔 타이머 확인**
   - 콘솔에서 "Processing products" 시간 비교
   - 필터 변경 시 재계산 시간 측정

3. **React DevTools Profiler**
   - 컴포넌트별 렌더링 시간 분석
   - 재렌더링 원인 파악

## 주요 성능 차이점

### 메모리 사용량
- **Before**: 모든 DOM 노드가 메모리에 유지
- **After**: 가상화로 메모리 사용량 최소화

### 초기 렌더링 속도
- **Before**: 모든 아이템 렌더링으로 느린 초기 로딩
- **After**: 가시 영역만 렌더링으로 빠른 초기 로딩

### 상호작용 응답성
- **Before**: 필터 변경 시 전체 재계산
- **After**: 메모이제이션으로 빠른 응답

### CPU 사용량
- **Before**: 불필요한 재계산으로 높은 CPU 사용
- **After**: 효율적인 메모이제이션으로 낮은 CPU 사용

## 최적화 적용 가이드라인

1. **React.memo**: props 비교 비용 < 렌더링 비용일 때 사용
2. **useMemo**: 계산 비용이 높은 연산에만 사용
3. **useCallback**: 자식 컴포넌트에 콜백 전달 시 사용
4. **가상화**: 대용량 리스트 (100개 이상)에서 사용
5. **이미지 최적화**: 모든 이미지에 기본적으로 적용

## 주의사항

- 메모이제이션도 비용이 있으므로 과도한 사용은 피해야 함
- 의존성 배열 관리에 주의 (lint 규칙 활용)
- 가상화 사용 시 아이템 크기가 일정해야 함