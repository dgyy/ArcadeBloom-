'use strict';

// ADR-0011: publication quality, not a gameplay assessment, controls indexing.
const STUB = /\b(?:placeholders?|pending|coming soon|description unavailable|details unavailable)\b/i;
const AI_TYPES = ['ai-gameplay', 'ai-assisted'];

function isWebUrl(value) {
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
    } catch {
        return false;
    }
}

function validateAiMetadata(ai) {
    if (ai === undefined) return [];
    if (!ai || typeof ai !== 'object' || Array.isArray(ai)) return ['ai must be an object'];
    const errors = [];
    if (!Array.isArray(ai.types) || !ai.types.length || new Set(ai.types).size !== ai.types.length ||
        ai.types.some((type) => !AI_TYPES.includes(type))) {
        errors.push('ai.types must contain unique ai-gameplay and/or ai-assisted values');
    }
    if (typeof ai.note !== 'string' || ai.note.trim().length < 20) errors.push('ai.note must explain the author-disclosed AI use');
    if (!isWebUrl(ai.sourceUrl)) errors.push('ai.sourceUrl must link to the author disclosure');
    const checkedTime = Date.parse(ai.checkedDate);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ai.checkedDate || '') || !Number.isFinite(checkedTime) ||
        new Date(checkedTime).toISOString().slice(0, 10) !== ai.checkedDate) {
        errors.push('ai.checkedDate must be an ISO date');
    }
    return errors;
}

function hasDirectoryContent(game) {
    if (!game || game.directoryStatus === 'unlisted' || game.directoryStatus === 'draft') return false;
    if (!['sourceKey', 'slug', 'name', 'sourceName', 'licence', 'licenceStatus'].every((key) =>
        typeof game[key] === 'string' && game[key].trim())) return false;
    if (!isWebUrl(game.sourceUrl) || /(^|\.)arcadebloom\.com$/i.test(new URL(game.sourceUrl).hostname)) return false;
    if (validateAiMetadata(game.ai).length) return false;
    // Concise descriptions are welcome. Stubs remain browsable but noindex.
    const words = (value) => typeof value === 'string' ? value.trim().split(/\s+/).filter(Boolean).length : 0;
    return words(game.tagline) >= 5 && words(game.about) >= 30 && words(game.howToPlay) >= 10 &&
        !STUB.test([game.tagline, game.about, game.howToPlay].join(' '));
}

function createDirectoryPolicy(games = []) {
    const decisions = new Map();
    const urls = new Map();
    for (const game of games) {
        const key = game.sourceKey;
        const duplicate = decisions.has(key);
        decisions.set(key, !duplicate && hasDirectoryContent(game));
        if (isWebUrl(game.sourceUrl)) {
            const url = new URL(game.sourceUrl);
            url.hash = '';
            const canonical = url.href.replace(/\/$/, '');
            if (urls.has(canonical)) {
                decisions.set(key, false);
                decisions.set(urls.get(canonical), false);
            } else urls.set(canonical, key);
        }
    }
    return (sourceKey) => decisions.get(sourceKey) === true;
}

module.exports = { createDirectoryPolicy, hasDirectoryContent, validateAiMetadata, AI_TYPES, isWebUrl };
