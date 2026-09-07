const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('every tag link in built game pages has a destination', () => {
    const root = path.resolve(__dirname, '../dist');
    for (const slug of fs.readdirSync(path.join(root, 'game'))) {
        const html = fs.readFileSync(path.join(root, 'game', slug, 'index.html'), 'utf8');
        for (const match of html.matchAll(/href="(\/tag\/[^"?#]+)"/g)) {
            expect(fs.existsSync(path.join(root, match[1], 'index.html')), match[1]).toBe(true);
        }
    }
});

test('archive is noindex and navigation respects category threshold', async ({ page }) => {
    await page.goto('/catalogue/archive/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('main a[href="/game/memorygame/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/category/puzzle/"]')).toHaveCount(0);
    await expect(page.locator('footer a[href="/category/arcade/"]')).toBeVisible();
});

test('inline ad follows viewport changes without duplicate slots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/game/hextris/');
    const ad = page.locator('#game-inline-ad');
    await expect(ad).toBeHidden();
    await page.setViewportSize({ width: 1000, height: 900 });
    await expect(ad).toBeVisible();
    await expect(ad.locator('ins')).toHaveCount(1);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(ad).toBeHidden();
    await page.setViewportSize({ width: 1000, height: 900 });
    await expect(ad).toBeVisible();
    await expect(ad.locator('ins')).toHaveCount(1);
});
