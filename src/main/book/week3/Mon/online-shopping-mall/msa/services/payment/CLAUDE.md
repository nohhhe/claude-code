# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Payment Service Overview

This is the payment service component of the online shopping mall microservices architecture. It handles payment processing and runs on port 3004 (when containerized) or 3005 (local development default). This service is part of the larger MSA project located in the parent directory structure.

## Service Architecture

### Current State
- **Framework**: Express.js with Node.js
- **Language**: JavaScript (CommonJS modules)
- **Port**: 3005 (local), 3004 (Docker)
- **Health Check**: Available at `/health` endpoint
- **Dependencies**: Express.js only (minimal implementation)

### Planned Architecture (Per Parent CLAUDE.md)
- **Database**: PostgreSQL for payment records
- **Message Queue**: RabbitMQ for async communication with order/shipping services
- **External API**: Stripe integration for payment processing
- **Communication**: HTTP APIs via API Gateway + async messaging

## Development Commands

### Local Development
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

### Docker Development
```bash
# Build service image (from project root)
docker build -f services/payment/Dockerfile -t payment-service .

# Run containerized service
docker run -p 3004:3004 payment-service
```

### Parent Project Integration
```bash
# Run from workspace root using PNPM
pnpm --filter payment-service dev

# Add dependencies to this service
pnpm --filter payment-service add <package-name>

# Run all services including payment
pnpm dev
```

## File Structure

```
services/payment/
├── src/
│   └── index.js          # Main application entry point
├── package.json          # Service dependencies and scripts
├── Dockerfile           # Container configuration (Node 18 Alpine)
├── tsconfig.json        # TypeScript configuration (extends root)
└── CLAUDE.md           # This file
```

## Implementation Status

### Current Implementation
- Basic Express.js server setup
- Health check endpoint
- Minimal dependencies (Express only)
- Development tooling (nodemon)

### Missing Implementation (Based on Architecture)
- PostgreSQL database connection and models
- RabbitMQ message queue integration
- Stripe payment processing API
- Payment endpoints (create, process, refund, status)
- Error handling and validation
- Authentication middleware integration
- Logging and monitoring

## Key Implementation Notes

### Service Integration Points
- **Order Service**: Receives payment requests via RabbitMQ
- **Shipping Service**: Notifies of successful payments via RabbitMQ
- **Notification Service**: Sends payment confirmations via RabbitMQ
- **API Gateway**: Routes payment-related HTTP requests

### Development Considerations
- Service currently uses JavaScript but has TypeScript configuration
- Port configuration differs between local (3005) and Docker (3004)
- Minimal implementation suggests this is a learning/skeleton project
- Integration with parent workspace PNPM structure required for full functionality

### Database Schema (Planned)
Based on parent architecture, likely needs:
- Payment records with order references
- Transaction status tracking
- Payment method information
- Refund/chargeback records