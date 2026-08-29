// =============================================================================
// tests/indexability.spec.js — trust-index eligibility policy (issue #23).
//
// The public policy seam is shared by Eleventy and these tests. Built pages
// then prove the two externally visible outcomes: robots metadata + sitemap.
// =============================================================================
'use strict';

const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const {
    createIndexEligibilityPolicy,
    DEFAULT_MAX_EVIDENCE_AGE_DAYS,
} = require('../scripts/lib/index-eligibility.js');
const { registerCatalogueKeys } = require('../scripts/lib/review-registry.js');

const projectRoot = path.resolve(__dirname, '..');
const fixtureEvidenceRoot = path.resolve(projectRoot, 'tests/fixtures/index-evidence');
const goodEvidenceRef = 'tests/fixtures/index-evidence/2048/2026-07-23-fixture-good.json';
const sourceKey = 'url:play2048.co/';

function policyFor(entry, now = '2026-07-24T00:00:00Z') {
    return createIndexEligibilityPolicy({
        registry: { states: { [sourceKey]: entry } },
        projectRoot,
        evidenceRoot: fixtureEvidenceRoot,
        now: new Date(now),
    });
}

test.describe('Trust-index eligibility policy (#23)', () => {
    test('current validated evidence makes an eligible registry entry indexable', () => {
        const isIndexable = policyFor({ state: 'eligible', evidenceRef: goodEvidenceRef });

        expect(isIndexable(sourceKey)).toBe(true);
    });

    test('historical or provisional membership never grants eligibility', () => {
        const isIndexable = policyFor({ state: 'provisional' });

        expect(isIndexable(sourceKey)).toBe(false);
    });

    test('explicit ineligibility overrides any historical catalogue status', () => {
        const manifest = JSON.parse(fs.readFileSync(
            path.resolve(projectRoot, 'evidence/index-manifest.json'), 'utf8'));
        expect(manifest.sourceKeys).toContain(sourceKey);
        const isIndexable = policyFor({ state: 'ineligible', evidenceRef: goodEvidenceRef });

        expect(isIndexable(sourceKey)).toBe(false);
    });

    test('evidence outside the configured evidence root fails closed', () => {
        const isIndexable = createIndexEligibilityPolicy({
            registry: {
                states: {
                    [sourceKey]: { state: 'eligible', evidenceRef: goodEvidenceRef },
                },
            },
            projectRoot,
            evidenceRoot: path.resolve(projectRoot, 'evidence/games'),
            now: new Date('2026-07-24T00:00:00Z'),
        });

        expect(isIndexable(sourceKey)).toBe(false);
    });

    test('evidence whose path does not match its slug and review id fails closed', () => {
        const isIndexable = createIndexEligibilityPolicy({
            registry: {
                states: {
                    [sourceKey]: {
                        state: 'eligible',
                        evidenceRef: 'tests/fixtures/evidence/good/2026-07-23-fixture-good.json',
                    },
                },
            },
            projectRoot,
            evidenceRoot: path.resolve(projectRoot, 'tests/fixtures/evidence'),
            now: new Date('2026-07-24T00:00:00Z'),
        });

        expect(isIndexable(sourceKey)).toBe(false);
    });

    test('eligible state fails closed when its evidence is missing', () => {
        const isIndexable = policyFor({ state: 'eligible', evidenceRef: 'evidence/games/missing.json' });

        expect(isIndexable(sourceKey)).toBe(false);
    });

    test(`evidence older than ${DEFAULT_MAX_EVIDENCE_AGE_DAYS} days fails closed`, () => {
        const isIndexable = policyFor(
            { state: 'eligible', evidenceRef: goodEvidenceRef },
            '2026-08-30T00:00:01Z'
        );

        expect(isIndexable(sourceKey)).toBe(false);
    });

    test('unknown and empty source keys fail closed', () => {
        const isIndexable = policyFor({ state: 'eligible', evidenceRef: goodEvidenceRef });

        expect(isIndexable('github:test/unknown')).toBe(false);
        expect(isIndexable(null)).toBe(false);
        expect(isIndexable('')).toBe(false);
    });

    test('registering a new catalogue key creates only a non-indexable provisional state', () => {
        const registry = {
            schemaVersion: 1,
            kind: 'review-registry',
            states: {
                'github:existing/game': { state: 'ineligible', reviewedAt: '2026-08-01' },
            },
        };

        const result = registerCatalogueKeys({
            registry,
            games: [
                { slug: 'existing', sourceKey: 'github:existing/game' },
                { slug: 'new-game', sourceKey: 'github:new/game' },
            ],
            registeredAt: '2026-08-30',
        });

        expect(result.registry.states['github:existing/game'])
            .toEqual({ state: 'ineligible', reviewedAt: '2026-08-01' });
        expect(result.registry.states['github:new/game']).toEqual({
            state: 'provisional',
            provisionalSince: '2026-08-30',
        });
        expect(result.added).toBe(1);

        const isIndexable = createIndexEligibilityPolicy({
            registry: result.registry,
            projectRoot,
        });
        expect(isIndexable('github:new/game')).toBe(false);
    });

    test('the current evidence-free catalogue is absent from the sitemap', () => {
        const registry = JSON.parse(fs.readFileSync(
            path.resolve(projectRoot, 'evidence/review-registry.json'), 'utf8'));
        const isIndexable = createIndexEligibilityPolicy({ registry, projectRoot });
        const sitemap = fs.readFileSync(path.resolve(projectRoot, 'dist/sitemap.xml'), 'utf8');

        for (const game of games) {
            expect(isIndexable(game.sourceKey)).toBe(false);
            expect(sitemap, `${game.slug} must be absent without current evidence`)
                .not.toContain(`/game/${game.slug}/</loc>`);
        }
    });

    test('a current catalogue page without evidence renders noindex', async ({ page }) => {
        await page.goto('/game/hextris/');

        await expect(page.locator('meta[name="robots"]'))
            .toHaveAttribute('content', 'noindex, follow');
    });

    test('Eleventy renders current eligible evidence as indexable and adds it to the sitemap', () => {
        const tempRoot = fs.mkdtempSync(path.join(projectRoot, '.tmp-indexability-'));
        const outputRoot = path.join(tempRoot, 'dist');
        const registryPath = path.join(tempRoot, 'review-registry.json');
        fs.writeFileSync(registryPath, JSON.stringify({
            schemaVersion: 1,
            kind: 'review-registry',
            states: {
                [sourceKey]: { state: 'eligible', evidenceRef: goodEvidenceRef },
            },
        }));

        try {
            execFileSync(process.execPath, [
                require.resolve('@11ty/eleventy/cmd.js'),
                '--quiet',
            ], {
                cwd: projectRoot,
                env: {
                    ...process.env,
                    ARCADEBLOOM_REGISTRY_PATH: registryPath,
                    ARCADEBLOOM_EVIDENCE_ROOT: fixtureEvidenceRoot,
                    ARCADEBLOOM_ELIGIBILITY_NOW: '2026-07-24T00:00:00Z',
                    ARCADEBLOOM_OUTPUT_DIR: path.relative(projectRoot, outputRoot).replace(/\\/g, '/'),
                },
                stdio: 'pipe',
            });

            const gameHtml = fs.readFileSync(
                path.join(outputRoot, 'game/2048/index.html'), 'utf8');
            const sitemap = fs.readFileSync(path.join(outputRoot, 'sitemap.xml'), 'utf8');
            expect(gameHtml).toContain('<meta name="robots" content="index, follow">');
            expect(sitemap).toContain('/game/2048/</loc>');
        } finally {
            fs.rmSync(tempRoot, { recursive: true, force: true });
        }
    });
});
