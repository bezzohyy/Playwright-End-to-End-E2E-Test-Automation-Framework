/**
 * Login Page Object Model
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
    this.logoImage = page.locator('.login_logo');
    this.credentialsText = page.locator('#login_credentials');
    this.passwordText = page.locator('.login_password');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Perform login with given credentials
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Clear username field
   */
  async clearUsername() {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.passwordInput.clear();
  }

  /**
   * Get username field value
   * @returns {Promise<string>} Username value
   */
  async getUsernameValue() {
    return await this.usernameInput.inputValue();
  }

  /**
   * Get password field value
   * @returns {Promise<string>} Password value
   */
  async getPasswordValue() {
    return await this.passwordInput.inputValue();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>} True if error is visible
   */
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Close error message by clicking X button
   */
  async closeErrorMessage() {
    await this.errorCloseButton.click();
  }

  /**
   * Check if login button is enabled
   * @returns {Promise<boolean>} True if button is enabled
   */
  async isLoginButtonEnabled() {
    return await this.loginButton.isEnabled();
  }

  /**
   * Get login button text
   * @returns {Promise<string>} Button text
   */
  async getLoginButtonText() {
    return await this.loginButton.textContent();
  }

  /**
   * Check if username field is focused
   * @returns {Promise<boolean>} True if focused
   */
  async isUsernameFieldFocused() {
    return await this.usernameInput.isFocused();
  }

  /**
   * Check if password field is focused
   * @returns {Promise<boolean>} True if focused
   */
  async isPasswordFieldFocused() {
    return await this.passwordInput.isFocused();
  }

  /**
   * Get accepted usernames from the page
   * @returns {Promise<string[]>} Array of usernames
   */
  async getAcceptedUsernames() {
    const credentialsText = await this.credentialsText.textContent();
    const usernames = credentialsText.match(/\b\w+_user\b/g) || [];
    return usernames;
  }

  /**
   * Get password for all users
   * @returns {Promise<string>} Password text
   */
  async getPasswordForAllUsers() {
    const passwordText = await this.passwordText.textContent();
    const password = passwordText.match(/Password for all users:\s*(\w+)/);
    return password ? password[1] : '';
  }

  /**
   * Login with standard user
   */
  async loginWithStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  /**
   * Login with locked out user
   */
  async loginWithLockedOutUser() {
    await this.login('locked_out_user', 'secret_sauce');
  }

  /**
   * Login with problem user
   */
  async loginWithProblemUser() {
    await this.login('problem_user', 'secret_sauce');
  }

  /**
   * Login with performance glitch user
   */
  async loginWithPerformanceGlitchUser() {
    await this.login('performance_glitch_user', 'secret_sauce');
  }

  /**
   * Wait for page to load
   */
  async waitForLoad() {
    await this.logoImage.waitFor({ state: 'visible' });
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.loginButton.waitFor({ state: 'visible' });
  }
}

module.exports = LoginPage;
