#!/bin/bash

# 🏪 SmallBiz Manager - 완전한 개발 환경 설정 스크립트
# 사용법: chmod +x setup-complete.sh && ./setup-complete.sh

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 SmallBiz Manager 개발 환경 설정을 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 진행 상황 출력 함수
print_step() {
    echo -e "\n${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Node.js 버전 확인
check_node_version() {
    print_step "Node.js 버전 확인 중..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js가 설치되어 있지 않습니다. Node.js 18.0.0 이상을 설치해주세요."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if ! node -e "process.exit(process.version.slice(1).localeCompare('$REQUIRED_VERSION', undefined, { numeric: true }) >= 0 ? 0 : 1)"; then
        print_error "Node.js 버전이 너무 낮습니다. 현재: $NODE_VERSION, 필요: $REQUIRED_VERSION 이상"
        exit 1
    fi
    
    print_success "Node.js 버전 확인 완료: v$NODE_VERSION"
}

# 기존 디렉터리 정리
cleanup_existing() {
    print_step "기존 디렉터리 정리 중..."
    
    # node_modules 제거
    if [ -d "frontend/node_modules" ]; then
        print_warning "기존 frontend/node_modules 제거 중..."
        rm -rf frontend/node_modules
    fi
    
    if [ -d "backend/node_modules" ]; then
        print_warning "기존 backend/node_modules 제거 중..."
        rm -rf backend/node_modules
    fi
    
    # 기존 lock 파일 제거
    if [ -f "frontend/package-lock.json" ]; then
        rm frontend/package-lock.json
    fi
    
    if [ -f "backend/package-lock.json" ]; then
        rm backend/package-lock.json
    fi
    
    print_success "기존 디렉터리 정리 완료"
}

# 디렉터리 구조 생성
create_directory_structure() {
    print_step "프로젝트 디렉터리 구조 생성 중..."
    
    # Frontend 디렉터리 구조
    mkdir -p frontend/{src/{components/{common,layout,forms,charts},pages/{auth,dashboard,sales,customers,inventory,tasks},stores,services,types,utils,hooks,assets/{icons,images}},public}
    
    # Backend 디렉터리 구조
    mkdir -p backend/{src/{controllers,middleware,routes,services,utils,types},prisma,tests/{unit,integration},logs}
    
    # 기타 디렉터리
    mkdir -p {docs,scripts,.vscode,.github/{workflows,ISSUE_TEMPLATE}}
    
    print_success "디렉터리 구조 생성 완료"
}

# Frontend 패키지 초기화
setup_frontend() {
    print_step "Frontend 환경 설정 중..."
    
    cd frontend
    
    # package.json 생성
    npm init -y
    
    # 주요 의존성 설치
    print_step "Frontend 의존성 설치 중..."
    npm install react react-dom
    npm install -D @types/react @types/react-dom @types/node
    npm install -D vite @vitejs/plugin-react typescript
    
    # UI 라이브러리
    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material @mui/x-date-pickers @mui/x-charts
    
    # 상태 관리 및 API
    npm install zustand react-query axios
    
    # 폼 관리
    npm install react-hook-form @hookform/resolvers yup
    
    # 라우팅
    npm install react-router-dom @types/react-router-dom
    
    # 차트
    npm install recharts
    
    # 개발 도구
    npm install -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser
    npm install -D prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
    npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
    npm install -D jest @types/jest ts-jest jsdom
    npm install -D husky lint-staged
    
    cd ..
    print_success "Frontend 환경 설정 완료"
}

# Backend 패키지 초기화
setup_backend() {
    print_step "Backend 환경 설정 중..."
    
    cd backend
    
    # package.json 생성
    npm init -y
    
    # 주요 의존성 설치
    npm install express cors helmet dotenv
    npm install @prisma/client prisma
    npm install jsonwebtoken bcryptjs
    npm install express-rate-limit express-validator
    npm install winston
    
    # TypeScript 관련
    npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs
    npm install -D ts-node nodemon concurrently
    
    # 테스트 관련
    npm install -D jest @types/jest ts-jest supertest @types/supertest
    
    # 개발 도구
    npm install -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser
    npm install -D prettier
    
    cd ..
    print_success "Backend 환경 설정 완료"
}

# 메인 실행
main() {
    echo "🏪 SmallBiz Manager 완전한 개발 환경 설정"
    echo "======================================"
    
    check_node_version
    cleanup_existing
    create_directory_structure
    setup_frontend
    setup_backend
    
    print_success "개발 환경 설정이 완료되었습니다!"
    print_step "다음 단계:"
    echo "1. ./configure-project.sh 실행 (설정 파일 생성)"
    echo "2. npm run dev (개발 서버 시작)"
    echo "3. 개발 시작! 🎉"
}

# 스크립트 실행
main "$@"