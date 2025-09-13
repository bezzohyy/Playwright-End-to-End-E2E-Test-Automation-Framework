/**
 * Checkout Page Object Model
 */
class CheckoutPage {
  constructor(page) {
    this.page = page;
    
    // Checkout Information Selectors
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    
    // Checkout Overview Selectors
    this.checkoutSummary = page.locator('.checkout_summary_container');
    this.cartItems = page.locator('.cart_item');
    this.paymentInfo = page.locator('.summary_info_label:has-text("Payment Information:")');
    this.shippingInfo = page.locator('.summary_info_label:has-text("Shipping Information:")');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelOverviewButton = page.locator('[data-test="cancel"]');
    
    // Checkout Complete Selectors
    this.successMessage = page.locator('.complete-header');
    this.successText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('.pony_express');
  }

  /**
   * Navigate to checkout step one
   */
  async gotoStepOne() {
    await this.page.goto('/checkout-step-one.html');
  }

  /**
   * Navigate to checkout step two (overview)
   */
  async gotoStepTwo() {
    await this.page.goto('/checkout-step-two.html');
  }

  /**
   * Navigate to checkout complete page
   */
  async gotoComplete() {
    await this.page.goto('/checkout-complete.html');
  }

  /**
   * Fill checkout information
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} postalCode - Postal/ZIP code
   */
  async fillCheckoutInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Continue to checkout overview
   */
  async continueToOverview() {
    await this.continueButton.click();
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancelCheckout() {
    await this.cancelButton.click();
  }

  /**
   * Finish checkout process
   */
  async finishCheckout() {
    await this.finishButton.click();
  }

  /**
   * Cancel from overview and return to inventory
   */
  async cancelFromOverview() {
    await this.cancelOverviewButton.click();
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
   * Get subtotal amount
   * @returns {Promise<number>} Subtotal amount
   */
  async getSubtotal() {
    const subtotalText = await this.subtotalLabel.textContent();
    const match = subtotalText.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get tax amount
   * @returns {Promise<number>} Tax amount
   */
  async getTax() {
    const taxText = await this.taxLabel.textContent();
    const match = taxText.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get total amount
   * @returns {Promise<number>} Total amount
   */
  async getTotal() {
    const totalText = await this.totalLabel.textContent();
    const match = totalText.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get payment information
   * @returns {Promise<string>} Payment info text
   */
  async getPaymentInformation() {
    const paymentSection = this.page.locator('.summary_info').first();
    return await paymentSection.textContent();
  }

  /**
   * Get shipping information
   * @returns {Promise<string>} Shipping info text
   */
  async getShippingInformation() {
    const shippingSection = this.page.locator('.summary_info').nth(1);
    return await shippingSection.textContent();
  }

  /**
   * Get all items in checkout overview
   * @returns {Promise<Array>} Array of cart items
   */
  async getCheckoutItems() {
    return await this.cartItems.all();
  }

  /**
   * Get checkout item count
   * @returns {Promise<number>} Number of items
   */
  async getCheckoutItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Verify checkout information form fields
   * @returns {Promise<Object>} Form field states
   */
  async getFormFieldStates() {
    return {
      firstName: {
        value: await this.firstNameInput.inputValue(),
        isVisible: await this.firstNameInput.isVisible(),
        isEnabled: await this.firstNameInput.isEnabled()
      },
      lastName: {
        value: await this.lastNameInput.inputValue(),
        isVisible: await this.lastNameInput.isVisible(),
        isEnabled: await this.lastNameInput.isEnabled()
      },
      postalCode: {
        value: await this.postalCodeInput.inputValue(),
        isVisible: await this.postalCodeInput.isVisible(),
        isEnabled: await this.postalCodeInput.isEnabled()
      }
    };
  }

  /**
   * Clear all form fields
   */
  async clearAllFields() {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.postalCodeInput.clear();
  }

  /**
   * Get success message after checkout completion
   * @returns {Promise<string>} Success message
   */
  async getSuccessMessage() {
    return await this.successMessage.textContent();
  }

  /**
   * Get success description text
   * @returns {Promise<string>} Success description
   */
  async getSuccessDescription() {
    return await this.successText.textContent();
  }

  /**
   * Go back to products page after successful checkout
   */
  async backToProducts() {
    await this.backHomeButton.click();
  }

  /**
   * Check if on checkout step one
   * @returns {Promise<boolean>} True if on step one
   */
  async isOnStepOne() {
    return this.page.url().includes('/checkout-step-one.html');
  }

  /**
   * Check if on checkout step two (overview)
   * @returns {Promise<boolean>} True if on step two
   */
  async isOnStepTwo() {
    return this.page.url().includes('/checkout-step-two.html');
  }

  /**
   * Check if on checkout complete page
   * @returns {Promise<boolean>} True if on complete page
   */
  async isOnCompletePage() {
    return this.page.url().includes('/checkout-complete.html');
  }

  /**
   * Wait for checkout step one to load
   */
  async waitForStepOneLoad() {
    await this.firstNameInput.waitFor({ state: 'visible' });
    await this.lastNameInput.waitFor({ state: 'visible' });
    await this.postalCodeInput.waitFor({ state: 'visible' });
  }

  /**
   * Wait for checkout overview to load
   */
  async waitForOverviewLoad() {
    await this.checkoutSummary.waitFor({ state: 'visible' });
    await this.subtotalLabel.waitFor({ state: 'visible' });
    await this.totalLabel.waitFor({ state: 'visible' });
  }

  /**
   * Wait for checkout complete page to load
   */
  async waitForCompleteLoad() {
    await this.successMessage.waitFor({ state: 'visible' });
    await this.ponyExpressImage.waitFor({ state: 'visible' });
  }
}

module.exports = CheckoutPage;
