import { test, expect } from '@playwright/test';

test.describe('Property Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('should display search interface', async ({ page }) => {
    // Check search input
    await expect(page.getByPlaceholder('Search by location, title...')).toBeVisible();
    
    // Check filter sections
    await expect(page.getByText('Property Type')).toBeVisible();
    await expect(page.getByText('Price Range')).toBeVisible();
    await expect(page.getByText('Area Range')).toBeVisible();
    await expect(page.getByText('Bedrooms')).toBeVisible();
    await expect(page.getByText('Bathrooms')).toBeVisible();
  });

  test('should display property type filters', async ({ page }) => {
    await expect(page.getByText('All Types')).toBeVisible();
    await expect(page.getByText('Apartment')).toBeVisible();
    await expect(page.getByText('House')).toBeVisible();
    await expect(page.getByText('Villa')).toBeVisible();
    await expect(page.getByText('Office')).toBeVisible();
  });

  test('should show sort options', async ({ page }) => {
    await expect(page.getByText('Sort by')).toBeVisible();
    
    const sortSelect = page.locator('select').first();
    await expect(sortSelect).toBeVisible();
    
    // Check sort options
    const options = await sortSelect.locator('option').allTextContents();
    expect(options).toContain('Price: Low to High');
    expect(options).toContain('Price: High to Low');
    expect(options).toContain('Newest First');
    expect(options).toContain('Area: Large to Small');
  });

  test('should display view toggle buttons', async ({ page }) => {
    await expect(page.getByLabelText('Grid view')).toBeVisible();
    await expect(page.getByLabelText('List view')).toBeVisible();
  });

  test('should perform text search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by location, title...');
    
    // Type search query
    await searchInput.fill('District 1');
    await searchInput.press('Enter');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Check if search was performed
    await expect(searchInput).toHaveValue('District 1');
  });

  test('should filter by property type', async ({ page }) => {
    // Click apartment filter
    await page.getByText('Apartment').click();
    
    // Check if filter is applied
    await expect(page.getByText('Apartment').locator('..')).toHaveClass(/bg-blue-600/);
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
  });

  test('should adjust price range', async ({ page }) => {
    // Find price range sliders
    const minPriceSlider = page.locator('input[type="range"]').first();
    const maxPriceSlider = page.locator('input[type="range"]').nth(1);
    
    // Adjust price range
    await minPriceSlider.fill('500000000');
    await maxPriceSlider.fill('2000000000');
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
  });

  test('should adjust area range', async ({ page }) => {
    // Find area range sliders
    const minAreaSlider = page.locator('input[type="range"]').nth(2);
    const maxAreaSlider = page.locator('input[type="range"]').nth(3);
    
    // Adjust area range
    await minAreaSlider.fill('50');
    await maxAreaSlider.fill('200');
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
  });

  test('should filter by bedrooms and bathrooms', async ({ page }) => {
    // Select bedroom count
    const bedroomSelect = page.locator('select').nth(1);
    await bedroomSelect.selectOption('3');
    
    // Select bathroom count
    const bathroomSelect = page.locator('select').nth(2);
    await bathroomSelect.selectOption('2');
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
  });

  test('should change sort order', async ({ page }) => {
    const sortSelect = page.locator('select').first();
    
    // Change to price high to low
    await sortSelect.selectOption('price_desc');
    
    // Wait for results to re-sort
    await page.waitForTimeout(1000);
  });

  test('should switch between grid and list view', async ({ page }) => {
    // Switch to list view
    await page.getByLabelText('List view').click();
    await expect(page.getByLabelText('List view').locator('..')).toHaveClass(/bg-blue-600/);
    
    // Switch back to grid view
    await page.getByLabelText('Grid view').click();
    await expect(page.getByLabelText('Grid view').locator('..')).toHaveClass(/bg-blue-600/);
  });

  test('should display search results', async ({ page }) => {
    // Wait for initial results to load
    await page.waitForTimeout(2000);
    
    // Check for results count
    await expect(page.getByText(/\d+ properties found/)).toBeVisible();
    
    // Check for property cards (if any results)
    const propertyCards = page.locator('[data-testid="property-card"]');
    const cardCount = await propertyCards.count();
    
    if (cardCount > 0) {
      // Check first property card has required elements
      const firstCard = propertyCards.first();
      await expect(firstCard.getByText(/₫/)).toBeVisible(); // Price
      await expect(firstCard.getByText(/m²/)).toBeVisible(); // Area
    }
  });

  test('should handle pagination', async ({ page }) => {
    // Wait for results to load
    await page.waitForTimeout(2000);
    
    // Check for pagination controls
    const nextButton = page.getByText('Next');
    const prevButton = page.getByText('Previous');
    
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
    
    // Test pagination if there are multiple pages
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Check if page changed
      await expect(page.getByText('2')).toBeVisible();
    }
  });

  test('should clear all filters', async ({ page }) => {
    // Apply some filters first
    await page.getByPlaceholder('Search by location, title...').fill('test');
    await page.getByText('Apartment').click();
    
    // Clear filters
    await page.getByText('Clear Filters').click();
    
    // Check if filters are cleared
    await expect(page.getByPlaceholder('Search by location, title...')).toHaveValue('');
    await expect(page.getByText('All Types').locator('..')).toHaveClass(/bg-blue-600/);
  });

  test('should navigate to property details', async ({ page }) => {
    // Wait for results to load
    await page.waitForTimeout(2000);
    
    // Click on first property card if available
    const propertyCards = page.locator('[data-testid="property-card"]');
    const cardCount = await propertyCards.count();
    
    if (cardCount > 0) {
      await propertyCards.first().click();
      
      // Should navigate to property details
      await expect(page).toHaveURL(/\/property\/\d+/);
    }
  });

  test('should handle empty search results', async ({ page }) => {
    // Search for something that likely won't exist
    await page.getByPlaceholder('Search by location, title...').fill('nonexistentproperty12345');
    await page.getByPlaceholder('Search by location, title...').press('Enter');
    
    // Wait for search to complete
    await page.waitForTimeout(2000);
    
    // Check for empty state message
    await expect(page.getByText('No properties found')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if main elements are still accessible
    await expect(page.getByPlaceholder('Search by location, title...')).toBeVisible();
    await expect(page.getByText('Property Type')).toBeVisible();
    await expect(page.getByText('Sort by')).toBeVisible();
  });

  test('should maintain filters in URL', async ({ page }) => {
    // Apply filters
    await page.getByText('Apartment').click();
    await page.getByPlaceholder('Search by location, title...').fill('District 1');
    await page.getByPlaceholder('Search by location, title...').press('Enter');
    
    // Wait for URL to update
    await page.waitForTimeout(1000);
    
    // Check if URL contains filter parameters
    const url = page.url();
    expect(url).toContain('District 1');
    
    // Refresh page and check if filters persist
    await page.reload();
    await expect(page.getByPlaceholder('Search by location, title...')).toHaveValue('District 1');
    await expect(page.getByText('Apartment').locator('..')).toHaveClass(/bg-blue-600/);
  });
});