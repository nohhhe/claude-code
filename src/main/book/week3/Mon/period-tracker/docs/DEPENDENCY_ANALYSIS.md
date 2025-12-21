# 의존성 분석 보고서

**분석 날짜:** 2025-12-21
**프로젝트:** Period Tracker
**분석 범위:** 백엔드(Gradle/Kotlin) + 프론트엔드(npm/Next.js)

---

## 📋 목차

1. [요약](#요약)
2. [보안 취약점 분석](#보안-취약점-분석)
3. [업데이트 가능한 패키지](#업데이트-가능한-패키지)
4. [버전 충돌 분석](#버전-충돌-분석)
5. [불필요한 의존성 분석](#불필요한-의존성-분석)
6. [권장 사항](#권장-사항)

---

## 요약

### 주요 발견 사항

| 구분 | 현재 상태 | 권장 조치 |
|------|----------|----------|
| **백엔드 보안** | Spring Boot 3.2.1에 CVE 취약점 존재 | 즉시 업데이트 필요 |
| **프론트엔드 보안** | Next.js 14.0.4에 13개 취약점 (Critical 1개) | 긴급 업데이트 필요 |
| **버전 호환성** | Kotlin, SpringDoc 구버전 사용 중 | 단계적 업데이트 권장 |
| **의존성 상태** | 불필요한 의존성 없음 | 양호 |

### 우선순위

🔴 **긴급 (Critical)**: Next.js 보안 취약점
🟠 **높음 (High)**: Spring Boot 보안 취약점
🟡 **중간 (Medium)**: 구버전 패키지 업데이트

---

## 보안 취약점 분석

### 🔴 프론트엔드 (Critical)

#### Next.js 14.0.4 - 13개 보안 취약점

**현재 버전:** 14.0.4
**권장 버전:** 14.2.35 (최소) 또는 15.1+ (권장)

**발견된 취약점:**

1. **GHSA-f82v-jwr5-mffw** (CRITICAL - CVSS 9.1)
   - 유형: Authorization Bypass in Middleware
   - CWE: CWE-285, CWE-863
   - 영향: 인증 우회 가능
   - 범위: 14.0.0 < 14.2.25

2. **GHSA-fr5h-rqp8-mj6g** (HIGH - CVSS 7.5)
   - 유형: Server-Side Request Forgery in Server Actions
   - CWE: CWE-918
   - 범위: 13.4.0 < 14.1.1

3. **GHSA-gp8f-8m3g-qvj9** (HIGH - CVSS 7.5)
   - 유형: Cache Poisoning
   - CWE: CWE-349, CWE-639
   - 범위: 14.0.0 < 14.2.10

4. **GHSA-7gfc-8cq8-jh5f** (HIGH - CVSS 7.5)
   - 유형: Authorization Bypass
   - CWE: CWE-285, CWE-863
   - 범위: 9.5.5 < 14.2.15

5. **GHSA-mwv6-3258-q52c** (HIGH - CVSS 7.5)
   - 유형: DoS with Server Components
   - CWE: CWE-400, CWE-502, CWE-1395
   - 범위: 13.3.0 < 14.2.34

6. **GHSA-5j59-xgg2-r9c4** (HIGH - CVSS 7.5)
   - 유형: DoS with Server Components (Incomplete Fix)
   - 범위: 13.3.1-canary.0 < 14.2.35

7. **GHSA-g5qg-72qw-gw5v** (MODERATE - CVSS 6.2)
   - 유형: Cache Key Confusion for Image Optimization
   - CWE: CWE-524
   - 범위: 0.9.9 < 14.2.31

8. **GHSA-4342-x723-ch2f** (MODERATE - CVSS 6.5)
   - 유형: Improper Middleware Redirect Handling (SSRF)
   - CWE: CWE-918
   - 범위: 0.9.9 < 14.2.32

9. **GHSA-g77x-44xx-532m** (MODERATE - CVSS 5.9)
   - 유형: DoS in Image Optimization
   - CWE: CWE-674
   - 범위: 10.0.0 < 14.2.7

10. **GHSA-7m27-7ghc-44w9** (MODERATE - CVSS 5.3)
    - 유형: DoS with Server Actions
    - CWE: CWE-770
    - 범위: 14.0.0 < 14.2.21

11. **GHSA-xv57-4mr9-wg8v** (MODERATE - CVSS 4.3)
    - 유형: Content Injection for Image Optimization
    - CWE: CWE-20
    - 범위: 0.9.9 < 14.2.31

12. **GHSA-qpjv-v59x-3qc4** (LOW - CVSS 3.7)
    - 유형: Race Condition to Cache Poisoning
    - CWE: CWE-362
    - 범위: 0.9.9 < 14.2.24

13. **GHSA-3h52-269p-cp9r** (LOW - CVSS 0)
    - 유형: Information Exposure in Dev Server
    - CWE: CWE-1385
    - 범위: 13.0 < 14.2.30

**권장 조치:**
```bash
cd frontend
npm install next@14.2.35  # 또는 next@^15.1.0
```

### 🟠 백엔드 (High)

#### Spring Boot 3.2.1 - CVE-2025-22235

**현재 버전:** 3.2.1
**권장 버전:** 3.4.13 (3.x 최신) 또는 4.0.1 (메이저 업그레이드)

**발견된 취약점:**

**CVE-2025-22235** (MEDIUM)
- 유형: Incorrectly Configured Access Control
- 컴포넌트: spring-boot-actuator-autoconfigure
- 설명: EndpointRequest.to()가 actuator endpoint가 비활성화/미노출 시 null/** matcher 생성
- 영향 범위: Spring Boot 3.2.0 ~ 3.2.13
- 해결: 3.2.14+ 업데이트

**관련 Spring 생태계 CVE (2025):**
- CVE-2025-41242: Path Traversal (Spring Framework)
- CVE-2025-41248, CVE-2025-41249: Security annotation 관련

**권장 조치:**
```kotlin
// build.gradle.kts
plugins {
    id("org.springframework.boot") version "3.4.13"  // 또는 "4.0.1"
}
```

---

## 업데이트 가능한 패키지

### 백엔드 (Gradle)

| 패키지 | 현재 버전 | 최신 안정 버전 | 업데이트 유형 | 우선순위 |
|--------|----------|---------------|-------------|---------|
| Spring Boot | 3.2.1 | 3.4.13 / 4.0.1 | Minor / Major | 🔴 긴급 |
| Kotlin | 1.9.21 | 2.3.0 | Major | 🟠 높음 |
| SpringDoc OpenAPI | 2.3.0 | 2.8.14 / 3.0.0 | Minor / Major | 🟡 중간 |
| JJWT | 0.12.3 | 0.13.0 | Minor | 🟢 낮음 |

#### 상세 분석

**1. Spring Boot 3.2.1 → 3.4.13 (권장) / 4.0.1**
- **현재:** 3.2.1 (2024년 1월)
- **최신 3.x:** 3.4.13 (2025년 12월)
- **최신 4.x:** 4.0.1 (2025년 11월)
- **주요 변경:**
  - 4.0.0: Spring Framework 7 기반, 완전 모듈화, Java 25 지원
  - 3.4.x: 보안 패치 및 버그 수정
- **권장:** 3.4.13 (안정성) 또는 4.0.1 (신기능)

**2. Kotlin 1.9.21 → 2.3.0**
- **현재:** 1.9.21 (2023년)
- **최신:** 2.3.0 (2025년 12월)
- **주요 변경:**
  - LLVM 16 → 19 (보안 업데이트 포함)
  - 성능 개선 및 버그 수정
  - 신규 언어 기능
- **권장:** 2.3.0

**3. SpringDoc OpenAPI 2.3.0 → 2.8.14 / 3.0.0**
- **현재:** 2.3.0
- **최신 2.x:** 2.8.14 (Spring Boot 3.x 호환)
- **최신 3.x:** 3.0.0 (Spring Boot 4.x 호환)
- **권장:** 2.8.14 (Spring Boot 3.x 사용 시)

**4. JJWT 0.12.3 → 0.13.0**
- **현재:** 0.12.3
- **최신:** 0.13.0
- **보안:** 0.12.3에는 알려진 취약점 없음
- **권장:** 0.13.0 (최신 기능 및 개선사항)

### 프론트엔드 (npm)

| 패키지 | 현재 버전 | 최신 버전 | 업데이트 유형 | 우선순위 |
|--------|----------|----------|-------------|---------|
| next | 14.0.4 | 16.1.0 | Major | 🔴 긴급 |
| react | 18.2.0 | 19.2.3 | Major | 🟡 중간 |
| react-dom | 18.2.0 | 19.2.3 | Major | 🟡 중간 |
| zod | 3.22.4 | 4.2.1 | Major | 🟡 중간 |
| zustand | 4.4.7 | 5.0.9 | Major | 🟡 중간 |
| @hookform/resolvers | 3.3.3 | 5.2.2 | Major | 🟡 중간 |
| recharts | 2.10.3 | 3.6.0 | Major | 🟡 중간 |
| date-fns | 3.0.6 | 4.1.0 | Major | 🟢 낮음 |
| lucide-react | 0.300.0 | 0.562.0 | Minor | 🟢 낮음 |

#### 상세 분석

**1. Next.js 14.0.4 → 14.2.35 (최소) / 15.1+ (권장)**
- **긴급:** 13개 보안 취약점 해결
- **14.2.35:** 보안 패치만 적용
- **15.1+:** React 19 공식 지원, 새로운 기능
- **권장:** 우선 14.2.35로 업데이트 후, 15.1+ 마이그레이션 계획

**2. React 18.2.0 → 19.2.3**
- **호환성:** React 19는 Next.js 15+ 필요
- **주요 변경:** React Compiler, Server Components 개선
- **권장:** Next.js 15 업그레이드와 함께 진행

**3. Zod 3.22.4 → 4.2.1**
- **Breaking Changes:** API 변경 가능성
- **권장:** 메이저 버전 변경 전 마이그레이션 가이드 확인

**4. Zustand 4.4.7 → 5.0.9**
- **Breaking Changes:** TypeScript 타입 개선
- **권장:** 5.0.9 업데이트 (비교적 안전)

**5. 기타 라이브러리**
- **@hookform/resolvers:** 5.2.2 (Zod 4 호환성 확인 필요)
- **recharts:** 3.6.0 (차트 API 변경 가능성)
- **date-fns:** 4.1.0 (안전한 업데이트)
- **lucide-react:** 0.562.0 (안전한 업데이트)

---

## 버전 충돌 분석

### 현재 충돌 없음

✅ **백엔드:** 모든 의존성이 Spring Boot 3.2.1과 호환됨
✅ **프론트엔드:** React 18 생태계 내에서 호환성 유지

### 잠재적 충돌 (업데이트 시)

#### 시나리오 1: Spring Boot 4.0.1 업그레이드
- **충돌 가능성:** SpringDoc OpenAPI 2.x → 3.0.0 필요
- **영향:** API 문서 설정 코드 수정 필요
- **대응:** SpringDoc 3.0.0과 함께 업그레이드

#### 시나리오 2: Next.js 15 + React 19 업그레이드
- **충돌 가능성:**
  - `@hookform/resolvers` 5.x와 Zod 4.x 호환성
  - `recharts` 3.x의 React 19 호환성
- **대응:**
  1. Next.js 15.1 + React 19 먼저 업그레이드
  2. 의존성 패키지들 개별 테스트 및 업데이트

#### 시나리오 3: Kotlin 2.3.0 업그레이드
- **충돌 가능성:** Spring Boot 플러그인 호환성
- **대응:** Spring Boot와 Kotlin 플러그인 버전 동시 업데이트

---

## 불필요한 의존성 분석

### 백엔드

✅ **모든 의존성 필요**
- `spring-boot-starter-web`: REST API
- `spring-boot-starter-data-jpa`: 데이터베이스 ORM
- `spring-boot-starter-security`: 인증/인가
- `spring-boot-starter-validation`: 입력 검증
- `jackson-module-kotlin`: JSON 직렬화
- `jjwt-*`: JWT 토큰
- `postgresql`: 데이터베이스 드라이버
- `springdoc-openapi-*`: API 문서
- `spring-boot-devtools`: 개발 도구

**결론:** 제거 가능한 의존성 없음

### 프론트엔드

✅ **모든 의존성 필요**

**핵심 프레임워크:**
- `next`, `react`, `react-dom`: 프레임워크
- `typescript`: 타입 시스템

**상태/폼 관리:**
- `zustand`: 전역 상태 관리
- `react-hook-form`, `@hookform/resolvers`, `zod`: 폼 검증

**UI/유틸리티:**
- `lucide-react`: 아이콘
- `date-fns`: 날짜 처리
- `recharts`: 차트 (통계 페이지)
- `axios`: HTTP 클라이언트

**스타일:**
- `tailwindcss`, `autoprefixer`, `postcss`: CSS 프레임워크

**개발 도구:**
- `eslint`, `eslint-config-next`: 린팅
- `@types/*`: TypeScript 타입 정의

**결론:** 모든 의존성이 기능에 필요하므로 제거 불가

---

## 권장 사항

### 즉시 조치 (1주 이내)

#### 1. 프론트엔드 보안 업데이트 (Critical)

```bash
cd frontend

# 옵션 A: 안전한 업데이트 (권장)
npm install next@14.2.35

# 옵션 B: 메이저 업그레이드 (신중히)
npm install next@^15.1.0

# 의존성 확인 및 테스트
npm install
npm run build
npm run dev
```

**테스트 체크리스트:**
- [ ] 로그인/회원가입 기능
- [ ] 월경 주기 기록
- [ ] 통계 페이지
- [ ] 미들웨어 인증
- [ ] 이미지 최적화 (있는 경우)

#### 2. 백엔드 보안 업데이트 (High)

```kotlin
// backend/build.gradle.kts

plugins {
    id("org.springframework.boot") version "3.4.13"  // 3.2.1 → 3.4.13
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "1.9.21"  // 다음 단계에서 업데이트
    kotlin("plugin.spring") version "1.9.21"
    kotlin("plugin.jpa") version "1.9.21"
}
```

**테스트 체크리스트:**
- [ ] 애플리케이션 시작
- [ ] JWT 인증
- [ ] 데이터베이스 CRUD
- [ ] API 엔드포인트
- [ ] Swagger UI

### 단계적 업데이트 계획 (1-2개월)

#### Phase 1: 보안 패치 (완료 후)

#### Phase 2: 마이너 업데이트
```kotlin
// backend/build.gradle.kts
dependencies {
    // SpringDoc 업데이트
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.14")  // 2.3.0 → 2.8.14

    // JJWT 업데이트
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")  // 0.12.3 → 0.13.0
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")
}
```

#### Phase 3: Kotlin 메이저 업데이트
```kotlin
plugins {
    kotlin("jvm") version "2.3.0"  // 1.9.21 → 2.3.0
    kotlin("plugin.spring") version "2.3.0"
    kotlin("plugin.jpa") version "2.3.0"
}
```

**주의사항:**
- Kotlin 2.x는 일부 Breaking Changes 포함
- 컴파일 에러 및 경고 확인
- 테스트 전체 재실행

#### Phase 4: 프론트엔드 메이저 업데이트 (선택)

```bash
# Next.js 15 + React 19
npm install next@^15.1.0 react@^19.2.3 react-dom@^19.2.3

# 관련 패키지 업데이트
npm install zustand@^5.0.9 zod@^4.2.1
npm install @hookform/resolvers@^5.2.2
npm install recharts@^3.6.0 date-fns@^4.1.0
npm install lucide-react@^0.562.0
```

**마이그레이션 작업:**
- Next.js 15 마이그레이션 가이드 참조
- React 19 변경사항 확인
- Zod 4.x API 변경사항 적용
- 전체 기능 테스트

### 장기 계획 (3-6개월)

#### Spring Boot 4.0.1 업그레이드 (선택)
- Spring Framework 7.0 기반
- Java 25 지원
- 모듈화된 구조
- SpringDoc OpenAPI 3.0.0 필요

**고려사항:**
- Breaking Changes 검토
- 의존성 호환성 확인
- 테스트 커버리지 확보

### 추가 권장 사항

#### 1. 의존성 관리 자동화
```bash
# Gradle Versions Plugin 추가
# build.gradle.kts
plugins {
    id("com.github.ben-manes.versions") version "0.51.0"
}

# 업데이트 확인
./gradlew dependencyUpdates
```

#### 2. 보안 스캔 도구 도입
```bash
# npm audit 정기 실행
npm audit

# OWASP Dependency Check (Gradle)
plugins {
    id("org.owasp.dependencycheck") version "latest"
}
```

#### 3. CI/CD 파이프라인 통합
- 의존성 취약점 자동 스캔
- PR별 보안 체크
- 자동 업데이트 알림

#### 4. 모니터링
- Dependabot 설정 (GitHub)
- Renovate Bot 설정
- Snyk 통합

---

## 참고 자료

### 보안 정보
- [Spring Security Advisories](https://spring.io/security/)
- [CVE-2025-22235](https://spring.io/security/cve-2025-22235/)
- [Next.js Security Advisories](https://github.com/vercel/next.js/security/advisories)

### 업데이트 가이드
- [Spring Boot 4.0.0 Release](https://spring.io/blog/2025/11/20/spring-boot-4-0-0-available-now/)
- [Kotlin 2.3.0 Release](https://blog.jetbrains.com/kotlin/2025/12/kotlin-2-3-0-released/)
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [SpringDoc OpenAPI Releases](https://github.com/springdoc/springdoc-openapi/releases)

### 버전 정보
- [Spring Boot Versions](https://endoflife.date/spring-boot)
- [Kotlin Versions](https://endoflife.date/kotlin)
- [Next.js Versions](https://endoflife.date/nextjs)

---

## 분석 도구 및 방법론

**사용된 도구:**
- `npm audit` - 프론트엔드 보안 스캔
- `npm outdated` - 프론트엔드 버전 확인
- Gradle dependencies - 백엔드 의존성 트리
- Snyk Vulnerability Database
- GitHub Security Advisories
- CVE Database

**분석 기준:**
- CVSS 스코어 기준 우선순위
- 메이저/마이너 버전 구분
- 호환성 및 Breaking Changes 고려
- 프로덕션 영향도 평가
