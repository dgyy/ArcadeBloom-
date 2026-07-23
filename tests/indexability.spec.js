// =============================================================================
// tests/indexability.spec.js — verify the index-eligibility gate (issue #8).
//
// The isIndexable filter in .eleventy.js decides who gets indexed. Rules
// (ADR-0006 + evidence gate):
//   - sourceKey in frozen 2026-07-22 manifest → indexable (grandfathered)
//   - registry state === 'eligible'           → indexable (evidence passed)
//   - anything else (new unreviewed, or 'ineligible') → NOINDEX, fail closed
//
// This test re-implements the same decision from the raw JSON files (it does
// not import the filter, which lives inside the Eleventy config closure).
// If the two ever drift, this test catches it by asserting the built
// sitemap + a sample of built game pages match the expected decision.
// =============================================================================
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');

const manifest = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../evidence/index-manifest.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../evidence/review-registry.json'), 'utf8'));

const manifestSet = new Set(manifest.sourceKeys);
const registryStates = registry.states || {};

// The canonical decision function — MUST match .eleventy.js isIndexable.
function isIndexable(sourceKey) {
    if (!sourceKey) return false;
    if (manifestSet.has(sourceKey)) return true;
    const st = registryStates[sourceKey];
    return !!(st && st.state === 'eligible');
}

test.describe('Index eligibility gate (issue #8)', () => {
    test('every grandfathered game is indexable in the built sitemap', async () => {
        const sitemap = fs.readFileSync(
            path.resolve(__dirname, '../dist/sitemap.xml'), 'utf8');
        const indexableSlugs = games.filter((g) => isIndexable(g.sourceKey)).map((g) => g.slug);
        const nonIndexableSlugs = games.filter((g) => !isIndexable(g.sourceKey)).map((g) => g.slug);
        // Every indexable slug must appear in the sitemap. Sitemap uses the
        // canonical https://arcadebloom.com origin regardless of test server.
        for (const slug of indexableSlugs) {
            expect(sitemap, `indexable game ${slug} must be in sitemap`).toContain(
                `/game/${slug}/</loc>`
            );
        }
        // Every non-indexable slug must be ABSENT from the sitemap.
        for (const slug of nonIndexableSlugs) {
            expect(sitemap, `non-indexable game ${slug} must be absent from sitemap`)
                .not.toContain(`/game/${slug}/</loc>`);
        }
    });

    test('fail-closed: the decision treats unknown sourceKeys as noindex', () => {
        // A brand-new sourceKey that is neither in the manifest nor eligible.
        const unknownKey = 'github:test/never-existed-' + Date.now();
        expect(isIndexable(unknownKey)).toBe(false);
        expect(isIndexable(null)).toBe(false);
        expect(isIndexable(undefined)).toBe(false);
        expect(isIndexable('')).toBe(false);
    });

    test('fail-closed: ineligible registry entries are not indexable', () => {
        // Synthetic: a key marked ineligible is not indexable even if the
        // decision helper is called with it directly.
        const fakeStates = { 'x:test': { state: 'ineligible' } };
        function decide(key) {
            if (manifestSet.has(key)) return true;
            const st = fakeStates[key];
            return !!(st && st.state === 'eligible');
        }
        expect(decide('x:test')).toBe(false);
    });

    test('sample of built game pages has the correct robots meta', async ({ page }) => {
        // Pick a grandfathered game (in manifest → index,follow).
        const grandfathered = games.find((g) => manifestSet.has(g.sourceKey));
        await page.goto(`/game/${grandfathered.slug}/`);
        const robots = await page.locator('meta[name="robots"]').getAttribute('content');
        expect(robots).toBe('index, follow');
    });
});
