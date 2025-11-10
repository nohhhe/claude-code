#!/bin/bash

# 📦 SmallBiz Manager - 기본 구조 및 코드 생성 스크립트
# 사용법: chmod +x create-basic-structure.sh && ./create-basic-structure.sh

set -e

echo "📦 기본 구조와 코드를 생성합니다..."

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "\n${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Frontend 기본 파일들 생성
create_frontend_files() {
    print_step "Frontend 기본 파일 생성 중..."
    
    # index.html
    cat > frontend/index.html << 'EOF'
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SmallBiz Manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    # main.tsx
    cat > frontend/src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ko } from 'date-fns/locale'

import App from './App'
import { theme } from './utils/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <CssBaseline />
            <App />
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
EOF

    # App.tsx
    cat > frontend/src/App.tsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuthStore } from '@/stores/authStore'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { SalesPage } from '@/pages/sales/SalesPage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { InventoryPage } from '@/pages/inventory/InventoryPage'
import { TasksPage } from '@/pages/tasks/TasksPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
EOF

    # vite-env.d.ts
    cat > frontend/src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

    # setupTests.ts
    cat > frontend/src/setupTests.ts << 'EOF'
import '@testing-library/jest-dom'
EOF

    print_success "Frontend 기본 파일 생성 완료"
}

# Frontend 유틸리티 파일들 생성
create_frontend_utils() {
    print_step "Frontend 유틸리티 파일 생성 중..."
    
    # Theme 설정
    cat > frontend/src/utils/theme.ts << 'EOF'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
})
EOF

    # API 클라이언트
    cat > frontend/src/services/api.ts << 'EOF'
import axios, { AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// API 메서드들
export const api = {
  // 인증
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse>('/auth/login', { email, password }),
  
  logout: () =>
    apiClient.post<ApiResponse>('/auth/logout'),
  
  // 사용자
  getProfile: () =>
    apiClient.get<ApiResponse>('/users/profile'),
  
  // 매출
  getSales: (params?: any) =>
    apiClient.get<ApiResponse>('/sales', { params }),
  
  createSale: (data: any) =>
    apiClient.post<ApiResponse>('/sales', data),
  
  // 고객
  getCustomers: (params?: any) =>
    apiClient.get<ApiResponse>('/customers', { params }),
  
  createCustomer: (data: any) =>
    apiClient.post<ApiResponse>('/customers', data),
  
  // 재고
  getInventory: (params?: any) =>
    apiClient.get<ApiResponse>('/inventory', { params }),
  
  createInventoryItem: (data: any) =>
    apiClient.post<ApiResponse>('/inventory', data),
  
  // 업무
  getTasks: (params?: any) =>
    apiClient.get<ApiResponse>('/tasks', { params }),
  
  createTask: (data: any) =>
    apiClient.post<ApiResponse>('/tasks', data),
}
EOF

    # 타입 정의
    cat > frontend/src/types/index.ts << 'EOF'
export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'user'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: string
  amount: number
  date: string
  customerId?: string
  userId: string
  status: 'pending' | 'completed' | 'cancelled'
  items?: SaleItem[]
  customer?: Customer
  createdAt: string
  updatedAt: string
}

export interface SaleItem {
  id: string
  saleId: string
  inventoryId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  inventory?: InventoryItem
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: string
  name: string
  description?: string
  sku?: string
  price: number
  quantity: number
  lowStockThreshold: number
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assignedTo?: string
  createdBy: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  todaySales: number
  thisMonthSales: number
  totalCustomers: number
  lowStockItems: number
  pendingTasks: number
  recentSales: Sale[]
}
EOF

    print_success "Frontend 유틸리티 파일 생성 완료"
}

# Auth Store 생성
create_auth_store() {
    print_step "Zustand Auth Store 생성 중..."
    
    cat > frontend/src/stores/authStore.ts << 'EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          
          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true,
          })
        } catch (error) {
          console.error('Login error:', error)
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
EOF

    print_success "Auth Store 생성 완료"
}

# Backend 기본 파일들 생성
create_backend_files() {
    print_step "Backend 기본 파일 생성 중..."
    
    # 메인 서버 파일
    cat > backend/src/index.ts << 'EOF'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { authRoutes } from './routes/authRoutes'
import { userRoutes } from './routes/userRoutes'
import { salesRoutes } from './routes/salesRoutes'
import { customerRoutes } from './routes/customerRoutes'
import { inventoryRoutes } from './routes/inventoryRoutes'
import { taskRoutes } from './routes/taskRoutes'

import { errorHandler } from './middleware/errorHandler'
import { logger } from './utils/logger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmallBiz Manager API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/tasks', taskRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handling middleware
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})

export default app
EOF

    # Logger 유틸리티
    cat > backend/src/utils/logger.ts << 'EOF'
import winston from 'winston'

const logLevel = process.env.LOG_LEVEL || 'info'
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
]

// 프로덕션 환경에서는 파일 로깅 추가
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  )
}

export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports,
})

// 개발 환경에서는 더 자세한 로깅
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
      })
    )
  }))
}
EOF

    # Error Handler
    cat > backend/src/middleware/errorHandler.ts << 'EOF'
import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  logger.error(err.stack || 'No stack trace available')

  // Development vs Production error response
  const errorResponse: any = {
    success: false,
    message,
  }

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack
  }

  res.status(statusCode).json(errorResponse)
}

export const createError = (message: string, statusCode = 500): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
EOF

    print_success "Backend 기본 파일 생성 완료"
}

# Backend Route 파일들 생성
create_backend_routes() {
    print_step "Backend Route 파일 생성 중..."
    
    # Auth Routes
    cat > backend/src/routes/authRoutes.ts << 'EOF'
import express from 'express'
import { Request, Response } from 'express'
import { logger } from '../utils/logger'

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    logger.info('Login attempt', { email })

    // TODO: 실제 인증 로직 구현
    // 현재는 더미 응답
    const mockUser = {
      id: '1',
      email,
      username: 'testuser',
      firstName: '테스트',
      lastName: '사용자',
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    res.json({
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
      message: 'Login successful',
    })
  } catch (error) {
    logger.error('Login failed', { error })
    res.status(400).json({
      success: false,
      error: 'Login failed',
    })
  }
})

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username, firstName, lastName } = req.body

    logger.info('Register attempt', { email, username })

    // TODO: 실제 회원가입 로직 구현
    res.json({
      success: true,
      message: 'Registration successful',
    })
  } catch (error) {
    logger.error('Registration failed', { error })
    res.status(400).json({
      success: false,
      error: 'Registration failed',
    })
  }
})

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    logger.info('Logout request')
    res.json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    logger.error('Logout failed', { error })
    res.status(400).json({
      success: false,
      error: 'Logout failed',
    })
  }
})

export { router as authRoutes }
EOF

    # User Routes  
    cat > backend/src/routes/userRoutes.ts << 'EOF'
import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

// GET /api/users/profile
router.get('/profile', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      firstName: '테스트',
      lastName: '사용자',
      role: 'user',
    },
    message: 'Profile retrieved successfully',
  })
})

// GET /api/users
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Users retrieved successfully',
  })
})

export { router as userRoutes }
EOF

    # Sales Routes
    cat > backend/src/routes/salesRoutes.ts << 'EOF'
import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

// GET /api/sales
router.get('/', (req: Request, res: Response) => {
  const mockSales = [
    {
      id: '1',
      amount: 15000,
      date: new Date().toISOString(),
      status: 'completed',
      customerId: '1',
      customer: { name: '김고객' },
    },
    {
      id: '2',
      amount: 25000,
      date: new Date().toISOString(),
      status: 'completed',
      customerId: '2',
      customer: { name: '이손님' },
    },
  ]

  res.json({
    success: true,
    data: mockSales,
    message: 'Sales retrieved successfully',
  })
})

// POST /api/sales
router.post('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Sale created successfully',
  })
})

export { router as salesRoutes }
EOF

    # Customer Routes
    cat > backend/src/routes/customerRoutes.ts << 'EOF'
import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

// GET /api/customers
router.get('/', (req: Request, res: Response) => {
  const mockCustomers = [
    {
      id: '1',
      name: '김고객',
      email: 'customer1@example.com',
      phone: '010-1234-5678',
      address: '서울시 강남구',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: '이손님',
      email: 'customer2@example.com',
      phone: '010-9876-5432',
      address: '서울시 서초구',
      createdAt: new Date().toISOString(),
    },
  ]

  res.json({
    success: true,
    data: mockCustomers,
    message: 'Customers retrieved successfully',
  })
})

export { router as customerRoutes }
EOF

    # Inventory Routes
    cat > backend/src/routes/inventoryRoutes.ts << 'EOF'
import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

// GET /api/inventory
router.get('/', (req: Request, res: Response) => {
  const mockInventory = [
    {
      id: '1',
      name: '상품 A',
      sku: 'PROD-A-001',
      price: 10000,
      quantity: 50,
      lowStockThreshold: 10,
    },
    {
      id: '2',
      name: '상품 B',
      sku: 'PROD-B-001',
      price: 15000,
      quantity: 5, // 낮은 재고
      lowStockThreshold: 10,
    },
  ]

  res.json({
    success: true,
    data: mockInventory,
    message: 'Inventory retrieved successfully',
  })
})

export { router as inventoryRoutes }
EOF

    # Task Routes
    cat > backend/src/routes/taskRoutes.ts << 'EOF'
import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

// GET /api/tasks
router.get('/', (req: Request, res: Response) => {
  const mockTasks = [
    {
      id: '1',
      title: '재고 확인',
      description: '이번 주 재고 현황 점검',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: '고객 연락',
      description: 'VIP 고객 만족도 조사',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]

  res.json({
    success: true,
    data: mockTasks,
    message: 'Tasks retrieved successfully',
  })
})

export { router as taskRoutes }
EOF

    print_success "Backend Route 파일 생성 완료"
}

# 메인 함수
main() {
    echo "📦 SmallBiz Manager 기본 구조 및 코드 생성"
    echo "==========================================="
    
    create_frontend_files
    create_frontend_utils
    create_auth_store
    create_backend_files
    create_backend_routes
    
    print_success "모든 기본 구조와 코드가 생성되었습니다!"
    print_step "다음 단계:"
    echo "1. ./setup-git-and-ci.sh 실행 (Git 및 CI/CD 설정)"
    echo "2. npm install 실행 (의존성 설치)"
    echo "3. 개발 시작! 🎉"
}

# 스크립트 실행
main "$@"