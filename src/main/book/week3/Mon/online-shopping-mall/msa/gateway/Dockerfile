# Multi-stage build for API Gateway
FROM node:18-alpine AS base

# Install npm globally (gateway uses npm, not pnpm)
WORKDIR /app/gateway

# Copy gateway package.json first for better Docker layer caching
COPY gateway/package.json ./

# Install dependencies using npm
RUN npm install --production

# Copy gateway source code
COPY gateway/src ./src

# Production stage
FROM node:18-alpine AS production

WORKDIR /app/gateway

# Copy node_modules and application from build stage
COPY --from=base /app/gateway/node_modules ./node_modules
COPY --from=base /app/gateway/src ./src
COPY --from=base /app/gateway/package.json ./

EXPOSE 3000

CMD ["npm", "start"]