import { test, expect } from '@playwright/test';

test.describe('Mobile - Page Load', () => {
  test('page loads with shooting star menu button visible', async ({ page }) => {
    await page.goto('/');
    const starBtn = page.locator('.mobile-menu-btn');
    await expect(starBtn).toBeVisible();
  });
});

test.describe('Mobile - Menu Interactions', () => {
  test('tapping star button opens right panel menu', async ({ page }) => {
    await page.goto('/');
    const starBtn = page.locator('.mobile-menu-btn');
    await starBtn.click();
    const rightPanel = page.locator('.right-panel');
    await expect(rightPanel).toHaveClass(/open/);
  });

  test('nav links in right panel open modals', async ({ page }) => {
    await page.goto('/');
    // Open the menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.right-panel')).toHaveClass(/open/);

    // Click About nav link
    await page.locator('.nav-link', { hasText: 'About' }).click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(page.locator('.modal-title')).toHaveText('About Me');
  });

  test('star button in menu closes the menu on mobile', async ({ page }) => {
    await page.goto('/');
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.right-panel')).toHaveClass(/open/);

    // Click the star icon inside the right panel to close menu
    const starIcon = page.locator('.right-panel .star-icon');
    await starIcon.click();
    // Menu should close (right-panel loses 'open' class)
    await expect(page.locator('.right-panel')).not.toHaveClass(/open/);
  });
});

test.describe('Mobile - Landmark Interactions', () => {
  test('tapping a landmark opens modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    // Tap a landmark
    const landmark = page.locator('button.landmark').first();
    await landmark.click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('modal is functional on mobile viewport', async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    // Open About modal via landmark
    const aboutLandmark = page.locator('button.landmark[aria-label="View Empire State Building"]');
    await aboutLandmark.click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(page.locator('.modal-title')).toHaveText('About Me');
    // Close button should work
    await page.locator('.modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});

test.describe('Mobile - Portrait Interactions', () => {
  test('tapping portrait opens mobile profile menu', async ({ page }) => {
    await page.goto('/');
    // Tap the portrait button
    const portrait = page.locator('.portrait-button');
    await portrait.click();
    // Mobile profile menu should appear
    const profileMenu = page.locator('.mobile-profile-menu');
    await expect(profileMenu).toBeVisible();
    // Should show the name
    await expect(page.locator('.profile-name-mobile')).toHaveText('Adam');
  });
});
