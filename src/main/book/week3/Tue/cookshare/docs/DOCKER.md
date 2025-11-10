# Docker Development Environment

CookShare uses Docker for a consistent development environment across all team members.

## Prerequisites

- Docker Desktop (version 4.0 or higher)
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Clone the repository and navigate to the project directory**
   ```bash
   git clone <repository-url>
   cd cookshare
   ```

2. **Start the development environment**
   ```bash
   pnpm docker:dev
   # or
   ./scripts/dev.sh start
   ```

3. **Wait for all services to be ready** (this may take a few minutes on first run)

4. **Access the applications**
   - **Web App**: http://localhost:3000
   - **API Server**: http://localhost:3001
   - **pgAdmin**: http://localhost:5050 (admin@cookshare.dev / admin)
   - **RedisInsight**: http://localhost:8001

## Services

### Core Services

- **web**: Next.js frontend application with hot reload
- **api**: Node.js/Express API server (if backend is needed)
- **postgres**: PostgreSQL 16 database with sample data
- **redis**: Redis cache for sessions and caching

### Development Tools

- **pgAdmin**: Web-based PostgreSQL administration
- **RedisInsight**: Redis GUI for debugging and monitoring

## Available Commands

### Using pnpm scripts (recommended)
```bash
pnpm docker:dev      # Start development environment
pnpm docker:stop     # Stop all services
pnpm docker:restart  # Restart all services
pnpm docker:logs     # View all service logs
pnpm docker:seed     # Seed database with sample data
pnpm docker:reset    # Reset database (destroys all data)
pnpm docker:clean    # Clean up all containers and volumes
```

### Using the development script directly
```bash
./scripts/dev.sh start           # Start development environment
./scripts/dev.sh stop            # Stop all services
./scripts/dev.sh restart         # Restart all services
./scripts/dev.sh logs [service]  # View logs (optional: specific service)
./scripts/dev.sh seed            # Seed database
./scripts/dev.sh reset-db        # Reset database
./scripts/dev.sh shell [service] # Open shell in container
./scripts/dev.sh test            # Run tests
./scripts/dev.sh status          # Show service status
./scripts/dev.sh clean           # Clean up everything
```

## Environment Configuration

### Environment Variables

The development environment uses `.env.development` as a template. On first run, it will be copied to `.env.local` where you can make local modifications.

Key environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret
- `NEXT_PUBLIC_API_URL`: API server URL for frontend

### Database Configuration

The PostgreSQL database is automatically initialized with:
- Database: `cookshare_dev`
- Username: `cookshare`
- Password: `cookshare_dev_password`
- Port: `5432`

Sample data includes:
- 5 sample users (including chefs and home cooks)
- 3 sample recipes with ratings and comments
- User follows and social interactions
- Recipe collections

## Hot Reload

### Frontend (Next.js)
- File changes in the project directory are automatically detected
- Browser will refresh automatically on save
- Fast Refresh preserves React component state

### Backend (Node.js)
- Uses nodemon for automatic server restart
- Changes to TypeScript/JavaScript files trigger restart
- Database schema changes require manual restart

## Volume Mounts

The following directories are mounted for hot reload:
- `.` → `/app` (entire project)
- Excluded: `node_modules`, `.next` (use container versions)

## Database Management

### Accessing the Database

**Via pgAdmin (Web Interface)**:
1. Go to http://localhost:5050
2. Login: `admin@cookshare.dev` / `admin`
3. Server is pre-configured as "CookShare Development"

**Via Command Line**:
```bash
# Connect to PostgreSQL container
./scripts/dev.sh shell postgres

# Run psql inside container
psql -U cookshare -d cookshare_dev
```

**From Host Machine**:
```bash
# If you have psql installed locally
psql -h localhost -p 5432 -U cookshare -d cookshare_dev
```

### Database Operations

**Reset Database**:
```bash
pnpm docker:reset
# WARNING: This destroys all data!
```

**Seed with Sample Data**:
```bash
pnpm docker:seed
```

**Manual SQL Execution**:
```bash
./scripts/dev.sh shell postgres
psql -U cookshare -d cookshare_dev -f /tmp/seed/seed.sql
```

## Redis Management

### Accessing Redis

**Via RedisInsight (Web Interface)**:
1. Go to http://localhost:8001
2. Add database: `redis://localhost:6379`

**Via Command Line**:
```bash
# Connect to Redis container
./scripts/dev.sh shell redis

# Run redis-cli inside container
redis-cli
```

## Networking

All services run on a custom Docker network `cookshare-dev-network`:
- Services can communicate using service names (e.g., `postgres`, `redis`)
- External access is available on mapped ports
- Network isolation from other Docker projects

## Troubleshooting

### Services Won't Start
```bash
# Check if Docker is running
docker --version

# Check service status
./scripts/dev.sh status

# View logs for specific service
./scripts/dev.sh logs web
./scripts/dev.sh logs postgres
```

### Port Conflicts
If you get port binding errors, check if these ports are already in use:
- 3000 (Web App)
- 3001 (API)
- 5432 (PostgreSQL)
- 6379 (Redis)
- 5050 (pgAdmin)
- 8001 (RedisInsight)

### Database Connection Issues
```bash
# Restart database service
docker-compose -f docker-compose.dev.yml restart postgres

# Check database logs
./scripts/dev.sh logs postgres

# Verify database is ready
./scripts/dev.sh shell postgres
pg_isready -U cookshare
```

### Hot Reload Not Working
1. Ensure file changes are being saved
2. Check container logs: `./scripts/dev.sh logs web`
3. Restart the web service: `docker-compose -f docker-compose.dev.yml restart web`
4. For Windows: Enable polling in environment variables (already configured)

### Performance Issues
- **Slow startup**: First run downloads images and installs dependencies
- **High CPU**: Webpack/Turbopack compilation during development
- **High memory**: Multiple services running simultaneously

### Clean Slate
If you encounter persistent issues:
```bash
# Stop everything and clean up
pnpm docker:clean

# Start fresh
pnpm docker:dev
```

## Production Differences

This development environment differs from production:
- Uses development images with dev dependencies
- Enables hot reload and file watching
- Uses simplified security settings
- Includes development tools (pgAdmin, RedisInsight)
- Uses unoptimized builds for faster compilation

For production deployment, use the production Docker Compose configuration.