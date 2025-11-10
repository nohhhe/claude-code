# 온라인 쇼핑몰 MSA 모노레포

PNPM Workspace를 사용한 **마이크로서비스 아키텍처(MSA) + 모노레포** 구조의 현대적인 온라인 쇼핑몰 프로젝트입니다.

## 🏗️ 프로젝트 구조

```
online-shopping-mall/
├── packages/              # 🔗 공통 패키지 (모든 서비스에서 공유)
│   ├── shared/           # 공유 타입스크립트 타입, 유틸리티, 스키마
│   ├── ui/               # 재사용 가능한 React UI 컴포넌트 (Storybook)
│   ├── config/           # 공통 설정 (환경변수, 데이터베이스 등)
│   ├── types/            # 글로벌 타입 정의
│   └── utils/            # 공통 유틸리티 함수
├── services/              # 🚀 마이크로서비스들 (독립 배포 가능)
│   ├── user-service/     # 사용자 인증 & 관리 (NestJS, PostgreSQL, 포트 3001)
│   ├── product-service/  # 상품 카탈로그 & 재고 (NestJS, MongoDB, 포트 3002)
│   ├── order-service/    # 주문 처리 (NestJS, PostgreSQL + RabbitMQ, 포트 3003)
│   ├── payment-service/  # 결제 처리 (NestJS, PostgreSQL + RabbitMQ, 포트 3004)
│   ├── shipping-service/ # 배송 관리 (NestJS, PostgreSQL + RabbitMQ, 포트 3005)
│   ├── cart-service/     # 장바구니 (NestJS, Redis, 포트 3006)
│   ├── review-service/   # 상품 리뷰 (NestJS, MongoDB, 포트 3007)
│   └── notification-service/ # 알림 (NestJS, RabbitMQ + SendGrid + Twilio, 포트 3008)
├── apps/                  # 🖥️ 프론트엔드 애플리케이션들
│   ├── web-next/         # Next.js 고객용 웹사이트 (SSR, 포트 3100)
│   ├── admin/            # React 관리자 패널 (Ant Design, 포트 3200)
│   └── mobile/           # React Native 모바일 앱
├── gateway/               # 🌐 API Gateway (단일 진입점, Express, 포트 3000)
├── docker/                # 🐳 Docker 설정
├── .github/workflows/     # 🚀 CI/CD 파이프라인
└── docs/                  # 📚 프로젝트 문서
```

## 🎯 아키텍처 특징

### ✅ **모노레포 + MSA의 장점**
- **코드 공유**: packages/를 통한 타입 안전성과 코드 재사용
- **독립 배포**: 각 마이크로서비스 독립적으로 스케일링 및 배포
- **개발 효율성**: 단일 저장소에서 전체 시스템 관리
- **일관성**: 공통 패키지를 통한 코딩 표준 및 설정 통일

### 🔧 **기술 스택**
- **Backend**: NestJS + TypeScript + Swagger
- **Frontend**: Next.js (SSR), React + Ant Design, React Native
- **Database**: PostgreSQL, MongoDB, Redis
- **Message Queue**: RabbitMQ
- **Infrastructure**: Docker, PNPM Workspace
- **External APIs**: Stripe, SendGrid, Twilio

## 🚀 빠른 시작

### 📋 필수 요구사항
- **Node.js** 18+
- **PNPM** 8+
- **Docker & Docker Compose**

### ⚡ 설치 및 실행

```bash
# 1. 의존성 설치 (전체 모노레포)
pnpm install

# 2. 전체 시스템 개발 모드 실행
pnpm dev

# 3. Docker로 전체 인프라 + 서비스 실행
pnpm docker:up
```

### 🎛️ 세부 개발 명령어

```bash
# 공통 패키지만 개발
pnpm dev:shared     # 공유 타입/유틸리티
pnpm dev:ui         # Storybook UI 컴포넌트

# 마이크로서비스들만 개발
pnpm dev:services   # 모든 마이크로서비스 병렬 실행

# 프론트엔드 앱들만 개발  
pnpm dev:apps       # 모든 프론트엔드 앱 병렬 실행

# API Gateway
pnpm dev:gateway    # API Gateway만 실행

# 특정 서비스/앱만 실행
pnpm --filter @shopping-mall/user-service dev
pnpm --filter @shopping-mall/web dev
```

## 🗄️ 데이터베이스 & 인프라

### 데이터 저장소
- **PostgreSQL** (포트 5432): User, Order, Payment, Shipping 서비스
- **MongoDB** (포트 27017): Product, Review 서비스
- **Redis** (포트 6379): Cart 서비스, 세션 캐시

### 메시지 큐
- **RabbitMQ** (포트 5672, 관리자 15672): 비동기 서비스 간 통신

```bash
# 인프라만 시작 (로컬 개발용)
docker-compose up postgres mongodb redis rabbitmq -d
```

## 🌐 서비스 엔드포인트

| 서비스 | URL | 설명 |
|--------|-----|------|
| API Gateway | http://localhost:3000 | 모든 API의 단일 진입점 |
| User Service | http://localhost:3001/api/docs | 사용자 인증 (Swagger) |
| Product Service | http://localhost:3002/api/docs | 상품 관리 (Swagger) |
| Web App | http://localhost:3100 | Next.js 고객 웹사이트 |
| Admin Panel | http://localhost:3200 | React 관리자 패널 |
| Storybook | http://localhost:6006 | UI 컴포넌트 라이브러리 |
| RabbitMQ Management | http://localhost:15672 | 메시지 큐 관리 (admin/admin123) |

## 🔧 개발 워크플로우

### 1. **의존성 관리**
```bash
# 특정 서비스에 의존성 추가
pnpm --filter @shopping-mall/user-service add bcrypt
pnpm --filter @shopping-mall/web-next add axios

# 공통 패키지를 서비스에서 사용
pnpm --filter @shopping-mall/order-service add @shopping-mall/shared
```

### 2. **타입 안전성**
```typescript
// services/user/src/controllers/user.controller.ts
import { CreateUserDto, User } from '@shopping-mall/shared';

@Post()
async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  // 타입 안전한 개발
}
```

### 3. **빌드 및 테스트**
```bash
# 의존성 순서대로 전체 빌드
pnpm build

# 모든 서비스/앱 테스트
pnpm test

# 특정 서비스만 테스트
pnpm --filter @shopping-mall/user-service test

# 코드 품질
pnpm lint
pnpm type-check
```

## 🚢 배포

### CI/CD 파이프라인
- **GitHub Actions** 자동 빌드/테스트/배포
- **Docker 이미지** 각 서비스별 독립 빌드
- **Kubernetes** 지원 (Helm charts 포함)

### 프로덕션 빌드
```bash
# 모든 서비스 Docker 이미지 빌드
pnpm docker:build

# 특정 서비스만 Docker 빌드
docker build -f services/user/Dockerfile -t user-service .
docker build -f apps/web-next/Dockerfile -t web-app .
```

## 📚 문서 및 모니터링

- **API 문서**: 각 서비스 `/api/docs` (Swagger)
- **아키텍처 문서**: `docs/PLAN.md`
- **개발 가이드**: `docs/WBS.md`
- **리스크 분석**: `docs/RISK.md`

## 🔍 MSA 모노레포의 이점

### 🎯 **Best of Both Worlds**
1. **모노레포 장점**:
   - 코드 공유와 재사용성
   - 일관된 개발 환경 및 도구
   - 원자적 커밋 (여러 서비스 동시 변경)
   - 통합 CI/CD

2. **마이크로서비스 장점**:
   - 독립적 스케일링 및 배포
   - 기술 스택 자유도
   - 장애 격리 (Fault Isolation)
   - 팀별 서비스 소유권

### 📈 **확장성**
- **수평 확장**: 개별 서비스 독립적 스케일링
- **팀 확장**: 서비스별 팀 할당 가능
- **기술 확장**: 서비스별 최적 기술 스택 선택
