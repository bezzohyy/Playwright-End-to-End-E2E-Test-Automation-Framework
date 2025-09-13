const { test: base, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');

/**
 * Authentication fixture that handles login for tests
 */
const authFixture = base.extend({
  // Authenticated page fixture
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await page.goto('/');
    
    // Perform login
    await loginPage.login(
      process.env.ADMIN_USERNAME || 'standard_user',
      process.env.ADMIN_PASSWORD || 'secret_sauce'
    );
    
    // Verify successful login
    await expect(page.locator('.title')).toContainText('Products');
    
    // Pass the authenticated page to the test
    await use(page);
  },

  // Admin user fixture
  adminUser: async ({ page }, use) => {
    const adminCredentials = {
      username: process.env.ADMIN_USERNAME || 'standard_user',
      password: process.env.ADMIN_PASSWORD || 'secret_sauce'
    };
    
    await use(adminCredentials);
  },

  // Standard user fixture
  standardUser: async ({ page }, use) => {
    const userCredentials = {
      username: 'standard_user',
      password: 'secret_sauce'
    };
    
    await use(userCredentials);
  },

  // Problem user fixture (for testing edge cases)
  problemUser: async ({ page }, use) => {
    const userCredentials = {
      username: 'problem_user',
      password: 'secret_sauce'
    };
    
    await use(userCredentials);
  },

  // Performance glitch user fixture
  performanceGlitchUser: async ({ page }, use) => {
    const userCredentials = {
      username: 'performance_glitch_user',
      password: 'secret_sauce'
    };
    
    await use(userCredentials);
  }
});

/**
 * Cart fixture that provides cart functionality
 */
const cartFixture = authFixture.extend({
  // Pre-filled cart fixture
  cartWithItems: async ({ authenticatedPage }, use) => {
    const homePage = new HomePage(authenticatedPage);
    
    // Add items to cart
    await homePage.addProductToCart('sauce-labs-backpack');
    await homePage.addProductToCart('sauce-labs-bike-light');
    
    // Verify items were added
    await expect(authenticatedPage.locator('.shopping_cart_badge')).toContainText('2');
    
    await use(authenticatedPage);
  },

  // Empty cart fixture
  emptyCart: async ({ authenticatedPage }, use) => {
    // Ensure cart is empty by removing all items if any exist
    const cartBadge = authenticatedPage.locator('.shopping_cart_badge');
    if (await cartBadge.isVisible()) {
      await authenticatedPage.goto('/cart.html');
      const removeButtons = authenticatedPage.locator('[data-test*="remove-"]');
      const count = await removeButtons.count();
      
      for (let i = 0; i < count; i++) {
        await removeButtons.nth(0).click();
      }
    }
    
    await authenticatedPage.goto('/inventory.html');
    await use(authenticatedPage);
  }
});

/**
 * API fixture for API testing
 */
const apiFixture = base.extend({
  // API context fixture
  apiContext: async ({ request }, use) => {
    // Set up API base URL and common headers
    const apiRequest = request;
    
    // Add authentication header if needed
    await apiRequest.newContext({
      baseURL: process.env.API_BASE_URL || 'https://api.example.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    await use(apiRequest);
  },

  // Authenticated API context
  authenticatedApiContext: async ({ request }, use) => {
    // This would typically involve getting an auth token
    const apiRequest = request;
    
    // Mock authentication - replace with actual auth flow
    const authToken = 'mock-jwt-token';
    
    await apiRequest.newContext({
      baseURL: process.env.API_BASE_URL || 'https://api.example.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    await use(apiRequest);
  }
});

/**
 * Database fixture for database testing
 */
const dbFixture = base.extend({
  // Database connection fixture
  dbConnection: async ({}, use) => {
    const DbHelper = require('../../src/utils/dbHelper');
    const db = new DbHelper();
    
    // Connect to database
    await db.connect();
    
    await use(db);
    
    // Cleanup: close database connection
    await db.close();
  },

  // Clean database fixture (starts with clean state)
  cleanDatabase: async ({}, use) => {
    const DbHelper = require('../../src/utils/dbHelper');
    const db = new DbHelper();
    
    await db.connect();
    
    // Clean test data before test
    await db.cleanupTestData(['users', 'orders', 'products']);
    
    await use(db);
    
    // Clean test data after test
    await db.cleanupTestData(['users', 'orders', 'products']);
    await db.close();
  }
});

/**
 * Test data fixture
 */
const testDataFixture = base.extend({
  // Test data generator fixture
  testData: async ({}, use) => {
    const TestDataGenerator = require('../../src/utils/testDataGenerator');
    const generator = new TestDataGenerator();
    
    await use(generator);
  },

  // Pre-generated test users
  testUsers: async ({}, use) => {
    const TestDataGenerator = require('../../src/utils/testDataGenerator');
    const generator = new TestDataGenerator();
    
    const users = {
      admin: generator.generateUser({
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }),
      customer: generator.generateUser({
        email: 'customer@test.com',
        firstName: 'Customer',
        lastName: 'User',
        role: 'customer'
      }),
      guest: generator.generateUser({
        email: 'guest@test.com',
        firstName: 'Guest',
        lastName: 'User',
        role: 'guest'
      })
    };
    
    await use(users);
  }
});

// Combine all fixtures
const test = base.extend({
  ...authFixture,
  ...cartFixture,
  ...apiFixture,
  ...dbFixture,
  ...testDataFixture
});

module.exports = { test, expect };
