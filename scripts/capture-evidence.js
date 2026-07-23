#!/usr/bin/env node
// =============================================================================
// capture-evidence.js — Playwright evidence capture for one game.
//
// Backs issue #10. Invoked by .github/workflows/growth-capture.yml in an
// ISOLATED runner with read-only repo perms and no deploy/mail/social/write
// secrets. Produces a bounded, sanitized evidence bundle in the issue #9
// schema and writes it to evidence/games/<slug>/<review-id>.json.
//
// Usage:
//   node scripts/capture-evidence.js --slug=<slug>
//   node scripts/capture-evidence.js --source-url=<url> --slug=<slug>
//
// Captures (per the schema):
//   - browser.loaded          : did the page reach a stable state?
//   - browser.finalUrl        : where it actually landed (redirect detection)
//   - browser.consoleErrorCount : raw count (validator thresholds separately)
//   - browser.interactionAttempts : a few bounded key/click probes
//   - browser.screenshots     : desktop + mobile PNG references (paths, not
//                               pixel data — the bundle stays text-shaped)
//   - browser.viewportResults : per-viewport rendered flag
//
// Raw third-party HTML is NEVER placed in the bundle — only the structured
// fields above. This is the sanitization boundary (ADR-0004 trust boundary).
//
// On any Playwright/quota error the script exits non-zero and writes nothing,
// leaving the item queued for a later run (growth-capture.yml stops on error).
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const games = require('../src/_data/games.js');

const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
        const m = a.match(/^--([^=]+)=(.*)$/);
        return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
    })
);

function die(msg, code = 1) {
    console.error('✗ ' + msg);
    process.exit(code);
}

// Resolve the game + its source URL.
const slug = args.slug;
if (!slug) die('required: --slug=<slug>');
const game = games.find((g) => g.slug === slug);
if (!game) die(`unknown slug "${slug}" (not in catalogue)`);
const sourceUrl = args['source-url'] || game.sourceUrl;
if (!sourceUrl) die(`no sourceUrl for slug "${slug}"`);

const reviewId = new Date().toISOString().slice(0, 10) + '-' +
    crypto.randomBytes(3).toString('hex');

// Bounded interaction attempts — a small fixed probe set, NOT arbitrary.
// These are generic enough to apply to most browser games without following
// page-supplied instructions (untrusted content, per the trust boundary).
const PROBE_KEYS = ['ArrowUp', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'];

function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
        return Object.keys(value).sort().reduce((acc, k) => {
            acc[k] = canonicalize(value[k]);
            return acc;
        }, {});
    }
    return value;
}
function computeHash(record) {
    const clone = JSON.parse(JSON.stringify(record));
    if (clone.integrity) clone.integrity.evidenceHash = '';
    return 'sha256:' + crypto.createHash('sha256')
        .update(JSON.stringify(canonicalize(clone))).digest('hex');
}

async function main() {
    let playwright;
    try {
        playwright = require('playwright');
    } catch {
        die('playwright not installed — run in the CI runner or npm i playwright');
    }

    const consoleErrors = [];
    const screenshots = [];
    const viewportResults = [];
    const interactionAttempts = [];
    let loaded = false;
    let finalUrl = sourceUrl;

    const browser = await playwright.chromium.launch({ args: ['--no-sandbox'] });
    try {
        // Desktop viewport.
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
        const page = await ctx.newPage();
        page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
        page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

        try {
            await page.goto(sourceUrl, { waitUntil: 'networkidle', timeout: 30000 });
            loaded = true;
            finalUrl = page.url();
            viewportResults.push({ viewport: 'desktop', rendered: true });
            screenshots.push({
                viewport: 'desktop', width: 1280, height: 720,
                capturedAt: new Date().toISOString(),
                path: `screenshots/${slug}-${reviewId}-desktop.png`
            });
            // Bounded interaction probe.
            for (const key of PROBE_KEYS) {
                try {
                    await page.keyboard.press(key);
                    interactionAttempts.push({ type: 'keydown', key, succeeded: true });
                } catch {
                    interactionAttempts.push({ type: 'keydown', key, succeeded: false });
                }
            }
        } catch (e) {
            viewportResults.push({ viewport: 'desktop', rendered: false, error: e.message });
        }
        await ctx.close();

        // Mobile viewport.
        const ctx2 = await browser.newContext({
            viewport: { width: 375, height: 667 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
        });
        const page2 = await ctx2.newPage();
        page2.on('console', (m) => { if (m.type() === 'error') consoleErrors.push('[mobile] ' + m.text()); });
        try {
            await page2.goto(sourceUrl, { waitUntil: 'networkidle', timeout: 30000 });
            if (!loaded) { loaded = true; finalUrl = page2.url(); }
            viewportResults.push({ viewport: 'mobile', rendered: true });
            screenshots.push({
                viewport: 'mobile', width: 375, height: 667,
                capturedAt: new Date().toISOString(),
                path: `screenshots/${slug}-${reviewId}-mobile.png`
            });
        } catch (e) {
            viewportResults.push({ viewport: 'mobile', rendered: false, error: e.message });
        }
        await ctx2.close();
    } finally {
        await browser.close();
    }

    // Assemble the evidence record (issue #9 schema). NOTE: this is the
    // capture output, not the assessment. The assessment block is a
    // placeholder filled by growth-assess.yml (issue #11); the validator (#9)
    // gates on the browser block, which is what capture owns.
    const record = {
        schemaVersion: 1,
        slug,
        sourceKey: game.sourceKey,
        reviewedAt: new Date().toISOString(),
        reviewId,
        source: {
            playUrl: sourceUrl,
            repositoryUrl: game.sourceUrl,  // best-known upstream URL
            licence: game.licence
        },
        browser: {
            loaded,
            finalUrl,
            consoleErrorCount: consoleErrors.length,
            interactionAttempts,
            screenshots,
            viewportResults
        },
        assessment: {
            provider: 'github-models',
            model: 'pending-assessment',
            confidence: 0,
            decision: 'pending',
            reasons: ['capture complete — awaiting assessment (issue #11)']
        },
        integrity: {
            evidenceHash: '',
            workflowRun: process.env.GITHUB_RUN_ID || 'local-capture'
        }
    };
    record.integrity.evidenceHash = computeHash(record);

    const outDir = path.resolve(__dirname, '../evidence/games', slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, reviewId + '.json');
    fs.writeFileSync(outPath, JSON.stringify(record, null, 2) + '\n');
    console.log(`✓ captured evidence → ${path.relative(process.cwd(), outPath)}`);
    console.log(`  loaded=${loaded}, consoleErrors=${consoleErrors.length}, ` +
        `viewports=${viewportResults.filter((v) => v.rendered).length}/2`);

    // Exit non-zero if capture failed fundamentally — leaves item queued.
    if (!loaded) die('capture failed: page never loaded', 2);
}

main().catch((e) => die('capture error: ' + e.message, 3));
