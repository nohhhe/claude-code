# Monolith to MSA Migration Example

이 프로젝트는 모놀리식 아키텍처에서 마이크로서비스 아키텍처로의 전환 과정을 보여주는 예제입니다.

## 프로젝트 구조

```
├── PLAN.md              # 마이크로서비스 전환 계획
├── monolith/            # 모놀리식 서비스
│   ├── package.json
│   └── src/
│       ├── app.js       # 메인 애플리케이션
│       ├── models/      # 데이터 모델
│       └── routes/      # API 라우트
└── msa/                 # 마이크로서비스들
    ├── api-gateway/     # API 게이트웨이
    ├── user-service/    # 사용자 서비스
    ├── product-service/ # 상품 서비스
    ├── order-service/   # 주문 서비스
    └── docker-compose.yml
```

## Monolith 실행

```bash
cd monolith
npm install
npm start
```

서버는 http://localhost:3000 에서 실행됩니다.

### API 엔드포인트
- POST `/api/auth/register` - 회원가입
- POST `/api/auth/login` - 로그인
- GET `/api/products` - 상품 목록
- POST `/api/products` - 상품 생성
- POST `/api/orders` - 주문 생성
- GET `/api/users/:id` - 사용자 정보

## MSA 실행

### 개별 서비스 실행
```bash
# Terminal 1 - User Service
cd msa/user-service
npm install
npm start

# Terminal 2 - Product Service  
cd msa/product-service
npm install
npm start

# Terminal 3 - Order Service
cd msa/order-service
npm install
npm start

# Terminal 4 - API Gateway
cd msa/api-gateway
npm install
npm start
```

### Docker Compose로 실행
```bash
cd msa
docker-compose up --build
```

## 주요 차이점

### Monolith
- 단일 애플리케이션으로 모든 기능 포함
- 하나의 데이터베이스/메모리 공간 사용
- 단순한 배포 및 개발 환경
- 내부 함수 호출로 서비스 간 통신

### MSA
- 기능별로 독립된 서비스 분리
- 각 서비스별 독립적인 데이터 저장소
- API 게이트웨이를 통한 라우팅
- HTTP API 호출로 서비스 간 통신
- 독립적인 배포 및 확장 가능

## Migration 고려사항

1. **데이터 일관성**: 분산 트랜잭션 처리 필요
2. **서비스 간 통신**: 네트워크 지연 및 실패 처리
3. **모니터링**: 분산 시스템 추적 및 로깅
4. **보안**: 서비스 간 인증 및 권한 관리