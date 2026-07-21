#!/usr/bin/env node
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { mapLimit, writeJson } = require('./lib/candidate-utils.js');

const INPUT = path.join(__dirname, 'candidates', 'review-batch.json');
const OUTPUT = path.join(__dirname, 'candidates', 'review-evidence.json');
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', timeout: 10000 }).trim();

if (!fs.existsSync(INPUT)) {
    console.error('Review batch missing. Run npm run candidates:review-batch first.');
    process.exit(1);
}

const source = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

async function github(pathname, accept = 'application/vnd.github+json') {
    const response = await fetch(`https://api.github.com/${pathname}`, {
        headers: {
            Accept: accept,
            Authorization: `Bearer ${TOKEN}`,
            'User-Agent': 'ArcadeBloom-editorial-review/1.0',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub ${pathname}: HTTP ${response.status}`);
    return accept.includes('raw') ? response.text() : response.json();
}

function extractSections(markdown) {
    const lines = String(markdown || '').split(/\r?\n/);
    const sections = [];
    const heading = /^#{1,4}\s+(.+)/;
    const wanted = /\b(how to play|controls?|gameplay|instructions?|features?|game modes?|scoring|quick start)\b/i;

    for (let index = 0; index < lines.length; index++) {
        const match = lines[index].match(heading);
        if (!match || !wanted.test(match[1])) continue;
        const level = lines[index].match(/^#+/)[0].length;
        const body = [lines[index]];
        for (let cursor = index + 1; cursor < lines.length; cursor++) {
            const next = lines[cursor].match(heading);
            if (next && lines[cursor].match(/^#+/)[0].length <= level) break;
            body.push(lines[cursor]);
            if (body.join('\n').length >= 6000) break;
        }
        sections.push(body.join('\n').trim());
    }

    if (!sections.length) {
        const relevant = lines.filter((line) => /\b(WASD|arrow keys?|mouse|click|touch|swipe|space(?:bar)?|enter|escape|score|move|attack|jump|shoot|steer|accelerate|brake)\b/i.test(line));
        if (relevant.length) sections.push(relevant.slice(0, 60).join('\n'));
    }
    return sections.join('\n\n').slice(0, 12000);
}

function screenshotPaths(tree) {
    const image = /\.(png|jpe?g|webp|gif)$/i;
    const preferred = /(screenshot|gameplay|preview|hero|cover|social|og[-_]?image|readme)/i;
    const excluded = /(icon|favicon|sprite|tile|texture|logo|badge|avatar|node_modules|vendor)/i;
    const paths = (tree.tree || []).filter((entry) => entry.type === 'blob' && image.test(entry.path));
    return paths
        .sort((a, b) => Number(preferred.test(b.path)) - Number(preferred.test(a.path)))
        .filter((entry) => preferred.test(entry.path) || !excluded.test(entry.path))
        .slice(0, 20)
        .map((entry) => entry.path);
}

function riskFlags(candidate, readme) {
    const text = `${candidate.name} ${candidate.description || ''} ${readme}`;
    const flags = [];
    if (/\b(clone|remake|reimplementation|inspired by)\b/i.test(text)) flags.push('clone-or-derivative-language');
    if (/\b(Mario|Minecraft|Pok[eé]mon|Pac-?Man|Flappy Bird|Plants vs\.? Zombies|NBA|Kobe|Curry|Quake|Tetris)\b/i.test(text)) flags.push('third-party-mark-or-likeness');
    if (/\b(AI-generated|generated with AI|built with Claude|vibe cod)/i.test(text)) flags.push('ai-generated-project');
    if (/\b(casino|gambling|slot machine|real money)\b/i.test(text)) flags.push('gambling-content');
    return flags;
}

async function hydrate(candidate) {
    const repo = candidate.repositoryUrl.match(/github\.com\/([^/]+\/[^/#]+)/i)?.[1]?.replace(/\.git$/i, '');
    if (!repo) return { ...candidate, evidenceStatus: 'error', error: 'unrecognized-repository-url' };
    try {
        const metadata = await github(`repos/${repo}`);
        const branch = metadata.default_branch;
        const [readme, tree, licence] = await Promise.all([
            github(`repos/${repo}/readme`, 'application/vnd.github.raw+json').catch(() => ''),
            github(`repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`).catch(() => ({ tree: [] })),
            github(`repos/${repo}/license`).catch(() => null),
        ]);
        const controlsAndGameplay = extractSections(readme);
        const screenshots = screenshotPaths(tree);
        const risks = riskFlags(candidate, readme);
        const readiness = licence?.license?.spdx_id
            && licence.license.spdx_id !== 'NOASSERTION'
            && controlsAndGameplay.length >= 120
            && screenshots.length > 0
            && !risks.includes('third-party-mark-or-likeness')
            ? 'editorial-review' : 'hold-review';
        return {
            ...candidate,
            evidenceStatus: 'ok',
            readiness,
            repository: repo,
            defaultBranch: branch,
            createdAt: metadata.created_at,
            updatedAt: metadata.updated_at,
            repositoryDescription: metadata.description || '',
            homepage: metadata.homepage || candidate.sourceUrl,
            licenceSpdx: licence?.license?.spdx_id || 'NOASSERTION',
            licenceUrl: licence?.html_url || null,
            readmeUrl: `https://github.com/${repo}/blob/${branch}/README.md`,
            controlsAndGameplay,
            screenshotPaths: screenshots,
            riskFlags: risks,
        };
    } catch (error) {
        return { ...candidate, evidenceStatus: 'error', error: error.message };
    }
}

async function main() {
    const hydrated = await mapLimit(source.batch || [], 4, hydrate);
    const summary = hydrated.reduce((counts, candidate) => {
        const key = candidate.readiness || candidate.evidenceStatus;
        counts[key] = (counts[key] || 0) + 1;
        return counts;
    }, {});
    writeJson(OUTPUT, { generatedAt: new Date().toISOString(), summary, candidates: hydrated });
    console.log(`Hydrated ${hydrated.length} review candidates: ${JSON.stringify(summary)}`);
    console.log(`Wrote ${OUTPUT}`);
    for (const candidate of hydrated) {
        console.log(`${candidate.readiness || candidate.evidenceStatus}: ${candidate.name} controls=${candidate.controlsAndGameplay?.length || 0} screenshots=${candidate.screenshotPaths?.length || 0} risks=${(candidate.riskFlags || []).join(',') || 'none'}`);
    }
}

main().catch((error) => { console.error(error); process.exit(1); });
