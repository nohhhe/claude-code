# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project has been migrated from a microservices architecture to a modern monorepo structure using PNPM workspaces. It now features a streamlined architecture with Next.js frontend, NestJS backend, shared packages, and a comprehensive UI component library. This is part of Week 3 of a Claude Code book learning project, demonstrating the evolution from MSA to monorepo patterns.

## Current Architecture (Monorepo)

### Primary Package Structure
- `packages/web/` - **Next.js 14 Frontend** with SSR support (port 3100)
- `packages/api/` - **NestJS Backend** with TypeORM and Swagger (port 3000)  
- `packages/shared/` - **Shared Types & Utilities** (TypeScript types, Zod schemas, constants)
- `packages/ui/` - **React Component Library** with Storybook (port 6006)

### Legacy Structure (Maintained for Reference)
- `services/` - 8 microservices (user, product, order, payment, shipping, cart, review, notification)
- `apps/` - Legacy frontend applications (React+Vite web, Ant Design admin, React Native mobile)
- `gateway/` - API Gateway service (compatibility layer)
- `docker-compose.msa-backup.yml` - Legacy Docker configuration

### Infrastructure
- **PostgreSQL** (port 5432): Main application database
- **MongoDB** (port 27017): Product catalog and reviews  
- **Redis** (port 6379): Caching and session storage
- **RabbitMQ** (ports 5672, 15672): Message queue for async operations

## Development Commands

### Primary Monorepo Commands
```bash
# Install all dependencies
pnpm install

# Development mode - runs shared, api, and web concurrently
pnpm dev

# Individual package development
pnpm dev:web    # Next.js frontend
pnpm dev:api    # NestJS backend  
pnpm dev:ui     # Storybook component library

# Build all packages in dependency order
pnpm build

# Run all tests
pnpm test

# Lint all packages
pnpm lint

# Type check all TypeScript
pnpm type-check

# Format code with Prettier
pnpm format

# Clean all build artifacts
pnpm clean
```

### Package-Specific Commands
```bash
# Work with specific packages using filters
pnpm --filter @shopping-mall/web dev
pnpm --filter @shopping-mall/api build
pnpm --filter @shopping-mall/shared test
pnpm --filter @shopping-mall/ui build-storybook

# Add dependencies to specific packages
pnpm --filter @shopping-mall/web add next
pnpm --filter @shopping-mall/api add @nestjs/swagger
```

### Docker Commands
```bash
# Start new monorepo structure
pnpm docker:up

# Build Docker images
pnpm docker:build

# View logs
pnpm docker:logs

# Stop all containers
pnpm docker:down

# Start only databases for local development
docker-compose up postgres mongodb redis rabbitmq -d

# Use legacy MSA structure (if needed)
docker-compose -f docker-compose.msa-backup.yml up -d
```

## Package Dependencies & Workflow

### Build Order
1. `packages/shared` - Built first (contains types and utilities)
2. `packages/ui` - Depends on shared (UI components)
3. `packages/api` - Depends on shared (backend API)
4. `packages/web` - Depends on shared and ui (frontend)

### Development Workflow
1. **Setup**: Run `pnpm install` to install all dependencies
2. **Development**: Use `pnpm dev` for hot-reloading development
3. **Testing**: Run `pnpm test` before committing
4. **Linting**: Run `pnpm lint` to check code quality
5. **Building**: Run `pnpm build` for production builds

## Key Technology Stack

### Backend (`packages/api/`)
- **Framework**: NestJS with Express
- **Database**: TypeORM with PostgreSQL
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT with Passport
- **Validation**: Class-validator and class-transformer

### Frontend (`packages/web/`)  
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Built-in React state (Context/useState)
- **API Communication**: Fetch API with TypeScript types from shared

### Shared (`packages/shared/`)
- **Validation**: Zod schemas for runtime type checking
- **Types**: Comprehensive TypeScript interfaces
- **Utils**: Date formatting, price calculations, API responses
- **Constants**: HTTP status codes, validation rules, cache keys

### UI Library (`packages/ui/`)
- **Components**: React components with TypeScript
- **Styling**: Tailwind CSS with design system
- **Development**: Storybook for component development
- **Testing**: Jest with React Testing Library

## Environment Configuration

### Database Setup
The system uses multiple databases that are automatically configured via Docker Compose:

```bash
# PostgreSQL (Main database)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopping_mall

# MongoDB (Product catalog)  
MONGODB_URI=mongodb://admin:admin123@localhost:27017/shopping_mall?authSource=admin

# Redis (Caching)
REDIS_URL=redis://localhost:6379

# RabbitMQ (Message queue)
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
```

### Environment Files
Create the following environment files:

```bash
# packages/api/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopping_mall
JWT_SECRET=your-jwt-secret-key
REDIS_URL=redis://localhost:6379

# packages/web/.env.local  
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## API Documentation & Development Tools

- **Backend API Docs**: http://localhost:3000/api/docs (Swagger UI)
- **Storybook UI**: http://localhost:6006 (Component library)
- **Frontend App**: http://localhost:3100 (Next.js application)

## CI/CD & Deployment

### GitHub Actions Workflows
- **CI Pipeline** (`.github/workflows/ci.yml`): Runs tests, linting, and builds on PRs
- **Release Pipeline** (`.github/workflows/release.yml`): Builds and publishes Docker images on tags
- **Storybook Deploy** (`.github/workflows/storybook.yml`): Deploys component library to GitHub Pages

### Docker Production
```bash
# Build production images
docker build -f packages/web/Dockerfile -t shopping-mall-web .
docker build -f packages/api/Dockerfile -t shopping-mall-api .
```

## Migration Notes

### From MSA to Monorepo
This project has been successfully migrated from a microservices architecture to a monorepo structure. Key benefits achieved:

- **Simplified Development**: Single repository with shared tooling
- **Type Safety**: End-to-end TypeScript types from API to frontend  
- **Efficient Builds**: Incremental builds with dependency caching
- **Better Developer Experience**: Unified linting, testing, and formatting
- **Easier Deployment**: Streamlined CI/CD with fewer moving parts

### Legacy Compatibility
- Legacy microservices are preserved in `services/` directory
- Original Docker configuration available as `docker-compose.msa-backup.yml`
- API Gateway maintained for backward compatibility
- Original frontend apps kept in `apps/` directory

## Troubleshooting

### Common Issues
1. **PNPM not found**: Install globally with `npm install -g pnpm`
2. **Port conflicts**: Ensure ports 3000, 3100, 6006 are available
3. **Database connection**: Verify Docker containers are running
4. **Build failures**: Run `pnpm clean` then `pnpm install` and `pnpm build`

### Development Tips
- Use `pnpm docker:logs` to debug Docker container issues
- Run individual package tests with `pnpm --filter <package-name> test`
- Use Storybook for isolated component development
- Check Swagger docs for API endpoint details

## Project Structure Summary
```
online-shopping-mall/
├── packages/              # 🆕 New monorepo packages
│   ├── web/              # Next.js frontend (SSR)
│   ├── api/              # NestJS backend  
│   ├── shared/           # Shared types & utilities
│   └── ui/               # React component library
├── services/             # 📦 Legacy microservices (backup)
├── apps/                 # 📦 Legacy frontends (backup)
├── gateway/              # 🔄 API Gateway (compatibility)
├── .github/workflows/    # 🚀 CI/CD pipelines
├── docker/               # 🐳 Docker configurations
└── docs/                 # 📚 Project documentation
```

This structure provides a modern, maintainable codebase while preserving the ability to reference or rollback to the original microservices architecture if needed.