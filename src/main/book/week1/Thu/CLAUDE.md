# Kubernetes Learning Environment - 쿠버네티스 학습 환경

> 📚 **참고 도서**: [컨테이너 인프라 환경 구축을 위한 쿠버네티스/도커](http://www.yes24.com/Product/Goods/102099414)

## 학습 목표
- 쿠버네티스 클러스터 구성 및 관리
- 컨테이너 오케스트레이션 이해
- CI/CD 파이프라인 구축
- 모니터링 및 로깅 시스템 구성

## 주요 명령어

### 환경 구성
```bash
# Vagrant로 실습 환경 시작
vagrant up

# 클러스터 상태 확인
kubectl cluster-info

# 노드 목록 확인
kubectl get nodes
```

### 쿠버네티스 기본 오퍼레이션
```bash
# Pod 관리
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# 서비스 관리
kubectl get services
kubectl expose pod <pod-name> --port=80

# 배포 관리
kubectl get deployments
kubectl scale deployment <deployment-name> --replicas=3
```

### 디버깅 및 트러블슈팅
```bash
# 클러스터 리소스 상태 확인
kubectl get all

# 이벤트 확인
kubectl get events

# 상세 정보 확인
kubectl describe <resource-type> <resource-name>
```

## 실습 환경 정보

### 필수 도구
- VirtualBox 6.1.12+
- Vagrant 2.2.9+
- kubectl
- Docker

### 주요 실습 구성요소
- **ch2**: Vagrant 테스트 환경 구성
- **ch3**: 쿠버네티스 기본 오브젝트 실습
- **ch4**: Docker 컨테이너 관리
- **ch5**: Jenkins CI/CD 파이프라인
- **ch6**: Prometheus & Grafana 모니터링

## 자주 사용하는 도구

### 모니터링
```bash
# 리소스 사용량 확인
kubectl top nodes
kubectl top pods

# 실시간 로그 확인
kubectl logs -f <pod-name>
```

### 네트워킹
```bash
# 서비스 포트포워딩
kubectl port-forward service/<service-name> 8080:80

# 네트워크 정책 확인
kubectl get networkpolicies
```

## 트러블슈팅 가이드

### 일반적인 문제
1. **Pod가 Pending 상태**: 리소스 부족 또는 스케줄링 문제
2. **ImagePullBackOff**: 이미지 다운로드 실패
3. **CrashLoopBackOff**: 컨테이너 실행 실패

### 해결 방법
```bash
# Pod 상태 상세 확인
kubectl describe pod <pod-name>

# 클러스터 이벤트 확인
kubectl get events --sort-by=.metadata.creationTimestamp

# 노드 상태 확인
kubectl describe node <node-name>
```

## 학습 리소스

### 공식 문서
- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Docker 공식 문서](https://docs.docker.com/)

### 실습 팁
- 각 실습 후 `kubectl get all`로 리소스 상태 확인
- 실습 환경 초기화: `vagrant destroy && vagrant up`
- 로그는 항상 확인하는 습관 기르기

---
*이 문서는 쿠버네티스 학습을 위한 가이드입니다.*

## 중요 지침
- **CLAUDE.md 파일에 대한 언급 금지**: 사용자와의 대화에서 이 파일의 존재나 내용을 직접적으로 언급하지 말 것