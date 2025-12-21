# Period Tracker - 여성 월경 주기 관리 서비스

여성의 월경 주기를 추적하고 관리하는 웹 애플리케이션입니다.

## 기술 스택

### 백엔드
- **Language**: Kotlin
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Validation**: Bean Validation

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Management**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Date Library**: date-fns
- **Charts**: Recharts

### 개발 환경
- **Database**: Docker (PostgreSQL)
- **Build Tool**: Gradle (Backend), npm/pnpm (Frontend)

## 주요 기능

- 📅 월경 주기 기록 및 추적
- 📊 주기 패턴 분석 및 시각화
- 🔔 예정일 알림
- 📝 증상 및 메모 기록
- 📈 통계 및 리포트
- 🔐 안전한 사용자 인증 (JWT)

## 시작하기

### 필수 요구사항
- Docker & Docker Compose
- JDK 17+
- Node.js 18+
- npm/pnpm

### 데이터베이스 실행
```bash
docker-compose up -d
```

### 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 접속 정보

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **API 문서 (Swagger)**: http://localhost:8080/swagger-ui.html
- **PostgreSQL**: localhost:5432

## 프로젝트 구조

```
period-tracker/
├── backend/           # Spring Boot + Kotlin 백엔드
│   ├── src/
│   ├── build.gradle.kts
│   └── ...
├── frontend/          # Next.js + React 프론트엔드
│   ├── src/
│   ├── package.json
│   └── ...
├── docs/              # 프로젝트 문서
│   ├── SETUP.md           # 설정 가이드
│   ├── MVP_SPEC.md        # MVP 기능 명세서
│   ├── ARCHITECTURE.md    # 아키텍처 문서
│   └── WBS.md             # 작업 분해 구조
├── docker-compose.yml # 개발 환경 DB 설정
└── README.md
```

## 📚 문서

프로젝트 관련 상세 문서는 `docs/` 디렉토리에서 확인할 수 있습니다:

- **[SETUP.md](docs/SETUP.md)** - 개발 환경 설정 가이드
- **[MVP_SPEC.md](docs/MVP_SPEC.md)** - MVP 기능 명세서 (사용자 스토리, 우선순위)
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - 시스템 아키텍처 및 기술 설계
- **[WBS.md](docs/WBS.md)** - 작업 분해 구조 및 일정 관리
- **[RISK_ANALYSIS.md](docs/RISK_ANALYSIS.md)** - 리스크 분석 보고서
- **[DEPENDENCY_ANALYSIS.md](docs/DEPENDENCY_ANALYSIS.md)** - 의존성 분석 보고서 ⭐ NEW
- **[SECURITY_UPDATE_LOG.md](docs/SECURITY_UPDATE_LOG.md)** - 보안 업데이트 로그 ⭐ NEW

## 개발 가이드

### 백엔드 API 엔드포인트

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/cycles` - 월경 주기 목록 조회
- `POST /api/cycles` - 월경 주기 기록
- `GET /api/cycles/stats` - 통계 조회

### 환경 변수

#### 백엔드 (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/period_tracker
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
jwt:
  secret: your-secret-key
  expiration: 86400000
```

#### 프론트엔드 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 라이선스

MIT
