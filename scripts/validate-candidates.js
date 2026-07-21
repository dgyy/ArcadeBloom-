#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const { candidateReadiness, normalizeUrl } = require('./lib/candidate-utils.js');

const file = path.join(__dirname, 'candidates', 'queue.json');
if (!fs.existsSync(file)) {
    console.error('Candidate queue missing. Run npm run candidates:build first.');
    process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingKeys = new Set(games.map((game) => game.sourceKey));
const existingUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
const seenKeys = new Set();
const seenUrls = new Set();
const errors = [];
const categories = new Set(['puzzle', 'action', 'arcade', 'strategy', 'racing-sports', 'simulation']);
const statuses = new Set(['accepted', 'review', 'rejected']);
const sourceTypes = new Set(['js13k', 'github', 'gitlab', 'itch']);

queue.forEach((candidate, index) => {
    const loc = `candidates[${index}] (${candidate.sourceKey || 'missing-key'})`;
    for (const field of ['sourceKey', 'sourceType', 'name', 'sourceUrl', 'sourceName', 'licence', 'licenceStatus', 'categoryGuess', 'status']) {
        if (candidate[field] === undefined || candidate[field] === null || candidate[field] === '') errors.push(`${loc}: missing ${field}`);
    }
    if (!sourceTypes.has(candidate.sourceType)) errors.push(`${loc}: invalid sourceType ${candidate.sourceType}`);
    if (!statuses.has(candidate.status)) errors.push(`${loc}: invalid status ${candidate.status}`);
    if (!categories.has(candidate.categoryGuess)) errors.push(`${loc}: invalid categoryGuess ${candidate.categoryGuess}`);
    if (!/^https?:\/\//i.test(String(candidate.sourceUrl))) errors.push(`${loc}: sourceUrl must be absolute`);
    if (seenKeys.has(candidate.sourceKey)) errors.push(`${loc}: duplicate sourceKey`);
    seenKeys.add(candidate.sourceKey);
    const url = normalizeUrl(candidate.sourceUrl);
    if (seenUrls.has(url)) errors.push(`${loc}: duplicate normalized sourceUrl ${url}`);
    seenUrls.add(url);
    if (existingKeys.has(candidate.sourceKey)) errors.push(`${loc}: sourceKey already published`);
    if (existingUrls.has(url)) errors.push(`${loc}: sourceUrl already published`);
    if (candidate.status === 'accepted' && candidateReadiness(candidate) !== 'accepted') {
        errors.push(`${loc}: accepted status does not satisfy current readiness policy`);
    }
});

if (errors.length) {
    console.error(`Candidate validation failed with ${errors.length} error(s):`);
    errors.slice(0, 50).forEach((error) => console.error(`  ${error}`));
    if (errors.length > 50) console.error(`  ... ${errors.length - 50} more`);
    process.exit(1);
}

console.log(`Candidate queue valid: ${queue.length} unique candidates, no published overlap.`);
