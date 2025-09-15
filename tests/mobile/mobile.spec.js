const { test, expect, devices } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');

// Mobile test configurations
const mobileDevices = [
  devices['iPhone 12'],
  devices['iPad Pro'],
  devices['Pixel 5']
];

mobileDevices.forEach(device => {
  test.describe(`Mobile Tests - ${device.defaultBrowserType}`, () => {
    //test.use({ ...device });  

    test('should display mobile-friendly login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await page.goto('/');

      // Verify mobile viewport
      const viewport = page.viewportSize();
      expect(viewport.width).toBeLessThanOrEqual(768);

      // Check if login elements are visible and accessible
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();

      // Test touch interactions
      await loginPage.usernameInput.tap();
      await page.keyboard.type('standard_user');
      
      await loginPage.passwordInput.tap();
      await page.keyboard.type('secret_sauce');
      
      await loginPage.loginButton.tap();

      // Verify successful login on mobile
      await expect(page.locator('.title')).toContainText('Products');
    });

    test('should handle mobile navigation', async ({ page }) => {
      await page.goto('/');
      
      // Login first
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      // Test mobile menu if present
      const menuButton = page.locator('.bm-burger-button');
      if (await menuButton.isVisible()) {
        await menuButton.tap();
        
        // Check if menu items are visible
        await expect(page.locator('.bm-menu')).toBeVisible();
        
        // Test menu item interaction
        const logoutLink = page.locator('#logout_sidebar_link');
        if (await logoutLink.isVisible()) {
          await logoutLink.tap();
          await expect(page.locator('[data-test="login-button"]')).toBeVisible();
        }
      }
    });

    test('should display products in mobile layout', async ({ page }) => {
      await page.goto('/');
      
      // Login
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      // Check product grid adapts to mobile
      const products = page.locator('.inventory_item');
      await expect(products.first()).toBeVisible();

      // Verify product cards are properly sized for mobile
      const firstProduct = products.first();
      const boundingBox = await firstProduct.boundingBox();
      
      expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
      expect(boundingBox.width).toBeGreaterThan(0);
    });

    test('should handle mobile cart interactions', async ({ page }) => {
      await page.goto('/');
      
      // Login
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      // Add item to cart using tap
      const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
      await addToCartButton.tap();

      // Verify cart badge updates
      const cartBadge = page.locator('.shopping_cart_badge');
      await expect(cartBadge).toContainText('1');

      // Go to cart
      await page.locator('.shopping_cart_link').tap();
      
      // Verify cart page on mobile
      await expect(page.locator('.cart_item')).toBeVisible();
      
      // Test quantity interactions on mobile
      const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
      await removeButton.tap();
      
      // Verify item removed
      await expect(page.locator('.cart_item')).not.toBeVisible();
    });

    test('should handle mobile checkout flow', async ({ page }) => {
      await page.goto('/');
      
      // Login and add item
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').tap();
      await page.locator('.shopping_cart_link').tap();
      
      // Proceed to checkout
      await page.locator('[data-test="checkout"]').tap();
      
      // Fill mobile form - test virtual keyboard interactions
      await page.locator('[data-test="firstName"]').tap();
      await page.keyboard.type('John');
      
      await page.locator('[data-test="lastName"]').tap();
      await page.keyboard.type('Doe');
      
      await page.locator('[data-test="postalCode"]').tap();
      await page.keyboard.type('12345');
      
      // Continue checkout
      await page.locator('[data-test="continue"]').tap();
      
      // Verify checkout overview on mobile
      await expect(page.locator('.summary_info')).toBeVisible();
      
      // Complete purchase
      await page.locator('[data-test="finish"]').tap();
      
      // Verify success on mobile
      await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
    });

    test('should handle mobile orientation changes', async ({ page, browser }) => {
      // This test simulates orientation change
      await page.goto('/');
      
      // Start in portrait mode
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone portrait
      
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      
      // Verify layout in portrait
      await expect(page.locator('.inventory_list')).toBeVisible();
      
      // Switch to landscape mode
      await page.setViewportSize({ width: 812, height: 375 }); // iPhone landscape
      
      // Verify layout adapts to landscape
      await expect(page.locator('.inventory_list')).toBeVisible();
      
      // Check if products are still accessible
      const products = page.locator('.inventory_item');
      await expect(products.first()).toBeVisible();
    });
  });
});
