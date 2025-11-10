# Legacy OrderService - Test Suite

This project contains a comprehensive test suite for the legacy OrderService application.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm or yarn package manager

## Installation

Install dependencies before running tests:

```bash
npm install
```

## Test Commands

### Basic Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (automatically re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Categories

```bash
# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only edge case tests
npm run test:edge
```

## Test Structure

```
tests/
├── setup.js                           # Global test setup
├── orderservice.test-helper.js        # Test utilities and helpers
├── unit/
│   └── orderservice.unit.test.js      # Unit tests
├── integration/
│   └── orderservice.integration.test.js # Integration tests
└── edge-cases/
    └── orderservice.edge.test.js      # Edge case tests
```

## Coverage Requirements

The test suite enforces the following coverage thresholds:
- **Branches**: 90%
- **Functions**: 90% 
- **Lines**: 90%
- **Statements**: 90%

## Coverage Reports

After running `npm run test:coverage`, coverage reports are generated in multiple formats:
- **Terminal output**: Summary displayed in console
- **HTML report**: Open `coverage/lcov-report/index.html` in browser for detailed view
- **LCOV format**: Available at `coverage/lcov.info` for CI/CD integration

## Test Environment

- **Test Framework**: Jest
- **Environment**: jsdom (for DOM manipulation testing)
- **Dependencies**: 
  - jQuery 1.12.4 (legacy compatibility)
  - Moment.js 2.29.4 (date handling)
  - Testing Library Jest DOM (enhanced assertions)

## Running Specific Tests

```bash
# Run tests matching a pattern
npx jest --testNamePattern="should calculate total"

# Run tests in a specific file
npx jest tests/unit/orderservice.unit.test.js

# Run tests with verbose output
npx jest --verbose
```

## Development Workflow

1. **Write tests first** (TDD approach recommended)
2. **Run tests frequently** using `npm run test:watch`
3. **Check coverage** before committing with `npm run test:coverage`
4. **Ensure all tests pass** before pushing changes

## Troubleshooting

### Common Issues

**Tests failing due to jQuery dependency:**
- Ensure jQuery is properly loaded in test setup
- Check `tests/setup.js` for proper DOM environment configuration

**Coverage threshold failures:**
- Add tests for uncovered code paths
- Remove dead code or exclude from coverage if intentionally untested

**Jest configuration issues:**
- Check `package.json` jest configuration section
- Ensure test files follow naming convention `*.test.js`

### Debug Mode

Run tests with debugging enabled:
```bash
# Run with debugging output
npm test -- --verbose --no-cache

# Debug specific test file
node --inspect-brk node_modules/.bin/jest tests/unit/orderservice.unit.test.js
```

## CI/CD Integration

For continuous integration, use:
```bash
npm run test:coverage
```

This will run all tests and generate coverage reports suitable for CI/CD pipelines.