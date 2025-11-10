import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/CookShare/);
    
    // Check if main heading is visible (Korean content)
    await expect(page.getByRole('heading', { name: /당신의.*요리.*레시피를 공유하세요/i })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation elements - check header which contains nav
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if navigation links exist - be specific with exact name
    const homeLink = page.getByRole('link', { name: 'CookShare', exact: true });
    await expect(homeLink).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    
    // Check description meta tag
    const description = page.locator('meta[name="description"]');
    await expect(description).toBeAttached();
  });
});