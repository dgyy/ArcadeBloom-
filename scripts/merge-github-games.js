#!/usr/bin/env node
// =============================================================================
// merge-github-games.js — convert github-games-raw.json into catalogue entries
// and append to the merged data. Dedupes against existing slugs + URLs.
//
// GitHub source games have real homepage URLs (liveness-checked), real authors
// (the repo owner), and verifiable licences (GitHub repo licence field).
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const ghGames = require('./github-games-raw.json');
const existing = require('../src/_data/games.js');
const tags = require('../src/_data/tags.js');
const tagSlugs = new Set(tags.map((t) => t.slug));

const existingSlugs = new Set(existing.map((g) => g.slug));
const existingUrls = new Set(existing.map((g) => g.sourceUrl));

// Classification — same keyword approach, tuned for GitHub game names (more descriptive)
const CATEGORY_KEYWORDS = [
    { cat: 'puzzle', re: /\b(puzzle|sudoku|sokoban|nonogram|picross|2048|minesweeper|match-?3|memory|crossword|jigsaw|tetris|sliding|chess|connect|logic|brain|word|number)\b/i },
    { cat: 'strategy', re: /\b(strategy|defense|defence|tower|chess|checkers|reversi|othello|dungeon|castle|fortress|siege|rts|tactic|turn.?based|4x|war|battle|conquer|empire|kingdom|civilization)\b/i },
    { cat: 'racing-sports', re: /\b(race|racing|kart|golf|football|soccer|tennis|bowling|basketball|baseball|rally|f1|nascar|ski|bike|cycl|car|drive|driv|speed|sport)\b/i },
    { cat: 'simulation', re: /\b(sim|idle|clicker|incremental|tamagotchi|tycoon|farm|city|town|world|sandbox|cafe|shop|store|restaurant|evolve|grow|colony|life|pet)\b/i },
    { cat: 'action', re: /\b(shoot|shooter|gun|fight|combat|ninja|warrior|zombie|monster|boss|attack|blast|killer|invader|alien|demon|devil|hell|death|dead|evil|dark|shadow|blade|sword|soldier|hero|slay|survival|horde|wave|samurai|knight|dragon|fps|arena|brawler|platformer|metroidvania)\b/i },
    { cat: 'arcade', re: /\b(pong|breakout|snake|tetris|arcade|classic|retro|pixel|platform|jump|bounce|flappy|asteroid|space|invader|galaga|pacman|pac-man|pinball|arcade)\b/i },
];
function classify(name, desc) {
    const text = name + ' ' + (desc || '');
    for (const { cat, re } of CATEGORY_KEYWORDS) { if (re.test(text)) return cat; }
    return 'arcade';
}

function slugify(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function pickTags(name, desc, category) {
    const t = ['open-source'];
    const catTag = { puzzle: 'brain-burner', strategy: 'turn-based', simulation: 'sandbox', 'racing-sports': 'skill-based', action: 'skill-based', arcade: 'quick-fix' }[category];
    if (catTag && tagSlugs.has(catTag)) t.push(catTag);
    if (/retro|pixel|8bit|classic|arcade|old/i.test(name + ' ' + desc)) t.push('retro');
    else if (/minimal|one|simple|tiny|small/i.test(name)) t.push('minimal');
    else t.push('classic');
    return [...new Set(t)].filter((s) => tagSlugs.has(s)).slice(0, 4);
}

// Normalize homepage URL (strip trailing slash, ensure protocol)
function normalizeUrl(url) {
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    return u.replace(/\/+$/, '');
}

let id = Math.max(...existing.map((g) => g.id)) + 1;
const newEntries = [];
let skippedDupe = 0;

for (const gh of ghGames) {
    let slug = slugify(gh.name);
    if (!slug || slug.length < 2) continue;
    // Ensure unique slug
    if (existingSlugs.has(slug)) slug = slug + '-game';
    if (existingSlugs.has(slug)) slug = slug + '-' + gh.full.split('/')[0];
    if (existingSlugs.has(slug) || slug.length > 60) { skippedDupe++; continue; }

    const sourceUrl = normalizeUrl(gh.homepage);
    if (existingUrls.has(sourceUrl)) { skippedDupe++; continue; }

    // Skip non-game homepages (frameworks, lists, etc. already filtered, but double-check)
    if (/github\.com\/(topics|search|explore)/i.test(sourceUrl)) continue;

    existingSlugs.add(slug);
    existingUrls.add(sourceUrl);

    const category = classify(gh.name, gh.desc);
    const author = gh.full.split('/')[0]; // repo owner = author
    const desc = gh.desc || `${gh.name} — an open-source browser game.`;

    newEntries.push({
        id: id++,
        slug,
        name: gh.name,
        category,
        tagline: desc.length > 80 ? desc.slice(0, 77) + '...' : desc,
        about: `${gh.name} — ${desc} Originally an open-source browser game on GitHub by ${author}.\n\nPlay it at the author's own site via the link below. (Factual placeholder — a full review will follow.)`,
        howToPlay: `Open ${gh.name} via the source link to see the in-game controls. Most browser games use keyboard, mouse, or touch. (Factual placeholder — specific controls will be documented in the full guide.)`,
        keyFeatures: [
            `Open-source browser game (GitHub: ${gh.full})`,
            `${gh.stars}+ GitHub stars`,
            `Author: ${author}`,
        ],
        screenshots: [],
        sourceName: gh.name,
        sourceUrl,
        licence: 'source-available',
        tags: pickTags(gh.name, gh.desc, category),
        addedDate: '2026-07-16',
        releaseDate: 'unknown',
        featured: false,
        _source: 'github',
        _repo: gh.full,
    });
}

console.log(`Adding ${newEntries.length} GitHub-sourced games (${skippedDupe} dupes skipped).`);
console.log(`Total after merge: ${existing.length + newEntries.length}`);

// Load merged json and append
const mergedPath = path.join(__dirname, 'js13k-games-merged.json');
const merged = require(mergedPath);
const combined = [...merged, ...newEntries];
// Re-number ids
combined.forEach((g, i) => { g.id = i + 1; });
fs.writeFileSync(mergedPath, JSON.stringify(combined, null, 4));
console.log(`Merged json now: ${combined.length} entries.`);

// Category distribution from new entries
const cats = {};
newEntries.forEach((g) => (cats[g.category] = (cats[g.category] || 0) + 1));
console.log('\nNew GitHub entries by category:');
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
