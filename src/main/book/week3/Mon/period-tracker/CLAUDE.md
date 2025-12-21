# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

Period Tracker는 여성 월경 주기 관리 풀스택 애플리케이션입니다. Kotlin/Spring Boot 백엔드와 Next.js 14 프론트엔드로 구성되며, JWT 인증과 PostgreSQL을 사용합니다.

## 필수 명령어

### 데이터베이스
```bash
# PostgreSQL 컨테이너 시작
docker-compose up -d

# 데이터베이스 중지
docker-compose down

# 데이터베이스 로그 확인
docker logs period-tracker-db
```

### 백엔드 (Spring Boot + Kotlin)
```bash
cd backend

# 애플리케이션 실행
./gradlew bootRun

# 프로젝트 빌드
./gradlew build

# 테스트 실행
./gradlew test

# 특정 테스트 클래스 실행
./gradlew test --tests "ClassName"

# 클린 빌드
./gradlew clean build
```

### 프론트엔드 (Next.js)
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린터 실행
npm run lint
```

## 아키텍처

### 백엔드 구조 (Kotlin + Spring Boot)

백엔드는 계층형 아키텍처 패턴을 따릅니다:

- **domain/** - JPA 엔티티 (User, Cycle)
- **dto/** - API 요청/응답용 데이터 전송 객체
- **repository/** - Spring Data JPA 레포지토리
- **service/** - 비즈니스 로직 계층
- **controller/** - REST API 엔드포인트 (@RestController)
- **security/** - JWT 인증 (JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService)
- **config/** - Spring 설정 (SecurityConfig, JwtProperties)

**주요 보안 플로우:**
- 로그인 시 JWT 토큰이 생성되고 JwtAuthenticationFilter에서 검증됨
- SecurityConfig에서 엔드포인트 인가 규칙 정의
- CustomUserDetailsService가 인증을 위한 사용자 정보 로드
- JwtProperties는 application.yml의 JWT 시크릿과 만료 시간 보관

**중요 설정 파일:**
- 데이터베이스 연결: `application.yml` (PostgreSQL localhost:5432)
- JWT 시크릿 및 만료: `application.yml`의 `jwt:` 섹션
- API 문서: http://localhost:8080/swagger-ui.html

### 프론트엔드 구조 (Next.js 14 App Router)

Next.js App Router와 TypeScript 사용:

- **src/app/** - Next.js App Router 페이지
  - `/login`, `/register`, `/dashboard` 라우트
  - `layout.tsx` - 루트 레이아웃
  - `globals.css` - Tailwind 글로벌 스타일
- **src/lib/** - 유틸리티 함수 및 API 클라이언트 (Axios)
- **src/store/** - Zustand 상태 관리
- **src/types/** - TypeScript 타입 정의

**상태 관리:**
- Zustand를 사용한 클라이언트 상태 관리
- React Hook Form + Zod로 폼 검증

**API 통신:**
- src/lib/에 Axios 클라이언트 구성
- Base URL: .env.local의 `NEXT_PUBLIC_API_URL` (기본값: http://localhost:8080/api)

## API 엔드포인트

주요 엔드포인트 (`/api` 프리픽스):

- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인 (JWT 토큰 반환)
- `GET /cycles` - 월경 주기 목록 조회 (인증 필요)
- `POST /cycles` - 새 주기 기록 (인증 필요)
- `GET /cycles/stats` - 통계 조회 (인증 필요)

## 환경 설정

### 백엔드 (.yml)
`backend/src/main/resources/application.yml`에서 설정:
- 데이터베이스 인증 정보 (기본값: postgres/postgres)
- JWT 시크릿 (프로덕션에서는 최소 256비트 필수)
- JWT 만료 시간 (기본값: 24시간)
- 서버 포트 (8080)

### 프론트엔드 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 개발 워크플로우

1. 데이터베이스 시작: `docker-compose up -d`
2. 백엔드 실행: `cd backend && ./gradlew bootRun`
3. 프론트엔드 실행: `cd frontend && npm run dev`
4. 접속:
   - 프론트엔드: http://localhost:3000
   - 백엔드 API: http://localhost:8080
   - Swagger 문서: http://localhost:8080/swagger-ui.html

## 주요 의존성

**백엔드:**
- Spring Boot 3.4.1 (2025-12-21 보안 업데이트)
- Kotlin 1.9.21
- Spring Security + JWT (jjwt 0.12.3)
- Spring Data JPA + PostgreSQL
- SpringDoc OpenAPI 2.3.0 (Swagger)

**프론트엔드:**
- Next.js 14.2.35 (2025-12-21 보안 업데이트)
- React 18
- Zustand 4.4.7 (상태 관리)
- React Hook Form 7.49.2 + Zod 3.22.4 (폼)
- Axios 1.6.2 (HTTP)
- date-fns 3.0.6, recharts 2.10.3

## 추가 문서

`docs/` 디렉토리에서 상세 문서 확인:
- `ARCHITECTURE.md` - 시스템 아키텍처 다이어그램
- `MVP_SPEC.md` - MVP 기능 명세서 및 사용자 스토리
- `SETUP.md` - 상세 설정 가이드
- `WBS.md` - 작업 분해 구조
- `RISK_ANALYSIS.md` - 리스크 분석 보고서
