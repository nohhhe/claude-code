# Development Dockerfile for UI package
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.json ./

# Copy package files
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY packages/ui ./packages/ui
COPY packages/shared ./packages/shared

WORKDIR /app/packages/ui

EXPOSE 6006

CMD ["pnpm", "dev"]