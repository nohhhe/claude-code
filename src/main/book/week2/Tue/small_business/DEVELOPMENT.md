# 🛠️ SmallBiz Manager - 개발 가이드

## 📚 목차
- [개발 환경 세팅](#-개발-환경-세팅)
- [팀 협업 규칙](#-팀-협업-규칙)
- [코딩 컨벤션](#-코딩-컨벤션)
- [테스트 가이드](#-테스트-가이드)
- [디버깅 가이드](#-디버깅-가이드)
- [성능 최적화](#-성능-최적화)
- [보안 가이드](#-보안-가이드)

## 🚀 개발 환경 세팅

### 필수 도구 설치

```bash
# Node.js 버전 관리자 설치 (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Node.js 최신 LTS 버전 설치
nvm install --lts
nvm use --lts

# 패키지 매니저 업그레이드
npm install -g npm@latest

# 글로벌 개발 도구 설치
npm install -g typescript@latest
npm install -g prisma@latest
npm install -g nodemon@latest
```

### IDE 설정 (VS Code 권장)

#### 필수 확장 프로그램

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint", 
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code 설정 파일

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 개발 서버 실행

#### 방법 1: 개별 실행

```bash
# 터미널 1 - 데이터베이스
docker-compose up postgres

# 터미널 2 - 백엔드
cd backend
npm run dev

# 터미널 3 - 프론트엔드  
cd frontend
npm run dev
```

#### 방법 2: Docker 통합 실행

```bash
# 전체 개발 환경 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

## 🤝 팀 협업 규칙

### Git 워크플로우

```mermaid
gitGraph
    commit id: "Initial commit"
    branch develop
    checkout develop
    commit id: "Setup project"
    branch feature/auth
    checkout feature/auth
    commit id: "Add login"
    commit id: "Add register"
    checkout develop
    merge feature/auth
    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Add dashboard"
    checkout develop
    merge feature/dashboard
    checkout main
    merge develop
    commit id: "Release v1.0"
```

### 브랜치 전략

- **main**: 프로덕션 브랜치 (배포 준비된 코드만)
- **develop**: 개발 통합 브랜치
- **feature/**: 기능 개발 브랜치
- **bugfix/**: 버그 수정 브랜치  
- **hotfix/**: 긴급 수정 브랜치

### 커밋 메시지 컨벤션

```bash
# 형식: type(scope): description

feat(auth): add JWT token refresh functionality
fix(dashboard): resolve chart rendering issue
docs(readme): update installation guide
style(header): improve responsive design
refactor(api): optimize database queries
test(sales): add unit tests for sales service
chore(deps): upgrade React to v18.2.0
```

### PR (Pull Request) 가이드

#### PR 제목 형식
```
[타입] 간단한 설명 - #이슈번호
```

#### PR 체크리스트
- [ ] 기능이 정상 동작함
- [ ] 테스트가 통과함  
- [ ] 코드 린팅 통과
- [ ] 타입 체크 통과
- [ ] 문서 업데이트 완료
- [ ] 리뷰어 지정 완료

## 📋 코딩 컨벤션

### TypeScript 스타일

```typescript
// ✅ 좋은 예
interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

const createUser = async (userData: UserData): Promise<User> => {
  // 구현...
};

// ❌ 나쁜 예
interface user_data {
  id: any;
  email: any;
}

const CreateUser = function(userData: any) {
  // 구현...
};
```

### React 컴포넌트 스타일

```tsx
// ✅ 좋은 예
interface DashboardProps {
  userId: string;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userId, 
  onRefresh 
}) => {
  const [loading, setLoading] = useState(false);
  
  const handleRefresh = useCallback(() => {
    setLoading(true);
    onRefresh();
  }, [onRefresh]);

  return (
    <Box sx={{ p: 3 }}>
      {/* 컨텐츠 */}
    </Box>
  );
};
```

### API 응답 형식

```typescript
// 성공 응답
{
  "success": true,
  "data": {
    // 응답 데이터
  },
  "message": "Operation completed successfully"
}

// 에러 응답
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🧪 테스트 가이드

### Frontend 테스트

```typescript
// components/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard userId="123" onRefresh={jest.fn()} />);
    expect(screen.getByText('대시보드')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const mockRefresh = jest.fn();
    render(<Dashboard userId="123" onRefresh={mockRefresh} />);
    
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
```

### Backend 테스트

```typescript
// controllers/__tests__/authController.test.ts
import request from 'supertest';
import app from '../../app';

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### 테스트 실행

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:coverage

# 테스트 watch 모드
npm run test:watch
```

## 🐛 디버깅 가이드

### Frontend 디버깅

#### React DevTools 활용

```typescript
// 개발 환경에서만 디버그 정보 출력
if (process.env.NODE_ENV === 'development') {
  console.log('User state:', user);
}

// Error Boundary 사용
export class ErrorBoundary extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>문제가 발생했습니다.</h1>;
    }

    return this.props.children;
  }
}
```

#### 네트워크 요청 디버깅

```typescript
// API 요청 로깅 인터셉터
apiClient.interceptors.request.use(request => {
  console.log('🚀 API Request:', {
    method: request.method,
    url: request.url,
    data: request.data
  });
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);
```

### Backend 디버깅

#### VS Code 디버깅 설정

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### 로깅 활용

```typescript
// utils/logger.ts 사용 예시
import { logger } from '@utils/logger';

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      logger.info('Login attempt', { email: req.body.email });
      
      // 로그인 로직...
      
      logger.info('Login successful', { userId: user.id });
      res.json({ success: true, data: { user, token } });
    } catch (error) {
      logger.error('Login failed', { error: error.message });
      res.status(400).json({ success: false, error: error.message });
    }
  }
};
```

## ⚡ 성능 최적화

### Frontend 최적화

#### 코드 스플리팅

```typescript
// lazy loading으로 번들 크기 최적화
const Dashboard = lazy(() => import('@pages/dashboard/DashboardPage'));
const Sales = lazy(() => import('@pages/sales/SalesPage'));

const App = () => (
  <Suspense fallback={<LinearProgress />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sales" element={<Sales />} />
    </Routes>
  </Suspense>
);
```

#### 메모화

```typescript
// React.memo로 불필요한 리렌더링 방지
export const SalesCard = React.memo<SalesCardProps>(({ sale, onEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{sale.amount}</Typography>
      </CardContent>
    </Card>
  );
});

// useMemo로 계산 최적화
const Dashboard = () => {
  const expensiveValue = useMemo(() => {
    return calculateComplexStats(sales);
  }, [sales]);

  return <div>{expensiveValue}</div>;
};
```

### Backend 최적화

#### 데이터베이스 쿼리 최적화

```typescript
// N+1 문제 해결 - include 사용
const sales = await prisma.sale.findMany({
  include: {
    customer: true, // JOIN으로 한 번에 조회
  },
  orderBy: { date: 'desc' },
  take: 20,
});

// 인덱스 활용
// prisma/schema.prisma
model Sale {
  id     String   @id @default(cuid())
  date   DateTime
  userId String
  
  @@index([userId, date]) // 복합 인덱스
}
```

#### 캐싱 전략

```typescript
// Redis 캐싱
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedStats = async (userId: string) => {
  const cacheKey = `stats:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const stats = await calculateStats(userId);
  await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5분 캐시
  
  return stats;
};
```

## 🔒 보안 가이드

### 환경 변수 관리

```bash
# .env 파일 예시
# 절대 git에 커밋하지 마세요!
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-super-long-random-secret-key-here"
API_KEY="sensitive-api-key"
```

### 입력 검증

```typescript
// Joi를 사용한 입력 검증
import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }
  next();
};
```

### SQL 인젝션 방지

```typescript
// ✅ Prisma ORM 사용 (안전)
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// ❌ 직접 SQL 쿼리 (위험)
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### XSS 방지

```typescript
// HTML 이스케이핑
import DOMPurify from 'dompurify';

const SafeHtml: React.FC<{ html: string }> = ({ html }) => {
  const cleanHtml = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};
```

## 🚀 배포 전 체크리스트

### 코드 품질 확인

```bash
# 1. 모든 테스트 통과
npm run test

# 2. 린팅 통과  
npm run lint

# 3. 타입 체크
npm run type-check

# 4. 빌드 성공
npm run build

# 5. 보안 취약점 검사
npm audit --audit-level high
```

### 환경별 설정 확인

```typescript
// config/index.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  server: {
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  database: {
    url: process.env.DATABASE_URL!,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

// 필수 환경 변수 검증
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

---

📚 추가 문서:
- [API 문서](./API.md)
- [데이터베이스 스키마](./DATABASE.md)
- [배포 가이드](./DEPLOYMENT.md)