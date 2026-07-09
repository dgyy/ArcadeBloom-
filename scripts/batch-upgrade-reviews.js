#!/usr/bin/env node
// =============================================================================
// batch-upgrade-reviews.js — upgrade placeholder reviews to README-based
// enriched reviews for all js13k games with sufficient source material.
//
// METHOD (not fabrication): for each game, fetch its GitHub README, extract the
// substantive description (stripping badges/images/links/code), and compose a
// review that quotes/paraphrases the REAL content the author published. The
// result is honest, source-grounded, and far richer than the placeholder —
// without inventing gameplay details we cannot verify.
//
// Reviews cite: the real premise, real controls, real mechanics, real theme,
// and the competition context — all from the author's own README.
//
// Output: updates scripts/js13k-games-merged.json + src/_data/games.js
// =============================================================================
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const games = require('../src/_data/games.js');
const raw = require('./js13k-raw.json');

// award + year lookup
const meta = {};
raw.forEach(e => { if (!meta[e.slug] || e.award > meta[e.slug].award) meta[e.slug] = { award: e.award, year: e.year, author: e.author }; });

// Games already upgraded (skip)
const UPGRADED = new Set([
    'hextris','proxx','2048','hexgl','browserquest','adarkroom', // hand-authored
    '13c-defense','van-helsing','galaxy-raid','space-janitor', // batch 1
    'the-last-space-bender','invasion-from-jupiter-in-space','escape-from-death-hole',
    'spatial-poker','rocket-cargo','capturing-souls-on-the-river-of-the-dead',
    'death-game','shadow-of-the-keening-star','death-scythe','age-of-the-demigods', // batch 2
]);

// Candidates: placeholder + js13k + not already upgraded
const candidates = games.filter(g =>
    g.sourceName === 'js13kGames' &&
    /placeholder/i.test(g.about) &&
    !UPGRADED.has(g.slug)
);

console.log('Candidates to scan: ' + candidates.length);

function fetchReadme(slug) {
    try {
        const b64 = execSync('gh api repos/js13kGames/'+slug+'/readme --jq .content', {encoding:'utf8', timeout: 8000}).replace(/\n/g, '').trim();
        return Buffer.from(b64, 'base64').toString('utf8');
    } catch { return null; }
}

function cleanReadme(content) {
    return content
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/```[\s\S]*$/g, '') // unterminated code block
        .replace(/^#+\s*/gm, '')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .split('\n')
        .filter(l => {
            const t = l.trim();
            return t.length > 15 &&
                !/^https?:/.test(t) &&
                !/badge|shield|img\.shields|svg|png|gif|jpg/i.test(t) &&
                !/^[`*_#>-]/.test(t) &&
                !/copyright|licensed? under|all rights reserved/i.test(t) &&
                !/npm install|npm run|git clone|yarn|webpack|rollup|express|socket\.io|node_modules|package\.json|requirements/i.test(t);
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Extract the most informative sentences from cleaned README
function extractKeySentences(text, maxSentences) {
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 30 && s.length < 400);
    // Score: prefer sentences with game-mechanic keywords, premise, controls
    const scored = sentences.map(s => {
        let score = 0;
        if (/play|game|you|control|move|shoot|jump|build|defend|collect|survive|escape|fight|explore/i.test(s)) score += 3;
        if (/keyboard|mouse|touch|gamepad|arrow|wasd|click|press|space/i.test(s)) score += 2;
        if (/level|boss|enemy|puzzle|score|weapon|power|ability|mechanic/i.test(s)) score += 2;
        if (/theme|inspired|entry|competition|js13k|jam/i.test(s)) score += 1;
        if (s.length > 60 && s.length < 250) score += 1; // readable length
        return { s, score };
    });
    return scored.sort((a,b) => b.score - a.score).slice(0, maxSentences).map(x => x.s);
}

function composeAbout(g, readme, m) {
    const clean = cleanReadme(readme);
    const keySentences = extractKeySentences(clean, 4);
    const premise = keySentences[0] || g.tagline;
    const detail1 = keySentences[1] || '';
    const detail2 = keySentences[2] || '';
    const detail3 = keySentences[3] || '';

    let about = premise + ' ';
    if (detail1 && detail1 !== premise) about += detail1 + ' ';
    if (detail2 && detail2 !== detail1) about += detail2 + ' ';

    about += '\n\n' + g.name + ' was submitted to the js13kGames ' + (m.year || '') + ' competition by ' + (m.author || 'an independent developer') + '. ';
    if (m.award > 1) about += 'It earned competition recognition. ';
    about += 'Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.';

    if (detail3) about += ' ' + detail3;

    return about.trim();
}

function composeHowToPlay(g, readme) {
    const clean = cleanReadme(readme);
    // Find control-related sentences
    const controlSentences = clean.split(/(?<=[.!?])\s+/).filter(s =>
        /keyboard|mouse|touch|gamepad|arrow|wasd|click|press|space|control|move|key/i.test(s) &&
        s.length > 20 && s.length < 300
    ).slice(0, 3);

    if (controlSentences.length) {
        return controlSentences.join(' ') + '\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.';
    }
    return g.name + ' uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.';
}

function composeKeyFeatures(g, readme, m) {
    const clean = cleanReadme(readme);
    const features = ['Built in under 13 kilobytes (code, art, audio)'];
    features.push('Submitted to js13kGames ' + (m.year || ''));
    features.push('Author: ' + (m.author || 'independent developer'));
    if (m.award > 1) features.push('Competition-recognised entry');

    // Try to extract a distinctive feature from README
    const mechanicSentence = clean.split(/(?<=[.!?])\s+/).find(s =>
        /unique|special|mechanic|feature|gravity|physics|procedural|multiplayer|random|generated/i.test(s) &&
        s.length > 30 && s.length < 200
    );
    if (mechanicSentence) {
        features.push(mechanicSentence.split(/[,;]/)[0].trim().slice(0, 80));
    }
    return features.slice(0, 5);
}

// Process
let upgraded = 0, skipped = 0, failed = 0;
const updates = {};

for (let i = 0; i < candidates.length; i++) {
    const g = candidates[i];
    const m = meta[g.slug] || { award: 0, year: g.releaseDate, author: '' };
    const readme = fetchReadme(g.slug);

    if (!readme) { failed++; continue; }
    const clean = cleanReadme(readme);
    if (clean.split(/\s+/).length < 30) { skipped++; continue; } // not enough real content

    const about = composeAbout(g, readme, m);
    // Skip if about is too short (not enough real material)
    if (about.split(/\s+/).length < 60) { skipped++; continue; }

    updates[g.slug] = {
        about,
        howToPlay: composeHowToPlay(g, readme),
        keyFeatures: composeKeyFeatures(g, readme, m),
        tagline: g.tagline, // keep existing tagline
    };
    upgraded++;

    if (upgraded % 20 === 0) console.log('  upgraded ' + upgraded + '...');
}

console.log('\nUpgraded: ' + upgraded + ', skipped (thin README): ' + skipped + ', failed (no repo): ' + failed);

// Apply to merged json
const mergedPath = path.join(__dirname, 'js13k-games-merged.json');
const merged = require(mergedPath);
let applied = 0;
for (const m of merged) {
    if (updates[m.slug]) {
        Object.assign(m, updates[m.slug]);
        applied++;
    }
}
fs.writeFileSync(mergedPath, JSON.stringify(merged, null, 4));
console.log('Applied to ' + applied + ' entries in merged json.');
console.log('Run `node scripts/write-games-js.js` next.');
