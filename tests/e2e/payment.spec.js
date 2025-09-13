const { test, expect } = require('@playwright/test');
const HomePage = require('../../pages/HomePage');
const CartPage = require('../../pages/CartPage');

test.describe('Payment Tests', () => {
  let homePage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    // Login before each test
    await page.goto('/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
  });

  test('should display correct item prices', async ({ page }) => {
    // Verify product prices are displayed
    const products = await homePage.getAllProducts();
    
    for (const product of products) {
      const priceText = await product.locator('.inventory_item_price').textContent();
      expect(priceText).toMatch(/\$\d+\.\d{2}/); // Price format $XX.XX
    }
  });

  test('should calculate cart total correctly', async ({ page }) => {
    // Add multiple items with known prices
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.addProductToCart('sauce-labs-bike-light');
    
    // Go to cart
    await homePage.goToCart();
    
    // Get individual item prices
    const itemPrices = await cartPage.getItemPrices();
    const expectedSubtotal = itemPrices.reduce((sum, price) => sum + price, 0);
    
    // Proceed to checkout to see totals
    await cartPage.proceedToCheckout();
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Verify subtotal matches
    const displayedSubtotal = await page.locator('.summary_subtotal_label').textContent();
    const subtotalValue = parseFloat(displayedSubtotal.replace('Item total: $', ''));
    
    expect(Math.abs(subtotalValue - expectedSubtotal)).toBeLessThan(0.01);
  });

  test('should apply tax correctly', async ({ page }) => {
    // Add item to cart
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill checkout info
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Get tax information
    const taxLabel = await page.locator('.summary_tax_label').textContent();
    const taxAmount = parseFloat(taxLabel.replace('Tax: $', ''));
    
    // Tax should be a positive number
    expect(taxAmount).toBeGreaterThan(0);
    
    // Tax should be reasonable (between 1% and 15% of subtotal)
    const subtotalLabel = await page.locator('.summary_subtotal_label').textContent();
    const subtotalAmount = parseFloat(subtotalLabel.replace('Item total: $', ''));
    const taxRate = taxAmount / subtotalAmount;
    
    expect(taxRate).toBeGreaterThan(0.01);
    expect(taxRate).toBeLessThan(0.15);
  });

  test('should show final total correctly', async ({ page }) => {
    // Add items to cart
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.addProductToCart('sauce-labs-bike-light');
    
    // Complete checkout process
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Get all price components
    const subtotalLabel = await page.locator('.summary_subtotal_label').textContent();
    const taxLabel = await page.locator('.summary_tax_label').textContent();
    const totalLabel = await page.locator('.summary_total_label').textContent();
    
    const subtotal = parseFloat(subtotalLabel.replace('Item total: $', ''));
    const tax = parseFloat(taxLabel.replace('Tax: $', ''));
    const total = parseFloat(totalLabel.replace('Total: $', ''));
    
    // Verify total = subtotal + tax
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);
  });

  test('should handle price display for different products', async ({ page }) => {
    // Test that all products have valid price formats
    const productPrices = await page.locator('.inventory_item_price').all();
    
    for (const priceElement of productPrices) {
      const priceText = await priceElement.textContent();
      
      // Verify price format
      expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
      
      // Verify price is a reasonable amount
      const priceValue = parseFloat(priceText.replace('$', ''));
      expect(priceValue).toBeGreaterThan(0);
      expect(priceValue).toBeLessThan(1000); // Reasonable upper limit
    }
  });
});
