/**
 * Test Data Generator utilities for creating test data
 */
const { faker } = require('@faker-js/faker');

class TestDataGenerator {
  constructor() {
    this.faker = faker;
  }

  /**
   * Generate user data
   * @param {Object} overrides - Override specific fields
   * @returns {Object} User data
   */
  generateUser(overrides = {}) {
    const defaultUser = {
      firstName: this.faker.person.firstName(),
      lastName: this.faker.person.lastName(),
      email: this.faker.internet.email(),
      username: this.faker.internet.userName(),
      password: 'Test@123',
      phone: this.faker.phone.number(),
      address: {
        street: this.faker.location.streetAddress(),
        city: this.faker.location.city(),
        state: this.faker.location.state(),
        zipCode: this.faker.location.zipCode(),
        country: this.faker.location.country()
      },
      dateOfBirth: this.faker.date.past({ years: 30, refDate: new Date('2000-01-01') }),
      avatar: this.faker.image.avatar()
    };

    return { ...defaultUser, ...overrides };
  }

  /**
   * Generate product data
   * @param {Object} overrides - Override specific fields
   * @returns {Object} Product data
   */
  generateProduct(overrides = {}) {
    const defaultProduct = {
      name: this.faker.commerce.productName(),
      description: this.faker.commerce.productDescription(),
      price: parseFloat(this.faker.commerce.price({ min: 10, max: 1000 })),
      category: this.faker.commerce.department(),
      brand: this.faker.company.name(),
      sku: this.faker.string.alphanumeric(8).toUpperCase(),
      stock: this.faker.number.int({ min: 0, max: 100 }),
      image: this.faker.image.url({ width: 400, height: 400 }),
      tags: this.faker.helpers.arrayElements([
        'electronics', 'clothing', 'books', 'home', 'sports', 'toys'
      ], { min: 1, max: 3 })
    };

    return { ...defaultProduct, ...overrides };
  }

  /**
   * Generate order data
   * @param {Object} overrides - Override specific fields
   * @returns {Object} Order data
   */
  generateOrder(overrides = {}) {
    const items = this.faker.helpers.arrayElements(
      Array.from({ length: 5 }, () => this.generateProduct()),
      { min: 1, max: 3 }
    ).map(product => ({
      productId: product.sku,
      productName: product.name,
      quantity: this.faker.number.int({ min: 1, max: 5 }),
      unitPrice: product.price,
      totalPrice: product.price * this.faker.number.int({ min: 1, max: 5 })
    }));

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08;
    const shipping = this.faker.number.float({ min: 5, max: 25, fractionDigits: 2 });

    const defaultOrder = {
      orderId: this.faker.string.uuid(),
      orderNumber: this.faker.string.alphanumeric(10).toUpperCase(),
      customer: this.generateUser(),
      items: items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: shipping,
      total: parseFloat((subtotal + tax + shipping).toFixed(2)),
      status: this.faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
      orderDate: this.faker.date.recent({ days: 30 }),
      shippingAddress: {
        street: this.faker.location.streetAddress(),
        city: this.faker.location.city(),
        state: this.faker.location.state(),
        zipCode: this.faker.location.zipCode(),
        country: this.faker.location.country()
      }
    };

    return { ...defaultOrder, ...overrides };
  }

  /**
   * Generate company data
   * @param {Object} overrides - Override specific fields
   * @returns {Object} Company data
   */
  generateCompany(overrides = {}) {
    const defaultCompany = {
      name: this.faker.company.name(),
      industry: this.faker.company.buzzNoun(),
      description: this.faker.company.catchPhrase(),
      website: this.faker.internet.url(),
      email: this.faker.internet.email(),
      phone: this.faker.phone.number(),
      address: {
        street: this.faker.location.streetAddress(),
        city: this.faker.location.city(),
        state: this.faker.location.state(),
        zipCode: this.faker.location.zipCode(),
        country: this.faker.location.country()
      },
      employees: this.faker.number.int({ min: 10, max: 10000 }),
      founded: this.faker.date.past({ years: 50 }),
      logo: this.faker.image.url({ width: 200, height: 200 })
    };

    return { ...defaultCompany, ...overrides };
  }

  /**
   * Generate credit card data
   * @param {Object} overrides - Override specific fields
   * @returns {Object} Credit card data
   */
  generateCreditCard(overrides = {}) {
    const defaultCard = {
      number: this.faker.finance.creditCardNumber(),
      cvv: this.faker.finance.creditCardCVV(),
      expiryMonth: this.faker.date.future().getMonth() + 1,
      expiryYear: this.faker.date.future().getFullYear(),
      holderName: this.faker.person.fullName(),
      type: this.faker.helpers.arrayElement(['Visa', 'Mastercard', 'American Express'])
    };

    return { ...defaultCard, ...overrides };
  }

  /**
   * Generate random string
   * @param {number} length - String length
   * @param {string} type - Type of string (alpha, numeric, alphanumeric)
   * @returns {string} Random string
   */
  generateRandomString(length = 10, type = 'alphanumeric') {
    switch (type) {
      case 'alpha':
        return this.faker.string.alpha(length);
      case 'numeric':
        return this.faker.string.numeric(length);
      case 'alphanumeric':
      default:
        return this.faker.string.alphanumeric(length);
    }
  }

  /**
   * Generate random date
   * @param {string} type - Type of date (past, future, recent)
   * @param {Object} options - Date options
   * @returns {Date} Random date
   */
  generateRandomDate(type = 'recent', options = {}) {
    switch (type) {
      case 'past':
        return this.faker.date.past(options);
      case 'future':
        return this.faker.date.future(options);
      case 'recent':
      default:
        return this.faker.date.recent(options);
    }
  }

  /**
   * Generate test data from array
   * @param {Array} items - Array of possible values
   * @param {number} count - Number of items to select
   * @returns {Array} Selected items
   */
  generateFromArray(items, count = 1) {
    return this.faker.helpers.arrayElements(items, count);
  }

  /**
   * Generate multiple items of the same type
   * @param {Function} generator - Generator function
   * @param {number} count - Number of items to generate
   * @param {Object} overrides - Override options
   * @returns {Array} Array of generated items
   */
  generateMultiple(generator, count = 5, overrides = {}) {
    return Array.from({ length: count }, () => generator.call(this, overrides));
  }
}

module.exports = TestDataGenerator;
