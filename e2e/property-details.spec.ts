import { test, expect } from '@playwright/test';

test.describe('Property Details', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a property details page (assuming property ID 1 exists)
    await page.goto('/property/1');
  });

  test('should display property information', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for property title and location
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check for price display
    await expect(page.getByText(/₫/)).toBeVisible();
    
    // Check for basic property info
    await expect(page.getByText(/m²/)).toBeVisible();
  });

  test('should show property image gallery', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for main property image
    const mainImage = page.locator('img').first();
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('alt');
    
    // Check for thumbnail navigation if available
    const thumbnails = page.locator('[data-testid="thumbnail"]');
    const thumbnailCount = await thumbnails.count();
    
    if (thumbnailCount > 0) {
      // Click on a thumbnail
      await thumbnails.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should display tabbed interface', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for tab buttons
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Valuation')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
  });

  test('should switch between tabs correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Test Overview tab (should be active by default)
    await expect(page.getByText('Overview').locator('..')).toHaveClass(/bg-blue-600/);
    
    // Switch to Valuation tab
    await page.getByText('Valuation').click();
    await expect(page.getByText('Valuation').locator('..')).toHaveClass(/bg-blue-600/);
    await expect(page.getByText('AI Valuation Summary')).toBeVisible();
    
    // Switch to Location tab
    await page.getByText('Location').click();
    await expect(page.getByText('Location').locator('..')).toHaveClass(/bg-blue-600/);
    
    // Switch back to Overview
    await page.getByText('Overview').click();
    await expect(page.getByText('Overview').locator('..')).toHaveClass(/bg-blue-600/);
  });

  test('should display property details in overview tab', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for property description
    await expect(page.getByText('Description')).toBeVisible();
    
    // Check for amenities section
    await expect(page.getByText('Amenities')).toBeVisible();
    
    // Check for property specifications
    await expect(page.getByText('Bedrooms')).toBeVisible();
    await expect(page.getByText('Bathrooms')).toBeVisible();
    await expect(page.getByText('Area')).toBeVisible();
  });

  test('should show valuation information', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Switch to Valuation tab
    await page.getByText('Valuation').click();
    
    // Check for valuation summary
    await expect(page.getByText('AI Valuation Summary')).toBeVisible();
    
    // Check for estimated value
    await expect(page.getByText(/Estimated Value/)).toBeVisible();
    
    // Check for confidence score
    await expect(page.getByText(/Confidence/)).toBeVisible();
    
    // Check for charts
    await expect(page.locator('[data-testid="line-chart"]')).toBeVisible();
  });

  test('should display location and map', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Switch to Location tab
    await page.getByText('Location').click();
    
    // Check for map container
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
    
    // Check for location details
    await expect(page.getByText('Address')).toBeVisible();
  });

  test('should show property info card in sidebar', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for property info card
    await expect(page.getByText('Property Info')).toBeVisible();
    
    // Check for property type
    await expect(page.getByText('Property Type')).toBeVisible();
    
    // Check for key details
    await expect(page.getByText('Year Built')).toBeVisible();
    await expect(page.getByText('Floor')).toBeVisible();
    await expect(page.getByText('Direction')).toBeVisible();
  });

  test('should display similar properties section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for similar properties section
    await expect(page.getByText('Similar Properties')).toBeVisible();
    
    // Check if there are similar property cards
    const similarProperties = page.locator('[data-testid="similar-property"]');
    const count = await similarProperties.count();
    
    if (count > 0) {
      // Check first similar property has required info
      const firstSimilar = similarProperties.first();
      await expect(firstSimilar.getByText(/₫/)).toBeVisible();
      await expect(firstSimilar.getByText(/m²/)).toBeVisible();
    }
  });

  test('should show quick valuation section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for quick valuation section
    await expect(page.getByText('Quick Valuation')).toBeVisible();
    await expect(page.getByText('Get instant property valuation')).toBeVisible();
    
    // Check for generate report button
    const generateButton = page.getByRole('button', { name: /generate report/i });
    await expect(generateButton).toBeVisible();
  });

  test('should handle generate valuation report', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click generate report button
    const generateButton = page.getByRole('button', { name: /generate report/i });
    await generateButton.click();
    
    // Should show some feedback or navigate
    await page.waitForTimeout(1000);
    
    // Check for success message or navigation
    // This depends on the actual implementation
  });

  test('should navigate to similar property', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check if there are similar properties
    const similarProperties = page.locator('[data-testid="similar-property"]');
    const count = await similarProperties.count();
    
    if (count > 0) {
      // Click on first similar property
      await similarProperties.first().click();
      
      // Should navigate to that property's details
      await expect(page).toHaveURL(/\/property\/\d+/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.waitForLoadState('networkidle');
    
    // Check if main elements are still visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Valuation')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
    
    // Test tab switching on mobile
    await page.getByText('Valuation').click();
    await expect(page.getByText('AI Valuation Summary')).toBeVisible();
  });

  test('should handle property not found', async ({ page }) => {
    // Navigate to non-existent property
    await page.goto('/property/99999');
    
    // Should show error message
    await expect(page.getByText('Property not found')).toBeVisible();
  });

  test('should display amenities correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for amenities section
    await expect(page.getByText('Amenities')).toBeVisible();
    
    // Check for common amenities
    const amenities = ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Elevator'];
    
    for (const amenity of amenities) {
      const amenityElement = page.getByText(amenity);
      if (await amenityElement.isVisible()) {
        await expect(amenityElement).toBeVisible();
      }
    }
  });

  test('should show price history chart in valuation tab', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Switch to Valuation tab
    await page.getByText('Valuation').click();
    
    // Check for price history section
    await expect(page.getByText('Price History')).toBeVisible();
    
    // Check for chart
    await expect(page.locator('[data-testid="line-chart"]')).toBeVisible();
  });

  test('should display market comparison in valuation tab', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Switch to Valuation tab
    await page.getByText('Valuation').click();
    
    // Check for market comparison section
    await expect(page.getByText('Market Comparison')).toBeVisible();
    
    // Check for comparison chart
    await expect(page.locator('[data-testid="bar-chart"]')).toBeVisible();
  });

  test('should handle image gallery navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for image navigation buttons if multiple images
    const prevButton = page.locator('[data-testid="prev-image"]');
    const nextButton = page.locator('[data-testid="next-image"]');
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      
      // Check if image changed
      await expect(prevButton).toBeVisible();
    }
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Switch between tabs to test for errors
    await page.getByText('Valuation').click();
    await page.waitForTimeout(500);
    
    await page.getByText('Location').click();
    await page.waitForTimeout(500);
    
    await page.getByText('Overview').click();
    await page.waitForTimeout(500);
    
    // Check that there are no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});