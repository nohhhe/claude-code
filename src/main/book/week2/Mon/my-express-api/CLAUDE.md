# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is an Express.js API project that's part of the Claude Code 실용 가이드북 (Practical Guidebook) examples, specifically designed for Week 1 Day 4's full-stack web service tutorial. The project demonstrates how to build a simple but complete Express API using Claude Code.

## Development Commands

### Initial Setup
```bash
# Install dependencies (when package.json is updated)
npm install

# Install Express and basic dependencies
npm install express cors dotenv
npm install -D nodemon @types/node
```

### Running the Application
```bash
# Development mode with hot reload (after adding to package.json scripts)
npm run dev

# Production mode
npm start

# Run tests (when test framework is added)
npm test
```

## Project Architecture

This Express API follows a standard MVC-like pattern suitable for small to medium applications:

```
src/
├── routes/          # API route definitions
├── controllers/     # Request handlers and business logic
├── middleware/      # Custom middleware (auth, validation, etc.)
├── models/         # Data models (if database is added)
├── utils/          # Helper functions and utilities
└── index.js        # Main application entry point
```

## Key Development Patterns

### API Structure
- RESTful API design with clear resource-based endpoints
- Middleware for cross-cutting concerns (CORS, authentication, error handling)
- Environment-based configuration using dotenv
- JSON request/response format as default

### Error Handling
- Centralized error handling middleware
- Consistent error response format: `{ error: { message, code, details } }`
- Proper HTTP status codes for different error types

### Best Practices for this Project
- Use async/await for asynchronous operations
- Implement input validation for all endpoints
- Add proper CORS configuration for production
- Keep controllers thin - business logic in separate service layers if needed
- Use environment variables for configuration (PORT, API_KEYS, etc.)

## Common Tasks

### Adding a New Endpoint
1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Register route in main `index.js`
4. Add any necessary middleware
5. Test with curl or Postman

### Connecting a Database
For MongoDB: `npm install mongoose`
For PostgreSQL: `npm install pg`
For MySQL: `npm install mysql2`

### Adding Authentication
Consider using: `npm install jsonwebtoken bcrypt`
Or for OAuth: `npm install passport passport-jwt`

## Integration with Book Examples

This project serves as a teaching example for:
- Basic Express.js setup and configuration
- RESTful API design principles
- Middleware concepts
- Integration with frontend applications
- Deployment preparation for cloud platforms

When extending this project for book examples, maintain simplicity while demonstrating core concepts clearly. Each feature addition should be educational and build upon previous concepts.

## Notes for Claude Code Book Context

Since this is part of the Claude Code guidebook:
- Keep code examples concise and well-commented in Korean
- Focus on practical, immediately usable patterns
- Demonstrate Claude Code capabilities through iterative development
- Show how to leverage Claude Code for API development tasks like:
  - Generating boilerplate code
  - Creating CRUD operations
  - Setting up middleware
  - Writing tests
  - Preparing for deployment