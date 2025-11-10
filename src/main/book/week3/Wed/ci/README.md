# GitHub Actions CI Example

이 프로젝트는 Node.js 애플리케이션에 대한 GitHub Actions CI/CD 파이프라인의 완전한 예제입니다.

## 기능

- Express.js REST API
- Prisma ORM을 사용한 PostgreSQL 데이터베이스
- 3가지 테스트 레벨:
  - 단위 테스트 (Jest)
  - 통합 테스트 (Jest + Supertest)
  - E2E 테스트 (Playwright)
- GitHub Actions를 통한 CI/CD

## 프로젝트 구조

```
├── .github/workflows/
│   └── test.yml              # CI/CD 워크플로우
├── src/
│   ├── index.js              # Express 애플리케이션
│   └── utils.js              # 유틸리티 함수
├── test/
│   ├── unit/                 # 단위 테스트
│   └── integration/          # 통합 테스트
├── tests/                    # E2E 테스트 (Playwright)
├── prisma/
│   ├── schema.prisma         # 데이터베이스 스키마
│   ├── migrations/           # 데이터베이스 마이그레이션
│   └── seed.js               # 데이터베이스 시드
├── package.json
└── playwright.config.js
```

## 로컬 개발

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 데이터베이스 설정:
   ```bash
   # PostgreSQL이 실행 중이어야 합니다
   export DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. 애플리케이션 시작:
   ```bash
   npm start
   # 또는 개발 모드로
   npm run dev
   ```

## 테스트 실행

```bash
# 모든 테스트
npm test

# 단위 테스트만
npm run test:unit

# 통합 테스트만
npm run test:integration

# E2E 테스트만
npm run test:e2e
```

## GitHub Actions CI

이 프로젝트는 3개의 병렬 작업으로 구성된 CI 파이프라인을 포함합니다:

### 1. Unit Tests
- Node.js 18.x 및 20.x에서 실행
- Jest를 사용한 단위 테스트
- 코드 커버리지 수집 및 Codecov에 업로드

### 2. Integration Tests  
- PostgreSQL 15 서비스 컨테이너 사용
- 데이터베이스 마이그레이션 및 시드 실행
- API 엔드포인트 통합 테스트

### 3. E2E Tests
- Playwright를 사용한 전체 애플리케이션 테스트
- 애플리케이션 빌드 및 시작
- 브라우저 기반 테스트 실행
- 실패 시 테스트 리포트 아티팩트 업로드

## API 엔드포인트

- `GET /` - Hello World 메시지
- `GET /health` - 애플리케이션 상태 확인  
- `GET /users` - 모든 사용자 조회
- `POST /users` - 새 사용자 생성

## 환경 변수

- `DATABASE_URL` - PostgreSQL 연결 문자열
- `PORT` - 서버 포트 (기본값: 3000)

이 예제는 실제 프로덕션 환경에서 사용할 수 있는 완전한 CI/CD 파이프라인을 보여줍니다.