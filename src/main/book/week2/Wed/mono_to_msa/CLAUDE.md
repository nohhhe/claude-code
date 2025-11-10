# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a demonstration project showing the migration from monolithic to microservice architecture (mono_to_msa). It contains two implementations of the same e-commerce system:
- **Monolith**: Single application with all features (auth, products, orders, users)
- **MSA**: Distributed microservices architecture with API gateway

## Development Commands

### Monolith Development
```bash
# Run monolith in development
cd monolith
npm install
npm run dev

# Production start
npm start
```

### MSA Development
```bash
# Individual services (requires 4 terminals)
cd msa/user-service && npm install && npm run dev     # Port 3001
cd msa/product-service && npm install && npm run dev  # Port 3002 
cd msa/order-service && npm install && npm run dev    # Port 3003
cd msa/api-gateway && npm install && npm run dev      # Port 3000

# Docker Compose (single command)
cd msa
docker-compose up --build
```

## Architecture Overview

### Monolith Structure
- Single Express.js app with route modules
- All business logic in one codebase
- Direct function calls between modules
- Routes: `/api/auth`, `/api/products`, `/api/orders`, `/api/users`

### MSA Structure
- **API Gateway** (Port 3000): Routes requests using http-proxy-middleware
- **User Service** (Port 3001): Authentication and user management
- **Product Service** (Port 3002): Product catalog
- **Order Service** (Port 3003): Order processing with product service integration
- Each service has independent Dockerfile and can be deployed separately

## Key Technical Details

### Service Communication
- Monolith: Direct JavaScript function calls
- MSA: HTTP API calls through API Gateway proxy
- Order service calls Product service via axios for validation

### Dependencies
- All services use Express.js as web framework
- Auth services use bcryptjs and jsonwebtoken
- API Gateway uses http-proxy-middleware and cors
- Docker images based on node:18-alpine

### Port Configuration
- Monolith: 3000
- API Gateway: 3000 (production entry point)
- User Service: 3001
- Product Service: 3002
- Order Service: 3003

## Development Notes
- Each MSA service has identical package.json script structure
- Docker configuration supports both individual container builds and compose
- Services are designed to demonstrate microservice patterns like service discovery through environment variables
- The project serves as a learning tool for monolith-to-microservice migration patterns