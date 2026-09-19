const { test, expect } = require('@playwright/test');
const games = require('../src/_data/games');
const { createDirectoryPolicy } = require('../scripts/lib/directory-policy');
const circle = games.find(game => game.slug === 'circle-club');

test('hosting exception keeps unrelated local URLs excluded', () => {
    expect(createDirectoryPolicy([circle])(circle.sourceKey)).toBe(true);
    for (const change of [{ slug: 'other' }, { sourceKey: 'other:game' }, { sourceUrl: 'https://arcadebloom.com/play/other/' }, { about: 'Short' }]) {
        const entry = { ...circle, ...change };
        expect(createDirectoryPolicy([entry])(entry.sourceKey)).toBe(false);
    }
});

test('homepage and directory lead to a working game with shareable scores', async ({ page, context }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const playCircle = page.locator('#play-here .btn-primary').filter({ hasText: 'Play Circle Club' });
    await expect(playCircle).toBeVisible();
    await expect(page.locator('#picks').getByRole('link', { name: /Circle Club/ })).toHaveCount(0);
    await page.screenshot({ path: 'test-results/screenshots/home-after.png', fullPage: true });
    await playCircle.click();
    await expect(page.locator('#canvas')).toBeVisible();
    const box = await page.locator('#canvas').boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2, r = Math.min(box.width, box.height) * .28;
    await page.mouse.move(cx + r, cy);
    await page.mouse.down();
    for (let i = 1; i <= 90; i++) {
        await page.mouse.move(cx + r * Math.cos(i * Math.PI / 45), cy + r * Math.sin(i * Math.PI / 45));
    }
    await page.mouse.up();
    await expect(page.locator('#result')).toBeVisible();
    expect(Number(await page.locator('#score').textContent())).toBeGreaterThan(95);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('#share').click();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(link).pathname).toBe('/play/circle-club/');
    expect(new URL(link).searchParams.has('score')).toBe(true);
    await page.goto(link);
    await expect(page.locator('#challenge')).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'test-results/screenshots/circle-mobile.png', fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto('/game/circle-club/');
    await expect(page.getByRole('link', { name: 'Play Game', exact: true }).first()).toHaveAttribute('href', '/play/circle-club/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(errors).toEqual([]);
});
