'use strict';

// Owner-authorized hosting exceptions, ADR-0013/0014. Match identity AND exact URL.
function hostedPath(game) {
    const slugs = ['circle-club', 'pulse-lock', 'echo-vault'];
    return game && slugs.includes(game.slug) &&
        game.sourceKey === `arcadebloom:${game.slug}` &&
        game.sourceUrl === `https://arcadebloom.com/play/${game.slug}/`
        ? `/play/${game.slug}/` : null;
}

module.exports = { hostedPath };
