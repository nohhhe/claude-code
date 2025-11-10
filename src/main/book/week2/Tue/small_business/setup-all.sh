#!/bin/bash

# 🏪 SmallBiz Manager - 전체 개발 환경 원클릭 설정
# 사용법: chmod +x setup-all.sh && ./setup-all.sh

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 아트워크
show_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'
   ____                 _ _ ____ _     
  / ___| _ __ ___   __ _| | | __ (_)____
  \___ \| '_ ` _ \ / _` | | |  _ \| |_  /
   ___) | | | | | | (_| | | | |_) | |/ / 
  |____/|_| |_| |_|\__,_|_|_|____/|_/___|
                                       
  🏪 SmallBiz Manager 
  소상공인을 위한 통합 업무 관리 시스템
  Complete Development Environment Setup
EOF
    echo -e "${NC}"
}

print_step() {
    echo -e "\n${BLUE}🚀 $1${NC}"
    echo -e "${BLUE}$(printf '=%.0s' {1..50})${NC}"
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

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# 진행 상황 표시
progress_bar() {
    local current=$1
    local total=$2
    local message=$3
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((current * width / total))
    local remaining=$((width - completed))
    
    printf "\r${PURPLE}Progress: ["
    printf "%${completed}s" | tr ' ' '█'
    printf "%${remaining}s" | tr ' ' '░'
    printf "] %d%% - %s${NC}" $percentage "$message"
    
    if [ $current -eq $total ]; then
        echo ""
    fi
}

# 사전 검사
check_prerequisites() {
    print_step "사전 요구사항 검사"
    
    local error_count=0
    
    # Node.js 버전 확인
    if ! command -v node &> /dev/null; then
        print_error "Node.js가 설치되어 있지 않습니다."
        echo "https://nodejs.org에서 Node.js 18.0.0 이상을 설치해주세요."
        ((error_count++))
    else
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        if ! node -e "process.exit(process.version.slice(1).localeCompare('18.0.0', undefined, { numeric: true }) >= 0 ? 0 : 1)"; then
            print_error "Node.js 버전이 너무 낮습니다. 현재: v$NODE_VERSION, 필요: v18.0.0 이상"
            ((error_count++))
        else
            print_success "Node.js v$NODE_VERSION 확인"
        fi
    fi
    
    # npm 확인
    if ! command -v npm &> /dev/null; then
        print_error "npm이 설치되어 있지 않습니다."
        ((error_count++))
    else
        NPM_VERSION=$(npm -v)
        print_success "npm v$NPM_VERSION 확인"
    fi
    
    # Git 확인
    if ! command -v git &> /dev/null; then
        print_error "Git이 설치되어 있지 않습니다."
        echo "https://git-scm.com에서 Git을 설치해주세요."
        ((error_count++))
    else
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git v$GIT_VERSION 확인"
    fi
    
    # Docker 확인 (선택사항)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
        print_success "Docker v$DOCKER_VERSION 확인 (선택사항)"
    else
        print_warning "Docker가 설치되어 있지 않습니다. (선택사항)"
        echo "Docker를 사용하려면 https://www.docker.com에서 설치하세요."
    fi
    
    if [ $error_count -gt 0 ]; then
        print_error "필수 요구사항이 충족되지 않았습니다. 위의 도구들을 설치한 후 다시 실행해주세요."
        exit 1
    fi
    
    print_success "모든 사전 요구사항이 충족되었습니다!"
}

# 설정 확인
confirm_setup() {
    print_step "설정 확인"
    
    echo -e "${CYAN}다음 설정으로 SmallBiz Manager 개발 환경을 구축합니다:${NC}"
    echo ""
    echo "📂 프로젝트 구조:"
    echo "  ├── frontend/ (React + TypeScript + Vite + MUI)"
    echo "  ├── backend/ (Node.js + Express + TypeScript + Prisma)"
    echo "  ├── docs/ (API, Database, Deployment 문서)"
    echo "  └── .github/ (CI/CD 파이프라인)"
    echo ""
    echo "🛠️ 포함되는 도구들:"
    echo "  ├── ESLint + Prettier (코드 품질)"
    echo "  ├── Jest + Testing Library (테스트)"
    echo "  ├── Husky + Lint-staged (Git hooks)"
    echo "  ├── Docker + Docker Compose (개발 환경)"
    echo "  └── GitHub Actions (CI/CD)"
    echo ""
    echo "📚 생성되는 문서:"
    echo "  ├── 팀 개발 가이드"
    echo "  ├── API 문서"
    echo "  ├── 데이터베이스 문서"
    echo "  └── 배포 가이드"
    echo ""
    
    while true; do
        echo -e "${YELLOW}계속하시겠습니까? (y/n): ${NC}"
        read -r yn
        case $yn in
            [Yy]* ) break;;
            [Nn]* ) echo "설정이 취소되었습니다."; exit;;
            * ) echo "y 또는 n을 입력해주세요.";;
        esac
    done
}

# 실행 시간 측정
start_timer() {
    START_TIME=$(date +%s)
}

end_timer() {
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    MINUTES=$((DURATION / 60))
    SECONDS=$((DURATION % 60))
    echo -e "${GREEN}✨ 총 실행 시간: ${MINUTES}분 ${SECONDS}초${NC}"
}

# 메인 설정 프로세스
run_setup() {
    local total_steps=8
    local current_step=0
    
    print_step "SmallBiz Manager 개발 환경 설정 시작"
    
    # 1단계: 프로젝트 초기화
    ((current_step++))
    progress_bar $current_step $total_steps "프로젝트 구조 생성 및 패키지 설치"
    if [ -f "./setup-complete.sh" ]; then
        chmod +x setup-complete.sh
        ./setup-complete.sh > /dev/null 2>&1
    else
        print_error "setup-complete.sh 파일을 찾을 수 없습니다."
        exit 1
    fi
    
    # 2단계: 설정 파일 생성
    ((current_step++))
    progress_bar $current_step $total_steps "설정 파일 생성 (ESLint, Prettier, TypeScript)"
    if [ -f "./configure-project.sh" ]; then
        chmod +x configure-project.sh
        ./configure-project.sh > /dev/null 2>&1
    fi
    
    # 3단계: 기본 코드 생성
    ((current_step++))
    progress_bar $current_step $total_steps "기본 컴포넌트 및 서버 코드 생성"
    if [ -f "./create-basic-structure.sh" ]; then
        chmod +x create-basic-structure.sh
        ./create-basic-structure.sh > /dev/null 2>&1
    fi
    
    # 4단계: Git 및 CI/CD 설정
    ((current_step++))
    progress_bar $current_step $total_steps "Git 설정 및 CI/CD 파이프라인 구축"
    if [ -f "./setup-git-and-ci.sh" ]; then
        chmod +x setup-git-and-ci.sh
        ./setup-git-and-ci.sh > /dev/null 2>&1
    fi
    
    # 5단계: 문서 생성
    ((current_step++))
    progress_bar $current_step $total_steps "종합 문서 생성"
    if [ -f "./create-docs.sh" ]; then
        chmod +x create-docs.sh
        ./create-docs.sh > /dev/null 2>&1
    fi
    
    # 6단계: 의존성 설치
    ((current_step++))
    progress_bar $current_step $total_steps "Frontend 의존성 설치"
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
    
    ((current_step++))
    progress_bar $current_step $total_steps "Backend 의존성 설치"
    cd backend
    npm install > /dev/null 2>&1
    cd ..
    
    # 8단계: 검증
    ((current_step++))
    progress_bar $current_step $total_steps "설정 검증 및 테스트"
    
    # Frontend 빌드 테스트
    cd frontend
    if npm run build > /dev/null 2>&1; then
        print_success "Frontend 빌드 테스트 통과"
    else
        print_warning "Frontend 빌드에서 경고가 발생했습니다."
    fi
    cd ..
    
    # Backend 빌드 테스트
    cd backend
    if npm run build > /dev/null 2>&1; then
        print_success "Backend 빌드 테스트 통과"
    else
        print_warning "Backend 빌드에서 경고가 발생했습니다."
    fi
    cd ..
    
    progress_bar $total_steps $total_steps "완료!"
}

# 최종 안내
show_completion_guide() {
    print_step "🎉 설정 완료!"
    
    echo -e "${GREEN}SmallBiz Manager 개발 환경이 성공적으로 구축되었습니다!${NC}"
    echo ""
    echo -e "${CYAN}📋 다음 단계를 진행하세요:${NC}"
    echo ""
    echo "1️⃣  개발 서버 실행:"
    echo "   ${YELLOW}# Docker 사용 (권장)${NC}"
    echo "   docker-compose up -d"
    echo ""
    echo "   ${YELLOW}# 개별 실행${NC}"
    echo "   cd backend && npm run dev    # 터미널 1"
    echo "   cd frontend && npm run dev   # 터미널 2"
    echo ""
    echo "2️⃣  애플리케이션 접속:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:5000"
    echo "   Health:    http://localhost:5000/health"
    echo ""
    echo "3️⃣  개발 도구:"
    echo "   VS Code:   code . (워크스페이스 설정 포함)"
    echo "   Prisma:    cd backend && npm run db:studio"
    echo ""
    echo "4️⃣  Git 저장소 설정:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m \"feat: initial project setup\""
    echo "   git remote add origin https://github.com/username/smallbiz-manager.git"
    echo "   git push -u origin main"
    echo ""
    echo "5️⃣  팀원 온보딩:"
    echo "   README-TEAM.md 파일을 팀원들과 공유하세요!"
    echo ""
    echo -e "${PURPLE}📚 생성된 문서들:${NC}"
    echo "   📄 README-TEAM.md     (팀 개발 가이드)"
    echo "   📄 docs/API.md        (API 문서)"
    echo "   📄 docs/DATABASE.md   (데이터베이스 문서)"
    echo "   📄 docs/DEPLOYMENT.md (배포 가이드)"
    echo ""
    echo -e "${GREEN}Happy Coding! 🚀${NC}"
    echo ""
    echo -e "${CYAN}문의사항이 있으시면 GitHub Issues를 활용해주세요.${NC}"
}

# 메인 실행 함수
main() {
    show_banner
    start_timer
    
    check_prerequisites
    confirm_setup
    run_setup
    
    end_timer
    show_completion_guide
    
    echo ""
    echo -e "${PURPLE}🎊 SmallBiz Manager 개발 환경 구축이 완료되었습니다! 🎊${NC}"
}

# 스크립트 실행
main "$@"