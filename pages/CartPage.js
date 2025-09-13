/**
 * Cart Page Object Model
 */
class CartPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartList = page.locator('.cart_list');
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await this.page.goto('/cart.html');
  }

  /**
   * Get all cart items
   * @returns {Promise<Array>} Array of cart item elements
   */
  async getAllCartItems() {
    return await this.cartItems.all();
  }

  /**
   * Get cart item by name
   * @param {string} itemName - Item name
   * @returns {Promise<Locator>} Cart item element
   */
  getCartItemByName(itemName) {
    return this.page.locator(`.cart_item:has-text("${itemName}")`);
  }

  /**
   * Remove item from cart
   * @param {string} productId - Product test ID
   */
  async removeItem(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>} True if cart is empty
   */
  async isCartEmpty() {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  /**
   * Get all item names in cart
   * @returns {Promise<string[]>} Array of item names
   */
  async getAllItemNames() {
    const nameElements = await this.cartItemNames.all();
    const names = [];
    for (const element of nameElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  /**
   * Get all item prices in cart
   * @returns {Promise<number[]>} Array of item prices
   */
  async getItemPrices() {
    const priceElements = await this.cartItemPrices.all();
    const prices = [];
    for (const element of priceElements) {
      const priceText = await element.textContent();
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }
    return prices;
  }

  /**
   * Get all item quantities in cart
   * @returns {Promise<number[]>} Array of item quantities
   */
  async getAllItemQuantities() {
    const quantityElements = await this.cartItemQuantities.all();
    const quantities = [];
    for (const element of quantityElements) {
      const quantityText = await element.textContent();
      quantities.push(parseInt(quantityText));
    }
    return quantities;
  }

  /**
   * Get item quantity by name
   * @param {string} itemName - Item name
   * @returns {Promise<number>} Item quantity
   */
  async getItemQuantity(itemName) {
    const item = this.getCartItemByName(itemName);
    const quantityText = await item.locator('.cart_quantity').textContent();
    return parseInt(quantityText);
  }

  /**
   * Get item price by name
   * @param {string} itemName - Item name
   * @returns {Promise<number>} Item price
   */
  async getItemPrice(itemName) {
    const item = this.getCartItemByName(itemName);
    const priceText = await item.locator('.inventory_item_price').textContent();
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Get item description by name
   * @param {string} itemName - Item name
   * @returns {Promise<string>} Item description
   */
  async getItemDescription(itemName) {
    const item = this.getCartItemByName(itemName);
    return await item.locator('.inventory_item_desc').textContent();
  }

  /**
   * Calculate total price of all items in cart
   * @returns {Promise<number>} Total price
   */
  async calculateTotalPrice() {
    const prices = await this.getItemPrices();
    const quantities = await this.getAllItemQuantities();
    
    let total = 0;
    for (let i = 0; i < prices.length; i++) {
      total += prices[i] * quantities[i];
    }
    
    return total;
  }

  /**
   * Check if specific item exists in cart
   * @param {string} itemName - Item name
   * @returns {Promise<boolean>} True if item exists
   */
  async hasItem(itemName) {
    const item = this.getCartItemByName(itemName);
    return await item.isVisible();
  }

  /**
   * Remove all items from cart
   */
  async removeAllItems() {
    const items = await this.getAllCartItems();
    
    for (let i = 0; i < items.length; i++) {
      const removeButtons = await this.page.locator('[data-test*="remove-"]').all();
      if (removeButtons.length > 0) {
        await removeButtons[0].click();
      }
    }
  }

  /**
   * Get cart badge count
   * @returns {Promise<number>} Badge count
   */
  async getCartBadgeCount() {
    if (await this.cartBadge.isVisible()) {
      const badgeText = await this.cartBadge.textContent();
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  /**
   * Wait for cart page to load
   */
  async waitForLoad() {
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.cartList.waitFor({ state: 'visible' });
  }

  /**
   * Check if checkout button is enabled
   * @returns {Promise<boolean>} True if enabled
   */
  async isCheckoutButtonEnabled() {
    return await this.checkoutButton.isEnabled();
  }

  /**
   * Check if continue shopping button is visible
   * @returns {Promise<boolean>} True if visible
   */
  async isContinueShoppingButtonVisible() {
    return await this.continueShoppingButton.isVisible();
  }
}

module.exports = CartPage;
