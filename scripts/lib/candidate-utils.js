'use strict';

const fs = require('fs');
const path = require('path');

const BLOCKED_PLAY_HOSTS = new Set([
    'github.com', 'gitlab.com', 'youtube.com', 'youtu.be', 'npmjs.com',
    'pypi.org', 'play.google.com', 'apps.apple.com', 'store.steampowered.com',
    'kongregate.com', 'newgrounds.com', 'gamejolt.com', 'yandex.com', 'yandex.ru',
    'crates.io', 'facebook.com', 'hub.docker.com',
]);

const CATEGORY_RULES = [
    ['puzzle', /\b(puzzle|sudoku|sokoban|nonogram|picross|2048|minesweeper|match.?3|memory|crossword|jigsaw|tetris|logic|word game)\b/i],
    ['strategy', /\b(strategy|tower.?defen[cs]e|chess|checkers|reversi|othello|rts|tactic|turn.?based|4x|empire|kingdom)\b/i],
    ['racing-sports', /\b(race|racing|kart|golf|football|soccer|tennis|bowling|basketball|baseball|rally|sport)\b/i],
    ['simulation', /\b(simulation|simulator|idle|clicker|incremental|tycoon|farm|sandbox|colony|management|virtual pet)\b/i],
    ['action', /\b(shooter|shoot|fps|brawler|combat|platformer|metroidvania|survival|zombie|fighter|bullet.?hell)\b/i],
];

function normalizeUrl(value) {
    try {
        const url = new URL(String(value).trim());
        url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
        url.hash = '';
        for (const key of [...url.searchParams.keys()]) {
            if (/^(utm_.+|ref|source|campaign)$/i.test(key)) url.searchParams.delete(key);
        }
        url.searchParams.sort();
        url.pathname = url.pathname.replace(/\/+$/, '') || '/';
        return `${url.hostname}${url.pathname}${url.search}`.toLowerCase();
    } catch {
        return String(value || '').trim().toLowerCase();
    }
}

function normalizePlayUrl(value) {
    let url = String(value || '').trim();
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
    try { return new URL(url).toString(); } catch { return null; }
}

function isBlockedPlayUrl(value) {
    try {
        const host = new URL(value).hostname.toLowerCase().replace(/^www\./, '');
        return BLOCKED_PLAY_HOSTS.has(host);
    } catch {
        return true;
    }
}

function classify(text) {
    for (const [category, pattern] of CATEGORY_RULES) if (pattern.test(String(text || ''))) return category;
    return 'arcade';
}

function licenceStatus(licence) {
    if (!licence || /^noassertion$/i.test(licence)) return 'noassertion';
    if (/^source-available$/i.test(licence)) return 'source-available';
    if (/^(proprietary|commercial)$/i.test(licence)) return 'proprietary';
    return 'osi-approved';
}

async function fetchText(url, options = {}) {
    const timeoutMs = options.timeoutMs || 8000;
    const maxChars = options.maxChars || 350000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': 'ArcadeBloom-catalogue-research/1.0',
                Accept: options.accept || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
        });
        const type = String(response.headers.get('content-type') || '').toLowerCase();
        const text = (await response.text()).slice(0, maxChars);
        return {
            ok: response.ok,
            status: response.status,
            url: response.url,
            type,
            text,
            retryAfter: Number(response.headers.get('retry-after')) || null,
        };
    } catch (error) {
        return { ok: false, status: 0, url, type: '', text: '', error: error.name || 'fetch-error' };
    } finally {
        clearTimeout(timer);
    }
}

function compactText(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

async function evaluatePlayPage(playUrl, gameName) {
    const normalized = normalizePlayUrl(playUrl);
    const reasons = [];
    const evidence = [];
    if (!normalized) return { status: 'rejected', reasons: ['invalid-url'], evidence };
    if (isBlockedPlayUrl(normalized)) return { status: 'rejected', reasons: ['blocked-host'], evidence };

    const result = await fetchText(normalized);
    if (!result.ok) return { status: 'rejected', reasons: [`http-${result.status || 'error'}`], evidence, checkedUrl: result.url };
    if (result.type && !/html|xhtml/.test(result.type)) reasons.push(`non-html:${result.type.split(';')[0]}`);

    const html = result.text;
    let score = 0;
    if (/<canvas\b|webgl|requestanimationframe/i.test(html)) { score += 2; evidence.push('canvas-or-webgl'); }
    if (/phaser|pixi(?:\.js)?|three(?:\.js)?|kaboom|babylon|playcanvas|godot/i.test(html)) { score += 2; evidence.push('game-runtime'); }
    if (/<iframe[^>]+(?:itch\.io|js13kgames|game)/i.test(html)) { score += 1; evidence.push('game-embed'); }
    const nameTokens = compactText(gameName).split(' ').filter((token) => token.length >= 4);
    if (nameTokens.some((token) => compactText(html.slice(0, 50000)).includes(token))) { score += 1; evidence.push('name-match'); }
    if (/\b(play|game|score|level|start game|new game)\b/i.test(html)) { score += 1; evidence.push('game-ui-text'); }

    if (reasons.length) return { status: 'review', score, reasons, evidence, checkedUrl: result.url };
    const hasRuntimeEvidence = evidence.includes('canvas-or-webgl') || evidence.includes('game-runtime');
    return { status: score >= 2 && hasRuntimeEvidence ? 'accepted' : 'review', score, reasons, evidence, checkedUrl: result.url };
}

function candidateReadiness(candidate) {
    if (candidate.status === 'rejected' || candidate.verification?.status === 'rejected') return 'rejected';
    const text = `${candidate.name || ''} ${candidate.description || ''}`;
    if (/\b(framework|engine|library|sdk|plugin|template|boilerplate|starter|tutorial|examples?|course|awesome|resources?|editor|launcher|emulator|renderer|bindings?|wrapper|filters?|particle emitter)\b/i.test(text)) {
        return 'rejected';
    }
    if (isBlockedPlayUrl(candidate.sourceUrl)) return 'rejected';
    if (/\/(docs?|documentation|steam|download)(?:\/|$)/i.test(String(candidate.sourceUrl || ''))) return 'review';
    if (candidate.sourceType === 'itch') return 'review';

    const evidence = new Set(candidate.verification?.evidence || []);
    const hasRuntimeEvidence = evidence.has('canvas-or-webgl') || evidence.has('game-runtime');
    const topicText = `${(candidate.topics || []).join(' ')} ${candidate.discoveredVia || ''}`;
    const hasWebGameTopic = /html5-game|html5-games|browser-game|web-game|javascript-game|canvas-game|webgl-game|phaser-game|threejs-game|kaboomjs/i.test(topicText);
    return hasRuntimeEvidence && hasWebGameTopic ? 'accepted' : 'review';
}

async function mapLimit(items, concurrency, mapper, onProgress) {
    const output = new Array(items.length);
    let cursor = 0;
    async function worker() {
        while (true) {
            const index = cursor++;
            if (index >= items.length) return;
            output[index] = await mapper(items[index], index);
            if (onProgress) onProgress(index + 1, items.length);
        }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
    return output;
}

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

module.exports = {
    candidateReadiness,
    classify,
    evaluatePlayPage,
    fetchText,
    licenceStatus,
    mapLimit,
    normalizePlayUrl,
    normalizeUrl,
    writeJson,
};
