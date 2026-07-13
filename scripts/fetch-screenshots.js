#!/usr/bin/env node
// =============================================================================
// fetch-screenshots.js — download js13k game screenshots (.c.jpg) for all
// js13k-sourced games, store under src/static/screenshots/.
//
// URL pattern (verified live): https://play.js13kgames.com/{slug}/.c.jpg
// Some entries have no screenshot (404) — those keep the CSS placeholder.
//
// This script ONLY downloads files — it does NOT modify games.js. The
// screenshots[] field in games.js already records the path; this just ensures
// the image file exists. Safe to run in CI (Cloudflare build).
//
// Re-runnable: skips files already present.
// =============================================================================
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const games = require('../src/_data/games.js');
const SHOT_DIR = path.join(__dirname, '..', 'src', 'static', 'screenshots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

function download(url, dest) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, { timeout: 10000, headers: { 'User-Agent': 'arcadebloom-build' } }, (res) => {
            if (res.statusCode !== 200) { file.close(); fs.unlink(dest, () => {}); return resolve(false); }
            res.pipe(file);
            file.on('finish', () => file.close(() => resolve(true)));
        });
        req.on('error', () => { fs.unlink(dest, () => {}); resolve(false); });
        req.on('timeout', () => { req.destroy(); fs.unlink(dest, () => {}); resolve(false); });
    });
}

// Only js13k-sourced games have a predictable screenshot URL.
// Also only download for games that have a screenshots[] path set in games.js.
const js13kGames = games.filter((g) => g.sourceName === 'js13kGames' && g.screenshots && g.screenshots.length > 0);
console.log(`Fetching screenshots for ${js13kGames.length} js13k games...`);

(async () => {
    let ok = 0, fail = 0, skip = 0;
    const BATCH = 5;
    for (let i = 0; i < js13kGames.length; i += BATCH) {
        const batch = js13kGames.slice(i, i + BATCH);
        await Promise.all(batch.map(async (g) => {
            const fname = `${g.slug}.jpg`;
            const dest = path.join(SHOT_DIR, fname);
            // Skip if already downloaded
            if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { skip++; return; }
            const url = `https://play.js13kgames.com/${g.slug}/.c.jpg`;
            const success = await download(url, dest);
            if (success) { ok++; } else { fail++; }
        }));
        if ((i + BATCH) % 50 === 0 || i + BATCH >= js13kGames.length) {
            process.stdout.write(`  ${Math.min(i + BATCH, js13kGames.length)}/${js13kGames.length} processed (ok=${ok} fail=${fail} skip=${skip})\r`);
        }
    }
    console.log(`\nDone: ${ok} downloaded, ${fail} missing (404), ${skip} already present.`);
    console.log('Screenshots are in src/static/screenshots/ (gitignored — see CONTENT-LICENSE.md).');
})();

