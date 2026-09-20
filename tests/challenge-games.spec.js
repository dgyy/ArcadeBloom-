const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const engine = () => import(pathToFileURL(path.resolve('games/_shared/engine.js')).href);

test('seeded courses, wraparound scoring and malformed challenges', async () => {
    const { seeded, lockRound, lockResult, echoRound, echoPoints, challenge } = await engine();
    const a = seeded('d-2026-09-19'), b = seeded('d-2026-09-19');
    expect(Array.from({ length: 20 }, (_, r) => lockRound(a, r))).toEqual(Array.from({ length: 20 }, (_, r) => lockRound(b, r)));
    expect(lockResult(359, 1, 30).hit).toBe(true);
    expect(lockResult(120, 120, 30).points).toBe(300);
    expect(lockResult(90, 120, 30).hit).toBe(false);
    expect(echoRound(seeded('fixed'), 6)).toMatchObject({ reverse: true, sequence: expect.any(Array) });
    expect(echoRound(seeded('fixed'), 6).sequence).toHaveLength(6);
    expect(echoRound(seeded('fixed'), 5)).toMatchObject({ mirror: true, sequence: expect.any(Array) });
    expect(echoPoints(3, 1, true)).toBe(125);
    expect(challenge('?seed=d-2026-02-31&score=10')).toBeNull();
    expect(challenge('?seed=p-test&score=Infinity')).toEqual({ seed: 'p-test', score: null });
    expect(challenge('?seed=p-test&score=150')).toEqual({ seed: 'p-test', score: 150 });
});

test('Pulse Lock complete run, pause, share and export', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.clock.install();
    await page.goto('/play/pulse-lock/?seed=p-test&score=100');
    const { seeded, lockRound } = await engine(); const random = seeded('p-test');
    await page.locator('#action').click();
    await page.locator('#pause').click();
    const frozen = await page.locator('#needle').getAttribute('transform');
    await page.clock.runFor(2000);
    expect(await page.locator('#needle').getAttribute('transform')).toBe(frozen);
    await page.locator('#action').click();
    for (let round = 0; round < 20; round++) {
        const course = lockRound(random, round);
        const transform = await page.locator('#needle').getAttribute('transform');
        const angle = Number(transform.match(/rotate\(([-.\d]+)/)[1]);
        const distance = course.direction === 1 ? (course.target - angle + 360) % 360 : (angle - course.target + 360) % 360;
        await page.clock.runFor(Math.round(distance / course.speed * 1000) + 16);
        await page.locator('#action').click();
        if (round < 19) await page.locator('#action').click();
    }
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#round-log li')).toHaveCount(20);
    expect(Number((await page.locator('#final-score').textContent()).replaceAll(',', ''))).toBeGreaterThan(6000);
    await page.locator('#share').click();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(link).searchParams.get('seed')).toBe('p-test');
    const download = page.waitForEvent('download'); await page.locator('#save').click();
    expect((await download).suggestedFilename()).toMatch(/^pulse-lock-\d+\.png$/);
    await page.locator('#again').click();
    await expect(page.locator('#results')).toBeHidden();
    await expect(page.locator('#round')).toHaveText('1 / 20');
    await page.reload(); await expect(page.locator('#best')).not.toHaveText('—');
    expect(errors).toEqual([]);
});

test('Echo Vault completes all twelve chambers including reverse and mirror recall', async ({ page }) => {
    await page.clock.install();
    await page.goto('/play/echo-vault/?seed=p-test');
    const { seeded, echoRound } = await engine(); const random = seeded('p-test');
    await page.locator('#action').click();
    for (let round = 0; round < 12; round++) {
        const course = echoRound(random, round);
        await page.clock.runFor(10000);
        const sequence = (course.reverse ? [...course.sequence].reverse() : course.sequence).map(cell => course.mirror ? (cell % 3 === 0 ? cell + 2 : cell % 3 === 2 ? cell - 2 : cell) : cell);
        for (const cell of sequence) await page.keyboard.press(String(cell + 1));
        if (round < 11) await page.locator('#action').click();
    }
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#final-score')).toHaveText('7,200');
    await expect(page.locator('#round-log li')).toHaveCount(12);
    await page.locator('#clear-records').click();
    await expect(page.locator('#best')).toHaveText('—');
});

test('Pulse timeouts end a run after three missed locks', async ({ page }) => {
    await page.clock.install();
    await page.goto('/play/pulse-lock/?seed=p-timeout');
    await page.locator('#action').click();
    for (let i = 0; i < 3; i++) {
        await page.clock.runFor(13000);
        if (i < 2) await page.locator('#action').click();
    }
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#final-score')).toHaveText('0');
    await expect(page.locator('#round-log li')).toHaveCount(3);
});

test('new games participate in homepage, directory, sitemap and AI discovery', async ({ page, request }) => {
    await page.goto('/');
    for (const slug of ['pulse-lock', 'echo-vault']) {
        await expect(page.locator(`#play-here a[href="/play/${slug}/"]`).last()).toBeVisible();
        expect((await request.get(`/media/${slug}.png`)).status()).toBe(200);
        await page.goto(`/game/${slug}/`);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
        await expect(page.getByRole('link', { name: 'Play Game', exact: true }).first()).toHaveAttribute('href', `/play/${slug}/`);
        await page.goto('/');
    }
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/play/pulse-lock/');
    expect(sitemap).toContain('/play/echo-vault/');
    await page.goto('/ai-games/');
    await expect(page.getByRole('link', { name: /Pulse Lock/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Echo Vault/ }).first()).toBeVisible();
});

test('hosted games reserve labelled ad rails only on wide desktops', async ({ browser }) => {
    for (const slug of ['pulse-lock', 'echo-vault', 'circle-club']) {
        const desktop = await browser.newPage({ viewport: { width: 1700, height: 900 } });
        await desktop.route('https://pagead2.googlesyndication.com/**', route => route.abort());
        await desktop.goto(`/play/${slug}/`);
        await expect(desktop.locator('.game-side-ad')).toHaveCount(2);
        await expect(desktop.locator('.game-side-ad .adsbygoogle[data-ad-slot="1115845392"]')).toHaveCount(2);
        await expect(desktop.getByLabel('Left advertisement')).toBeVisible();
        await expect(desktop.getByLabel('Right advertisement')).toBeVisible();
        await desktop.close();

        const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await mobile.goto(`/play/${slug}/`);
        await expect(mobile.locator('.game-side-ad')).toHaveCount(0);
        expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await mobile.close();
    }
});

test('Echo replay penalty, wrong inputs and clipboard fallback', async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }));
    await page.goto('/play/echo-vault/?seed=p-test');
    const { seeded, echoRound } = await engine(); const random = seeded('p-test'); const first = echoRound(random, 0);
    await page.locator('#action').click(); await page.clock.runFor(10000);
    await page.locator('#replay').click(); await page.clock.runFor(10000);
    await expect(page.locator('#replay')).toBeDisabled();
    for (const cell of first.sequence) await page.keyboard.press(String(cell + 1));
    await expect(page.locator('#score')).toHaveText('200');
    await page.locator('#action').click(); await page.clock.runFor(10000);
    const second = echoRound(random, 1);
    const wrong = (second.sequence[0] + 1) % 9;
    for (let i = 0; i < 3; i++) await page.keyboard.press(String(wrong + 1));
    await expect(page.locator('#results')).toBeVisible();
    await page.locator('#share').click();
    await expect(page.locator('#copy-link')).toHaveValue(/seed=p-test&score=200/);
});

test('interrupted Echo playback resumes without consuming a replay', async ({ page }) => {
    await page.clock.install();
    await page.goto('/play/echo-vault/?seed=p-test');
    await page.locator('#action').click(); await page.clock.runFor(700);
    await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(page.locator('#action')).toHaveText('Resume playback');
    await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: false }));
    await page.locator('#action').click(); await page.clock.runFor(10000);
    await expect(page.locator('#replay')).toBeEnabled();
    const { seeded, echoRound } = await engine();
    for (const cell of echoRound(seeded('p-test'), 0).sequence) await page.keyboard.press(String(cell + 1));
    await expect(page.locator('#score')).toHaveText('300');
});

for (const slug of ['pulse-lock', 'echo-vault']) {
    test(`${slug} works on mobile with storage denied and has crawlable instructions`, async ({ page, browser }) => {
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.setViewportSize({ width: 390, height: 844 });
        await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('denied'); } }));
        const response = await page.goto(`/play/${slug}/`);
        expect(response.status()).toBe(200);
        await page.locator('#action').click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: `test-results/screenshots/${slug}-mobile.png`, fullPage: true });
        expect(errors).toEqual([]);
        const context = await browser.newContext({ javaScriptEnabled: false }); const staticPage = await context.newPage();
        await staticPage.goto(`/play/${slug}/?seed=p-test&score=20`);
        await expect(staticPage.locator('#how-to-play')).toContainText('Scores are editable URL values');
        await expect(staticPage.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://arcadebloom.com/play/${slug}/`);
        await context.close();
    });
}
