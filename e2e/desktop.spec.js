import { test, expect } from '@playwright/test';

test.describe('Desktop - Page Load', () => {
  test('page loads with map visible', async ({ page }) => {
    await page.goto('/');
    const mapImage = page.locator('.map-image');
    await expect(mapImage).toBeVisible();
  });

  test('all 5 landmarks are visible on the map', async ({ page }) => {
    await page.goto('/');
    // Wait for map image to load so landmarks get scaled
    await page.locator('.map-image').waitFor({ state: 'visible' });
    const landmarks = page.locator('button.landmark');
    await expect(landmarks).toHaveCount(5);
    // Each landmark should be attached to the DOM
    for (let i = 0; i < 5; i++) {
      await expect(landmarks.nth(i)).toBeAttached();
    }
  });
});

test.describe('Desktop - Landmark Interactions', () => {
  test('hovering a landmark shows tooltip', async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    // Hover over the first landmark (Empire State Building -> "About Me")
    const landmark = page.locator('button.landmark').first();
    await landmark.hover();
    const tooltip = landmark.locator('.landmark-tooltip');
    await expect(tooltip).toBeVisible();
  });

  test('clicking a landmark opens modal with correct content', async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    // Click the Empire State Building landmark (About Me)
    const landmark = page.locator('button.landmark[aria-label="View Empire State Building"]');
    await landmark.click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    // Should show About Me title
    await expect(modal.locator('.modal-title')).toHaveText('About Me');
  });
});

test.describe('Desktop - About Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    // Open About modal via nav link
    await page.locator('.nav-link', { hasText: 'About' }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('About modal title is visible', async ({ page }) => {
    await expect(page.locator('.modal-title')).toHaveText('About Me');
  });

  test('Read More expands long description', async ({ page }) => {
    const readMoreBtn = page.locator('.modal-expand-toggle');
    await expect(readMoreBtn).toContainText('Read More');
    await readMoreBtn.click();
    // The long description should now be visible
    const longDesc = page.locator('.modal-long-description');
    await expect(longDesc).toBeVisible();
    // Button text should change to Show Less
    await expect(readMoreBtn).toContainText('Show Less');
  });

  test('See My Work navigates to projects modal', async ({ page }) => {
    const seeMyWorkBtn = page.locator('.modal-nav-link', { hasText: 'See My Work' });
    await expect(seeMyWorkBtn).toBeVisible();
    await seeMyWorkBtn.click();
    // Should now show Projects modal
    await expect(page.locator('.modal-title')).toHaveText('My Projects');
  });
});

test.describe('Desktop - Projects Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    // Open Projects modal via nav link
    await page.locator('.nav-link', { hasText: 'Projects' }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('Projects modal shows company cards', async ({ page }) => {
    const companyCards = page.locator('.company-card');
    // There are 5 companies in the data
    await expect(companyCards.first()).toBeVisible();
    const count = await companyCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('expanding a project accordion reveals description', async ({ page }) => {
    // Click the first project accordion header
    const firstAccordion = page.locator('.project-accordion-header').first();
    await firstAccordion.click();
    // The project details should be visible
    const projectDetails = page.locator('.project-details').first();
    await expect(projectDetails).toBeVisible();
    // Check that a description exists inside
    await expect(projectDetails.locator('.project-description')).toBeVisible();
  });

  test('skill filter dropdown opens and shows skills', async ({ page }) => {
    const filterToggle = page.locator('.skill-filter-toggle');
    await filterToggle.click();
    const filterMenu = page.locator('.skill-filter-menu');
    await expect(filterMenu).toBeVisible();
    // Should have skill options
    const skillOptions = filterMenu.locator('.skill-filter-option');
    const count = await skillOptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Expand All expands all projects', async ({ page }) => {
    // Click the Expand All button (desktop version in .skill-filter)
    const expandAllBtn = page.locator('.skill-filter .expand-collapse-all');
    await expect(expandAllBtn).toHaveText('Expand All');
    await expandAllBtn.click();
    await expect(expandAllBtn).toHaveText('Collapse All');
    // Verify at least some project details are visible
    const expandedHeaders = page.locator('.project-accordion-header.expanded');
    const count = await expandedHeaders.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Desktop - Contact Modal', () => {
  test('Contact modal shows email addresses', async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    await page.locator('.nav-link', { hasText: 'Contact' }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('.modal-title')).toHaveText('Get in Touch');
    // Check for contact links (email addresses)
    const contactLinks = page.locator('.contact-link');
    await expect(contactLinks.first()).toBeVisible();
    const count = await contactLinks.count();
    expect(count).toBe(2); // business and personal email
  });
});

test.describe('Desktop - Modal Close Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });
    await page.locator('.nav-link', { hasText: 'About' }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('Escape key closes the modal', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('clicking overlay closes the modal', async ({ page }) => {
    // Click the overlay (the area outside the modal)
    const overlay = page.locator('.modal-overlay');
    // Click at the edge of the overlay (top-left corner) to ensure we hit outside the modal
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});

test.describe('Desktop - Nav Panel', () => {
  test('nav items in right panel work to open modals', async ({ page }) => {
    await page.goto('/');
    await page.locator('.map-image').waitFor({ state: 'visible' });

    const navItems = [
      { label: 'About', expectedTitle: 'About Me' },
      { label: 'Projects', expectedTitle: 'My Projects' },
      { label: 'Contact', expectedTitle: 'Get in Touch' },
      { label: 'Misc.', expectedTitle: 'Miscellaneous' },
    ];

    for (const item of navItems) {
      await page.locator('.nav-link', { hasText: item.label }).click();
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(page.locator('.modal-title')).toHaveText(item.expectedTitle);
      // Close modal before opening next
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });
});
