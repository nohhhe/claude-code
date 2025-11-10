# CookShare Kubernetes 로컬 배포 가이드

이 디렉터리는 CookShare 애플리케이션의 로컬 Kubernetes 환경 배포를 위한 매니페스트 파일들을 포함합니다.

## 📋 목차

- [전제조건](#전제조건)
- [빠른 시작](#빠른-시작)
- [매니페스트 파일 구조](#매니페스트-파일-구조)
- [배포 방법](#배포-방법)
- [접속 방법](#접속-방법)
- [문제 해결](#문제-해결)
- [개발 워크플로우](#개발-워크플로우)

## 🔧 전제조건

### 필수 소프트웨어

1. **OrbStack** (또는 Docker Desktop)
   - Kubernetes 기능 활성화 필요
   - 최소 4GB RAM 할당 권장

2. **kubectl**
   ```bash
   # macOS
   brew install kubectl
   
   # 또는 OrbStack에 포함된 kubectl 사용
   ```

3. **NGINX Ingress Controller** (로컬 Kubernetes에 설치 필요)
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
   ```

### OrbStack 설정

1. OrbStack 실행 및 Kubernetes 활성화
2. kubectl 컨텍스트 확인:
   ```bash
   kubectl config get-contexts
   kubectl config use-context orbstack
   ```

## 🚀 빠른 시작

### 1단계: Docker 이미지 빌드 (선택사항)

```bash
# 프로젝트 루트에서 실행
docker build -f docker/web/Dockerfile -t cookshare-web:latest .
```

### 2단계: 한 번에 배포

```bash
cd k8s
./deploy.sh deploy
```

### 3단계: hosts 파일 설정

`/etc/hosts` 파일에 다음 추가:
```bash
127.0.0.1 cookshare.local
127.0.0.1 api.cookshare.local
```

### 4단계: 애플리케이션 접속

- 웹 애플리케이션: http://cookshare.local
- API 엔드포인트: http://api.cookshare.local/api

## 📁 매니페스트 파일 구조

```
k8s/
├── namespace.yaml      # cookshare-local 네임스페이스
├── secret.yaml         # 데이터베이스 및 인증 정보
├── configmap.yaml      # 환경 변수 설정
├── postgres.yaml       # PostgreSQL 데이터베이스
├── app.yaml           # CookShare 웹 애플리케이션
├── ingress.yaml       # 로컬 접속을 위한 Ingress
├── deploy.sh          # 배포 자동화 스크립트
└── README.md          # 이 파일
```

### 주요 구성 요소

1. **Namespace**: `cookshare-local` - 모든 리소스를 격리
2. **PostgreSQL**: 데이터베이스 서버 (PersistentVolume 포함)
3. **CookShare Web**: Next.js 기반 웹 애플리케이션
4. **Ingress**: 외부 접속을 위한 라우팅 설정

## 🛠️ 배포 방법

### 자동 배포 (권장)

```bash
# 전체 배포
./deploy.sh deploy

# 상태 확인
./deploy.sh status

# 로그 확인
./deploy.sh logs

# 재시작
./deploy.sh restart

# 삭제
./deploy.sh delete
```

### 수동 배포

```bash
# 1. 네임스페이스 생성
kubectl apply -f namespace.yaml

# 2. 설정 적용
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# 3. 데이터베이스 배포
kubectl apply -f postgres.yaml

# 4. 애플리케이션 배포 (PostgreSQL 준비 후)
kubectl apply -f app.yaml

# 5. Ingress 설정
kubectl apply -f ingress.yaml
```

## 🌐 접속 방법

### 웹 인터페이스

- **메인 사이트**: http://cookshare.local
- **로컬호스트**: http://localhost (Ingress 설정에 따라)

### API 엔드포인트

- **API Base URL**: http://api.cookshare.local/api
- **로컬 API**: http://localhost/api

### 데이터베이스 접속

내부 접속만 가능 (포트포워딩 필요시):
```bash
kubectl port-forward -n cookshare-local svc/postgres-service 5432:5432
```

접속 정보:
- **Host**: localhost (포트포워딩 시)
- **Port**: 5432
- **Database**: cookshare
- **Username**: cookshare
- **Password**: cookshare123

## 🔍 상태 확인

### Pod 상태 확인

```bash
kubectl get pods -n cookshare-local
```

### 서비스 상태 확인

```bash
kubectl get services -n cookshare-local
```

### 로그 확인

```bash
# 애플리케이션 로그
kubectl logs -l app=cookshare-web -n cookshare-local

# PostgreSQL 로그
kubectl logs -l app=postgres -n cookshare-local

# 실시간 로그 모니터링
kubectl logs -f -l app=cookshare-web -n cookshare-local
```

## 🐛 문제 해결

### 일반적인 문제들

#### 1. Pod가 시작되지 않음

```bash
# Pod 상태 상세 확인
kubectl describe pod -n cookshare-local

# 이벤트 확인
kubectl get events -n cookshare-local --sort-by=.metadata.creationTimestamp
```

#### 2. 이미지를 찾을 수 없음

```bash
# Docker 이미지 다시 빌드
docker build -f docker/web/Dockerfile -t cookshare-web:latest .

# 이미지 존재 확인
docker images | grep cookshare-web
```

#### 3. 데이터베이스 연결 실패

```bash
# PostgreSQL Pod 상태 확인
kubectl get pods -l app=postgres -n cookshare-local

# PostgreSQL 로그 확인
kubectl logs -l app=postgres -n cookshare-local
```

#### 4. Ingress가 작동하지 않음

```bash
# NGINX Ingress Controller 확인
kubectl get pods -n ingress-nginx

# Ingress 상태 확인
kubectl describe ingress -n cookshare-local
```

#### 5. hosts 파일 설정 문제

```bash
# hosts 파일 확인
cat /etc/hosts | grep cookshare

# DNS 해석 테스트
nslookup cookshare.local
```

### 완전 재설정

```bash
# 모든 리소스 삭제
./deploy.sh delete

# Docker 이미지 재빌드
docker build -f docker/web/Dockerfile -t cookshare-web:latest .

# 다시 배포
./deploy.sh deploy
```

## 🔄 개발 워크플로우

### 코드 변경 후 배포

```bash
# 1. Docker 이미지 재빌드
./deploy.sh build

# 2. 애플리케이션 재배포
kubectl rollout restart deployment/cookshare-web-deployment -n cookshare-local

# 3. 배포 상태 확인
kubectl rollout status deployment/cookshare-web-deployment -n cookshare-local
```

### 환경 설정 변경

```bash
# ConfigMap 수정 후
kubectl apply -f configmap.yaml

# Secret 수정 후
kubectl apply -f secret.yaml

# Pod 재시작하여 새 설정 반영
./deploy.sh restart
```

### 데이터베이스 초기화

```bash
# PostgreSQL Pod 삭제 (PV는 유지됨)
kubectl delete pod -l app=postgres -n cookshare-local

# 또는 완전 재설정
kubectl delete pvc postgres-pvc -n cookshare-local
kubectl delete pv postgres-pv
```

## 📊 모니터링

### 리소스 사용량 확인

```bash
# Pod 리소스 사용량
kubectl top pods -n cookshare-local

# 노드 리소스 사용량
kubectl top nodes
```

### 상세 상태 정보

```bash
# 모든 리소스 상태
./deploy.sh status

# 특정 배포 상태
kubectl get deployment cookshare-web-deployment -n cookshare-local -o wide
```

## 🔒 보안 고려사항

### 로컬 환경 전용

- 이 설정은 **로컬 개발 환경 전용**입니다
- 프로덕션 환경에서는 절대 사용하지 마세요
- 기본 비밀번호를 사용하고 있습니다

### 개발용 설정

- PostgreSQL 비밀번호가 하드코딩되어 있음
- JWT Secret이 개발용으로 설정됨
- TLS/SSL이 비활성화되어 있음

## 📝 참고사항

- **Context**: 이 설정은 `orbstack` context를 기본으로 사용합니다
- **네임스페이스**: 모든 리소스는 `cookshare-local` 네임스페이스에 격리됩니다
- **스토리지**: PostgreSQL 데이터는 `/tmp/cookshare-postgres-data`에 저장됩니다 (로컬 개발용)
- **포트**: 웹 애플리케이션은 기본적으로 3000 포트를 사용합니다

## 🆘 도움이 필요한 경우

1. **deploy.sh 도움말**: `./deploy.sh help`
2. **Kubernetes 로그**: `kubectl logs <pod-name> -n cookshare-local`
3. **이벤트 확인**: `kubectl get events -n cookshare-local`
4. **리소스 상태**: `./deploy.sh status`

---

Happy Cooking! 🍳✨