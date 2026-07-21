#!/usr/bin/env node
// Discover recent HTML5 itch.io games through official browse-page RSS feeds.
// Results are staged only; no catalogue entries are published automatically.
'use strict';

const path = require('path');
const fs = require('fs');
const games = require('../src/_data/games.js');
const {
    classify, evaluatePlayPage, fetchText, licenceStatus, mapLimit,
    normalizeUrl, writeJson,
} = require('./lib/candidate-utils.js');

const FEEDS = [
    ['html5', 'https://itch.io/games/html5.xml'],
    ['action', 'https://itch.io/games/html5/tag-action.xml'],
    ['shooter', 'https://itch.io/games/html5/tag-shooter.xml'],
    ['fighting', 'https://itch.io/games/html5/tag-fighting.xml'],
    ['survival', 'https://itch.io/games/html5/tag-survival.xml'],
    ['puzzle', 'https://itch.io/games/html5/tag-puzzle.xml'],
    ['word-game', 'https://itch.io/games/html5/tag-word-game.xml'],
    ['card-game', 'https://itch.io/games/html5/tag-card-game.xml'],
    ['strategy', 'https://itch.io/games/html5/tag-strategy.xml'],
    ['tower-defense', 'https://itch.io/games/html5/tag-tower-defense.xml'],
    ['turn-based', 'https://itch.io/games/html5/tag-turn-based.xml'],
    ['racing', 'https://itch.io/games/html5/tag-racing.xml'],
    ['sports', 'https://itch.io/games/html5/tag-sports.xml'],
    ['simulation', 'https://itch.io/games/html5/tag-simulation.xml'],
    ['idle', 'https://itch.io/games/html5/tag-idle.xml'],
    ['management', 'https://itch.io/games/html5/tag-management.xml'],
    ['sandbox', 'https://itch.io/games/html5/tag-sandbox.xml'],
    ['platformer', 'https://itch.io/games/html5/tag-platformer.xml'],
    ['rhythm', 'https://itch.io/games/html5/tag-rhythm.xml'],
    ['local-multiplayer', 'https://itch.io/games/html5/tag-local-multiplayer.xml'],
    ['roguelike', 'https://itch.io/games/html5/tag-roguelike.xml'],
];
const OUTPUT = path.join(__dirname, 'candidates', 'itch.json');

function decodeXml(value) {
    return String(value || '')
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function field(block, name) {
    return decodeXml(block.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '').trim();
}

function parseFeed(xml, feedName) {
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
        const block = match[1];
        return {
            name: field(block, 'title'),
            sourceUrl: field(block, 'link'),
            description: field(block, 'description').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
            publishedAt: field(block, 'pubDate'),
            feedName,
        };
    }).filter((item) => item.name && item.sourceUrl);
}

async function main() {
    const existingUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
    const discovered = new Map();
    await mapLimit(FEEDS, 1, async ([feedName, url], index) => {
        if (index > 0) await new Promise((resolve) => setTimeout(resolve, 1200));
        let response;
        for (let attempt = 1; attempt <= 3; attempt++) {
            response = await fetchText(url, { accept: 'application/rss+xml,application/xml,text/xml', maxChars: 2000000, timeoutMs: 15000 });
            if (response.ok || response.status !== 429) break;
            const seconds = response.retryAfter || attempt * 15;
            console.warn(`itch feed ${feedName} rate-limited; retrying in ${seconds}s`);
            await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
        }
        if (!response.ok) {
            console.warn(`itch feed ${feedName} skipped: HTTP ${response.status}`);
            return;
        }
        for (const item of parseFeed(response.text, feedName)) {
            const normalized = normalizeUrl(item.sourceUrl);
            if (!existingUrls.has(normalized) && !discovered.has(normalized)) discovered.set(normalized, item);
        }
        console.log(`${feedName}: ${discovered.size} fresh feed entries`);
    });

    const items = [...discovered.values()];
    const cached = new Map();
    if (fs.existsSync(OUTPUT)) {
        for (const candidate of JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))) cached.set(normalizeUrl(candidate.sourceUrl), candidate);
    }
    let completed = 0;
    const checked = await mapLimit(items, 10, async (item) => {
        const previous = cached.get(normalizeUrl(item.sourceUrl));
        if (previous?.verification) return previous;
        const verification = await evaluatePlayPage(item.sourceUrl, item.name);
        const url = new URL(item.sourceUrl);
        const sourceKey = `itch:${url.hostname.toLowerCase()}/${url.pathname.replace(/^\/+|\/+$/g, '')}`;
        return {
            sourceKey,
            sourceType: 'itch',
            upstreamId: `${url.hostname}${url.pathname}`,
            name: item.name,
            description: item.description,
            sourceUrl: item.sourceUrl,
            repositoryUrl: null,
            sourceName: url.hostname.split('.')[0],
            licence: 'NOASSERTION',
            licenceStatus: licenceStatus('NOASSERTION'),
            categoryGuess: classify(`${item.name} ${item.description} ${item.feedName}`),
            topics: ['html5', item.feedName],
            publishedAt: item.publishedAt || null,
            discoveredVia: `itch-rss:${item.feedName}`,
            discoveredAt: new Date().toISOString(),
            verification,
            // RSS proves discovery and HTML5 classification, but licence and
            // author attribution still require review before publication.
            status: verification.status === 'rejected' ? 'rejected' : 'review',
        };
    }, () => {
        completed++;
        if (completed % 25 === 0 || completed === items.length) process.stdout.write(`  ${completed}/${items.length}\r`);
    });

    writeJson(OUTPUT, checked);
    const counts = {};
    checked.forEach((candidate) => { counts[candidate.status] = (counts[candidate.status] || 0) + 1; });
    console.log(`\nWrote ${OUTPUT}`);
    console.log(`Status: ${JSON.stringify(counts)}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
