# Code Style and Conventions

## Test File Structure
- Test files use `.e2e.test.ts` extension
- Located in `tests/` directory
- Use `test.describe()` blocks for grouping related tests
- Use `test.beforeEach()` for setup that runs before each test

## Playwright Testing Conventions
```typescript
// Import pattern
import { test, expect } from '@playwright/test';

// Test structure
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## CSS Selectors and Data Attributes
- Use `data-testid` attributes for test-specific selectors
- Prefer semantic selectors when possible (getByRole, getByPlaceholder)
- Examples:
  ```typescript
  page.getByRole('button', { name: 'Add to Cart' })
  page.getByPlaceholder('Search products...')
  page.locator('[data-testid="cart-badge"]')
  ```

## Mock Server Conventions
- Use Express.js for mock server
- Serve HTML with inline CSS for visual testing
- Include proper semantic HTML structure
- Reset state between tests using `/api/reset` endpoint
- Use memory-based state management for cart operations

## File Naming
- Test files: `feature-name.e2e.test.ts`
- Mock server: `mock-server.js`
- Configuration: `playwright.config.ts`

## HTML/CSS Styling for Tests
- Include visual styling for better UI mode testing
- Use semantic HTML elements
- Include hover effects and visual feedback
- Use proper form elements with names/placeholders
- Include responsive design considerations