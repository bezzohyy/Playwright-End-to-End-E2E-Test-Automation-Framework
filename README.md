# Playwright E2E Test Automation Framework

This repository contains an advanced E2E Test Automation Framework built with [Playwright](https://playwright.dev/). It supports web, API, and mobile testing across multiple environments, with CI/CD integration and rich reporting.

## Features

- **Playwright-powered E2E, API, and Mobile tests**
- **Page Object Model** for maintainable test code
- **Environment configs**: dev, qa, staging, prod
- **Test data management**: CSV, JSON, generators
- **CI/CD integration**: Jenkins, GitHub Actions
- **Reporting**: HTML, JUnit, JSON, Allure
- **Fixtures** for authentication, cart, API, database
- **Multi-browser/device support**: Chromium, Firefox, WebKit, mobile
- **External integrations**: Slack, Jira, New Relic, Datadog

## Project Structure

```
.
├── .env
├── Jenkinsfile
├── package.json
├── playwright.config.js / playwright.config.ts
├── config/           # Environment configs
├── data/             # Test data files
├── pages/            # Page Object Models
├── reports/          # Test reports (HTML, JUnit, JSON, Allure)
├── src/utils/        # Utilities (API, DB, data generators)
├── tests/            # Test suites (e2e, api, mobile, fixtures)
└── .github/workflows # CI/CD workflows
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm ci
   npx playwright install --with-deps
   ```

2. **Configure environment:**
   - Edit `.env` or use files in `config/` for environment-specific settings.

3. **Run tests:**
   - E2E: `npm run test:e2e`
   - API: `npm run test:api`
   - Mobile: `npm run test:mobile`
   - All: `npm test`

4. **View reports:**
   - HTML: `npm run report`
   - Allure: `npm run allure:open` (if enabled)

## CI/CD

- **GitHub Actions**: See [workflows](.github/workflows/) for automated test runs and notifications.
- **Jenkins**: See [Jenkinsfile](Jenkinsfile) for pipeline integration.

## Customization

- Add new Page Objects in [pages/](pages/)
- Add/modify tests in [tests/](tests/)
- Update environment configs in [config/](config/)

## License

MIT

---

> This framework was created as an experimental project to explore E2E automation with Playwright and GitHub Copilot agent.
