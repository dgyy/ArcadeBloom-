#!/usr/bin/env node
// =============================================================================
// validate-data.js — ArcadeBloom catalogue data validator.
// Run: `npm run validate`. Exits non-zero on any error.
//
// Checks the new outbound-directory schema against the controlled vocab and
// thin-content rules. Designed to run locally and in CI.
// =============================================================================
'use strict';

const path = require('path');

const games = require('../src/_data/games.js');
const tags = require('../src/_data/tags.js');
const site = require('../src/_data/site.js');

const tagSlugs = new Set(tags.map((t) => t.slug));
const categorySlugs = new Set(site.categories.map((c) => c.slug));

const VALID_LICENCES = /^(MIT|ISC|Apache-2\.0|GPL-3\.0|GPL-2\.0|AGPL-3\.0|BSD-[23]-Clause|MPL-2\.0|CC0-1\.0|CC-BY(-\d\.\d)?(-\w+)?|Unlicense|NOASSERTION|source-available|proprietary|commercial)$/i;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let errors = [];
let warnings = [];
const seenSlugs = new Map();

// ---- Per-game checks ----
games.forEach((g, i) => {
    const loc = `games[${i}] (id=${g.id}, slug=${g.slug || '???'})`;

    // Required scalar fields
    ['id', 'slug', 'name', 'category', 'tagline', 'about', 'howToPlay', 'sourceName', 'sourceUrl', 'licence', 'addedDate', 'releaseDate'].forEach((f) => {
        if (g[f] === undefined || g[f] === null || g[f] === '') {
            errors.push(`${loc}: missing required field "${f}"`);
        }
    });

    // id must be a unique number
    if (typeof g.id !== 'number') errors.push(`${loc}: id must be a number, got ${typeof g.id}`);

    // slug format + uniqueness
    if (g.slug && !SLUG_RE.test(g.slug)) errors.push(`${loc}: slug "${g.slug}" is not kebab-case`);
    if (g.slug) {
        if (seenSlugs.has(g.slug)) errors.push(`${loc}: duplicate slug "${g.slug}" (also at id=${seenSlugs.get(g.slug)})`);
        else seenSlugs.set(g.slug, g.id);
    }

    // category must be one of the locked six
    if (g.category && !categorySlugs.has(g.category)) {
        errors.push(`${loc}: category "${g.category}" not in ${[...categorySlugs].join(', ')}`);
    }

    // tags: must be array, each must exist in controlled vocab
    if (!Array.isArray(g.tags)) {
        errors.push(`${loc}: tags must be an array`);
    } else {
        if (g.tags.length < 3 || g.tags.length > 5) {
            warnings.push(`${loc}: expected 3-5 tags, got ${g.tags.length}`);
        }
        g.tags.forEach((t) => {
            if (!tagSlugs.has(t)) errors.push(`${loc}: tag "${t}" not in controlled vocabulary`);
        });
    }

    // keyFeatures: array, 3-6 items
    if (g.keyFeatures !== undefined) {
        if (!Array.isArray(g.keyFeatures)) errors.push(`${loc}: keyFeatures must be an array`);
        else if (g.tags && (g.keyFeatures.length < 3 || g.keyFeatures.length > 6)) {
            warnings.push(`${loc}: expected 3-6 keyFeatures, got ${g.keyFeatures.length}`);
        }
    }

    // licence must match known SPDX-ish identifier or proprietary/commercial
    if (g.licence && !VALID_LICENCES.test(String(g.licence))) {
        errors.push(`${loc}: licence "${g.licence}" does not match known SPDX/CC/proprietary pattern`);
    }

    // sourceUrl must be a real outbound URL
    if (g.sourceUrl && !/^https?:\/\//.test(g.sourceUrl)) {
        errors.push(`${loc}: sourceUrl "${g.sourceUrl}" must be an absolute http(s) URL`);
    }

    // No legacy fields allowed (ADR-0001 — removed fabricated data)
    if ('plays' in g) errors.push(`${loc}: legacy "plays" field present (fabricated data — removed per ADR-0001)`);
    if ('rating' in g) errors.push(`${loc}: legacy "rating" field present (fabricated data — removed per ADR-0001)`);
    if ('gameUrl' in g) errors.push(`${loc}: legacy "gameUrl" field present (renamed to sourceUrl per ADR-0001)`);
    if ('image' in g) errors.push(`${loc}: legacy "image" field present (replaced by screenshots[] per ADR-0001)`);

    // addedDate must be ISO-ish
    if (g.addedDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(g.addedDate))) {
        errors.push(`${loc}: addedDate "${g.addedDate}" must be YYYY-MM-DD`);
    }
    // releaseDate: YYYY, YYYY-MM-DD, or 'unknown' (some sources carry no year)
    if (g.releaseDate && !/^\d{4}(-\d{2}-\d{2})?$|^unknown$/.test(String(g.releaseDate))) {
        errors.push(`${loc}: releaseDate "${g.releaseDate}" must be YYYY, YYYY-MM-DD, or "unknown"`);
    }
});

// ---- Tag vocabulary checks ----
const tagSlugsSeen = new Set();
tags.forEach((t, i) => {
    const loc = `tags[${i}]`;
    if (!t.slug || !t.name || !t.group || !t.description) {
        errors.push(`${loc}: tags need slug, name, group, description`);
    }
    if (t.slug && tagSlugsSeen.has(t.slug)) errors.push(`${loc}: duplicate tag slug "${t.slug}"`);
    if (t.slug) tagSlugsSeen.add(t.slug);
    if (t.group && !['gameplay', 'mood'].includes(t.group)) {
        errors.push(`${loc}: group "${t.group}" must be "gameplay" or "mood"`);
    }
});

// ---- Catalogue-level checks (thin-content guard) ----
site.categories.forEach((cat) => {
    const count = games.filter((g) => g.category === cat.slug).length;
    if (count === 0) warnings.push(`category "${cat.slug}" has 0 games (page will show empty state)`);
    else if (count < site.minGamesPerCategory) {
        warnings.push(`category "${cat.slug}" has ${count}/${site.minGamesPerCategory} games (thin-content notice shown)`);
    }
});

// ---- Report ----
if (warnings.length) {
    console.warn(`\n⚠  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.warn('   ' + w));
}

if (errors.length) {
    console.error(`\n✗  ${errors.length} error(s):`);
    errors.forEach((e) => console.error('   ' + e));
    console.error(`\nValidation FAILED. Fix the errors above.\n`);
    process.exit(1);
}

console.log(`\n✓  Data valid. ${games.length} games, ${tags.length} tags, ${site.categories.length} categories.`);
console.warn(`   (warnings are advisory; errors block the build.)\n`);
process.exit(0);
