#!/usr/bin/env node
// =============================================================================
// fetch-github-games.js — harvest browser-playable games from GitHub topic pages.
//
// Searches repos tagged html5-game, browser-game, web-game, javascript-game,
// phaser-game, canvas-game. Keeps only those with a real homepage URL (the
// author's playable site). Liveness-checks each homepage.
//
// Output: scripts/github-games-raw.json — array of {name, homepage, stars, desc, repo, topics, language, licence}
// =============================================================================
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const TOPICS = ['html5-game', 'browser-game', 'web-game', 'javascript-game', 'phaser-game', 'canvas-game', 'html5-games', 'webgl-game'];
const MIN_STARS = 3; // filter out abandoned noise
const PAGES_PER_TOPIC = 5; // up to 500 repos per topic

function checkUrl(rawUrl) {
    return new Promise((resolve) => {
        let url = rawUrl.trim();
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        try { new URL(url); } catch { return resolve(false); }
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, { timeout: 8000, headers: { 'User-Agent': 'arcadebloom-research' } }, (res) => {
            res.resume();
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => { req.destroy(); resolve(false); });
    });
}

async function fetchTopic(topic, page) {
    const q = `topic:${topic}+stars:>${MIN_STARS}`;
    try {
        const out = execSync(
            `gh api "search/repositories?q=${q}&sort=stars&per_page=100&page=${page}"`,
            { encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024 * 20 }
        ).trim();
        const data = JSON.parse(out);
        const items = (data.items || []).filter((i) => i.homepage && i.homepage.trim());
        return items.map((i) => ({
            name: i.name, full: i.full_name, homepage: i.homepage.trim(),
            stars: i.stargazers_count, desc: i.description, topics: i.topics, lang: i.language,
        }));
    } catch { return []; }
}

async function main() {
    const seen = new Set();
    const all = [];

    for (const topic of TOPICS) {
        for (let page = 1; page <= PAGES_PER_TOPIC; page++) {
            const items = await fetchTopic(topic, page);
            if (!items.length) break;
            for (const item of items) {
                const key = item.full; // dedupe by repo full name
                if (seen.has(key)) continue;
                seen.add(key);
                // Skip frameworks/engines/libraries (we want actual games)
                if (/framework|engine|library|sdk|template|boilerplate|starter|tutorial|example/i.test(item.name + ' ' + (item.desc || ''))) continue;
                all.push({ ...item, source: 'github-' + topic });
            }
        }
        console.log(`${topic}: ${all.length} unique games so far`);
    }

    console.log(`\nTotal unique game repos with homepages: ${all.length}`);

    // Liveness check (sample — full check of all is slow)
    console.log('Liveness-checking homepages...');
    const BATCH = 10;
    const alive = [];
    for (let i = 0; i < all.length; i += BATCH) {
        const batch = all.slice(i, i + BATCH);
        const results = await Promise.all(batch.map(async (g) => ({ ...g, alive: await checkUrl(g.homepage) })));
        results.filter((r) => r.alive).forEach((r) => alive.push(r));
        process.stdout.write(`  ${Math.min(i + BATCH, all.length)}/${all.length} checked, ${alive.length} alive\r`);
    }
    console.log(`\n${alive.length}/${all.length} homepages are live.`);

    fs.writeFileSync(path.join(__dirname, 'github-games-raw.json'), JSON.stringify(alive, null, 2));
    console.log(`Wrote scripts/github-games-raw.json`);

    // Sort by stars
    alive.sort((a, b) => b.stars - a.stars);
    console.log('\nTop 10 by stars:');
    alive.slice(0, 10).forEach((g) => console.log(`  ${g.stars}★ ${g.name} → ${g.homepage}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
