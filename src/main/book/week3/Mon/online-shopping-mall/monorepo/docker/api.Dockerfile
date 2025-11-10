FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/

RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=dependencies /app/packages/api/node_modules ./packages/api/node_modules

# Build shared packages first
RUN pnpm --filter @monorepo/shared build
RUN pnpm --filter @monorepo/api build

FROM base AS runtime

WORKDIR /app

ENV NODE_ENV production

# Copy built application
COPY --from=build /app/packages/api/dist ./packages/api/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/api/package.json ./packages/api/
COPY --from=build /app/packages/shared/package.json ./packages/shared/

EXPOSE 3001

CMD ["node", "packages/api/dist/main.js"]