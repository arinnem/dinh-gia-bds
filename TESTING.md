# 🧪 Testing Guide - Real Estate Valuation Platform

This document provides comprehensive guidance on testing the Real Estate Valuation Platform. Our test suite ensures code quality, functionality, and user experience across all application flows.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Our testing strategy includes:

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Testing API endpoints and service interactions
- **End-to-End Tests**: Testing complete user workflows
- **Accessibility Tests**: Ensuring WCAG compliance
- **Performance Tests**: Monitoring application performance
- **Security Tests**: Identifying vulnerabilities

## 🏗️ Test Structure

```
├── src/
│   ├── components/__tests__/     # Component unit tests
│   ├── pages/__tests__/          # Page component tests
│   ├── services/__tests__/       # Service layer tests
│   ├── utils/__tests__/          # Utility function tests
│   └── test/
│       └── setup.ts              # Test environment setup
├── e2e/                          # End-to-end tests
│   ├── home.spec.ts
│   ├── property-search.spec.ts
│   ├── property-details.spec.ts
│   └── valuation-dashboard.spec.ts
├── .github/workflows/test.yml    # CI/CD pipeline
├── jest.config.js               # Jest configuration
├── playwright.config.ts         # Playwright configuration
├── test-runner.js              # Custom test runner
└── TESTING.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Git for version control

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

3. **Verify installation**:
   ```bash
   npm run test -- --version
   ```

## 🏃‍♂️ Running Tests

### Quick Commands

```bash
# Run all tests
npm run test:all

# Run unit tests only
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run comprehensive test suite with reports
node test-runner.js
```

### Detailed Test Commands

#### Unit Tests

```bash
# Run specific test file
npm test -- Home.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Run tests for specific directory
npm test -- src/components

# Run tests with verbose output
npm test -- --verbose

# Update snapshots
npm test -- --updateSnapshot
```

#### E2E Tests

```bash
# Run specific E2E test
npx playwright test home.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed

# Debug specific test
npx playwright test --debug home.spec.ts

# Generate test report
npx playwright show-report
```

## ✍️ Writing Tests

### Unit Test Example

```typescript
// src/components/__tests__/PropertyCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from '../PropertyCard';
import { mockProperty } from '../../test/mocks';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PropertyCard', () => {
  it('should render property information correctly', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.price)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.location)).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClickMock = jest.fn();
    renderWithRouter(
      <PropertyCard property={mockProperty} onClick={onClickMock} />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledWith(mockProperty.id);
  });
});
```

### E2E Test Example

```typescript
// e2e/property-search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Property Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('should filter properties by type', async ({ page }) => {
    // Select apartment filter
    await page.click('[data-testid="filter-apartment"]');
    
    // Wait for results to load
    await page.waitForSelector('[data-testid="property-card"]');
    
    // Verify all results are apartments
    const propertyTypes = await page.locator('[data-testid="property-type"]').allTextContents();
    expect(propertyTypes.every(type => type === 'Apartment')).toBeTruthy();
  });

  test('should navigate to property details', async ({ page }) => {
    // Click on first property
    await page.click('[data-testid="property-card"]:first-child');
    
    // Verify navigation to details page
    await expect(page).toHaveURL(/\/property\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Test Data and Mocks

```typescript
// src/test/mocks.ts
export const mockProperty = {
  id: 1,
  title: 'Modern Apartment in District 1',
  price: '2,500,000,000 VND',
  location: 'District 1, Ho Chi Minh City',
  type: 'Apartment',
  area: 85,
  bedrooms: 2,
  bathrooms: 2,
  images: ['/mock-image-1.jpg'],
  amenities: ['Swimming Pool', 'Gym', 'Parking']
};

export const mockSearchResults = {
  properties: [mockProperty],
  total: 1,
  page: 1,
  limit: 10
};
```

## 📊 Test Coverage

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/index.html
```

### Coverage Configuration

Coverage settings are configured in `jest.config.js`:

```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
};
```

## 🔄 Continuous Integration

Our CI/CD pipeline runs automatically on:

- **Push** to main/develop branches
- **Pull Requests** to main/develop
- **Daily** at 2 AM UTC (scheduled)

### Pipeline Stages

1. **Unit Tests**: Jest with coverage reporting
2. **E2E Tests**: Playwright across multiple browsers
3. **Accessibility Tests**: axe-core compliance checks
4. **Performance Tests**: Lighthouse CI metrics
5. **Security Tests**: npm audit and Snyk scanning

### Viewing CI Results

- **GitHub Actions**: Check the Actions tab in the repository
- **Coverage**: View reports on Codecov
- **Performance**: Lighthouse CI dashboard
- **Security**: Snyk dashboard

## 🔧 Troubleshooting

### Common Issues

#### Jest Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with more verbose output
npm test -- --verbose --no-cache

# Check for TypeScript errors
npm run type-check
```

#### Playwright Tests Failing

```bash
# Update Playwright browsers
npx playwright install

# Run with debug mode
npx playwright test --debug

# Check if dev server is running
npm run dev
```

#### Coverage Issues

```bash
# Ensure all files are included
npm run test:coverage -- --collectCoverageFrom="src/**/*.{ts,tsx}"

# Check for untested files
npm run test:coverage -- --coverage --watchAll=false
```

### Environment Issues

#### Node.js Version

```bash
# Check Node.js version
node --version

# Use Node Version Manager
nvm use 18
```

#### Dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for peer dependency issues
npm ls
```

### Test-Specific Issues

#### Mock Issues

```typescript
// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

// Mock external dependencies
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));
```

#### Async Test Issues

```typescript
// Use waitFor for async operations
import { waitFor } from '@testing-library/react';

test('async operation', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

## 📚 Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** and avoid shared state

### Test Data

1. **Use factories** for creating test data
2. **Mock external dependencies** consistently
3. **Use realistic data** that matches production scenarios
4. **Clean up** after tests to prevent side effects

### Performance

1. **Run tests in parallel** when possible
2. **Use selective testing** during development
3. **Optimize test setup** and teardown
4. **Monitor test execution time**

### Maintenance

1. **Update tests** when features change
2. **Remove obsolete tests** regularly
3. **Refactor test code** to reduce duplication
4. **Document complex test scenarios**

## 🆘 Getting Help

- **Documentation**: Check this file and inline comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Team**: Reach out to the development team
- **Community**: Check Jest and Playwright documentation

## 📈 Metrics and Reporting

Our test suite generates comprehensive reports:

- **JSON Report**: `test-results.json`
- **HTML Report**: `test-report.html`
- **Coverage Report**: `coverage/index.html`
- **E2E Report**: `playwright-report/index.html`

These reports are automatically generated and can be viewed locally or in CI/CD artifacts.

---

**Happy Testing! 🎉**

For questions or improvements to this testing guide, please create an issue or submit a pull request.