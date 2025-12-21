# Period Tracker - 아키텍처 문서

## 목차
1. [전체 시스템 아키텍처](#1-전체-시스템-아키텍처)
2. [백엔드 아키텍처](#2-백엔드-아키텍처)
3. [프론트엔드 아키텍처](#3-프론트엔드-아키텍처)
4. [데이터베이스 설계](#4-데이터베이스-설계)
5. [인증 플로우](#5-인증-플로우)
6. [API 통신](#6-api-통신)
7. [배포 아키텍처](#7-배포-아키텍처)

---

## 1. 전체 시스템 아키텍처

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser<br/>Next.js 14]
    end

    subgraph "API Gateway"
        Gateway[API Gateway<br/>CORS, Rate Limiting]
    end

    subgraph "Backend Layer"
        Auth[Auth Service<br/>JWT Authentication]
        Cycle[Cycle Service<br/>Business Logic]
        User[User Service<br/>User Management]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Relational Data)]
    end

    subgraph "External Services"
        Email[Email Service<br/>SendGrid]
        Storage[File Storage<br/>S3/Local]
    end

    Web -->|HTTPS| Gateway
    Gateway --> Auth
    Gateway --> Cycle
    Gateway --> User

    Auth --> PostgreSQL
    Cycle --> PostgreSQL
    User --> PostgreSQL

    User --> Email
    Cycle --> Storage

    style Web fill:#e1f5fe,color:#000
    style Gateway fill:#fff3e0,color:#000
    style Auth fill:#f3e5f5,color:#000
    style Cycle fill:#f3e5f5,color:#000
    style User fill:#f3e5f5,color:#000
    style PostgreSQL fill:#e8f5e9,color:#000
    style Email fill:#fce4ec,color:#000
    style Storage fill:#fce4ec,color:#000
```

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14, React 18, TypeScript | UI/UX, SSR, Static Generation |
| State Management | Zustand | Client-side state management |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Backend | Spring Boot 3, Kotlin | REST API, Business Logic |
| Security | Spring Security, JWT | Authentication & Authorization |
| Database | PostgreSQL 16 | Relational data storage |
| ORM | Spring Data JPA | Database abstraction |
| API Documentation | SpringDoc OpenAPI | Swagger UI |
| Development | Docker Compose | Local database environment |

---

## 2. 백엔드 아키텍처

### 2.1 Layered Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        Controller[Controllers<br/>@RestController]
        ExHandler[Exception Handler<br/>@ControllerAdvice]
    end

    subgraph "Security Layer"
        JwtFilter[JWT Filter<br/>Token Validation]
        SecConfig[Security Config<br/>Authorization Rules]
    end

    subgraph "Service Layer"
        AuthService[AuthService<br/>Login/Register]
        CycleService[CycleService<br/>CRUD Operations]
        StatsService[Statistics Service<br/>Calculations]
    end

    subgraph "Repository Layer"
        UserRepo[UserRepository<br/>JPA]
        CycleRepo[CycleRepository<br/>JPA]
    end

    subgraph "Domain Layer"
        User[User Entity]
        Cycle[Cycle Entity]
    end

    Controller --> JwtFilter
    JwtFilter --> SecConfig
    SecConfig --> AuthService
    SecConfig --> CycleService

    AuthService --> UserRepo
    CycleService --> CycleRepo
    CycleService --> StatsService

    UserRepo --> User
    CycleRepo --> Cycle

    User -.One-to-Many.-> Cycle

    style Controller fill:#bbdefb,color:#000
    style ExHandler fill:#bbdefb,color:#000
    style JwtFilter fill:#f8bbd0,color:#000
    style SecConfig fill:#f8bbd0,color:#000
    style AuthService fill:#c5e1a5,color:#000
    style CycleService fill:#c5e1a5,color:#000
    style StatsService fill:#c5e1a5,color:#000
    style UserRepo fill:#fff9c4,color:#000
    style CycleRepo fill:#fff9c4,color:#000
    style User fill:#ffccbc,color:#000
    style Cycle fill:#ffccbc,color:#000
```

### 2.2 Package Structure

```
com.periodtracker
├── PeriodTrackerApplication.kt          # Main Application
├── config/                               # Configuration
│   ├── JwtProperties.kt                 # JWT configuration
│   └── SecurityConfig.kt                # Spring Security setup
├── controller/                           # REST Controllers
│   ├── AuthController.kt                # Authentication endpoints
│   └── CycleController.kt               # Cycle CRUD endpoints
├── domain/                               # Domain Entities
│   ├── User.kt                          # User entity
│   ├── Cycle.kt                         # Cycle entity
│   └── FlowIntensity.kt                 # Enum for flow intensity
├── dto/                                  # Data Transfer Objects
│   ├── AuthDto.kt                       # Auth request/response
│   └── CycleDto.kt                      # Cycle request/response
├── repository/                           # Data Access
│   ├── UserRepository.kt                # User repository
│   └── CycleRepository.kt               # Cycle repository
├── service/                              # Business Logic
│   ├── AuthService.kt                   # Authentication service
│   └── CycleService.kt                  # Cycle service
└── security/                             # Security Components
    ├── JwtTokenProvider.kt              # JWT token handling
    ├── JwtAuthenticationFilter.kt       # JWT filter
    └── CustomUserDetailsService.kt      # User details service
```

### 2.3 Request Processing Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant JwtFilter
    participant Service
    participant Repository
    participant Database

    Client->>Controller: HTTP Request
    Controller->>JwtFilter: Validate Token
    JwtFilter->>JwtFilter: Extract User Info
    JwtFilter->>Controller: User Authenticated
    Controller->>Service: Business Logic
    Service->>Repository: Data Access
    Repository->>Database: SQL Query
    Database-->>Repository: Result Set
    Repository-->>Service: Entity
    Service-->>Controller: DTO
    Controller-->>Client: JSON Response
```

---

## 3. 프론트엔드 아키텍처

### 3.1 Component Architecture

```mermaid
graph TB
    subgraph "App Router"
        Root[app/page.tsx<br/>Root Redirect]
        Login[app/login/page.tsx<br/>Login Page]
        Register[app/register/page.tsx<br/>Register Page]
        Dashboard[app/dashboard/page.tsx<br/>Dashboard]
    end

    subgraph "State Management"
        AuthStore[authStore<br/>Zustand]
        CycleStore[cycleStore<br/>Zustand]
    end

    subgraph "API Layer"
        API[api.ts<br/>Axios Instance]
        AuthAPI[Auth API]
        CycleAPI[Cycle API]
    end

    subgraph "UI Components"
        Calendar[Calendar Component]
        Stats[Statistics Cards]
        CycleList[Cycle List]
        Modal[Add/Edit Modal]
    end

    Root --> Login
    Root --> Dashboard
    Login --> AuthStore
    Register --> AuthStore
    Dashboard --> CycleStore

    AuthStore --> API
    CycleStore --> API

    API --> AuthAPI
    API --> CycleAPI

    Dashboard --> Calendar
    Dashboard --> Stats
    Dashboard --> CycleList
    Dashboard --> Modal

    style Root fill:#e3f2fd,color:#000
    style Login fill:#e3f2fd,color:#000
    style Register fill:#e3f2fd,color:#000
    style Dashboard fill:#e3f2fd,color:#000
    style AuthStore fill:#f3e5f5,color:#000
    style CycleStore fill:#f3e5f5,color:#000
    style API fill:#fff3e0,color:#000
    style AuthAPI fill:#fff3e0,color:#000
    style CycleAPI fill:#fff3e0,color:#000
    style Calendar fill:#e8f5e9,color:#000
    style Stats fill:#e8f5e9,color:#000
    style CycleList fill:#e8f5e9,color:#000
    style Modal fill:#e8f5e9,color:#000
```

### 3.2 Directory Structure

```
frontend/src
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirect)
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Register page
│   └── dashboard/
│       └── page.tsx            # Dashboard page
├── components/                   # Reusable components
│   ├── Calendar/               # Calendar component
│   ├── CycleCard/              # Cycle display card
│   ├── Modal/                  # Modal components
│   └── Stats/                  # Statistics cards
├── lib/                         # Utilities
│   └── api.ts                  # Axios configuration
├── store/                       # State management
│   ├── authStore.ts            # Auth state (Zustand)
│   └── cycleStore.ts           # Cycle state (Zustand)
└── types/                       # TypeScript types
    └── index.ts                # Type definitions
```

### 3.3 State Management Flow

```mermaid
graph LR
    subgraph "Component"
        UI[User Interface]
    end

    subgraph "Zustand Store"
        State[State]
        Actions[Actions]
    end

    subgraph "API Layer"
        HTTP[HTTP Request]
    end

    subgraph "Backend"
        Server[Spring Boot API]
    end

    UI -->|dispatch| Actions
    Actions -->|update| State
    State -->|subscribe| UI
    Actions --> HTTP
    HTTP --> Server
    Server -->|response| Actions

    style UI fill:#e3f2fd,color:#000
    style State fill:#f3e5f5,color:#000
    style Actions fill:#f3e5f5,color:#000
    style HTTP fill:#fff3e0,color:#000
    style Server fill:#e8f5e9,color:#000
```

---

## 4. 데이터베이스 설계

### 4.1 ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS ||--o{ CYCLES : has

    USERS {
        bigint id PK
        varchar email UK
        varchar password
        varchar name
        date birth_date
        timestamp created_at
        timestamp updated_at
    }

    CYCLES {
        bigint id PK
        bigint user_id FK
        date start_date
        date end_date
        int cycle_length
        int period_length
        varchar flow_intensity
        text notes
        timestamp created_at
        timestamp updated_at
    }

    CYCLE_SYMPTOMS {
        bigint cycle_id FK
        varchar symptom
    }

    CYCLES ||--o{ CYCLE_SYMPTOMS : contains
```

### 4.2 Table Specifications

#### users 테이블
```sql
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    birth_date      DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### cycles 테이블
```sql
CREATE TABLE cycles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date      DATE NOT NULL,
    end_date        DATE,
    cycle_length    INTEGER,
    period_length   INTEGER,
    flow_intensity  VARCHAR(20),
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_end_date CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_cycles_user_id ON cycles(user_id);
CREATE INDEX idx_cycles_start_date ON cycles(start_date);
CREATE INDEX idx_cycles_user_start_date ON cycles(user_id, start_date DESC);
```

#### cycle_symptoms 테이블
```sql
CREATE TABLE cycle_symptoms (
    cycle_id    BIGINT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    symptom     VARCHAR(100) NOT NULL,

    PRIMARY KEY (cycle_id, symptom)
);

CREATE INDEX idx_symptoms_cycle_id ON cycle_symptoms(cycle_id);
```

### 4.3 Data Integrity Rules

| Rule | Description |
|------|-------------|
| Referential Integrity | user_id FK with CASCADE delete |
| Date Validation | end_date >= start_date |
| Email Uniqueness | Unique constraint on email |
| Password Security | BCrypt hashed, minimum 8 characters |
| Cascading Deletes | Delete user → delete all cycles → delete all symptoms |

---

## 5. 인증 플로우

### 5.1 Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter registration info
    Frontend->>Frontend: Validate form (Zod)
    Frontend->>Backend: POST /api/auth/register
    Backend->>Backend: Validate request
    Backend->>Database: Check email exists
    Database-->>Backend: Email available
    Backend->>Backend: Hash password (BCrypt)
    Backend->>Database: Insert user
    Database-->>Backend: User created
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: 201 Created + Token + User
    Frontend->>Frontend: Store token in localStorage
    Frontend->>Frontend: Update authStore
    Frontend-->>User: Redirect to dashboard
```

### 5.2 Login Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Find user by email
    Database-->>Backend: User found
    Backend->>Backend: Verify password (BCrypt)
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: 200 OK + Token + User
    Frontend->>Frontend: Store token in localStorage
    Frontend->>Frontend: Update authStore
    Frontend-->>User: Redirect to dashboard
```

### 5.3 Authenticated Request Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant JwtFilter
    participant Backend
    participant Database

    Frontend->>Frontend: Get token from localStorage
    Frontend->>JwtFilter: Request + Authorization: Bearer {token}
    JwtFilter->>JwtFilter: Extract & validate token
    JwtFilter->>JwtFilter: Extract user email from token
    JwtFilter->>Database: Load user details
    Database-->>JwtFilter: UserDetails
    JwtFilter->>JwtFilter: Set SecurityContext
    JwtFilter->>Backend: Forward request
    Backend->>Database: Execute business logic
    Database-->>Backend: Data
    Backend-->>Frontend: Response
```

### 5.4 JWT Token Structure

```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "iat": 1703145600,
    "exp": 1703232000
  },
  "signature": "HMACSHA512(...)"
}
```

**Token Specifications:**
- Algorithm: HS512
- Expiration: 24 hours
- Storage: localStorage (Frontend)
- Transmission: Authorization header (Bearer scheme)

---

## 6. API 통신

### 6.1 API Endpoints

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | 회원가입 | No |
| POST | `/api/auth/login` | 로그인 | No |

#### Cycle Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cycles` | 주기 목록 조회 | Yes |
| POST | `/api/cycles` | 주기 생성 | Yes |
| GET | `/api/cycles/{id}` | 주기 상세 조회 | Yes |
| PUT | `/api/cycles/{id}` | 주기 수정 | Yes |
| DELETE | `/api/cycles/{id}` | 주기 삭제 | Yes |
| GET | `/api/cycles/stats` | 통계 조회 | Yes |

### 6.2 Request/Response Examples

#### POST /api/auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "birthDate": "1990-01-01"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "birthDate": "1990-01-01"
  }
}
```

#### POST /api/cycles

**Request:**
```json
{
  "startDate": "2024-12-01",
  "endDate": "2024-12-05",
  "flowIntensity": "MEDIUM",
  "symptoms": ["복통", "피로", "두통"],
  "notes": "평소보다 심한 복통"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "startDate": "2024-12-01",
  "endDate": "2024-12-05",
  "cycleLength": 28,
  "periodLength": 5,
  "flowIntensity": "MEDIUM",
  "symptoms": ["복통", "피로", "두통"],
  "notes": "평소보다 심한 복통"
}
```

#### GET /api/cycles/stats

**Response (200 OK):**
```json
{
  "averageCycleLength": 28.5,
  "averagePeriodLength": 5.2,
  "nextPredictedStartDate": "2024-12-28",
  "totalCycles": 10,
  "commonSymptoms": {
    "복통": 8,
    "피로": 6,
    "두통": 4,
    "기분 변화": 5
  }
}
```

### 6.3 Error Handling

```mermaid
graph TD
    Request[API Request]
    Request --> Validation{Valid?}
    Validation -->|No| BadRequest[400 Bad Request]
    Validation -->|Yes| Auth{Authenticated?}
    Auth -->|No| Unauthorized[401 Unauthorized]
    Auth -->|Yes| Permission{Has Permission?}
    Permission -->|No| Forbidden[403 Forbidden]
    Permission -->|Yes| Resource{Resource Exists?}
    Resource -->|No| NotFound[404 Not Found]
    Resource -->|Yes| Process[Process Request]
    Process --> Error{Error?}
    Error -->|Yes| ServerError[500 Internal Server Error]
    Error -->|No| Success[200 OK / 201 Created]

    style BadRequest fill:#ffcdd2,color:#000
    style Unauthorized fill:#ffcdd2,color:#000
    style Forbidden fill:#ffcdd2,color:#000
    style NotFound fill:#ffcdd2,color:#000
    style ServerError fill:#ffcdd2,color:#000
    style Success fill:#c8e6c9,color:#000
```

**Standard Error Response:**
```json
{
  "timestamp": "2024-12-21T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "시작일은 필수입니다",
  "path": "/api/cycles"
}
```

---

## 7. 배포 아키텍처

### 7.1 Development Environment

```mermaid
graph TB
    subgraph "Developer Machine"
        IDE[IntelliJ IDEA<br/>VS Code]
        LocalFE[Next.js Dev Server<br/>:3000]
        LocalBE[Spring Boot<br/>:8080]
    end

    subgraph "Docker Compose"
        DB[(PostgreSQL<br/>:5432)]
    end

    IDE --> LocalFE
    IDE --> LocalBE
    LocalFE -->|HTTP| LocalBE
    LocalBE -->|JDBC| DB

    style IDE fill:#e3f2fd,color:#000
    style LocalFE fill:#fff3e0,color:#000
    style LocalBE fill:#c8e6c9,color:#000
    style DB fill:#b2dfdb,color:#000
```

### 7.2 Production Environment (Future)

```mermaid
graph TB
    subgraph "CDN"
        CloudFront[CloudFront<br/>Static Assets]
    end

    subgraph "Load Balancer"
        ALB[Application Load Balancer]
    end

    subgraph "Application Tier"
        FE1[Next.js<br/>Instance 1]
        FE2[Next.js<br/>Instance 2]
        BE1[Spring Boot<br/>Instance 1]
        BE2[Spring Boot<br/>Instance 2]
    end

    subgraph "Database Tier"
        Primary[(PostgreSQL<br/>Primary)]
        Replica[(PostgreSQL<br/>Read Replica)]
    end

    subgraph "Cache Layer"
        Redis[(Redis<br/>Session Cache)]
    end

    Users[Users] --> CloudFront
    CloudFront --> ALB
    ALB --> FE1
    ALB --> FE2
    FE1 --> BE1
    FE2 --> BE2
    BE1 --> Primary
    BE2 --> Primary
    BE1 --> Replica
    BE2 --> Replica
    BE1 --> Redis
    BE2 --> Redis

    style CloudFront fill:#e3f2fd,color:#000
    style ALB fill:#fff3e0,color:#000
    style FE1 fill:#c8e6c9,color:#000
    style FE2 fill:#c8e6c9,color:#000
    style BE1 fill:#b2dfdb,color:#000
    style BE2 fill:#b2dfdb,color:#000
    style Primary fill:#ffccbc,color:#000
    style Replica fill:#ffccbc,color:#000
    style Redis fill:#f8bbd0,color:#000
```

### 7.3 CI/CD Pipeline (Future)

```mermaid
graph LR
    subgraph "Source Control"
        GitHub[GitHub Repository]
    end

    subgraph "CI/CD"
        Actions[GitHub Actions]
        Build[Build & Test]
        Docker[Build Docker Images]
    end

    subgraph "Registry"
        ECR[Amazon ECR]
    end

    subgraph "Deployment"
        ECS[Amazon ECS]
        K8s[Kubernetes]
    end

    GitHub -->|Push/PR| Actions
    Actions --> Build
    Build -->|Success| Docker
    Docker --> ECR
    ECR --> ECS
    ECR --> K8s

    style GitHub fill:#e3f2fd,color:#000
    style Actions fill:#fff3e0,color:#000
    style Build fill:#c8e6c9,color:#000
    style Docker fill:#b2dfdb,color:#000
    style ECR fill:#ffccbc,color:#000
    style ECS fill:#f8bbd0,color:#000
    style K8s fill:#f8bbd0,color:#000
```

---

## 8. 보안 아키텍처

### 8.1 Security Layers

```mermaid
graph TB
    subgraph "Network Security"
        HTTPS[HTTPS/TLS 1.3]
        CORS[CORS Policy]
        RateLimit[Rate Limiting]
    end

    subgraph "Application Security"
        JWT[JWT Authentication]
        BCrypt[BCrypt Password Hashing]
        Validation[Input Validation]
    end

    subgraph "Data Security"
        Encryption[Data Encryption at Rest]
        Backup[Automated Backups]
        GDPR[GDPR Compliance]
    end

    HTTPS --> JWT
    CORS --> JWT
    RateLimit --> JWT
    JWT --> BCrypt
    JWT --> Validation
    BCrypt --> Encryption
    Validation --> Encryption
    Encryption --> Backup
    Backup --> GDPR

    style HTTPS fill:#ffcdd2,color:#000
    style CORS fill:#ffcdd2,color:#000
    style RateLimit fill:#ffcdd2,color:#000
    style JWT fill:#f8bbd0,color:#000
    style BCrypt fill:#f8bbd0,color:#000
    style Validation fill:#f8bbd0,color:#000
    style Encryption fill:#c5e1a5,color:#000
    style Backup fill:#c5e1a5,color:#000
    style GDPR fill:#c5e1a5,color:#000
```

### 8.2 Security Checklist

| Category | Implementation | Status |
|----------|----------------|--------|
| **Transport Security** |
| HTTPS enforcement | Required for production | ⏳ Pending |
| TLS 1.3 | Modern encryption | ⏳ Pending |
| **Authentication** |
| JWT tokens | HS512 algorithm | ✅ Implemented |
| Token expiration | 24 hours | ✅ Implemented |
| Password hashing | BCrypt (strength 10) | ✅ Implemented |
| **Authorization** |
| Role-based access | User roles | ⏳ Pending |
| Resource ownership | User can only access own data | ✅ Implemented |
| **Input Validation** |
| Frontend validation | React Hook Form + Zod | ✅ Implemented |
| Backend validation | Bean Validation | ✅ Implemented |
| SQL injection prevention | JPA Parameterized queries | ✅ Implemented |
| XSS prevention | React auto-escaping | ✅ Implemented |
| **Data Protection** |
| CORS configuration | Whitelist origins | ✅ Implemented |
| Rate limiting | Prevent abuse | ⏳ Pending |
| Data encryption | At rest | ⏳ Pending |
| Automated backups | Daily | ⏳ Pending |

---

## 9. 성능 최적화

### 9.1 Database Optimization

```sql
-- 자주 사용되는 쿼리 최적화를 위한 인덱스
CREATE INDEX idx_cycles_user_start_date ON cycles(user_id, start_date DESC);
CREATE INDEX idx_users_email ON users(email);

-- 통계 쿼리 최적화
CREATE INDEX idx_cycles_created_at ON cycles(created_at DESC);
```

### 9.2 Caching Strategy (Future)

```mermaid
graph LR
    Request[Request]
    Request --> Cache{In Cache?}
    Cache -->|Yes| Return[Return Cached]
    Cache -->|No| DB[Query Database]
    DB --> Store[Store in Cache]
    Store --> Return

    style Cache fill:#fff3e0,color:#000
    style DB fill:#c8e6c9,color:#000
    style Store fill:#f8bbd0,color:#000
    style Return fill:#b2dfdb,color:#000
```

**Caching Targets:**
- User session data (Redis)
- Frequently accessed cycle data
- Calculated statistics
- API response caching (short TTL)

### 9.3 Frontend Performance

| Technique | Implementation |
|-----------|----------------|
| Code Splitting | Next.js automatic code splitting |
| Image Optimization | Next.js Image component |
| Static Generation | ISR for public pages |
| Client-side Caching | Zustand persist middleware |
| Bundle Analysis | webpack-bundle-analyzer |

---

## 10. 모니터링 및 로깅

### 10.1 Logging Architecture (Future)

```mermaid
graph TB
    subgraph "Application"
        BE[Backend Logs]
        FE[Frontend Logs]
    end

    subgraph "Log Aggregation"
        LogStash[Logstash]
    end

    subgraph "Storage"
        ES[(Elasticsearch)]
    end

    subgraph "Visualization"
        Kibana[Kibana Dashboard]
    end

    BE --> LogStash
    FE --> LogStash
    LogStash --> ES
    ES --> Kibana

    style BE fill:#c8e6c9,color:#000
    style FE fill:#b2dfdb,color:#000
    style LogStash fill:#fff3e0,color:#000
    style ES fill:#ffccbc,color:#000
    style Kibana fill:#f8bbd0,color:#000
```

### 10.2 Metrics to Monitor

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| API Response Time | Application logs | > 500ms |
| Error Rate | Error tracking | > 1% |
| Database Connections | PostgreSQL stats | > 80% pool |
| Memory Usage | System monitoring | > 85% |
| CPU Usage | System monitoring | > 80% |
| Active Users | Analytics | - |

---

## 11. 확장성 고려사항

### 11.1 Horizontal Scaling

```mermaid
graph TB
    LB[Load Balancer]

    subgraph "Auto Scaling Group"
        BE1[Backend 1]
        BE2[Backend 2]
        BE3[Backend 3]
    end

    subgraph "Database Cluster"
        Master[(Primary)]
        Slave1[(Replica 1)]
        Slave2[(Replica 2)]
    end

    LB --> BE1
    LB --> BE2
    LB --> BE3

    BE1 -->|Write| Master
    BE2 -->|Write| Master
    BE3 -->|Write| Master

    BE1 -->|Read| Slave1
    BE2 -->|Read| Slave2
    BE3 -->|Read| Slave1

    Master -.Replication.-> Slave1
    Master -.Replication.-> Slave2

    style LB fill:#fff3e0,color:#000
    style BE1 fill:#c8e6c9,color:#000
    style BE2 fill:#c8e6c9,color:#000
    style BE3 fill:#c8e6c9,color:#000
    style Master fill:#ffccbc,color:#000
    style Slave1 fill:#f8bbd0,color:#000
    style Slave2 fill:#f8bbd0,color:#000
```

### 11.2 Future Enhancements

1. **Microservices Architecture**
   - Separate Auth Service
   - Separate Cycle Service
   - Separate Notification Service

2. **Event-Driven Architecture**
   - Message Queue (RabbitMQ/Kafka)
   - Async processing for notifications
   - Event sourcing for audit trail

3. **Global Distribution**
   - Multi-region deployment
   - CDN for static assets
   - Geographic data residency compliance

---

## 문서 정보

- **버전**: 1.0
- **작성일**: 2024-12-21
- **최종 수정일**: 2024-12-21
- **담당자**: Period Tracker 개발팀
