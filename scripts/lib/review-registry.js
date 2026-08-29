'use strict';

const fs = require('fs');

function readReviewRegistry(registryPath) {
    try {
        const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        return registry && registry.states ? registry : { states: {} };
    } catch {
        return { states: {} };
    }
}

function registerCatalogueKeys({ registry, games, registeredAt }) {
    if (!registry || registry.kind !== 'review-registry' || !registry.states) {
        throw new Error('review registry is missing or malformed');
    }
    if (!Array.isArray(games)) throw new Error('games must be an array');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(registeredAt || ''))) {
        throw new Error('registeredAt must be an ISO date');
    }

    const next = JSON.parse(JSON.stringify(registry));
    const catalogueKeys = new Set();
    let added = 0;
    let preserved = 0;

    for (const game of games) {
        if (!game.sourceKey) {
            throw new Error(`game ${game.slug || '(unknown)'} has no sourceKey`);
        }
        if (catalogueKeys.has(game.sourceKey)) {
            throw new Error(`duplicate sourceKey "${game.sourceKey}"`);
        }
        catalogueKeys.add(game.sourceKey);

        if (next.states[game.sourceKey]) {
            preserved++;
            continue;
        }

        next.states[game.sourceKey] = {
            state: 'provisional',
            provisionalSince: registeredAt,
        };
        added++;
    }

    next.orphanedSourceKeys = Object.keys(next.states)
        .filter((sourceKey) => !catalogueKeys.has(sourceKey));

    return { registry: next, added, preserved };
}

module.exports = { readReviewRegistry, registerCatalogueKeys };
