#!/bin/bash

# 📚 SmallBiz Manager - 종합 문서 생성 스크립트
# 사용법: chmod +x create-docs.sh && ./create-docs.sh

set -e

echo "📚 종합 문서를 생성합니다..."

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "\n${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# VS Code 워크스페이스 설정
create_vscode_workspace() {
    print_step "VS Code 워크스페이스 설정 생성 중..."
    
    mkdir -p .vscode
    
    # 워크스페이스 설정
    cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "css",
    "*.scss": "scss"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.next": true,
    "**/coverage": true
  },
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
EOF

    # 확장 프로그램 권장 목록
    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "ms-vscode-remote.remote-containers",
    "ms-vscode-remote.remote-ssh",
    "ms-vscode.remote-explorer"
  ]
}
EOF

    # 디버깅 설정
    cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend/src",
      "sourceMaps": true
    }
  ]
}
EOF

    # 태스크 설정
    cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Backend: Dev Server",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "isBackground": true
    },
    {
      "label": "Frontend: Dev Server",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "isBackground": true
    },
    {
      "label": "Install All Dependencies",
      "type": "shell",
      "command": "npm",
      "args": ["install"],
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm",
      "args": ["test"],
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "group": "test"
    }
  ]
}
EOF

    print_success "VS Code 워크스페이스 설정 완료"
}

# 팀 공유용 README 업데이트
create_team_readme() {
    print_step "팀 공유용 README 업데이트 중..."
    
    cat > README-TEAM.md << 'EOF'
# 🏪 SmallBiz Manager - 팀 개발 가이드

소상공인을 위한 통합 업무 관리 시스템 팀 개발 가이드입니다.

## 🚀 빠른 시작 (팀원용)

### 1단계: 저장소 클론 및 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-org/smallbiz-manager.git
cd smallbiz-manager

# 개발 환경 자동 설정 (권장)
chmod +x setup-complete.sh
./setup-complete.sh

# 설정 파일 생성
chmod +x configure-project.sh  
./configure-project.sh

# 기본 구조 생성
chmod +x create-basic-structure.sh
./create-basic-structure.sh
```

### 2단계: 의존성 설치

```bash
# Frontend 의존성 설치
cd frontend
npm install

# Backend 의존성 설치  
cd ../backend
npm install

# 루트 디렉터리로 돌아가기
cd ..
```

### 3단계: 개발 서버 실행

```bash
# 방법 1: Docker 사용 (권장)
docker-compose up -d

# 방법 2: 개별 실행
# 터미널 1: Backend
cd backend && npm run dev

# 터미널 2: Frontend  
cd frontend && npm run dev
```

## 🛠️ 개발 워크플로우

### 브랜치 전략

```bash
# 새 기능 개발 시작
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 개발 완료 후
git add .
git commit -m "feat(scope): 기능 설명"
git push origin feature/your-feature-name

# PR 생성 (GitHub에서)
```

### 커밋 메시지 규칙

```bash
# 형식: type(scope): description

# 예시들
feat(auth): JWT 로그인 기능 추가
fix(dashboard): 차트 데이터 로딩 버그 수정  
docs(readme): API 문서 업데이트
style(header): 반응형 디자인 개선
refactor(api): 사용자 서비스 리팩토링
test(auth): 로그인 컴포넌트 테스트 추가
chore(deps): React 18.2.0 업그레이드
```

### 코드 리뷰 체크리스트

**개발자 (PR 생성 전)**
- [ ] 코드 자체 리뷰 완료
- [ ] 테스트 작성 및 통과 확인
- [ ] 린트 및 포맷팅 통과
- [ ] 타입 체크 통과
- [ ] 빌드 성공 확인

**리뷰어**
- [ ] 코드 품질 적절
- [ ] 보안 이슈 없음
- [ ] 성능 영향 검토
- [ ] 테스트 커버리지 적절
- [ ] 문서 업데이트 필요 여부

## 📋 개발 명령어

### Frontend 명령어

```bash
cd frontend

# 개발 서버 실행
npm run dev

# 빌드
npm run build  

# 테스트
npm run test
npm run test:watch
npm run test:coverage

# 코드 품질
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run type-check
```

### Backend 명령어

```bash
cd backend

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 테스트  
npm run test
npm run test:watch
npm run test:coverage

# 코드 품질
npm run lint
npm run lint:fix  
npm run format
npm run format:check

# 데이터베이스
npm run db:generate    # Prisma 클라이언트 생성
npm run db:push        # 스키마를 DB에 적용
npm run db:migrate     # 마이그레이션 생성/실행
npm run db:studio      # Prisma Studio 실행
npm run db:seed        # 시드 데이터 실행
npm run db:reset       # DB 초기화
```

### Docker 명령어

```bash
# 전체 서비스 실행
docker-compose up -d

# 특정 서비스만 실행
docker-compose up postgres redis

# 로그 확인
docker-compose logs -f
docker-compose logs backend

# 서비스 중지
docker-compose down

# 볼륨까지 삭제 (DB 데이터 삭제됨 주의!)
docker-compose down -v

# 이미지 재빌드
docker-compose build
docker-compose up --build
```

## 🐛 트러블슈팅

### 자주 발생하는 문제들

#### 1. 패키지 설치 오류

```bash
# npm 캐시 클리어
npm cache clean --force

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# Node.js 버전 확인 (18.0.0 이상 필요)
node --version
```

#### 2. 포트 충돌

```bash
# 사용 중인 포트 확인
lsof -i :3000  # Frontend
lsof -i :5000  # Backend  
lsof -i :5432  # PostgreSQL

# 프로세스 종료
kill -9 <PID>

# 또는 다른 포트 사용
PORT=3001 npm run dev  # Frontend
PORT=5001 npm run dev  # Backend
```

#### 3. 데이터베이스 연결 오류

```bash
# PostgreSQL 상태 확인
docker-compose logs postgres

# 데이터베이스 URL 확인
echo $DATABASE_URL

# 데이터베이스 재시작
docker-compose restart postgres

# 볼륨 초기화 (주의: 데이터 삭제됨)
docker-compose down -v
docker-compose up -d postgres
```

#### 4. TypeScript 오류

```bash
# TypeScript 캐시 클리어
npx tsc --build --clean

# Prisma 타입 재생성
cd backend
npm run db:generate

# 타입 체크 실행
npm run type-check
```

#### 5. Git 관련 문제

```bash
# 브랜치 상태 확인
git status
git log --oneline -10

# 로컬 변경사항 되돌리기
git restore .
git clean -fd

# 원격 브랜치와 동기화
git fetch origin
git reset --hard origin/develop
```

#### 6. Docker 관련 문제

```bash
# Docker 상태 확인
docker ps
docker-compose ps

# 컨테이너 로그 확인
docker-compose logs [service-name]

# 컨테이너 재시작
docker-compose restart [service-name]

# 이미지 재빌드
docker-compose build --no-cache [service-name]

# 볼륨 문제 해결
docker volume prune
docker-compose down -v && docker-compose up -d
```

## 🔧 IDE 설정

### VS Code 설정

프로젝트에 포함된 `.vscode/` 설정을 사용하세요:

- **설정**: 자동 포맷팅, ESLint 통합
- **확장 프로그램**: 필수 확장 프로그램 목록
- **디버깅**: Frontend/Backend 디버깅 설정
- **태스크**: 자주 사용하는 명령어들

### 권장 VS Code 확장 프로그램

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 📊 성능 모니터링

### 개발 중 성능 체크

```bash
# Bundle 사이즈 분석 (Frontend)
cd frontend
npm run build
npx vite-bundle-analyzer dist

# Memory 사용량 체크 (Backend)
cd backend  
npm run build
node --inspect dist/index.js
```

### 코드 품질 메트릭

```bash
# 테스트 커버리지
npm run test:coverage

# ESLint 리포트
npm run lint -- --format json --output-file lint-report.json

# 타입스크립트 엄격성 체크
npx tsc --noEmit --strict
```

## 🚀 배포 가이드

### Staging 배포

```bash
# develop 브랜치에 푸시하면 자동 배포
git checkout develop
git merge feature/your-feature
git push origin develop
```

### Production 배포

```bash
# main 브랜치에 푸시하면 자동 배포
git checkout main  
git merge develop
git push origin main
```

### 수동 배포

```bash
# Frontend (Vercel)
cd frontend
npm run build
npx vercel --prod

# Backend (Docker)
docker build -t smallbiz-backend ./backend
docker push your-registry/smallbiz-backend:latest
```

## 📞 도움이 필요할 때

1. **문서 확인**: `docs/` 폴더의 상세 문서들
2. **이슈 생성**: GitHub Issues 사용
3. **팀 채팅**: Slack/Discord에서 질문
4. **코드 리뷰**: PR에서 질문 및 토론
5. **페어 프로그래밍**: 어려운 문제는 함께 해결

## 📋 체크리스트

### 새 팀원 온보딩

- [ ] 저장소 접근 권한 확인
- [ ] 개발 환경 설정 완료
- [ ] 로컬에서 애플리케이션 실행 성공
- [ ] 첫 번째 PR 생성 및 머지
- [ ] 팀 커뮤니케이션 채널 참여

### PR 머지 전

- [ ] CI/CD 파이프라인 통과
- [ ] 코드 리뷰 승인
- [ ] 충돌 해결
- [ ] 테스트 커버리지 유지
- [ ] 문서 업데이트 (필요시)

---

**Happy Coding! 🎉**

문의사항이나 개선사항은 언제든 제안해주세요!
EOF

    print_success "팀 공유용 README 생성 완료"
}

# API 문서 생성
create_api_docs() {
    print_step "API 문서 생성 중..."
    
    mkdir -p docs

    cat > docs/API.md << 'EOF'
# 🌐 SmallBiz Manager API 문서

## 개요

SmallBiz Manager의 REST API 문서입니다. 모든 API는 `/api` 경로를 사용합니다.

## 인증

JWT Bearer 토큰을 사용합니다.

```http
Authorization: Bearer <your-jwt-token>
```

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {
    // 응답 데이터
  },
  "message": "Success message"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## API 엔드포인트

### 인증 (Authentication)

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "username": "testuser",
      "firstName": "테스트",
      "lastName": "사용자",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "testuser",
  "firstName": "테스트",
  "lastName": "사용자"
}
```

#### 로그아웃
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### 사용자 관리 (Users)

#### 프로필 조회
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### 사용자 목록 조회
```http
GET /api/users
Authorization: Bearer <token>
```

### 매출 관리 (Sales)

#### 매출 목록 조회
```http
GET /api/sales
Authorization: Bearer <token>

Query Parameters:
- page: 페이지 번호 (기본값: 1)
- limit: 페이지 크기 (기본값: 20)
- startDate: 시작 날짜 (YYYY-MM-DD)
- endDate: 종료 날짜 (YYYY-MM-DD)
- status: 상태 필터 (pending, completed, cancelled)
```

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "amount": 15000,
      "date": "2024-01-15T10:30:00Z",
      "status": "completed",
      "customerId": "1",
      "customer": {
        "name": "김고객"
      }
    }
  ]
}
```

#### 매출 등록
```http
POST /api/sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 25000,
  "date": "2024-01-15T10:30:00Z",
  "customerId": "1",
  "items": [
    {
      "inventoryId": "1",
      "quantity": 2,
      "unitPrice": 12500
    }
  ]
}
```

#### 매출 상세 조회
```http
GET /api/sales/:id
Authorization: Bearer <token>
```

#### 매출 수정
```http
PUT /api/sales/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 30000,
  "status": "completed"
}
```

#### 매출 삭제
```http
DELETE /api/sales/:id
Authorization: Bearer <token>
```

### 고객 관리 (Customers)

#### 고객 목록 조회
```http
GET /api/customers
Authorization: Bearer <token>

Query Parameters:
- page: 페이지 번호
- limit: 페이지 크기
- search: 검색어 (이름, 이메일, 전화번호)
```

#### 고객 등록
```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "address": "서울시 강남구"
}
```

#### 고객 상세 조회
```http
GET /api/customers/:id
Authorization: Bearer <token>
```

#### 고객 수정
```http
PUT /api/customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "홍길동",
  "phone": "010-1234-5679"
}
```

#### 고객 삭제
```http
DELETE /api/customers/:id
Authorization: Bearer <token>
```

### 재고 관리 (Inventory)

#### 재고 목록 조회
```http
GET /api/inventory
Authorization: Bearer <token>

Query Parameters:
- page: 페이지 번호
- limit: 페이지 크기
- search: 상품명 검색
- lowStock: true/false (재고 부족 상품만)
```

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "상품 A",
      "sku": "PROD-A-001",
      "price": 10000,
      "quantity": 50,
      "lowStockThreshold": 10,
      "isLowStock": false
    }
  ]
}
```

#### 재고 상품 등록
```http
POST /api/inventory
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "새 상품",
  "description": "상품 설명",
  "sku": "PROD-NEW-001",
  "price": 15000,
  "quantity": 100,
  "lowStockThreshold": 10
}
```

#### 재고 수정
```http
PUT /api/inventory/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 16000,
  "quantity": 80
}
```

### 업무 관리 (Tasks)

#### 업무 목록 조회
```http
GET /api/tasks
Authorization: Bearer <token>

Query Parameters:
- status: pending, in_progress, completed
- priority: low, medium, high
- assignedTo: 담당자 ID
- dueDate: 마감일 (YYYY-MM-DD)
```

#### 업무 등록
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "재고 점검",
  "description": "월말 재고 현황 확인",
  "priority": "high",
  "dueDate": "2024-01-31T23:59:59Z",
  "assignedTo": "user123"
}
```

#### 업무 상태 수정
```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

## 에러 코드

| 코드 | 설명 |
|-----|------|
| `AUTH_INVALID_CREDENTIALS` | 잘못된 로그인 정보 |
| `AUTH_TOKEN_EXPIRED` | 토큰 만료 |
| `AUTH_ACCESS_DENIED` | 접근 권한 없음 |
| `VALIDATION_ERROR` | 입력 데이터 검증 실패 |
| `RESOURCE_NOT_FOUND` | 리소스를 찾을 수 없음 |
| `DUPLICATE_RESOURCE` | 중복된 리소스 |
| `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

## 상태 코드

| 코드 | 의미 |
|-----|------|
| `200` | 성공 |
| `201` | 생성됨 |
| `400` | 잘못된 요청 |
| `401` | 인증 실패 |
| `403` | 권한 없음 |
| `404` | 리소스 없음 |
| `409` | 충돌 (중복 등) |
| `422` | 처리할 수 없는 엔터티 |
| `500` | 서버 오류 |

## 예제 코드

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인증 토큰 설정
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 매출 목록 조회
const getSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

// 고객 등록
const createCustomer = async (customerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};
```

### cURL

```bash
# 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 매출 목록 조회 (토큰 필요)
curl -X GET http://localhost:5000/api/sales \
  -H "Authorization: Bearer YOUR_TOKEN"

# 고객 등록
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"홍길동","email":"hong@example.com"}'
```

## 버전 관리

API 버전은 URL 경로에 포함됩니다:
- v1: `/api/v1/...` (현재 버전)
- v2: `/api/v2/...` (향후 버전)

현재는 버전을 명시하지 않으면 v1이 기본값입니다.
EOF

    print_success "API 문서 생성 완료"
}

# 데이터베이스 문서 생성
create_database_docs() {
    print_step "데이터베이스 문서 생성 중..."
    
    cat > docs/DATABASE.md << 'EOF'
# 🗄️ SmallBiz Manager 데이터베이스 문서

## 개요

PostgreSQL 15 + Prisma ORM을 사용하는 SmallBiz Manager의 데이터베이스 스키마 문서입니다.

## 연결 정보

```bash
# 개발 환경
DATABASE_URL="postgresql://smallbiz_user:your-secure-password@localhost:5432/smallbiz_db"

# 테스트 환경  
TEST_DATABASE_URL="postgresql://test_user:test_password@localhost:5432/test_db"
```

## 스키마 구조

### 사용자 (Users)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**인덱스:**
- `users_email_idx` (email)
- `users_username_idx` (username)

### 고객 (Customers)

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**인덱스:**
- `customers_user_id_idx` (user_id)
- `customers_email_idx` (email)

### 재고 (Inventory)

```sql
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**인덱스:**
- `inventory_sku_idx` (sku)
- `inventory_user_id_idx` (user_id)
- `inventory_quantity_idx` (quantity) -- 재고 부족 조회용

### 매출 (Sales)

```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**인덱스:**
- `sales_user_id_idx` (user_id)
- `sales_customer_id_idx` (customer_id)
- `sales_date_idx` (sale_date) -- 날짜별 매출 조회용
- `sales_status_idx` (status)

### 매출 항목 (Sale Items)

```sql
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    inventory_id INTEGER REFERENCES inventory(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**인덱스:**
- `sale_items_sale_id_idx` (sale_id)
- `sale_items_inventory_id_idx` (inventory_id)

### 업무 (Tasks)

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**인덱스:**
- `tasks_assigned_to_idx` (assigned_to)
- `tasks_created_by_idx` (created_by)
- `tasks_status_idx` (status)
- `tasks_due_date_idx` (due_date)

## Prisma 스키마

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  username    String   @unique
  passwordHash String  @map("password_hash")
  firstName   String?  @map("first_name")
  lastName    String?  @map("last_name")
  role        Role     @default(USER)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  customers   Customer[]
  inventory   Inventory[]
  salesCreated Sale[] @relation("SaleCreatedBy")
  tasksAssigned Task[] @relation("TaskAssignedTo")
  tasksCreated Task[] @relation("TaskCreatedBy")

  @@map("users")
}

model Customer {
  id        Int      @id @default(autoincrement())
  name      String
  email     String?
  phone     String?
  address   String?
  userId    Int      @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  user      User   @relation(fields: [userId], references: [id])
  sales     Sale[]

  @@index([userId])
  @@index([email])
  @@map("customers")
}

model Inventory {
  id               Int      @id @default(autoincrement())
  name            String
  description     String?
  sku             String?  @unique
  price           Decimal  @db.Decimal(10, 2)
  quantity        Int      @default(0)
  lowStockThreshold Int    @default(5) @map("low_stock_threshold")
  userId          Int      @map("user_id")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  user            User       @relation(fields: [userId], references: [id])
  saleItems       SaleItem[]

  @@index([userId])
  @@index([sku])
  @@index([quantity])
  @@map("inventory")
}

model Sale {
  id          Int         @id @default(autoincrement())
  customerId  Int?        @map("customer_id")
  userId      Int         @map("user_id")
  totalAmount Decimal     @db.Decimal(10, 2) @map("total_amount")
  status      SaleStatus  @default(PENDING)
  saleDate    DateTime    @default(now()) @map("sale_date")
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  // Relations
  customer    Customer?   @relation(fields: [customerId], references: [id])
  user        User        @relation("SaleCreatedBy", fields: [userId], references: [id])
  items       SaleItem[]

  @@index([userId])
  @@index([customerId])
  @@index([saleDate])
  @@index([status])
  @@map("sales")
}

model SaleItem {
  id          Int     @id @default(autoincrement())
  saleId      Int     @map("sale_id")
  inventoryId Int     @map("inventory_id")
  quantity    Int
  unitPrice   Decimal @db.Decimal(10, 2) @map("unit_price")
  totalPrice  Decimal @db.Decimal(10, 2) @map("total_price")
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  sale        Sale      @relation(fields: [saleId], references: [id], onDelete: Cascade)
  inventory   Inventory @relation(fields: [inventoryId], references: [id])

  @@index([saleId])
  @@index([inventoryId])
  @@map("sale_items")
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  assignedTo  Int?       @map("assigned_to")
  createdBy   Int        @map("created_by")
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?  @map("due_date")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  // Relations
  assignee    User?      @relation("TaskAssignedTo", fields: [assignedTo], references: [id])
  creator     User       @relation("TaskCreatedBy", fields: [createdBy], references: [id])

  @@index([assignedTo])
  @@index([createdBy])
  @@index([status])
  @@index([dueDate])
  @@map("tasks")
}

// Enums
enum Role {
  USER
  ADMIN
}

enum SaleStatus {
  PENDING
  COMPLETED
  CANCELLED
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 데이터베이스 관리 명령어

### 개발 환경

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 스키마를 데이터베이스에 푸시 (개발용)
npm run db:push

# Prisma Studio 실행
npm run db:studio

# 시드 데이터 실행
npm run db:seed

# 데이터베이스 초기화
npm run db:reset
```

### 프로덕션 환경

```bash
# 마이그레이션 생성
npm run db:migrate

# 마이그레이션 실행
npx prisma migrate deploy

# 데이터베이스 상태 확인
npx prisma migrate status
```

## 성능 최적화

### 인덱스 전략

1. **기본 키**: 모든 테이블에 자동 인덱스
2. **외래 키**: 조인 성능 향상을 위한 인덱스
3. **검색용**: 자주 검색되는 컬럼 (email, sku 등)
4. **정렬용**: 날짜, 상태 등 정렬에 사용되는 컬럼

### 쿼리 최적화

```javascript
// N+1 문제 해결 - include 사용
const salesWithCustomer = await prisma.sale.findMany({
  include: {
    customer: true,
    items: {
      include: {
        inventory: true
      }
    }
  }
});

// 집계 쿼리 최적화
const salesStats = await prisma.sale.aggregate({
  where: {
    saleDate: {
      gte: startDate,
      lte: endDate
    }
  },
  _sum: {
    totalAmount: true
  },
  _count: {
    id: true
  }
});
```

## 백업 및 복구

### 백업 생성

```bash
# 전체 데이터베이스 백업
pg_dump -h localhost -U smallbiz_user -d smallbiz_db > backup.sql

# 특정 테이블만 백업
pg_dump -h localhost -U smallbiz_user -d smallbiz_db -t users -t customers > users_backup.sql

# 압축 백업
pg_dump -h localhost -U smallbiz_user -d smallbiz_db | gzip > backup.sql.gz
```

### 복구

```bash
# 백업에서 복구
psql -h localhost -U smallbiz_user -d smallbiz_db < backup.sql

# 압축 파일에서 복구  
gunzip -c backup.sql.gz | psql -h localhost -U smallbiz_user -d smallbiz_db
```

## 모니터링

### 중요 메트릭

1. **연결 수**: 동시 연결 모니터링
2. **쿼리 성능**: 느린 쿼리 식별
3. **데이터베이스 크기**: 디스크 사용량 추적
4. **인덱스 사용률**: 인덱스 효율성 확인

### 모니터링 쿼리

```sql
-- 연결 수 확인
SELECT count(*) as connection_count FROM pg_stat_activity;

-- 느린 쿼리 확인 (pg_stat_statements 확장 필요)
SELECT query, total_time, calls, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- 데이터베이스 크기
SELECT pg_size_pretty(pg_database_size('smallbiz_db')) as db_size;

-- 테이블 크기
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 보안 권장사항

1. **접근 제어**: 최소 권한 원칙 적용
2. **SSL/TLS**: 암호화 연결 사용
3. **정기 백업**: 자동화된 백업 시스템
4. **모니터링**: 비정상 접근 패턴 감지
5. **업데이트**: PostgreSQL 보안 패치 적용

## 트러블슈팅

### 일반적인 문제들

1. **연결 오류**: 방화벽, 네트워크 설정 확인
2. **성능 문제**: 인덱스, 쿼리 최적화
3. **락 대기**: 트랜잭션 최적화
4. **디스크 공간**: 정기적인 정리 작업

### 유용한 명령어

```bash
# 데이터베이스 연결 테스트
psql -h localhost -U smallbiz_user -d smallbiz_db -c "SELECT version();"

# Prisma 스키마 검증
npx prisma validate

# 데이터베이스와 스키마 동기화 확인
npx prisma db pull
```
EOF

    print_success "데이터베이스 문서 생성 완료"
}

# 배포 가이드 생성
create_deployment_guide() {
    print_step "배포 가이드 생성 중..."
    
    cat > docs/DEPLOYMENT.md << 'EOF'
# 🚀 SmallBiz Manager 배포 가이드

## 개요

SmallBiz Manager의 프로덕션 배포를 위한 단계별 가이드입니다.

## 배포 아키텍처

```
Frontend (Vercel) → API Gateway → Backend (Railway/Render) → Database (PostgreSQL)
                                      ↓
                                 Redis (Cache)
```

## 사전 준비

### 1. 환경 변수 설정

**Frontend (.env.production)**
```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_TITLE=SmallBiz Manager
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

**Backend (.env.production)**
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
REDIS_URL=redis://user:pass@host:6379
```

### 2. 도메인 및 SSL 설정

- Frontend: `https://smallbiz-manager.vercel.app`
- Backend: `https://smallbiz-api.railway.app`
- 커스텀 도메인: `https://app.yourcompany.com`

## Frontend 배포 (Vercel)

### 자동 배포 설정

1. **Vercel 계정 연동**
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
cd frontend
vercel
```

2. **GitHub 연동**
- Vercel 대시보드에서 GitHub 저장소 연결
- `main` 브랜치 → Production
- `develop` 브랜치 → Preview

3. **빌드 설정**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

4. **환경 변수 설정**
- Vercel 대시보드 → Settings → Environment Variables
- Production, Preview, Development 환경별 설정

### 수동 배포

```bash
cd frontend

# 의존성 설치
npm ci

# 빌드
npm run build

# 배포
vercel --prod
```

### 도메인 설정

1. Vercel 대시보드 → Domains
2. 커스텀 도메인 추가
3. DNS 설정 (CNAME 레코드)

## Backend 배포 (Railway)

### 자동 배포 설정

1. **Railway 계정 생성**
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login
```

2. **프로젝트 설정**
```bash
cd backend

# 새 프로젝트 생성
railway new

# 환경 변수 설정
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=$DATABASE_URL
railway variables set JWT_SECRET=$JWT_SECRET
```

3. **서비스 설정**
```json
{
  "build": {
    "builder": "DOCKER"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

### 수동 배포

```bash
cd backend

# Docker 이미지 빌드
docker build -t smallbiz-backend .

# Railway에 배포
railway up
```

### 데이터베이스 설정

1. **PostgreSQL 서비스 생성**
```bash
railway add postgresql
```

2. **환경 변수 자동 설정**
- `DATABASE_URL` 자동 생성
- 연결 정보 확인: `railway variables`

3. **초기 데이터베이스 설정**
```bash
# 마이그레이션 실행
railway run npx prisma migrate deploy

# 시드 데이터 실행
railway run npm run db:seed
```

## 대안 배포 옵션

### Backend (Render)

1. **서비스 생성**
- Render 대시보드에서 새 Web Service 생성
- GitHub 저장소 연결
- Root Directory: `backend`

2. **빌드 설정**
```bash
# Build Command
npm ci && npm run build

# Start Command
npm start
```

3. **환경 변수 설정**
- Render 대시보드에서 Environment Variables 설정

### Backend (AWS/GCP/Azure)

#### Docker 컨테이너 배포

1. **이미지 빌드 및 푸시**
```bash
# AWS ECR 예시
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker build -t smallbiz-backend .
docker tag smallbiz-backend:latest $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/smallbiz-backend:latest
docker push $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/smallbiz-backend:latest
```

2. **서비스 배포**
```bash
# AWS ECS 예시
aws ecs update-service --cluster smallbiz-cluster --service smallbiz-backend --force-new-deployment
```

## CI/CD 파이프라인

### GitHub Actions 배포

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up --service ${{ secrets.RAILWAY_SERVICE_ID }}
```

### 배포 전 체크리스트

- [ ] 모든 테스트 통과
- [ ] 보안 스캔 완료
- [ ] 데이터베이스 마이그레이션 준비
- [ ] 환경 변수 검증
- [ ] SSL 인증서 확인
- [ ] 도메인 DNS 설정
- [ ] 모니터링 설정
- [ ] 백업 확인

## 모니터링 및 로깅

### APM 도구 설정

1. **Sentry (에러 추적)**
```bash
npm install @sentry/node @sentry/tracing
```

```javascript
// backend/src/utils/sentry.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

2. **LogRocket (세션 리플레이)**
```bash
npm install logrocket
```

3. **Uptime 모니터링**
- UptimeRobot
- Pingdom
- StatusCake

### 로그 설정

```javascript
// backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});
```

## 성능 최적화

### Frontend 최적화

1. **번들 크기 최적화**
```bash
# 번들 분석
npm run build
npx vite-bundle-analyzer dist
```

2. **CDN 설정**
- Vercel의 글로벌 CDN 활용
- 정적 자산 캐싱

3. **이미지 최적화**
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    // 이미지 최적화
    imageOptimize({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] }
    })
  ]
});
```

### Backend 최적화

1. **데이터베이스 연결 풀링**
```javascript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // 연결 풀 설정
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

2. **Redis 캐싱**
```javascript
const redis = new Redis(process.env.REDIS_URL);

// 캐싱 미들웨어
const cache = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const originalSend = res.json;
    res.json = function(data) {
      redis.setex(key, duration, JSON.stringify(data));
      return originalSend.call(this, data);
    };
    
    next();
  };
};
```

3. **응답 압축**
```javascript
const compression = require('compression');
app.use(compression());
```

## 보안 설정

### HTTPS 강제

```javascript
// Express 미들웨어
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});
```

### 보안 헤더

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api', limiter);
```

## 백업 및 재해 복구

### 데이터베이스 백업

1. **자동 백업 설정**
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL | gzip > backup_$DATE.sql.gz

# S3에 업로드
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

2. **백업 스케줄링**
```bash
# crontab -e
0 2 * * * /path/to/backup-db.sh
```

### 복구 절차

1. **데이터베이스 복구**
```bash
# 백업에서 복구
gunzip -c backup_20240115_020000.sql.gz | psql $DATABASE_URL
```

2. **애플리케이션 복구**
```bash
# 이전 버전으로 롤백
railway rollback
vercel rollback
```

## 트러블슈팅

### 일반적인 배포 문제

1. **빌드 실패**
   - 의존성 버전 충돌
   - 환경 변수 누락
   - TypeScript 오류

2. **런타임 에러**
   - 데이터베이스 연결 실패
   - API 응답 시간 초과
   - 메모리 부족

3. **성능 문제**
   - 느린 API 응답
   - 프론트엔드 로딩 지연
   - 데이터베이스 쿼리 최적화 필요

### 로그 분석

```bash
# Railway 로그 확인
railway logs

# Vercel 로그 확인
vercel logs

# 특정 시간대 로그
railway logs --since=1h
```

## 체크리스트

### 프로덕션 배포 전

- [ ] 환경 변수 모든 플랫폼에 설정
- [ ] 데이터베이스 마이그레이션 완료
- [ ] SSL 인증서 설정 및 확인
- [ ] 도메인 DNS 설정
- [ ] 모니터링 도구 설정
- [ ] 백업 시스템 구성
- [ ] 로드 테스트 실행
- [ ] 보안 스캔 통과
- [ ] 팀에 배포 일정 공지

### 배포 후

- [ ] 헬스 체크 통과
- [ ] 핵심 기능 동작 확인
- [ ] 성능 메트릭 모니터링
- [ ] 에러 로그 확인
- [ ] 사용자 피드백 수집
- [ ] 24시간 모니터링 체제 운영

---

성공적인 배포를 위해 단계별로 신중하게 진행하시기 바랍니다! 🚀
EOF

    print_success "배포 가이드 생성 완료"
}

# 메인 함수
main() {
    echo "📚 SmallBiz Manager 종합 문서 생성"
    echo "==================================="
    
    create_vscode_workspace
    create_team_readme
    create_api_docs
    create_database_docs
    create_deployment_guide
    
    print_success "모든 문서가 생성되었습니다!"
    print_warning "완성된 파일 목록:"
    echo ""
    echo "📁 설정 파일:"
    echo "  ├── .vscode/ (VS Code 워크스페이스 설정)"
    echo "  ├── .github/ (GitHub Actions, Issue 템플릿)"
    echo "  ├── frontend/.eslintrc.cjs, .prettierrc (코드 품질)"
    echo "  ├── backend/.eslintrc.js, .prettierrc (코드 품질)"
    echo "  └── docker-compose.yml (개발 환경)"
    echo ""
    echo "📚 문서 파일:"
    echo "  ├── README-TEAM.md (팀 개발 가이드)"
    echo "  ├── docs/API.md (API 문서)"
    echo "  ├── docs/DATABASE.md (데이터베이스 문서)"
    echo "  └── docs/DEPLOYMENT.md (배포 가이드)"
    echo ""
    echo "🛠️ 스크립트 파일:"
    echo "  ├── setup-complete.sh (전체 환경 설정)"
    echo "  ├── configure-project.sh (설정 파일 생성)"
    echo "  ├── create-basic-structure.sh (기본 코드 생성)"
    echo "  ├── setup-git-and-ci.sh (Git/CI 설정)"
    echo "  └── create-docs.sh (문서 생성)"
    echo ""
    print_step "다음 단계:"
    echo "1. chmod +x *.sh (실행 권한 부여)"
    echo "2. ./setup-complete.sh (환경 설정 시작)"  
    echo "3. 팀원들과 README-TEAM.md 공유"
    echo "4. 개발 시작! 🎉"
}

# 스크립트 실행
main "$@"