# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern e-commerce platform monorepo built with Next.js, NestJS, and shared packages using pnpm workspaces. It contains four main packages:

- **@monorepo/web** - Next.js 14 frontend with App Router and Tailwind CSS
- **@monorepo/api** - NestJS REST API backend with validation
- **@monorepo/shared** - Common TypeScript types and utilities
- **@monorepo/ui** - Shared React components library

## Development Commands

### Core Commands
```bash
# Install all dependencies (must run first)
pnpm install

# Build shared packages before development (required)
pnpm --filter @monorepo/shared build
pnpm --filter @monorepo/ui build

# Start all services in development
pnpm dev

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Type checking across monorepo
pnpm typecheck

# Clean all build artifacts
pnpm clean
```

### Package-Specific Commands
```bash
# Individual package development
pnpm --filter @monorepo/web dev
pnpm --filter @monorepo/api dev
pnpm --filter @monorepo/shared dev
pnpm --filter @monorepo/ui dev

# Build specific packages
pnpm --filter @monorepo/shared build
pnpm --filter @monorepo/ui build

# API-specific commands
pnpm --filter @monorepo/api test:watch
pnpm --filter @monorepo/api test:cov
pnpm --filter @monorepo/api test:e2e
pnpm --filter @monorepo/api start:debug
```

### Docker Commands
```bash
# Start entire stack with Docker
cd docker
docker-compose up --build

# Services available at:
# - Web: http://localhost:3000
# - API: http://localhost:3001
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

## Architecture Notes

### Monorepo Structure
- Uses pnpm workspaces with TypeScript project references for efficient builds
- All packages use workspace dependencies (`workspace:*`) for internal linking
- Shared packages (@monorepo/shared, @monorepo/ui) must be built before dependent packages

### TypeScript Configuration
- Root tsconfig.json defines path mapping for all packages
- Strict type checking enabled with comprehensive rules
- TypeScript project references for incremental compilation

### Code Quality Tools
- ESLint with TypeScript, React, and accessibility rules
- Prettier for code formatting
- Husky for git hooks
- Lint-staged for pre-commit checks
- Commitlint for conventional commits

### Package Dependencies
- **Web**: Depends on @monorepo/shared and @monorepo/ui
- **API**: Depends on @monorepo/shared for type definitions
- **UI**: Depends on @monorepo/shared and has React as peer dependency
- **Shared**: No internal dependencies, provides base types

### Development Workflow
1. Always run `pnpm install` after checkout
2. Build shared packages first: `pnpm --filter @monorepo/shared build && pnpm --filter @monorepo/ui build`
3. Use `pnpm dev` to start all services or target specific packages with `--filter`
4. Run `pnpm typecheck` before commits to catch type issues across the monorepo

### API Structure
- NestJS with class-validator for request validation
- Uses shared types from @monorepo/shared
- Jest testing setup with unit, integration, and e2e test configurations
- Includes coverage reporting and debug mode