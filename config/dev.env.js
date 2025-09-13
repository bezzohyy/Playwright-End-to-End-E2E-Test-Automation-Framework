/**
 * Development environment configuration
 */
const devConfig = {
  // Base URLs
  baseURL: 'https://dev.saucedemo.com',
  apiBaseURL: 'https://dev-api.saucedemo.com',
  
  // Authentication
  credentials: {
    standard_user: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    admin_user: {
      username: 'admin_user',
      password: 'admin_pass'
    }
  },
  
  // Database configuration
  database: {
    host: 'dev-db.example.com',
    port: 5432,
    name: 'saucedemo_dev',
    user: 'dev_user',
    password: 'dev_password',
    ssl: false,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  },
  
  // Browser configuration
  browser: {
    headless: false,
    slowMo: 100,
    viewport: {
      width: 1280,
      height: 720
    },
    timeout: 30000,
    navigationTimeout: 30000
  },
  
  // Test configuration
  test: {
    timeout: 30000,
    expect: {
      timeout: 5000
    },
    retries: 1,
    workers: 2,
    fullyParallel: false
  },
  
  // Reporting
  reporting: {
    htmlReportDir: 'reports/html-report',
    allureResultsDir: 'reports/allure-results',
    screenshotMode: 'only-on-failure',
    videoMode: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  
  // External services
  services: {
    sauceLabs: {
      enabled: false,
      username: process.env.SAUCE_USERNAME || '',
      accessKey: process.env.SAUCE_ACCESS_KEY || ''
    },
    browserStack: {
      enabled: false,
      username: process.env.BROWSERSTACK_USERNAME || '',
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY || ''
    }
  },
  
  // Logging
  logging: {
    level: 'debug',
    console: true,
    file: {
      enabled: true,
      path: 'logs/dev.log'
    }
  },
  
  // Feature flags
  features: {
    enableNewCheckoutFlow: true,
    enablePerformanceMonitoring: true,
    enableAPITesting: true
  },
  
  // Third-party integrations
  integrations: {
    slack: {
      enabled: false,
      webhook: process.env.SLACK_WEBHOOK || ''
    },
    jira: {
      enabled: false,
      baseUrl: process.env.JIRA_BASE_URL || '',
      token: process.env.JIRA_TOKEN || ''
    }
  }
};

module.exports = devConfig;
