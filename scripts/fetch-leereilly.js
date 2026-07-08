#!/usr/bin/env node
// =============================================================================
// fetch-leereilly.js — extract playable browser games from leereilly/games,
// liveness-check their play URLs, and map to ArcadeBloom's 6 categories.
//
// This source is ARCHIVED (2012-2014 vintage) so many links are dead — we
// HTTP-check every play URL before keeping it. Output: scripts/leereilly-raw.json
// =============================================================================
'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchText(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, { timeout: 10000 }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchText(res.headers.location)); // follow redirect
            }
            if (res.statusCode !== 200) { res.resume(); return resolve(null); }
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        }).on('error', () => resolve(null)).on('timeout', function() { this.destroy(); resolve(null); });
    });
}

function checkUrl(url) {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, { timeout: 8000, headers: { 'User-Agent': 'arcadebloom-research' } }, (res) => {
            res.resume();
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => { req.destroy(); resolve(false); });
    });
}

// Map leereilly ## subsections to our 6 categories.
const SUBCAT_MAP = {
    Boardgame: 'strategy',
    Arcade: 'arcade',
    FPS: 'action',
    RPG: 'simulation',
    MMORPG: 'simulation',
    Strategy: 'strategy',
    Racing: 'racing-sports',
    Sandbox: 'simulation',
    Puzzle: 'puzzle',
    Clicker: 'simulation',
    'Point and Click': 'puzzle',
    Others: 'arcade',
};

async function main() {
    const md = await fetchText('https://raw.githubusercontent.com/leereilly/games/master/README.md');
    if (!md) { console.error('failed to fetch README'); process.exit(1); }

    const lines = md.split('\n');
    const candidates = [];
    let currentSub = '';
    let inBrowser = false;

    for (const line of lines) {
        if (/^# Browser-Based/.test(line)) { inBrowser = true; continue; }
        if (/^# Native/.test(line) || /^# Mobile/.test(line)) { inBrowser = false; continue; }
        const subMatch = line.match(/^## (.+)/);
        if (subMatch) { currentSub = subMatch[1].trim(); continue; }

        if (!inBrowser) continue;
        // Match: * [Name](repo) - desc. [Play it now!](url)
        const m = line.match(/^\*\s+\[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+?)\s*\[Play it now!\]\(([^)]+)\)/);
        if (m) {
            candidates.push({
                name: m[1],
                repo: m[2],
                desc: m[3].replace(/\.$/, '').trim(),
                play: m[4],
                sub: currentSub,
                category: SUBCAT_MAP[currentSub] || 'arcade',
            });
        }
    }

    console.log(`Found ${candidates.length} playable browser entries. Liveness-checking...`);

    // Liveness check — this is the slow part. Run in small concurrent batches.
    const alive = [];
    const BATCH = 10;
    for (let i = 0; i < candidates.length; i += BATCH) {
        const batch = candidates.slice(i, i + BATCH);
        const results = await Promise.all(batch.map(async (c) => ({ ...c, alive: await checkUrl(c.play) })));
        results.filter((r) => r.alive).forEach((r) => alive.push(r));
        process.stdout.write(`  checked ${Math.min(i + BATCH, candidates.length)}/${candidates.length}, ${alive.length} alive\r`);
    }
    console.log(`\n${alive.length}/${candidates.length} play URLs are live.`);

    fs.writeFileSync(path.join(__dirname, 'leereilly-raw.json'), JSON.stringify(alive, null, 2));
    console.log(`Wrote scripts/leereilly-raw.json`);

    // Distribution
    const byCat = {};
    alive.forEach((c) => (byCat[c.category] = (byCat[c.category] || 0) + 1));
    console.log('\nBy category:');
    Object.entries(byCat).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
