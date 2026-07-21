'use strict';

const reviewedAt = '2026-07-21';
const reviewer = 'ArcadeBloom editorial';

function evidence(repo, branch = 'main') {
    return {
        repositoryUrl: `https://github.com/${repo}`,
        readmeUrl: `https://github.com/${repo}/blob/${branch}/README.md`,
        licenceUrl: `https://github.com/${repo}/blob/${branch}/LICENSE`,
    };
}

function hold(sourceKey, repo, reason, branch) {
    return { sourceKey, decision: 'hold', reviewedAt, reviewer, reason, evidence: evidence(repo, branch) };
}

module.exports = [
    hold('github:antonuden/jsshooter', 'AntonUden/jsShooter', 'MIT source and basic gameplay are documented, but the repository provides neither concrete input controls nor a durable gameplay screenshot.'),
    hold('github:djukicaleksej/javascriptgame', 'DjukicAleksej/javascriptgame', 'Repository images exist, but the reviewed documentation provides insufficient control detail and identifies the project as derivative work requiring additional rights review.'),
    hold('github:saganaki22/swarm', 'Saganaki22/Swarm', 'Apache-2.0 source and pointer interaction are documented, but no author-supplied gameplay screenshot was found.'),
    hold('github:russelldangerr/violencetown', 'RussellDangerr/violencetown', 'MIT source and detailed controls are available, but the detected images are placeholder asset sheets rather than reviewed gameplay captures.'),
    hold('github:seanmcn/elemental-rts', 'seanmcn/Elemental-RTS', 'GPL-3.0 source and images are present, but the README contains no usable player-control documentation.'),
    {
        sourceKey: 'github:loosecannons/grid-wars',
        decision: 'rejected',
        reviewedAt,
        reviewer,
        reason: 'The candidate sourceUrl resolves to a Docker Hub image page rather than a playable browser game; the repository also describes itself as untested and uses a third-party themed presentation.',
        evidence: evidence('loosecannons/grid-wars'),
    },
    hold('github:amsanghi/gops', 'amsanghi/gops', 'MIT source and gameplay text are available, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:nrsharip/threejs-shmup', 'nrsharip/threejs-shmup', 'MIT source and screenshots are available, but the reviewed README does not document concrete movement, aiming, firing, or restart controls.'),
    hold('github:gallind/sky-combat', 'Gallind/Sky-Combat', 'MIT source and some gameplay text are available, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:romizone/optimus', 'romizone/optimus', 'MIT source and extensive gameplay text are available, but no durable author-supplied gameplay screenshot was found and derivative-work language needs review.'),
    hold('github:offeringofpie/rock-paper-scissors', 'offeringofpie/rock-paper-scissors', 'Source and imagery are available, but the reviewed README contains no concrete interaction or round-flow instructions.'),
    hold('github:jarmstrong158/dungeon-fragments', 'jarmstrong158/dungeon-fragments', 'MIT source and controls are documented, but the only reviewed image is a title screen rather than a gameplay capture.'),
    hold('github:promuzi/pulloseum', 'promuzi/pulloseum', 'Source, controls, and images are available, but the evidence scan found third-party mark or likeness references requiring separate rights review.'),
    hold('github:saganaki22/greentendo', 'Saganaki22/Greentendo', 'Apache-2.0 source and extensive controls are documented, but no durable gameplay screenshot was found and the project directly reproduces several third-party game identities.'),
    hold('github:authsrng-game/auths-rng', 'authsrng-game/auths-RNG', 'MIT source and images are available, but the extracted README material does not provide reliable roll, sell, purchase, inventory, or progression controls.'),
    hold('github:grantrocks/that-new-platformer-game', 'Grantrocks/That-New-Platformer-Game', 'MIT source and images are available, but the README provides no concrete movement, jumping, attack, or restart controls.'),
    {
        sourceKey: 'github:tjhavranek/race',
        decision: 'approved',
        reviewedAt,
        reviewer,
        evidence: evidence('tjhavranek/race'),
        catalogue: {
            slug: 'litomysl-race',
            name: 'Litomyšl Race',
            category: 'racing-sports',
            tagline: 'Race through a Czech town, clear ten checkpoints, collect upgrades, and survive hazards.',
            about: `Litomyšl Race is a two-player browser racing game by tjhavranek, created around the streets and landmarks of Litomyšl in the Czech Republic. Blue and orange cars compete from start to finish through ten ordered checkpoints, while bombs, crashes, projectiles, roaming Smetana characters, and other hazards threaten each driver's two lives. Nine recognizable local buildings can take visible damage as the race unfolds, giving the compact course an unusually specific setting.

The first input selects the play format. Keyboard input starts a shared-keyboard race for two people, while beginning with mouse or touch pits player one against a computer-controlled second car. Cow pickups grant five seconds of invulnerability and permanently upgrade ordinary bullets into area-damage rockets, though collecting one briefly slows the car. A five-second opening grace period prevents immediate firing, and a global top-ten leaderboard records qualifying finishes. The project uses synthesized audio rather than bundled samples, supports mobile landscape and fullscreen play, and publishes its source under the MIT licence.` ,
            howToPlay: `Wait for the countdown, then drive through all ten checkpoints in order before crossing the finish line. Player one accelerates with W, brakes or reverses with S, steers with A and D, and fires with E after the five-second safe start. Player two uses the arrow keys, with Enter or Right Control to fire. Space starts or restarts a race and Escape returns to the menu.

For a one-player game, begin with the mouse or touchscreen before pressing any key. Hold to accelerate, steer toward the pointer, and double-click or double-tap to fire while the computer drives the other car. Avoid bombs, bullets, crashes, and roaming hazards because each hit costs a life. Chase a cow when the route is safe: it briefly slows you, but provides temporary invulnerability and upgrades the weapon to rockets for the rest of the race.` ,
            keyFeatures: [
                'Shared-keyboard two-player racing or single-player against a bot',
                'Ten ordered checkpoints through a Litomyšl-inspired course',
                'Two-life damage system with bombs, hazards, bullets, and rockets',
                'Temporary invulnerability and permanent weapon upgrade pickups',
                'Destructible landmarks and a global top-ten leaderboard',
            ],
            screenshots: ['/screenshots/litomysl-race.png'],
            sourceName: 'tjhavranek',
            sourceUrl: 'https://tjhavranek.github.io/race/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['racing', 'couch-co-op', 'multiplayer', 'skill-based', 'open-source'],
            addedDate: reviewedAt,
            releaseDate: '2026-01-31',
            featured: false,
        },
    },
    {
        sourceKey: 'github:penny-yu10013/isekai_gemcraft',
        decision: 'approved',
        reviewedAt,
        reviewer,
        evidence: evidence('Penny-Yu10013/isekai_gemcraft'),
        catalogue: {
            slug: 'isekai-gemcraft',
            name: 'Isekai Gemcraft',
            category: 'simulation',
            tagline: 'Cut and polish virtual gemstones with angles, index gears, depth stops, and real planar geometry.',
            about: `Isekai Gemcraft is Penny Yu's browser faceting simulator, presenting a magical workshop around mechanics drawn from a physical gemstone-cutting machine. Players choose a crystal, mount the rough stone, set a tilt angle between zero and ninety degrees, rotate it through a 96-tooth index gear, and press it against a grinding lap. Cutting uses real-time convex polytope clipping, so every resulting facet remains planar rather than being approximated with voxels or decorative textures.

Five guided designs range from a seventeen-facet tutorial stone to round brilliant, Asscher, Portuguese, and trillion cuts. Diagram steps specify the required angle, index, and depth, with compass rings and optional symmetric-array actions assisting repetitive facets. Free-cutting mode removes the guide for open experimentation. Players can change coarse, fine, and polishing laps, tint stones with solid or two-tone colors, adjust lighting, submit finished work for appraisal, and preserve stones in a daily collection with favorites and JSON import or export. The bilingual, touch-capable single-file Three.js project is released under GPL-3.0.` ,
            howToPlay: `Choose a rough stone and start with the Simple Sun tutorial if you are unfamiliar with faceting. Use the protractor control to set the tilt angle and the 96-position index gear to rotate the stone. Set the target depth, then press and hold the grinding control; the view is intentionally masked while material is removed. Release to inspect the new facet. A longer press cuts deeper until the depth stop reaches its target.

Follow each diagram's angle, index, and lap instructions, using the compass rings or symmetric-array action when several equivalent facets are required. Begin with a coarse lap, refine the surfaces with a fine lap, and finish with polish before submitting the gem for appraisal. Three rewind charges can undo early mistakes; after they are spent, later cuts remain permanent. Free-cutting mode removes diagram safeguards for custom shapes.` ,
            keyFeatures: [
                'Real-time convex geometry produces genuinely planar gemstone facets',
                'Tilt, 96-tooth index gear, grinding time, and depth-stop controls',
                'Five guided cuts ranging from 16 to 97 designed facets',
                'Free-cutting mode, rewinds, multiple laps, tinting, and appraisal',
                'Bilingual desktop and mobile interface in a single HTML file',
            ],
            screenshots: ['/screenshots/isekai-gemcraft.jpg'],
            sourceName: 'Penny Yu',
            sourceUrl: 'https://penny-yu10013.github.io/isekai_gemcraft/',
            licence: 'GPL-3.0',
            licenceStatus: 'osi-approved',
            tags: ['sandbox', 'physics', 'skill-based', 'relaxing', 'open-source'],
            addedDate: reviewedAt,
            releaseDate: '2026-07-05',
            featured: false,
        },
    },
    {
        sourceKey: 'github:dneese/ultimate-tic-tac-toe-cyberpunk-edition',
        decision: 'approved',
        reviewedAt,
        reviewer,
        evidence: evidence('dneese/ULTIMATE-TIC-TAC-TOE-CYBERPUNK-EDITION'),
        catalogue: {
            slug: 'ultimate-tic-tac-toe-cyberpunk',
            name: 'Ultimate Tic-Tac-Toe: Cyberpunk Edition',
            category: 'strategy',
            tagline: 'Win a three-by-three grid of boards while every move determines your opponent’s next board.',
            about: `Ultimate Tic-Tac-Toe: Cyberpunk Edition is dneese's neon browser presentation of the expanded pencil-and-paper strategy game. The playing field contains nine ordinary tic-tac-toe boards arranged as one larger board. Winning a small board claims its position on the outer grid, and the match ends when a player controls three small boards in a horizontal, vertical, or diagonal line.

The central constraint creates the strategy: the cell chosen inside one small board determines which small board the opponent must use next. A move in the upper-right cell sends the next player to the upper-right board, so every mark simultaneously pursues a local line and controls the rival's options. If the destination board is already won or tied, the next player may choose any board that remains available. Dynamic highlighting communicates the legal destination, while neon effects, CRT scanlines, Web Audio feedback, a responsive touch layout, and English or Ukrainian interface options provide the presentation. The source is available under the MIT licence.` ,
            howToPlay: `On the first turn, click or tap any empty cell on any small board. After that, look for the highlighted legal board. The position of the previous move determines where the next mark must be placed: for example, a mark in a board's center sends the opponent to the center board, while a lower-left mark sends them to the lower-left board.

Complete three cells in a row inside a small board to claim that section of the larger grid. Win the match by claiming three small boards in a horizontal, vertical, or diagonal line. When a move sends you to a board that has already been won or tied, choose any other unfinished board. Plan beyond the immediate line: avoid sending the opponent to a board where they have a forced win, and use your chosen cell to steer them away from strategically important sections.` ,
            keyFeatures: [
                'Nine linked tic-tac-toe boards forming one strategic grid',
                'Every cell determines the opponent’s required next board',
                'Cyberpunk visuals with neon highlights and CRT effects',
                'Responsive mouse and touch interaction',
                'English and Ukrainian interfaces with audio feedback',
            ],
            screenshots: ['/screenshots/ultimate-tic-tac-toe-cyberpunk.png'],
            sourceName: 'dneese',
            sourceUrl: 'https://dneese.github.io/ULTIMATE-TIC-TAC-TOE-CYBERPUNK-EDITION/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['board-game', 'turn-based', 'brain-burner', 'multiplayer', 'open-source'],
            addedDate: reviewedAt,
            releaseDate: '2025-10-04',
            featured: false,
        },
    },
    {
        sourceKey: 'github:viachm/windsurf-simulator',
        decision: 'approved',
        reviewedAt,
        reviewer,
        evidence: evidence('viachm/windsurf-simulator'),
        catalogue: {
            slug: 'windsurf-simulator',
            name: 'Windsurf Simulator',
            category: 'racing-sports',
            tagline: 'Learn sail trim, mast rake, balance, planing, tacks, and gybes through browser physics.',
            about: `Windsurf Simulator is Viacheslav M.'s three-dimensional browser game for learning how board, sail, wind, and rider position interact. Rather than steering with a single left-right input, the player sheets the sail in or out, rakes the mast, changes body lean, selects foot-strap positions, raises or lowers the daggerboard, and decides when to hook into the harness. Apparent wind and sail force respond to those choices as the board accelerates, turns, or loses power.

The simulation includes planing, stance transitions, tacking, gybing, and camera controls for observing the rig from different angles. Smart interlocks prevent physically implausible actions such as entering rear straps without enough speed or hooking into a powerless sail, and the hint bar explains why a command was refused. Every control also appears as a clickable panel action, supporting touch devices as well as keyboards. Twenty interface languages broaden access, while guided feedback makes the project useful as both a game and an introductory training model. The complete source is published under the MIT licence.` ,
            howToPlay: `Use W and S to sheet the sail in or out. The left and right arrow controls rake the mast backward to head upwind or forward to bear away. Q and E reduce or increase windward lean, while 1, 2, and 3 choose the front, neutral, or rear foot-strap stance. Press D to raise or lower the daggerboard and H to hook into or leave the harness.

Press T to tack, G to gybe, and R to reset. Drag the mouse to orbit the camera and scroll to zoom; the right-side panel offers clickable versions of the same sailing controls. Begin in a stable stance with the daggerboard down, sheet in gradually, and watch the hint bar. As speed increases, move into the straps and harness. If the simulator rejects a command, correct the sail power, speed, or balance condition it identifies before trying again.` ,
            keyFeatures: [
                'Interactive sail trim, mast rake, rider lean, straps, harness, and daggerboard',
                'Apparent-wind and planing physics with tacks and gybes',
                'Smart interlocks explain physically impossible control combinations',
                'Keyboard, mouse-camera, clickable panel, and mobile support',
                'Interface translations for twenty languages',
            ],
            screenshots: ['/screenshots/windsurf-simulator.png'],
            sourceName: 'Viacheslav M.',
            sourceUrl: 'https://windsurfsimulator.com/',
            licence: 'MIT',
            licenceStatus: 'osi-approved',
            tags: ['sports', 'physics', 'skill-based', 'experimental', 'open-source'],
            addedDate: reviewedAt,
            releaseDate: '2026-07-08',
            featured: false,
        },
    },
];
