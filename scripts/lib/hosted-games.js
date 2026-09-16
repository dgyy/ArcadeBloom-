'use strict';

// Owner-authorized hosting exception, ADR-0013. Match identity AND exact URL.
function hostedPath(game) {
    return game?.sourceKey === 'arcadebloom:circle-club' &&
        game.slug === 'circle-club' &&
        game.sourceUrl === 'https://arcadebloom.com/play/circle-club/'
        ? '/play/circle-club/' : null;
}

module.exports = { hostedPath };
