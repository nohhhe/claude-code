# 기술부채 예제 프로젝트

이 프로젝트는 다양한 형태의 기술부채를 포함한 예제 애플리케이션입니다.

## 기술부채 요소들

### 1. TODO/FIXME 주석
- 프로젝트 전체에 수많은 TODO와 FIXME 주석이 산재
- 우선순위 없이 나열된 작업 목록들
- 실제로 해결되지 않고 누적된 기술부채

### 2. Deprecated API 사용
- `moment.js` (deprecated, should use dayjs or date-fns)
- `request` 라이브러리 (deprecated, should use axios or fetch)
- `async` 라이브러리 (deprecated, should use modern async/await)
- 동기 파일 시스템 API 사용

### 3. 순환 복잡도 15 이상 함수들
- `userService.authenticateUser()` - 복잡도 22
- `userService.createUser()` - 복잡도 18  
- `userService.updateUser()` - 복잡도 19
- `userService.canUserUpdate()` - 복잡도 16
- `userService.getUserList()` - 복잡도 15
- `legacyUtils.processDataFile()` - 복잡도 18
- `legacyUtils.generateHash()` - 복잡도 16

### 4. 300줄 이상 파일들
- `src/services/userService.js` - 약 1,200+ 줄 (의도적으로 거대한 파일)
- `src/utils/legacyUtils.js` - 약 450+ 줄

### 5. 기타 기술부채
- 하드코딩된 설정값들
- 부적절한 에러 핸들링
- 보안 이슈 (하드코딩된 JWT secret 등)
- 동기 파일 시스템 작업
- 메모리 누수 가능성 (무제한 캐시 성장)
- 입력 검증 부족
- 로깅 시스템 부재
- 테스트 코드 없음

## 파일 구조

```
tech_dept/
├── package.json                    # 프로젝트 설정
├── src/
│   ├── index.js                   # 메인 애플리케이션
│   ├── services/
│   │   └── userService.js         # 기술부채가 집중된 사용자 서비스 (1,200+ 줄)
│   ├── controllers/
│   │   └── authController.js      # 인증 컨트롤러
│   ├── routes/
│   │   └── userRoutes.js         # 사용자 라우터
│   └── utils/
│       └── legacyUtils.js        # 레거시 유틸리티 (450+ 줄)
└── README.md                      # 이 파일
```

## 설치 및 실행

```bash
npm install
npm start
```

## 주요 문제점들

1. **거대한 파일**: userService.js는 1,200줄이 넘는 단일 파일
2. **복잡한 함수**: 여러 함수의 순환 복잡도가 15를 초과
3. **deprecated 의존성**: moment, request, async 등 구식 라이브러리 사용
4. **보안 취약점**: 하드코딩된 비밀키, 입력 검증 부족
5. **메모리 누수**: 무제한 캐시 성장, 정리 로직 부재
6. **동기 I/O**: 블로킹 파일 시스템 작업들
7. **에러 핸들링 부족**: 적절하지 않은 예외 처리
8. **테스트 부재**: 단위 테스트나 통합 테스트 없음

이 프로젝트는 리팩토링과 기술부채 해결의 예제로 사용할 수 있습니다.