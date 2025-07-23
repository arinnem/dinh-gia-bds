import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main hero section', async ({ page }) => {
    // Check hero title
    await expect(page.getByText('Find Your Perfect Property')).toBeVisible();
    
    // Check hero description
    await expect(page.getByText('Discover the best real estate opportunities')).toBeVisible();
    
    // Check search form
    await expect(page.getByPlaceholder('Enter location, property type, or keywords...')).toBeVisible();
    await expect(page.getByRole('button', { name: /search properties/i })).toBeVisible();
  });

  test('should display quick action buttons', async ({ page }) => {
    await expect(page.getByText('Quick Valuation')).toBeVisible();
    await expect(page.getByText('Browse Properties')).toBeVisible();
    await expect(page.getByText('Market Analysis')).toBeVisible();
  });

  test('should show market statistics', async ({ page }) => {
    await expect(page.getByText('Market Overview')).toBeVisible();
    await expect(page.getByText('Total Properties')).toBeVisible();
    await expect(page.getByText('Average Price')).toBeVisible();
    await expect(page.getByText('Price Growth')).toBeVisible();
    await expect(page.getByText('Market Activity')).toBeVisible();
  });

  test('should display featured properties section', async ({ page }) => {
    await expect(page.getByText('Featured Properties')).toBeVisible();
    await expect(page.getByText('Discover our handpicked selection')).toBeVisible();
    
    // Check for property cards
    await expect(page.getByText('Luxury Apartment in District 1')).toBeVisible();
    await expect(page.getByText('Modern Villa in District 2')).toBeVisible();
    await expect(page.getByText('Cozy House in District 7')).toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter location, property type, or keywords...');
    const searchButton = page.getByRole('button', { name: /search properties/i });
    
    // Type in search input
    await searchInput.fill('District 1');
    await expect(searchInput).toHaveValue('District 1');
    
    // Click search button
    await searchButton.click();
    
    // Should navigate to search page
    await expect(page).toHaveURL(/\/search/);
  });

  test('should filter properties by type', async ({ page }) => {
    // Click on apartment filter
    await page.getByText('Apartment').click();
    
    // Check if filter is applied (visual feedback)
    await expect(page.getByText('Apartment').locator('..')).toHaveClass(/bg-blue-600/);
  });

  test('should navigate to property details', async ({ page }) => {
    // Click on a featured property
    await page.getByText('Luxury Apartment in District 1').click();
    
    // Should navigate to property details page
    await expect(page).toHaveURL(/\/property\//);
  });

  test('should navigate via quick action buttons', async ({ page }) => {
    // Test Browse Properties button
    await page.getByText('Browse Properties').click();
    await expect(page).toHaveURL(/\/search/);
    
    // Go back to home
    await page.goto('/');
    
    // Test Quick Valuation button
    await page.getByText('Quick Valuation').click();
    await expect(page).toHaveURL(/\/valuation/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if main elements are still visible
    await expect(page.getByText('Find Your Perfect Property')).toBeVisible();
    await expect(page.getByPlaceholder('Enter location, property type, or keywords...')).toBeVisible();
    await expect(page.getByText('Featured Properties')).toBeVisible();
  });

  test('should handle property type filters correctly', async ({ page }) => {
    // Test all filter options
    const filters = ['All', 'Apartment', 'House', 'Villa', 'Office'];
    
    for (const filter of filters) {
      await page.getByText(filter).click();
      await expect(page.getByText(filter).locator('..')).toHaveClass(/bg-blue-600/);
    }
  });

  test('should display property details in cards', async ({ page }) => {
    // Check for property details in featured section
    await expect(page.getByText('₫15.5 billion')).toBeVisible();
    await expect(page.getByText('120 m²')).toBeVisible();
    await expect(page.getByText('3 beds')).toBeVisible();
    await expect(page.getByText('2 baths')).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    
    const h2Elements = page.getByRole('heading', { level: 2 });
    await expect(h2Elements.first()).toBeVisible();
    
    // Check for alt text on images
    const images = page.getByRole('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload();
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that there are no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});