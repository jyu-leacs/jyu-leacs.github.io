import { test, expect } from '@playwright/test';

test('search, disciplines, and reset work', async ({ page }) => {
  await page.goto('/talks/');
  await page.locator('#search').fill('PsychoPy');
  await expect(page.locator('[data-talk]:visible')).toHaveCount(1);
  await page.locator('#search').fill('nothing matches');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page.locator('[data-reset]').click();
  await expect(page.locator('[data-talk]:visible')).toHaveCount(3);
  await page.locator('#topic').selectOption('Cognitive science');
  await expect(page.locator('[data-talk]:visible')).toHaveCount(1);
});
test('mobile navigation is accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation')).toBeHidden();
});
test('November seminar shows its month without inventing a date or calendar event', async ({ page }) => {
  await page.goto('/talks/vladislav-bespomoshchnov/');
  await expect(page.locator('.event-details')).toContainText('November 2026');
  await expect(page.locator('.event-details')).toContainText('Exact date and time to be announced');
  await expect(page.locator('.event-details time')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Add to calendar' })).toHaveCount(0);
  await expect(page.locator('.speaker-bio')).toContainText('Doctoral Research Fellow');
  await expect(page.locator('.speaker-bio img')).toHaveAttribute('src', '/content/images/vladislav-bespomoshchnov.jpg');
});
test('desktop navigation does not show the mobile menu button', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await expect(page.getByRole('navigation')).toBeVisible();
});
test('manager card includes portrait, biography, and external profile', async ({ page }) => {
  await page.goto('/about/');
  const manager = page.locator('.person-card').filter({ has: page.getByRole('heading', { name: 'Aaron Khodami, PhD' }) });
  await expect(manager.getByRole('heading', { name: 'Aaron Khodami, PhD' })).toBeVisible();
  await expect(manager.getByRole('link', { name: 'University profile' })).toHaveAttribute('href', 'https://www.jyu.fi/en/people/aaron-khodami');
  await expect(manager.locator('img')).toHaveAttribute('src', '/content/images/aaron-khodami.jpg');
  expect(await manager.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
});
test('talks display speaker photos, abstracts, and biographies', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-02T09:00:00Z') });
  await page.goto('/talks/psychopy-in-finland/');
  await expect(page.getByRole('heading', { name: 'Session Info', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About the speaker' })).toBeVisible();
  await expect(page.locator('.speaker-bio img')).toBeVisible();
  await expect(page.locator('.speaker-bio')).toContainText('Dr. Rebecca Hirst');
  await expect(page.locator('.event-details')).toContainText('30 October 2026');
  await expect(page.locator('.event-details')).toContainText('13:00 EET');
  await expect(page.locator('.event-details')).not.toContainText('End time to be confirmed');
  await expect(page.locator('.zoom-meeting-link')).not.toHaveAttribute('href');
  await expect(page.locator('.zoom-meeting-link')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('[data-meeting-notice]')).toContainText('30 October 2026 at 12:45 EET');
  await expect(page.locator('.registration-qr')).toHaveCount(0);
  await expect(page.locator('#registration')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Register for the workshop' })).toHaveAttribute('href', /^https:\/\/forms.cloud.microsoft\/Pages\/ResponsePage.aspx/);
  await expect(page.locator('.speaker-bio img')).toHaveAttribute('src', '/content/images/rebecca-hirst.webp');
});
for (const width of [320, 390, 768, 1440]) {
  test(`pages fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const url of ['/', '/about/', '/talks/', '/journal/', '/contact/', '/talks/psychopy-in-finland/']) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  });
}
test('programme remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:8080/talks/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('[data-talk]')).toHaveCount(3);
  await context.close();
});

test('Zoom activates at 12:45 Helsinki time on 30 October', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-30T10:44:59Z') });
  await page.goto('/talks/psychopy-in-finland/');
  const link = page.locator('.zoom-meeting-link');
  await expect(link).not.toHaveAttribute('href');
  await page.clock.runFor(1000);
  await expect(link).toHaveAttribute('href', 'https://jyufi.zoom.us/j/63496713773');
  await expect(link).not.toHaveAttribute('aria-disabled');
  await expect(page.locator('[data-meeting-notice]')).toBeHidden();
  await page.reload();
  await expect(link).toHaveAttribute('href', 'https://jyufi.zoom.us/j/63496713773');
});
