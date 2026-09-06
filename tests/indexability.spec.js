// ADR-0011: directory metadata controls public indexing; no gameplay assessment.
'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const { createDirectoryPolicy, validateAiMetadata } = require('../scripts/lib/directory-policy.js');
const hextris = games.find((game) => game.slug === 'hextris');
const isIndexable = createDirectoryPolicy(games);

test('useful sourced content is indexable without an evidence record', () => {
    expect(createDirectoryPolicy([hextris])(hextris.sourceKey)).toBe(true);
    expect(createDirectoryPolicy([{ ...hextris, about: hextris.about + ' Controls vary depending on your device.' }])(hextris.sourceKey)).toBe(true);
});

test('missing attribution, short copy, placeholders and explicit exclusions stay noindex', () => {
    for (const override of [
        { sourceName: '' }, { sourceUrl: 'javascript:alert(1)' },
        { sourceUrl: 'https://arcadebloom.com/game/hextris/' },
        { about: 'Too short.' }, { howToPlay: 'Instructions pending.' },
        { about: hextris.about + ' Placeholder.' },
        { directoryStatus: 'draft' }, { directoryStatus: 'unlisted' },
    ]) {
        expect(createDirectoryPolicy([{ ...hextris, ...override }])(hextris.sourceKey)).toBe(false);
    }
});

test('unknown keys and duplicate source identities or URLs fail closed', () => {
    expect(isIndexable('unknown:game')).toBe(false);
    const policy = createDirectoryPolicy([hextris, { ...hextris, slug: 'copy' }]);
    expect(policy(hextris.sourceKey)).toBe(false);
    const duplicate = { ...hextris, slug: 'copy', sourceKey: 'url:duplicate' };
    const urls = createDirectoryPolicy([hextris, duplicate]);
    expect(urls(hextris.sourceKey)).toBe(false);
    expect(urls(duplicate.sourceKey)).toBe(false);
});

test('AI labels require specific creator disclosures and controlled types', () => {
    const ai = games.find((game) => game.slug === 'circuits-royale').ai;
    expect(validateAiMetadata(ai)).toEqual([]);
    expect(validateAiMetadata(undefined)).toEqual([]);
    for (const override of [
        { types: ['looks-ai'] }, { types: [] }, { types: ['ai-gameplay', 'ai-gameplay'] },
        { sourceUrl: 'javascript:alert(1)' }, { note: '' }, { checkedDate: '' }, { checkedDate: '2026-02-31' },
    ]) expect(validateAiMetadata({ ...ai, ...override }).length).toBeGreaterThan(0);
});

test('built robots and sitemap agree for every catalogue entry', () => {
    const root = path.resolve(__dirname, '../dist');
    const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    let qualified = 0;
    let stubs = 0;
    for (const game of games) {
        const eligible = isIndexable(game.sourceKey);
        eligible ? qualified++ : stubs++;
        const html = fs.readFileSync(path.join(root, 'game', game.slug, 'index.html'), 'utf8');
        expect(html).toContain(`name="robots" content="${eligible ? 'index' : 'noindex'}, follow"`);
        expect(sitemap.includes(`/game/${game.slug}/</loc>`)).toBe(eligible);
    }
    expect(qualified).toBeGreaterThan(0);
    expect(stubs).toBeGreaterThan(0);
});

test('AI and submission landing pages respect thin-content and utility exclusions', async ({ page }) => {
    for (const url of ['/ai-games/', '/submit/']) {
        await page.goto(url);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    }
    const sitemap = fs.readFileSync(path.resolve(__dirname, '../dist/sitemap.xml'), 'utf8');
    expect(sitemap).not.toContain('/ai-games/</loc>');
    expect(sitemap).not.toContain('/submit/</loc>');
});
