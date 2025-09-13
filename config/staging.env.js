/**
 * Staging environment configuration
 */
const stagingConfig = {
  // Base URLs
  baseURL: 'https://staging.saucedemo.com',
  apiBaseURL: 'https://staging-api.saucedemo.com',
  
  // Authentication
  credentials: {
    standard_user: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    admin_user: {
      username: 'staging_admin',
      password: 'staging_admin_pass'
    },
    performance_user: {
      username: 'performance_glitch_user',
      password: 'secret_sauce'
    }
  },
  
  // Database configuration
  database: {
    host: 'staging-db.example.com',
    port: 5432,
    name: 'saucedemo_staging',
    user: 'staging_user',
    password: 'staging_password',
    ssl: true,
    pool: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    }
  },
  
  // Browser configuration
  browser: {
    headless: true,
    slowMo: 0,
    viewport: {
      width: 1920,
      height: 1080
    },
    timeout: 60000,
    navigationTimeout: 60000
  },
  
  // Test configuration
  test: {
    timeout: 60000,
    expect: {
      timeout: 15000
    },
    retries: 3,
    workers: 6,
    fullyParallel: true
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
      enabled: true,
      username: process.env.SAUCE_USERNAME || '',
      accessKey: process.env.SAUCE_ACCESS_KEY || '',
      buildName: `Staging Build ${new Date().toISOString()}`
    },
    browserStack: {
      enabled: true,
      username: process.env.BROWSERSTACK_USERNAME || '',
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY || '',
      buildName: `Staging Build ${new Date().toISOString()}`
    }
  },
  
  // Logging
  logging: {
    level: 'warn',
    console: true,
    file: {
      enabled: true,
      path: 'logs/staging.log'
    }
  },
  
  // Feature flags
  features: {
    enableNewCheckoutFlow: true,
    enablePerformanceMonitoring: true,
    enableAPITesting: true,
    enableE2ETesting: true,
    enableLoadTesting: true
  },
  
  // Third-party integrations
  integrations: {
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK || '',
      channels: {
        failures: '#staging-failures',
        reports: '#staging-reports',
        releases: '#releases'
      }
    },
    jira: {
      enabled: true,
      baseUrl: process.env.JIRA_BASE_URL || '',
      token: process.env.JIRA_TOKEN || '',
      projectKey: 'STAGING'
    },
    newRelic: {
      enabled: true,
      apiKey: process.env.NEW_RELIC_API_KEY || '',
      appId: process.env.NEW_RELIC_APP_ID || ''
    }
  },
  
  // Staging specific settings
  staging: {
    performanceThreshold: {
      pageLoadTime: 3000,
      apiResponseTime: 1000
    },
    monitoringEnabled: true,
    loadTestingEnabled: true,
    securityTestingEnabled: true,
    crossBrowserTesting: {
      enabled: true,
      browsers: ['chrome', 'firefox', 'safari', 'edge']
    }
  }
};

module.exports = stagingConfig;
