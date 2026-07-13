#!/usr/bin/env node
// =============================================================================
// backfill-fields.js — one-pass catalogue maintenance for the extend-to-500 work.
//   B1  remove the 3 known exact URL duplicates (hextris-game/hexgl-game/a-dark-room)
//   B2  ensure every entry carries >=1 gameplay tag (extend.md §4.3)
//   B3  backfill licenceStatus (source-open ≠ SPDX licence) + sourceKey (provenance)
// Rewrites src/_data/games.js, preserving the header comment and normalising
// field order. Idempotent: re-running yields no further changes.
//
// Usage: node scripts/backfill-fields.js [--dry-run]
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const GAMES_PATH = path.join(__dirname, '..', 'src', '_data', 'games.js');
const TAGS_PATH = path.join(__dirname, '..', 'src', '_data', 'tags.js');
const DRY = process.argv.includes('--dry-run');

const src = fs.readFileSync(GAMES_PATH, 'utf8');
const games = require(GAMES_PATH);
const tags = require(TAGS_PATH);
const tagSlugs = new Set(tags.map((t) => t.slug));
const gameplaySlugs = new Set(tags.filter((t) => t.group === 'gameplay').map((t) => t.slug));

// Preserve everything before `module.exports = [` (the schema comment block).
const headerEnd = src.indexOf('module.exports = [');
const HEADER = headerEnd > 0 ? src.slice(0, headerEnd) : '';

// ---- B1: remove exact duplicates (keep the better-populated entry) ----
const REMOVE_IDS = new Set([372, 352, 359]); // hextris-game, hexgl-game, a-dark-room
let removed = 0;
const kept = games.filter((g) => {
    if (REMOVE_IDS.has(g.id)) { removed++; return false; }
    return true;
});

// ---- B2: gameplay-tag rules ----
// Ordered most-specific → broad. First match wins. All targets are validated
// against the controlled vocabulary (tags.js gameplay group).
const RULES = [
    [/\brogue(?:like|lite)\b|permadeath/i, 'roguelike'],
    [/tower.?defen[cs]e|\bdefen[cs]e\b/i, 'tower-defense'],
    [/match.?3|match three/i, 'match-3'],
    [/platform|jump|runner|\brun\b|ninja|sonic|mario/i, 'platformer'],
    [/bullet.?hell|danmaku/i, 'bullet-hell'],
    [/\brts\b|real.?time.?strategy/i, 'rts'],
    [/idle|clicker|incremental|\btap\b/i, 'idle'],
    [/card|solitaire|deck|poker|blackjack/i, 'card-game'],
    [/chess|checkers|reversi|othello|board.?game|\bmahjong\b/i, 'board-game'],
    [/shooter|shmup|shoot|gun|laser|\bfps\b|alien|zombie|invader|space.?ship|galaxy|raid|blast|attack|\basteroids?\b|\bduck\b|\bhunt\b|captain|space.?bender|rogers/i, 'shooter'],
    [/rhythm|\bbeat\b|music|dance/i, 'rhythm'],
    [/race|rac(?:ing|etrack)|rally|kart|drift/i, 'racing'],
    [/football|soccer|tennis|golf|basket|baseball|bowling|\bsport\b|pong|olympic/i, 'sports'],
    [/surviv/i, 'survival'],
    [/escape|puzzle.?room|room.?escape/i, 'puzzle-room'],
    [/physics|gravity|ragdoll|bounce|\bball\b|\bsnake\b|\bbranch\b/i, 'physics'],
    [/\b(?:text|adventure|visual novel|choose your)/i, 'text-based'],
    [/sim(?:ulation)?|farm|tycoon|\bcity\b|\bbuild\b|manage|pet|tamagotchi|colony|craft|evolve|garden|restaurant|shop/i, 'sandbox'],
    [/\b(?:puzzle|sokoban|sudoku|nonogram|picross|minesweeper|tetris|sliding|labyrinth|maze|logic|brain|enigma|cipher)\b/i, 'match-3'],
    [/turn.?based|tactic|war|empire|kingdom|conquer|fortress|castle|siege/i, 'turn-based'],
];
// Category fallback when no keyword matches. Arcade has no universal subtype,
// so it is intentionally absent — those entries rely on keyword matching.
const FALLBACK = {
    puzzle: 'match-3',
    action: 'shooter',
    strategy: 'turn-based',
    simulation: 'sandbox',
    'racing-sports': 'racing',
    // Arcade micro-games (esp. js13k) are overwhelmingly motion/collision/reflex
    // driven — physics is the closest gameplay subtype in the controlled vocab.
    arcade: 'physics',
};

function pickGameplay(g) {
    const text = `${g.name || ''} ${g.tagline || ''} ${(g.keyFeatures || []).join(' ')}`;
    for (const [re, tag] of RULES) {
        if (re.test(text) && gameplaySlugs.has(tag)) return tag;
    }
    const fb = FALLBACK[g.category];
    return (fb && gameplaySlugs.has(fb)) ? fb : null;
}

let tagAdded = 0;
let stillNone = 0;
kept.forEach((g) => {
    if (!Array.isArray(g.tags)) g.tags = [];
    if (!g.tags.some((t) => gameplaySlugs.has(t))) {
        const t = pickGameplay(g);
        if (t && tagSlugs.has(t) && !g.tags.includes(t)) {
            g.tags.push(t);
            tagAdded++;
        }
    }
    if (!g.tags.some((t) => gameplaySlugs.has(t))) stillNone++;
    if (g.tags.length > 5) g.tags = g.tags.slice(0, 5); // cap
});

// ---- B3: licenceStatus + sourceKey ----
const SPDX = /^(MIT|ISC|Apache-2\.0|GPL-3\.0|GPL-2\.0|AGPL-3\.0|BSD-[23]-Clause|MPL-2\.0|CC0-1\.0|CC-BY(-\d\.\d)?(-\w+)?|Unlicense)$/i;
function licStatus(lic) {
    if (!lic) return 'noassertion';
    if (SPDX.test(lic)) return 'osi-approved';
    if (/source-available/i.test(lic)) return 'source-available';
    if (/proprietary|commercial/i.test(lic)) return 'proprietary';
    return 'noassertion';
}
function domainOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
}
function makeSourceKey(g) {
    if (/js13kgames\.com/.test(g.sourceUrl || '')) {
        const m = String(g.sourceUrl).match(/js13kgames\.com\/(\d{4})\/games\/([^/?#]+)/);
        if (m) return `js13k:${m[1]}:${m[2]}`;
        return `js13k:${g.slug}`;
    }
    const dom = domainOf(g.sourceUrl);
    if (dom) return `author:${dom}:${g.slug}`; // slug suffix guarantees uniqueness
    return `manual:${g.slug}`;
}

let lsSet = 0;
let skSet = 0;
kept.forEach((g) => {
    if (!g.licenceStatus) { g.licenceStatus = licStatus(g.licence); lsSet++; }
    if (!g.sourceKey) { g.sourceKey = makeSourceKey(g); skSet++; }
});

// ---- Normalise field order so the file is stable & readable ----
const FIELD_ORDER = [
    'id', 'slug', 'name', 'category', 'tagline', 'about', 'howToPlay',
    'keyFeatures', 'screenshots', 'sourceName', 'sourceUrl', 'licence',
    'licenceStatus', 'sourceKey', 'tags', 'addedDate', 'releaseDate', 'featured',
];
function reorder(g) {
    const o = {};
    for (const f of FIELD_ORDER) if (f in g) o[f] = g[f];
    for (const f of Object.keys(g)) if (!(f in o)) o[f] = g[f]; // carry unknowns
    return o;
}
const ordered = kept.map(reorder);

// ---- Uniqueness sanity on sourceKey ----
const skSeen = new Set();
let dupSk = 0;
ordered.forEach((g) => { if (skSeen.has(g.sourceKey)) dupSk++; else skSeen.add(g.sourceKey); });

// ---- Report ----
console.log('=== backfill report ===');
console.log(`input games: ${games.length}`);
console.log(`B1 removed duplicates: ${removed}  -> kept: ${kept.length}`);
console.log(`B2 gameplay tags added: ${tagAdded} | still without gameplay tag: ${stillNone}`);
console.log(`B3 licenceStatus set: ${lsSet} | sourceKey set: ${skSet} | duplicate sourceKeys: ${dupSk}`);
const cats = {};
ordered.forEach((g) => (cats[g.category] = (cats[g.category] || 0) + 1));
console.log(`category distribution: ${JSON.stringify(cats)}`);
const licDist = {};
ordered.forEach((g) => (licDist[g.licenceStatus] = (licDist[g.licenceStatus] || 0) + 1));
console.log(`licenceStatus distribution: ${JSON.stringify(licDist)}`);

if (stillNone > 0) {
    const noneCats = {};
    ordered.filter((g) => !g.tags.some((t) => gameplaySlugs.has(t))).forEach((g) => (noneCats[g.category] = (noneCats[g.category] || 0) + 1));
    console.log(`(entries still without gameplay tag, by category: ${JSON.stringify(noneCats)})`);
}

if (DRY) {
    console.log('(dry-run — no file written)');
    process.exit(0);
}

const out = HEADER + 'module.exports = ' + JSON.stringify(ordered, null, 4) + ';\n';
fs.writeFileSync(GAMES_PATH, out);
console.log(`wrote ${ordered.length} games to ${path.relative(process.cwd(), GAMES_PATH)}`);
