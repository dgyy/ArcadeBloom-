#!/usr/bin/env node
// =============================================================================
// post-deploy-check.js — verify a production deploy is healthy.
//
// Backs issue #14. Invoked by .github/workflows/post-deploy.yml after
// Cloudflare deploys main. Fetches key URLs and asserts they are reachable,
// carry no legacy iframe/fake-metric artifacts, and the Play CTA + sitemap +
// CSS are present. Exits non-zero on any failure so the workflow can roll
// back the Cloudflare deployment and open a revert PR.
//
// Usage:
//   node scripts/post-deploy-check.js --base=https://arcadebloom.com [--slug=hextris]
//
// This script makes only read-only GET requests. Rollback is the workflow's
// job (it holds the Cloudflare API token); this script just decides whether
// rollback is needed.
// =============================================================================
'use strict';

const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
        const m = a.match(/^--([^=]+)=(.*)$/);
        return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
    })
);

function die(msg, code = 1) { console.error('✗ ' + msg); process.exit(code); }

const base = (args.base || 'https://arcadebloom.com').replace(/\/$/, '');
const slug = args.slug || 'hextris';
const failures = [];

async function fetchText(url) {
    const resp = await fetch(url, { redirect: 'follow' });
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    return await resp.text();
}

async function check(label, url, predicate) {
    try {
        const html = await fetchText(url);
        if (!predicate(html)) {
            failures.push(`${label}: assertion failed at ${url}`);
            console.error(`✗ ${label}: assertion failed`);
        } else {
            console.log(`✓ ${label}`);
        }
    } catch (e) {
        failures.push(`${label}: ${e.message} (${url})`);
        console.error(`✗ ${label}: ${e.message}`);
    }
}

async function main() {
    console.log(`post-deploy health check → ${base}`);
    await check('homepage reachable', base + '/',
        (h) => h.includes('ArcadeBloom'));
    await check('CSS asset loads', base + '/css/styles.css',
        (h) => h.length > 1000);
    await check('sitemap lists games', base + '/sitemap.xml',
        (h) => h.includes('/game/'));
    await check('robots.txt exists', base + '/robots.txt',
        (h) => h.includes('Sitemap:') || h.length > 0);
    await check('game page has Play CTA', `${base}/game/${slug}/`,
        (h) => h.includes('data-play-slug') && h.includes('Play Game'));
    await check('game page has canonical', `${base}/game/${slug}/`,
        (h) => /rel="canonical"/.test(h));
    await check('no legacy iframe player', `${base}/game/${slug}/`,
        (h) => !/iframe[^>]*src=/.test(h));
    await check('no fabricated play count', `${base}/game/${slug}/`,
        (h) => !/\b\d+\s+plays\b/i.test(h));
    await check('JSON-LD present', `${base}/game/${slug}/`,
        (h) => h.includes('application/ld+json'));

    if (failures.length) {
        console.error(`\n✗ ${failures.length} post-deploy check(s) failed:`);
        failures.forEach((f) => console.error('  ' + f));
        console.error('\nProduction is unhealthy — trigger rollback.');
        process.exit(1);
    }
    console.log(`\n✓ all post-deploy checks passed (${base})`);
    process.exit(0);
}

main().catch((e) => die('post-deploy check error: ' + e.message, 2));
