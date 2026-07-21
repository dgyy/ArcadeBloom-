#!/usr/bin/env node
// Discover GitLab projects with playable demos and stage them for review.
// Never modifies the published catalogue.
'use strict';

const path = require('path');
const fs = require('fs');
const games = require('../src/_data/games.js');
const {
    classify, evaluatePlayPage, fetchText, licenceStatus, mapLimit,
    normalizeUrl, writeJson,
} = require('./lib/candidate-utils.js');

const TOPICS = [
    'game', 'html5-game', 'browser-game', 'web-game', 'javascript-game',
    'game-development', 'game-jam', 'puzzle-game', 'strategy-game',
    'platformer', 'roguelike', 'simulation',
];
const PAGES = Math.max(1, Math.min(5, Number((process.argv.find((arg) => arg.startsWith('--pages=')) || '').split('=')[1]) || 2));
const MAX = Math.max(1, Number((process.argv.find((arg) => arg.startsWith('--max=')) || '').split('=')[1]) || 200);
const OUTPUT = path.join(__dirname, 'candidates', 'gitlab.json');

async function fetchProjects(topic, page) {
    const url = new URL('https://gitlab.com/api/v4/projects');
    url.searchParams.set('topic', topic);
    url.searchParams.set('visibility', 'public');
    url.searchParams.set('archived', 'false');
    url.searchParams.set('order_by', 'star_count');
    url.searchParams.set('sort', 'desc');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('with_license', 'true');
    const response = await fetchText(url.toString(), { accept: 'application/json', maxChars: 3000000, timeoutMs: 15000 });
    if (!response.ok) throw new Error(`GitLab ${topic} page ${page}: HTTP ${response.status}`);
    return JSON.parse(response.text);
}

function extractDemoUrls(markdown) {
    const urls = [];
    const linkPattern = /\[([^\]]*(?:play|demo|live|website|try)[^\]]*)\]\((https?:\/\/[^)\s]+)\)/gi;
    let match;
    while ((match = linkPattern.exec(markdown))) urls.push(match[2]);
    const labelPattern = /(?:play|demo|live|website)\s*[:=-]\s*(https?:\/\/[^\s<>)"']+)/gi;
    while ((match = labelPattern.exec(markdown))) urls.push(match[1]);
    return [...new Set(urls.map((url) => url.replace(/[.,;]+$/, '')))]
        .filter((url) => !/gitlab\.com|shields\.io|badge|\.png$|\.svg$/i.test(url));
}

async function findPlayUrl(project) {
    const branch = project.default_branch || 'main';
    const rawReadme = `https://gitlab.com/${project.path_with_namespace}/-/raw/${encodeURIComponent(branch)}/README.md`;
    const readme = await fetchText(rawReadme, { accept: 'text/plain', maxChars: 250000 });
    const candidates = readme.ok ? extractDemoUrls(readme.text) : [];
    const rootNamespace = project.path_with_namespace.split('/')[0];
    candidates.push(`https://${rootNamespace}.gitlab.io/${project.path}/`);

    for (const sourceUrl of [...new Set(candidates)].slice(0, 4)) {
        const verification = await evaluatePlayPage(sourceUrl, project.name);
        if (verification.status !== 'rejected') return { sourceUrl, verification };
    }
    return { sourceUrl: candidates[0] || null, verification: { status: 'rejected', reasons: ['no-live-demo'], evidence: [] } };
}

async function main() {
    const existingKeys = new Set(games.map((game) => game.sourceKey));
    const existingUrls = new Set(games.map((game) => normalizeUrl(game.sourceUrl)));
    const projects = new Map();

    await mapLimit(TOPICS, 4, async (topic) => {
        for (let page = 1; page <= PAGES; page++) {
            const rows = await fetchProjects(topic, page);
            for (const project of rows) {
                const sourceKey = `gitlab:${project.path_with_namespace.toLowerCase()}`;
                if (!existingKeys.has(sourceKey) && !projects.has(sourceKey)) projects.set(sourceKey, { ...project, sourceKey, discoveryTopic: topic });
            }
            if (rows.length < 100) break;
        }
        console.log(`${topic}: ${projects.size} projects discovered`);
    });

    const ranked = [...projects.values()].sort((a, b) => b.star_count - a.star_count).slice(0, MAX);
    const cached = new Map();
    if (fs.existsSync(OUTPUT)) {
        for (const candidate of JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))) cached.set(candidate.sourceKey, candidate);
    }
    let completed = 0;
    const checked = await mapLimit(ranked, 8, async (project) => {
        const previous = cached.get(project.sourceKey);
        if (previous?.verification) return previous;
        const play = await findPlayUrl(project);
        const licence = project.license?.key || project.license?.nickname || 'NOASSERTION';
        const duplicateUrl = play.sourceUrl && existingUrls.has(normalizeUrl(play.sourceUrl));
        const status = duplicateUrl ? 'rejected' : play.verification.status;
        return {
            sourceKey: project.sourceKey,
            sourceType: 'gitlab',
            upstreamId: project.path_with_namespace,
            name: project.name,
            description: project.description || '',
            sourceUrl: play.sourceUrl,
            repositoryUrl: project.web_url,
            sourceName: project.namespace?.name || project.path_with_namespace.split('/')[0],
            licence,
            licenceStatus: licenceStatus(licence),
            categoryGuess: classify(`${project.name} ${project.description || ''} ${(project.topics || []).join(' ')}`),
            topics: project.topics || [],
            stars: project.star_count,
            pushedAt: project.last_activity_at,
            discoveredVia: `gitlab-topic:${project.discoveryTopic}`,
            discoveredAt: new Date().toISOString(),
            verification: duplicateUrl ? { ...play.verification, reasons: [...(play.verification.reasons || []), 'existing-url'] } : play.verification,
            status,
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
    output.sort((a, b) => ({ accepted: 0, review: 1, rejected: 2 }[a.status] - { accepted: 0, review: 1, rejected: 2 }[b.status] || b.stars - a.stars));
    writeJson(OUTPUT, output);
    const counts = {};
    output.forEach((candidate) => { counts[candidate.status] = (counts[candidate.status] || 0) + 1; });
    console.log(`\nWrote ${OUTPUT}`);
    console.log(`Status: ${JSON.stringify(counts)}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
