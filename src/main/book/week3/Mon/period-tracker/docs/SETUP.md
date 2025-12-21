# Period Tracker - 설정 가이드

## 시작하기 전에

### 필수 프로그램 설치
- **Docker Desktop**: PostgreSQL 데이터베이스 실행을 위해 필요
- **JDK 17 이상**: 백엔드 실행을 위해 필요
- **Node.js 18 이상**: 프론트엔드 실행을 위해 필요

## 1단계: 데이터베이스 실행

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
docker-compose up -d
```

데이터베이스가 실행 중인지 확인:

```bash
docker ps
```

다음과 같은 컨테이너가 실행 중이어야 합니다:
- `period-tracker-db` (PostgreSQL)

### 데이터베이스 접속 정보
- **호스트**: localhost
- **포트**: 5432
- **데이터베이스**: period_tracker
- **사용자명**: postgres
- **비밀번호**: postgres

## 2단계: 백엔드 실행

### Gradle 빌드 및 실행

```bash
cd backend

# Windows
gradlew.bat bootRun

# macOS/Linux
./gradlew bootRun
```

백엔드가 성공적으로 실행되면:
- **API 서버**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

### 백엔드 테스트

브라우저에서 Swagger UI(http://localhost:8080/swagger-ui.html)에 접속하여 API 문서를 확인할 수 있습니다.

## 3단계: 프론트엔드 실행

새 터미널을 열고 다음 명령어를 실행합니다:

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 성공적으로 실행되면:
- **웹 애플리케이션**: http://localhost:3000

## 주요 API 엔드포인트

### 인증 (Authentication)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 월경 주기 (Cycles)
- `GET /api/cycles` - 주기 목록 조회
- `POST /api/cycles` - 주기 기록
- `GET /api/cycles/{id}` - 주기 상세 조회
- `PUT /api/cycles/{id}` - 주기 수정
- `DELETE /api/cycles/{id}` - 주기 삭제
- `GET /api/cycles/stats` - 통계 조회

## 테스트 시나리오

### 1. 회원가입
1. http://localhost:3000 접속
2. "회원가입" 클릭
3. 정보 입력:
   - 이름: 테스트 사용자
   - 이메일: test@example.com
   - 비밀번호: test1234 (8자 이상)
4. "회원가입" 버튼 클릭

### 2. 로그인
1. 등록한 이메일과 비밀번호로 로그인
2. 대시보드로 자동 이동

### 3. 주기 기록
1. 대시보드에서 "새 기록" 버튼 클릭
2. 시작일, 종료일, 증상 등 입력
3. 저장

### 4. 통계 확인
1. 대시보드 상단에서 통계 카드 확인
   - 총 기록 수
   - 평균 주기
   - 평균 기간
   - 다음 예정일

## 트러블슈팅

### 백엔드 실행 오류

**문제**: `Connection refused` 또는 데이터베이스 연결 오류
**해결**:
1. Docker 컨테이너가 실행 중인지 확인: `docker ps`
2. 컨테이너 재시작: `docker-compose restart`

**문제**: 포트 8080이 이미 사용 중
**해결**:
1. `backend/src/main/resources/application.yml`에서 포트 변경
2. 프론트엔드의 `.env.local`에서 `NEXT_PUBLIC_API_URL` 업데이트

### 프론트엔드 실행 오류

**문제**: `Module not found` 오류
**해결**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**문제**: API 호출 실패
**해결**:
1. 백엔드가 실행 중인지 확인
2. `.env.local` 파일의 API URL 확인
3. 브라우저 콘솔에서 CORS 에러 확인

## 개발 팁

### 백엔드 개발
- 코드 변경 시 Spring DevTools가 자동으로 재시작
- Swagger UI를 활용하여 API 테스트
- `application.yml`에서 SQL 로그 확인 가능

### 프론트엔드 개발
- Hot reload가 활성화되어 파일 저장 시 자동 새로고침
- Zustand DevTools 사용 가능
- React DevTools 브라우저 확장 설치 권장

## 다음 단계

기본 설정이 완료되었습니다! 이제 다음과 같은 기능을 추가할 수 있습니다:

1. **주기 기록 모달** - 주기를 추가/수정하는 모달 UI
2. **캘린더 뷰** - 월경 주기를 시각화하는 캘린더
3. **차트 및 그래프** - Recharts를 활용한 통계 시각화
4. **알림 기능** - 예정일 알림
5. **증상 관리** - 사전 정의된 증상 목록
6. **데이터 내보내기** - CSV/PDF 형식으로 데이터 내보내기

## 도움이 필요하신가요?

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Kotlin 공식 문서](https://kotlinlang.org/docs/home.html)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
