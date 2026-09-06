// =============================================================================
// tests/rss-feed.spec.js — verify the RSS feed (issue #18).
//
// The feed publishes only content-qualified games + Collections. It is generated at
// build time, so "released after a successful production health check" is
// enforced by deployment (a rolled-back deploy never serves a new feed). These
// tests assert the feed is well-formed and the eligibility gate holds.
// =============================================================================
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const { createDirectoryPolicy } = require('../scripts/lib/directory-policy.js');
const isEligible = createDirectoryPolicy(games);

test.describe('RSS feed (issue #18)', () => {
    test('feed.xml exists and is well-formed RSS', async () => {
        const feed = fs.readFileSync(path.resolve(__dirname, '../dist/feed.xml'), 'utf8');
        expect(feed).toContain('<?xml');
        expect(feed).toContain('<rss version="2.0"');
        expect(feed).toContain('<channel>');
        expect(feed).toContain('</channel>');
        expect(feed).toMatch(/<\/rss>\s*$/);
    });

    test('feed only contains content-qualified games (never placeholders)', () => {
        const feed = fs.readFileSync(path.resolve(__dirname, '../dist/feed.xml'), 'utf8');
        // Every eligible game must appear; every non-eligible must be absent.
        for (const g of games) {
            const url = `/game/${g.slug}/</link>`;
            if (isEligible(g.sourceKey)) {
                expect(feed, `eligible game ${g.slug} must be in feed`).toContain(url);
            } else {
                expect(feed, `non-eligible game ${g.slug} must be absent from feed`).not.toContain(url);
            }
        }
    });

    test('feed carries the atom self link + description', () => {
        const feed = fs.readFileSync(path.resolve(__dirname, '../dist/feed.xml'), 'utf8');
        expect(feed).toContain('rel="self"');
        expect(feed).toContain('indie browser games');
    });

    test('feed is listed in the sitemap', () => {
        const sitemap = fs.readFileSync(path.resolve(__dirname, '../dist/sitemap.xml'), 'utf8');
        expect(sitemap).toContain('/feed.xml');
    });
});
