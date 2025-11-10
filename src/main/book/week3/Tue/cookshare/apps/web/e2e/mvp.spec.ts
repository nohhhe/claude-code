import { test, expect } from '@playwright/test';

test.describe('CookShare MVP', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    // Check if the page title contains CookShare
    await expect(page).toHaveTitle(/CookShare/);
    
    // Check if main heading is visible (use specific selector)
    await expect(page.getByRole('heading', { name: /Share Your Culinary/i })).toBeVisible();
    
    // Check if hero section is present
    await expect(page.locator('text=Culinary')).toBeVisible();
    await expect(page.locator('text=Masterpieces')).toBeVisible();
    
    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Recipes')).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Sign Up')).toBeVisible();
  });

  test('navigation to recipes page works', async ({ page }) => {
    // Click on Recipes link in navigation
    await page.click('nav >> text=Recipes');
    
    // Should be on recipes page
    await expect(page).toHaveURL('/recipes');
    await expect(page.locator('h1')).toContainText('All Recipes');
    
    // Check if search functionality is present
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check if filter button is present
    await expect(page.locator('text=Filters')).toBeVisible();
  });

  test('recipe cards are displayed on recipes page', async ({ page }) => {
    await page.goto('/recipes');
    
    // Wait for recipe cards to load
    await page.waitForSelector('[data-testid="recipe-card"], .grid > div:has(h3)', { timeout: 10000 });
    
    // Check if recipe cards exist
    const recipeCards = page.locator('.grid > div:has(h3)');
    await expect(recipeCards).toHaveCount(3); // We have 3 mock recipes
    
    // Check if first recipe card has required elements
    const firstCard = recipeCards.first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Recipe title
    await expect(firstCard.locator('text=View Recipe')).toBeVisible(); // View button
  });

  test('recipe detail page works', async ({ page }) => {
    await page.goto('/recipes');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find and click the first "View Recipe" button
    const viewRecipeButton = page.locator('text=View Recipe').first();
    await expect(viewRecipeButton).toBeVisible();
    await viewRecipeButton.click();
    
    // Should be on a recipe detail page
    await expect(page).toHaveURL(/\/recipes\/\d+/);
    
    // Check if recipe detail elements are present
    await expect(page.locator('h1')).toBeVisible(); // Recipe title
    await expect(page.locator('text=Instructions')).toBeVisible();
    await expect(page.locator('text=Ingredients')).toBeVisible();
    
    // Check if back button works
    await page.click('text=Back to Recipes');
    await expect(page).toHaveURL('/recipes');
  });

  test('featured recipes are shown on homepage', async ({ page }) => {
    // Check if featured recipes section exists
    await expect(page.locator('text=Featured Recipes')).toBeVisible();
    
    // Check if recipe cards are present in featured section
    const featuredSection = page.locator('section:has-text("Featured Recipes")');
    const recipeCards = featuredSection.locator('.grid > div');
    await expect(recipeCards).toHaveCount(2); // We have 2 featured recipes
    
    // Check if at least one recipe has a "View Recipe" button
    await expect(featuredSection.locator('text=View Recipe').first()).toBeVisible();
  });

  test('hero section call-to-action buttons work', async ({ page }) => {
    // Check if Explore Recipes button works
    const exploreButton = page.locator('text=Explore Recipes');
    await expect(exploreButton).toBeVisible();
    await exploreButton.click();
    await expect(page).toHaveURL('/recipes');
    
    // Go back to homepage
    await page.goto('/');
    
    // Check if Share a Recipe button exists (even if it doesn't work yet)
    const shareButton = page.locator('text=Share a Recipe');
    await expect(shareButton).toBeVisible();
  });

  test('footer contains important links', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check if footer is visible
    await expect(page.locator('footer')).toBeVisible();
    
    // Check if footer contains CookShare branding - use heading for specificity
    await expect(page.locator('footer h3:has-text("CookShare")')).toBeVisible();
    
    // Check if footer contains some expected links (Korean text)
    await expect(page.locator('footer >> text=도움말 센터')).toBeVisible();
    await expect(page.locator('footer >> text=개인정보 처리방침')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page
    await page.reload();
    
    // Check if page still loads
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Check if navigation is still functional - use header link specifically
    await expect(page.locator('header a:has-text("CookShare")')).toBeVisible();
    
    // Test recipes page on mobile
    await page.goto('/recipes');
    await expect(page.locator('h1')).toContainText('All Recipes');
    
    // Check if search input is visible on mobile
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('recipe difficulty badges are displayed', async ({ page }) => {
    await page.goto('/recipes');
    
    // Wait for cards to load
    await page.waitForSelector('.grid > div:has(h3)', { timeout: 10000 });
    
    // Check if difficulty badges exist
    const difficultyBadges = page.locator('text=hard, text=medium, text=easy').first();
    // At least one difficulty badge should be visible
    const badges = page.locator('[class*="badge"], [class*="Badge"]');
    await expect(badges.first()).toBeVisible();
  });

  test('recipe metadata is displayed correctly', async ({ page }) => {
    await page.goto('/recipes/1'); // Go directly to first recipe
    
    // Check if time information is displayed
    await expect(page.locator('text=Prep:')).toBeVisible();
    await expect(page.locator('text=Cook:')).toBeVisible();
    
    // Check if servings information is displayed
    await expect(page.locator('text=servings')).toBeVisible();
    
    // Check if rating is displayed
    await expect(page.locator('text=reviews')).toBeVisible();
  });

  test('page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check if main content is visible
    await expect(page.locator('h1').first()).toBeVisible();
  });
});