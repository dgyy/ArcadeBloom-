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

test('content pages contain no inline advertisement slots', async ({ page }) => {
    for (const route of ['/', '/featured/', '/new/', '/category/arcade/', '/game/hextris/']) {
        await page.goto(route);
        await expect(page.locator('main ins.adsbygoogle')).toHaveCount(0);
        await expect(page.locator('#game-inline-ad')).toHaveCount(0);
    }
});
