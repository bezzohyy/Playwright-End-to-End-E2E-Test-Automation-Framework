/**
 * Production environment configuration
 */
const prodConfig = {
  // Base URLs
  baseURL: 'https://www.saucedemo.com',
  apiBaseURL: 'https://api.saucedemo.com',
  
  // Authentication
  credentials: {
    standard_user: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    // NOTE: In production, credentials should be minimal and secure
    monitoring_user: {
      username: process.env.PROD_MONITOR_USER || '',
      password: process.env.PROD_MONITOR_PASS || ''
    }
  },
  
  // Database configuration
  database: {
    host: process.env.PROD_DB_HOST || '',
    port: parseInt(process.env.PROD_DB_PORT) || 5432,
    name: process.env.PROD_DB_NAME || '',
    user: process.env.PROD_DB_USER || '',
    password: process.env.PROD_DB_PASS || '',
    ssl: true,
    pool: {
      min: 10,
      max: 50,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
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
    timeout: 90000,
    navigationTimeout: 90000
  },
  
  // Test configuration
  test: {
    timeout: 90000,
    expect: {
      timeout: 20000
    },
    retries: 5,
    workers: 8,
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
      enabled: false, // Typically disabled in prod monitoring
      username: process.env.SAUCE_USERNAME || '',
      accessKey: process.env.SAUCE_ACCESS_KEY || ''
    },
    browserStack: {
      enabled: false, // Typically disabled in prod monitoring
      username: process.env.BROWSERSTACK_USERNAME || '',
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY || ''
    }
  },
  
  // Logging
  logging: {
    level: 'error',
    console: false,
    file: {
      enabled: true,
      path: 'logs/prod.log',
      maxSize: '100MB',
      maxFiles: 10
    }
  },
  
  // Feature flags
  features: {
    enableNewCheckoutFlow: true,
    enablePerformanceMonitoring: true,
    enableAPITesting: false, // Limited API testing in prod
    enableE2ETesting: false, // Limited E2E testing in prod
    enableLoadTesting: false,
    enableSmokeTests: true
  },
  
  // Third-party integrations
  integrations: {
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK || '',
      channels: {
        critical: '#prod-critical',
        alerts: '#prod-alerts',
        reports: '#prod-reports'
      }
    },
    jira: {
      enabled: true,
      baseUrl: process.env.JIRA_BASE_URL || '',
      token: process.env.JIRA_TOKEN || '',
      projectKey: 'PROD'
    },
    newRelic: {
      enabled: true,
      apiKey: process.env.NEW_RELIC_API_KEY || '',
      appId: process.env.NEW_RELIC_APP_ID || ''
    },
    datadog: {
      enabled: true,
      apiKey: process.env.DATADOG_API_KEY || '',
      appKey: process.env.DATADOG_APP_KEY || ''
    },
    pagerDuty: {
      enabled: true,
      apiKey: process.env.PAGERDUTY_API_KEY || '',
      serviceKey: process.env.PAGERDUTY_SERVICE_KEY || ''
    }
  },
  
  // Production specific settings
  production: {
    readOnlyMode: true, // Prevent data modifications
    smokeTestsOnly: true,
    maxTestDuration: 600000, // 10 minutes
    monitoringInterval: 300000, // 5 minutes
    healthChecks: {
      enabled: true,
      endpoints: [
        '/health',
        '/api/health',
        '/status'
      ]
    },
    performanceThreshold: {
      pageLoadTime: 2000,
      apiResponseTime: 500,
      errorRate: 0.01 // 1%
    },
    alerting: {
      enabled: true,
      criticalFailures: true,
      performanceDegradation: true,
      uptime: true
    },
    backup: {
      enabled: true,
      schedule: '0 2 * * *', // Daily at 2 AM
      retention: 30 // days
    }
  }
};

module.exports = prodConfig;
