#!/usr/bin/env node
// =============================================================================
// expand-catalogue.js — grow the catalogue from js13k candidates, prioritising
// the under-seeded categories (extend.md §4.3 / §6 M3).
//
// Why js13k only here: leereilly-raw.json (83 entries) is already fully merged
// into games.js (verified by normalized-URL diff). js13k-raw.json still has
// 2,176 fresh candidates, of which 241 match a non-arcade/puzzle category
// keyword — enough to lift Action/Strategy/Simulation/Racing past the 20-game
// threshold while adding ~114 entries to reach ~500 total.
//
// Per-entry policy (extend.md §3/§5.3):
//   - about/howToPlay are FACTUAL placeholders (author/year/source), never
//     fabricated reviews — same Phase-A style as the existing js13k import.
//   - licence is 'source-available' (js13k ships readable source; SPDX often
//     undeclared) with licenceStatus 'source-available'. No GitHub API call
//     here — licence enrichment is a separate, later pass.
//   - screenshots: [] (screenshot sync is a separate M3 stage).
//   - every entry gets a gameplay tag (controlled vocab) + a unique sourceKey.
//
// Idempotent: re-running adds nothing (existing sourceKeys are skipped).
//
// Usage: node scripts/expand-catalogue.js [--dry-run] [--limit N]
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const GAMES_PATH = path.join(__dirname, '..', 'src', '_data', 'games.js');
const TAGS_PATH = path.join(__dirname, '..', 'src', '_data', 'tags.js');
const RAW_PATH = path.join(__dirname, 'js13k-raw.json');
const DRY = process.argv.includes('--dry-run');
const limitArg = parseInt((process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1], 10);

const src = fs.readFileSync(GAMES_PATH, 'utf8');
const games = require(GAMES_PATH);
const tags = require(TAGS_PATH);
const raw = require(RAW_PATH);
const tagSlugs = new Set(tags.map((t) => t.slug));
const gameplaySlugs = new Set(tags.filter((t) => t.group === 'gameplay').map((t) => t.slug));

const headerEnd = src.indexOf('module.exports = [');
const HEADER = headerEnd > 0 ? src.slice(0, headerEnd) : '';

// Existing identities for dedup (extend.md §5.2)
const existingSourceKeys = new Set(games.map((g) => g.sourceKey));
const existingSlugs = new Set(games.map((g) => g.slug));
let nextId = games.reduce((m, g) => Math.max(m, g.id), 0) + 1;

// ---- Category classifier (name keyword → one of the locked six) ----
const CAT_RULES = [
    ['racing-sports', /\brace\b|rac(?:ing|etrack)|kart|rally|golf|football|soccer|tennis|bowling|basket|baseball|pong|\bf1\b|ski|cycling|sport|olympic/i],
    ['simulation', /\bidle\b|clicker|incremental|tamagotchi|tycoon|farm|life.?sim|colony|pet.?sim|\bsim\b|evolve|\bgrow\b|garden|ecosystem|restaurant|\bshop\b|craft/i],
    ['strategy', /tower.?defen[cs]e|\bdefen[cs]e\b|chess|checkers|reversi|othello|dungeon|castle|fortress|siege|\brts\b|tactic|turn.?based|war|empire|kingdom|conquer|4x/i],
    ['puzzle', /\bpuzzle\b|sudoku|sokoban|nonogram|picross|2048|minesweeper|match|memory|crossword|jigsaw|tetris|sliding|labyrinth|maze|logic|brain|enigma|cipher|escape/i],
    ['action', /shooter|shmup|shoot|bullet|twin.?stick|\bfps\b|brawler|zombie|alien|invader|demon|devil|samurai|ninja|warrior|soldier|killer|slay|combat|fighter|blast|attack|raid|assault|gun|laser|galaxy|space.?ship|rocket|starship|platform|jump/i],
];
function classify(name) {
    for (const [c, re] of CAT_RULES) if (re.test(name)) return c;
    return 'arcade';
}

// ---- Gameplay tag from name (mirrors backfill-fields.js RULES) ----
const GAMEPLAY_RULES = [
    [/\brogue(?:like|lite)\b|permadeath/i, 'roguelike'],
    [/tower.?defen[cs]e|\bdefen[cs]e\b/i, 'tower-defense'],
    [/match.?3|match three|\bpuzzle\b|sokoban|sudoku|nonogram|picross|minesweeper|tetris|sliding|labyrinth|maze|logic|brain|enigma|cipher/i, 'match-3'],
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
    [/turn.?based|tactic|war|empire|kingdom|conquer|fortress|castle|siege/i, 'turn-based'],
];
const CAT_FALLBACK_GAMEPLAY = {
    puzzle: 'match-3', action: 'shooter', strategy: 'turn-based',
    simulation: 'sandbox', 'racing-sports': 'racing', arcade: 'physics',
};
function pickGameplay(name, category) {
    for (const [re, tag] of GAMEPLAY_RULES) if (re.test(name) && gameplaySlugs.has(tag)) return tag;
    const fb = CAT_FALLBACK_GAMEPLAY[category];
    return (fb && gameplaySlugs.has(fb)) ? fb : 'physics';
}

// ---- Factual placeholder content (Phase A — extend.md §3, CONTEXT.md) ----
const CAT_LABEL = { puzzle: 'puzzle', action: 'action', arcade: 'arcade', strategy: 'strategy', 'racing-sports': 'racing & sports', simulation: 'simulation' };
function placeholderAbout(e, category) {
    const catName = CAT_LABEL[category] || 'arcade';
    const awardNote = e.award > 1 ? ` It was recognised in the ${e.year} competition.` : '';
    return `${e.name} is a ${catName} game by ${e.author || 'an independent developer'}, submitted to the js13kGames ${e.year} competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art and audio all included — a constraint that rewards focused, clever design.${awardNote}\n\nWe catalogue it because it represents the spirit of the size-limited game jam: a complete, playable experience distilled to its essence. Open it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)`;
}
function placeholderHowToPlay(e) {
    return `Most js13kGames entries use keyboard or mouse controls. Open ${e.name} on the official js13kGames page to read its in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, the mouse for point-and-click titles, and space for primary actions. Many entries show their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)`;
}
function pickTags(e, gameplayTag) {
    const t = ['13kb', 'open-source'];
    if (gameplayTag && !t.includes(gameplayTag)) t.push(gameplayTag);
    if (e.award >= 17) t.push('classic');
    else if (e.award > 1) t.push('skill-based');
    if (/retro|pixel|8bit|8-bit|nes|c64|arcade/i.test(e.name)) t.push('retro');
    else if (/minimal|one|simple|tiny|small/i.test(e.name)) t.push('minimal');
    else t.push('experimental');
    return [...new Set(t)].filter((s) => tagSlugs.has(s)).slice(0, 5);
}

// ---- Build fresh candidate list with dedup vs existing ----
const fresh = raw.filter((e) => {
    const sk = `js13k:${e.year}:${e.slug}`;
    if (existingSourceKeys.has(sk)) return false;
    return true;
}).map((e) => ({ ...e, category: classify(e.name) }));

// ---- Quota per category (lifts every category >= 20; no new arcade) ----
// Current (post-backfill, 386): arcade 317 / puzzle 34 / strategy 15 / sim 9 / action 9 / racing 2
const current = {};
games.forEach((g) => (current[g.category] = (current[g.category] || 0) + 1));
// Targets lift every category to a healthy floor while keeping Arcade flat
// (extend.md §4.3 — Arcade already at 317/81%, do not grow it). Sums to ~116
// → ~502 total. js13k supply is ample for each (action 81, strategy 50,
// puzzle 69, simulation 23, racing 18 available among fresh candidates).
const QUOTA = {
    'racing-sports': Math.max(0, 20 - current['racing-sports']),  // 18 (all available)
    simulation: Math.max(0, 30 - current['simulation']),          // 21
    action: Math.max(0, 45 - current['action']),                  // 36
    strategy: Math.max(0, 40 - current['strategy']),              // 25
    puzzle: Math.max(0, 50 - current['puzzle']),                  // 16
};
// sort each category by award×year so we take the strongest first
const byScore = (a, b) => (b.award * 100 + b.year) - (a.award * 100 + a.year);
const selected = [];
for (const [cat, n] of Object.entries(QUOTA)) {
    const pool = fresh.filter((e) => e.category === cat).sort(byScore);
    selected.push(...pool.slice(0, n));
}
// If under target, top up with remaining strong non-arcade candidates.
if (limitArg) {
    while (selected.length < limitArg) {
        const used = new Set(selected.map((e) => `${e.year}:${e.slug}`));
        const next = fresh.filter((e) => e.category !== 'arcade' && !used.has(`${e.year}:${e.slug}`)).sort(byScore)[0];
        if (!next) break;
        selected.push(next);
    }
}

// ---- Build full entries ----
const newEntries = selected.map((e) => {
    let slug = e.slug;
    if (existingSlugs.has(slug)) slug = `${slug}-${e.year}`;
    let suffix = 2;
    while (existingSlugs.has(slug)) slug = `${e.slug}-${e.year}-${suffix++}`;
    existingSlugs.add(slug);
    const gameplayTag = pickGameplay(e.name, e.category);
    return {
        id: nextId++,
        slug,
        name: e.name,
        category: e.category,
        tagline: `A ${e.year} js13kGames entry by ${e.author || 'an indie dev'} — under 13KB of pure craft.`,
        about: placeholderAbout(e, e.category),
        howToPlay: placeholderHowToPlay(e),
        keyFeatures: [
            'Built in under 13 kilobytes (code, art, audio)',
            `Submitted to js13kGames ${e.year}`,
            `Author: ${e.author || 'independent developer'}`,
            ...(e.award > 1 ? ['Competition-recognised entry'] : []),
        ],
        screenshots: [],
        sourceName: 'js13kGames',
        sourceUrl: `https://js13kgames.com/${e.year}/games/${e.slug}`,
        licence: 'source-available',
        licenceStatus: 'source-available',
        sourceKey: `js13k:${e.year}:${e.slug}`,
        tags: pickTags(e, gameplayTag),
        addedDate: '2026-07-14',
        releaseDate: String(e.year),
        featured: false,
    };
});

// ---- Report ----
const newCats = {};
newEntries.forEach((g) => (newCats[g.category] = (newCats[g.category] || 0) + 1));
const merged = current;
Object.entries(newCats).forEach(([c, n]) => (merged[c] = (merged[c] || 0) + n));
console.log('=== expand report ===');
console.log(`existing games: ${games.length} | fresh candidates available: ${fresh.length}`);
console.log(`selected for import: ${newEntries.length}`);
console.log(`new by category: ${JSON.stringify(newCats)}`);
console.log(`projected totals: ${JSON.stringify(merged)} (sum ${Object.values(merged).reduce((a, b) => a + b, 0)})`);

if (DRY) {
    console.log('(dry-run — no file written)');
    process.exit(0);
}

// ---- Merge + write (same format as backfill-fields.js) ----
const FIELD_ORDER = [
    'id', 'slug', 'name', 'category', 'tagline', 'about', 'howToPlay',
    'keyFeatures', 'screenshots', 'sourceName', 'sourceUrl', 'licence',
    'licenceStatus', 'sourceKey', 'tags', 'addedDate', 'releaseDate', 'featured',
];
const reorder = (g) => {
    const o = {};
    for (const f of FIELD_ORDER) if (f in g) o[f] = g[f];
    for (const f of Object.keys(g)) if (!(f in o)) o[f] = g[f];
    return o;
};
const all = [...games, ...newEntries].map(reorder);
const out = HEADER + 'module.exports = ' + JSON.stringify(all, null, 4) + ';\n';
fs.writeFileSync(GAMES_PATH, out);
console.log(`wrote ${all.length} games to ${path.relative(process.cwd(), GAMES_PATH)}`);
