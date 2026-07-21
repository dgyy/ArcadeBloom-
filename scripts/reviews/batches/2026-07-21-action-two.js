'use strict';

const reviewedAt = '2026-07-21';
const reviewer = 'ArcadeBloom editorial';
const evidence = (repo, branch = 'main', licence = 'LICENSE') => ({ repositoryUrl: `https://github.com/${repo}`, readmeUrl: `https://github.com/${repo}/blob/${branch}/README.md`, licenceUrl: `https://github.com/${repo}/blob/${branch}/${licence}` });
const hold = (sourceKey, repo, reason, branch, licence) => ({ sourceKey, decision: 'hold', reviewedAt, reviewer, reason, evidence: evidence(repo, branch, licence) });

module.exports = [
    hold('github:yoonzky/sudoku', 'yoonzky/sudoku', 'Basic controls are mentioned, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:bbrugman/quickmines', 'bbrugman/QuickMines', 'The reviewed repository provides neither concrete player controls nor a durable gameplay screenshot.'),
    {
        sourceKey: 'github:danmat/alienix', decision: 'approved', reviewedAt, reviewer, evidence: evidence('DanMat/Alienix'),
        catalogue: {
            slug: 'alienix', name: 'Alienix', category: 'action',
            tagline: 'Survive alien swarms, gather experience gems, stack upgrades, and pursue an endless arena score.',
            about: `Alienix is DanMat's ground-up reimagining of an earlier personal space-shooter project as a twin-stick arena survivor. A lone ship occupies a fixed neon field while aliens enter from every edge. The weapon fires automatically, either toward the mouse pointer or at the nearest target, leaving the player to concentrate on movement, positioning, and collecting the experience gems dropped by defeated enemies.

Every thirty seconds advances the wave and increases pressure. The roster includes slow grunts, weaving darts, ranged eyes, durable hexes, enemies that split on death, elites, and large bosses that fire projectile spreads. Level gains present build choices such as faster shots, additional projectiles, piercing, movement speed, maximum health, pickup range, regeneration, and a railgun-style velocity increase. Repeated selections can be stacked, so each attempt develops a different balance between clearing power and survival. The run ends in a score that can be submitted with three initials to an online leaderboard, with local storage available as a fallback. All visual art is drawn procedurally in the dependency-free canvas code, which the author releases under the MIT licence.`,
            howToPlay: `Move with WASD or the arrow keys. On a touch device, drag to guide the ship. Aim with the mouse when you want to focus fire in a particular direction; if no pointer aim is supplied, the ship automatically targets the nearest alien. Firing itself is automatic. Press P or Escape to pause.

Keep moving along open lanes and collect the experience gems that enemies leave behind. When a level-up panel appears, choose an upgrade that supports the current build: damage, rate, spread, and piercing improve crowd clearing, while speed, health, regeneration, and pickup range create more room for mistakes. Watch for ranged enemies that prefer distance and splitters that create new threats when destroyed. Each thirty-second wave is harder than the previous one, and boss spreads require saving clear space before they arrive. Survive as long as possible, then enter initials for the leaderboard score.`,
            keyFeatures: ['Endless thirty-second waves with elites and bosses', 'Six enemy behaviors including ranged and splitting aliens', 'Experience gems and stackable level-up upgrades', 'Mouse aiming or nearest-enemy automatic targeting', 'Online high scores with local-storage fallback'],
            screenshots: ['/screenshots/alienix.png'], sourceName: 'DanMat', sourceUrl: 'https://danmat.github.io/Alienix/', licence: 'MIT', licenceStatus: 'osi-approved',
            tags: ['shooter', 'survival', 'roguelike', 'skill-based', 'open-source'], addedDate: reviewedAt, releaseDate: '2015-01-17', featured: false,
        },
    },
    hold('github:speedaily/backrooms-infestation', 'SpeeDaily/backrooms-infestation', 'Controls are documented, but the project uses a widely shared third-party horror setting and entity framing that requires separate rights review.'),
    {
        sourceKey: 'github:danmat/space-jam', decision: 'approved', reviewedAt, reviewer, evidence: evidence('DanMat/Space-Jam'),
        catalogue: {
            slug: 'space-jam-shooter', name: 'Space Jam', category: 'action',
            tagline: 'Cross ten side-scrolling sectors with automatic fire, weapon pickups, bosses, and score combos.',
            about: `Space Jam is DanMat's dependency-free rebuild of an earlier personal Akihabara-engine shooter. The ship stays on the left side of a horizontally scrolling battlefield while enemy fleets arrive from the right in formations and distinct movement patterns. Ten themed sectors structure the campaign, each concluding with a boss and visible health bar rather than continuing as an undifferentiated endless wave.

Scouts, sine-weavers, diving attackers, kamikazes, gunships, and armored turrets demand different movement. Weapon pickups widen the main spread as far as five projectiles or add homing missiles, while temporary and defensive drops provide rapid fire, shields, smart bombs, and extra lives. Smart bombs clear hostile bullets and damage all active targets, giving the player a limited answer to crowded screens. Consecutive kills raise a combo multiplier, connecting aggressive target selection to the final score. After a run, three initials can be attached to the shared online leaderboard, with browser storage used when the remote board is unavailable. Ships, opponents, effects, and backgrounds are drawn procedurally by the plain Canvas JavaScript implementation. The complete source is published under the MIT licence.`,
            howToPlay: `Move the ship with WASD or the arrow keys. Mouse movement and touch dragging are also supported. The main weapon fires automatically, so use movement to align shots, avoid enemy craft, and pass between incoming projectiles. Press B or click the bomb control to activate a smart bomb. Press P or Escape to pause.

Collect W pickups to widen the weapon spread and H pickups to add homing missiles. Rapid-fire, shield, smart-bomb, and extra-life drops are marked R, S, B, and L. Keep a smart bomb available when a boss or dense formation fills the screen, because it removes hostile bullets as well as damaging enemies. Chain kills without long gaps to increase the combo multiplier. Each of the ten sectors introduces a themed enemy mix and ends with a boss; read its movement and firing pattern instead of remaining in one lane. Complete as many sectors as possible and submit the resulting score to the leaderboard.`,
            keyFeatures: ['Ten themed sectors, each ending in a boss fight', 'Six enemy movement roles plus coordinated formations', 'Spread, homing, rapid-fire, shield, bomb, and life pickups', 'Automatic fire with keyboard, mouse, and touch movement', 'Combo scoring and shared high-score board'],
            screenshots: ['/screenshots/space-jam-shooter.png'], sourceName: 'DanMat', sourceUrl: 'https://danmat.github.io/Space-Jam/', licence: 'MIT', licenceStatus: 'osi-approved',
            tags: ['shooter', 'bullet-hell', 'skill-based', 'retro', 'open-source'], addedDate: reviewedAt, releaseDate: '2015-01-17', featured: false,
        },
    },
    hold('github:123mikeyd/brother_doge_videogame', '123mikeyd/Brother_Doge_VideoGame', 'No durable gameplay screenshot was found, and the project is explicitly described as AI generated.'),
    hold('github:eldermoraes/delta-strike', 'eldermoraes/Delta-Strike', 'Controls are documented, but no durable author-supplied gameplay screenshot was found.'),
    {
        sourceKey: 'github:juanlara18/pixel-valentine', decision: 'approved', reviewedAt, reviewer, evidence: evidence('JuanLara18/pixel-valentine'),
        catalogue: {
            slug: 'love-quest', name: 'Love Quest', category: 'action',
            tagline: 'Guide a tiny Cupid through three platforming stages to reveal a customizable final letter.',
            about: `Love Quest is Juan Lara's customizable pixel-art platform game, designed as an interactive alternative to sending a conventional Valentine message. The recipient enters a name and controls a small Cupid through three themed stages, collecting the required hearts before progressing. The First Heartbeat introduces basic movement and platforms at sunset. Through the Storms adds moving surfaces and enemies, while The Grand Gesture combines earlier mechanics with disappearing platforms and a special golden heart beneath a night aurora.

Finishing the third stage triggers heart rain, an envelope reveal, a typewriter-style personalized message, and a celebratory response screen. The sender can change names, nickname prompts, final message, date details, extra text, and default English or Spanish language from a single configuration file before deploying a fork through GitHub Pages. This customization lives outside the moment-to-moment game and does not change its three-stage collection challenge. Desktop keyboards and mobile on-screen controls are both supported. All pixel art is generated programmatically at runtime rather than loaded from an asset pack. The Phaser and TypeScript project, including its deployment workflow and customization guide, is available under the MIT licence.`,
            howToPlay: `On desktop, move left and right with the arrow keys or A and D. Press Up or W to jump. On mobile, use the on-screen directional pad and jump button. Enter the requested player name, then guide Cupid across platforms and collect every required heart before reaching the end of the stage.

The first level requires five hearts and teaches ordinary movement. The second requires seven and introduces moving platforms and enemies, so wait for safe timing instead of jumping immediately. The last stage requires eight ordinary hearts plus the golden heart, while disappearing platforms combine with the earlier hazards. Preserve momentum only when the landing area is visible and use shorter adjustments near narrow surfaces. Completing all three stages begins the heart-rain and envelope sequence, then reveals the personalized letter configured by the sender. The game supports both English and Spanish interface text.`,
            keyFeatures: ['Three platforming stages with escalating hazards', 'Heart collection, enemies, moving and disappearing platforms', 'Customizable names, final message, date, and extra text', 'English and Spanish presentation', 'Keyboard and mobile on-screen controls'],
            screenshots: ['/screenshots/love-quest.gif'], sourceName: 'Juan Lara', sourceUrl: 'https://juanlara18.github.io/pixel-valentine/', licence: 'MIT', licenceStatus: 'osi-approved',
            tags: ['platformer', 'story-rich', 'skill-based', 'retro', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-02-05', featured: false,
        },
    },
    hold('github:danmat/bombjack', 'DanMat/BombJack', 'The repository uses the exact name of an established commercial arcade game, requiring separate trademark review even though the documented road-shooter mechanics differ.'),
    hold('github:yurukusa/spell-cascade', 'yurukusa/spell-cascade', 'The author explicitly describes AI pair programming in the project, so it requires a separate originality review.'),
    hold('github:bodhiprotocol/space-shooter', 'BodhiProtocol/space-shooter', 'No durable author-supplied gameplay screenshot was found, and the project is explicitly described as AI generated.'),
    hold('github:fabriziosalmi/space23', 'fabriziosalmi/space23', 'The README states that the code, music, and background imagery were generated with AI systems, requiring a separate originality and asset-rights review.'),
    hold('github:policani/kytherion-drift', 'policani/kytherion-drift', 'The author describes the project as an AI-tool-directed artifact, requiring a separate originality review.', 'main', 'LICENSE.md'),
    hold('github:rockbenben/kuafu', 'rockbenben/kuafu', 'Many image assets are present, but the reviewed documentation provides insufficient controls and objective evidence.'),
    hold('github:tariq-k-dev/space-dude-platformer', 'tariq-k-dev/Space-Dude-Platformer', 'The extracted images are icons and individual assets rather than a reviewed gameplay capture, and controls are not documented.'),
    hold('github:zundaai-lab/prism-rift-vanguard', 'ZundaAI-Lab/prism-rift-vanguard', 'The reviewed repository provides neither concrete controls nor a durable gameplay screenshot, and its organization identity suggests separate AI-origin review.'),
    { sourceKey: 'github:gitinloserweregoingshopping/planet-express', decision: 'rejected', reviewedAt, reviewer, reason: 'The project explicitly uses Futurama characters, imagery, and presentation without evidence of authorization.', evidence: evidence('gitInLoserWereGoingShopping/planet-express') },
    hold('github:elpiu/space-war', 'Elpiu/space-war', 'Screenshots exist, but the reviewed README does not provide concrete player controls and includes externally attributed character imagery.'),
    hold('github:jingzhe0915/tank-battle', 'Jingzhe0915/tank-battle', 'Detailed controls are available, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:yousero/1ball', 'yousero/1ball', 'The reviewed repository provides neither concrete player controls nor a durable gameplay screenshot.'),
];
