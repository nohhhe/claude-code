# 테스트 모니터링 대시보드

Jest를 이용한 테스트 결과를 시각화하는 대시보드 예제입니다.

## 기능

- **테스트 통과율 추이**: 시간에 따른 테스트 성공률 변화를 라인 차트로 표시
- **커버리지 변화 그래프**: statements, branches, functions, lines 커버리지의 변화 추이
- **실패한 테스트 목록**: 현재 실패하고 있는 테스트의 상세 정보 표시  
- **테스트 실행 시간 분석**: 테스트 실행 시간의 변화를 바 차트로 표시

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 샘플 데이터 생성
```bash
npm run generate-report
```

### 3. 대시보드 실행
```bash
npm start
```

브라우저에서 http://localhost:3000 접속

### 4. 테스트 실행 (실제 데이터)
```bash
npm test
```

## 프로젝트 구조

```
monitoring_reporting/
├── package.json              # 프로젝트 설정 및 의존성
├── server.js                 # Express 서버
├── scripts/
│   ├── test-processor.js     # Jest 테스트 결과 처리기
│   └── generate-report.js    # 샘플 데이터 생성기
├── public/
│   ├── index.html           # 대시보드 HTML
│   ├── css/
│   │   └── dashboard.css    # 대시보드 스타일
│   └── js/
│       └── dashboard.js     # 대시보드 JavaScript
├── src/
│   └── math.js             # 테스트 대상 코드
├── tests/
│   └── sample.test.js      # 샘플 테스트
├── data/
│   └── test-history.json   # 테스트 이력 데이터
└── reports/
    └── latest-report.json  # 최신 테스트 보고서
```

## API 엔드포인트

- `GET /api/test-history` - 테스트 이력 데이터
- `GET /api/latest-report` - 최신 테스트 보고서
- `GET /api/coverage-trend` - 커버리지 추이 데이터
- `GET /api/failed-tests` - 실패한 테스트 목록

## 대시보드 화면

대시보드는 다음 섹션들로 구성됩니다:

### 1. 요약 카드
- 총 테스트 수
- 통과율
- 실패한 테스트 수
- 총 실행 시간

### 2. 차트
- **테스트 통과율 추이**: 시간별 통과율 변화
- **커버리지 변화**: 4가지 커버리지 메트릭 추이
- **테스트 실행 시간 분석**: 실행 시간 변화
- **현재 커버리지**: 도넛 차트로 현재 커버리지 상태 표시

### 3. 실패한 테스트 목록
- 테스트 파일 경로
- 테스트 스위트와 테스트 이름
- 실행 시간
- 오류 메시지

## 사용 방법

### 실제 프로젝트에 통합하기

1. `scripts/test-processor.js`를 프로젝트에 복사
2. `package.json`의 jest 설정에 `testResultsProcessor` 추가:
```json
{
  "jest": {
    "testResultsProcessor": "./scripts/test-processor.js"
  }
}
```

3. 테스트 실행 후 자동으로 데이터 수집됨
4. 대시보드 서버 실행하여 결과 확인

### 커스터마이징

- 차트 스타일과 색상: `public/js/dashboard.js`에서 Chart.js 옵션 수정
- 대시보드 디자인: `public/css/dashboard.css` 수정
- 데이터 처리 로직: `scripts/test-processor.js` 수정

## 기술 스택

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **Charts**: Chart.js
- **Testing**: Jest
- **Data Storage**: JSON 파일

## 특징

- 📊 실시간 데이터 업데이트 (30초마다 자동 새로고침)
- 📱 반응형 디자인 (모바일 지원)
- 🎨 직관적인 UI/UX
- ⚡ 빠른 성능 (클라이언트 사이드 렌더링)
- 🔧 쉬운 커스터마이징