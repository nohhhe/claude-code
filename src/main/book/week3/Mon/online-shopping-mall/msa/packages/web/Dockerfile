# Multi-stage build for Next.js web frontend
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json pnpm-workspace.yaml tsconfig.json ./
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY packages/web ./packages/web

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Build shared and UI packages first
RUN pnpm --filter @shopping-mall/shared build
RUN pnpm --filter @shopping-mall/ui build

# Build web application
WORKDIR /app/packages/web
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# Copy built application and necessary files
COPY --from=base /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=base /app/packages/web/.next ./packages/web/.next
COPY --from=base /app/packages/web/public ./packages/web/public
COPY --from=base /app/packages/web/package.json ./packages/web/
COPY --from=base /app/packages/web/server.js ./packages/web/
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/packages/shared/package.json ./packages/shared/
COPY --from=base /app/packages/ui/dist ./packages/ui/dist
COPY --from=base /app/packages/ui/package.json ./packages/ui/

# Copy packages/web node_modules for proper module resolution
COPY --from=base /app/packages/web/node_modules ./packages/web/node_modules

WORKDIR /app/packages/web

ENV PORT=3100
ENV NODE_ENV=production

EXPOSE 3100

CMD ["npm", "start"]