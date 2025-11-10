# Development Dockerfile for order service
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
COPY services/order ./services/order

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build shared package first
RUN pnpm --filter @shopping-mall/shared build

WORKDIR /app/services/order

EXPOSE 3003

CMD ["pnpm", "dev"]