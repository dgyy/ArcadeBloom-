const { test, expect } = require('@playwright/test');
const games = require('../src/_data/games');
const { hostedPath } = require('../scripts/lib/hosted-games');
const { createDirectoryPolicy } = require('../scripts/lib/directory-policy');
const indexable = createDirectoryPolicy(games);
const hosted = games.filter(game => hostedPath(game) && indexable(game.sourceKey));

test('homepage offers a bounded showcase and a complete hosted library without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#play-here .btn-primary')).toHaveCount(Math.min(5, hosted.length));
    const headings = await page.locator('main h3').allTextContents();
    expect(new Set(headings).size).toBe(headings.length);
    await page.getByRole('link', { name: 'All our games' }).click();
    await expect(page).toHaveURL(/\/play\/$/);
    for (const game of hosted) {
        await expect(page.getByRole('link', { name: 'Play ' + game.name, exact: true })).toHaveAttribute('href', hostedPath(game));
    }
    await context.close();
});

test('homepage artwork loads and the layout fits mobile and desktop', async ({ page }) => {
    for (const width of [360, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/');
        await page.locator('.home-latest').scrollIntoViewIfNeeded();
        await expect.poll(() => page.locator('main img').evaluateAll(images =>
            images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
});
