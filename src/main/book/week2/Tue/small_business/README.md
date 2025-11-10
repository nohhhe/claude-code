# 🏪 SmallBiz Manager

소상공인을 위한 통합 업무 관리 시스템

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 프로젝트 개요

SmallBiz Manager는 소상공인들의 일상적인 업무를 효율적으로 관리할 수 있도록 도와주는 웹 애플리케이션입니다.

### 🎯 주요 기능

- **📊 통합 매출/재고 관리**: 일일 매출 기록, 재고 알림, 매출 분석
- **👥 고객 관리**: 고객 정보 관리, 단골고객 식별, 마케팅 알림  
- **📅 업무 일정 관리**: 캘린더 통합, 업무 배정, 알림 시스템
- **🎛️ 비즈니스 대시보드**: 핵심 지표 모니터링, 성과 추적

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript** - 컴포넌트 기반 UI 개발
- **Material-UI (MUI)** - 일관된 디자인 시스템
- **Zustand** - 경량 상태 관리
- **React Query** - 서버 상태 관리 및 캐싱
- **Vite** - 빠른 개발 서버 및 빌드

### Backend
- **Node.js** + **Express** + **TypeScript** - RESTful API 서버
- **PostgreSQL** - 관계형 데이터베이스
- **Prisma ORM** - 타입 안전한 데이터베이스 접근
- **JWT** - 인증 및 권한 관리

### DevOps
- **GitHub Actions** - CI/CD 파이프라인
- **Docker** - 컨테이너화
- **Vercel** - 프론트엔드 배포
- **Railway/Render** - 백엔드 배포

## 🚀 바로 실행하기 (스크립트 없이)

### ✅ 준비 완료 상태

모든 개발 환경이 구축되어 있어 바로 실행할 수 있습니다!

- ✅ Frontend & Backend 코드 및 패키지 설치 완료
- ✅ PostgreSQL & Redis 컨테이너 실행 중
- ✅ 데이터베이스 스키마 및 테스트 데이터 준비 완료

### 🔧 바로 실행하는 방법

#### 1. 백엔드 서버 실행
```bash
cd backend
npm run dev
```
→ 서버가 http://localhost:5000 에서 실행됩니다

#### 2. 프론트엔드 서버 실행 (새 터미널)
```bash
cd frontend
npm run dev
```
→ 웹앱이 http://localhost:3000 에서 자동으로 열립니다

#### 3. 로그인하기
```
이메일: admin@test.com
비밀번호: password123
```

### 📱 접속 주소
- **웹 애플리케이션**: http://localhost:3000
- **백엔드 API**: http://localhost:5000
- **API 상태 확인**: http://localhost:5000/health
- **Prisma Studio**: `cd backend && npm run db:studio`

---

## 🔄 추가 설정 (필요시)

### 사전 요구사항

- Node.js (>= 18.0.0)
- Docker & Docker Compose
- Git

### 저장소 클론 (처음 설치하는 경우)

```bash
git clone https://github.com/your-username/smallbiz-manager.git
cd smallbiz-manager
```

### 개발 환경 재초기화 (문제 발생시)

```bash
# 데이터베이스 재시작
docker-compose down -v
docker-compose up -d postgres redis

# 잠시 기다린 후 스키마 재설정
sleep 10
cd backend
npx prisma db push
npx prisma db seed
```

## 📁 프로젝트 구조

```
smallbiz-manager/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── stores/         # Zustand 상태 관리
│   │   ├── services/       # API 서비스 레이어
│   │   ├── types/          # TypeScript 타입 정의
│   │   └── utils/          # 유틸리티 함수
│   └── package.json
├── backend/                  # Node.js 백엔드
│   ├── src/
│   │   ├── controllers/    # 요청 처리 로직
│   │   ├── middleware/     # 미들웨어 함수
│   │   ├── routes/         # API 라우트 정의
│   │   ├── services/       # 비즈니스 로직
│   │   ├── utils/          # 유틸리티 함수
│   │   └── types/          # TypeScript 타입 정의
│   ├── prisma/             # 데이터베이스 스키마
│   └── package.json
├── docs/                    # 프로젝트 문서
├── .github/                 # GitHub 워크플로우
└── docker-compose.yml       # Docker 설정
```

## 🔧 개발 명령어

### 📊 개발 서버 실행

```bash
# 백엔드 서버
cd backend
npm run dev          # 개발 서버 (nodemon + ts-node)
npm run build        # TypeScript 컴파일
npm start            # 프로덕션 실행

# 프론트엔드 서버  
cd frontend
npm run dev          # Vite 개발 서버
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기
```

### 🗄️ 데이터베이스 관리

```bash
cd backend
npm run db:studio    # Prisma Studio GUI 실행
npm run db:push      # 스키마를 DB에 동기화
npm run db:migrate   # 마이그레이션 생성 및 실행
npm run db:seed      # 테스트 데이터 시드
npm run db:generate  # Prisma 클라이언트 재생성
```

### 🧪 테스트 및 품질 관리

```bash
# 테스트
npm run test         # Jest 테스트 실행
npm run test:watch   # Jest watch 모드
npm run test:coverage # 커버리지 리포트

# 코드 품질
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크
npm run format       # Prettier 포맷팅 (frontend만)
npm run format:check # 포맷팅 검사 (frontend만)
```

### 🐳 Docker 관리

```bash
# 전체 환경 실행
docker-compose up -d

# 개별 서비스 실행
docker-compose up -d postgres redis

# 로그 확인
docker-compose logs -f [service-name]

# 환경 초기화 (볼륨 포함)
docker-compose down -v
```

## 🚢 배포

### 프론트엔드 (Vercel)

1. [Vercel](https://vercel.com)에서 새 프로젝트 생성
2. GitHub 저장소 연결
3. 루트 디렉터리를 `frontend`로 설정
4. 환경 변수 설정:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### 백엔드 (Railway/Render)

1. [Railway](https://railway.app) 또는 [Render](https://render.com)에서 새 서비스 생성
2. GitHub 저장소 연결
3. 루트 디렉터리를 `backend`으로 설정
4. 환경 변수 설정:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=https://your-frontend-url.com
   ```

## 🤝 기여하기

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 규칙

- **커밋 메시지**: [Conventional Commits](https://www.conventionalcommits.org/) 형식 사용
- **브랜치 명명**: `feature/`, `bugfix/`, `hotfix/` 접두사 사용
- **코드 리뷰**: 모든 PR은 최소 1명의 리뷰어 승인 필요

## 📝 API 문서

### 현재 구현된 API

#### 인증 엔드포인트
```http
POST /api/auth/login     # 로그인 (구현 완료)
GET  /api/auth/profile   # 프로필 조회 (구현 완료)
GET  /health            # 서버 상태 확인
```

#### 매출 관리 엔드포인트
```http
GET  /api/sales         # 매출 목록 조회 (Mock 데이터)
POST /api/sales         # 매출 등록 (Mock)
GET  /api/sales/stats   # 매출 통계 (Mock 데이터)
```

#### 테스트 데이터
- 관리자 계정: admin@test.com / password123
- 테스트 고객: 김철수, 이영희
- 매출 데이터: 3건의 샘플 매출 데이터
- 재고 데이터: 아메리카노, 샌드위치, 쿠키

[전체 API 문서](./docs/API.md) 참고

## 🔍 구현된 기능 상세

### ✅ 완료된 기능
- **JWT 기반 인증 시스템** - 로그인/로그아웃, 토큰 관리
- **Material-UI 대시보드** - 반응형 UI, 통계 카드
- **Zustand 상태 관리** - 사용자 인증 상태 관리
- **Prisma ORM 통합** - PostgreSQL 연동, 타입 안전성
- **Docker 개발환경** - PostgreSQL, Redis 컨테이너
- **테스트 데이터 시드** - 즉시 테스트 가능한 샘플 데이터

### 🚧 개발 예정 기능
- [ ] 실제 매출 데이터 CRUD 구현
- [ ] 재고 관리 시스템
- [ ] 고객 관리 기능
- [ ] 차트 및 분석 대시보드
- [ ] PWA 기능 (오프라인 지원)
- [ ] 알림 시스템

## 🐛 트러블슈팅

### 자주 발생하는 문제들

#### 1. 데이터베이스 연결 오류

```bash
# Docker 컨테이너 상태 확인
docker-compose ps

# 데이터베이스 재시작
docker-compose down -v
docker-compose up -d postgres redis
```

#### 2. 포트 충돌 오류

```bash
# 사용 중인 포트 확인
lsof -i :3000  # 프론트엔드
lsof -i :5000  # 백엔드

# 프로세스 종료
kill -9 <PID>
```

#### 3. Prisma 관련 오류

```bash
# Prisma 클라이언트 재생성
cd backend
npm run db:generate
npm run db:push
npm run db:seed
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👥 팀

- **개발자**: [Your Name](https://github.com/yourusername)
- **디자이너**: [Designer Name](https://github.com/designerusername)

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 다음으로 연락주세요:

- 이메일: contact@smallbiz-manager.com
- 이슈 트래커: [GitHub Issues](https://github.com/your-username/smallbiz-manager/issues)

---

⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요!