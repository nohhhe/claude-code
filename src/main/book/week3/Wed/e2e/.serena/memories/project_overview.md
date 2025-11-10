# E2E Test Suite Project Overview

## Project Purpose
This is an End-to-End (E2E) test suite for an e-commerce website using Playwright. The project includes a mock server that simulates an e-commerce store with complete purchase flow functionality.

## Tech Stack
- **Testing Framework**: Playwright (@playwright/test v1.40.0)
- **Mock Server**: Express.js (v4.21.2)
- **Language**: TypeScript/JavaScript
- **Node.js**: Required for running tests and mock server

## Project Structure
```
e2e/
├── tests/
│   └── purchase-flow.e2e.test.ts  # Main E2E test suite
├── mock-server.js                 # Express mock server
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies and scripts
├── README.md                      # Documentation
└── node_modules/                  # Dependencies
```

## Key Features
- Complete e-commerce purchase flow simulation
- Multi-browser testing (Chromium, Firefox, WebKit, Mobile Chrome)
- Visual UI with CSS styling for better test visibility
- Mock API endpoints for cart management
- Order confirmation with unique order numbers
- Discount code functionality
- Out-of-stock product handling