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
    hold('github:remarkablegames/code-arcade', 'remarkablegames/code-arcade', 'Repository images exist, but the reviewed documentation provides no concrete player-control evidence and derivative-language signals need review.'),
    hold('github:tcast1000/bumper-ball', 'tcast1000/bumper-ball', 'Controls are described, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:ascender1729/asteroid-dodge', 'ascender1729/asteroid-dodge', 'Controls are described, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    hold('github:eeman1113/type', 'Eeman1113/type', 'The reviewed repository provides neither concrete player controls nor a durable gameplay screenshot.'),
    hold('github:esayler/game-time', 'esayler/game-time', 'Images exist, but the reviewed documentation provides no concrete player-control or objective evidence.'),
    hold('github:apple77771/wakppuball-simulator', 'apple77771/wakppuball-simulator', 'A screenshot exists, but the reviewed documentation provides no concrete player controls.'),
    hold('github:brac/petriarch', 'brac/petriarch', 'The reviewed documentation provides insufficient controls and no durable author-supplied gameplay screenshot.'),
    hold('github:pzverkov/app-survival-android', 'pzverkov/app-survival-android', 'Controls are described, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    hold('github:dannz510/sneeze-dragon', 'dannz510/Sneeze-Dragon', 'The source documents an interactive dragon animation, but does not establish a game objective, scoring system, progression loop, or fail state.'),
    hold('github:markjspivey-xwisee/planet-eden', 'markjspivey-xwisee/planet-eden', 'Detailed interaction is documented, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    { sourceKey: 'github:baikho/sowclassic-legacy-theme', decision: 'rejected', reviewedAt, reviewer, reason: 'This candidate is a Chrome extension that changes another site theme, not a playable browser game.', evidence: evidence('baikho/sowclassic-legacy-theme') },
    {
        sourceKey: 'github:amitdas4321/bubble-shooter', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('AmitDas4321/Bubble-Shooter'),
        catalogue: {
            slug: 'gesture-bubble-shooter', name: 'Gesture Bubble Shooter', category: 'puzzle',
            tagline: 'Pinch, pull, and release with your hand to launch bubbles into color-matching clusters.',
            about: `Gesture Bubble Shooter is Amit Das's camera-controlled variation on the color-cluster puzzle format. Instead of aiming with a mouse, the game uses MediaPipe Hands to identify the player's thumb and index finger. Pinching near the loaded bubble grabs it, moving the closed pinch pulls the virtual slingshot into position, and opening the fingers releases the shot. The unusual input makes aiming a physical coordination challenge while retaining the familiar goal of joining three or more bubbles of one color.

Shots follow slingshot physics and can rebound from the side walls, allowing angled routes into gaps that cannot be reached directly. Matching clusters disappear with particle feedback and increase the score, while a color-selection system supplies the next projectile. The webcam image becomes a blurred cinematic background behind a sharp canvas playfield, so the player's movement remains visible without obscuring the board. Hand landmark analysis runs locally in the browser; the author states that camera images are neither stored nor transmitted. The responsive interface supports desktop and mobile browsers with cameras, although camera permission is required. Its HTML Canvas and JavaScript source is available under the MIT licence.`,
            howToPlay: `Open the game in a browser with camera access and approve the permission prompt. Hold one hand where the camera can see it clearly. Bring the thumb and index finger together near the loaded shooter bubble to grab it. Keep the fingers pinched while moving the hand backward or sideways; the aiming line and slingshot position respond to that motion. Separate the fingers to release and launch the bubble.

Aim for a group of the same color and connect at least three matching bubbles to remove them and score. Use the side walls when a cluster is hidden behind another color: a shallow rebound can enter spaces that a straight shot cannot reach. Keep the hand within the camera frame and use deliberate pinches so the tracker does not release early. Because recognition happens on the local device, good lighting and a visible contrast between the hand and background improve control without sending camera footage to a server.`,
            keyFeatures: ['Real-time browser hand tracking through MediaPipe', 'Pinch-to-grab, hand-motion aiming, and release-to-shoot controls', 'Match-three bubble removal with score and particles', 'Wall rebounds and slingshot movement physics', 'Local camera processing with no stored or uploaded footage'],
            screenshots: ['/screenshots/gesture-bubble-shooter.png'], sourceName: 'Amit Das', sourceUrl: 'https://amitdas4321.github.io/Bubble-Shooter/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['match-3', 'physics', 'skill-based', 'experimental', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-01-30', featured: false,
        },
    },
    { sourceKey: 'github:feliperyba/angry-aliens-phaser', decision: 'rejected', reviewedAt, reviewer, reason: 'The project reproduces the distinctive character roles, launch structure, destructible materials, and terminology of a protected third-party game franchise.', evidence: evidence('feliperyba/angry-aliens-phaser') },
    hold('github:scriptex/material-tetris', 'scriptex/material-tetris', 'The project directly uses a protected third-party game identity and requires separate rights review.'),
    hold('github:lolu20255/toddler-puzzle-game', 'lolu20255/toddler-puzzle-game', 'The extracted images are asset-pack and splash artwork rather than a reviewed gameplay capture, and derivative-language signals need review.'),
    hold('github:fr0st1n/pew-pew', 'FR0ST1N/Pew-Pew', 'The extracted images are a banner and individual sprite assets rather than a reviewed gameplay capture, and derivative-language signals need review.'),
    hold('github:scriptraccoon/hex-shaper', 'ScriptRaccoon/hex-shaper', 'A screenshot exists, but the reviewed documentation provides no concrete player-control evidence.'),
    hold('github:belimfaux/3d-tetris', 'BelimFaux/3D-Tetris', 'The project directly uses a protected third-party game identity and requires separate rights review.'),
    hold('github:dentosal/nback-web', 'Dentosal/nback-web', 'The reviewed repository provides neither concrete player controls nor a durable gameplay screenshot.'),
    {
        sourceKey: 'github:rafiul254/memory_heist', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('rafiul254/Memory_Heist'),
        catalogue: {
            slug: 'memory-heist', name: 'Memory Heist', category: 'puzzle',
            tagline: 'Steal four powers from a generated neural maze, evade guard sight zones, and reach extraction.',
            about: `Memory Heist is Rafiul Islam's browser stealth game about infiltrating a procedurally generated neural archive. Each run builds a new maze of corridors, loops, firewalls, hidden passages, memory objectives, and guard patrol routes. A reachability pass verifies that all four memories and the extraction gate remain accessible; if generation cannot produce a valid archive, the game falls back to a known safe layout rather than presenting an impossible run.

Guards patrol the maze and project visible sight zones. Entering one ends the attempt immediately, so progress depends on reading routes and moving between safe positions. Every stolen memory unlocks a different tool: Ghost Trace deploys a decoy that attracts guards, Root Access phases through one firewall tile, Regret Shard rewinds the infiltrator to a recent safe state, and Echo Burst blinds nearby guards while revealing hidden paths for three seconds. The exit becomes the final objective only after all four memories have been collected. Player and guard animations are generated on an offscreen canvas, keeping the presentation self-contained without downloaded sprites. The TypeScript and Canvas source is released under the MIT licence.`,
            howToPlay: `Move through the archive with WASD or the arrow keys. Observe each guard's projected sight area and wait for patrols to turn before crossing exposed corridors; touching a sight zone ends the run. Explore branches until all four memory objects are collected. Each one grants a power that can solve a different obstruction or recover from a dangerous route.

After acquiring Ghost Trace, press Space to place a decoy and redirect guards. Press F after gaining Root Access to phase through a firewall tile. Regret Shard enables R to rewind to a recent safe position, while Echo Burst enables E to blind nearby guards and expose hidden paths for three seconds. Use Echo Burst early when a maze section appears closed, and reserve rewind for a mistake that would otherwise end the attempt. Once all memories are secured, navigate to the extraction gate. Press Enter after victory or detection to generate and begin another archive.`,
            keyFeatures: ['Procedurally generated mazes with reachability validation', 'Guard patrol AI with visible detection zones', 'Four collected memories that unlock distinct tactical powers', 'Hidden paths, firewalls, decoys, rewinding, and guard blindness', 'Runtime-generated animated sprites with no external art dependency'],
            screenshots: ['/screenshots/memory-heist.png'], sourceName: 'Rafiul Islam', sourceUrl: 'https://rafiul254.github.io/Memory_Heist/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['puzzle-room', 'procedurally-generated', 'skill-based', 'experimental', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-05-29', featured: false,
        },
    },
];
