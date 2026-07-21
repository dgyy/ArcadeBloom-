#!/usr/bin/env node
// =============================================================================
// validate-data.js — ArcadeBloom catalogue data validator.
// Run: `npm run validate` (audit — advisory warnings) or
//      `npm run validate:strict` (structural issues become blocking errors).
// Exits non-zero on any error.
//
// Two modes (extend.md §5.3 audit / strict):
//   audit (default) — all existing schema checks + advisory warnings for
//     duplicate URLs, missing gameplay tags, missing licenceStatus/sourceKey,
//     short about/howToPlay and placeholder wording. Warnings do not block.
//   strict          — the STRUCTURAL warnings above (dup URL, no gameplay tag,
//     licenceStatus/sourceKey presence+consistency, id monotonicity) escalate
//     to errors. Content-quality warnings (word count, placeholder wording)
//     stay advisory because they are progressive targets, not hard gates.
// =============================================================================
'use strict';

const games = require('../src/_data/games.js');
const tags = require('../src/_data/tags.js');
const site = require('../src/_data/site.js');

const STRICT = process.argv.includes('--strict');
const VERBOSE = process.argv.includes('--verbose');

const tagSlugs = new Set(tags.map((t) => t.slug));
const gameplaySlugs = new Set(tags.filter((t) => t.group === 'gameplay').map((t) => t.slug));
const categorySlugs = new Set(site.categories.map((c) => c.slug));

const VALID_LICENCES = /^(MIT|ISC|Apache-2\.0|GPL-3\.0|GPL-2\.0|AGPL-3\.0|BSD-[23]-Clause|MPL-2\.0|CC0-1\.0|CC-BY(-\d\.\d)?(-\w+)?|Unlicense|NOASSERTION|source-available|proprietary|commercial)$/i;
const SPDX_LICENCES = /^(MIT|ISC|Apache-2\.0|GPL-3\.0|GPL-2\.0|AGPL-3\.0|BSD-[23]-Clause|MPL-2\.0|CC0-1\.0|CC-BY(-\d\.\d)?(-\w+)?|Unlicense)$/i;
const VALID_LICENCE_STATUS = /^(osi-approved|source-available|proprietary|noassertion)$/i;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// URL normalization (extend.md §5.2): strip protocol, host case, trailing
// slash, query and fragment so two URLs pointing at the same resource collapse
// for duplicate detection.
function normUrl(u) {
    if (!u) return '';
    try {
        const url = new URL(String(u).trim());
        url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
        url.hash = '';
        for (const key of [...url.searchParams.keys()]) {
            if (/^(utm_.+|ref|source|campaign)$/i.test(key)) url.searchParams.delete(key);
        }
        url.searchParams.sort();
        url.pathname = url.pathname.replace(/\/+$/, '') || '/';
        return `${url.hostname}${url.pathname}${url.search}`.toLowerCase();
    } catch {
        return String(u).trim().toLowerCase();
    }
}

// The licenceStatus that logically follows from a licence value.
function expectedLicenceStatus(licence) {
    if (!licence) return 'noassertion';
    if (SPDX_LICENCES.test(licence)) return 'osi-approved';
    if (/^source-available$/i.test(licence)) return 'source-available';
    if (/^(proprietary|commercial)$/i.test(licence)) return 'proprietary';
    if (/^noassertion$/i.test(licence)) return 'noassertion';
    return null;
}

let errors = [];
let warnings = [];
const seenSlugs = new Map();
const seenIds = new Map();
const seenUrls = new Map();
const seenSourceKeys = new Map();

// Structural issues block in strict mode; stay advisory in audit mode.
const STRUCTURAL = new Set(['dup-url', 'no-gameplay', 'licence-status', 'source-key', 'id']);
function flag(loc, msg, kind) {
    if (STRICT && STRUCTURAL.has(kind)) errors.push(`${loc}: ${msg}`);
    else warnings.push(`${loc}: ${msg}`);
}

// ---- Per-game checks ----
let prevId = -Infinity;
games.forEach((g, i) => {
    const loc = `games[${i}] (id=${g.id}, slug=${g.slug || '???'})`;

    // Required scalar fields
    ['id', 'slug', 'name', 'category', 'tagline', 'about', 'howToPlay', 'sourceName', 'sourceUrl', 'licence', 'addedDate', 'releaseDate'].forEach((f) => {
        if (g[f] === undefined || g[f] === null || g[f] === '') errors.push(`${loc}: missing required field "${f}"`);
    });

    // id: number, unique, monotonic (holes allowed — extend.md §5.2 never renumber)
    if (typeof g.id !== 'number') {
        errors.push(`${loc}: id must be a number, got ${typeof g.id}`);
    } else {
        if (seenIds.has(g.id)) errors.push(`${loc}: duplicate id ${g.id}`);
        else seenIds.set(g.id, true);
        if (g.id <= prevId) flag(loc, `id ${g.id} is not greater than previous id ${prevId} (must be monotonic; holes allowed)`, 'id');
        prevId = g.id;
    }

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

    // tags: array, each in controlled vocab; must carry >=1 gameplay tag
    if (!Array.isArray(g.tags)) {
        errors.push(`${loc}: tags must be an array`);
    } else {
        if (g.tags.length < 3 || g.tags.length > 5) warnings.push(`${loc}: expected 3-5 tags, got ${g.tags.length}`);
        g.tags.forEach((t) => { if (!tagSlugs.has(t)) errors.push(`${loc}: tag "${t}" not in controlled vocabulary`); });
        const hasGameplay = g.tags.some((t) => gameplaySlugs.has(t));
        if (!hasGameplay) flag(loc, `no gameplay tag (tags: ${g.tags.join(',')}) — add at least one gameplay subtype`, 'no-gameplay');
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

    // licenceStatus: presence, validity, consistency with licence
    const exp = expectedLicenceStatus(g.licence);
    if (!g.licenceStatus) {
        flag(loc, `missing licenceStatus (expected "${exp}" for licence "${g.licence}")`, 'licence-status');
    } else if (!VALID_LICENCE_STATUS.test(String(g.licenceStatus))) {
        errors.push(`${loc}: licenceStatus "${g.licenceStatus}" must be osi-approved|source-available|proprietary|noassertion`);
    } else if (exp && g.licenceStatus !== exp) {
        flag(loc, `licenceStatus "${g.licenceStatus}" inconsistent with licence "${g.licence}" (expected "${exp}")`, 'licence-status');
    }

    // sourceKey: presence + uniqueness (extend.md §5.2 provenance identity)
    if (!g.sourceKey) {
        flag(loc, `missing sourceKey (unique upstream identity, e.g. "js13k:2025:slug")`, 'source-key');
    } else {
        if (seenSourceKeys.has(g.sourceKey)) errors.push(`${loc}: duplicate sourceKey "${g.sourceKey}" (also at id=${seenSourceKeys.get(g.sourceKey)})`);
        else seenSourceKeys.set(g.sourceKey, g.id);
    }

    // sourceUrl must be absolute + normalized uniqueness
    if (g.sourceUrl && !/^https?:\/\//.test(g.sourceUrl)) {
        errors.push(`${loc}: sourceUrl "${g.sourceUrl}" must be an absolute http(s) URL`);
    }
    if (g.sourceUrl) {
        const n = normUrl(g.sourceUrl);
        if (seenUrls.has(n)) flag(loc, `sourceUrl normalizes to "${n}" (also at id=${seenUrls.get(n)}) — likely duplicate`, 'dup-url');
        else seenUrls.set(n, g.id);
    }

    // No legacy fields (ADR-0001)
    if ('plays' in g) errors.push(`${loc}: legacy "plays" field present (fabricated data — removed per ADR-0001)`);
    if ('rating' in g) errors.push(`${loc}: legacy "rating" field present (fabricated data — removed per ADR-0001)`);
    if ('gameUrl' in g) errors.push(`${loc}: legacy "gameUrl" field present (renamed to sourceUrl per ADR-0001)`);
    if ('image' in g) errors.push(`${loc}: legacy "image" field present (replaced by screenshots[] per ADR-0001)`);

    // dates
    if (g.addedDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(g.addedDate))) {
        errors.push(`${loc}: addedDate "${g.addedDate}" must be YYYY-MM-DD`);
    }
    if (g.releaseDate && !/^\d{4}(-\d{2}-\d{2})?$|^unknown$/.test(String(g.releaseDate))) {
        errors.push(`${loc}: releaseDate "${g.releaseDate}" must be YYYY, YYYY-MM-DD, or "unknown"`);
    }

    // content-quality warnings (advisory in BOTH modes — progressive target)
    if (g.about) {
        const w = String(g.about).split(/\s+/).filter(Boolean).length;
        if (w < 150) warnings.push(`${loc}: about is ${w} words (<150 target)`);
    }
    if (g.howToPlay) {
        const w = String(g.howToPlay).split(/\s+/).filter(Boolean).length;
        if (w < 100) warnings.push(`${loc}: howToPlay is ${w} words (<100 target)`);
    }
    if (/placeholder|pending/i.test(String(g.about) + String(g.howToPlay))) {
        warnings.push(`${loc}: about/howToPlay carries placeholder/pending wording (factual stub — upgrade before indexing)`);
    }
});

// ---- Tag vocabulary checks ----
const tagSlugsSeen = new Set();
tags.forEach((t, i) => {
    const loc = `tags[${i}]`;
    if (!t.slug || !t.name || !t.group || !t.description) errors.push(`${loc}: tags need slug, name, group, description`);
    if (t.slug && tagSlugsSeen.has(t.slug)) errors.push(`${loc}: duplicate tag slug "${t.slug}"`);
    if (t.slug) tagSlugsSeen.add(t.slug);
    if (t.group && !['gameplay', 'mood'].includes(t.group)) errors.push(`${loc}: group "${t.group}" must be "gameplay" or "mood"`);
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
const mode = STRICT ? 'STRICT' : 'audit';
if (warnings.length) {
    console.warn(`\n⚠  ${warnings.length} warning(s) [${mode}]:`);
    const shown = VERBOSE ? warnings : warnings.slice(0, 25);
    shown.forEach((w) => console.warn('   ' + w));
    if (!VERBOSE && warnings.length > shown.length) {
        console.warn(`   ... ${warnings.length - shown.length} more warning(s); rerun with --verbose to list all.`);
    }
}
if (errors.length) {
    console.error(`\n✗  ${errors.length} error(s) [${mode}]:`);
    errors.forEach((e) => console.error('   ' + e));
    console.error(`\nValidation FAILED. Fix the errors above.\n`);
    process.exit(1);
}
console.log(`\n✓  Data valid [${mode}]. ${games.length} games, ${tags.length} tags, ${site.categories.length} categories.`);
console.warn(`   (warnings are advisory; errors block the build.)\n`);
process.exit(0);
