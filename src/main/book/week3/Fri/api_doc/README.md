# API Documentation Generator Example

Express.js API 코드에서 자동으로 OpenAPI 3.0 명세를 생성하는 예제 프로젝트입니다.

## 🚀 기능

- **자동 문서 생성**: Express.js 라우트 파일을 분석하여 OpenAPI 3.0 명세 자동 생성
- **JSDoc 지원**: 라우트 함수의 JSDoc 주석에서 API 정보 추출
- **Swagger UI 통합**: 생성된 명세를 Swagger UI에서 바로 확인 가능
- **완전한 스키마**: 요청/응답 스키마, 파라미터, 인증, 에러 응답 포함
- **실시간 테스트**: Swagger UI에서 직접 API 테스트 가능

## 📋 요구사항

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🛠️ 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd api-doc-generator-example

# 의존성 설치
npm install
```

## 🎯 사용법

### 1. API 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 2. OpenAPI 명세 생성

```bash
# routes 디렉터리의 Express.js 코드를 분석하여 openapi.yaml 생성
npm run generate-docs
```

### 3. Swagger UI에서 문서 확인

```bash
# Swagger UI 서버 실행 (별도 터미널)
node swagger-ui-server.js
```

브라우저에서 `http://localhost:3001/docs`로 접속하여 생성된 API 문서를 확인할 수 있습니다.

## 📁 프로젝트 구조

```
api-doc-generator-example/
├── routes/                 # Express.js 라우트 파일들
│   └── users.js           # 사용자 관리 API 라우트
├── middleware/            # Express 미들웨어
│   └── auth.js           # JWT 인증 미들웨어
├── models/               # 데이터 모델
│   └── User.js          # 사용자 모델 (Mock)
├── utils/               # 유틸리티
│   └── openapi-generator.js  # OpenAPI 명세 생성기
├── app.js               # Express 앱 설정
├── swagger-ui-server.js # Swagger UI 서버
├── package.json         # 프로젝트 설정
├── openapi.yaml         # 생성된 OpenAPI 명세
└── README.md           # 이 파일
```

## 🔧 JSDoc 주석 형식

Express 라우트에서 다음 형식의 JSDoc 주석을 사용하여 API 정보를 제공합니다:

```javascript
/**
 * @route POST /api/users
 * @description Create a new user
 * @access Public
 * @param {string} email - User email (required)
 * @param {string} name - User name (required)
 * @param {string} password - User password (required, min 8 chars)
 * @returns {User} 201 - User created successfully
 * @returns {Error} 400 - Invalid request data
 * @returns {Error} 500 - Internal server error
 */
router.post('/', middleware, handler);
```

### 지원되는 JSDoc 태그

- `@route` - HTTP 메서드와 경로
- `@description` - 엔드포인트 설명
- `@access` - 접근 권한 (Public/Private)
- `@param` - 요청 파라미터
- `@returns` - 응답 정보
- `@security` - 보안 요구사항

## 🧪 API 테스트

### 1. 사용자 생성

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### 2. 사용자 조회 (인증 필요)

```bash
curl -X GET http://localhost:3000/api/users/{user-id} \
  -H "Authorization: Bearer {jwt-token}"
```

## 🔑 환경 변수

```bash
# .env 파일 생성
PORT=3000                    # API 서버 포트
JWT_SECRET=your-jwt-secret   # JWT 시크릿 키
NODE_ENV=development         # 환경 모드
SWAGGER_PORT=3001           # Swagger UI 서버 포트
```

## 📚 생성되는 OpenAPI 명세 예시

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: RESTful API for user management operations

servers:
  - url: http://localhost:3000
    description: Development server

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      required:
        - email
        - name
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 2
          maxLength: 100
        # ... 기타 속성들

paths:
  /api/users:
    post:
      summary: Create a new user
      description: Creates a new user account
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        # ... 기타 응답들
```

## 🛠️ 커스터마이징

### 1. OpenAPI 생성기 설정

`utils/openapi-generator.js`에서 생성기 옵션을 수정할 수 있습니다:

```javascript
const generator = new OpenAPIGenerator({
  title: 'My Custom API',
  version: '2.0.0',
  description: 'Custom API description',
  servers: [
    { url: 'https://api.mycompany.com', description: 'Production' }
  ]
});
```

### 2. 새로운 라우트 추가

1. `routes/` 디렉터리에 새로운 라우트 파일 생성
2. JSDoc 주석으로 API 정보 작성
3. `npm run generate-docs` 실행하여 문서 재생성

### 3. 커스텀 스키마 추가

`utils/openapi-generator.js`의 `generateCommonSchemas()` 메서드에서 스키마를 추가/수정할 수 있습니다.

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 린팅 실행
npm run lint
```

## 📝 라이센스

MIT License

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## ❓ 문제 해결

### 일반적인 문제들

1. **포트 이미 사용 중 오류**
   ```bash
   # 다른 포트 사용
   PORT=3001 npm start
   ```

2. **JWT 토큰 오류**
   ```bash
   # .env 파일에 JWT_SECRET 설정 확인
   JWT_SECRET=your-very-secure-secret-key
   ```

3. **OpenAPI 명세 생성 실패**
   - JSDoc 주석 형식 확인
   - 라우트 파일 경로 확인
   - 생성기 로그 확인

## 🔗 관련 링크

- [OpenAPI 3.0 명세](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Express.js](https://expressjs.com/)
- [JSDoc](https://jsdoc.app/)