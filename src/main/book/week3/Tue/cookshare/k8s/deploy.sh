#!/bin/bash

# CookShare K8s Local Deployment Script
# Usage: ./deploy.sh [action] [options]
# Actions: deploy, delete, restart, logs, status

set -e

# 설정
NAMESPACE="cookshare-local"
CONTEXT="orbstack"
DOCKER_IMAGE="cookshare-web:latest"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수들
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 도움말 표시
show_help() {
    cat << EOF
CookShare K8s Local Deployment Script

Usage: $0 [action] [options]

Actions:
    deploy      - Deploy all services to Kubernetes
    delete      - Delete all resources from Kubernetes
    restart     - Restart all deployments
    logs        - Show logs from all pods
    status      - Show status of all resources
    build       - Build Docker image
    help        - Show this help message

Options:
    -n, --namespace NAMESPACE   Use specific namespace (default: cookshare-local)
    -c, --context CONTEXT       Use specific kubectl context (default: orbstack)
    -f, --force                 Force recreate resources
    -v, --verbose               Verbose output

Examples:
    $0 deploy                   # Deploy all services
    $0 delete                   # Delete all resources
    $0 restart                  # Restart deployments
    $0 logs                     # Show all logs
    $0 status                   # Show deployment status

EOF
}

# 전제조건 확인
check_prerequisites() {
    log_info "전제조건 확인 중..."
    
    # kubectl 확인
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl이 설치되지 않았습니다."
        exit 1
    fi
    
    # docker 확인
    if ! command -v docker &> /dev/null; then
        log_error "Docker가 설치되지 않았습니다."
        exit 1
    fi
    
    # Context 확인
    if ! kubectl config get-contexts | grep -q "$CONTEXT"; then
        log_error "Kubectl context '$CONTEXT'가 존재하지 않습니다."
        log_info "사용 가능한 contexts:"
        kubectl config get-contexts
        exit 1
    fi
    
    # Context 설정
    kubectl config use-context "$CONTEXT"
    log_success "Context '$CONTEXT' 설정 완료"
}

# Docker 이미지 빌드
build_image() {
    log_info "Docker 이미지 빌드 중..."
    
    cd "$(dirname "$0")/.."
    
    if [ -f "docker/web/Dockerfile" ]; then
        docker build -f docker/web/Dockerfile -t "$DOCKER_IMAGE" .
        log_success "Docker 이미지 빌드 완료: $DOCKER_IMAGE"
    else
        log_error "Dockerfile을 찾을 수 없습니다: docker/web/Dockerfile"
        exit 1
    fi
}

# 리소스 배포
deploy_resources() {
    log_info "CookShare 리소스 배포 중..."
    
    cd "$(dirname "$0")"
    
    # 네임스페이스 생성
    log_info "네임스페이스 생성 중..."
    kubectl apply -f namespace.yaml
    
    # ConfigMap 및 Secret 배포
    log_info "ConfigMap과 Secret 배포 중..."
    kubectl apply -f configmap.yaml
    kubectl apply -f secret.yaml
    
    # PostgreSQL 배포
    log_info "PostgreSQL 배포 중..."
    kubectl apply -f postgres.yaml
    
    # PostgreSQL이 준비될 때까지 대기
    log_info "PostgreSQL이 준비될 때까지 대기 중..."
    kubectl wait --for=condition=ready pod -l app=postgres -n "$NAMESPACE" --timeout=300s
    
    # 애플리케이션 배포
    log_info "CookShare 웹 애플리케이션 배포 중..."
    kubectl apply -f app.yaml
    
    # Ingress 배포
    log_info "Ingress 배포 중..."
    kubectl apply -f ingress.yaml
    
    # 배포 완료 대기
    log_info "배포 완료 대기 중..."
    kubectl wait --for=condition=available deployment/cookshare-web-deployment -n "$NAMESPACE" --timeout=300s
    
    log_success "모든 리소스 배포 완료!"
}

# 리소스 삭제
delete_resources() {
    log_warn "모든 CookShare 리소스를 삭제합니다..."
    
    cd "$(dirname "$0")"
    
    # 역순으로 삭제
    kubectl delete -f ingress.yaml --ignore-not-found=true
    kubectl delete -f app.yaml --ignore-not-found=true
    kubectl delete -f postgres.yaml --ignore-not-found=true
    kubectl delete -f configmap.yaml --ignore-not-found=true
    kubectl delete -f secret.yaml --ignore-not-found=true
    
    # PV 수동 삭제 (필요시)
    kubectl delete pv postgres-pv --ignore-not-found=true
    
    # 네임스페이스 삭제
    kubectl delete namespace "$NAMESPACE" --ignore-not-found=true
    
    log_success "모든 리소스가 삭제되었습니다."
}

# 배포 재시작
restart_deployments() {
    log_info "배포 재시작 중..."
    
    kubectl rollout restart deployment/postgres-deployment -n "$NAMESPACE"
    kubectl rollout restart deployment/cookshare-web-deployment -n "$NAMESPACE"
    
    # 재시작 완료 대기
    kubectl rollout status deployment/postgres-deployment -n "$NAMESPACE"
    kubectl rollout status deployment/cookshare-web-deployment -n "$NAMESPACE"
    
    log_success "배포 재시작 완료!"
}

# 로그 보기
show_logs() {
    log_info "Pod 로그 표시 중..."
    
    echo
    echo "=== PostgreSQL 로그 ==="
    kubectl logs -l app=postgres -n "$NAMESPACE" --tail=50
    
    echo
    echo "=== CookShare Web 로그 ==="
    kubectl logs -l app=cookshare-web -n "$NAMESPACE" --tail=50
}

# 상태 확인
show_status() {
    log_info "리소스 상태 확인 중..."
    
    echo
    echo "=== 네임스페이스 ==="
    kubectl get namespace "$NAMESPACE" 2>/dev/null || echo "네임스페이스 '$NAMESPACE'가 존재하지 않습니다."
    
    echo
    echo "=== Pod 상태 ==="
    kubectl get pods -n "$NAMESPACE" -o wide
    
    echo
    echo "=== Service 상태 ==="
    kubectl get services -n "$NAMESPACE"
    
    echo
    echo "=== Ingress 상태 ==="
    kubectl get ingress -n "$NAMESPACE"
    
    echo
    echo "=== PersistentVolume 상태 ==="
    kubectl get pv,pvc -n "$NAMESPACE"
    
    echo
    echo "=== 배포 상태 ==="
    kubectl get deployments -n "$NAMESPACE"
    
    # 접속 정보 표시
    echo
    log_info "접속 정보:"
    echo "  - 웹 애플리케이션: http://cookshare.local"
    echo "  - 로컬호스트: http://localhost"
    echo ""
    echo "  hosts 파일에 다음을 추가하세요:"
    echo "  127.0.0.1 cookshare.local"
    echo "  127.0.0.1 api.cookshare.local"
}

# 메인 로직
main() {
    case "$1" in
        "deploy")
            check_prerequisites
            build_image
            deploy_resources
            show_status
            ;;
        "delete")
            check_prerequisites
            delete_resources
            ;;
        "restart")
            check_prerequisites
            restart_deployments
            show_status
            ;;
        "logs")
            check_prerequisites
            show_logs
            ;;
        "status")
            check_prerequisites
            show_status
            ;;
        "build")
            build_image
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            log_error "알 수 없는 액션: $1"
            show_help
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@"