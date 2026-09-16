const { test, expect } = require('@playwright/test');
const canonical = 'https://arcadebloom.com/play/circle-club/';

test('game explains itself to crawlers without JavaScript and fits phones', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto('/play/circle-club/?score=92&mode=daily&day=2026-09-17');
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('Circle Club — Free Draw a Perfect Circle Game');
    await expect(page.locator('h1')).toContainText('Draw a perfect');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
    await expect(page.getByRole('heading', { name: 'How is the circle score calculated?' })).toBeVisible();
    await expect(page.locator('.game-guide')).toContainText('not verified leaderboard results');
    await expect(page.locator('.script-note')).toContainText('Enable JavaScript');
    await page.screenshot({ path: 'test-results/screenshots/circle-seo-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: 'test-results/screenshots/circle-seo-mobile.png', fullPage: true });
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    const game = graph.find(node => node['@type'] === 'VideoGame');
    expect(game['@id']).toBe(canonical + '#game');
    expect(game.isAccessibleForFree).toBe(true);
    expect(game).not.toHaveProperty('aggregateRating');
    expect(game).not.toHaveProperty('datePublished');
    const imagePath = new URL(await page.locator('meta[property="og:image"]').getAttribute('content')).pathname;
    expect((await page.request.get(imagePath)).status()).toBe(200);
    await context.close();
});

test('discovery and catalogue agree on the hosted game identity', async ({ page, request }) => {
    await page.goto('/game/circle-club/');
    const game = (await page.locator('script[type="application/ld+json"]').allTextContents())
        .map(text => JSON.parse(text)).find(node => node['@type'] === 'VideoGame');
    expect(game['@id']).toBe(canonical + '#game');
    expect(game.url).toBe(canonical);
    expect(await (await request.get('/sitemap.xml')).text()).toContain(`<loc>${canonical}</loc>`);
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toContain(canonical);
    expect(llms).not.toContain('We never host');
    expect(await (await request.get('/robots.txt')).text()).toContain('Allow: /');
});
