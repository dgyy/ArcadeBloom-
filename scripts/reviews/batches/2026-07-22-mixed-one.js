'use strict';

const reviewedAt = '2026-07-22';
const reviewer = 'ArcadeBloom editorial';
const evidence = (repo, branch = 'main') => ({ repositoryUrl: `https://github.com/${repo}`, readmeUrl: `https://github.com/${repo}/blob/${branch}/README.md`, licenceUrl: `https://github.com/${repo}/blob/${branch}/LICENSE` });
const hold = (sourceKey, repo, reason, branch) => ({ sourceKey, decision: 'hold', reviewedAt, reviewer, reason, evidence: evidence(repo, branch) });

module.exports = [
    hold('github:yoannchb-pro/tetris-ts', 'yoannchb-pro/tetris-ts', 'The project uses protected Tetris branding and requires separate rights review.'),
    hold('github:johanforngren/meh-mory', 'JohanForngren/Meh-mory', 'Images exist, but the reviewed documentation provides insufficient objective and control evidence.'),
    hold('github:ctkrug/terseql', 'ctkrug/terseql', 'Some interaction text is available, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:ctkrug/signalworks', 'ctkrug/signalworks', 'Controls are described, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:halait/buildhead', 'halait/buildhead', 'The extracted images are individual assets rather than a reviewed gameplay capture, and controls are not documented.'),
    hold('github:devrumitech/block-puzzle-game', 'DevRumiTech/block-puzzle-game', 'Basic interaction is mentioned, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:samirsaad786/lumenofficerpg', 'SamirSaad786/LumenOfficeRPG', 'Controls are documented, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    hold('github:karimmalidev/2048', 'karimmalidev/2048', 'The project uses an established third-party game identity and provides insufficient independent evidence.'),
    hold('github:xynta/khrushchev-corn-platformer', 'xynta/khrushchev-corn-platformer', 'Controls are mentioned, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:netanel-m/super-binary-man', 'Netanel-M/super-binary-man', 'A gameplay image exists, but the reviewed documentation does not provide concrete player controls and derivative-language signals need review.'),
    hold('github:wdfeer/bullethell-ts', 'wdfeer/bullethell-ts', 'Basic input text is available, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:svijaykoushik/outbreak', 'svijaykoushik/outbreak', 'The extracted images are individual sprites and control buttons rather than a reviewed gameplay capture.'),
    hold('github:eeman1113/tetrisai', 'Eeman1113/tetrisAI', 'The project uses protected Tetris branding and provides neither controls nor a durable gameplay screenshot.'),
    hold('github:kako-jun/amanuma', 'kako-jun/amanuma', 'The reviewed repository provides insufficient controls and no durable gameplay screenshot.'),
    hold('github:splargdotcom/splargdrop', 'splargdotcom/splargdrop', 'Detailed gameplay text is available, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:kondratyev-nv/minesweeper', 'kondratyev-nv/minesweeper', 'Images exist, but the reviewed documentation provides neither concrete controls nor enough independent gameplay evidence.'),
    {
        sourceKey: 'github:michaelkolesidis/rock-paper-scissors-3d', decision: 'approved', reviewedAt, reviewer, evidence: evidence('michaelkolesidis/rock-paper-scissors-3d'),
        catalogue: {
            slug: 'rock-paper-scissors-3d', name: 'Rock Paper Scissors 3D', category: 'arcade',
            tagline: 'Choose an animated rock, paper, or scissors object and challenge the computer across four match formats.',
            about: `Rock Paper Scissors 3D is Michael Kolesidis's browser presentation of the familiar simultaneous-choice hand game. Instead of flat buttons, the three possible moves appear as animated objects in a responsive three-dimensional scene that can be viewed with orbit controls. Clicking one object commits the player's choice, the computer selects its response, and the result appears immediately according to the standard cycle: rock defeats scissors, scissors defeats paper, and paper defeats rock.

Four formats change how long a session lasts. Players can require three, five, or seven wins to complete a match, or choose an endless mode without a fixed finishing threshold. The interface moves through ready, playing, and ended phases, tracks the current result, and provides menu options for selecting the preferred format. Browser storage preserves an unfinished game, accumulated total wins, and user preferences between visits; a clear-data command can remove that local record. Desktop and mobile layouts use the same object-selection interaction, while camera orbit lets the player inspect the staged models. The Three.js and TypeScript source is published under the AGPL-3.0 licence.`,
            howToPlay: `Open the menu and choose a match format: first to three wins, first to five, first to seven, or endless play. When the round is ready, click or tap the rock, paper, or scissors object. The computer makes its choice at the same time and the result is displayed immediately. Rock beats scissors, scissors beats paper, and paper beats rock; identical choices produce a tie and another round.

Continue selecting one object per round until a player reaches the chosen win target. In endless mode, use the running totals as the objective and stop whenever desired. Drag the scene to orbit the camera when you want another view of the animated objects, but remember that camera movement does not select a move. Current match state, overall victories, selected mode, and preferences are retained locally in the browser. Use the clear-data option only when you want those saved totals and settings reset.`,
            keyFeatures: ['Animated rock, paper, and scissors objects in a 3D scene', 'First-to-three, first-to-five, first-to-seven, and endless modes', 'Immediate computer response and round resolution', 'Saved match state, total wins, and preferences', 'Responsive desktop and mobile interaction with orbit camera'],
            screenshots: ['/screenshots/rock-paper-scissors-3d.png'], sourceName: 'Michael Kolesidis', sourceUrl: 'https://rockpaperscissors3d.michaelkolesidis.com/', licence: 'AGPL-3.0', licenceStatus: 'osi-approved',
            tags: ['classic', 'turn-based', 'minimal', 'relaxing', 'open-source'], addedDate: reviewedAt, releaseDate: '2021-09-06', featured: false,
        },
    },
    { sourceKey: 'github:abhiguy/mbpuweb', decision: 'rejected', reviewedAt, reviewer, reason: 'The project is explicitly a web port and mod of Marble Blast Gold / Powered Up, including original levels, sounds, music, UI, and gameplay elements.', evidence: evidence('Abhiguy/MBPUWeb') },
    hold('github:matthew-kissinger/terror-in-the-jungle', 'matthew-kissinger/terror-in-the-jungle', 'Controls are extensive, but the extracted images are asset-development artifacts rather than reviewed gameplay captures.'),
    hold('github:imshota1009/nyan-cororin', 'imshota1009/Nyan-Cororin', 'Controls are described, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
];
