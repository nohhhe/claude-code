# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CookShare is a recipe sharing platform built with Next.js 15 (App Router) and TypeScript. The project follows a modern, restructured architecture with clear separation of concerns and scalable folder organization.

## Architecture & Structure

This is a **frontend-only Next.js application** that follows modern React patterns:

- **App Router**: Uses Next.js 15 App Router structure (`app/` directory)
- **Component Architecture**: UI components in `components/ui/` (shadcn/ui), shared components in `components/shared/`
- **Path Aliases**: Uses `@/*` path mapping to reference files from the root directory
- **Type Safety**: Full TypeScript implementation with strict mode enabled
- **Styling**: Tailwind CSS v4 with utility-first approach

### Key Directories

- `app/` - Next.js App Router pages and API routes
- `components/ui/` - Reusable UI components (shadcn/ui based)
- `components/shared/` - Shared application components
- `lib/` - Utility functions and configuration
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `public/` - Static assets

### Important Files

- `lib/utils.ts` - Contains the `cn()` utility for merging Tailwind classes
- `lib/config.ts` - Application configuration and environment variables
- `types/index.ts` - Core TypeScript interfaces for User, Recipe, and API responses

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Technology Stack

- **Framework**: Next.js 15.5.2 with Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **State**: React hooks (no external state management currently)
- **Development**: ESLint 9 with Next.js configuration

## Code Style & Patterns

### Component Patterns

- Use functional components with TypeScript
- Implement proper prop typing with interfaces
- Follow shadcn/ui patterns for reusable components
- Use the `cn()` utility from `lib/utils.ts` for conditional styling

### Import Patterns

```typescript
// Use path aliases
import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';
import { User } from '@/types';
```

### shadcn/ui Integration

- UI components in `components/ui/` follow shadcn/ui conventions
- Components use `cn()` for merging classes
- Radix UI primitives are properly integrated
- Class variance authority (cva) used for component variants

## Environment & Configuration

- Environment variables should be prefixed with `NEXT_PUBLIC_` for client access
- Configuration centralized in `lib/config.ts`
- API URL configurable via `NEXT_PUBLIC_API_URL` environment variable

## Docker & Deployment

- Dockerfile optimized for Next.js production deployment
- Multi-stage build process for smaller image size
- docker-compose.yml includes full-stack setup (frontend, backend, database)
- Production-ready with proper user permissions and security

## Current State

The project has been recently restructured from a traditional src-based structure to a modern App Router structure. All components and utilities have been properly migrated and are functional.

### Working Features

- Basic Next.js app with TypeScript
- shadcn/ui components properly configured
- Tailwind CSS styling system
- Path aliases working correctly
- Docker deployment ready

### Backend Integration

The frontend expects a backend API at the configured API URL. The current setup assumes:

- Backend running on port 3001
- RESTful API endpoints
- JWT authentication (based on useAuth hook)

## Linting & Code Quality

- ESLint 9 configured with Next.js and TypeScript rules
- Flat config format (eslint.config.mjs)
- Ignores build directories and node_modules
- Strict TypeScript configuration enabled

When working on this codebase, ensure:

1. All new components follow the established patterns
2. Use proper TypeScript typing
3. Maintain the current directory structure
4. Follow the existing import/export conventions
5. Test builds with `npm run build` before committing major changes
