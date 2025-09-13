/**
 * Home Page (Inventory) Page Object Model
 */
class HomePage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.productsHeader = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.sidebar = page.locator('.bm-menu');
    this.sortDropdown = page.locator('.product_sort_container');
    this.appLogo = page.locator('.app_logo');
  }

  /**
   * Navigate to home/inventory page
   */
  async goto() {
    await this.page.goto('/inventory.html');
  }

  /**
   * Get all products on the page
   * @returns {Promise<Array>} Array of product elements
   */
  async getAllProducts() {
    return await this.inventoryItems.all();
  }

  /**
   * Get product by name
   * @param {string} productName - Product name
   * @returns {Promise<Locator>} Product element
   */
  getProductByName(productName) {
    return this.page.locator(`.inventory_item:has-text("${productName}")`);
  }

  /**
   * Add product to cart by test id
   * @param {string} productId - Product test ID
   */
  async addProductToCart(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  /**
   * Remove product from cart by test id
   * @param {string} productId - Product test ID
   */
  async removeProductFromCart(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Go to shopping cart
   */
  async goToCart() {
    await this.shoppingCartLink.click();
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemCount() {
    if (await this.shoppingCartBadge.isVisible()) {
      const badgeText = await this.shoppingCartBadge.textContent();
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  /**
   * Open menu sidebar
   */
  async openMenu() {
    await this.menuButton.click();
  }

  /**
   * Close menu sidebar
   */
  async closeMenu() {
    const closeButton = this.page.locator('#react-burger-cross-btn');
    await closeButton.click();
  }

  /**
   * Logout from the application
   */
  async logout() {
    await this.openMenu();
    await this.page.locator('#logout_sidebar_link').click();
  }

  /**
   * Reset app state
   */
  async resetAppState() {
    await this.openMenu();
    await this.page.locator('#reset_sidebar_link').click();
    await this.closeMenu();
  }

  /**
   * Sort products
   * @param {string} sortOption - Sort option ('az', 'za', 'lohi', 'hilo')
   */
  async sortProducts(sortOption) {
    await this.sortDropdown.selectOption(sortOption);
  }

  /**
   * Get all product names
   * @returns {Promise<string[]>} Array of product names
   */
  async getAllProductNames() {
    const nameElements = await this.page.locator('.inventory_item_name').all();
    const names = [];
    for (const element of nameElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  /**
   * Get all product prices
   * @returns {Promise<number[]>} Array of product prices
   */
  async getAllProductPrices() {
    const priceElements = await this.page.locator('.inventory_item_price').all();
    const prices = [];
    for (const element of priceElements) {
      const priceText = await element.textContent();
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }
    return prices;
  }

  /**
   * Click on product name to view details
   * @param {string} productName - Product name
   */
  async clickProductName(productName) {
    await this.page.locator(`.inventory_item_name:has-text("${productName}")`).click();
  }

  /**
   * Click on product image to view details
   * @param {string} productName - Product name
   */
  async clickProductImage(productName) {
    const product = this.getProductByName(productName);
    await product.locator('.inventory_item_img').click();
  }

  /**
   * Get product description
   * @param {string} productName - Product name
   * @returns {Promise<string>} Product description
   */
  async getProductDescription(productName) {
    const product = this.getProductByName(productName);
    return await product.locator('.inventory_item_desc').textContent();
  }

  /**
   * Get product price
   * @param {string} productName - Product name
   * @returns {Promise<number>} Product price
   */
  async getProductPrice(productName) {
    const product = this.getProductByName(productName);
    const priceText = await product.locator('.inventory_item_price').textContent();
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Check if product is in cart
   * @param {string} productId - Product test ID
   * @returns {Promise<boolean>} True if product is in cart
   */
  async isProductInCart(productId) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    return await removeButton.isVisible();
  }

  /**
   * Get number of visible products
   * @returns {Promise<number>} Number of products
   */
  async getProductCount() {
    return await this.inventoryItems.count();
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad() {
    await this.inventoryList.waitFor({ state: 'visible' });
    await this.inventoryItems.first().waitFor({ state: 'visible' });
  }

  /**
   * Check if page is loaded
   * @returns {Promise<boolean>} True if page is loaded
   */
  async isPageLoaded() {
    try {
      await this.productsHeader.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = HomePage;
