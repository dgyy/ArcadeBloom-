'use strict';

const reviewedAt = '2026-07-21';
const reviewer = 'ArcadeBloom editorial';
const evidence = (repo, branch = 'main') => ({
    repositoryUrl: `https://github.com/${repo}`,
    readmeUrl: `https://github.com/${repo}/blob/${branch}/README.md`,
    licenceUrl: `https://github.com/${repo}/blob/${branch}/LICENSE`,
});
const hold = (sourceKey, repo, reason, branch) => ({ sourceKey, decision: 'hold', reviewedAt, reviewer, reason, evidence: evidence(repo, branch) });

module.exports = [
    hold('github:alliterhorst/neon-vanguard', 'alliterhorst/neon-vanguard', 'The author explicitly describes the project as created by an orchestrated AI-agent team, so it requires a separate originality review.'),
    hold('github:codemasher7/code-arcade', 'codemasher7/code-arcade', 'Screenshots exist, but the reviewed README provides no concrete player-control evidence and derivative-language signals require review.'),
    hold('github:damijjj/status-1', 'DamiJJJ/Status-1', 'The candidate play URL and the deployment URL documented by the author use different repository names; the live source identity must be reconciled before publication.'),
    hold('github:anshulraj24/bumper-ball', 'anshulraj24/bumper-ball', 'Controls are described, but no durable author-supplied gameplay screenshot was found.'),
    {
        sourceKey: 'github:davidwang1231/signal-defender', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('DavidWang1231/signal-defender'),
        catalogue: {
            slug: 'signal-defender', name: 'Signal Defender', category: 'action',
            tagline: 'Defend a circuit board through bullet patterns, dashes, bosses, random events, and daily challenges.',
            about: `Signal Defender is David Wang's PCB-styled bullet-hell shooter, casting the player as U1, the last arbitration core awake while an unknown signal erases a motherboard's logic gates. The dependency-free canvas game offers Endless survival, a four-chapter Story, a globally seeded Daily Challenge, Boss Rush, local two-player Versus, and achievement objectives. A boss arrives every five waves, rotating among a laser-sweeping core, a spiral-firing thermal threat, and a teleporting clock glitch.

Twenty-three unlockable ships provide weapons such as homing missiles, piercing lances, heavy cannon shots, wave projectiles, and twin fire. Score converts to coins for ships and permanent upgrades, while an optional drone adds orbiting automatic support. Overvolt, Data Rain, Bus Silence, and Magnet Storm events alter conditions during a run. Grazing bullets awards extra points, making proximity a deliberate scoring risk, and a dash supplies brief invulnerability for escaping dense patterns. Progress, coins, achievements, daily rewards, and story state remain in local storage. Visuals and bilingual English-Chinese text are generated within one HTML file, as are the adaptive synthesized soundtrack and effects. The project is MIT licensed.`,
            howToPlay: `On desktop, move with WASD, the arrow keys, or by dragging with the mouse. Firing is automatic, so concentrate on positioning between bullets and lining up the ship's weapon. Press Shift to dash through danger with brief invulnerability and B to activate the EMP bomb. Space or P pauses the run. Skim close to hostile shots when the route is safe to earn graze points, but save a dash for patterns that close completely.

On touch devices, drag with one finger, touch with a second finger or use the lower-left button to dash, and use the lower-right button for EMP. In local Versus, player one moves with WASD and uses Q and E; player two uses the arrow keys, Shift, and Enter. Defeat waves, adapt to timed random events, and prepare for a boss every fifth wave. Spend earned coins in the hangar and select ships whose weapon patterns suit the chosen mode.`,
            keyFeatures: ['Six modes including Story, Daily, Boss Rush, and local Versus', 'Twenty-three ships with distinct weapons and unlock conditions', 'Dash invulnerability, EMP bombs, grazing, and random run events', 'Three scaling bosses with different bullet patterns', 'English and Chinese desktop and touch controls'],
            screenshots: ['/screenshots/signal-defender.gif'], sourceName: 'David Wang', sourceUrl: 'https://davidwang1231.github.io/signal-defender/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['bullet-hell', 'shooter', 'multiplayer', 'skill-based', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-07-06', featured: false,
        },
    },
    hold('github:iamgrid/sublight-patrol', 'iamgrid/sublight-patrol', 'The extracted image paths are interface assets rather than reviewed gameplay captures, and the README does not document controls.', 'master'),
    hold('github:vtvito/pixel-princess-platformer', 'VTvito/pixel-princess-platformer', 'The author states that the project was built with an AI coding system, so it requires a separate originality review.'),
    hold('github:mixiotez/shifter', 'mixiotez/SHIFTer', 'Controls are documented, but the extracted images are individual game assets rather than durable gameplay captures.', 'master'),
    hold('github:arpitbansal2003/asteroid-dodge', 'arpitbansal2003/asteroid-dodge', 'Controls are available, but no durable author-supplied gameplay screenshot was found and derivative-language signals require review.'),
    {
        sourceKey: 'github:thegamerbay/neon-dopamine', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('thegamerbay/neon-dopamine'),
        catalogue: {
            slug: 'neon-dopamine', name: 'Neon Dopamine', category: 'action',
            tagline: 'Guide an auto-firing neon fighter through enemy waves and assemble a new upgrade build each run.',
            about: `Neon Dopamine is thegamerbay's compact survival shooter, built in plain JavaScript around movement, automatic fire, and roguelite level choices. The player follows the mouse pointer while shots travel toward the same position, so aiming and evasion become one continuous action. Hostile waves crowd the arena and defeated enemies release experience. Filling the experience threshold pauses the pressure for an upgrade selection, allowing each run to develop through a different combination of abilities.

The presentation emphasizes immediate feedback: custom collision and movement code supports screen shake, particles, bright projectile trails, and responsive hit effects without an external game engine. The layout scales to different browser sizes, while the control scheme keeps moment-to-moment input limited to pointer movement and an occasional active ability. Giant Nova becomes a manually triggered screen effect after it is unlocked; other improvements work through the ongoing automatic attack and character statistics. Because upgrade choices arrive during the run rather than through a fixed campaign loadout, survival depends both on steering through safe gaps and on choosing effects that complement one another. The author publishes the zero-dependency HTML, CSS, and JavaScript source under the MIT licence.`,
            howToPlay: `Move the mouse and the player follows the pointer. The weapon fires automatically toward the cursor, so sweep it ahead of approaching targets while keeping enough distance to dodge incoming enemies and projectiles. Collect the experience left by defeated opponents. When a level-up choice appears, click one upgrade to resume the action with its new ability or statistical effect.

Survive successive waves by circling open areas instead of allowing enemies to surround the character. A damage option helps clear crowds, while movement, area, or defensive improvements may be more valuable when the screen becomes dense; build around the effects already chosen. If Giant Nova appears among the unlocked abilities, press Space to trigger it at a useful moment rather than wasting it on a nearly empty arena. The game scales with the browser window, but precise pointer movement remains the central skill throughout the run.`,
            keyFeatures: ['Pointer movement combined with automatic cursor-directed fire', 'Experience-driven roguelite upgrade choices', 'Unlockable Giant Nova active ability', 'Custom particles, collision, screen shake, and hit feedback', 'Responsive zero-dependency browser implementation'],
            screenshots: ['/screenshots/neon-dopamine.png'], sourceName: 'thegamerbay', sourceUrl: 'https://thegamerbay.github.io/neon-dopamine/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['shooter', 'roguelike', 'survival', 'skill-based', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-02-20', featured: false,
        },
    },
    hold('github:sujalvk888/streetfighter2d-game', 'sujalvk888/StreetFighter2D-Game', 'The title directly uses a protected third-party fighting-game brand and the documented production includes AI-assisted character motion, requiring separate rights review.'),
    hold('github:alex2434/type', 'alex2434/type', 'The reviewed repository provides neither concrete player controls nor a durable gameplay screenshot.'),
    {
        sourceKey: 'github:xnt/bye-bye-alien', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('xnt/bye-bye-alien'),
        catalogue: {
            slug: 'bye-bye-alien', name: 'Bye Bye Alien', category: 'action',
            tagline: 'Choose a spacecraft, weave through a two-dimensional battlefield, and fire into incoming alien threats.',
            about: `Bye Bye Alien is xnt's two-dimensional browser space shooter, developed with Phaser 3 and TypeScript. A ship-selection screen lets the player move through the available craft before launching, establishing a quick loop between choosing a vessel and entering combat. Once underway, the ship can travel freely in four directions rather than following a fixed lane, and its weapon supports both an explicit fire key and automatic shooting.

The project keeps its controls deliberately traditional, accepting either WASD or the corresponding arrow keys. This makes the central challenge one of positioning: the player must keep a clear route around incoming danger while remaining aligned with targets long enough for shots to connect. After a defeat, separate commands either restart immediately with the same ship or return to selection, reducing the friction between attempts and making it easy to compare different choices. The author includes automated tests alongside the Vite development setup, and supplies a hosted GitHub Pages build that requires no local installation. The repository's game logic and assets are published under the MIT licence, with an author-provided screenshot documenting the playable presentation.`,
            howToPlay: `At the selection screen, use Left or A to view the previous ship and Right or D to view the next one. Press Enter or Space to launch the highlighted craft. You can also click a ship to select it and begin. Once the battle starts, move upward with W or Up, left with A or Left, downward with S or Down, and right with D or Right.

The ship fires automatically, and Space also fires, so keep targets in the weapon line while using the full arena to avoid danger. Make small corrections instead of remaining trapped at an edge, and move across the path of an enemy only after creating enough distance. When the game-over screen appears, press R to restart immediately with the same ship. Press Q instead when you want to return to the selection screen and try a different spacecraft on the next attempt.`,
            keyFeatures: ['Keyboard and click-based spacecraft selection', 'Free four-direction movement with WASD or arrow keys', 'Automatic fire plus a manual Space input', 'Immediate same-ship restart or return to selection', 'Phaser and TypeScript source with automated tests'],
            screenshots: ['/screenshots/bye-bye-alien.png'], sourceName: 'xnt', sourceUrl: 'https://xnt.github.io/bye-bye-alien/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['shooter', 'skill-based', 'retro', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-02-22', featured: false,
        },
    },
    hold('github:acs0010/game-time', 'acs0010/game-time', 'Repository images exist, but the reviewed documentation does not provide concrete controls or enough gameplay evidence.'),
    hold('github:gadiim/space_blast', 'gadiim/Space_Blast', 'Controls and screenshots are available, but derivative-language signals require further originality review.'),
    hold('github:philvargas/js_game_of_afterlife', 'PhilVargas/js_game_of_afterlife', 'The README explains actors and scoring but does not document concrete movement controls.', 'master'),
    hold('github:damonticci/wakppuball-simulator', 'DamonTicci/wakppuball-simulator', 'A screenshot exists, but the reviewed documentation provides no concrete player-control evidence.'),
    hold('github:kikyujin/solar_colony', 'kikyujin/solar_colony', 'A screenshot and two inputs are documented, but the prototype description does not yet provide enough objective or progression evidence for an original catalogue review.'),
    hold('github:simonh1000/petriarch', 'simonh1000/petriarch', 'The reviewed documentation provides no durable gameplay screenshot and insufficient control detail.'),
    hold('github:blissful501/app-survival-android', 'blissful501/app-survival-android', 'Controls are described, but no durable gameplay screenshot was found and derivative-language signals require review.'),
];
