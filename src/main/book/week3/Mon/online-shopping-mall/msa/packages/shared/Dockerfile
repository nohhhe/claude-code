# Development Dockerfile for shared package
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.json ./

# Copy package files
COPY packages/shared/package.json ./packages/shared/

# Install dependencies (will create lock file)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared

WORKDIR /app/packages/shared

CMD ["pnpm", "dev"]