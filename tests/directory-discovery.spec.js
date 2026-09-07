'use strict';
const { test, expect } = require('@playwright/test');

test('homepage exposes discovery, AI and creator routes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('small obsession');
    for (const href of ['/featured/', '/new/', '/ai-games/', '/submit/']) {
        await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
    }
    await expect(page.locator('main')).not.toContainText(/read the review/i);
});

test('AI types are distinct, with a dual-type game in both groups', async ({ page }) => {
    await page.goto('/ai-games/');
    await expect(page.locator('#ai-gameplay a[href="/game/ai-dungeon/"]')).toBeVisible();
    await expect(page.locator('#ai-assisted a[href="/game/ai-dungeon/"]')).toHaveCount(0);
    for (const group of ['ai-gameplay', 'ai-assisted']) {
        await expect(page.locator(`#${group} a[href="/game/circuits-royale/"]`)).toBeVisible();
    }
    await expect(page.locator('.ai-ledger')).toContainText('Games');
    await expect(page.getByText('How to read the labels')).toBeVisible();
    await expect(page.locator('header nav a[href="/ai-games/"]')).toHaveAttribute('aria-current', 'page');
});

test('AI game details explain the label and continue AI discovery', async ({ page }) => {
    await page.goto('/game/circuits-royale/');
    await expect(page.getByRole('heading', { name: 'Where AI appears' })).toBeVisible();
    await expect(page.locator('.ai-disclosure')).toContainText('During play');
    await expect(page.locator('.ai-disclosure')).toContainText('During production');
    await expect(page.getByRole('link', { name: /creator's explanation/i })).toHaveAttribute('rel', 'noopener nofollow');
    await expect(page.getByRole('heading', { name: 'More AI games' })).toBeVisible();
});

test('AI listing has attribution and all play actions keep the correct source', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/game/circuits-royale/');
    await expect(page.getByRole('heading', { name: 'Where AI appears' })).toBeVisible();
    await expect(page.getByRole('link', { name: /creator's explanation/i })).toHaveAttribute('href', /blog.puzzmo.com/);
    const links = page.locator('[data-play-slug]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
        await expect(link).toHaveAttribute('href', 'https://royale.circuitsgame.com/');
        await expect(link).toHaveAttribute('data-play-slug', 'circuits-royale');
        await expect(link).toHaveAttribute('rel', 'noopener nofollow');
    }
    await expect(page.locator('main')).not.toContainText(/free ·|reviewed here|frequently asked questions/i);
});

test('unknown release dates are omitted from structured data', async ({ page }) => {
    await page.goto('/game/ai-dungeon/');
    const records = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(JSON.parse);
    expect(records.find((record) => record['@type'] === 'VideoGame')).not.toHaveProperty('datePublished');
});

test('historical stubs remain browsable without promising a future review', async ({ page }) => {
    for (const slug of ['memorygame', '13-blades', '100days100projects', '0hh1']) {
        await page.goto(`/game/${slug}/`);
        await expect(page.locator('main')).not.toContainText(/full review will follow|full review is pending|factual placeholder/i);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    }
});

test('submission prepares a local, encoded email draft without claiming to send', async ({ page }) => {
    await page.goto('/submit/');
    await page.getByLabel('Game name', { exact: false }).fill('A & B <game>');
    await page.getByLabel('Official play URL', { exact: false }).fill('https://example.com/game/?a=1&b=2');
    await page.getByLabel('Creator or studio', { exact: false }).fill('Test Creator');
    await page.getByLabel('What makes it interesting?', { exact: false }).fill('A tiny browser experiment. No invented credentials.');
    await page.getByLabel('How is AI used?').selectOption('Both');
    await page.getByLabel("Creator's AI explanation", { exact: false }).fill('https://example.com/devlog/');
    await page.getByRole('button', { name: 'Prepare email draft' }).click();
    await expect(page.getByRole('status')).toContainText('Nothing has been sent');
    const mailto = new URL(await page.getByRole('link', { name: 'Open email app' }).getAttribute('href'));
    expect(mailto.protocol).toBe('mailto:');
    expect(mailto.pathname).toBe('hello@arcadebloom.com');
    expect(mailto.searchParams.get('subject')).toBe('Game submission: A & B <game>');
    expect(mailto.searchParams.get('body')).toContain('AI use: Both');
    await expect(page.getByLabel('Email draft', { exact: true })).toHaveValue(mailto.searchParams.get('body'));
});

test('AI Dungeon scenario submissions require a Published creator-authorized entry', async ({ page }) => {
    await page.goto('/submit/');
    await expect(page.getByText('we do not bulk-import Discover', { exact: false })).toBeVisible();
    await page.getByLabel('Submission type').selectOption('Published AI Dungeon scenario');
    await expect(page.getByRole('group', { name: 'AI Dungeon scenario details' })).toBeVisible();
    await page.getByLabel('Game name', { exact: false }).fill('A Published Scenario');
    await page.getByLabel('Official play URL', { exact: false }).fill('https://play.aidungeon.com/scenario/example');
    await page.getByLabel('Creator or studio', { exact: false }).fill('Scenario Creator');
    await page.getByLabel('What makes it interesting?', { exact: false }).fill('A creator-submitted scenario with a stable public link.');
    await page.getByLabel('How is AI used?').selectOption('AI gameplay');
    await page.getByLabel("Creator's AI explanation", { exact: false }).fill('https://help.aidungeon.com/faq/what-are-scenarios');
    await page.getByLabel('Published content rating', { exact: false }).selectOption('Teen');
    await page.getByLabel('Creator permission', { exact: false }).selectOption('I am the scenario creator');
    await page.getByRole('button', { name: 'Prepare email draft' }).click();
    const draft = page.getByLabel('Email draft', { exact: true });
    await expect(draft).toHaveValue(/AI Dungeon content rating: Teen/);
    await expect(draft).toHaveValue(/Creator permission: I am the scenario creator/);
});

test('search can narrow results by AI use', async ({ page }) => {
    await page.goto('/search/?q=');
    await page.locator('.search-filters label').filter({ hasText: 'AI in play' }).click();
    await expect(page.locator('#search-results a[href="/game/ai-dungeon/"]')).toBeVisible();
    await expect(page.locator('#search-results a[href="/game/newdle/"]')).toHaveCount(0);
    await expect(page.locator('#search-summary')).toContainText('matches');
    await page.locator('.search-filters label').filter({ hasText: 'AI-assisted' }).click();
    await expect(page.locator('#search-results a[href="/game/newdle/"]')).toBeVisible();
    await expect(page.locator('#search-results a[href="/game/ai-dungeon/"]')).toHaveCount(0);
});

test('AI discovery and email instructions work without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://localhost:4173/ai-games/');
    await expect(page.locator('#ai-gameplay a[href="/game/ai-dungeon/"]')).toBeVisible();
    await page.goto('http://localhost:4173/submit/');
    await expect(page.getByRole('heading', { name: 'What to include in your email' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'hello@arcadebloom.com' })).toHaveAttribute('href', /^mailto:/);
    await expect(page.locator('#submission-form')).toBeHidden();
    await context.close();
});

test('discovery pages fit phone and tablet widths', async ({ page }) => {
    for (const width of [390, 768]) {
        await page.setViewportSize({ width, height: 900 });
        for (const url of ['/', '/ai-games/', '/submit/']) {
            await page.goto(url);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
    }
});
