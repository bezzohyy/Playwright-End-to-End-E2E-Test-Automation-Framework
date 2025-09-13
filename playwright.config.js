// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Global test timeout */
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  
  /* Test expect timeout */
  expect: {
    timeout: 5000
  },
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    // Uncomment for Allure reports
    // ['allure-playwright', { outputFolder: 'reports/allure-results' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    /* Browser context options */
    viewport: { 
      width: parseInt(process.env.VIEWPORT_WIDTH) || 1280, 
      height: parseInt(process.env.VIEWPORT_HEIGHT) || 720 
    },
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    
    /* Screenshot settings */
    screenshot: process.env.SCREENSHOT_MODE || 'only-on-failure',
    
    /* Video settings */
    video: process.env.VIDEO_MODE || 'retain-on-failure',
    
    /* Slow down operations by the specified amount of milliseconds */
    launchOptions: {
      slowMo: parseInt(process.env.SLOW_MO) || 0,
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        headless: process.env.HEADLESS === 'true',
      },
    },
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        headless: process.env.HEADLESS === 'true',
      },
    },
  ],

  /* Output directories */
  outputDir: 'screenshots/',
  
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
