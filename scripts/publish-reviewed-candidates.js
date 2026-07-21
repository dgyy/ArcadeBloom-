#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const decisions = require('./reviews/candidate-decisions.js');
const tags = require('../src/_data/tags.js');
const site = require('../src/_data/site.js');

const APPLY = process.argv.includes('--apply');
const GAMES_PATH = path.join(__dirname, '..', 'src', '_data', 'games.js');
const MERGED_PATH = path.join(__dirname, 'js13k-games-merged.json');
const source = fs.readFileSync(GAMES_PATH, 'utf8');
const games = require(GAMES_PATH);
const tagSlugs = new Set(tags.map((tag) => tag.slug));
const categorySlugs = new Set(site.categories.map((category) => category.slug));
const existingKeys = new Set(games.map((game) => game.sourceKey));
const existingSlugs = new Set(games.map((game) => game.slug));
const normalizeUrl = (value) => String(value).toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
const existingUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
const wordCount = (value) => String(value || '').split(/\s+/).filter(Boolean).length;
const approved = decisions.filter((decision) => decision.decision === 'approved'
    && !existingKeys.has(decision.sourceKey)
    && !existingSlugs.has(decision.catalogue?.slug)
    && !existingUrls.has(normalizeUrl(decision.catalogue?.sourceUrl)));
const errors = [];

for (const decision of approved) {
    const entry = decision.catalogue || {};
    const loc = decision.sourceKey;
    for (const field of ['slug', 'name', 'category', 'tagline', 'about', 'howToPlay', 'sourceName', 'sourceUrl', 'licence', 'licenceStatus', 'addedDate', 'releaseDate']) {
        if (!entry[field]) errors.push(`${loc}: missing ${field}`);
    }
    if (existingSlugs.has(entry.slug)) errors.push(`${loc}: slug already published: ${entry.slug}`);
    if (existingUrls.has(normalizeUrl(entry.sourceUrl))) errors.push(`${loc}: sourceUrl already published`);
    if (!categorySlugs.has(entry.category)) errors.push(`${loc}: invalid category ${entry.category}`);
    if (wordCount(entry.about) < 150) errors.push(`${loc}: about has ${wordCount(entry.about)} words; minimum is 150`);
    if (wordCount(entry.howToPlay) < 100) errors.push(`${loc}: howToPlay has ${wordCount(entry.howToPlay)} words; minimum is 100`);
    if (!Array.isArray(entry.keyFeatures) || entry.keyFeatures.length < 3 || entry.keyFeatures.length > 6) errors.push(`${loc}: keyFeatures must contain 3-6 items`);
    if (!Array.isArray(entry.tags) || entry.tags.length < 3 || entry.tags.length > 5) errors.push(`${loc}: tags must contain 3-5 items`);
    for (const tag of entry.tags || []) if (!tagSlugs.has(tag)) errors.push(`${loc}: unknown tag ${tag}`);
}

if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
}

let nextId = Math.max(...games.map((game) => game.id)) + 1;
const additions = approved.map((decision) => ({
    id: nextId++,
    ...decision.catalogue,
    sourceKey: decision.sourceKey,
}));
console.log(`Approved unpublished entries: ${additions.length}`);
additions.forEach((entry) => console.log(`  ${entry.id} ${entry.slug} (${entry.category})`));

if (!APPLY) {
    console.log('(dry-run; pass --apply to publish)');
    process.exit(0);
}

const headerAt = source.indexOf('module.exports = [');
const header = headerAt >= 0 ? source.slice(0, headerAt) : '';
const combined = [...games, ...additions];
fs.writeFileSync(GAMES_PATH, `${header}module.exports = ${JSON.stringify(combined, null, 4)};\n`);
fs.writeFileSync(MERGED_PATH, `${JSON.stringify(combined, null, 4)}\n`);
console.log(`Published ${additions.length} entries; catalogue now contains ${combined.length} games.`);
