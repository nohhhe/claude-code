# Suggested Commands for E2E Test Development

## Installation & Setup
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Test Execution
```bash
# Run all tests (default)
npm test

# UI mode for visual test debugging (RECOMMENDED for development)
npm run test:ui

# Run tests with browser window visible
npm run test:headed

# Debug mode with breakpoints
npm run test:debug

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome

# Run specific test file
npx playwright test tests/purchase-flow.e2e.test.ts
```

## Mock Server Management
```bash
# Start mock server manually (runs on http://localhost:3000)
npm start
```

## Reporting & Analysis
```bash
# Open HTML test report
npm run show-report
```

## Development & Debugging
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Reinstall Playwright browsers if needed
npx playwright install --force
```

## Playwright-specific Commands
```bash
# Generate new test
npx playwright codegen http://localhost:3000

# Run tests in specific mode
npx playwright test --headed --slow-mo=1000

# Run tests with trace
npx playwright test --trace=on
```