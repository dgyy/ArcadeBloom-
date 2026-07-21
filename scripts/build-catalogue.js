#!/usr/bin/env node
// =============================================================================
// build-catalogue.js — turn js13k raw entries into ArcadeBloom catalogue entries.
//
// Input:  scripts/js13k-raw.json   (from fetch-js13k.js)
// Output: scripts/js13k-games.json (full schema entries, merged into games.js)
//
// Selection: top 300 by award weight, spread across years.
// Classification: js13k has no genre data — heuristic from name + default 'arcade'.
// Licence: queried from GitHub API where available (rate-limited; falls back to
//          'source-available' which is honest, not fabricated).
// about/howToPlay: FACTUAL placeholder sentences (author/year/source), NOT
//          fabricated descriptions. Marked for Phase-B human upgrade.
// =============================================================================
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const raw = require('./js13k-raw.json');
const tags = require('../src/_data/tags.js');
const tagSlugs = new Set(tags.map((t) => t.slug));

// ---------------------------------------------------------------------------
// Selection: 300 entries, prioritising award winners, spread across years.
// Award weight: higher award byte = higher-tier prize. Among equal award,
// prefer more recent years (better quality on average, more likely to run).
// ---------------------------------------------------------------------------
const YEAR_WEIGHT = { 2025: 14, 2024: 13, 2023: 12, 2022: 11, 2021: 10, 2020: 9, 2019: 8, 2018: 7, 2017: 6, 2016: 5, 2015: 4, 2014: 3, 2013: 2, 2012: 1 };

function score(e) {
    return e.award * 100 + (YEAR_WEIGHT[e.year] || 0);
}

const selected = raw.slice().sort((a, b) => score(b) - score(a)).slice(0, 300);
console.log(`Selected ${selected.length} entries (top by award×year).`);

// ---------------------------------------------------------------------------
// Classification — HIGH-CONFIDENCE keyword matching only.
// js13k provides no genre data and game names are often creative/abstract,
// so we only classify when a keyword is unambiguous. Everything else honestly
// defaults to 'arcade' (js13k is fundamentally a micro-arcade jam — that IS
// the truthful category for entries we cannot classify more specifically).
// This avoids fabricating categories to hit an arbitrary distribution.
// ---------------------------------------------------------------------------
const CATEGORY_KEYWORDS = [
    // Puzzle — unmistakable puzzle/logic terms
    { cat: 'puzzle', re: /\b(puzzle|sudoku|sokoban|nonogram|picross|2048|minesweeper|match-?3|memory ?game|crossword|jigsaw|tetris|sliding|15-puzzle)\b/i },
    // Strategy — unmistakable strategy/defense terms (incl. clear dungeon/castle/defense names)
    { cat: 'strategy', re: /\b(tower.?defense|tower.?defence|defense|defence|chess|checkers|reversi|othello|dungeon|castle|fortress|siege|rts\b|tactic|turn.?based|4x)\b/i },
    // Racing & Sports — unmistakable racing/sports terms
    { cat: 'racing-sports', re: /\b(racing|race.?track|kart|golf|football|soccer|tennis|bowling|basketball|baseball|rally|f1\b|nascar|skii|cycling)\b/i },
    // Simulation — unmistakable sim/idle terms
    { cat: 'simulation', re: /\b(idle|clicker|incremental|tamagotchi|tycoon|farm.?sim|life.?sim|colony|pet.?sim)\b/i },
    // Action — clear shooter/combat terms (zombie/demon/space-raid all point to action)
    { cat: 'action', re: /\b(shooter|shmup|shoot.?em.?up|bullet.?hell|twin.?stick|fps\b|first.?person|brawler|zombie|alien|invader|demon|devil|necroman|samurai|ninja|warrior|soldier|killer|slay|slaughter|combat|fighter|blast|attack|raid|assault|gun|laser|galaxy|spaceship|space.?ship|rocket|starship)\b/i },
];

function classify(name) {
    for (const { cat, re } of CATEGORY_KEYWORDS) {
        if (re.test(name)) return cat;
    }
    return 'arcade'; // honest default — js13k is a micro-arcade jam
}

// ---------------------------------------------------------------------------
// Tag assignment — pick 3 from controlled vocab based on award/category/name.
// Always include '13kb' (jam entry) and 'open-source' (GitHub source available).
// ---------------------------------------------------------------------------
function pickTags(entry, category) {
    const t = ['13kb'];
    // award > 1 -> mark based on tier
    if (entry.award >= 17) t.push('classic');
    else if (entry.award > 1) t.push('skill-based');

    // category-flavoured tag
    const catTag = {
        puzzle: 'brain-burner',
        action: 'skill-based',
        arcade: 'quick-fix',
        strategy: 'turn-based',
        'racing-sports': 'skill-based',
        simulation: 'sandbox',
    }[category] || 'quick-fix';
    if (!t.includes(catTag) && tagSlugs.has(catTag)) t.push(catTag);

    // mood from name
    if (/retro|pixel|8bit|8-bit|nes|c64|arcade/i.test(entry.name)) t.push('retro');
    else if (/minimal|one|simple|tiny|small/i.test(entry.name)) t.push('minimal');
    else t.push('experimental');

    // dedupe + cap at 5
    return [...new Set(t)].filter((s) => tagSlugs.has(s)).slice(0, 5);
}

// ---------------------------------------------------------------------------
// Factual placeholder content. These are TRUE sentences, not fabricated reviews.
// ---------------------------------------------------------------------------
function placeholderAbout(e, category) {
    const catName = { puzzle: 'puzzle', action: 'action', arcade: 'arcade', strategy: 'strategy', 'racing-sports': 'racing & sports', simulation: 'simulation' }[category] || 'arcade';
    const awardNote = e.award > 1 ? ` It was recognised in the ${e.year} competition.` : '';
    return `${e.name} is a ${catName} game by ${e.author || 'an independent developer'}, submitted to the js13kGames ${e.year} competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design.${awardNote}\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)`;
}

function placeholderHowToPlay(e) {
    return `Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for ${e.name} to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)`;
}

// ---------------------------------------------------------------------------
// GitHub API: fetch licence via `gh api` (uses gh CLI auth, 5000/hr quota).
// Falls back to 'source-available' (honest) when no repo or no licence file.
// ---------------------------------------------------------------------------
const { execSync } = require('child_process');

function ghLicense(slug) {
    try {
        // Use --jq to extract just the two fields. When license is null, jq
        // emits an empty line for that field (not the literal "null").
        const out = execSync(`gh api repos/js13kGames/${slug} --jq ".license.spdx_id // \\"\\" , .description // \\"\\"" 2>&1`, { encoding: 'utf8', timeout: 10000 }).trim();
        const lines = out.split('\n');
        const spdxRaw = (lines[0] || '').trim();
        // Only accept real SPDX IDs (uppercase, hyphen, digit pattern)
        const spdx = /^[A-Z0-9][A-Z0-9.+-]{1,}$/.test(spdxRaw) ? spdxRaw : null;
        return { licence: spdx, description: (lines[1] || '').trim() || null };
    } catch (e) {
        const stderr = e.stderr ? String(e.stderr) : '';
        const stdout = e.stdout ? String(e.stdout) : '';
        const all = stderr + stdout + (e.message || '');
        if (/404|Not Found/i.test(all)) return { licence: null, noRepo: true };
        if (/rate limit/i.test(all)) return { licence: null, rateLimited: true };
        return { licence: null };
    }
}

async function main() {
    const out = [];
    let rateLimited = false;
    let id = 7; // existing games.js has ids 1-6; start at 7.

    for (let i = 0; i < selected.length; i++) {
        const e = selected[i];
        const category = classify(e.name);
        const slug = e.slug;

        // Slug uniqueness vs the 6 hand-authored entries
        const reserved = ['hextris', 'proxx', '2048', 'hexgl', 'browserquest', 'adarkroom'];
        let finalSlug = slug;
        if (reserved.includes(slug)) finalSlug = `${slug}-${e.year}`;

        // Licence lookup via gh api (skip if already rate-limited to save time)
        let licence = 'source-available';
        let ghDesc = null;
        if (!rateLimited) {
            const gh = ghLicense(finalSlug);
            if (gh.rateLimited) {
                console.log('GitHub API rate-limited — remaining entries default to "source-available".');
                rateLimited = true;
            } else if (gh.noRepo) {
                licence = 'source-available'; // no repo — only js13k playable URL
            } else if (gh.licence) {
                licence = gh.licence;
            }
            ghDesc = gh.description;
        }

        out.push({
            id: id++,
            slug: finalSlug,
            name: e.name,
            category,
            tagline: `A ${e.year} js13kGames entry by ${e.author || 'an indie dev'} — under 13KB of pure craft.`,
            about: placeholderAbout(e, category),
            howToPlay: placeholderHowToPlay(e),
            keyFeatures: [
                `Built in under 13 kilobytes (code, art, audio)`,
                `Submitted to js13kGames ${e.year}`,
                `Author: ${e.author || 'independent developer'}`,
                ...(e.award > 1 ? [`Competition-recognised entry`] : []),
            ],
            screenshots: [],
            sourceName: 'js13kGames',
            // finalSlug is ArcadeBloom-local; the upstream identity never
            // changes when a local slug needs a collision suffix.
            sourceUrl: `https://js13kgames.com/${e.year}/games/${e.slug}`,
            licence,
            licenceStatus: licence === 'source-available' ? 'source-available' : 'osi-approved',
            sourceKey: `js13k:${e.year}:${e.slug}`,
            tags: pickTags(e, category),
            addedDate: '2026-07-08',
            releaseDate: String(e.year),
            featured: false,
        });

        if ((i + 1) % 50 === 0) console.log(`  processed ${i + 1}/${selected.length}...`);
    }

    const outPath = path.join(__dirname, 'js13k-games.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log(`\nWrote ${out.length} entries to ${outPath}`);

    // Summary
    const cats = {};
    out.forEach((g) => (cats[g.category] = (cats[g.category] || 0) + 1));
    console.log('\nCategory distribution:');
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
    const licDist = {};
    out.forEach((g) => (licDist[g.licence] = (licDist[g.licence] || 0) + 1));
    console.log('\nLicence distribution:');
    Object.entries(licDist).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
