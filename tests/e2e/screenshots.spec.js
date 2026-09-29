import { test, expect } from '@playwright/test';

// Captures pour le README et les vitrines (yrbane.github.io/shots/)
test('capture de la page', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/is-ready/);
  await page.locator('.joke[data-id="akontenimportekwa"] button.pill').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `shots/mrmme-${testInfo.project.name}.png`, fullPage: testInfo.project.name === 'desktop' });
});
