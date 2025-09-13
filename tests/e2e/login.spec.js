const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');

test.describe('Login Tests', () => {
  let loginPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await page.goto('/');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Test data
    const username = 'standard_user';
    const password = 'secret_sauce';

    // Perform login
    await loginPage.login(username, password);

    // Verify successful login
    await expect(homePage.productsHeader).toBeVisible();
    await expect(page.url()).toContain('/inventory.html');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Test data
    const username = 'invalid_user';
    const password = 'wrong_password';

    // Perform login with invalid credentials
    await loginPage.login(username, password);

    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('should show error when username is empty', async ({ page }) => {
    // Test data
    const username = '';
    const password = 'secret_sauce';

    // Perform login with empty username
    await loginPage.login(username, password);

    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('should show error when password is empty', async ({ page }) => {
    // Test data
    const username = 'standard_user';
    const password = '';

    // Perform login with empty password
    await loginPage.login(username, password);

    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('should handle locked out user', async ({ page }) => {
    // Test data
    const username = 'locked_out_user';
    const password = 'secret_sauce';

    // Perform login with locked out user
    await loginPage.login(username, password);

    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('should clear error message when clicking X button', async ({ page }) => {
    // First, trigger an error
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();

    // Click the close button
    await loginPage.closeErrorMessage();

    // Verify error message is hidden
    await expect(loginPage.errorMessage).not.toBeVisible();
  });
});
