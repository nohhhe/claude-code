#!/bin/bash

# 🔧 SmallBiz Manager - Git 설정 및 CI/CD 파이프라인 구축
# 사용법: chmod +x setup-git-and-ci.sh && ./setup-git-and-ci.sh

set -e

echo "🔧 Git 설정 및 CI/CD 파이프라인을 구축합니다..."

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

# Git 설정
setup_git() {
    print_step "Git 설정 중..."
    
    # .gitignore 파일 생성
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
.next/
.nuxt/

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Temporary files
tmp/
temp/

# Database
*.sqlite
*.db

# Prisma
prisma/dev.db*

# Docker
.dockerignore

# Package managers
package-lock.json
yarn.lock
pnpm-lock.yaml
EOF

    # Git hooks 설정 (Husky)
    cat > frontend/.husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

cd frontend && npx lint-staged
EOF

    chmod +x frontend/.husky/pre-commit

    # lint-staged 설정
    cat > frontend/.lintstagedrc.json << 'EOF'
{
  "src/**/*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
EOF

    # Git 커밋 메시지 템플릿
    cat > .gitmessage << 'EOF'
# <타입>(<범위>): <제목>
# 
# <본문>
#
# <꼬리말>
#
# 타입:
# feat: 새로운 기능
# fix: 버그 수정
# docs: 문서 변경
# style: 코드 포맷팅 (기능에 영향 없음)
# refactor: 코드 리팩토링
# test: 테스트 추가/수정
# chore: 빌드 프로세스나 보조 도구 변경
#
# 예시:
# feat(auth): JWT 토큰 갱신 기능 추가
# fix(dashboard): 차트 렌더링 오류 수정
# docs(readme): 설치 가이드 업데이트
EOF

    print_success "Git 설정 완료"
}

# GitHub Actions CI/CD 워크플로우 생성
create_github_workflows() {
    print_step "GitHub Actions CI/CD 워크플로우 생성 중..."
    
    mkdir -p .github/workflows
    
    # 메인 CI/CD 워크플로우
    cat > .github/workflows/ci-cd.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # 코드 품질 및 보안 검사
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📁 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: 🔒 Run security audit
        run: |
          cd frontend && npm audit --audit-level moderate || true
          cd ../backend && npm audit --audit-level moderate || true

  # Frontend 테스트
  frontend-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: 📁 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 🎨 Install Frontend Dependencies
        run: |
          cd frontend
          npm ci

      - name: 🔍 Frontend Lint Check
        run: |
          cd frontend
          npm run lint

      - name: 💅 Frontend Format Check
        run: |
          cd frontend  
          npm run format:check

      - name: 📝 Frontend Type Check
        run: |
          cd frontend
          npm run type-check

      - name: 🏗️ Frontend Build Test
        run: |
          cd frontend
          npm run build

      - name: 🧪 Frontend Unit Tests
        run: |
          cd frontend
          npm run test -- --coverage --watchAll=false

  # Backend 테스트
  backend-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_USER: test_user
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: 📁 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 🔧 Install Backend Dependencies
        run: |
          cd backend
          npm ci

      - name: 🔍 Backend Lint Check
        run: |
          cd backend
          npm run lint

      - name: 💅 Backend Format Check
        run: |
          cd backend
          npm run format:check

      - name: 🏗️ Backend Build Check
        run: |
          cd backend
          npm run build

      - name: 🧪 Backend Unit Tests
        run: |
          cd backend
          cp .env.example .env
          echo "DATABASE_URL=postgresql://test_user:test_password@localhost:5432/test_db" >> .env
          echo "JWT_SECRET=test-jwt-secret-key-for-ci" >> .env
          npm run test -- --coverage

  # 배포 - Staging (develop 브랜치)
  deploy-staging:
    needs: [quality-check, frontend-test, backend-test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
    
    steps:
      - name: 📁 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: 🏗️ Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build

      - name: 🚀 Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        if: env.VERCEL_TOKEN != ''
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          scope: ${{ secrets.VERCEL_ORG_ID }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  # 배포 - Production (main 브랜치)
  deploy-production:
    needs: [quality-check, frontend-test, backend-test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: 📁 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: 🏗️ Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build

      - name: 🚀 Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        if: env.VERCEL_TOKEN != ''
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
EOF

    # 의존성 업데이트 워크플로우
    cat > .github/workflows/dependency-update.yml << 'EOF'
name: 의존성 업데이트

on:
  schedule:
    - cron: '0 0 * * 1' # 매주 월요일 00:00 UTC
  workflow_dispatch: # 수동 실행 가능

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📁 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: 🔄 Update Frontend Dependencies
        run: |
          cd frontend
          npx npm-check-updates -u
          npm install

      - name: 🔄 Update Backend Dependencies
        run: |
          cd backend
          npx npm-check-updates -u
          npm install

      - name: 🧪 Run Tests
        run: |
          cd frontend && npm test -- --watchAll=false
          cd ../backend && npm test

      - name: 📝 Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore(deps): 의존성 업데이트'
          title: '🔄 의존성 자동 업데이트'
          body: |
            ## 📦 의존성 업데이트
            
            자동화된 의존성 업데이트입니다.
            
            ### 변경사항
            - Frontend 및 Backend 패키지 업데이트
            - 모든 테스트 통과 확인
            
            ### 확인 사항
            - [ ] 애플리케이션이 정상 작동하는지 확인
            - [ ] 브레이킹 체인지가 없는지 확인
            - [ ] 보안 업데이트가 포함되어 있는지 확인
          branch: dependency-updates
          delete-branch: true
EOF

    print_success "GitHub Actions 워크플로우 생성 완료"
}

# GitHub Issue 템플릿 생성
create_issue_templates() {
    print_step "GitHub Issue 템플릿 생성 중..."
    
    mkdir -p .github/ISSUE_TEMPLATE

    # 버그 리포트 템플릿
    cat > .github/ISSUE_TEMPLATE/bug-report.yml << 'EOF'
name: 🐛 버그 리포트
description: 버그를 발견하셨나요? 리포트해주세요.
title: "[BUG] "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        버그 리포트를 작성해주셔서 감사합니다! 🙏
        
  - type: textarea
    id: what-happened
    attributes:
      label: 무엇이 발생했나요?
      description: 버그에 대한 명확하고 간결한 설명을 작성해주세요.
      placeholder: 버그 설명...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: 예상된 동작
      description: 어떤 결과를 예상하셨나요?
      placeholder: 예상된 동작...
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: 재현 단계
      description: 버그를 재현하기 위한 단계를 작성해주세요.
      placeholder: |
        1. '...' 페이지로 이동
        2. '...' 버튼을 클릭
        3. 에러 발생
    validations:
      required: true

  - type: dropdown
    id: browsers
    attributes:
      label: 브라우저
      description: 어떤 브라우저에서 발생했나요?
      options:
        - Firefox
        - Chrome
        - Safari
        - Microsoft Edge
        - Other
    validations:
      required: true

  - type: textarea
    id: additional-context
    attributes:
      label: 추가 정보
      description: 스크린샷, 로그 등 추가 정보가 있다면 첨부해주세요.
      placeholder: 추가 정보...
EOF

    # 기능 요청 템플릿
    cat > .github/ISSUE_TEMPLATE/feature-request.yml << 'EOF'
name: ✨ 기능 요청
description: 새로운 기능을 제안해주세요.
title: "[FEATURE] "
labels: ["enhancement", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        기능 요청을 해주셔서 감사합니다! 🚀
        
  - type: textarea
    id: problem
    attributes:
      label: 해결하고 싶은 문제
      description: 어떤 문제를 해결하고 싶으신가요?
      placeholder: 현재 이런 문제가 있습니다...
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: 제안하는 해결책
      description: 어떤 기능이나 변경사항을 원하시나요?
      placeholder: 이런 기능이 있으면 좋겠습니다...
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: 대안
      description: 다른 대안이나 기능을 고려해보셨나요?
      placeholder: 다른 방법으로는...

  - type: dropdown
    id: priority
    attributes:
      label: 우선순위
      description: 이 기능의 우선순위는 어느 정도인가요?
      options:
        - 낮음 (Nice to have)
        - 보통 (Would be helpful)
        - 높음 (Important)
        - 긴급 (Critical)
    validations:
      required: true
EOF

    # Pull Request 템플릿
    cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
## 📋 변경사항

<!-- 이 PR에서 무엇을 변경했는지 간략히 설명해주세요 -->

## 🔗 관련 이슈

<!-- 관련된 이슈가 있다면 링크해주세요 (예: Closes #123) -->

## 📸 스크린샷

<!-- UI 변경사항이 있다면 스크린샷을 첨부해주세요 -->

## 🧪 테스트

<!-- 어떤 테스트를 수행했는지 설명해주세요 -->

- [ ] 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 수동 테스트 완료
- [ ] 크로스 브라우저 테스트 완료

## 📝 체크리스트

- [ ] 코드가 프로젝트의 스타일 가이드를 따릅니다
- [ ] 자체 코드 리뷰를 수행했습니다
- [ ] 코드에 적절한 주석을 추가했습니다
- [ ] 문서를 업데이트했습니다
- [ ] 변경사항이 기존 테스트를 깨뜨리지 않습니다
- [ ] 새로운 테스트를 추가했습니다 (필요한 경우)
- [ ] 의존성 변경사항이 있다면 문서화했습니다

## 🚀 배포 참고사항

<!-- 배포 시 주의해야 할 사항이 있다면 작성해주세요 -->

## 📋 리뷰어 체크리스트

- [ ] 코드 품질이 적절합니다
- [ ] 보안 이슈가 없습니다
- [ ] 성능에 미치는 영향이 적절합니다
- [ ] 문서가 업데이트되었습니다
EOF

    print_success "GitHub Issue 템플릿 생성 완료"
}

# Docker 설정
create_docker_files() {
    print_step "Docker 설정 파일 생성 중..."
    
    # Frontend Dockerfile (Development)
    cat > frontend/Dockerfile.dev << 'EOF'
FROM node:20-alpine

WORKDIR /app

# 의존성 설치를 위한 package files 복사
COPY package*.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "run", "dev"]
EOF

    # Frontend Dockerfile (Production)
    cat > frontend/Dockerfile << 'EOF'
# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

    # Nginx 설정
    cat > frontend/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

    # Backend Dockerfile
    cat > backend/Dockerfile << 'EOF'
# Base stage
FROM node:20-alpine as base

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

# Production dependencies
FROM base as production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base as build
RUN npm ci
COPY . .
RUN npm run build
RUN npm run db:generate

# Final stage
FROM node:20-alpine as final
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 5000

CMD ["npm", "start"]
EOF

    # Docker Compose (개발 환경)
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    container_name: smallbiz-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: smallbiz_db
      POSTGRES_USER: smallbiz_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-your-secure-password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U smallbiz_user -d smallbiz_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: smallbiz-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      DATABASE_URL: postgresql://smallbiz_user:${POSTGRES_PASSWORD:-your-secure-password}@postgres:5432/smallbiz_db
      JWT_SECRET: ${JWT_SECRET:-your-super-secret-jwt-key}
      PORT: 5000
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
      - ./backend/logs:/app/logs

  # Frontend (Development)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: smallbiz-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # Redis (for caching and sessions)
  redis:
    image: redis:7-alpine
    container_name: smallbiz-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
EOF

    # Docker Compose (프로덕션 환경)
    cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 5000
      CORS_ORIGIN: ${CORS_ORIGIN}
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  # Redis
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
EOF

    print_success "Docker 설정 파일 생성 완료"
}

# 메인 함수
main() {
    echo "🔧 SmallBiz Manager Git 설정 및 CI/CD 파이프라인 구축"
    echo "=================================================="
    
    setup_git
    create_github_workflows
    create_issue_templates
    create_docker_files
    
    print_success "Git 설정 및 CI/CD 파이프라인이 완료되었습니다!"
    print_warning "다음 설정을 완료해주세요:"
    echo ""
    echo "1. GitHub Repository 생성 및 연결:"
    echo "   git remote add origin https://github.com/username/smallbiz-manager.git"
    echo ""
    echo "2. GitHub Secrets 설정 (배포용):"
    echo "   - VERCEL_TOKEN: Vercel 토큰"
    echo "   - VERCEL_ORG_ID: Vercel 조직 ID"
    echo "   - VERCEL_PROJECT_ID: Vercel 프로젝트 ID"
    echo ""
    echo "3. 브랜치 보호 규칙 설정:"
    echo "   - main: PR 필수, 리뷰 필수"
    echo "   - develop: CI 통과 필수"
    echo ""
    print_step "다음 단계:"
    echo "1. ./create-docs.sh 실행 (문서 생성)"
    echo "2. 의존성 설치 및 테스트"
    echo "3. 첫 번째 커밋 및 푸시! 🎉"
}

# 스크립트 실행
main "$@"