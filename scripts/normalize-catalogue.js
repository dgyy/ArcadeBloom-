#!/usr/bin/env node
// =============================================================================
// normalize-catalogue.js — repair provenance and collapse catalogue duplicates.
//
// The 2026 bulk imports predate sourceKey. Some js13k entries were imported a
// second time with "-YYYY" appended to both the ArcadeBloom slug and (wrongly)
// the upstream URL. This migration resolves every js13k entry against the raw
// year/slug identity, merges duplicate records, and records redirects for the
// retired local slugs.
//
// Usage: node scripts/normalize-catalogue.js [--dry-run]
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GAMES_PATH = path.join(ROOT, 'src', '_data', 'games.js');
const MERGED_PATH = path.join(__dirname, 'js13k-games-merged.json');
const REDIRECTS_PATH = path.join(ROOT, 'src', '_data', 'catalogueRedirects.js');
const DRY = process.argv.includes('--dry-run');

const source = fs.readFileSync(GAMES_PATH, 'utf8');
const games = require(GAMES_PATH);
const tags = require(path.join(ROOT, 'src', '_data', 'tags.js'));
const js13kRaw = require(path.join(__dirname, 'js13k-raw.json'));
const existingRedirects = fs.existsSync(REDIRECTS_PATH) ? require(REDIRECTS_PATH) : [];
const gameplaySlugs = new Set(tags.filter((tag) => tag.group === 'gameplay').map((tag) => tag.slug));
const tagSlugs = new Set(tags.map((tag) => tag.slug));

const headerAt = source.indexOf('module.exports = [');
const HEADER = headerAt >= 0 ? source.slice(0, headerAt) : '';
const rawByIdentity = new Map(js13kRaw.map((entry) => [`${entry.year}:${entry.slug}`, entry]));
const rawBySlug = new Map(js13kRaw.map((entry) => [entry.slug, entry]));

const GAMEPLAY_FALLBACK = {
    puzzle: 'match-3',
    action: 'shooter',
    arcade: 'physics',
    strategy: 'turn-based',
    'racing-sports': 'racing',
    simulation: 'sandbox',
};

const SPDX = /^(MIT|ISC|Apache-2\.0|GPL-3\.0|GPL-2\.0|AGPL-3\.0|BSD-[23]-Clause|MPL-2\.0|CC0-1\.0|CC-BY(-\d\.\d)?(-\w+)?|Unlicense)$/i;

function licenceStatus(licence) {
    if (SPDX.test(String(licence || ''))) return 'osi-approved';
    if (/^source-available$/i.test(String(licence || ''))) return 'source-available';
    if (/^(proprietary|commercial)$/i.test(String(licence || ''))) return 'proprietary';
    return 'noassertion';
}

// Retain meaningful query parameters (for example YouTube's ?v= identity),
// but discard common tracking parameters. Protocol/www/trailing slash do not
// distinguish an upstream resource.
function normalizeUrl(value) {
    try {
        const url = new URL(String(value).trim());
        url.protocol = 'https:';
        url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
        url.hash = '';
        for (const key of [...url.searchParams.keys()]) {
            if (/^(utm_.+|ref|source|campaign)$/i.test(key)) url.searchParams.delete(key);
        }
        url.searchParams.sort();
        url.pathname = url.pathname.replace(/\/+$/, '') || '/';
        return `${url.hostname}${url.pathname}${url.search}`.toLowerCase();
    } catch {
        return String(value || '').trim().toLowerCase();
    }
}

function resolveJs13k(game) {
    if (!/js13kgames\.com/i.test(String(game.sourceUrl || '')) && game.sourceName !== 'js13kGames') return null;

    const url = String(game.sourceUrl || '');
    const yearFromUrl = url.match(/js13kgames\.com\/(\d{4})\/games\//i)?.[1];
    const year = yearFromUrl || (/^\d{4}$/.test(String(game.releaseDate)) ? String(game.releaseDate) : null);
    const pathSlug = url.match(/js13kgames\.com\/(?:\d{4}\/)?games\/([^/?#]+)/i)?.[1];
    const candidates = [pathSlug, game.slug].filter(Boolean);

    for (const candidate of candidates) {
        if (year && rawByIdentity.has(`${year}:${candidate}`)) return rawByIdentity.get(`${year}:${candidate}`);
        if (year) {
            const withoutYear = candidate.replace(new RegExp(`-${year}$`), '');
            if (rawByIdentity.has(`${year}:${withoutYear}`)) return rawByIdentity.get(`${year}:${withoutYear}`);
        }
        if (rawBySlug.has(candidate)) return rawBySlug.get(candidate);
    }
    return null;
}

function githubRepo(game) {
    if (game._repo) return String(game._repo).replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '').replace(/\/+$/, '');
    return null;
}

function identityOf(game) {
    const js13k = resolveJs13k(game);
    if (js13k) return { key: `js13k:${js13k.year}:${js13k.slug}`, js13k };
    if (/^(github|gitlab|itch):/i.test(String(game.sourceKey || ''))) {
        return { key: String(game.sourceKey).toLowerCase() };
    }
    const repo = githubRepo(game);
    if (repo) return { key: `github:${repo.toLowerCase()}`, repo };
    return { key: `url:${normalizeUrl(game.sourceUrl)}` };
}

function mergeUnique(first, second, limit = Infinity) {
    return [...new Set([...(first || []), ...(second || [])])].slice(0, limit);
}

function contentScore(value) {
    const text = String(value || '');
    const penalty = /placeholder|pending|full review will follow/i.test(text) ? 1000 : 0;
    return text.split(/\s+/).filter(Boolean).length - penalty;
}

function mergeInto(canonical, duplicate) {
    canonical.screenshots = mergeUnique(canonical.screenshots, duplicate.screenshots, 5);
    canonical.tags = mergeUnique(canonical.tags, duplicate.tags, 5);
    canonical.featured = Boolean(canonical.featured || duplicate.featured);
    if (contentScore(duplicate.about) > contentScore(canonical.about)) canonical.about = duplicate.about;
    if (contentScore(duplicate.howToPlay) > contentScore(canonical.howToPlay)) canonical.howToPlay = duplicate.howToPlay;
    if ((duplicate.keyFeatures || []).length > (canonical.keyFeatures || []).length) canonical.keyFeatures = duplicate.keyFeatures;
}

const groups = new Map();
for (const original of games) {
    const game = JSON.parse(JSON.stringify(original));
    const identity = identityOf(game);
    game.sourceKey = identity.key;
    game.licenceStatus = licenceStatus(game.licence);

    if (identity.js13k) {
        game.sourceUrl = `https://js13kgames.com/${identity.js13k.year}/games/${identity.js13k.slug}`;
        game.releaseDate = String(identity.js13k.year);
        game.sourceName = 'js13kGames';
    }

    if (!Array.isArray(game.tags)) game.tags = [];
    if (!game.tags.some((tag) => gameplaySlugs.has(tag))) {
        const fallback = GAMEPLAY_FALLBACK[game.category];
        if (fallback && tagSlugs.has(fallback)) game.tags.push(fallback);
    }
    game.tags = mergeUnique([], game.tags, 5);

    if (!groups.has(identity.key)) groups.set(identity.key, []);
    groups.get(identity.key).push(game);
}

const primaryNormalized = [];
const redirects = [...existingRedirects];
for (const group of groups.values()) {
    group.sort((a, b) => a.id - b.id);
    const canonical = group[0];
    for (const duplicate of group.slice(1)) {
        mergeInto(canonical, duplicate);
        if (duplicate.slug !== canonical.slug) redirects.push({ from: duplicate.slug, to: canonical.slug });
    }
    primaryNormalized.push(canonical);
}

// A game discovered from two source adapters may have different provenance
// keys (for example a leereilly row and a later GitHub search result) while
// still pointing at the exact same playable URL. Collapse that second class of
// duplicate after the stronger upstream-identity pass.
const byUrl = new Map();
for (const game of primaryNormalized) {
    const urlKey = normalizeUrl(game.sourceUrl);
    if (!byUrl.has(urlKey)) byUrl.set(urlKey, []);
    byUrl.get(urlKey).push(game);
}

const normalized = [];
for (const group of byUrl.values()) {
    group.sort((a, b) => a.id - b.id);
    const canonical = group[0];
    for (const duplicate of group.slice(1)) {
        mergeInto(canonical, duplicate);
        if (duplicate.slug !== canonical.slug) redirects.push({ from: duplicate.slug, to: canonical.slug });
    }
    normalized.push(canonical);
}

normalized.sort((a, b) => a.id - b.id);
const redirectMap = new Map();
for (const redirect of redirects) redirectMap.set(redirect.from, redirect.to);
const uniqueRedirects = [...redirectMap].map(([from, to]) => ({ from, to })).sort((a, b) => a.from.localeCompare(b.from));

const FIELD_ORDER = [
    'id', 'slug', 'name', 'category', 'tagline', 'about', 'howToPlay',
    'keyFeatures', 'screenshots', 'sourceName', 'sourceUrl', 'licence',
    'licenceStatus', 'sourceKey', 'tags', 'addedDate', 'releaseDate', 'featured',
];
const ordered = normalized.map((game) => {
    const result = {};
    for (const field of FIELD_ORDER) if (field in game) result[field] = game[field];
    for (const field of Object.keys(game)) if (!(field in result)) result[field] = game[field];
    return result;
});

console.log('=== catalogue normalization report ===');
console.log(`input: ${games.length}`);
console.log(`unique: ${ordered.length}`);
console.log(`duplicates removed: ${games.length - ordered.length}`);
console.log(`redirects recorded: ${uniqueRedirects.length}`);

if (DRY) {
    console.log('(dry-run — no files written)');
    process.exit(0);
}

const gamesOutput = `${HEADER}module.exports = ${JSON.stringify(ordered, null, 4)};\n`;
const redirectsOutput = `// Generated by scripts/normalize-catalogue.js.\nmodule.exports = ${JSON.stringify(uniqueRedirects, null, 4)};\n`;
fs.writeFileSync(GAMES_PATH, gamesOutput);
fs.writeFileSync(MERGED_PATH, `${JSON.stringify(ordered, null, 4)}\n`);
fs.writeFileSync(REDIRECTS_PATH, redirectsOutput);
console.log('updated games.js, js13k-games-merged.json, and catalogueRedirects.js');
