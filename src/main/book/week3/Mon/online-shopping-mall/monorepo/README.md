# Online Shopping Mall - Monorepo

A modern e-commerce platform built with Next.js, NestJS, and shared packages in a pnpm workspace.

## Architecture

This is a monorepo containing:

- **Web App** (`packages/web`) - Next.js 14 frontend with App Router
- **API** (`packages/api`) - NestJS REST API backend
- **Shared** (`packages/shared`) - Common types and utilities
- **UI** (`packages/ui`) - Shared React components

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: NestJS, Node.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose (for containerized setup)

### Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Build shared packages:
```bash
pnpm --filter @monorepo/shared build
pnpm --filter @monorepo/ui build
```

3. Start development servers:
```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter @monorepo/web dev
pnpm --filter @monorepo/api dev
```

### Docker Setup

1. Build and start all services:
```bash
cd docker
docker-compose up --build
```

2. Access the applications:
- Web App: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Project Structure

```
monorepo/
├── packages/
│   ├── web/           # Next.js frontend
│   │   ├── src/app/   # App Router pages
│   │   └── src/       # Components, styles
│   ├── api/           # NestJS backend
│   │   ├── src/       # Controllers, services, modules
│   │   └── test/      # API tests
│   ├── shared/        # Shared types & utilities
│   │   └── src/       # Interfaces, enums, helpers
│   └── ui/            # Shared React components
│       └── src/       # Reusable components
├── docker/            # Docker configuration
│   ├── web.Dockerfile
│   ├── api.Dockerfile
│   ├── docker-compose.yml
│   └── init.sql       # Database initialization
└── package.json       # Root workspace configuration
```

## Available Scripts

### Root Level
- `pnpm dev` - Start all packages in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests for all packages
- `pnpm clean` - Clean all build artifacts

### Package Level
- `pnpm --filter @monorepo/web dev` - Start web app
- `pnpm --filter @monorepo/api dev` - Start API server
- `pnpm --filter @monorepo/shared build` - Build shared package
- `pnpm --filter @monorepo/ui build` - Build UI components

## API Endpoints

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID

### Cart
- `GET /cart/:userId` - Get user's cart
- `POST /cart/:userId/items` - Add item to cart
- `DELETE /cart/:userId/items/:itemId` - Remove item from cart

### Orders
- `GET /orders` - List all orders
- `GET /orders/:id` - Get order by ID

## Environment Variables

### Web App (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API (.env)
```
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/shopping_mall
REDIS_URL=redis://localhost:6379
```

## Deployment

### Using Docker
```bash
cd docker
docker-compose up --build -d
```

### Manual Deployment
1. Build all packages:
```bash
pnpm build
```

2. Deploy each package to your hosting platform
3. Ensure environment variables are set correctly
4. Run database migrations if needed

## Contributing

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a feature branch
4. Make your changes
5. Run tests: `pnpm test`
6. Run linting: `pnpm lint`
7. Commit your changes
8. Create a pull request

## License

MIT License