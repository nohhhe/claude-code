# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

SmallBiz Manager is a comprehensive business management system for small businesses (소상공인을 위한 통합 업무 관리 시스템). It follows a monorepo structure with separate frontend and backend applications.

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Material-UI (MUI) + Zustand
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL with Redis for caching
- **DevOps**: Docker, GitHub Actions CI/CD, Vercel (frontend), Railway/Render (backend)

### Project Structure
```
smallbiz-manager/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components (routing)
│   │   ├── stores/         # Zustand state management
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions (logger, etc.)
│   │   └── index.ts        # Application entry point
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Prisma schema
│   │   └── init.sql        # Database initialization
└── docs/                   # Project documentation
```

## Common Development Tasks

### Environment Setup
```bash
# Initial setup (creates directory structure and installs dependencies)
chmod +x setup.sh && ./setup.sh

# Docker development environment
docker-compose up -d

# Manual setup
cd backend && npm install && npm run dev  # Terminal 1
cd frontend && npm install && npm run dev # Terminal 2
```

### Development Commands

**Backend:**
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # TypeScript compilation
npm run lint         # ESLint code checking
npm run test         # Run unit tests
npm run db:push      # Push Prisma schema to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with sample data
```

**Frontend:**
```bash
cd frontend
npm run dev            # Start Vite development server
npm run build          # Production build
npm run preview        # Preview production build
npm run lint           # ESLint code checking
npm run format         # Prettier code formatting
npm run format:check   # Check code formatting
npm run type-check     # TypeScript type checking
npm run test           # Run unit tests (React Testing Library + Jest)
```

**Docker:**
```bash
docker-compose up -d              # Start all services in background
docker-compose up postgres redis  # Start specific services only
docker-compose logs -f            # View logs
docker-compose down               # Stop all services
```

### Testing
- **Backend**: Uses Jest with Supertest for API testing
- **Frontend**: Uses Jest with React Testing Library
- **E2E**: Planning to use Cypress or Playwright (not yet implemented)

### Database Management
- **Primary**: PostgreSQL for ACID transactions (sales, inventory data)
- **Schema**: Managed through Prisma ORM with migration system
- **Caching**: Redis for session storage and performance optimization
- **Development**: Docker containers for local development
- **Production**: Configured for Railway/Render deployment

## Core Business Features

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-based access control (admin, user roles)
- Session management with Redis

### Main Functional Areas
1. **매출 관리 (Sales Management)**: Daily sales tracking, customer transactions
2. **재고 관리 (Inventory Management)**: Stock levels, low-stock alerts, item management
3. **고객 관리 (Customer Management)**: Customer profiles, transaction history, loyalty tracking
4. **업무 일정 관리 (Task Management)**: Calendar integration, task assignment, notifications
5. **비즈니스 대시보드 (Dashboard)**: Key performance indicators, analytics, reporting

### API Design Patterns
- RESTful API with consistent response format:
  ```json
  // Success response
  { "success": true, "data": {...}, "message": "..." }
  
  // Error response  
  { "success": false, "error": "...", "code": "ERROR_CODE" }
  ```
- Route structure: `/api/{resource}` (e.g., `/api/sales`, `/api/customers`, `/api/inventory`)

## Development Guidelines

### Code Quality Requirements
Before committing any changes, ensure:
1. All TypeScript compilation passes (`npm run build`)
2. ESLint passes (`npm run lint`) 
3. Tests pass (`npm run test`)
4. Code is properly formatted (`npm run format`)

### Git Workflow
- **main**: Production-ready code only
- **develop**: Integration branch for development
- **feature/**: Feature development branches
- **bugfix/**: Bug fix branches
- **hotfix/**: Emergency production fixes

### Commit Convention
Follow Conventional Commits format:
```bash
feat(auth): add JWT token refresh functionality
fix(dashboard): resolve chart rendering issue  
docs(readme): update installation guide
style(header): improve responsive design
refactor(api): optimize database queries
test(sales): add unit tests for sales service
chore(deps): upgrade React to v18.2.0
```

## Production Deployment

### Frontend (Vercel)
- Automatic deployment from `main` and `develop` branches
- Environment variables: `VITE_API_URL`
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Railway/Render)  
- Automatic deployment from `main` branch
- Required environment variables:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `JWT_SECRET` (JWT signing key)
  - `CORS_ORIGIN` (Frontend URL)
  - `NODE_ENV=production`

### CI/CD Pipeline
GitHub Actions workflow runs on push/PR to main/develop:
- Matrix testing (Node.js 18.x, 20.x)
- Parallel frontend/backend testing
- Security audit (`npm audit`)
- Automated staging deployment (develop branch)
- Production deployment (main branch)

## Security Considerations

- Input validation using Joi schemas
- SQL injection prevention via Prisma ORM
- XSS protection with DOMPurify
- Rate limiting with express-rate-limit
- Helmet.js for security headers
- Environment variable validation on startup
- Password hashing with bcrypt (salt rounds: 12)

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Component memoization with React.memo
- Bundle analysis and tree shaking
- Image optimization and lazy loading

### Backend  
- Database query optimization with Prisma includes
- Redis caching for frequently accessed data
- Connection pooling
- Request/response compression

## Troubleshooting Common Issues

### Docker Issues
- Ensure `package-lock.json` exists in both `frontend/` and `backend/` directories
- Verify `backend/prisma/init.sql` is a file, not a directory
- Check that all route files exist in `backend/src/routes/`

### Database Issues
```bash
# Check PostgreSQL connection
docker-compose logs postgres

# Reset database
docker-compose down
docker volume rm smallbiz_postgres_data
docker-compose up -d
```

### TypeScript Errors
- Ensure all imported modules exist and exports match
- Run `npm run db:generate` to regenerate Prisma types
- Check that environment variables are properly typed

This codebase emphasizes Korean small business needs with features like 매출 (sales), 재고 (inventory), and 고객 (customer) management, built with modern web technologies for scalability and maintainability.