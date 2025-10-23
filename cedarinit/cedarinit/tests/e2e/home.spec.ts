import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section', async ({ page }) => {
    const hero = await page.locator('header .hero');
    await expect(hero).toBeVisible();
  });

  test('should display the mission statement', async ({ page }) => {
    const mission = await page.locator('section.mission');
    await expect(mission).toHaveText(/mission statement/i);
  });

  test('should display key performance indicators', async ({ page }) => {
    const kpi = await page.locator('section.kpi');
    await expect(kpi).toBeVisible();
  });

  test('should navigate to the About page', async ({ page }) => {
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL(/about/);
  });

  test('should open the gallery lightbox', async ({ page }) => {
    await page.click('a.lightbox-trigger');
    const lightbox = await page.locator('.lightbox');
    await expect(lightbox).toBeVisible();
    await page.press('Escape');
    await expect(lightbox).not.toBeVisible();
  });
});