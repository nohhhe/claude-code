# Payment Service

Payment processing microservice for the online shopping mall. Handles payment creation, processing, refunds with mock Stripe integration.

## Features

- Payment creation and processing
- Mock Stripe integration for testing
- PostgreSQL for payment records
- RabbitMQ for event messaging
- Payment status tracking
- Refund processing
- Comprehensive validation and error handling

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Payment Operations
- `POST /api/payments` - Create new payment
- `POST /api/payments/:paymentId/process` - Process payment
- `POST /api/payments/:paymentId/refund` - Refund payment
- `GET /api/payments/:paymentId` - Get payment details
- `GET /api/payments/order/:orderId` - Get payments by order
- `GET /api/payments/user/:userId` - Get user payments (paginated)

## Mock Payment Methods

For testing different payment scenarios:
- `card_success` - Successful payment (default)
- `card_decline` - Declined payment
- `card_insufficient` - Insufficient funds
- `card_auth` - Requires additional authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **amqplib** - RabbitMQ client
- **joi** - Input validation
- **uuid** - UUID generation

## File Structure

```
src/
├── api/             # API routes
│   ├── index.js     # API router
│   └── payments.js  # Payment routes
├── config/          # Database and RabbitMQ configuration
├── controllers/     # API controllers
├── middleware/      # Validation and error handling middleware
├── models/          # Payment data models
├── services/        # Mock Stripe service
├── validation/      # Input validation schemas
└── index.js         # Main application entry point
```

## Database Schema

### payments table
- `id` (UUID, primary key)
- `order_id` (UUID, not null)
- `user_id` (UUID, not null) 
- `amount` (DECIMAL(10,2), not null)
- `currency` (VARCHAR(3), default 'USD')
- `payment_method` (VARCHAR(50), not null)
- `payment_intent_id` (VARCHAR(255))
- `status` (VARCHAR(20), default 'pending')
- `created_at` (TIMESTAMP, default now)
- `updated_at` (TIMESTAMP, default now)

### payment_logs table
- `id` (UUID, primary key)
- `payment_id` (UUID, foreign key)
- `action` (VARCHAR(50), not null)
- `status` (VARCHAR(20), not null)
- `response_data` (JSONB)
- `created_at` (TIMESTAMP, default now)

## Example Usage

### Create Payment
```bash
curl -X POST http://localhost:3005/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "987fcdeb-51a2-43d1-9f12-345678901234", 
    "amount": 99.99,
    "currency": "USD",
    "paymentMethod": "card"
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:3005/api/payments/{paymentId}/process \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "card_success"
  }'
```

## Events Published

- `payment.completed` - Payment successfully processed
- `payment.failed` - Payment processing failed  
- `payment.refunded` - Payment refunded