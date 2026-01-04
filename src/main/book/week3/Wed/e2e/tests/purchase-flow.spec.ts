import { test, expect, Page } from '@playwright/test';

// ============================================
// Page Object Models (POM)
// ============================================

class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async searchProduct(query: string) {
    await this.page.fill('#search', query);
    await this.page.press('#search', 'Enter');
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.page.locator('[data-testid="cart-badge"]').textContent() ?? '0';
  }

  async clickProductCard(productName: string) {
    await this.page.locator('.product-card', { hasText: productName }).click();
  }
}

class SearchResultsPage {
  constructor(private page: Page) {}

  async selectFirstProduct() {
    await this.page.locator('[data-testid="product-card"]').first().click();
  }

  async getSearchResultsCount(): Promise<number> {
    return await this.page.locator('[data-testid="product-card"]').count();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.locator('.header h1').textContent() ?? '';
  }
}

class ProductDetailPage {
  constructor(private page: Page) {}

  async addToCart() {
    await this.page.click('.add-to-cart');
  }

  async goToCart() {
    await this.page.click('.cart-link');
  }

  async getProductName(): Promise<string> {
    return await this.page.locator('.product-detail h1').textContent() ?? '';
  }

  async getPrice(): Promise<string> {
    return await this.page.locator('.price').textContent() ?? '';
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.page.locator('[data-testid="cart-badge"]').textContent() ?? '0';
  }
}

class CartPage {
  constructor(private page: Page) {}

  async applyDiscountCode(code: string) {
    await this.page.fill('[name="discountCode"]', code);
    await this.page.click('.apply-btn');
  }

  async getDiscountMessage(): Promise<string | null> {
    const element = this.page.locator('[data-testid="discount-message"]');
    if (await element.isVisible()) {
      return await element.textContent();
    }
    return null;
  }

  async getTotal(): Promise<string> {
    return await this.page.locator('#total').textContent() ?? '';
  }

  async proceedToCheckout() {
    await this.page.click('.checkout-btn');
  }
}

class CheckoutPage {
  constructor(private page: Page) {}

  async fillShippingInfo(info: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  }) {
    await this.page.fill('[name="fullName"]', info.fullName);
    await this.page.fill('[name="email"]', info.email);
    await this.page.fill('[name="address"]', info.address);
    await this.page.fill('[name="city"]', info.city);
    await this.page.fill('[name="zipCode"]', info.zipCode);
    await this.page.selectOption('[name="country"]', info.country);
  }

  async fillPaymentInfo(info: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  }) {
    await this.page.fill('[name="cardNumber"]', info.cardNumber);
    await this.page.fill('[name="cardName"]', info.cardName);
    await this.page.fill('[name="expiryDate"]', info.expiryDate);
    await this.page.fill('[name="cvv"]', info.cvv);
  }

  async placeOrder() {
    await this.page.click('.place-order-btn');
  }
}

class OrderConfirmationPage {
  constructor(private page: Page) {}

  async getOrderNumber(): Promise<string> {
    return await this.page.locator('[data-testid="order-number"]').textContent() ?? '';
  }

  async isOrderConfirmed(): Promise<boolean> {
    const heading = await this.page.locator('h1').textContent();
    return heading?.includes('Order Confirmed') ?? false;
  }

  async continueShopping() {
    await this.page.click('.home-btn');
  }
}

// ============================================
// Test Data
// ============================================

const testShippingInfo = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  address: '123 Main Street',
  city: 'New York',
  zipCode: '10001',
  country: 'US',
};

const testPaymentInfo = {
  cardNumber: '4111111111111111',
  cardName: 'John Doe',
  expiryDate: '12/25',
  cvv: '123',
};

// ============================================
// E2E Tests
// ============================================

test.describe('E-Commerce Purchase Flow', () => {
  test.beforeEach(async ({ request }) => {
    // Reset cart before each test
    await request.post('/api/reset');
  });

  test('complete purchase flow from homepage to order confirmation', async ({ page }) => {
    // Page Objects
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);

    // Step 1: Visit Homepage
    await test.step('Visit homepage', async () => {
      await homePage.navigate();
      await expect(page).toHaveTitle('E-Commerce Store');
      await expect(page.locator('h1')).toContainText('E-Commerce Store');
    });

    // Step 2: Search for product
    await test.step('Search for product', async () => {
      await homePage.searchProduct('laptop');
      await expect(page).toHaveURL(/\/search\?q=laptop/);
      const pageTitle = await searchResultsPage.getPageTitle();
      expect(pageTitle).toContain('laptop');
    });

    // Step 3: Select product from search results
    await test.step('Select product from search results', async () => {
      const resultsCount = await searchResultsPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
      await searchResultsPage.selectFirstProduct();
      await expect(page).toHaveURL(/\/products\/\d+/);
    });

    // Step 4: Add product to cart
    await test.step('Add product to cart', async () => {
      const productName = await productDetailPage.getProductName();
      expect(productName).toBeTruthy();

      await productDetailPage.addToCart();
      await page.waitForLoadState('networkidle');

      const cartCount = await productDetailPage.getCartBadgeCount();
      expect(parseInt(cartCount)).toBeGreaterThan(0);
    });

    // Step 5: Go to cart and proceed to checkout
    await test.step('Proceed to checkout', async () => {
      await productDetailPage.goToCart();
      await expect(page).toHaveURL('/cart');
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL('/checkout');
    });

    // Step 6: Fill payment information
    await test.step('Fill shipping and payment information', async () => {
      await checkoutPage.fillShippingInfo(testShippingInfo);
      await checkoutPage.fillPaymentInfo(testPaymentInfo);
    });

    // Step 7: Place order and verify confirmation
    await test.step('Place order and verify confirmation', async () => {
      await checkoutPage.placeOrder();
      await expect(page).toHaveURL('/order-confirmation');

      const isConfirmed = await orderConfirmationPage.isOrderConfirmed();
      expect(isConfirmed).toBe(true);

      const orderNumber = await orderConfirmationPage.getOrderNumber();
      expect(orderNumber).toMatch(/^ORDER-\d+$/);
    });
  });

  test('purchase flow with discount code', async ({ page }) => {
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);

    // Navigate directly to product
    await homePage.navigate();
    await homePage.clickProductCard('Gaming Laptop');

    // Add to cart
    await productDetailPage.addToCart();
    await page.waitForLoadState('networkidle');
    await productDetailPage.goToCart();

    // Apply discount code
    await cartPage.applyDiscountCode('SAVE10');
    const discountMessage = await cartPage.getDiscountMessage();
    expect(discountMessage).toContain('10% discount');

    const total = await cartPage.getTotal();
    expect(total).toBe('$900');

    // Complete purchase
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(testShippingInfo);
    await checkoutPage.fillPaymentInfo(testPaymentInfo);
    await checkoutPage.placeOrder();

    const isConfirmed = await orderConfirmationPage.isOrderConfirmed();
    expect(isConfirmed).toBe(true);
  });

  test('homepage displays featured products', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();

    // Check featured products are displayed
    await expect(page.locator('.product-card')).toHaveCount(3);
    await expect(page.locator('.product-card').first()).toContainText('Gaming Laptop');
    await expect(page.locator('.product-card').nth(1)).toContainText('Gaming Mouse');
    await expect(page.locator('.product-card').nth(2)).toContainText('Mechanical Keyboard');
  });

  test('cart badge updates after adding item', async ({ page }) => {
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);

    await homePage.navigate();

    // Initial cart should be empty
    const initialCount = await homePage.getCartBadgeCount();
    expect(initialCount).toBe('0');

    // Add item to cart
    await homePage.clickProductCard('Gaming Laptop');
    await productDetailPage.addToCart();
    await page.waitForLoadState('networkidle');

    // Cart badge should update
    const updatedCount = await productDetailPage.getCartBadgeCount();
    expect(updatedCount).toBe('1');
  });

  test('checkout form validation', async ({ page }) => {
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    // Navigate through flow
    await homePage.navigate();
    await homePage.clickProductCard('Gaming Laptop');
    await productDetailPage.addToCart();
    await page.waitForLoadState('networkidle');
    await productDetailPage.goToCart();
    await cartPage.proceedToCheckout();

    // Try to submit empty form
    await page.click('.place-order-btn');

    // Should stay on checkout page (form validation)
    await expect(page).toHaveURL('/checkout');

    // Check required field validation
    const fullNameInput = page.locator('[name="fullName"]');
    await expect(fullNameInput).toHaveAttribute('required', '');
  });

  test('can navigate back from checkout to cart', async ({ page }) => {
    await page.goto('/checkout');
    await page.click('.back-btn');
    await expect(page).toHaveURL('/cart');
  });

  test('order number is unique for each order', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);

    // First order
    await page.goto('/checkout');
    await checkoutPage.fillShippingInfo(testShippingInfo);
    await checkoutPage.fillPaymentInfo(testPaymentInfo);
    await checkoutPage.placeOrder();
    const firstOrderNumber = await orderConfirmationPage.getOrderNumber();

    // Second order
    await page.goto('/checkout');
    await checkoutPage.fillShippingInfo(testShippingInfo);
    await checkoutPage.fillPaymentInfo(testPaymentInfo);
    await checkoutPage.placeOrder();
    const secondOrderNumber = await orderConfirmationPage.getOrderNumber();

    // Order numbers should be different
    expect(firstOrderNumber).not.toBe(secondOrderNumber);
  });
});

test.describe('Search Functionality', () => {
  test('search returns relevant results', async ({ page }) => {
    await page.goto('/');
    await page.fill('#search', 'laptop');
    await page.press('#search', 'Enter');

    await expect(page).toHaveURL(/\/search\?q=laptop/);
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
  });

  test('search results page shows query in title', async ({ page }) => {
    await page.goto('/search?q=gaming');
    await expect(page.locator('.header h1')).toContainText('gaming');
  });
});

test.describe('Product Detail Page', () => {
  test('displays product information correctly', async ({ page }) => {
    await page.goto('/products/1');

    await expect(page.locator('.product-detail h1')).toContainText('Gaming laptop');
    await expect(page.locator('.price')).toContainText('$999');
    await expect(page.locator('.add-to-cart')).toBeEnabled();
  });

  test('out of stock product shows disabled add to cart button', async ({ page }) => {
    await page.goto('/products/out-of-stock-item');

    await expect(page.locator('[data-testid="stock-status"]')).toContainText('Out of Stock');
    await expect(page.locator('.add-to-cart')).toBeDisabled();
  });
});

test.describe('Cart Page', () => {
  test('invalid discount code does not apply discount', async ({ page }) => {
    await page.goto('/cart');

    await page.fill('[name="discountCode"]', 'INVALID');
    await page.click('.apply-btn');

    const discountMessage = page.locator('[data-testid="discount-message"]');
    await expect(discountMessage).not.toBeVisible();

    const total = await page.locator('#total').textContent();
    expect(total).toBe('$999');
  });

  test('valid discount code SAVE10 applies 10% discount', async ({ page }) => {
    await page.goto('/cart');

    await page.fill('[name="discountCode"]', 'SAVE10');
    await page.click('.apply-btn');

    await expect(page.locator('[data-testid="discount-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="discount-message"]')).toContainText('10% discount');

    const total = await page.locator('#total').textContent();
    expect(total).toBe('$900');
  });
});
