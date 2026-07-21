'use strict';

// Tracked human-review decisions. Approved rows contain all publication fields;
// hold/rejected rows preserve the reason so the same candidate is not silently
// reconsidered without new evidence.
const decisions = [
    {
        sourceKey: 'github:openfrontio/openfrontio',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'Source and AGPL-3.0 licence verified, but the reviewed README does not document player controls precisely enough for an accurate how-to guide.',
        evidence: {
            repositoryUrl: 'https://github.com/openfrontio/OpenFrontIO',
            readmeUrl: 'https://github.com/openfrontio/OpenFrontIO/blob/main/README.md',
            licenceUrl: 'https://github.com/openfrontio/OpenFrontIO/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:apoorvdarshan/zombie-game',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/apoorvdarshan/zombie-game',
            readmeUrl: 'https://github.com/apoorvdarshan/zombie-game/blob/main/README.md',
            licenceUrl: 'https://github.com/apoorvdarshan/zombie-game/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'zombie-survival-fps',
            name: 'Zombie Survival FPS',
            category: 'action',
            tagline: 'Fight escalating zombie waves with two weapons in a browser-based 3D FPS.',
            about: `Zombie Survival FPS is a compact first-person wave survival game by Apoorv Darshan, built for modern browsers with Three.js. Its central loop is direct: enter the arena, keep moving, and survive increasingly difficult groups of zombies. The opposition is split into four types—normal zombies, runners, tanks, and brutes—so later waves demand more than simply holding the trigger. Faster enemies pressure your movement while tougher variants absorb attention and ammunition.\n\nThe weapon system creates the main resource decision. The rifle has unlimited ammunition and remains dependable throughout a run, while the machine gun is faster but begins with a limited reserve of 150 rounds. Additional machine-gun ammunition appears as collectible packs, encouraging calculated movement through dangerous parts of the arena. A radar, health display, weapon sounds, and pause control keep the action readable without adding a complicated setup. It is an open-source MIT project and runs directly from the developer's published web build.`,
            howToPlay: `Use WASD or the arrow keys to move and the mouse to look around the arena. Fire the current weapon with the left mouse button. The right mouse button switches between the unlimited-ammo rifle and the machine gun, which has a limited ammunition supply. Press Escape when you need to pause.\n\nKeep moving rather than backing into a fixed corner, because runners can close distance quickly while tanks and brutes take longer to defeat. Use the rifle during manageable parts of a wave so the machine gun remains available when several dangerous targets arrive together. Watch the radar and health display, and plan a safe route toward ammunition packs before the machine gun runs dry. The game requires a modern browser with WebGL, Web Audio, and mouse input.`,
            keyFeatures: [
                'Endless waves with rising difficulty',
                'Four zombie types: normal, runner, tank, and brute',
                'Unlimited rifle plus limited-ammo machine gun',
                'Radar, health display, ammo pickups, and pause control',
                'Open-source Three.js project under the MIT licence',
            ],
            screenshots: [],
            sourceName: 'Apoorv Darshan',
            sourceUrl: 'https://zombie-game.apoorvdarshan.com/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['shooter', 'survival', 'skill-based', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: 'unknown',
            featured: false,
        },
    },
    {
        sourceKey: 'github:imshota1009/nyan-bomber',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/imshota1009/Nyan-Bomber',
            readmeUrl: 'https://github.com/imshota1009/Nyan-Bomber/blob/main/README.md',
            licenceUrl: 'https://github.com/imshota1009/Nyan-Bomber/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'nyan-bomber',
            name: 'Nyan Bomber',
            category: 'puzzle',
            tagline: 'Plant seed bombs, trap garden pests, and restore a colorful 3D garden.',
            about: `Nyan Bomber is a 3D action-puzzle game by Yamawaki Shota and NekoDev Studio. You control a cat defending Grandpa Nyan's secret garden from a mole army, but defeating enemies is only part of the objective. Every seed bomb also grows flowers across its blast path, turning territorial recovery into a visible scoring system. A successful run therefore balances enemy control with the garden's regeneration percentage rather than treating every bomb as a simple attack.\n\nChain explosions multiply the score, while collectible green items supply vine traps that hold enemies in place for three seconds. The game includes a tutorial, multiple stages, character selection, and a final fight with Commander Drill Mole. Players can also switch between an angled isometric camera and a direct top-down view, which is useful when planning blast lines around obstacles. The browser release uses Three.js for its 3D presentation and is published from the developer's MIT-licensed GitHub project.`,
            howToPlay: `Move with WASD or the arrow keys. Press Space to place a seed bomb; it explodes after three seconds and shows its blast range beforehand. Shift performs a short dash with a three-second cooldown. When you have collected a green item, press X to place a vine trap that binds an enemy for three seconds. Press C to switch between isometric and top-down cameras, and use Escape or P to pause.\n\nBegin with the tutorial and learn how walls shape each explosion before attempting long chains. Place bombs where their flower trails reclaim several empty tiles, then move outside the previewed blast area. Vine traps can hold a mole inside an explosion or create time to escape. Saving the dash until a route is blocked is safer than spending it immediately.`,
            keyFeatures: [
                'Seed bombs both defeat enemies and grow flowers',
                'Chain explosions multiply the score',
                'Vine traps temporarily bind garden pests',
                'Tutorial, multiple stages, and a boss battle',
                'Switchable isometric and top-down cameras',
            ],
            screenshots: [],
            sourceName: 'NekoDev Studio / Yamawaki Shota',
            sourceUrl: 'https://nyan-bomber-game-app.web.app/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['physics', 'skill-based', 'experimental', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: 'unknown',
            featured: false,
        },
    },
    {
        sourceKey: 'github:bhanu2006-24/neon-velocity',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/Bhanu2006-24/neon-velocity',
            readmeUrl: 'https://github.com/Bhanu2006-24/neon-velocity/blob/main/README.md',
            licenceUrl: 'https://github.com/Bhanu2006-24/neon-velocity/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'neon-velocity',
            name: 'Neon Velocity',
            category: 'racing-sports',
            tagline: 'Dodge traffic and build near-miss multipliers on a neon 3D highway.',
            about: `Neon Velocity is a cyberpunk endless racing game by Bhanu Pratap Saini, rendered in Three.js and designed for both desktop and mobile browsers. The car moves through a neon highway filled with traffic, leaving the player to steer, protect a three-point shield, and keep a score multiplier alive for as long as possible. Passing vehicles at close range awards near-miss bonuses, so the safest line is not always the most valuable one.\n\nA rechargeable nitro meter adds a second layer to each decision. Boosting grants temporary invincibility and a magnet effect, allowing the car to smash through hazards and attract useful pickups. Green repair cubes restore one shield point, while successful near misses and boosted collisions feed a multiplier that can climb to ten times the base score. Dynamic lighting and a day-night cycle give the otherwise focused survival loop some visual variation. The project is an open-source MIT release built with vanilla JavaScript, HTML5 Canvas, CSS, and Three.js.`,
            howToPlay: `On desktop, use the left and right arrow keys to steer through traffic. Hold Space to activate nitro while the boost meter has charge. On mobile, tap the left or right side of the screen to steer. Your vehicle begins with three shield points; green cubes repair one point, and collisions consume protection unless nitro is active.\n\nUse ordinary steering to collect repair cubes and preserve nitro for dense traffic. Passing close to another vehicle earns a near-miss bonus and helps maintain the score multiplier, but clipping it can end the run, so approach from a lane with room to escape. During nitro, the car becomes temporarily invincible and gains a magnet effect. That is the best time to cross a crowded section or collect several pickups in succession.`,
            keyFeatures: [
                'Endless 3D highway with neon cyberpunk visuals',
                'Rechargeable nitro with invincibility and magnet effects',
                'Near-miss scoring and a multiplier up to 10x',
                'Three-point shield with collectible repair cubes',
                'Desktop keyboard and mobile touch controls',
            ],
            screenshots: ['/screenshots/neon-velocity-1.png', '/screenshots/neon-velocity-2.png'],
            sourceName: 'Bhanu Pratap Saini',
            sourceUrl: 'https://bhanu2006-24.github.io/neon-velocity/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['racing', 'skill-based', 'experimental', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: 'unknown',
            featured: false,
        },
    },
    {
        sourceKey: 'github:mstop4/fractured-flicks',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/mstop4/fractured-flicks',
            readmeUrl: 'https://github.com/mstop4/fractured-flicks/blob/master/README.md',
            licenceUrl: 'https://github.com/mstop4/fractured-flicks/blob/master/LICENSE',
        },
        catalogue: {
            slug: 'fractured-flicks',
            name: 'Fractured Flicks',
            category: 'puzzle',
            tagline: 'Reassemble a moving video by rotating and dragging its scattered pieces.',
            about: `Fractured Flicks is a browser jigsaw game by M.S.T.O.P. that replaces the usual still photograph with a moving video. The image continues to play across every fragment while the board is scrambled, so motion becomes both a distraction and a clue. Matching colors alone is rarely enough: players can follow an object across neighboring pieces, compare the direction of movement, and use repeating edges to reconstruct the original frame.\n\nEach piece can be rotated as well as repositioned, creating a more demanding spatial problem than a standard drag-and-drop jigsaw. The interface stays deliberately small, with tapping used for rotation and a held drag used for movement. That makes the game approachable on pointer and touch devices without filling the screen with control buttons. Pixi.js handles the visual composition, pixi-sound provides audio support, and the video content is delivered through AWS S3. The source is available from the author's GitHub repository under the BSD 2-Clause licence.`,
            howToPlay: `Tap a puzzle piece to rotate it. To move a piece, press or tap and hold, then drag it to a new position before releasing. Your objective is to rebuild the original rectangular video while the footage continues playing across the separated fragments.\n\nStart by looking for pieces with clear outer borders, corners, or distinctive moving subjects. Rotate those into a plausible orientation before arranging the interior. Motion can reveal relationships that a single frame hides: if an object exits one fragment on the right, look for another fragment where it enters from the left at the same height. Move likely neighbors together temporarily, then revise the group if their edges or motion do not align. Solving the border first reduces the number of possible positions for the remaining pieces.`,
            keyFeatures: [
                'Jigsaw puzzle built from continuously playing video',
                'Pieces can be both rotated and repositioned',
                'Simple tap and hold-drag controls',
                'Motion provides additional visual matching clues',
                'Open-source Pixi.js project under BSD-2-Clause',
            ],
            screenshots: ['/screenshots/fractured-flicks.gif'],
            sourceName: 'M.S.T.O.P.',
            sourceUrl: 'https://mstop4.github.io/fractured-flicks/',
            licence: 'BSD-2-Clause',
            licenceStatus: 'osi-approved',
            tags: ['physics', 'brain-burner', 'relaxing', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: 'unknown',
            featured: false,
        },
    },
    {
        sourceKey: 'github:giorgosn/wallbrawl',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/giorgosn/wallbrawl',
            readmeUrl: 'https://github.com/giorgosn/wallbrawl/blob/main/README.md',
            licenceUrl: 'https://github.com/giorgosn/wallbrawl/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'wallbrawl',
            name: 'WallBrawl',
            category: 'action',
            tagline: 'Build a platform arena around your room, then fight a friend on the same screen.',
            about: `WallBrawl is a two-player stick-figure fighting game by Giorgos N., designed to turn an ordinary wall into a playable arena with a projector. A built-in editor lets players draw boxes, circles, walls, and freeform polygons over real shelves, sofas, frames, or other surfaces. Those shapes become platforms, hazards, or trampolines, while four-corner calibration adjusts the projected picture to fit the physical space. A projector is optional, so the same editor and battles work on a normal browser screen.

Each fighter can punch, collect falling weapon crates, and use pistols, uzis, or shotguns. Players may also upload and crop a photo for each character's head. Matches award a point to the last fighter standing, and the first player to five points wins. Keyboard and Gamepad API controls support local play from one machine, while arenas save in localStorage and can be exported as JSON. The dependency-free HTML5 Canvas project is published under the MIT licence.` ,
            howToPlay: `Create or edit an arena before starting the fight. Use the toolbar to place solid platforms, deadly shapes, bouncy surfaces, and both player spawn points. Press C to calibrate the four projected corners, then choose Fight or press Enter. Player one moves with A and D, jumps with W or Space, attacks with F, and aims down with S. Player two uses the left and right arrows, jumps with Up, attacks with L or period, and aims down with Down. A gamepad can use the left stick, A to jump, and X or the right trigger to attack.

Punch while unarmed or collect a falling weapon crate. Falling off or taking a fatal hit gives the surviving player a point; the first to five wins. Use Esc to return to the editor and G to hide editor geometry during projection.` ,
            keyFeatures: [
                'Two-player local fighting with keyboard and gamepad controls',
                'Freeform arena editor with platforms, hazards, and trampolines',
                'Four-corner projection calibration for real rooms',
                'Photo head customization and multiple weapon types',
                'Saved arenas with JSON import and export',
            ],
            screenshots: ['/screenshots/wallbrawl.png'],
            sourceName: 'Giorgos N.',
            sourceUrl: 'https://giorgosn.github.io/wallbrawl/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['couch-co-op', 'multiplayer', 'physics', 'experimental', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2026-07-06',
            featured: false,
        },
    },
    {
        sourceKey: 'github:klevze/sokoban',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/klevze/sokoban',
            readmeUrl: 'https://github.com/klevze/sokoban/blob/main/README.md',
            licenceUrl: 'https://github.com/klevze/sokoban/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'sokoban-projekti',
            name: 'Sokoban',
            category: 'puzzle',
            tagline: 'Push every warehouse crate onto a target across 50 increasingly difficult levels.',
            about: `Sokoban is Gregor's browser implementation of the classic warehouse puzzle, presented with custom pixel art and an HTML5 Canvas interface. The objective is familiar but demanding: walk around a compact maze and push every crate onto a marked target. Crates can only be pushed, never pulled, so a single careless move can leave one trapped against a wall or in a corner. Fifty levels progress from introductory layouts to boards that require longer sequences and deliberate planning.

The game records time, total moves, and crate pushes for each level, giving players several ways to improve a completed solution. A level selector permits revisiting any stage, while automatic saving preserves progress between sessions. Undo and restart controls make experimentation less punishing when a route fails. The interface supports keyboard arrows and virtual touch buttons, adapts to desktop and mobile screens, and includes multiple interface languages, sound effects, and music controls. The developer publishes the complete JavaScript and SCSS source on GitHub under the MIT licence.` ,
            howToPlay: `Move the warehouse keeper with the arrow keys on a keyboard or the on-screen direction buttons on a touch device. Walk into a crate to push it one square, provided the square beyond it is empty. Complete the level by placing every crate on a marked goal tile. The game tracks your elapsed time, moves, and pushes, and saves completed stages automatically.

Before moving a crate, inspect the squares behind and beside it. A crate pushed into a non-goal corner usually cannot be recovered because the player cannot pull it back. Work backward from the targets and preserve walking routes that let you reach the correct side of each box. Use Undo after a mistaken push instead of repeating an entire solution, or Restart when the board is no longer recoverable. The level selector lets you practice any unlocked layout independently.` ,
            keyFeatures: [
                'Fifty warehouse puzzles from beginner to expert',
                'Move, push, time, and completion tracking',
                'Keyboard and mobile touch controls',
                'Undo, restart, level selection, and automatic saving',
                'Custom pixel art with multilingual interface support',
            ],
            screenshots: ['/screenshots/sokoban-projekti.webp'],
            sourceName: 'Gregor',
            sourceUrl: 'https://sokoban.projekti.info/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['turn-based', 'brain-burner', 'classic', 'skill-based', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2025-04-19',
            featured: false,
        },
    },
    {
        sourceKey: 'github:douvy/hooping',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/douvy/hooping',
            readmeUrl: 'https://github.com/douvy/hooping/blob/main/README.md',
            licenceUrl: 'https://github.com/douvy/hooping/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'hooping',
            name: 'Hooping',
            category: 'racing-sports',
            tagline: 'Solve six deterministic basketball shots with one attempt allowed per level.',
            about: `Hooping is a compact basketball challenge by douvy built around repeatable physics rather than random bounces. A run contains six levels, and each level gives the player one ball. Making the basket advances to the next setup, while a miss sends the run back to the beginning. That harsh reset makes every successful shot part of a sequence that must eventually be reproduced under pressure.

Shots are created by dragging away from the ball and releasing, with a longer pull producing more power. Because the simulation is deterministic, the same drag direction and distance always create the same trajectory and bounce. The player can therefore study each failure, adjust the next attempt, and develop a reliable answer instead of waiting for luck. A repeat control can replay the exact previous shot, which is useful when a known solution appears again during practice. The game's source, physics tests, and level-solvability checks are available in the author's MIT-licensed GitHub repository.` ,
            howToPlay: `Press or touch anywhere in the play area, drag backward to set the shot, and release to launch the ball. Pulling farther increases power, while the angle of the drag controls the launch direction. You receive one shot on each of the six levels. Score to advance; miss and the run restarts from level one. Press Space when you want to repeat the exact parameters of your previous shot.

Treat every attempt as information. Watch whether the ball falls short, travels too far, or reaches the rim at the wrong angle, then change only a small part of the next drag. Since the physics contain no random variation, a successful motion remains a valid solution. Learn the early levels consistently before concentrating on later shots, because completing the game requires executing all six solutions in one uninterrupted run.` ,
            keyFeatures: [
                'Six one-shot basketball levels in a single run',
                'Deterministic physics with repeatable trajectories',
                'Drag distance and angle control every shot',
                'Space key repeats the exact previous attempt',
                'Open-source level and physics verification tests',
            ],
            screenshots: ['/screenshots/hooping.png'],
            sourceName: 'douvy',
            sourceUrl: 'https://hooping.io/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['sports', 'physics', 'skill-based', 'quick-fix', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2026-07-08',
            featured: false,
        },
    },
    {
        sourceKey: 'github:remarkablegames/rhythmism',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'Repository, MIT licence, play links, and screenshots are available, but the reviewed README does not document controls or the scoring loop precisely enough for an accurate how-to guide.',
        evidence: {
            repositoryUrl: 'https://github.com/remarkablegames/rhythmism',
            readmeUrl: 'https://github.com/remarkablegames/rhythmism/blob/master/README.md',
            licenceUrl: 'https://github.com/remarkablegames/rhythmism/blob/master/LICENSE',
        },
    },
    {
        sourceKey: 'github:boona13/mykonos-island-voxels',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/boona13/mykonos-island-voxels',
            readmeUrl: 'https://github.com/boona13/mykonos-island-voxels/blob/main/README.md',
            licenceUrl: 'https://github.com/boona13/mykonos-island-voxels/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'mykonos-island-voxels',
            name: 'Mykonos Island Voxels',
            category: 'simulation',
            tagline: 'Arrange a sunlit Mediterranean village one isometric tile at a time.',
            about: `Mykonos Island Voxels is a peaceful isometric building toy by boona13, inspired by the whitewashed walls, blue domes, windmills, olive trees, and cobbled lanes of the Greek island. Instead of managing money or satisfying objectives, players arrange a personal scene on a 14-by-14 grid. More than 75 painterly assets cover terrain, water, buildings, vegetation, and small decorative props, allowing a blank island to grow into a dense village or remain a sparse coastal retreat.

Placement is intentionally immediate: select an item from the palette and add it to the grid, paint several cells by dragging, or fill the island with grass as a starting surface. Buildings and scenery appear with elastic animation, while layered high-resolution rendering keeps the isometric artwork crisp while zooming. The project supports mouse, keyboard, and touch gestures, saves the current island in localStorage, and restores it on a later visit. It is a goal-free creative sandbox made with vanilla JavaScript modules and released under the MIT licence.` ,
            howToPlay: `Choose an asset from the palette, then click or tap a grid cell to place it. Drag across cells to brush several copies. On desktop, right-click a tile to erase it or right-drag to erase continuously. Hold Shift while dragging to pan the camera and use the mouse wheel to zoom. H and V flip the placement preview, E toggles erase mode, S saves, and R resets the island.

On touchscreens, tap to place, drag to paint, and long-press to erase. Use two fingers to pan or pinch to zoom. Start with Fill with grass if you want a quick base, then establish paths and larger buildings before filling small gaps with trees, walls, lamps, and flowers. The game has no score or failure condition, so rebuilding and experimenting are the entire objective.` ,
            keyFeatures: [
                'Goal-free building on a 14-by-14 isometric grid',
                'More than 75 Mediterranean buildings, plants, props, and terrain assets',
                'Mouse, keyboard, and mobile touch editing controls',
                'Camera pan, zoom, tile flipping, brush placement, and erasing',
                'Automatic local saving with no account required',
            ],
            screenshots: ['/screenshots/mykonos-island-voxels.png'],
            sourceName: 'boona13',
            sourceUrl: 'https://mykonos-island-voxels.netlify.app/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['sandbox', 'zen', 'relaxing', 'experimental', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2026-05-14',
            featured: false,
        },
    },
    {
        sourceKey: 'github:honzaap/slashsaber',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/honzaap/SlashSaber',
            readmeUrl: 'https://github.com/honzaap/SlashSaber/blob/main/README.md',
            licenceUrl: 'https://github.com/honzaap/SlashSaber/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'slashsaber',
            name: 'SlashSaber',
            category: 'action',
            tagline: 'Sweep a sword through incoming targets and respect their required slash directions.',
            about: `SlashSaber is an endless first-person sword game by honzaap, built with Three.js and Vue. Targets travel toward the player through a dark three-dimensional space, and the mouse becomes the blade. The basic action is easy to understand—move the pointer through an obstacle to cut it—but directional markings complicate the rhythm. Some targets accept a slash from any angle, while others must be cut along a specified direction, turning each approach into a brief recognition and execution test.

Missing a target is not immediately fatal. The run ends after three obstacles reach the player, providing a small margin for error while the pace and score continue to build. Visual sparks, sword motion, and a focused interface keep attention on the next incoming shape rather than menus or upgrades. The endless structure makes it suitable for short score attempts as well as repeated practice, with improvement coming from cleaner mouse paths and quicker reading. The complete browser implementation is available from the developer under the Creative Commons Attribution 4.0 licence.` ,
            howToPlay: `Move the mouse to guide the sword and sweep the pointer through each approaching obstacle. Read the symbol or orientation on directional targets before cutting: those objects only count when the slash travels along the required direction. Ordinary obstacles can be cut with any clear stroke. If an object passes the sword and reaches you, it consumes one of three allowed misses. The run ends when all three are gone.

Keep the pointer near the center after each cut so the next target can be reached with a short movement. Use deliberate straight strokes instead of circling across the screen, especially when several directional targets arrive close together. Read the next obstacle while completing the current slash, but do not begin too early and cross it from the wrong side. The objective is to survive and extend the score for as long as possible.` ,
            keyFeatures: [
                'Mouse-controlled 3D sword movement',
                'Directional targets that require correctly angled slashes',
                'Endless scoring loop with three allowed misses',
                'Focused Three.js visuals and impact effects',
                'Open source under Creative Commons Attribution 4.0',
            ],
            screenshots: ['/screenshots/slashsaber.webp'],
            sourceName: 'honzaap',
            sourceUrl: 'https://slashsaber.com/',
            licence: 'CC-BY-4.0',
            licenceStatus: 'osi-approved',
            tags: ['survival', 'skill-based', 'quick-fix', 'minimal', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2023-06-04',
            featured: false,
        },
    },
    {
        sourceKey: 'github:hack23/blacktrigram',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/Hack23/blacktrigram',
            readmeUrl: 'https://github.com/Hack23/blacktrigram/blob/main/README.md',
            licenceUrl: 'https://github.com/Hack23/blacktrigram/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'black-trigram',
            name: 'Black Trigram',
            category: 'simulation',
            tagline: 'Practice Korean martial arts through stances, anatomical targeting, and reactive combat.',
            about: `Black Trigram is Hack23 AB's browser-based Korean martial arts combat simulator. Its fighting system organizes techniques around the eight I Ching trigrams, each associated with a different tactical emphasis such as force, joint manipulation, precision, defense, or countering. Players can select among five fighter archetypes and target a detailed set of anatomical vital points rather than relying on a small list of generic attacks.

The simulation tracks damage across body regions and connects injuries to pain, consciousness, breathing, balance, mobility, and combat readiness. Stance choice therefore changes more than animation: it affects available techniques, targeting bonuses, defensive posture, and exposure to counterattacks. Training modules document Korean terminology and let players explore the system through desktop controls or a mobile interface with a virtual pad, action buttons, stance wheel, gestures, and haptic feedback. The React and Three.js project publishes its implementation, test plans, controls reference, and asset documentation under the Apache 2.0 licence.` ,
            howToPlay: `Move with WASD or the arrow keys. Press number keys 1 through 8 to select one of the eight trigram stances, then press Space to execute the current technique. B raises the guard, V toggles the anatomical vital-point targeting overlay, and Escape or M opens the pause or intro controls. Choose a stance whose strengths match the target area and watch the combat-readiness display for accumulated injuries.

On mobile, use the virtual directional pad at the lower left, the Attack and Block buttons at the lower right, and the central stance wheel. Swipe right to advance, left to retreat, up for a high attack, or down for a low attack; a two-finger tap toggles vital-point mode. Avoid repeating exposed attacks, because the opponent can recognize limb openings and counter. Change stance when damage restricts movement or makes the current approach unsafe.` ,
            keyFeatures: [
                'Eight trigram stances with distinct tactical roles',
                'Five fighter archetypes and 70 anatomical target points',
                'Body-region injury, pain, balance, and consciousness simulation',
                'Keyboard, touch, gesture, and haptic control schemes',
                'Extensive open-source controls and combat documentation',
            ],
            screenshots: ['/screenshots/black-trigram.png'],
            sourceName: 'Hack23 AB',
            sourceUrl: 'https://blacktrigram.com/',
            licence: 'Apache-2.0',
            licenceStatus: 'osi-approved',
            tags: ['sandbox', 'skill-based', 'hardcore', 'experimental', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2025-05-26',
            featured: false,
        },
    },
    {
        sourceKey: 'github:atxgreene/ugh-guys-',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/atxgreene/Ugh-Guys-',
            readmeUrl: 'https://github.com/atxgreene/Ugh-Guys-/blob/main/README.md',
            licenceUrl: 'https://github.com/atxgreene/Ugh-Guys-/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'ugh-guys',
            name: 'Ugh Guys',
            category: 'strategy',
            tagline: 'Command one of three asymmetric factions in a procedural browser RTS.',
            about: `Ugh Guys is a real-time strategy game by ATXGreene set in a mythic pre-flood world. Three asymmetric factions approach each match differently: the Covenant Cities balance economy and defense, the Watcher Remnant fields elite units and forbidden technologies, and the Nephilim Clans emphasize powerful melee forces and base destruction. Each side has its own units, buildings, costs, upgrades, and route toward victory rather than sharing a recolored roster.

Matches combine resource gathering, construction queues, technology upgrades, army supply, scouting, and combat against an AI opponent. Procedural terrain changes the map between games, while fog of war separates explored ground from currently visible areas. Units navigate with A-star pathfinding and physical separation, and neutral guards protect valuable resource nodes before returning to their posts. A minimap, control groups, attack-move command, rally points, and camera rotation give the browser interface the familiar tools expected from a desktop RTS. All visual assets are generated procedurally, and the complete Three.js project is released under CC0.` ,
            howToPlay: `Left-click a unit or building to select it, or left-drag a box around several units. Right-click the terrain to move, a resource to gather, an enemy to attack, a construction site to resume work, or a destination to set a rally point. Pan with WASD, the arrow keys, or the screen edge. Rotate with Q and E or middle-mouse dragging, zoom with the wheel, and press H to center the camera on your base.

Select a worker and press B to open construction choices; Escape cancels placement. F issues attack-move and X orders selected units to stop. Hold Ctrl with a number to assign a control group, then press that number to recall it. Build workers and secure nearby resources before committing to expensive technology. Scout through fog of war, identify the enemy faction, and choose units that exploit its weaknesses rather than producing one army composition every match.` ,
            keyFeatures: [
                'Three asymmetric factions with unique units and technology trees',
                'Resource economy, construction, upgrades, supply, and AI opponent',
                'Procedural terrain with fog of war and minimap',
                'A-star unit pathfinding and neutral resource guards',
                'RTS control groups, rally points, camera rotation, and attack-move',
            ],
            screenshots: ['/screenshots/ugh-guys.jpg'],
            sourceName: 'ATXGreene',
            sourceUrl: 'https://atxgreene.github.io/Ugh-Guys-/',
            licence: 'CC0-1.0',
            licenceStatus: 'osi-approved',
            tags: ['rts', 'procedurally-generated', 'hardcore', 'skill-based', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2026-06-12',
            featured: false,
        },
    },
    {
        sourceKey: 'github:opstiger/aiba-percent-battle',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'Source, controls, MIT licence, and screenshots are documented, but the repository contains references and visual assets tied to real basketball stars; third-party likeness and trademark clearance requires separate review.',
        evidence: {
            repositoryUrl: 'https://github.com/opstiger/aiba-percent-battle',
            readmeUrl: 'https://github.com/opstiger/aiba-percent-battle/blob/main/README.md',
            licenceUrl: 'https://github.com/opstiger/aiba-percent-battle/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:ivteplo/tennis-game-js',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'The Apache-2.0 repository and live page are available, but the README has no gameplay or control documentation and the repository exposes no reviewed screenshot asset.',
        evidence: {
            repositoryUrl: 'https://github.com/ivteplo/tennis-game-js',
            readmeUrl: 'https://github.com/ivteplo/tennis-game-js/blob/main/README.md',
            licenceUrl: 'https://github.com/ivteplo/tennis-game-js/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:jfmdev/road-brawler',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'Source, MPL-2.0 licence, play URL, and screenshots are present, but the README does not document steering, acceleration, collision, or scoring controls.',
        evidence: {
            repositoryUrl: 'https://github.com/jfmdev/road-brawler',
            readmeUrl: 'https://github.com/jfmdev/road-brawler/blob/main/README.md',
            licenceUrl: 'https://github.com/jfmdev/road-brawler/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:bodhiprotocol/bike-race',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'Gameplay, controls, and MIT licence are documented, but neither the repository nor the published page provides a durable author-supplied gameplay screenshot for catalogue use.',
        evidence: {
            repositoryUrl: 'https://github.com/BodhiProtocol/bike-race',
            readmeUrl: 'https://github.com/BodhiProtocol/bike-race/blob/main/README.md',
            licenceUrl: 'https://github.com/BodhiProtocol/bike-race/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:rayhantr/swiishh',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/rayhantr/swiishh',
            readmeUrl: 'https://github.com/rayhantr/swiishh/blob/main/README.md',
            licenceUrl: 'https://github.com/rayhantr/swiishh/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'swiishh',
            name: 'SWIISHH',
            category: 'racing-sports',
            tagline: 'Shoot physics-driven free throws with a webcam gesture, mouse, or touchscreen.',
            about: `SWIISHH is Rayhan Taufik Ridha's browser basketball game built around hand-tracked free throws. In camera mode, MediaPipe recognizes a pinch or closed fist as grabbing the ball, follows the player's hand while aiming, and releases the shot when the hand flicks upward and opens. Camera processing stays on the device, and the game also provides an equivalent mouse and touch mode for players who do not want to grant webcam access.

The ball simulation models aerodynamic drag, lift from backspin, spin-sensitive rim and floor bounces, a physical backboard, and a responsive net. A clean swish awards three points while a shot that touches the rim or glass before dropping scores two. The scoreboard tracks streaks, accuracy, and a locally saved high score. Optional aim assistance compensates for noisy hand tracking without replacing the player's chosen arc or sideways motion. The zero-runtime-dependency TypeScript project includes headless physics tests and is published under the MIT licence.` ,
            howToPlay: `Choose camera mode and allow webcam access, or select mouse and touch mode. With the camera, pinch your thumb and index finger together—or close your fist—to grab the ball. Move your hand to aim, then flick upward and open it to shoot. Faster flicks create more power, while sideways motion adds aim and spin. In pointer mode, press the ball, drag to aim, then flick upward and release.

A swish scores three points; a made basket off the rim or backboard scores two. Build a streak and improve the accuracy shown on the LED scoreboard. Press P or Escape to pause, M to mute, R to request a new ball, and H for help. If tracking is unreliable, improve the lighting, keep the whole hand in frame, or switch to pointer mode. Aim assist can be disabled for fully raw physics.` ,
            keyFeatures: [
                'Webcam hand tracking plus mouse and touch shooting',
                'Drag, Magnus lift, spin, rim, backboard, and net physics',
                'Swish bonuses, streaks, accuracy, and locally saved high score',
                'Optional aim assistance and front or rear camera selection',
                'On-device camera processing with an MIT-licensed TypeScript source',
            ],
            screenshots: ['/screenshots/swiishh.png'],
            sourceName: 'Rayhan Taufik Ridha',
            sourceUrl: 'https://swiishh.sindbug.com/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['sports', 'physics', 'skill-based', 'experimental', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2026-06-12',
            featured: false,
        },
    },
    {
        sourceKey: 'github:vibezzzcoder/circuit-dominion',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'GPL-3.0 source, original-theme statement, controls, and gameplay are documented, but the README gameplay screenshot paths currently return 404 and the remaining images are backgrounds rather than gameplay captures.',
        evidence: {
            repositoryUrl: 'https://github.com/VibezZzCoder/circuit-dominion',
            readmeUrl: 'https://github.com/VibezZzCoder/circuit-dominion/blob/main/README.md',
            licenceUrl: 'https://github.com/VibezZzCoder/circuit-dominion/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:lordbasilaiassistant-sudo/aeon',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'MIT source and controls are documented, but no durable author-supplied gameplay screenshot was found and the project description invokes third-party game marks that require editorial review.',
        evidence: {
            repositoryUrl: 'https://github.com/lordbasilaiassistant-sudo/aeon',
            readmeUrl: 'https://github.com/lordbasilaiassistant-sudo/aeon/blob/main/README.md',
            licenceUrl: 'https://github.com/lordbasilaiassistant-sudo/aeon/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:spacecowgoesmoo-gamestudio/chessyciv',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'AGPL-3.0 source and images are available, but the reviewed README does not provide enough concrete control and turn-resolution instructions for an accurate how-to guide.',
        evidence: {
            repositoryUrl: 'https://github.com/SpaceCowGoesMoo-GameStudio/ChessyCiv',
            readmeUrl: 'https://github.com/SpaceCowGoesMoo-GameStudio/ChessyCiv/blob/main/README.md',
            licenceUrl: 'https://github.com/SpaceCowGoesMoo-GameStudio/ChessyCiv/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:johnthesuper117/amalgamation-tower-defence',
        decision: 'hold',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        reason: 'MIT source, wave rules, and hotkeys are documented, but no durable author-supplied gameplay screenshot was found in the repository.',
        evidence: {
            repositoryUrl: 'https://github.com/Johnthesuper117/Amalgamation-Tower-Defence',
            readmeUrl: 'https://github.com/Johnthesuper117/Amalgamation-Tower-Defence/blob/main/README.md',
            licenceUrl: 'https://github.com/Johnthesuper117/Amalgamation-Tower-Defence/blob/main/LICENSE',
        },
    },
    {
        sourceKey: 'github:leks2000/hexkingdom',
        decision: 'approved',
        reviewedAt: '2026-07-21',
        reviewer: 'ArcadeBloom editorial',
        evidence: {
            repositoryUrl: 'https://github.com/Leks2000/Hexkingdom',
            readmeUrl: 'https://github.com/Leks2000/Hexkingdom/blob/main/README.md',
            licenceUrl: 'https://github.com/Leks2000/Hexkingdom/blob/main/LICENSE',
        },
        catalogue: {
            slug: 'hexkingdom',
            name: 'Hexkingdom',
            category: 'strategy',
            tagline: 'Match hexagonal landscapes, grow an economy, research technology, and defend a living realm.',
            about: `Hexkingdom is an independent tile-building strategy game by Leks2000. Each turn begins with a hexagonal landscape tile containing edges such as forest, field, river, mountain, village, or hills. Placing it beside compatible terrain scores points, while larger matching clusters, complete alignments, and placement chains increase the reward. The board is more than a static score puzzle: placed tiles evolve over time as crops grow, trees thicken, roads gain bridges, construction advances, and settlements expand into towns, cities, and castles.

Buildings produce wood, stone, food, gold, and influence, with trade structures automatically selling surplus and caravans paying for completed journeys. Research spans agriculture, mining, trade, engineering, military development, warfare, and production tools. Population needs and stability affect the economy, while barracks and garrisons recruit swordsmen, archers, and knights for border conflicts. Rival factions can expand, raid, capture territory, and lose land in return. The game auto-saves its grid, economy, research, armies, score, and random sequence locally. Its source is published under the MIT licence.` ,
            howToPlay: `Left-click to place the tile in hand or select a tile already on the board. Press R or right-click to rotate the current tile, and V to shuffle its edge arrangement. Match terrain edges whenever possible to build clusters and scoring chains, then use the resulting land and buildings to generate resources, research upgrades, and support an army.

Drag with the left mouse button to pan the camera. Right-drag, middle-drag, or Shift-drag rotates the view; the mouse wheel or pinch gesture zooms toward the pointer. WASD and the arrow keys also pan, while Q and E rotate the camera in sixty-degree steps. Watch food and stability as the population grows, maintain roads for trade, and reinforce border tiles before hostile factions raid them. Recruit suitable units before attacking an enemy border, because a failed battle costs troops while a victory adds the captured tile to your kingdom.` ,
            keyFeatures: [
                'Hex-tile placement with edge matching, clusters, and score chains',
                'Evolving terrain, construction, settlements, roads, and bridges',
                'Resource production, automatic trade, research, and kingdom tiers',
                'Recruitable armies and territory conflict against expanding factions',
                'Local auto-save for the complete deterministic game state',
            ],
            screenshots: ['/screenshots/hexkingdom.gif'],
            sourceName: 'Leks2000',
            sourceUrl: 'https://leks2000.github.io/Hexkingdom/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['turn-based', 'procedurally-generated', 'sandbox', 'relaxing', 'open-source'],
            addedDate: '2026-07-21',
            releaseDate: '2026-07-03',
            featured: false,
        },
    },
];

decisions.push(...require('./batches/2026-07-21-strategy-and-simulation.js'));
decisions.push(...require('./batches/2026-07-21-simulation-and-strategy-two.js'));
decisions.push(...require('./batches/2026-07-21-action.js'));
decisions.push(...require('./batches/2026-07-21-puzzle.js'));
decisions.push(...require('./batches/2026-07-21-action-two.js'));
decisions.push(...require('./batches/2026-07-21-mixed-three.js'));
decisions.push(...require('./batches/2026-07-22-mixed-one.js'));

module.exports = decisions;
