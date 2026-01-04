import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

// ============================================
// Percy Visual Regression Tests
// ============================================

test.describe('Percy Visual Regression Tests', () => {

  // ============================================
  // Homepage Tests
  // ============================================

  test.describe('Homepage', () => {
    test('captures homepage in default state', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Homepage - Default');
    });

    test('captures homepage with hover states', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Hover over the first card
      await page.locator('.card').first().hover();
      await percySnapshot(page, 'Homepage - Card Hover State');
    });
  });

  // ============================================
  // Dashboard Page Tests
  // ============================================

  test.describe('Dashboard', () => {
    test('captures dashboard overview', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Dashboard - Overview');
    });

    test('captures dashboard metrics section', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Focus on metrics section
      const metricsSection = page.locator('.metricsSection');
      if (await metricsSection.isVisible()) {
        await percySnapshot(page, 'Dashboard - Metrics Section', {
          scope: '.metricsSection',
        });
      }
    });

    test('captures dashboard charts section', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Dashboard - Charts Section');
    });
  });

  // ============================================
  // Product List Page Tests
  // ============================================

  test.describe('Product List', () => {
    test('captures product list page', async ({ page }) => {
      await page.goto('/product-list');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Product List - Default View');
    });

    test('captures product list with loading complete', async ({ page }) => {
      await page.goto('/product-list');

      // Wait for products to load
      await page.waitForSelector('[class*="productCard"]', { timeout: 10000 }).catch(() => {});
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Product List - Loaded');
    });
  });

  // ============================================
  // Form Page Tests
  // ============================================

  test.describe('Form Page', () => {
    test('captures empty form state', async ({ page }) => {
      await page.goto('/form');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Form - Empty State');
    });

    test('captures form with filled data', async ({ page }) => {
      await page.goto('/form');
      await page.waitForLoadState('networkidle');

      // Fill form fields
      await page.fill('input[name="name"], input[type="text"]', 'John Doe');
      await page.fill('input[name="email"], input[type="email"]', 'john@example.com');

      // Try to fill other common form fields
      const phoneInput = page.locator('input[name="phone"], input[type="tel"]');
      if (await phoneInput.count() > 0) {
        await phoneInput.first().fill('010-1234-5678');
      }

      const textareaElement = page.locator('textarea');
      if (await textareaElement.count() > 0) {
        await textareaElement.first().fill('This is a test message for visual regression testing.');
      }

      await percySnapshot(page, 'Form - Filled State');
    });

    test('captures form with validation errors', async ({ page }) => {
      await page.goto('/form');
      await page.waitForLoadState('networkidle');

      // Try to submit empty form to trigger validation
      const submitButton = page.locator('button[type="submit"], input[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        await page.waitForTimeout(500); // Wait for validation messages
        await percySnapshot(page, 'Form - Validation Errors');
      }
    });
  });

  // ============================================
  // Modal Example Page Tests
  // ============================================

  test.describe('Modal Example', () => {
    test('captures modal page without modal', async ({ page }) => {
      await page.goto('/modal-example');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Modal Page - Closed State');
    });

    test('captures modal in open state', async ({ page }) => {
      await page.goto('/modal-example');
      await page.waitForLoadState('networkidle');

      // Find and click modal trigger button
      const modalTrigger = page.locator('button:has-text("모달"), button:has-text("Modal"), button:has-text("열기"), button:has-text("Open")');
      if (await modalTrigger.count() > 0) {
        await modalTrigger.first().click();
        await page.waitForTimeout(500); // Wait for modal animation

        await percySnapshot(page, 'Modal Page - Open State');
      }
    });
  });

  // ============================================
  // Theme Tests (Light/Dark Mode)
  // ============================================

  test.describe('Theme Variations', () => {
    test('captures homepage in light mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Ensure light mode
      await page.emulateMedia({ colorScheme: 'light' });
      await percySnapshot(page, 'Homepage - Light Mode');
    });

    test('captures homepage in dark mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Switch to dark mode
      await page.emulateMedia({ colorScheme: 'dark' });

      // Click theme toggle if available
      const themeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("Theme"), button:has-text("Dark")');
      if (await themeToggle.count() > 0) {
        await themeToggle.first().click();
        await page.waitForTimeout(300);
      }

      await percySnapshot(page, 'Homepage - Dark Mode');
    });

    test('captures dashboard in dark mode', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await page.emulateMedia({ colorScheme: 'dark' });
      await percySnapshot(page, 'Dashboard - Dark Mode');
    });
  });

  // ============================================
  // Responsive Tests
  // ============================================

  test.describe('Responsive Layouts', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
      { name: 'Large Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`captures homepage at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await percySnapshot(page, `Homepage - ${viewport.name}`, {
          widths: [viewport.width],
        });
      });

      test(`captures dashboard at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        await percySnapshot(page, `Dashboard - ${viewport.name}`, {
          widths: [viewport.width],
        });
      });
    }
  });

  // ============================================
  // Full Page Screenshots
  // ============================================

  test.describe('Full Page Screenshots', () => {
    test('captures full homepage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Homepage - Full Page', {
        fullPage: true,
      });
    });

    test('captures full dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Dashboard - Full Page', {
        fullPage: true,
      });
    });

    test('captures full product list', async ({ page }) => {
      await page.goto('/product-list');
      await page.waitForLoadState('networkidle');

      await percySnapshot(page, 'Product List - Full Page', {
        fullPage: true,
      });
    });
  });

  // ============================================
  // Critical User Flows
  // ============================================

  test.describe('Critical User Flows', () => {
    test('captures navigation flow', async ({ page }) => {
      // Start at homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await percySnapshot(page, 'Flow - Step 1: Homepage');

      // Navigate to product list
      const productLink = page.locator('a[href="/product-list"]');
      if (await productLink.count() > 0) {
        await productLink.first().click();
        await page.waitForLoadState('networkidle');
        await percySnapshot(page, 'Flow - Step 2: Product List');
      }

      // Navigate to dashboard
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await percySnapshot(page, 'Flow - Step 3: Dashboard');
    });
  });
});

// ============================================
// Component-Level Visual Tests
// ============================================

test.describe('Component Visual Tests', () => {
  test('captures header component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header').first();
    if (await header.isVisible()) {
      await percySnapshot(page, 'Component - Header', {
        scope: 'header',
      });
    }
  });

  test('captures footer component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer').first();
    if (await footer.isVisible()) {
      await percySnapshot(page, 'Component - Footer', {
        scope: 'footer',
      });
    }
  });

  test('captures card components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cards = page.locator('.card, [class*="card"]');
    if (await cards.count() > 0) {
      await percySnapshot(page, 'Component - Cards');
    }
  });
});
