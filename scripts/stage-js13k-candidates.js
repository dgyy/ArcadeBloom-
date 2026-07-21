#!/usr/bin/env node
// Stage every not-yet-published js13k entry in the shared candidate schema.
// Classification is heuristic, so even trusted-source entries require review.
'use strict';

const path = require('path');
const games = require('../src/_data/games.js');
const raw = require('./js13k-raw.json');
const { classify, writeJson } = require('./lib/candidate-utils.js');

const OUTPUT = path.join(__dirname, 'candidates', 'js13k.json');
const existingKeys = new Set(games.map((game) => game.sourceKey));
const candidates = raw
    .filter((entry) => !existingKeys.has(`js13k:${entry.year}:${entry.slug}`))
    .map((entry) => {
        const categoryGuess = classify(entry.name);
        return {
            sourceKey: `js13k:${entry.year}:${entry.slug}`,
            sourceType: 'js13k',
            upstreamId: `${entry.year}:${entry.slug}`,
            name: entry.name,
            author: entry.author || null,
            description: `${entry.name} was submitted to the js13kGames ${entry.year} competition.`,
            sourceUrl: `https://js13kgames.com/${entry.year}/games/${entry.slug}`,
            repositoryUrl: `https://github.com/js13kGames/${entry.slug}`,
            sourceName: 'js13kGames',
            licence: 'source-available',
            licenceStatus: 'source-available',
            categoryGuess,
            topics: ['js13k', 'html5-game', categoryGuess],
            award: entry.award,
            releaseDate: String(entry.year),
            discoveredVia: 'js13k-dataset',
            discoveredAt: new Date().toISOString(),
            verification: {
                status: 'review',
                score: 1,
                reasons: ['category-and-controls-unverified'],
                evidence: ['official-js13k-dataset'],
            },
            status: 'review',
            priority: categoryGuess === 'arcade' ? 'low' : 'high',
        };
    });

candidates.sort((a, b) => {
    const priority = { high: 0, low: 1 };
    return priority[a.priority] - priority[b.priority] || b.award - a.award || Number(b.releaseDate) - Number(a.releaseDate);
});
writeJson(OUTPUT, candidates);

const byCategory = {};
candidates.forEach((candidate) => { byCategory[candidate.categoryGuess] = (byCategory[candidate.categoryGuess] || 0) + 1; });
console.log(JSON.stringify({ candidates: candidates.length, byCategory }, null, 2));
