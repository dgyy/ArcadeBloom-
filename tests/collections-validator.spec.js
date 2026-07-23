// =============================================================================
// tests/collections-validator.spec.js — verify the Collection validator (#17).
//
// Uses validateCollectionList with synthetic games + registry states so the
// eligibility gate, keyword-title rejection, near-duplicate detection, and
// card-only / size rules can be asserted without real eligible games.
// =============================================================================
'use strict';

const { test, expect } = require('@playwright/test');
const { validateCollectionList, KEYWORD_TITLE, MIN_GAMES, MAX_GAMES } =
    require('../scripts/validate-collections.js');

// Synthetic catalogue: 12 games, all eligible.
const gamesList = Array.from({ length: 12 }, (_, i) => ({
    slug: 'game-' + i, sourceKey: 'key-' + i
}));
const states = Object.fromEntries(
    gamesList.map((g) => [g.sourceKey, { state: 'eligible' }])
);
const slugs = gamesList.map((g) => g.slug);

function validCollection(overrides = {}) {
    return {
        slug: 'real-editorial-collection',
        title: 'Six Browser Games That Teach Spatial Reasoning',
        thesis: 'These six games each approach spatial reasoning from a distinct angle, and the differences matter more than the similarities when you are picking one to play tonight.',
        games: slugs.slice(0, 6),
        comparisons: ['a', 'b', 'c', 'd', 'e', 'f'],
        synthesis: 'This is a deliberately long synthesis paragraph that exceeds the fifty word minimum required by the validator. It explains how to choose among the six games by contrasting what each one rewards: some emphasize speed, others precision, others exploration. The point is to help a reader decide, not merely to list.',
        evidenceRefs: ['evidence/games/game-0/2026-07-23.json'],
        canonicalUrl: 'https://arcadebloom.com/collection/real-editorial-collection/',
        socialImage: '/img/real-editorial-collection.png',
        addedDate: '2026-07-23',
        ...overrides
    };
}

test.describe('Collection validator (issue #17)', () => {
    test('a well-formed Collection passes', () => {
        const { errors } = validateCollectionList([validCollection()], gamesList, states);
        expect(errors, errors.join('\n')).toEqual([]);
    });

    test('keyword-permutation title is rejected', () => {
        const c = validCollection({ title: 'Best Puzzle Games' });
        const { errors } = validateCollectionList([c], gamesList, states);
        expect(errors.join(' ')).toMatch(/keyword permutation/);
    });

    test('near-duplicate game lists are rejected (>70% overlap)', () => {
        const a = validCollection({ slug: 'collection-a', games: slugs.slice(0, 6), comparisons: ['a','b','c','d','e','f'] });
        // b shares 5 of 6 games with a (>70%) — near-duplicate.
        const b = validCollection({ slug: 'collection-b', games: [slugs[0], slugs[1], slugs[2], slugs[3], slugs[4], slugs[6]], comparisons: ['a','b','c','d','e','f'] });
        const { errors } = validateCollectionList([a, b], gamesList, states);
        expect(errors.join(' ')).toMatch(/near-duplicate/);
    });

    test('card-only page (no synthesis) is rejected', () => {
        const c = validCollection({ synthesis: 'too short' });
        const { errors } = validateCollectionList([c], gamesList, states);
        expect(errors.join(' ')).toMatch(/synthesis/);
    });

    test('fewer than 5 games is rejected', () => {
        const c = validCollection({ games: slugs.slice(0, 4), comparisons: ['a','b','c','d'] });
        const { errors } = validateCollectionList([c], gamesList, states);
        expect(errors.join(' ')).toMatch(new RegExp(`expected ${MIN_GAMES}-${MAX_GAMES} games`));
    });

    test('more than 12 games is rejected', () => {
        const thirteen = Array.from({ length: 13 }, (_, i) => 'game-' + i);
        const c = validCollection({ games: thirteen, comparisons: thirteen.map((_, i) => 'c' + i) });
        const { errors } = validateCollectionList([c], gamesList, states);
        expect(errors.join(' ')).toMatch(new RegExp(`expected ${MIN_GAMES}-${MAX_GAMES} games`));
    });

    test('non-eligible games are rejected', () => {
        const ineligibleStates = Object.fromEntries(
            gamesList.map((g) => [g.sourceKey, { state: 'provisional' }])
        );
        const { errors } = validateCollectionList([validCollection()], gamesList, ineligibleStates);
        expect(errors.join(' ')).toMatch(/not eligible/);
    });

    test('missing evidence refs is rejected', () => {
        const c = validCollection({ evidenceRefs: [] });
        const { errors } = validateCollectionList([c], gamesList, states);
        expect(errors.join(' ')).toMatch(/evidenceRefs/);
    });

    test('mismatched comparisons count is rejected', () => {
        const c = validCollection({ comparisons: ['only-one'] });
        const { errors } = validateCollectionList([c], gamesList, states);
        expect(errors.join(' ')).toMatch(/comparisons must have one entry per game/);
    });
});
