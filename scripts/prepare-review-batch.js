#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const decisions = require('./reviews/candidate-decisions.js');
const { normalizeUrl, writeJson } = require('./lib/candidate-utils.js');

const QUEUE = path.join(__dirname, 'candidates', 'queue.json');
const OUTPUT = path.join(__dirname, 'candidates', 'review-batch.json');
const sizeArg = process.argv.find((arg) => arg.startsWith('--size='));
const categoryArg = process.argv.find((arg) => arg.startsWith('--category='));
const SIZE = Math.max(1, Math.min(100, Number(sizeArg?.split('=')[1]) || 20));
const CATEGORY = categoryArg?.split('=')[1] || null;

if (!fs.existsSync(QUEUE)) {
    console.error('Candidate queue missing. Run npm run candidates:build first.');
    process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const decided = new Set(decisions.map((decision) => decision.sourceKey));
const publishedKeys = new Set(games.map((game) => game.sourceKey));
const publishedUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
const categoryCounts = games.reduce((counts, game) => {
    counts[game.category] = (counts[game.category] || 0) + 1;
    return counts;
}, {});

const CATEGORY_PRIORITY = {
    'racing-sports': 60,
    strategy: 45,
    simulation: 40,
    action: 35,
    puzzle: 30,
    arcade: 0,
};
const RISK_PATTERN = /\b(clone|benchmark|framework|engine|library|template|tutorial|starter|demo|sdk)\b/i;
const TRADEMARK_PATTERN = /\b(mario|minecraft|pokemon|pac-?man|flappy bird|plants vs\.? zombies|quake)\b/i;

function score(candidate) {
    const text = `${candidate.name} ${candidate.description || ''} ${(candidate.topics || []).join(' ')}`;
    const evidence = candidate.verification?.evidence?.length || 0;
    const stars = Math.log2((candidate.stars || 0) + 1) * 5;
    const category = CATEGORY_PRIORITY[candidate.categoryGuess] || 0;
    const riskPenalty = RISK_PATTERN.test(text) ? 35 : 0;
    const trademarkPenalty = TRADEMARK_PATTERN.test(text) ? 50 : 0;
    return Math.round((category + evidence * 6 + stars - riskPenalty - trademarkPenalty) * 10) / 10;
}

const eligible = queue
    .filter((candidate) => candidate.status === 'accepted')
    .filter((candidate) => candidate.licenceStatus === 'osi-approved')
    .filter((candidate) => candidate.repositoryUrl)
    .filter((candidate) => !CATEGORY || candidate.categoryGuess === CATEGORY)
    .filter((candidate) => !decided.has(candidate.sourceKey))
    .filter((candidate) => !publishedKeys.has(candidate.sourceKey))
    .filter((candidate) => !publishedUrls.has(normalizeUrl(candidate.sourceUrl)))
    .map((candidate) => ({ ...candidate, editorialScore: score(candidate) }))
    .sort((a, b) => b.editorialScore - a.editorialScore || (b.stars || 0) - (a.stars || 0));

const batch = eligible.slice(0, SIZE).map((candidate, index) => ({
    reviewOrder: index + 1,
    sourceKey: candidate.sourceKey,
    name: candidate.name,
    categoryGuess: candidate.categoryGuess,
    editorialScore: candidate.editorialScore,
    stars: candidate.stars || 0,
    licence: candidate.licence,
    sourceUrl: candidate.sourceUrl,
    repositoryUrl: candidate.repositoryUrl,
    description: candidate.description,
    topics: candidate.topics || [],
    verificationEvidence: candidate.verification?.evidence || [],
}));

writeJson(OUTPUT, {
    generatedAt: new Date().toISOString(),
    requestedSize: SIZE,
    categoryFilter: CATEGORY,
    eligibleCandidates: eligible.length,
    publishedCategoryCounts: categoryCounts,
    batch,
});

console.log(`Prepared ${batch.length} of ${eligible.length} eligible candidates.`);
console.log(`Wrote ${OUTPUT}`);
for (const candidate of batch) {
    console.log(`${String(candidate.reviewOrder).padStart(2)}. ${candidate.name} [${candidate.categoryGuess}] score=${candidate.editorialScore} ${candidate.licence}`);
}
