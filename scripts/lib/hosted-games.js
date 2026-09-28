'use strict';

// Owner-authorized hosting exceptions, ADR-0013/0014. Match identity AND exact URL.
function hostedPath(game) {
    const hostedGames = {
        'circle-club': ['arcadebloom:circle-club', 'https://arcadebloom.com/play/circle-club/'],
        'pulse-lock': ['arcadebloom:pulse-lock', 'https://arcadebloom.com/play/pulse-lock/'],
        'echo-vault': ['arcadebloom:echo-vault', 'https://arcadebloom.com/play/echo-vault/'],
        // ADR-0015: exact upstream identity and creator-controlled play URL.
        anarch: ['gitlab:drummyfish/anarch', 'https://drummyfish.gitlab.io/anarch/bin/web/anarch.html'],
    };
    const identity = game && hostedGames[game.slug];
    return identity && game.sourceKey === identity[0] && game.sourceUrl === identity[1]
        ? `/play/${game.slug}/` : null;
}

module.exports = { hostedPath };
