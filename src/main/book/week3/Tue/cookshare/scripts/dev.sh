#!/bin/bash

# CookShare Development Environment Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    print_status "Starting CookShare development environment..."
    check_docker
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local from .env.development..."
        cp .env.development .env.local
        print_warning "Please review and update .env.local with your local settings"
    fi
    
    # Start services
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - Web App: http://localhost:3000"
    echo "  - API: http://localhost:3001"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
    echo "  - pgAdmin: http://localhost:5050 (admin@cookshare.dev / admin)"
    echo "  - RedisInsight: http://localhost:8001"
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping CookShare development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting CookShare development environment..."
    stop_dev
    start_dev
}

# Function to view logs
logs_dev() {
    if [ -n "$2" ]; then
        print_status "Showing logs for service: $2"
        docker-compose -f docker-compose.dev.yml logs -f "$2"
    else
        print_status "Showing logs for all services..."
        docker-compose -f docker-compose.dev.yml logs -f
    fi
}

# Function to run database migrations
migrate_dev() {
    print_status "Running database migrations..."
    docker-compose -f docker-compose.dev.yml exec web pnpm run migrate
    print_success "Database migrations completed!"
}

# Function to seed database
seed_dev() {
    print_status "Seeding database with sample data..."
    docker-compose -f docker-compose.dev.yml exec postgres psql -U cookshare -d cookshare_dev -f /tmp/seed/seed.sql
    print_success "Database seeded with sample data!"
}

# Function to reset database
reset_db() {
    print_warning "This will destroy all data in the development database!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.dev.yml up -d postgres redis
        sleep 10
        seed_dev
        docker-compose -f docker-compose.dev.yml up -d
        print_success "Database reset completed!"
    else
        print_status "Database reset cancelled."
    fi
}

# Function to open shell in container
shell_dev() {
    if [ -n "$2" ]; then
        print_status "Opening shell in $2 container..."
        docker-compose -f docker-compose.dev.yml exec "$2" sh
    else
        print_status "Opening shell in web container..."
        docker-compose -f docker-compose.dev.yml exec web sh
    fi
}

# Function to run tests
test_dev() {
    print_status "Running tests in development environment..."
    docker-compose -f docker-compose.dev.yml exec web pnpm test
}

# Function to show status
status_dev() {
    print_status "Development environment status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to clean up
clean_dev() {
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up development environment..."
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        print_success "Development environment cleaned!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "CookShare Development Environment Management"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start     Start the development environment"
    echo "  stop      Stop the development environment"
    echo "  restart   Restart the development environment"
    echo "  logs      Show logs (optional: specify service name)"
    echo "  migrate   Run database migrations"
    echo "  seed      Seed database with sample data"
    echo "  reset-db  Reset database (destroys all data)"
    echo "  shell     Open shell in container (optional: specify service name)"
    echo "  test      Run tests"
    echo "  status    Show status of services"
    echo "  clean     Clean up all containers and volumes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs web"
    echo "  $0 shell postgres"
    echo "  $0 reset-db"
}

# Main script logic
case "$1" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    logs)
        logs_dev "$@"
        ;;
    migrate)
        migrate_dev
        ;;
    seed)
        seed_dev
        ;;
    reset-db)
        reset_db
        ;;
    shell)
        shell_dev "$@"
        ;;
    test)
        test_dev
        ;;
    status)
        status_dev
        ;;
    clean)
        clean_dev
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac