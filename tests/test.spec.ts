import { test, expect } from '@playwright/test';

test('homepage loads and shows title', async ({ page }) => {
  // Adjust the URL if you use a custom dev server port
  await page.goto('http://localhost:5175');
  // Expect the title to contain the app name
  await expect(page.title()).toContain('LiteVM DEX');
  // Expect a heading to be visible
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('LiteVM DEX');
});