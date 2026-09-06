#!/usr/bin/env node
// =============================================================================
// validate-collections.js — validate editorial Collections.
//
// Backs issue #17. A Collection is an themed directory selection, NOT a
// keyword permutation. The validator enforces the schema and rejects:
//   - keyword-permutation titles (e.g. "Best Puzzle Games", "Top 10 Action")
//   - near-duplicate game lists (two Collections sharing >70% of games)
//   - card-only pages (no synthesis paragraph)
//   - lists with <5 or >12 games
//   - games without useful directory content
//
// Run: `npm run validate:collections` (wired into CI by issue #17).
// =============================================================================
'use strict';

const collections = require('../src/_data/collections.js');
const games = require('../src/_data/games.js');
const { createDirectoryPolicy } = require('./lib/directory-policy.js');


const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MIN_GAMES = 5;
const MAX_GAMES = 12;
// Keyword-permutation patterns — titles that are pure SEO strings, not editorial.
// Catches "Best Puzzle Games", "Top 10 Action Games", "Free Games To Play", etc.
const KEYWORD_TITLE = /^(best|top|free|cool|awesome|amazing|great)\s+(\d+\s+)?\w[\w\s]*\s+(games?|picks?|titles)\b/i;

// Pure validation function — exported for unit tests so fixtures can be
// validated without monkey-patching collections.js.
function validateCollectionList(list, gamesList, isSourceKeyEligible) {
    const errs = [];
    const warns = [];
    const cat = new Map(gamesList.map((g) => [g.slug, g]));
    function eligible(slug) {
        const g = cat.get(slug);
        if (!g) return false;
        return typeof isSourceKeyEligible === 'function' && isSourceKeyEligible(g.sourceKey);
    }
    const seenSlugs = new Set();
    const gameSets = [];
    (list || []).forEach((c, i) => {
        const loc = `collections[${i}] (slug=${c.slug || '???'})`;
        if (!c.slug || !SLUG_RE.test(c.slug)) errs.push(`${loc}: slug must be kebab-case`);
        if (c.slug && seenSlugs.has(c.slug)) errs.push(`${loc}: duplicate slug "${c.slug}"`);
        if (c.slug) seenSlugs.add(c.slug);
        if (!c.title) errs.push(`${loc}: missing title`);
        if (c.title && KEYWORD_TITLE.test(c.title)) {
            errs.push(`${loc}: title "${c.title}" looks like a keyword permutation, not an editorial thesis`);
        }
        if (!c.thesis || String(c.thesis).split(/\s+/).length < 15) {
            errs.push(`${loc}: thesis must be a real editorial question/thesis (>=15 words), not a keyword string`);
        }
        if (!Array.isArray(c.games)) {
            errs.push(`${loc}: games must be an array`);
        } else {
            if (c.games.length < MIN_GAMES || c.games.length > MAX_GAMES) {
                errs.push(`${loc}: expected ${MIN_GAMES}-${MAX_GAMES} games, got ${c.games.length}`);
            }
            c.games.forEach((slug) => {
                if (!cat.has(slug)) errs.push(`${loc}: game "${slug}" not in catalogue`);
                else if (!eligible(slug)) errs.push(`${loc}: game "${slug}" lacks directory-quality content`);
            });
            if (Array.isArray(c.comparisons)) {
                if (c.comparisons.length !== c.games.length) {
                    errs.push(`${loc}: comparisons must have one entry per game (${c.games.length}), got ${c.comparisons.length}`);
                }
            } else {
                errs.push(`${loc}: comparisons must be an array`);
            }
            const thisSet = new Set(c.games);
            gameSets.forEach((other) => {
                const overlap = [...thisSet].filter((s) => other.set.has(s)).length;
                const ratio = overlap / Math.max(thisSet.size, other.set.size);
                if (ratio > 0.7) {
                    errs.push(`${loc}: >70% game overlap with collections[${other.index}] (near-duplicate)`);
                }
            });
            gameSets.push({ set: thisSet, index: i });
        }
        if (!c.synthesis || String(c.synthesis).split(/\s+/).length < 50) {
            errs.push(`${loc}: synthesis must be a >=50-word paragraph (not a card-only page)`);
        }
        if (!c.canonicalUrl) errs.push(`${loc}: missing canonicalUrl`);
        if (!c.socialImage) errs.push(`${loc}: missing socialImage`);
        if (!c.addedDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(c.addedDate))) {
            errs.push(`${loc}: addedDate must be YYYY-MM-DD`);
        }
    });
    return { errors: errs, warnings: warns };
}

const catalogueBySlug = new Map(games.map((game) => [game.slug, game]));
const isSourceKeyEligible = createDirectoryPolicy(games);
function isEligible(slug) {
    const game = catalogueBySlug.get(slug);
    return !!game && isSourceKeyEligible(game.sourceKey);
}
const { errors, warnings } = validateCollectionList(collections, games, isSourceKeyEligible);

// Exported for unit tests.
module.exports = { validateCollectionList, isEligible,
    KEYWORD_TITLE, MIN_GAMES, MAX_GAMES };

// ---- CLI main (only when run directly) ----
if (require.main === module) {
    if (warnings.length) {
        console.warn(`\n⚠  ${warnings.length} collection warning(s):`);
        warnings.forEach((w) => console.warn('   ' + w));
    }
    if (errors.length) {
        console.error(`\n✗  ${errors.length} collection error(s):`);
        errors.forEach((e) => console.error('   ' + e));
        console.error('\nCollection validation FAILED.\n');
        process.exit(1);
    }
    console.log(`\n✓  Collections valid. ${collections.length} published Collection(s).`);
    process.exit(0);
}
