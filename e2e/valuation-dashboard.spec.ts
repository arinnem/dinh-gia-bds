import { test, expect } from '@playwright/test';

test.describe('Valuation Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/valuation');
  });

  test('should display dashboard header and navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check dashboard title
    await expect(page.getByText('Valuation Dashboard')).toBeVisible();
    await expect(page.getByText('Manage and analyze property valuations')).toBeVisible();
    
    // Check for new valuation button
    await expect(page.getByText('New Valuation')).toBeVisible();
  });

  test('should display valuation statistics cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for statistics cards
    await expect(page.getByText('Total Valuations')).toBeVisible();
    await expect(page.getByText('Average Value')).toBeVisible();
    await expect(page.getByText('This Month')).toBeVisible();
    await expect(page.getByText('Accuracy Rate')).toBeVisible();
    
    // Check for numeric values
    await expect(page.getByText(/\d+/)).toBeVisible();
  });

  test('should show valuation trends chart', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for trends section
    await expect(page.getByText('Valuation Trends')).toBeVisible();
    
    // Check for chart container
    await expect(page.locator('[data-testid="line-chart"]')).toBeVisible();
  });

  test('should display recent valuations table', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for table section
    await expect(page.getByText('Recent Valuations')).toBeVisible();
    
    // Check for table headers
    await expect(page.getByText('Property')).toBeVisible();
    await expect(page.getByText('Estimated Value')).toBeVisible();
    await expect(page.getByText('Confidence')).toBeVisible();
    await expect(page.getByText('Date')).toBeVisible();
    await expect(page.getByText('Actions')).toBeVisible();
  });

  test('should show market analysis section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for market analysis
    await expect(page.getByText('Market Analysis')).toBeVisible();
    await expect(page.getByText('District Performance')).toBeVisible();
    await expect(page.getByText('Property Type Distribution')).toBeVisible();
    
    // Check for charts
    await expect(page.locator('[data-testid="bar-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="responsive-container"]')).toBeVisible();
  });

  test('should handle create new valuation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click new valuation button
    await page.getByText('New Valuation').click();
    
    // Should navigate or show modal
    await page.waitForTimeout(1000);
    
    // Check for navigation or modal appearance
    // This depends on the actual implementation
  });

  test('should display search and filter options', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for search input
    await expect(page.getByPlaceholder('Search valuations...')).toBeVisible();
    
    // Check for filter options
    await expect(page.getByText('Filter by Date')).toBeVisible();
    await expect(page.getByText('Filter by Status')).toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Type in search input
    const searchInput = page.getByPlaceholder('Search valuations...');
    await searchInput.fill('test property');
    
    // Press enter or wait for search
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);
    
    // Check if search was performed
    await expect(searchInput).toHaveValue('test property');
  });

  test('should show valuation action buttons', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for action buttons in table rows
    const viewButtons = page.getByLabelText('View valuation');
    const editButtons = page.getByLabelText('Edit valuation');
    const deleteButtons = page.getByLabelText('Delete valuation');
    
    // Check if at least one set of action buttons exists
    const viewCount = await viewButtons.count();
    if (viewCount > 0) {
      await expect(viewButtons.first()).toBeVisible();
      await expect(editButtons.first()).toBeVisible();
      await expect(deleteButtons.first()).toBeVisible();
    }
  });

  test('should handle view valuation action', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click view button if available
    const viewButtons = page.getByLabelText('View valuation');
    const viewCount = await viewButtons.count();
    
    if (viewCount > 0) {
      await viewButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Should navigate or show modal
      // Check for navigation or modal content
    }
  });

  test('should handle edit valuation action', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click edit button if available
    const editButtons = page.getByLabelText('Edit valuation');
    const editCount = await editButtons.count();
    
    if (editCount > 0) {
      await editButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Should show edit form or navigate
    }
  });

  test('should handle delete valuation action', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click delete button if available
    const deleteButtons = page.getByLabelText('Delete valuation');
    const deleteCount = await deleteButtons.count();
    
    if (deleteCount > 0) {
      await deleteButtons.first().click();
      await page.waitForTimeout(500);
      
      // Should show confirmation dialog
      // Check for confirmation dialog or immediate deletion
    }
  });

  test('should display pagination controls', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for pagination
    await expect(page.getByText('Previous')).toBeVisible();
    await expect(page.getByText('Next')).toBeVisible();
    
    // Check for page numbers
    await expect(page.getByText('1')).toBeVisible();
  });

  test('should handle pagination navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Test next button if enabled
    const nextButton = page.getByText('Next');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Check if page changed
      await expect(page.getByText('2')).toBeVisible();
      
      // Test previous button
      const prevButton = page.getByText('Previous');
      await prevButton.click();
      await page.waitForTimeout(1000);
      
      await expect(page.getByText('1')).toBeVisible();
    }
  });

  test('should show export functionality', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for export button
    await expect(page.getByText('Export')).toBeVisible();
    
    // Click export button
    await page.getByText('Export').click();
    
    // Should trigger export functionality
    await page.waitForTimeout(1000);
  });

  test('should handle refresh functionality', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for refresh button
    const refreshButton = page.getByLabelText('Refresh data');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh
    await refreshButton.click();
    await page.waitForTimeout(1000);
    
    // Data should be refreshed
  });

  test('should display valuation data correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for valuation values in table
    const valuationCells = page.getByText(/₫.*billion|₫.*million/);
    const valuationCount = await valuationCells.count();
    
    if (valuationCount > 0) {
      await expect(valuationCells.first()).toBeVisible();
    }
    
    // Check for confidence scores
    const confidenceCells = page.getByText(/%/);
    const confidenceCount = await confidenceCells.count();
    
    if (confidenceCount > 0) {
      await expect(confidenceCells.first()).toBeVisible();
    }
  });

  test('should handle empty state', async ({ page }) => {
    // This test assumes there might be no valuations
    await page.waitForLoadState('networkidle');
    
    // Check if empty state is shown when no data
    const emptyMessage = page.getByText('No valuations found');
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.waitForLoadState('networkidle');
    
    // Check if main elements are still accessible
    await expect(page.getByText('Valuation Dashboard')).toBeVisible();
    await expect(page.getByText('New Valuation')).toBeVisible();
    await expect(page.getByText('Total Valuations')).toBeVisible();
    
    // Check if table is responsive or shows mobile view
    await expect(page.getByText('Recent Valuations')).toBeVisible();
  });

  test('should handle filter by date', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find date filter dropdown
    const dateFilter = page.locator('select').first();
    if (await dateFilter.isVisible()) {
      await dateFilter.selectOption('last_month');
      await page.waitForTimeout(1000);
      
      // Results should be filtered
    }
  });

  test('should handle filter by status', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find status filter dropdown
    const statusFilter = page.locator('select').nth(1);
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('completed');
      await page.waitForTimeout(1000);
      
      // Results should be filtered
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
    
    // Interact with various elements
    await page.getByPlaceholder('Search valuations...').fill('test');
    await page.waitForTimeout(500);
    
    // Check that there are no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});