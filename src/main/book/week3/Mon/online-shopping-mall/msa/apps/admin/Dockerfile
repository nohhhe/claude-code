# Development Dockerfile for admin app
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.json ./

# Copy package files for dependencies
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY apps/admin ./apps/admin
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

WORKDIR /app/apps/admin

# Expose port
EXPOSE 3200

# Start the admin app
CMD ["pnpm", "dev"]