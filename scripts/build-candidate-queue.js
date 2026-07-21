#!/usr/bin/env node
// Combine adapter outputs into one deduplicated review queue.
'use strict';

const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const { candidateReadiness, normalizeUrl, writeJson } = require('./lib/candidate-utils.js');

const DIR = path.join(__dirname, 'candidates');
const OUTPUT = path.join(DIR, 'queue.json');
const REPORT = path.join(DIR, 'report.json');
const adapterFiles = ['js13k.json', 'github.json', 'gitlab.json', 'itch.json'];
const existingKeys = new Set(games.map((game) => game.sourceKey));
const existingUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
const byKey = new Map();
const rank = { accepted: 3, review: 2, rejected: 1 };

for (const file of adapterFiles) {
    const target = path.join(DIR, file);
    if (!fs.existsSync(target)) continue;
    for (const candidate of JSON.parse(fs.readFileSync(target, 'utf8'))) {
        if (!candidate.sourceKey || existingKeys.has(candidate.sourceKey)) continue;
        const url = normalizeUrl(candidate.sourceUrl);
        if (!url || existingUrls.has(url)) continue;
        candidate.verificationStatus = candidate.status;
        candidate.status = candidateReadiness(candidate);
        const current = byKey.get(candidate.sourceKey);
        if (!current || rank[candidate.status] > rank[current.status]) byKey.set(candidate.sourceKey, candidate);
    }
}

const byUrl = new Map();
for (const candidate of byKey.values()) {
    const url = normalizeUrl(candidate.sourceUrl);
    const current = byUrl.get(url);
    if (!current || rank[candidate.status] > rank[current.status]) byUrl.set(url, candidate);
}

const queue = [...byUrl.values()].sort((a, b) => {
    const rank = { accepted: 0, review: 1, rejected: 2 };
    return rank[a.status] - rank[b.status] || (b.stars || 0) - (a.stars || 0);
});
const countBy = (field) => queue.reduce((counts, item) => {
    const key = item[field] || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
}, {});
const report = {
    generatedAt: new Date().toISOString(),
    publishedGames: games.length,
    targetGames: 5000,
    remainingToTarget: 5000 - games.length,
    candidates: queue.length,
    byStatus: countBy('status'),
    bySource: countBy('sourceType'),
    byCategory: countBy('categoryGuess'),
    withAssertedLicence: queue.filter((item) => item.licenceStatus !== 'noassertion').length,
};

writeJson(OUTPUT, queue);
writeJson(REPORT, report);
console.log(JSON.stringify(report, null, 2));
