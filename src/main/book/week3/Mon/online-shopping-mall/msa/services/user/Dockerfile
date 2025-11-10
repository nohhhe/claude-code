# Development Dockerfile for user service
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml ./
COPY tsconfig.json ./

# Copy shared packages
COPY packages/shared ./packages/shared

# Copy service-specific files
COPY services/user ./services/user

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build shared package first
RUN pnpm --filter @shopping-mall/shared build

WORKDIR /app/services/user

EXPOSE 3001

CMD ["pnpm", "dev"]