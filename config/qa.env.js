/**
 * QA environment configuration
 */
const qaConfig = {
  // Base URLs
  baseURL: 'https://qa.saucedemo.com',
  apiBaseURL: 'https://qa-api.saucedemo.com',
  
  // Authentication
  credentials: {
    standard_user: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    admin_user: {
      username: 'qa_admin',
      password: 'qa_admin_pass'
    },
    test_user: {
      username: 'qa_test_user',
      password: 'qa_test_pass'
    }
  },
  
  // Database configuration
  database: {
    host: 'qa-db.example.com',
    port: 5432,
    name: 'saucedemo_qa',
    user: 'qa_user',
    password: 'qa_password',
    ssl: true,
    pool: {
      min: 2,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
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
    timeout: 45000,
    navigationTimeout: 45000
  },
  
  // Test configuration
  test: {
    timeout: 45000,
    expect: {
      timeout: 10000
    },
    retries: 2,
    workers: 4,
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
      buildName: `QA Build ${new Date().toISOString()}`
    },
    browserStack: {
      enabled: false,
      username: process.env.BROWSERSTACK_USERNAME || '',
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY || ''
    }
  },
  
  // Logging
  logging: {
    level: 'info',
    console: true,
    file: {
      enabled: true,
      path: 'logs/qa.log'
    }
  },
  
  // Feature flags
  features: {
    enableNewCheckoutFlow: true,
    enablePerformanceMonitoring: true,
    enableAPITesting: true,
    enableE2ETesting: true
  },
  
  // Third-party integrations
  integrations: {
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK || '',
      channels: {
        failures: '#qa-failures',
        reports: '#qa-reports'
      }
    },
    jira: {
      enabled: true,
      baseUrl: process.env.JIRA_BASE_URL || '',
      token: process.env.JIRA_TOKEN || '',
      projectKey: 'QA'
    }
  },
  
  // QA specific settings
  qa: {
    smokeTestsOnly: false,
    includeLongRunningTests: true,
    maxTestDuration: 300000, // 5 minutes
    parallelSuites: true,
    dataReset: {
      enabled: true,
      beforeEachSuite: false,
      afterEachSuite: true
    }
  }
};

module.exports = qaConfig;
