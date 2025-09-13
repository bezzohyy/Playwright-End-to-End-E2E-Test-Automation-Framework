const { test, expect } = require('@playwright/test');
const HomePage = require('../../pages/HomePage');
const CartPage = require('../../pages/CartPage');
const CheckoutPage = require('../../pages/CheckoutPage');
const TestDataGenerator = require('../../src/utils/testDataGenerator');

test.describe('Checkout Flow Tests', () => {
  let homePage;
  let cartPage;
  let checkoutPage;
  let testDataGenerator;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    testDataGenerator = new TestDataGenerator();

    // Login before each test
    await page.goto('/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    
    // Verify we're on the inventory page
    await expect(page.locator('.title')).toContainText('Products');
  });

  test('should complete full checkout process', async ({ page }) => {
    // Add items to cart
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.addProductToCart('sauce-labs-bike-light');

    // Go to cart
    await homePage.goToCart();

    // Verify cart items
    await expect(cartPage.cartItems).toHaveCount(2);

    // Proceed to checkout
    await cartPage.proceedToCheckout();

    // Fill checkout information
    const userData = testDataGenerator.generateUser();
    await checkoutPage.fillCheckoutInformation(
      userData.firstName,
      userData.lastName,
      userData.address.zipCode
    );

    // Continue to overview
    await checkoutPage.continueToOverview();

    // Verify checkout overview
    await expect(checkoutPage.checkoutSummary).toBeVisible();
    
    // Complete checkout
    await checkoutPage.finishCheckout();

    // Verify success
    await expect(checkoutPage.successMessage).toContainText('Thank you for your order!');
    await expect(checkoutPage.successMessage).toBeVisible();
  });

  test('should show error when required fields are empty', async ({ page }) => {
    // Add item to cart and proceed to checkout
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.goToCart();
    await cartPage.proceedToCheckout();

    // Try to continue without filling required fields
    await checkoutPage.continueToOverview();

    // Verify error message
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('should calculate total price correctly', async ({ page }) => {
    // Add multiple items to cart
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.addProductToCart('sauce-labs-bike-light');
    await homePage.addProductToCart('sauce-labs-bolt-t-shirt');

    // Go to cart and checkout
    await homePage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill checkout information
    const userData = testDataGenerator.generateUser();
    await checkoutPage.fillCheckoutInformation(
      userData.firstName,
      userData.lastName,
      userData.address.zipCode
    );

    // Continue to overview
    await checkoutPage.continueToOverview();

    // Verify price calculations
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(total).toBeGreaterThan(subtotal);
    expect(tax).toBeGreaterThan(0);
  });

  test('should allow user to cancel checkout', async ({ page }) => {
    // Add item to cart and proceed to checkout
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.goToCart();
    await cartPage.proceedToCheckout();

    // Cancel checkout
    await checkoutPage.cancelCheckout();

    // Verify we're back to cart page
    await expect(page.url()).toContain('/cart.html');
    await expect(cartPage.cartItems).toHaveCount(1);
  });
});
