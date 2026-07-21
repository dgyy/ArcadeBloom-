#!/usr/bin/env node
// =============================================================================
// Discover browser-playable GitHub projects and stage them for review.
// This command NEVER modifies src/_data/games.js.
//
// Usage: node scripts/fetch-github-games.js [--pages=3] [--max=600] [--min-stars=2] [--partitioned]
// Output: scripts/candidates/github.json
// =============================================================================
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');
const {
    classify, evaluatePlayPage, licenceStatus, mapLimit,
    normalizePlayUrl, normalizeUrl, writeJson,
} = require('./lib/candidate-utils.js');

const TOPICS = [
    'html5-game', 'browser-game', 'web-game', 'javascript-game',
    'phaser-game', 'canvas-game', 'html5-games', 'webgl-game',
    'threejs-game', 'pixijs', 'kaboomjs', 'game-jam',
    'puzzle-game', 'platformer-game', 'multiplayer-game', 'strategy-game',
    'racing-game', 'simulation-game', 'tower-defense', 'roguelike-game',
];
const PAGES = Math.max(1, Math.min(10, Number((process.argv.find((arg) => arg.startsWith('--pages=')) || '').split('=')[1]) || 3));
const MAX = Math.max(1, Number((process.argv.find((arg) => arg.startsWith('--max=')) || '').split('=')[1]) || 600);
const MIN_STARS_ARG = process.argv.find((arg) => arg.startsWith('--min-stars='));
const MIN_STARS = MIN_STARS_ARG ? Math.max(0, Number(MIN_STARS_ARG.split('=')[1]) || 0) : 2;
const PARTITIONED = process.argv.includes('--partitioned');
const SEARCH_WINDOWS = PARTITIONED ? [
    'pushed:>=2024-01-01',
    'pushed:2021-01-01..2023-12-31',
    'pushed:2017-01-01..2020-12-31',
    'pushed:<2017-01-01',
] : [''];
const OUTPUT = path.join(__dirname, 'candidates', 'github.json');

const QUERY = `query($searchQuery: String!, $cursor: String) {
  search(type: REPOSITORY, query: $searchQuery, first: 100, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on Repository {
        name nameWithOwner url homepageUrl description stargazerCount
        isArchived isDisabled pushedAt
        licenseInfo { spdxId }
        primaryLanguage { name }
        repositoryTopics(first: 20) { nodes { topic { name } } }
      }
    }
  }
}`;

const GITHUB_TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', timeout: 10000 }).trim();

async function graphQl(searchQuery, cursor) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'ArcadeBloom-catalogue-research/1.0',
                },
                body: JSON.stringify({ query: QUERY, variables: { searchQuery, cursor: cursor || null } }),
            });
            const raw = await response.text();
            let body;
            try { body = JSON.parse(raw); } catch { throw new Error(`HTTP ${response.status}: non-JSON response`); }
            if (!response.ok || body.errors) throw new Error(`HTTP ${response.status}: ${JSON.stringify(body.errors || body)}`);
            return body.data.search;
        } catch (error) {
            lastError = error;
            if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        } finally {
            clearTimeout(timer);
        }
    }
    throw lastError;
}

function isLikelyNonGame(repo) {
    const text = `${repo.name} ${repo.description || ''}`;
    return /\b(framework|engine|library|sdk|template|boilerplate|starter|tutorial|examples?|course|awesome|resources?|editor|launcher|emulator)\b/i.test(text);
}

async function main() {
    const existingKeys = new Set(games.map((game) => game.sourceKey));
    const existingUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
    const discovered = new Map();

    await mapLimit(TOPICS, 4, async (topic) => {
        for (const searchWindow of SEARCH_WINDOWS) {
            let cursor = null;
            for (let page = 0; page < PAGES; page++) {
                let result;
                try {
                    result = await graphQl(`topic:${topic} stars:>=${MIN_STARS} archived:false fork:false ${searchWindow}`.trim(), cursor);
                } catch (error) {
                    console.warn(`GitHub query skipped for ${topic} ${searchWindow || 'all-time'} page ${page + 1}: ${error.message}`);
                    break;
                }
                for (const repo of result.nodes.filter(Boolean)) {
                    const sourceKey = `github:${repo.nameWithOwner.toLowerCase()}`;
                    if (!repo.homepageUrl || existingKeys.has(sourceKey) || isLikelyNonGame(repo)) continue;
                    const playUrl = normalizePlayUrl(repo.homepageUrl);
                    if (!playUrl || existingUrls.has(normalizeUrl(playUrl))) continue;
                    if (!discovered.has(sourceKey)) discovered.set(sourceKey, {
                        ...repo, sourceKey, discoveryTopic: topic, discoveryWindow: searchWindow || null, playUrl,
                    });
                }
                if (!result.pageInfo.hasNextPage) break;
                cursor = result.pageInfo.endCursor;
            }
        }
        console.log(`${topic}: ${discovered.size} fresh repositories`);
    });

    const ranked = [...discovered.values()]
        .sort((a, b) => b.stargazerCount - a.stargazerCount)
        .slice(0, MAX);
    const cached = new Map();
    if (fs.existsSync(OUTPUT)) {
        for (const candidate of JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))) cached.set(candidate.sourceKey, candidate);
    }
    const reusable = ranked.filter((repo) => cached.get(repo.sourceKey)?.sourceUrl === repo.playUrl).length;
    console.log(`Checking ${ranked.length} fresh homepage candidates (${reusable} cached)...`);

    let completed = 0;
    const checked = await mapLimit(ranked, 12, async (repo) => {
        const previous = cached.get(repo.sourceKey);
        if (previous?.sourceUrl === repo.playUrl && previous.verification) return previous;
        const verification = await evaluatePlayPage(repo.playUrl, repo.name);
        const licence = repo.licenseInfo?.spdxId && repo.licenseInfo.spdxId !== 'NOASSERTION'
            ? repo.licenseInfo.spdxId : 'NOASSERTION';
        return {
            sourceKey: repo.sourceKey,
            sourceType: 'github',
            upstreamId: repo.nameWithOwner,
            name: repo.name,
            description: repo.description || '',
            sourceUrl: repo.playUrl,
            repositoryUrl: repo.url,
            sourceName: repo.nameWithOwner.split('/')[0],
            licence,
            licenceStatus: licenceStatus(licence),
            categoryGuess: classify(`${repo.name} ${repo.description || ''} ${(repo.repositoryTopics?.nodes || []).map((node) => node.topic.name).join(' ')}`),
            topics: (repo.repositoryTopics?.nodes || []).map((node) => node.topic.name),
            stars: repo.stargazerCount,
            language: repo.primaryLanguage?.name || null,
            pushedAt: repo.pushedAt,
            discoveredVia: `github-topic:${repo.discoveryTopic}`,
            discoveredAt: new Date().toISOString(),
            verification,
            status: verification.status,
        };
    }, () => {
        completed++;
        if (completed % 25 === 0 || completed === ranked.length) process.stdout.write(`  ${completed}/${ranked.length}\r`);
    });

    const merged = new Map();
    for (const candidate of cached.values()) {
        if (!existingKeys.has(candidate.sourceKey) && !existingUrls.has(normalizeUrl(candidate.sourceUrl))) {
            merged.set(candidate.sourceKey, candidate);
        }
    }
    for (const candidate of checked) merged.set(candidate.sourceKey, candidate);
    const output = [...merged.values()];
    output.sort((a, b) => {
        const order = { accepted: 0, review: 1, rejected: 2 };
        return order[a.status] - order[b.status] || b.stars - a.stars;
    });
    writeJson(OUTPUT, output);
    const counts = {};
    output.forEach((candidate) => { counts[candidate.status] = (counts[candidate.status] || 0) + 1; });
    console.log(`\nWrote ${OUTPUT}`);
    console.log(`Status: ${JSON.stringify(counts)}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
