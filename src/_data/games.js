// =============================================================================
// ArcadeBloom game catalogue — outbound-link directory
// =============================================================================
// SCHEMA (per ADR-0001 + CONTEXT.md). Every entry MUST be filled completely.
//
//   id            number   stable, monotonic
//   slug          string   kebab-case, unique, matches /game/<slug>/
//   name          string   display title
//   category      string   one of site.categories[].slug (6 values)
//   tagline       string   one-line subtitle (<=80 chars)
//   about         string   150–250 word original review (Phase A: factual placeholder)
//   howToPlay     string   100–200 word controls + strategy (Phase A: factual placeholder)
//   keyFeatures   string[] 3–6 bullets
//   screenshots   string[] 1–5 root-relative image paths (empty until content phase)
//   sourceName    string   author / project name (for attribution + CTA label)
//   sourceUrl     string   canonical outbound play URL (the ONLY play action)
//   licence       string   SPDX id | 'source-available' | 'proprietary'
//   tags          string[] 3–5 slugs from the controlled vocabulary (_data/tags.js)
//   addedDate     string   ISO date — when ArcadeBloom added it (drives /new/)
//   releaseDate   string   year or ISO date — when the game itself shipped
//   featured      boolean  editor pick (drives /featured/)
//
// REMOVED vs legacy schema: plays, rating, image, gameUrl (per ADR-0001).
//
// Phase-A entries (js13k import) carry factual placeholder about/howToPlay
// marked for Phase-B human upgrade to original reviews. See CONTEXT.md
// "Seed scale strategy".
// =============================================================================

module.exports = [
    {
        "id": 1,
        "slug": "hextris",
        "name": "Hextris",
        "category": "puzzle",
        "tagline": "Tetris on a hexagon — rotate to match falling colors from six sides.",
        "about": "Hextris is a fast-paced puzzle game that takes the line-clearing instinct of Tetris and bends it onto a hexagonal playing field. Colored blocks fall toward the center from six directions and you rotate the hexagon to slot them into matching groups. Three or more adjacent same-color blocks vanish, chains cascade, and the speed ramps until the screen fills.\n\nThe genius is in the geometry. A square grid asks you to think in rows; a hexagon asks you to think in fans radiating outward, which changes which rotations feel safe and which corner you to a loss. The minimalist neon presentation keeps the board readable at full speed — you are never fighting the UI, only the colors. Originally a student project, Hextris became a small web phenomenon and remains one of the cleanest browser puzzle designs of its era. Free, open-source, no download, and equally good on a phone or a laptop.",
        "howToPlay": "On desktop, use the left and right arrow keys to rotate the hexagon clockwise and counter-clockwise. On touch devices, tap the left or right half of the screen. Blocks fall from the six outer edges toward the center; align three or more blocks of the same color so they touch and they clear.\n\nStrategy: rotate early, before the stack reaches the center. Group colors deliberately rather than reacting to each block — a single well-placed rotation can set up a chain. Watch the upcoming color and pre-position. The game ends when any stack reaches the center hexagon, so keep all six lanes balanced rather than clearing one side at a time.",
        "keyFeatures": [
            "Six-direction falling-block twist on Tetris",
            "Cross-platform: identical play on web, iOS and Android",
            "Clean neon-minimal presentation, no clutter",
            "Open-source — full code on GitHub"
        ],
        "screenshots": [],
        "sourceName": "Hextris",
        "sourceUrl": "https://hextris.io/",
        "licence": "GPL-3.0",
        "tags": [
            "minimal",
            "quick-fix",
            "classic"
        ],
        "addedDate": "2026-07-01",
        "releaseDate": "2015",
        "featured": true
    },
    {
        "id": 2,
        "slug": "proxx",
        "name": "PROXX",
        "category": "puzzle",
        "tagline": "A slick, neon reimagining of minesweeper for the modern web.",
        "about": "PROXX is what minesweeper becomes when a modern web team takes it seriously. The core loop is familiar: reveal tiles, read the numbers, mark the danger, clear the rest. What sets PROXX apart is the execution. The board is a clean dark-neon grid, every reveal animates, long-presses flag mines on touch, and haptic feedback fires on supported devices so you feel a wrong guess before you see it.\n\nBeyond the surface, PROXX is also a technical showpiece — it was built by the Google Chrome team as a demonstration of how smooth a web app can feel when it is built properly. Five grid sizes from a quick 5×5 warmup to a punishing 40×40, three difficulty presets, and full offline play once it has cached. It is the rare reimagining that respects the original design while removing every papercut. Free, no account, no ads cluttering the board, works identically on phone and desktop.",
        "howToPlay": "Click or tap a tile to reveal it. A number tells you how many of its eight neighbors are mines. Long-press (or right-click) to flag a tile you believe is a mine. Clear every non-mine tile to win; hit a mine and you lose.\n\nStrategy: start from the middle of the board — corner and edge tiles have fewer neighbors and give weaker information. When a number equals its count of unrevealed neighbors, all of those neighbors are mines: flag them. When a number equals its count of flagged neighbors, every other neighbor is safe: chord-click the number to clear them all at once. Use the largest grid size only when you have time to think.",
        "keyFeatures": [
            "Five grid sizes (5×5 up to 40×40) and three difficulty presets",
            "Offline-capable — play without a connection after first load",
            "Haptic feedback and animations on supported devices",
            "Built by the Chrome team as a web performance showcase"
        ],
        "screenshots": [],
        "sourceName": "PROXX",
        "sourceUrl": "https://proxx.app/",
        "licence": "Apache-2.0",
        "tags": [
            "minimal",
            "brain-burner",
            "classic"
        ],
        "addedDate": "2026-07-01",
        "releaseDate": "2020",
        "featured": true
    },
    {
        "id": 3,
        "slug": "2048",
        "name": "2048",
        "category": "puzzle",
        "tagline": "Slide and merge numbered tiles to reach the elusive 2048 tile.",
        "about": "2048 is the sliding-tile puzzle that became an unlikely global obsession. You play on a 4×4 grid. Every move slides all tiles in one direction; two tiles of the same number merge into their sum when they collide. A new 2 or 4 spawns after each move. The goal stated in the title is to reach the 2048 tile, but the real goal is how far past it you can push.\n\nThe design is a masterclass in emergent depth from trivial rules. There is exactly one decision per turn — which direction to slide — yet the strategic space is enormous because every move shifts the entire board. The dominant strategy (keep your largest tile pinned in a corner) is easy to describe and hard to execute under pressure, which is why the game keeps pulling you back. Open-source, freely hosted by the original author, and the template for an entire genre of merging variants that followed.",
        "howToPlay": "Use the arrow keys (or swipe on touch) to slide all tiles in that direction. When two tiles of equal value collide, they merge into one tile worth their sum. After every move, a new 2 (90% chance) or 4 (10% chance) appears in a random empty cell. The game ends when no moves are possible.\n\nStrategy: pick one corner — usually bottom-right — and keep your highest tile there permanently. Build a descending chain along the bottom row so merges always feed toward your anchor. Never make a move that forces your anchor tile out of the corner. After reaching 2048, keep going; the real scoreboard is how high a tile you can build before the grid locks.",
        "keyFeatures": [
            "Emergent depth from a single slide mechanic",
            "Touch and keyboard play, identical on every device",
            "Open-source — the original that launched a genre",
            "Endless past the titular 2048 tile"
        ],
        "screenshots": [],
        "sourceName": "2048",
        "sourceUrl": "https://play2048.co/",
        "licence": "MIT",
        "tags": [
            "minimal",
            "quick-fix",
            "classic",
            "open-source"
        ],
        "addedDate": "2026-07-01",
        "releaseDate": "2014",
        "featured": true
    },
    {
        "id": 4,
        "slug": "hexgl",
        "name": "HexGL",
        "category": "racing-sports",
        "tagline": "A WebGL future-racer that proved the browser could do 3D.",
        "about": "HexGL is a futuristic racing game built entirely in WebGL, and at the time of its release it was a headline answer to the question \"can a browser really do 3D?\". You pilot a hover-craft through a neon canyon at absurd speed, banking through gates and scraping the walls when you misjudge a turn. It wears its WipEout inspiration on its sleeve and does not apologize for it.\n\nWhat makes HexGL worth playing today is not just nostalgia for the early-WebGL era — it still moves. The sense of speed, the bloom on the track edges, the audio that swells as you boost, all hold up. It is also a genuinely open project: the full source lives on GitHub, which makes it a favorite starting point for anyone learning real-time web graphics. Short, flashy, free, and a useful reference for what the platform can do when pushed.",
        "howToPlay": "Use the arrow keys or WASD to steer. Up accelerates, left and right steer, down brakes. Space activates your boost once charged. The track is a series of gates — pass through them to stay on course and maintain your speed bonus.\n\nStrategy: do not oversteer. The craft carries momentum, so small smooth inputs beat large corrections. Save your boost for the long straights where it has room to compound, not the corners. Brake early into tight turns rather than mid-corner — you lose less speed. Completing a clean lap is faster than a risky one.",
        "keyFeatures": [
            "Full WebGL future-racer running natively in the browser",
            "WipEout-inspired neon aesthetic at full frame rate",
            "Open-source — popular WebGL learning reference",
            "Boost mechanic rewards clean racing lines"
        ],
        "screenshots": [],
        "sourceName": "HexGL",
        "sourceUrl": "https://hexgl.bkcore.com/",
        "licence": "MIT",
        "tags": [
            "racing",
            "retro",
            "open-source",
            "skill-based"
        ],
        "addedDate": "2026-07-01",
        "releaseDate": "2012",
        "featured": false
    },
    {
        "id": 5,
        "slug": "browserquest",
        "name": "BrowserQuest",
        "category": "simulation",
        "tagline": "A multiplayer top-down RPG that proved WebSockets could power an MMO.",
        "about": "BrowserQuest is a top-down multiplayer adventure RPG that Mozilla built to demonstrate what WebSockets and HTML5 could do together. You wander a tile-based fantasy world, fight rats and skeletons, collect loot, and chat with other real players who are online at the same time. It is small, charming, and historically important — when it shipped it was a clear proof that a browser tab could host a living multiplayer world.\n\nThe game itself is a breezy afternoon. There is a quest to defeat the boss deep in a dungeon, a handful of weapons and armor to upgrade through, and NPCs handing out hints. The real texture comes from the other players: you will see strangers wandering, fighting alongside you, or standing AFK in town. Many community-run servers still host the game, and the full source is on GitHub, which has made it a perennial starting point for anyone building browser multiplayer.",
        "howToPlay": "Move with WASD or the arrow keys. Click or press space to attack with your equipped weapon. Talk to NPCs by walking into them. The interface shows your health and inventory.\n\nStrategy: do not head straight for the dungeon. Upgrade your weapon and armor in town first by collecting gold from easier enemies near the spawn. Other players can help you in combat, so following a stronger character into the wilderness is a safe way to explore. Save your health potions for the boss room at the end of the main quest.",
        "keyFeatures": [
            "Real-time multiplayer in a browser tab via WebSockets",
            "Top-down Zelda-style fantasy adventure",
            "Community servers still active; full source on GitHub",
            "Foundational Mozilla HTML5 showcase"
        ],
        "screenshots": [],
        "sourceName": "BrowserQuest",
        "sourceUrl": "https://browserquest.mozilla.org/",
        "licence": "MPL-2.0",
        "tags": [
            "multiplayer",
            "retro",
            "classic",
            "open-source"
        ],
        "addedDate": "2026-07-01",
        "releaseDate": "2012",
        "featured": false
    },
    {
        "id": 6,
        "slug": "adarkroom",
        "name": "A Dark Room",
        "category": "simulation",
        "tagline": "A minimalist text adventure that hides an entire incremental empire.",
        "about": "A Dark Room opens with nothing: a cold room, a dying fire, and the single word \"stoke\". From that seed grows one of the most admired incremental games ever made. What starts as survival — keeping a fire lit, gathering wood — unfolds layer by layer into resource management, village building, exploration, and eventually a phase that few players see coming and fewer will spoil. The joy is in the unfolding.\n\nThe writing is restrained on purpose. Every line is short, every action a single verb. That minimalism is the trick: it lets your imagination fill the world, and it makes each new system feel like a genuine discovery rather than a tutorialized feature. The game is short enough to finish in a weekend but sticky enough to eat the whole weekend. Open-source and freely hosted by the original author, A Dark Room is the canonical example of how much depth a browser tab can hide behind a few words.",
        "howToPlay": "Click the actions that appear on screen — early on, just \"stoke fire\" and \"gather wood\". New actions unlock as your situation changes; you do not need to plan, only respond. The interface will introduce new resources, buildings and eventually maps as they become relevant.\n\nStrategy: avoid guides on a first playthrough — the unfolding is the game. Keep the fire lit. When you can gather wood, do it constantly. Let idle mechanics work: close the tab and come back to find resources accumulated. The mid-game shift is intentional; lean into whatever the game offers next rather than resisting it.",
        "keyFeatures": [
            "Minimalist text interface that unfolds into a deep incremental game",
            "Multiple phases — survival evolves into something unexpected",
            "Idle mechanics that reward returning",
            "Open-source, freely hosted by the original author"
        ],
        "screenshots": [],
        "sourceName": "A Dark Room",
        "sourceUrl": "https://adarkroom.doublespeakgames.com/",
        "licence": "proprietary",
        "tags": [
            "idle",
            "text-based",
            "minimal",
            "story-rich"
        ],
        "addedDate": "2026-07-01",
        "releaseDate": "2013",
        "featured": false
    },
    {
        "id": 7,
        "slug": "memorygame",
        "name": "memoryGame",
        "category": "puzzle",
        "tagline": "A 2025 js13kGames entry by Siddharth Prabhakar — under 13KB of pure craft.",
        "about": "memoryGame is a puzzle game by Siddharth Prabhakar, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for memoryGame to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Siddharth Prabhakar",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/memorygame",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "brain-burner",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 8,
        "slug": "ashes-of-ulthar",
        "name": "Ashes of Ulthar",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Elliot Nelson — under 13KB of pure craft.",
        "about": "Ashes of Ulthar is a arcade game by Elliot Nelson, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Ashes of Ulthar to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Elliot Nelson",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/ashes-of-ulthar",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 9,
        "slug": "kiki-s-cafe",
        "name": "Kiki's Cafe",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Daniel Bucci — under 13KB of pure craft.",
        "about": "Kiki's Cafe is a arcade game by Daniel Bucci, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Kiki's Cafe to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Daniel Bucci",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/kiki-s-cafe",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 10,
        "slug": "little-adventure-of-mr-cat",
        "name": "Little adventure of Mr Cat",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Arulyan Asokan — under 13KB of pure craft.",
        "about": "Little adventure of Mr Cat is a arcade game by Arulyan Asokan, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Little adventure of Mr Cat to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Arulyan Asokan",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/little-adventure-of-mr-cat",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 11,
        "slug": "shadowflame",
        "name": "ShadowFlame",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by quietchili — under 13KB of pure craft.",
        "about": "ShadowFlame is a arcade game by quietchili, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for ShadowFlame to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: quietchili",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/shadowflame",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 12,
        "slug": "non-mewtonian-cat",
        "name": "Non-Mewtonian Cat",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Mohammed Saud — under 13KB of pure craft.",
        "about": "Non-Mewtonian Cat is a arcade game by Mohammed Saud, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Non-Mewtonian Cat to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Mohammed Saud",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/non-mewtonian-cat",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 13,
        "slug": "pawker",
        "name": "PAWKER",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Marco Fernandes — under 13KB of pure craft.",
        "about": "PAWKER is a arcade game by Marco Fernandes, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for PAWKER to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Marco Fernandes",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/pawker",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 14,
        "slug": "nyx-felis-and-lampyris",
        "name": "Nyx Felis and Lampyris",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Afton Gauntlett — under 13KB of pure craft.",
        "about": "Nyx Felis and Lampyris is a arcade game by Afton Gauntlett, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Nyx Felis and Lampyris to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Afton Gauntlett",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/nyx-felis-and-lampyris",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 15,
        "slug": "laserpointer",
        "name": "Laserpointer",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by RatoGBM — under 13KB of pure craft.",
        "about": "Laserpointer is a arcade game by RatoGBM, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Laserpointer to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: RatoGBM",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/laserpointer",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 16,
        "slug": "tangled",
        "name": "Tangled",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Dalton Worsnup — under 13KB of pure craft.",
        "about": "Tangled is a arcade game by Dalton Worsnup, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Tangled to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Dalton Worsnup",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/tangled",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 17,
        "slug": "cry-in-the-13th",
        "name": "Cry in The 13th",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Diego Soria Rios — under 13KB of pure craft.",
        "about": "Cry in The 13th is a arcade game by Diego Soria Rios, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Cry in The 13th to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Diego Soria Rios",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/cry-in-the-13th",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 18,
        "slug": "the-13th-door",
        "name": "The 13th Door",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Lance Ewing — under 13KB of pure craft.",
        "about": "The 13th Door is a arcade game by Lance Ewing, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The 13th Door to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Lance Ewing",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/the-13th-door",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 19,
        "slug": "golfrog",
        "name": "GOLFROG",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by ckolin — under 13KB of pure craft.",
        "about": "GOLFROG is a arcade game by ckolin, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for GOLFROG to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: ckolin",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/golfrog",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 20,
        "slug": "6174",
        "name": "6174",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Sam Snowman — under 13KB of pure craft.",
        "about": "6174 is a arcade game by Sam Snowman, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 6174 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Sam Snowman",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/6174",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 21,
        "slug": "a-dogs-adventure",
        "name": "A Dogs Adventure",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Armaan Mohammed — under 13KB of pure craft.",
        "about": "A Dogs Adventure is a arcade game by Armaan Mohammed, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for A Dogs Adventure to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Armaan Mohammed",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/a-dogs-adventure.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/a-dogs-adventure",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 22,
        "slug": "age-of-the-demigods",
        "name": "Age of The Demigods",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Armaan Mohammed — under 13KB of pure craft.",
        "about": "Age of The Demigods is a arcade game by Armaan Mohammed, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Age of The Demigods to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Armaan Mohammed",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/age-of-the-demigods.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/age-of-the-demigods",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 23,
        "slug": "13c-defense",
        "name": "13C Defense",
        "category": "strategy",
        "tagline": "A 2023 js13kGames entry by Kang Jung Min — under 13KB of pure craft.",
        "about": "13C Defense is a strategy game by Kang Jung Min, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 13C Defense to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Kang Jung Min",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/13c-defense.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/13c-defense",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 24,
        "slug": "anachronic",
        "name": "Anachronic",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by 384.cz — under 13KB of pure craft.",
        "about": "Anachronic is a arcade game by 384.cz, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Anachronic to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: 384.cz",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/anachronic.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/anachronic",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 25,
        "slug": "khilji-s-folly",
        "name": "Khilji's Folly",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Sayem Shafayet and Shuhan Mirza — under 13KB of pure craft.",
        "about": "Khilji's Folly is a arcade game by Sayem Shafayet and Shuhan Mirza, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Khilji's Folly to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Sayem Shafayet and Shuhan Mirza",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/khilji-s-folly",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 26,
        "slug": "trado-polo-explores",
        "name": "Trado Polo explores",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Gabor Héja — under 13KB of pure craft.",
        "about": "Trado Polo explores is a arcade game by Gabor Héja, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Trado Polo explores to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Gabor Héja",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/trado-polo-explores.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/trado-polo-explores",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 27,
        "slug": "fort-dmin",
        "name": "Fort@dmin",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by ch1p2 — under 13KB of pure craft.",
        "about": "Fort@dmin is a arcade game by ch1p2, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Fort@dmin to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: ch1p2",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/fort-dmin",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 28,
        "slug": "defense-of-the-13th-city",
        "name": "Defense of the 13th City",
        "category": "strategy",
        "tagline": "A 2023 js13kGames entry by Kimbatt — under 13KB of pure craft.",
        "about": "Defense of the 13th City is a strategy game by Kimbatt, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Defense of the 13th City to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Kimbatt",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/defense-of-the-13th-city.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/defense-of-the-13th-city",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 29,
        "slug": "last-viking",
        "name": "Last Viking",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Sacer — under 13KB of pure craft.",
        "about": "Last Viking is a arcade game by Sacer, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Last Viking to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Sacer",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/last-viking.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/last-viking",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 30,
        "slug": "escape-from-death-hole",
        "name": "Escape from Death Hole",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Santi Herranz — under 13KB of pure craft.",
        "about": "Escape from Death Hole is a arcade game by Santi Herranz, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Escape from Death Hole to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Santi Herranz",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/escape-from-death-hole.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/escape-from-death-hole",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 31,
        "slug": "van-helsing",
        "name": "Van Helsing",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Jan Krupiński — under 13KB of pure craft.",
        "about": "Van Helsing is a arcade game by Jan Krupiński, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Van Helsing to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Jan Krupiński",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/van-helsing.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/van-helsing",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 32,
        "slug": "capturing-souls-on-the-river-of-the-dead",
        "name": "Capturing Souls on the River of The Dead",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by nes — under 13KB of pure craft.",
        "about": "Capturing Souls on the River of The Dead is a arcade game by nes, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Capturing Souls on the River of The Dead to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: nes",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/capturing-souls-on-the-river-of-the-dead.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/capturing-souls-on-the-river-of-the-dead",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 33,
        "slug": "there-can-be-only-death",
        "name": "There Can Be Only Death",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Matthew Diamant — under 13KB of pure craft.",
        "about": "There Can Be Only Death is a arcade game by Matthew Diamant, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for There Can Be Only Death to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Matthew Diamant",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/there-can-be-only-death.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/there-can-be-only-death",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 34,
        "slug": "deadly-echo",
        "name": "Deadly Echo",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Almut Kieffer-Jones — under 13KB of pure craft.",
        "about": "Deadly Echo is a arcade game by Almut Kieffer-Jones, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Deadly Echo to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Almut Kieffer-Jones",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/deadly-echo.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/deadly-echo",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 35,
        "slug": "wasteworld",
        "name": "WasteWorld",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Olivér Sepsik — under 13KB of pure craft.",
        "about": "WasteWorld is a arcade game by Olivér Sepsik, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for WasteWorld to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Olivér Sepsik",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/wasteworld.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/wasteworld",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 36,
        "slug": "necromancer-s-dungeon",
        "name": "Necromancer's Dungeon",
        "category": "strategy",
        "tagline": "A 2022 js13kGames entry by svntax — under 13KB of pure craft.",
        "about": "Necromancer's Dungeon is a strategy game by svntax, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Necromancer's Dungeon to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: svntax",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/necromancer-s-dungeon",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 37,
        "slug": "feb-13th-death-s-day-off",
        "name": "Feb 13th: Death's Day Off",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by FiveEsses — under 13KB of pure craft.",
        "about": "Feb 13th: Death's Day Off is a arcade game by FiveEsses, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Feb 13th: Death's Day Off to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: FiveEsses",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/feb-13th-death-s-day-off",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 38,
        "slug": "galaxy-raid",
        "name": "Galaxy Raid",
        "category": "action",
        "tagline": "A 2021 js13kGames entry by Josep del Rio — under 13KB of pure craft.",
        "about": "Galaxy Raid is a action game by Josep del Rio, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Galaxy Raid to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Josep del Rio",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/galaxy-raid.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/galaxy-raid",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 39,
        "slug": "shadow-of-the-keening-star",
        "name": "Shadow of the Keening Star",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Elliot Nelson — under 13KB of pure craft.",
        "about": "Shadow of the Keening Star is a arcade game by Elliot Nelson, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Shadow of the Keening Star to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Elliot Nelson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/shadow-of-the-keening-star.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/shadow-of-the-keening-star",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 40,
        "slug": "space-janitor",
        "name": "Space Janitor",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Joseph Stone — under 13KB of pure craft.",
        "about": "Space Janitor is a arcade game by Joseph Stone, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space Janitor to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Joseph Stone",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-janitor.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-janitor",
        "licence": "NOASSERTION",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 41,
        "slug": "invasion-from-jupiter-in-space",
        "name": "Invasion from Jupiter in Space",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Brian Hambley — under 13KB of pure craft.",
        "about": "Invasion from Jupiter in Space is a arcade game by Brian Hambley, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Invasion from Jupiter in Space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Brian Hambley",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/invasion-from-jupiter-in-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/invasion-from-jupiter-in-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 42,
        "slug": "playing-only-space-key",
        "name": "playing only \"space\" key",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Moon Scarlet — under 13KB of pure craft.",
        "about": "playing only \"space\" key is a arcade game by Moon Scarlet, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for playing only \"space\" key to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Moon Scarlet",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/playing-only-space-key.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/playing-only-space-key",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 43,
        "slug": "keep-white-space",
        "name": "Keep white space!!",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Hiroshi Okazaki — under 13KB of pure craft.",
        "about": "Keep white space!! is a arcade game by Hiroshi Okazaki, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Keep white space!! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Hiroshi Okazaki",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/keep-white-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/keep-white-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 44,
        "slug": "spaceship-wars-13k",
        "name": "Spaceship Wars 13k",
        "category": "action",
        "tagline": "A 2021 js13kGames entry by Giovanny Beltrán — under 13KB of pure craft.",
        "about": "Spaceship Wars 13k is a action game by Giovanny Beltrán, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Spaceship Wars 13k to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Giovanny Beltrán",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/spaceship-wars-13k.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/spaceship-wars-13k",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 45,
        "slug": "floating",
        "name": "Floating",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Ayoade David — under 13KB of pure craft.",
        "about": "Floating is a arcade game by Ayoade David, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Floating to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Ayoade David",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/floating.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/floating",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 46,
        "slug": "the-last-space-bender",
        "name": "The Last Space Bender",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by R3nceee — under 13KB of pure craft.",
        "about": "The Last Space Bender is a arcade game by R3nceee, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Last Space Bender to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: R3nceee",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-last-space-bender.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/the-last-space-bender",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 47,
        "slug": "spaceship-13k",
        "name": "SpaceShip 13k",
        "category": "action",
        "tagline": "A 2021 js13kGames entry by Renato Ikeuchi — under 13KB of pure craft.",
        "about": "SpaceShip 13k is a action game by Renato Ikeuchi, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for SpaceShip 13k to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Renato Ikeuchi",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/spaceship-13k.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/spaceship-13k",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 48,
        "slug": "rocket-cargo",
        "name": "Rocket Cargo",
        "category": "action",
        "tagline": "A 2021 js13kGames entry by Santi Herranz — under 13KB of pure craft.",
        "about": "Rocket Cargo is a action game by Santi Herranz, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Rocket Cargo to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Santi Herranz",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/rocket-cargo.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/rocket-cargo",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 49,
        "slug": "world-of-emojis",
        "name": "World of Emojis",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Curtis Robinson — under 13KB of pure craft.",
        "about": "World of Emojis is a arcade game by Curtis Robinson, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for World of Emojis to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Curtis Robinson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/world-of-emojis.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/world-of-emojis",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 50,
        "slug": "lunar-pods",
        "name": "Lunar Pods",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Eric Ros — under 13KB of pure craft.",
        "about": "Lunar Pods is a arcade game by Eric Ros, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Lunar Pods to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Eric Ros",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/lunar-pods.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/lunar-pods",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 51,
        "slug": "death-game",
        "name": "Death Game",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Luke Cann — under 13KB of pure craft.",
        "about": "Death Game is a arcade game by Luke Cann, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Death Game to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Luke Cann",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/death-game.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/death-game",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 52,
        "slug": "death-scythe",
        "name": "Death Scythe",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Kang Jung Min — under 13KB of pure craft.",
        "about": "Death Scythe is a arcade game by Kang Jung Min, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Death Scythe to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Kang Jung Min",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/death-scythe.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/death-scythe",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 53,
        "slug": "burning-the-plants",
        "name": "Burning the plants",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Crystal Parker — under 13KB of pure craft.",
        "about": "Burning the plants is a arcade game by Crystal Parker, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Burning the plants to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Crystal Parker",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/burning-the-plants.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/burning-the-plants",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 54,
        "slug": "death13k",
        "name": "Death13k",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by agentultra — under 13KB of pure craft.",
        "about": "Death13k is a arcade game by agentultra, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Death13k to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: agentultra",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/death13k.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/death13k",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 55,
        "slug": "interplanetary-transport-system",
        "name": "Interplanetary Transport System",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Meidor — under 13KB of pure craft.",
        "about": "Interplanetary Transport System is a arcade game by Meidor, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Interplanetary Transport System to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Meidor",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/interplanetary-transport-system.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/interplanetary-transport-system",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 56,
        "slug": "spatial-poker",
        "name": "Spatial Poker",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by David Sides — under 13KB of pure craft.",
        "about": "Spatial Poker is a arcade game by David Sides, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Spatial Poker to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: David Sides",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/spatial-poker.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/spatial-poker",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 57,
        "slug": "spaces-in-space",
        "name": "Spaces in space",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Mik39sch — under 13KB of pure craft.",
        "about": "Spaces in space is a arcade game by Mik39sch, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Spaces in space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Mik39sch",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/spaces-in-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/spaces-in-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 58,
        "slug": "that-time-i-tried-running-away-from-space",
        "name": "That time I tried running away from space",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Daivan Trinh — under 13KB of pure craft.",
        "about": "That time I tried running away from space is a arcade game by Daivan Trinh, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for That time I tried running away from space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Daivan Trinh",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/that-time-i-tried-running-away-from-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/that-time-i-tried-running-away-from-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 59,
        "slug": "spectral-shooter",
        "name": "Spectral-Shooter",
        "category": "action",
        "tagline": "A 2022 js13kGames entry by Dickson Chui — under 13KB of pure craft.",
        "about": "Spectral-Shooter is a action game by Dickson Chui, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Spectral-Shooter to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Dickson Chui",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/spectral-shooter.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/spectral-shooter",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 60,
        "slug": "astronaut-in-trouble",
        "name": "Astronaut in Trouble",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Douglas Lopes — under 13KB of pure craft.",
        "about": "Astronaut in Trouble is a arcade game by Douglas Lopes, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Astronaut in Trouble to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Douglas Lopes",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/astronaut-in-trouble.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/astronaut-in-trouble",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 61,
        "slug": "f-stop",
        "name": "F-Stop",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Nick Shillingford — under 13KB of pure craft.",
        "about": "F-Stop is a arcade game by Nick Shillingford, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for F-Stop to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Nick Shillingford",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/f-stop",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 62,
        "slug": "catnfish",
        "name": "CatNFish",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by smhaaker — under 13KB of pure craft.",
        "about": "CatNFish is a arcade game by smhaaker, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for CatNFish to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: smhaaker",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/catnfish",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 63,
        "slug": "enchilada-s-day-off",
        "name": "Enchilada's Day Off",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Abby and Twitch Chat — under 13KB of pure craft.",
        "about": "Enchilada's Day Off is a arcade game by Abby and Twitch Chat, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Enchilada's Day Off to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Abby and Twitch Chat",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/enchilada-s-day-off",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 64,
        "slug": "bounty-islands",
        "name": "Bounty Islands",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by  Evgeniy Pavlov — under 13KB of pure craft.",
        "about": "Bounty Islands is a arcade game by  Evgeniy Pavlov, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Bounty Islands to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author:  Evgeniy Pavlov",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/bounty-islands",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 65,
        "slug": "the-tridecomino-coral-reef",
        "name": "The Tridecomino Coral Reef",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Quinten Clause — under 13KB of pure craft.",
        "about": "The Tridecomino Coral Reef is a arcade game by Quinten Clause, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Tridecomino Coral Reef to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Quinten Clause",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/the-tridecomino-coral-reef",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 66,
        "slug": "m13e",
        "name": "M13E",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by AndreiO — under 13KB of pure craft.",
        "about": "M13E is a arcade game by AndreiO, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for M13E to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: AndreiO",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/m13e",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 67,
        "slug": "dungeon-of-curse",
        "name": "Dungeon Of Curse",
        "category": "strategy",
        "tagline": "A 2024 js13kGames entry by Himanshu Bisht — under 13KB of pure craft.",
        "about": "Dungeon Of Curse is a strategy game by Himanshu Bisht, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dungeon Of Curse to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Himanshu Bisht",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/dungeon-of-curse",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 68,
        "slug": "maze-runner-vs-13",
        "name": "Maze Runner vs 13",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Mohammad Jawad — under 13KB of pure craft.",
        "about": "Maze Runner vs 13 is a arcade game by Mohammad Jawad, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Maze Runner vs 13 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Mohammad Jawad",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/maze-runner-vs-13",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 69,
        "slug": "plusminus13",
        "name": "plusminus13",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Jure Triglav — under 13KB of pure craft.",
        "about": "plusminus13 is a arcade game by Jure Triglav, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for plusminus13 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Jure Triglav",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/plusminus13",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 70,
        "slug": "13-squared",
        "name": "13 Squared",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Thomas Brown — under 13KB of pure craft.",
        "about": "13 Squared is a arcade game by Thomas Brown, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 13 Squared to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Thomas Brown",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/13-squared",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 71,
        "slug": "the-sixth-prime",
        "name": "The Sixth Prime",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Zachary Rankin, David Fagan et al — under 13KB of pure craft.",
        "about": "The Sixth Prime is a arcade game by Zachary Rankin, David Fagan et al, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Sixth Prime to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Zachary Rankin, David Fagan et al",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/the-sixth-prime",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 72,
        "slug": "the-city-without-that-number",
        "name": "The City Without That Number",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by 4onen — under 13KB of pure craft.",
        "about": "The City Without That Number is a arcade game by 4onen, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The City Without That Number to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: 4onen",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/the-city-without-that-number",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 73,
        "slug": "dont-step-on-thirteen",
        "name": "Dont step on thirteen",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Daivan Trinh and Håkan Einarsson — under 13KB of pure craft.",
        "about": "Dont step on thirteen is a arcade game by Daivan Trinh and Håkan Einarsson, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dont step on thirteen to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Daivan Trinh and Håkan Einarsson",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/dont-step-on-thirteen",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 74,
        "slug": "king-longlegs",
        "name": "King LongLegs",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Tom Copeland and Steven — under 13KB of pure craft.",
        "about": "King LongLegs is a arcade game by Tom Copeland and Steven, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for King LongLegs to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Tom Copeland and Steven",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/king-longlegs",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 75,
        "slug": "2048-13",
        "name": "2048 / 13",
        "category": "puzzle",
        "tagline": "A 2024 js13kGames entry by Siorki — under 13KB of pure craft.",
        "about": "2048 / 13 is a puzzle game by Siorki, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 2048 / 13 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Siorki",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/2048-13",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "brain-burner",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 76,
        "slug": "witch-hunter",
        "name": "Witch Hunter",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Burián Sándor — under 13KB of pure craft.",
        "about": "Witch Hunter is a arcade game by Burián Sándor, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Witch Hunter to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Burián Sándor",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/witch-hunter",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 77,
        "slug": "one-guard",
        "name": "One Guard",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Alpine Games — under 13KB of pure craft.",
        "about": "One Guard is a arcade game by Alpine Games, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for One Guard to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Alpine Games",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/one-guard.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/one-guard",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "minimal"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 78,
        "slug": "sir-bruno-s-minnelied",
        "name": "Sir Bruno’s Minnelied",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Michael M. — under 13KB of pure craft.",
        "about": "Sir Bruno’s Minnelied is a arcade game by Michael M., submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Sir Bruno’s Minnelied to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Michael M.",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/sir-bruno-s-minnelied",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 79,
        "slug": "the-knighting-of-sr-isaac",
        "name": "The Knighting of Sr Isaac",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Igor Estêvão — under 13KB of pure craft.",
        "about": "The Knighting of Sr Isaac is a arcade game by Igor Estêvão, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Knighting of Sr Isaac to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Igor Estêvão",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-knighting-of-sr-isaac.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/the-knighting-of-sr-isaac",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 80,
        "slug": "death-sea-xiii",
        "name": "Death Sea XIII",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Misael Braga — under 13KB of pure craft.",
        "about": "Death Sea XIII is a arcade game by Misael Braga, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Death Sea XIII to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Misael Braga",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/death-sea-xiii.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/death-sea-xiii",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 81,
        "slug": "when-your-neighbors-are-mongols",
        "name": "When Your Neighbors Are Mongols",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Cliff Earl — under 13KB of pure craft.",
        "about": "When Your Neighbors Are Mongols is a arcade game by Cliff Earl, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for When Your Neighbors Are Mongols to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Cliff Earl",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/when-your-neighbors-are-mongols.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/when-your-neighbors-are-mongols",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 82,
        "slug": "portolani",
        "name": "Portolani",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Ethan Smith — under 13KB of pure craft.",
        "about": "Portolani is a arcade game by Ethan Smith, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Portolani to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Ethan Smith",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/portolani.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/portolani",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 83,
        "slug": "knight",
        "name": "Knight",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Marvin and Mandy — under 13KB of pure craft.",
        "about": "Knight is a arcade game by Marvin and Mandy, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Knight to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Marvin and Mandy",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/knight.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/knight",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 84,
        "slug": "sails",
        "name": "Sails!",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Feenposhleen — under 13KB of pure craft.",
        "about": "Sails! is a arcade game by Feenposhleen, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Sails! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Feenposhleen",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/sails.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/sails",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 85,
        "slug": "castle-wars",
        "name": "Castle wars",
        "category": "strategy",
        "tagline": "A 2023 js13kGames entry by Mefistofel — under 13KB of pure craft.",
        "about": "Castle wars is a strategy game by Mefistofel, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Castle wars to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Mefistofel",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/castle-wars.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/castle-wars",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 86,
        "slug": "snakes-and-ladders",
        "name": "Snakes and Ladders",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Nick Watton — under 13KB of pure craft.",
        "about": "Snakes and Ladders is a arcade game by Nick Watton, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Snakes and Ladders to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Nick Watton",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/snakes-and-ladders.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/snakes-and-ladders",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 87,
        "slug": "rise",
        "name": "Rise!",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Feenposhleen — under 13KB of pure craft.",
        "about": "Rise! is a arcade game by Feenposhleen, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Rise! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Feenposhleen",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/rise.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/rise",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 88,
        "slug": "seating-space-planner",
        "name": "Seating Space Planner",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Tiago Correia — under 13KB of pure craft.",
        "about": "Seating Space Planner is a arcade game by Tiago Correia, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Seating Space Planner to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Tiago Correia",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/seating-space-planner.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/seating-space-planner",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 89,
        "slug": "charming-rainbow-rabbit",
        "name": "Charming Rainbow Rabbit",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Antoine Dricot — under 13KB of pure craft.",
        "about": "Charming Rainbow Rabbit is a arcade game by Antoine Dricot, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Charming Rainbow Rabbit to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Antoine Dricot",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/charming-rainbow-rabbit.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/charming-rainbow-rabbit",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 90,
        "slug": "barry-in-space",
        "name": "Barry In Space",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Marco Fernandes — under 13KB of pure craft.",
        "about": "Barry In Space is a arcade game by Marco Fernandes, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Barry In Space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Marco Fernandes",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/barry-in-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/barry-in-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 91,
        "slug": "space-arcade",
        "name": "Space Arcade",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Gleb Volkov — under 13KB of pure craft.",
        "about": "Space Arcade is a arcade game by Gleb Volkov, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space Arcade to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Gleb Volkov",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-arcade.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-arcade",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 92,
        "slug": "emojiphobia",
        "name": "EMOJIPHOBIA",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by xem — under 13KB of pure craft.",
        "about": "EMOJIPHOBIA is a arcade game by xem, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for EMOJIPHOBIA to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: xem",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/emojiphobia",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 93,
        "slug": "wendol-village",
        "name": "Wendol Village",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Jonas Olmstead — under 13KB of pure craft.",
        "about": "Wendol Village is a arcade game by Jonas Olmstead, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Wendol Village to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Jonas Olmstead",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/wendol-village",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 94,
        "slug": "cube-13",
        "name": "cube 13",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Clark Kent — under 13KB of pure craft.",
        "about": "cube 13 is a arcade game by Clark Kent, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for cube 13 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Clark Kent",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/cube-13",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 95,
        "slug": "escape-13th-floor-dungeon",
        "name": "Escape 13th floor dungeon",
        "category": "strategy",
        "tagline": "A 2024 js13kGames entry by Slava — under 13KB of pure craft.",
        "about": "Escape 13th floor dungeon is a strategy game by Slava, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Escape 13th floor dungeon to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Slava",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/escape-13th-floor-dungeon",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 96,
        "slug": "dragon-simulator",
        "name": "Dragon Simulator",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Chris Glover — under 13KB of pure craft.",
        "about": "Dragon Simulator is a arcade game by Chris Glover, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dragon Simulator to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Chris Glover",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/dragon-simulator.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/dragon-simulator",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 97,
        "slug": "tendergotchi",
        "name": "TenderGotchi",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Santiago Zapata — under 13KB of pure craft.",
        "about": "TenderGotchi is a arcade game by Santiago Zapata, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for TenderGotchi to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Santiago Zapata",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/tendergotchi.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/tendergotchi",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 98,
        "slug": "the-deadly-obstacle-course",
        "name": "The Deadly Obstacle Course",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Kimbatt — under 13KB of pure craft.",
        "about": "The Deadly Obstacle Course is a arcade game by Kimbatt, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Deadly Obstacle Course to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Kimbatt",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-deadly-obstacle-course.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/the-deadly-obstacle-course",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 99,
        "slug": "high-treason",
        "name": "High Treason",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Moshood — under 13KB of pure craft.",
        "about": "High Treason is a arcade game by Moshood, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for High Treason to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Moshood",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/high-treason.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/high-treason",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 100,
        "slug": "cryonics-inc",
        "name": "Cryonics Inc",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Mohammed Saud — under 13KB of pure craft.",
        "about": "Cryonics Inc is a arcade game by Mohammed Saud, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Cryonics Inc to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Mohammed Saud",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/cryonics-inc.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/cryonics-inc",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 101,
        "slug": "beat-rocks",
        "name": "Beat Rocks",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Tomasz Wesołowski — under 13KB of pure craft.",
        "about": "Beat Rocks is a arcade game by Tomasz Wesołowski, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Beat Rocks to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Tomasz Wesołowski",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/beat-rocks.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/beat-rocks",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 102,
        "slug": "qress-sqace",
        "name": "qress sqace",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Tomáš Nesrovnal — under 13KB of pure craft.",
        "about": "qress sqace is a arcade game by Tomáš Nesrovnal, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for qress sqace to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Tomáš Nesrovnal",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/qress-sqace.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/qress-sqace",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 103,
        "slug": "immunity-collapse",
        "name": "Immunity collapse",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Brégeau — under 13KB of pure craft.",
        "about": "Immunity collapse is a arcade game by Brégeau, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Immunity collapse to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Brégeau",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/immunity-collapse.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/immunity-collapse",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 104,
        "slug": "celestial-lighthouse",
        "name": "Celestial Lighthouse",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Tom Hermans — under 13KB of pure craft.",
        "about": "Celestial Lighthouse is a arcade game by Tom Hermans, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Celestial Lighthouse to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Tom Hermans",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/celestial-lighthouse.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/celestial-lighthouse",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 105,
        "slug": "i-need-my-space",
        "name": "I Need My Space!",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Polly — under 13KB of pure craft.",
        "about": "I Need My Space! is a arcade game by Polly, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for I Need My Space! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Polly",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/i-need-my-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/i-need-my-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 106,
        "slug": "triangle-man-escape",
        "name": "Triangle Man: Escape",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Viktor Uhryn — under 13KB of pure craft.",
        "about": "Triangle Man: Escape is a arcade game by Viktor Uhryn, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Triangle Man: Escape to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Viktor Uhryn",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/triangle-man-escape.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/triangle-man-escape",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 107,
        "slug": "friend-of-the-fallen",
        "name": "Friend of the Fallen",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Bihenaso Games — under 13KB of pure craft.",
        "about": "Friend of the Fallen is a arcade game by Bihenaso Games, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Friend of the Fallen to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Bihenaso Games",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/friend-of-the-fallen.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/friend-of-the-fallen",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 108,
        "slug": "backsteroid",
        "name": "Backsteroid",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Alexander Dunin — under 13KB of pure craft.",
        "about": "Backsteroid is a arcade game by Alexander Dunin, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Backsteroid to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Alexander Dunin",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backsteroid.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backsteroid",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 109,
        "slug": "backshooter",
        "name": "Backshooter",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Emre Guneyler — under 13KB of pure craft.",
        "about": "Backshooter is a arcade game by Emre Guneyler, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Backshooter to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Emre Guneyler",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backshooter.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backshooter",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 110,
        "slug": "can-t-get-back",
        "name": "Can't Get Back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Scxry Humxn — under 13KB of pure craft.",
        "about": "Can't Get Back is a arcade game by Scxry Humxn, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Can't Get Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Scxry Humxn",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/can-t-get-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 111,
        "slug": "bring-the-number-back",
        "name": "Bring The Number Back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Sergey Chernykh — under 13KB of pure craft.",
        "about": "Bring The Number Back is a arcade game by Sergey Chernykh, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Bring The Number Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Sergey Chernykh",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/bring-the-number-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/bring-the-number-back",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 112,
        "slug": "backflipped",
        "name": "BackFlipped",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Tom Hermans — under 13KB of pure craft.",
        "about": "BackFlipped is a arcade game by Tom Hermans, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for BackFlipped to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Tom Hermans",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backflipped.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backflipped",
        "licence": "NOASSERTION",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 113,
        "slug": "back-to-space",
        "name": "Back to Space",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Sorskoot — under 13KB of pure craft.",
        "about": "Back to Space is a arcade game by Sorskoot, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back to Space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Sorskoot",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-to-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-to-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 114,
        "slug": "gravepassing",
        "name": "Gravepassing",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Kacper Kula — under 13KB of pure craft.",
        "about": "Gravepassing is a arcade game by Kacper Kula, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Gravepassing to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Kacper Kula",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/gravepassing.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/gravepassing",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 115,
        "slug": "back-to-skull-island",
        "name": "Back to Skull Island",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Amy Frieson and Steven Frieson — under 13KB of pure craft.",
        "about": "Back to Skull Island is a arcade game by Amy Frieson and Steven Frieson, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back to Skull Island to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Amy Frieson and Steven Frieson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-to-skull-island.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-to-skull-island",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 116,
        "slug": "awkward-turtle",
        "name": "Awkward Turtle",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Andrew Core and Diana — under 13KB of pure craft.",
        "about": "Awkward Turtle is a arcade game by Andrew Core and Diana, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Awkward Turtle to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Andrew Core and Diana",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/awkward-turtle.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/awkward-turtle",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 117,
        "slug": "death-march",
        "name": "Death March",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Jorge Rubiano — under 13KB of pure craft.",
        "about": "Death March is a arcade game by Jorge Rubiano, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Death March to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Jorge Rubiano",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/death-march.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/death-march",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 118,
        "slug": "deadly-taxi-the-road-of-death",
        "name": "Deadly Taxi - The Road of Death",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by ch3at_c0d3z — under 13KB of pure craft.",
        "about": "Deadly Taxi - The Road of Death is a arcade game by ch3at_c0d3z, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Deadly Taxi - The Road of Death to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: ch3at_c0d3z",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/deadly-taxi-the-road-of-death.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/deadly-taxi-the-road-of-death",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 119,
        "slug": "information-super-highway-404",
        "name": "Information Super Highway 404",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by inlbe — under 13KB of pure craft.",
        "about": "Information Super Highway 404 is a arcade game by inlbe, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Information Super Highway 404 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: inlbe",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/information-super-highway-404.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/information-super-highway-404",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 120,
        "slug": "coiner",
        "name": "Coiner",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Hoai Phong — under 13KB of pure craft.",
        "about": "Coiner is a arcade game by Hoai Phong, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Coiner to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Hoai Phong",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/coiner.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/coiner",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 121,
        "slug": "10-years-of-game-golfing",
        "name": "10 years of game golfing",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by xem — under 13KB of pure craft.",
        "about": "10 years of game golfing is a arcade game by xem, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 10 years of game golfing to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: xem",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/10-years-of-game-golfing.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/10-years-of-game-golfing",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 122,
        "slug": "mavi",
        "name": "Mavi",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Emre Guneyler — under 13KB of pure craft.",
        "about": "Mavi is a arcade game by Emre Guneyler, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Mavi to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Emre Guneyler",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/mavi.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/mavi",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 123,
        "slug": "idle-necromancer",
        "name": "Idle Necromancer",
        "category": "simulation",
        "tagline": "A 2022 js13kGames entry by Paweł Jamróz 'CutFuyi' — under 13KB of pure craft.",
        "about": "Idle Necromancer is a simulation game by Paweł Jamróz 'CutFuyi', submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Idle Necromancer to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Paweł Jamróz 'CutFuyi'",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/idle-necromancer.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/idle-necromancer",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "sandbox",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 124,
        "slug": "the-hidden-death",
        "name": "the-hidden-death",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by jarvispact — under 13KB of pure craft.",
        "about": "the-hidden-death is a arcade game by jarvispact, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for the-hidden-death to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: jarvispact",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-hidden-death.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/the-hidden-death",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 125,
        "slug": "don-t-die-to-ghosts",
        "name": "Don't Die To Ghosts",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Cliff Earl — under 13KB of pure craft.",
        "about": "Don't Die To Ghosts is a arcade game by Cliff Earl, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Don't Die To Ghosts to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Cliff Earl",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/don-t-die-to-ghosts",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 126,
        "slug": "bird-commander-2",
        "name": "Bird Commander 2",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Matt McKenna — under 13KB of pure craft.",
        "about": "Bird Commander 2 is a arcade game by Matt McKenna, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Bird Commander 2 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Matt McKenna",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/bird-commander-2.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/bird-commander-2",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 127,
        "slug": "hel-s-trial",
        "name": "Hel's Trial",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Sebastian Dorn — under 13KB of pure craft.",
        "about": "Hel's Trial is a arcade game by Sebastian Dorn, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Hel's Trial to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Sebastian Dorn",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/hel-s-trial",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 128,
        "slug": "cooking-for-skully",
        "name": "Cooking for Skully",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Gabor Héja — under 13KB of pure craft.",
        "about": "Cooking for Skully is a arcade game by Gabor Héja, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Cooking for Skully to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Gabor Héja",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/cooking-for-skully.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/cooking-for-skully",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 129,
        "slug": "starlink-13kb-game",
        "name": "Starlink 13kb Game",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Will Gittens — under 13KB of pure craft.",
        "about": "Starlink 13kb Game is a arcade game by Will Gittens, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Starlink 13kb Game to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Will Gittens",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/starlink-13kb-game.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/starlink-13kb-game",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 130,
        "slug": "lost-in-the-distance",
        "name": "Lost in the Distance",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Ethan Chung — under 13KB of pure craft.",
        "about": "Lost in the Distance is a arcade game by Ethan Chung, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Lost in the Distance to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Ethan Chung",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/lost-in-the-distance.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/lost-in-the-distance",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 131,
        "slug": "shooty-ship-13k",
        "name": "Shooty Ship 13k",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Jon Wire — under 13KB of pure craft.",
        "about": "Shooty Ship 13k is a arcade game by Jon Wire, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Shooty Ship 13k to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Jon Wire",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/shooty-ship-13k.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/shooty-ship-13k",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 132,
        "slug": "space-invasion-simulator",
        "name": "Space Invasion Simulator",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Crystal Parker — under 13KB of pure craft.",
        "about": "Space Invasion Simulator is a arcade game by Crystal Parker, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space Invasion Simulator to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Crystal Parker",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-invasion-simulator.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-invasion-simulator",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 133,
        "slug": "refuel-the-factory",
        "name": "Refuel The Factory",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by jamWithJS — under 13KB of pure craft.",
        "about": "Refuel The Factory is a arcade game by jamWithJS, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Refuel The Factory to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: jamWithJS",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/refuel-the-factory.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/refuel-the-factory",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 134,
        "slug": "space-playful-adventures-of-cat-emojis",
        "name": "SPACE: Playful Adventures of Cat Emojis",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Almut Kieffer-Jones — under 13KB of pure craft.",
        "about": "SPACE: Playful Adventures of Cat Emojis is a arcade game by Almut Kieffer-Jones, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for SPACE: Playful Adventures of Cat Emojis to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Almut Kieffer-Jones",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-playful-adventures-of-cat-emojis.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-playful-adventures-of-cat-emojis",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 135,
        "slug": "blinker",
        "name": "Blinker",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Jose Barrientos — under 13KB of pure craft.",
        "about": "Blinker is a arcade game by Jose Barrientos, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Blinker to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Jose Barrientos",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/blinker.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/blinker",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 136,
        "slug": "running-out-of-space",
        "name": "Running out of space",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Nicklas Löf — under 13KB of pure craft.",
        "about": "Running out of space is a arcade game by Nicklas Löf, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Running out of space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Nicklas Löf",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/running-out-of-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/running-out-of-space",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 137,
        "slug": "space-block-invaders",
        "name": "Space block invaders",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Nicklas Löf — under 13KB of pure craft.",
        "about": "Space block invaders is a arcade game by Nicklas Löf, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space block invaders to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Nicklas Löf",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-block-invaders.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-block-invaders",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 138,
        "slug": "lossst-a-snake-in-space",
        "name": "LOSSST - a Snake in Space",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by xem and Anders Kaare — under 13KB of pure craft.",
        "about": "LOSSST - a Snake in Space is a arcade game by xem and Anders Kaare, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for LOSSST - a Snake in Space to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: xem and Anders Kaare",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/lossst-a-snake-in-space.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/lossst-a-snake-in-space",
        "licence": "NOASSERTION",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 139,
        "slug": "space-game",
        "name": "Space Game",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Lakshman — under 13KB of pure craft.",
        "about": "Space Game is a arcade game by Lakshman, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space Game to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Lakshman",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-game.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-game",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 140,
        "slug": "join-the-cubes",
        "name": "Join the cubes",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by FoggyMist — under 13KB of pure craft.",
        "about": "Join the cubes is a arcade game by FoggyMist, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Join the cubes to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: FoggyMist",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/join-the-cubes.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/join-the-cubes",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 141,
        "slug": "space-capture",
        "name": "space capture",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by m-nakasato — under 13KB of pure craft.",
        "about": "space capture is a arcade game by m-nakasato, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for space capture to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: m-nakasato",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-capture.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-capture",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 142,
        "slug": "2021-a-space-opera",
        "name": "2021: a Space Opera",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Jerome Lecomte — under 13KB of pure craft.",
        "about": "2021: a Space Opera is a arcade game by Jerome Lecomte, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 2021: a Space Opera to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Jerome Lecomte",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/2021-a-space-opera.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/2021-a-space-opera",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 143,
        "slug": "the-galactic-asteroid-cleanup-mission",
        "name": "The Galactic Asteroid Cleanup Mission",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Micheal Parks — under 13KB of pure craft.",
        "about": "The Galactic Asteroid Cleanup Mission is a arcade game by Micheal Parks, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Galactic Asteroid Cleanup Mission to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Micheal Parks",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-galactic-asteroid-cleanup-mission.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/the-galactic-asteroid-cleanup-mission",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 144,
        "slug": "filepurge",
        "name": "Filepurge",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Pedro André — under 13KB of pure craft.",
        "about": "Filepurge is a arcade game by Pedro André, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Filepurge to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Pedro André",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/filepurge.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/filepurge",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 145,
        "slug": "srtfyl-shoot-rectangles-to-find-your-loot",
        "name": "SRTFYL - Shoot rectangles to find your loot",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Flo — under 13KB of pure craft.",
        "about": "SRTFYL - Shoot rectangles to find your loot is a arcade game by Flo, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for SRTFYL - Shoot rectangles to find your loot to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Flo",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/srtfyl-shoot-rectangles-to-find-your-loot.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/srtfyl-shoot-rectangles-to-find-your-loot",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 146,
        "slug": "in-ascent",
        "name": "in ASCENT",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Noncho Savov — under 13KB of pure craft.",
        "about": "in ASCENT is a arcade game by Noncho Savov, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for in ASCENT to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Noncho Savov",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/in-ascent.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/in-ascent",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 147,
        "slug": "tetris-monochrome",
        "name": "Tetris monochrome",
        "category": "puzzle",
        "tagline": "A 2020 js13kGames entry by John Swana — under 13KB of pure craft.",
        "about": "Tetris monochrome is a puzzle game by John Swana, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Tetris monochrome to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: John Swana",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/tetris-monochrome.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/tetris-monochrome",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "brain-burner",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 148,
        "slug": "ror",
        "name": "ROR",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Jakub Nowak — under 13KB of pure craft.",
        "about": "ROR is a arcade game by Jakub Nowak, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for ROR to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Jakub Nowak",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/ror.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/ror",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 149,
        "slug": "connection",
        "name": "Connection",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Federico Tibaldo — under 13KB of pure craft.",
        "about": "Connection is a arcade game by Federico Tibaldo, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Connection to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Federico Tibaldo",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/connection.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/connection",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 150,
        "slug": "filenotfound",
        "name": "FileNotFound",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Konrad Linkowski — under 13KB of pure craft.",
        "about": "FileNotFound is a arcade game by Konrad Linkowski, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for FileNotFound to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Konrad Linkowski",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/filenotfound.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/filenotfound",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 151,
        "slug": "find-all-pages",
        "name": "Find All Pages",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Stacks Hub — under 13KB of pure craft.",
        "about": "Find All Pages is a arcade game by Stacks Hub, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Find All Pages to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Stacks Hub",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/find-all-pages.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/find-all-pages",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 152,
        "slug": "404-soccer",
        "name": "404 soccer",
        "category": "racing-sports",
        "tagline": "A 2020 js13kGames entry by Low Fat Lard — under 13KB of pure craft.",
        "about": "404 soccer is a racing & sports game by Low Fat Lard, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404 soccer to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Low Fat Lard",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404-soccer.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404-soccer",
        "licence": "MPL-2.0",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 153,
        "slug": "delete",
        "name": "Delete!",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Clocks-in-a-Cooler — under 13KB of pure craft.",
        "about": "Delete! is a arcade game by Clocks-in-a-Cooler, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Delete! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Clocks-in-a-Cooler",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/delete.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/delete",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 154,
        "slug": "the-last-spartan",
        "name": "The Last Spartan",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Michael Ferron — under 13KB of pure craft.",
        "about": "The Last Spartan is a arcade game by Michael Ferron, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Last Spartan to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Michael Ferron",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-last-spartan.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/the-last-spartan",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 155,
        "slug": "wizard-with-a-shotgun",
        "name": "WIZARD WITH A SHOTGUN",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Elliot Nelson — under 13KB of pure craft.",
        "about": "WIZARD WITH A SHOTGUN is a arcade game by Elliot Nelson, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for WIZARD WITH A SHOTGUN to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Elliot Nelson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/wizard-with-a-shotgun.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/wizard-with-a-shotgun",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 156,
        "slug": "vote-by-mail-funding-not-found",
        "name": "Vote by Mail: Funding Not Found",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Matt McKenna — under 13KB of pure craft.",
        "about": "Vote by Mail: Funding Not Found is a arcade game by Matt McKenna, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Vote by Mail: Funding Not Found to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Matt McKenna",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/vote-by-mail-funding-not-found.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/vote-by-mail-funding-not-found",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 157,
        "slug": "clone-not-found",
        "name": "Clone not found",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Sergiu Lucutar — under 13KB of pure craft.",
        "about": "Clone not found is a arcade game by Sergiu Lucutar, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Clone not found to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Sergiu Lucutar",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/clone-not-found.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/clone-not-found",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "minimal"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 158,
        "slug": "setlerio",
        "name": "Setlerio",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by fatfisz — under 13KB of pure craft.",
        "about": "Setlerio is a arcade game by fatfisz, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Setlerio to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: fatfisz",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/setlerio.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/setlerio",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 159,
        "slug": "404-remain-not-found",
        "name": "404 - (remain) not found",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Luke Cann — under 13KB of pure craft.",
        "about": "404 - (remain) not found is a arcade game by Luke Cann, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404 - (remain) not found to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Luke Cann",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404-remain-not-found.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404-remain-not-found",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 160,
        "slug": "village-not-found-404-to-200",
        "name": "Village Not Found - 404 to 200",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Satyam Lachhwani — under 13KB of pure craft.",
        "about": "Village Not Found - 404 to 200 is a arcade game by Satyam Lachhwani, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Village Not Found - 404 to 200 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Satyam Lachhwani",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/village-not-found-404-to-200.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/village-not-found-404-to-200",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 161,
        "slug": "dewdrop-farm",
        "name": "Dewdrop Farm",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Frank Mitchell — under 13KB of pure craft.",
        "about": "Dewdrop Farm is a arcade game by Frank Mitchell, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dewdrop Farm to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Frank Mitchell",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/dewdrop-farm.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/dewdrop-farm",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 162,
        "slug": "dive-and-pick",
        "name": "Dive and Pick",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by lpagg — under 13KB of pure craft.",
        "about": "Dive and Pick is a arcade game by lpagg, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dive and Pick to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: lpagg",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/dive-and-pick.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/dive-and-pick",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 163,
        "slug": "404-orbiting-asteroids",
        "name": "404 Orbiting Asteroids",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Luke Nickerson — under 13KB of pure craft.",
        "about": "404 Orbiting Asteroids is a arcade game by Luke Nickerson, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404 Orbiting Asteroids to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Luke Nickerson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404-orbiting-asteroids.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404-orbiting-asteroids",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 164,
        "slug": "find-the-papers",
        "name": "Find the Papers",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Miguel Silva — under 13KB of pure craft.",
        "about": "Find the Papers is a arcade game by Miguel Silva, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Find the Papers to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Miguel Silva",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/find-the-papers.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/find-the-papers",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 165,
        "slug": "stolen-sword",
        "name": "Stolen Sword",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Ian Chiao — under 13KB of pure craft.",
        "about": "Stolen Sword is a arcade game by Ian Chiao, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Stolen Sword to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Ian Chiao",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/stolen-sword.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/stolen-sword",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 166,
        "slug": "every-alien-loves-404",
        "name": "Every Alien Loves 404",
        "category": "action",
        "tagline": "A 2020 js13kGames entry by Wenli Zhang and Yumao — under 13KB of pure craft.",
        "about": "Every Alien Loves 404 is a action game by Wenli Zhang and Yumao, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Every Alien Loves 404 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Wenli Zhang and Yumao",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/every-alien-loves-404.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/every-alien-loves-404",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 167,
        "slug": "symmetry-not-found",
        "name": "Symmetry Not Found",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Pim Schreurs — under 13KB of pure craft.",
        "about": "Symmetry Not Found is a arcade game by Pim Schreurs, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Symmetry Not Found to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Pim Schreurs",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/symmetry-not-found.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/symmetry-not-found",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 168,
        "slug": "404kph",
        "name": "404kph",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Jeremy Burns — under 13KB of pure craft.",
        "about": "404kph is a arcade game by Jeremy Burns, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404kph to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Jeremy Burns",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404kph.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404kph",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 169,
        "slug": "the-colorful-journey",
        "name": "The Colorful Journey",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Dohee Kang and Gun Yu — under 13KB of pure craft.",
        "about": "The Colorful Journey is a arcade game by Dohee Kang and Gun Yu, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Colorful Journey to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Dohee Kang and Gun Yu",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-colorful-journey.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/the-colorful-journey",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 170,
        "slug": "404-bc-pinball",
        "name": "404 BC Pinball",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Adrian Lissot, Barthélémy Renucci et al — under 13KB of pure craft.",
        "about": "404 BC Pinball is a arcade game by Adrian Lissot, Barthélémy Renucci et al, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404 BC Pinball to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Adrian Lissot, Barthélémy Renucci et al",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404-bc-pinball.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404-bc-pinball",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 171,
        "slug": "find-the-lost-cross",
        "name": "FIND THE LOST CROSS!",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Burián Sándor — under 13KB of pure craft.",
        "about": "FIND THE LOST CROSS! is a arcade game by Burián Sándor, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for FIND THE LOST CROSS! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Burián Sándor",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/find-the-lost-cross.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/find-the-lost-cross",
        "licence": "MPL-2.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 172,
        "slug": "shooty-alien-game",
        "name": "Shooty Alien Game",
        "category": "action",
        "tagline": "A 2020 js13kGames entry by Niki Gawlik — under 13KB of pure craft.",
        "about": "Shooty Alien Game is a action game by Niki Gawlik, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Shooty Alien Game to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Niki Gawlik",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/shooty-alien-game.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/shooty-alien-game",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 173,
        "slug": "reculer",
        "name": "Reculer",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Yash Jha — under 13KB of pure craft.",
        "about": "Reculer is a arcade game by Yash Jha, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Reculer to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Yash Jha",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/reculer.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/reculer",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 174,
        "slug": "back-relax",
        "name": "Back Relax",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Randy Tayler — under 13KB of pure craft.",
        "about": "Back Relax is a arcade game by Randy Tayler, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back Relax to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Randy Tayler",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-relax.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-relax",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 175,
        "slug": "circle-back",
        "name": "Circle Back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by John Edvard — under 13KB of pure craft.",
        "about": "Circle Back is a arcade game by John Edvard, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Circle Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: John Edvard",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/circle-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/circle-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 176,
        "slug": "eat-my-dust",
        "name": "Eat My Dust!",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Junsik Shim — under 13KB of pure craft.",
        "about": "Eat My Dust! is a arcade game by Junsik Shim, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Eat My Dust! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Junsik Shim",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/eat-my-dust.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/eat-my-dust",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 177,
        "slug": "puzzle-from-hell",
        "name": "Puzzle from hell",
        "category": "puzzle",
        "tagline": "A 2019 js13kGames entry by Frederic Charette — under 13KB of pure craft.",
        "about": "Puzzle from hell is a puzzle game by Frederic Charette, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Puzzle from hell to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Frederic Charette",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/puzzle-from-hell.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/puzzle-from-hell",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "brain-burner",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 178,
        "slug": "back-in-dino",
        "name": "Back in Dino",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Nicolantonio Vignola — under 13KB of pure craft.",
        "about": "Back in Dino is a arcade game by Nicolantonio Vignola, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back in Dino to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Nicolantonio Vignola",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-in-dino.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-in-dino",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 179,
        "slug": "don-t-go-back",
        "name": "Don't Go Back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Alex — under 13KB of pure craft.",
        "about": "Don't Go Back is a arcade game by Alex, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Don't Go Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Alex",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/don-t-go-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 180,
        "slug": "it-man",
        "name": "IT-Man",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Karol — under 13KB of pure craft.",
        "about": "IT-Man is a arcade game by Karol, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for IT-Man to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Karol",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/it-man.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/it-man",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 181,
        "slug": "backo",
        "name": "Backo",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Andrej Naumovski — under 13KB of pure craft.",
        "about": "Backo is a arcade game by Andrej Naumovski, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Backo to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Andrej Naumovski",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backo.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backo",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 182,
        "slug": "get-back-from-robot-city",
        "name": "Get Back From Robot City",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Kevin Etchells — under 13KB of pure craft.",
        "about": "Get Back From Robot City is a arcade game by Kevin Etchells, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Get Back From Robot City to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Kevin Etchells",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/get-back-from-robot-city.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/get-back-from-robot-city",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 183,
        "slug": "encoded-maze",
        "name": "Encoded Maze",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Johnny A. — under 13KB of pure craft.",
        "about": "Encoded Maze is a arcade game by Johnny A., submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Encoded Maze to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Johnny A.",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/encoded-maze.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/encoded-maze",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 184,
        "slug": "quick-wins",
        "name": "Quick Wins",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Ryan Tyler — under 13KB of pure craft.",
        "about": "Quick Wins is a arcade game by Ryan Tyler, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Quick Wins to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Ryan Tyler",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/quick-wins.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/quick-wins",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 185,
        "slug": "back-home",
        "name": "Back Home",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by workshopcraft — under 13KB of pure craft.",
        "about": "Back Home is a arcade game by workshopcraft, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back Home to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: workshopcraft",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-home.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-home",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 186,
        "slug": "fight-back",
        "name": "Fight back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Floriico — under 13KB of pure craft.",
        "about": "Fight back is a arcade game by Floriico, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Fight back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Floriico",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/fight-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/fight-back",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 187,
        "slug": "backlit-treasure-escape",
        "name": "Backlit - Treasure Escape",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Alex Swan — under 13KB of pure craft.",
        "about": "Backlit - Treasure Escape is a arcade game by Alex Swan, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Backlit - Treasure Escape to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Alex Swan",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backlit-treasure-escape.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backlit-treasure-escape",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 188,
        "slug": "fall-back",
        "name": "Fall Back!",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Cameron Edwards — under 13KB of pure craft.",
        "about": "Fall Back! is a arcade game by Cameron Edwards, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Fall Back! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Cameron Edwards",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/fall-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/fall-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 189,
        "slug": "send-the-asteroids-back",
        "name": "send the asteroids back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Andy McGrath — under 13KB of pure craft.",
        "about": "send the asteroids back is a arcade game by Andy McGrath, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for send the asteroids back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Andy McGrath",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/send-the-asteroids-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/send-the-asteroids-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 190,
        "slug": "backcountry",
        "name": "Backcountry",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Michał Budzyński and Stanisław Małolepszy — under 13KB of pure craft.",
        "about": "Backcountry is a arcade game by Michał Budzyński and Stanisław Małolepszy, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Backcountry to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Michał Budzyński and Stanisław Małolepszy",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backcountry.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backcountry",
        "licence": "ISC",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 191,
        "slug": "grave-quest",
        "name": "Grave Quest",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Graham Reeves — under 13KB of pure craft.",
        "about": "Grave Quest is a arcade game by Graham Reeves, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Grave Quest to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Graham Reeves",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/grave-quest.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/grave-quest",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 192,
        "slug": "bee-kind",
        "name": "Bee Kind",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Jasper Renow-Clarke — under 13KB of pure craft.",
        "about": "Bee Kind is a arcade game by Jasper Renow-Clarke, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Bee Kind to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Jasper Renow-Clarke",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/bee-kind.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/bee-kind",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 193,
        "slug": "apex-predator",
        "name": "Apex Predator",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by k-daiguji — under 13KB of pure craft.",
        "about": "Apex Predator is a arcade game by k-daiguji, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Apex Predator to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: k-daiguji",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/apex-predator.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/apex-predator",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 194,
        "slug": "deathkeeper",
        "name": "Deathkeeper",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Sorskoot — under 13KB of pure craft.",
        "about": "Deathkeeper is a arcade game by Sorskoot, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Deathkeeper to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Sorskoot",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/deathkeeper.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/deathkeeper",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 195,
        "slug": "cosmic-asteroid-catcher",
        "name": "Cosmic Asteroid Catcher",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Sabine — under 13KB of pure craft.",
        "about": "Cosmic Asteroid Catcher is a arcade game by Sabine, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Cosmic Asteroid Catcher to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Sabine",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/cosmic-asteroid-catcher.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/cosmic-asteroid-catcher",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 196,
        "slug": "space-war",
        "name": "Space War",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Jorge Rubiano — under 13KB of pure craft.",
        "about": "Space War is a arcade game by Jorge Rubiano, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space War to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Jorge Rubiano",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-war.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-war",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 197,
        "slug": "spacew",
        "name": "spacew",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Samuel Paré-Chouinard — under 13KB of pure craft.",
        "about": "spacew is a arcade game by Samuel Paré-Chouinard, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for spacew to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Samuel Paré-Chouinard",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/spacew.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/spacew",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 198,
        "slug": "kosminenvirtaus",
        "name": "Kosminenvirtaus",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Konstantin Guschin — under 13KB of pure craft.",
        "about": "Kosminenvirtaus is a arcade game by Konstantin Guschin, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Kosminenvirtaus to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Konstantin Guschin",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/kosminenvirtaus.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/kosminenvirtaus",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 199,
        "slug": "lost-in-space-endless-destruction",
        "name": "Lost In Space. Endless Destruction.",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Cutch — under 13KB of pure craft.",
        "about": "Lost In Space. Endless Destruction. is a arcade game by Cutch, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Lost In Space. Endless Destruction. to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Cutch",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/lost-in-space-endless-destruction.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/lost-in-space-endless-destruction",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 200,
        "slug": "elementary-challenges",
        "name": "Elementary Challenges",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Michael M. — under 13KB of pure craft.",
        "about": "Elementary Challenges is a arcade game by Michael M., submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Elementary Challenges to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Michael M.",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/elementary-challenges.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/elementary-challenges",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 201,
        "slug": "404th-floor",
        "name": "404th floor",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Brégeau — under 13KB of pure craft.",
        "about": "404th floor is a arcade game by Brégeau, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404th floor to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Brégeau",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404th-floor.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404th-floor",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 202,
        "slug": "i-want-to-google-the-game",
        "name": "I want to google the game",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Mark Vasilkov — under 13KB of pure craft.",
        "about": "I want to google the game is a arcade game by Mark Vasilkov, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for I want to google the game to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Mark Vasilkov",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/i-want-to-google-the-game.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/i-want-to-google-the-game",
        "licence": "NOASSERTION",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 203,
        "slug": "404-missingpage",
        "name": "404! MissingPage",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Juan 404 — under 13KB of pure craft.",
        "about": "404! MissingPage is a arcade game by Juan 404, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404! MissingPage to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Juan 404",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404-missingpage.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404-missingpage",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 204,
        "slug": "code-farm",
        "name": "Code-Farm",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Krishna Kant Hati — under 13KB of pure craft.",
        "about": "Code-Farm is a arcade game by Krishna Kant Hati, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Code-Farm to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Krishna Kant Hati",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/code-farm.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/code-farm",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 205,
        "slug": "winwin",
        "name": "WinWin",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Noncho Savov — under 13KB of pure craft.",
        "about": "WinWin is a arcade game by Noncho Savov, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for WinWin to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Noncho Savov",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/winwin.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/winwin",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 206,
        "slug": "wolf-and-sheep",
        "name": "wolf and sheep",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by IMGSS — under 13KB of pure craft.",
        "about": "wolf and sheep is a arcade game by IMGSS, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for wolf and sheep to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: IMGSS",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/wolf-and-sheep.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/wolf-and-sheep",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 207,
        "slug": "xycore",
        "name": "Xycore",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Daniel Lawrence — under 13KB of pure craft.",
        "about": "Xycore is a arcade game by Daniel Lawrence, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Xycore to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Daniel Lawrence",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/xycore.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/xycore",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 208,
        "slug": "dottie-back-to-sun",
        "name": "Dottie Back to Sun",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Jesse McNulty — under 13KB of pure craft.",
        "about": "Dottie Back to Sun is a arcade game by Jesse McNulty, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dottie Back to Sun to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Jesse McNulty",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/dottie-back-to-sun.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/dottie-back-to-sun",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 209,
        "slug": "backorder-storehouse",
        "name": "Backorder Storehouse",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Julien Kermarec — under 13KB of pure craft.",
        "about": "Backorder Storehouse is a arcade game by Julien Kermarec, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Backorder Storehouse to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Julien Kermarec",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backorder-storehouse.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backorder-storehouse",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 210,
        "slug": "back-2-home",
        "name": "Back 2 Home",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Maurício Sipmann — under 13KB of pure craft.",
        "about": "Back 2 Home is a arcade game by Maurício Sipmann, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back 2 Home to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Maurício Sipmann",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-2-home.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-2-home",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 211,
        "slug": "back-forth",
        "name": "Back & Forth",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Gagik Papikyan — under 13KB of pure craft.",
        "about": "Back & Forth is a arcade game by Gagik Papikyan, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back & Forth to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Gagik Papikyan",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-forth.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-forth",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 212,
        "slug": "popball",
        "name": "PopBall",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Alba — under 13KB of pure craft.",
        "about": "PopBall is a arcade game by Alba, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for PopBall to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Alba",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/popball.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/popball",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 213,
        "slug": "get-jess-back",
        "name": "Get Jess Back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Randy Tayler — under 13KB of pure craft.",
        "about": "Get Jess Back is a arcade game by Randy Tayler, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Get Jess Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Randy Tayler",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/get-jess-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/get-jess-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 214,
        "slug": "entangled",
        "name": "Entangled",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Japheth Balane — under 13KB of pure craft.",
        "about": "Entangled is a arcade game by Japheth Balane, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Entangled to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Japheth Balane",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/entangled.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/entangled",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 215,
        "slug": "backspace",
        "name": "BACKSPACE",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Pioctor Casot — under 13KB of pure craft.",
        "about": "BACKSPACE is a arcade game by Pioctor Casot, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for BACKSPACE to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Pioctor Casot",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/backspace.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/backspace",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 216,
        "slug": "dawn-breaker",
        "name": "Dawn Breaker",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Rustin Chi — under 13KB of pure craft.",
        "about": "Dawn Breaker is a arcade game by Rustin Chi, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dawn Breaker to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Rustin Chi",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/dawn-breaker.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/dawn-breaker",
        "licence": "MIT",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 217,
        "slug": "back-to-the-80s",
        "name": "Back to the 80s",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Ed Lynch — under 13KB of pure craft.",
        "about": "Back to the 80s is a arcade game by Ed Lynch, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back to the 80s to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Ed Lynch",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-to-the-80s.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-to-the-80s",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 218,
        "slug": "back-from-kooky-island",
        "name": "Back from Kooky Island",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Alex Curtis — under 13KB of pure craft.",
        "about": "Back from Kooky Island is a arcade game by Alex Curtis, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back from Kooky Island to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Alex Curtis",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-from-kooky-island.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-from-kooky-island",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 219,
        "slug": "labyrinth-vr-experience",
        "name": "Labyrinth Vr Experience",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Dawid Szadurski — under 13KB of pure craft.",
        "about": "Labyrinth Vr Experience is a arcade game by Dawid Szadurski, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Labyrinth Vr Experience to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Dawid Szadurski",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/labyrinth-vr-experience.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/labyrinth-vr-experience",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 220,
        "slug": "back-to-rescue",
        "name": "back to rescue",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Javier Salcedo — under 13KB of pure craft.",
        "about": "back to rescue is a arcade game by Javier Salcedo, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for back to rescue to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Javier Salcedo",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-to-rescue.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-to-rescue",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 221,
        "slug": "yet-another-doom-clone",
        "name": "Yet Another Doom Clone",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Nicholas Carlini — under 13KB of pure craft.",
        "about": "Yet Another Doom Clone is a arcade game by Nicholas Carlini, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Yet Another Doom Clone to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Nicholas Carlini",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/yet-another-doom-clone.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/yet-another-doom-clone",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "minimal"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 222,
        "slug": "ninja-take-back",
        "name": "Ninja Take Back",
        "category": "action",
        "tagline": "A 2019 js13kGames entry by Roger Winright — under 13KB of pure craft.",
        "about": "Ninja Take Back is a action game by Roger Winright, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Ninja Take Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Roger Winright",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/ninja-take-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/ninja-take-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "skill-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 223,
        "slug": "push-back",
        "name": "Push Back",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Erik Sombroek and Lomateron — under 13KB of pure craft.",
        "about": "Push Back is a arcade game by Erik Sombroek and Lomateron, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Push Back to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Erik Sombroek and Lomateron",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/push-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/push-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 224,
        "slug": "rebound",
        "name": "Rebound",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Michał Skowronek and Michał Kuliński — under 13KB of pure craft.",
        "about": "Rebound is a arcade game by Michał Skowronek and Michał Kuliński, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Rebound to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Michał Skowronek and Michał Kuliński",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/rebound.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/rebound",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 225,
        "slug": "fall-back-2019",
        "name": "Fall_Back!",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Nicolas Searle and David Scales — under 13KB of pure craft.",
        "about": "Fall_Back! is a arcade game by Nicolas Searle and David Scales, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Fall_Back! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Nicolas Searle and David Scales",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/fall-back-2019",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 226,
        "slug": "they-re-back",
        "name": "They're Back!",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Charl Weitz — under 13KB of pure craft.",
        "about": "They're Back! is a arcade game by Charl Weitz, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for They're Back! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Charl Weitz",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/they-re-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "classic",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 227,
        "slug": "catslap",
        "name": "CatSlap",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Teddy Chen — under 13KB of pure craft.",
        "about": "CatSlap is a arcade game by Teddy Chen, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for CatSlap to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Teddy Chen",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/catslap",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 228,
        "slug": "rip",
        "name": "RIP",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Chris Glover — under 13KB of pure craft.",
        "about": "RIP is a arcade game by Chris Glover, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for RIP to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Chris Glover",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/rip.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/rip",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 229,
        "slug": "black-hat-black-cat",
        "name": "Black Hat // Black Cat",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Jordan Watkins — under 13KB of pure craft.",
        "about": "Black Hat // Black Cat is a arcade game by Jordan Watkins, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Black Hat // Black Cat to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Jordan Watkins",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/black-hat-black-cat",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 230,
        "slug": "zabobon",
        "name": "Zabobon",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Bartosz Cytrowski and Julia Godny — under 13KB of pure craft.",
        "about": "Zabobon is a arcade game by Bartosz Cytrowski and Julia Godny, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Zabobon to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Bartosz Cytrowski and Julia Godny",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/zabobon",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 231,
        "slug": "blackcat-hacker",
        "name": "BlackCat_Hacker",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Zach — under 13KB of pure craft.",
        "about": "BlackCat_Hacker is a arcade game by Zach, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for BlackCat_Hacker to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Zach",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/blackcat-hacker",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 232,
        "slug": "blacky-returns-home",
        "name": "Blacky Returns Home",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by sdeseille — under 13KB of pure craft.",
        "about": "Blacky Returns Home is a arcade game by sdeseille, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Blacky Returns Home to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: sdeseille",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/blacky-returns-home",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 233,
        "slug": "black-cat-potions",
        "name": "Black Cat Potions",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Sebastian Dorn — under 13KB of pure craft.",
        "about": "Black Cat Potions is a arcade game by Sebastian Dorn, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Black Cat Potions to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Sebastian Dorn",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/black-cat-potions",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 234,
        "slug": "boots-and-the-black-cauldron",
        "name": "Boots and the Black Cauldron",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Raptor Dev and Noah-Zark-22 — under 13KB of pure craft.",
        "about": "Boots and the Black Cauldron is a arcade game by Raptor Dev and Noah-Zark-22, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Boots and the Black Cauldron to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Raptor Dev and Noah-Zark-22",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/boots-and-the-black-cauldron",
        "licence": "NOASSERTION",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 235,
        "slug": "meow-mountain",
        "name": "Meow Mountain",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by João Lopes — under 13KB of pure craft.",
        "about": "Meow Mountain is a arcade game by João Lopes, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Meow Mountain to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: João Lopes",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/meow-mountain",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 236,
        "slug": "black-cat-s-rise",
        "name": "Black Cat's Rise",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Michel Sabchuk — under 13KB of pure craft.",
        "about": "Black Cat's Rise is a arcade game by Michel Sabchuk, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Black Cat's Rise to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Michel Sabchuk",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/black-cat-s-rise",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 237,
        "slug": "wild-catch",
        "name": "Wild Catch",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Justinas Gibas — under 13KB of pure craft.",
        "about": "Wild Catch is a arcade game by Justinas Gibas, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Wild Catch to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Justinas Gibas",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/wild-catch",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 238,
        "slug": "clawstruck",
        "name": "Clawstruck",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Noumisyifa Nabila — under 13KB of pure craft.",
        "about": "Clawstruck is a arcade game by Noumisyifa Nabila, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Clawstruck to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Noumisyifa Nabila",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/clawstruck",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 239,
        "slug": "black-cat-nine-lives-no-mercy",
        "name": "Black Cat - Nine Lives, No Mercy",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Cliff Earl — under 13KB of pure craft.",
        "about": "Black Cat - Nine Lives, No Mercy is a arcade game by Cliff Earl, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Black Cat - Nine Lives, No Mercy to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Cliff Earl",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/black-cat-nine-lives-no-mercy",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 240,
        "slug": "dinner-for-two",
        "name": "Dinner for Two",
        "category": "arcade",
        "tagline": "A 2025 js13kGames entry by Feenposhleen — under 13KB of pure craft.",
        "about": "Dinner for Two is a arcade game by Feenposhleen, submitted to the js13kGames 2025 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2025 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Dinner for Two to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Feenposhleen",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2025/games/dinner-for-two",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2025",
        "featured": false
    },
    {
        "id": 241,
        "slug": "exilium-the-fall-of-dominus",
        "name": "Exilium: The Fall of Dominus",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Harvey Seager — under 13KB of pure craft.",
        "about": "Exilium: The Fall of Dominus is a arcade game by Harvey Seager, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Exilium: The Fall of Dominus to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Harvey Seager",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/exilium-the-fall-of-dominus",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 242,
        "slug": "shoot-13-nomsters",
        "name": "Shoot 13 Nomsters",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Mark Vasilkov — under 13KB of pure craft.",
        "about": "Shoot 13 Nomsters is a arcade game by Mark Vasilkov, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Shoot 13 Nomsters to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Mark Vasilkov",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/shoot-13-nomsters",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 243,
        "slug": "wands-of-triskaidekai",
        "name": "Wands of Triskaidekai",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Richard Chung — under 13KB of pure craft.",
        "about": "Wands of Triskaidekai is a arcade game by Richard Chung, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Wands of Triskaidekai to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Richard Chung",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/wands-of-triskaidekai",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 244,
        "slug": "salvadoran-reclamation-ms-13",
        "name": "Salvadoran Reclamation: MS-13",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by IroncladDev — under 13KB of pure craft.",
        "about": "Salvadoran Reclamation: MS-13 is a arcade game by IroncladDev, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Salvadoran Reclamation: MS-13 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: IroncladDev",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/salvadoran-reclamation-ms-13",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 245,
        "slug": "phantomicus",
        "name": "Phantomicus",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Cody Ebberson — under 13KB of pure craft.",
        "about": "Phantomicus is a arcade game by Cody Ebberson, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Phantomicus to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Cody Ebberson",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/phantomicus",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 246,
        "slug": "the-emerald-serpent",
        "name": "The Emerald Serpent",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Alex Swan — under 13KB of pure craft.",
        "about": "The Emerald Serpent is a arcade game by Alex Swan, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Emerald Serpent to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Alex Swan",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/the-emerald-serpent",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 247,
        "slug": "terra-mobilis",
        "name": "Terra Mobilis",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Alexander Petrov — under 13KB of pure craft.",
        "about": "Terra Mobilis is a arcade game by Alexander Petrov, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Terra Mobilis to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Alexander Petrov",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/terra-mobilis",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 248,
        "slug": "national-accident-day",
        "name": "National Accident Day",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Sayem Shafayet — under 13KB of pure craft.",
        "about": "National Accident Day is a arcade game by Sayem Shafayet, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for National Accident Day to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Sayem Shafayet",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/national-accident-day",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 249,
        "slug": "deck-13",
        "name": "DECK 13",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Almar Suarez — under 13KB of pure craft.",
        "about": "DECK 13 is a arcade game by Almar Suarez, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for DECK 13 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Almar Suarez",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/deck-13",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 250,
        "slug": "the-anti-poker-protocol",
        "name": "The Anti-Poker Protocol",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by Alex Delderfield — under 13KB of pure craft.",
        "about": "The Anti-Poker Protocol is a arcade game by Alex Delderfield, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Anti-Poker Protocol to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Alex Delderfield",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/the-anti-poker-protocol",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 251,
        "slug": "m7-summit",
        "name": "M7 Summit",
        "category": "arcade",
        "tagline": "A 2024 js13kGames entry by k-daiguji — under 13KB of pure craft.",
        "about": "M7 Summit is a arcade game by k-daiguji, submitted to the js13kGames 2024 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2024 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for M7 Summit to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: k-daiguji",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2024/games/m7-summit",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2024",
        "featured": false
    },
    {
        "id": 252,
        "slug": "knight-dreams",
        "name": "Knight Dreams",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Jani Nykänen — under 13KB of pure craft.",
        "about": "Knight Dreams is a arcade game by Jani Nykänen, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Knight Dreams to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Jani Nykänen",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/knight-dreams.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/knight-dreams",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 253,
        "slug": "cathedral-builder",
        "name": "Cathedral builder",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Homer Dilpleu — under 13KB of pure craft.",
        "about": "Cathedral builder is a arcade game by Homer Dilpleu, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Cathedral builder to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Homer Dilpleu",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/cathedral-builder.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/cathedral-builder",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 254,
        "slug": "the-treasure-of-the-nibelungs",
        "name": "The Treasure of the Nibelungs",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Sebastian Dorn — under 13KB of pure craft.",
        "about": "The Treasure of the Nibelungs is a arcade game by Sebastian Dorn, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Treasure of the Nibelungs to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Sebastian Dorn",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-treasure-of-the-nibelungs.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/the-treasure-of-the-nibelungs",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 255,
        "slug": "the-mongol-horde",
        "name": "The Mongol Horde",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Reece Bennett — under 13KB of pure craft.",
        "about": "The Mongol Horde is a arcade game by Reece Bennett, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Mongol Horde to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Reece Bennett",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-mongol-horde.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/the-mongol-horde",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 256,
        "slug": "keep-calm",
        "name": "Keep Calm",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Micheal Parks — under 13KB of pure craft.",
        "about": "Keep Calm is a arcade game by Micheal Parks, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Keep Calm to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Micheal Parks",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/keep-calm.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/keep-calm",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 257,
        "slug": "exit-the-castle",
        "name": "Exit the Castle",
        "category": "strategy",
        "tagline": "A 2023 js13kGames entry by Oliver Smith — under 13KB of pure craft.",
        "about": "Exit the Castle is a strategy game by Oliver Smith, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Exit the Castle to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Oliver Smith",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/exit-the-castle.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/exit-the-castle",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 258,
        "slug": "13th-barber-s-guild",
        "name": "13th Barber's Guild",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Michel Sabchuk — under 13KB of pure craft.",
        "about": "13th Barber's Guild is a arcade game by Michel Sabchuk, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 13th Barber's Guild to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Michel Sabchuk",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/13th-barber-s-guild",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 259,
        "slug": "predecessors",
        "name": "Predecessors",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by Sami Heikkinen and Tero Jäntti — under 13KB of pure craft.",
        "about": "Predecessors is a arcade game by Sami Heikkinen and Tero Jäntti, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Predecessors to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Sami Heikkinen and Tero Jäntti",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/predecessors.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/predecessors",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 260,
        "slug": "the-baltic-league",
        "name": "The Baltic League",
        "category": "arcade",
        "tagline": "A 2023 js13kGames entry by André Jaenisch — under 13KB of pure craft.",
        "about": "The Baltic League is a arcade game by André Jaenisch, submitted to the js13kGames 2023 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2023 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Baltic League to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: André Jaenisch",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-baltic-league.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2023/games/the-baltic-league",
        "licence": "AGPL-3.0",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2023",
        "featured": false
    },
    {
        "id": 261,
        "slug": "terror-defense",
        "name": "Terror Defense",
        "category": "strategy",
        "tagline": "A 2022 js13kGames entry by Adrien Guéret — under 13KB of pure craft.",
        "about": "Terror Defense is a strategy game by Adrien Guéret, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Terror Defense to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Adrien Guéret",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/terror-defense.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/terror-defense",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "turn-based",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 262,
        "slug": "bit-butcher",
        "name": "Bit Butcher",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Luke Nickerson — under 13KB of pure craft.",
        "about": "Bit Butcher is a arcade game by Luke Nickerson, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Bit Butcher to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Luke Nickerson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/bit-butcher.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/bit-butcher",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 263,
        "slug": "charon-jr",
        "name": "Charon Jr.",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Rob Louie — under 13KB of pure craft.",
        "about": "Charon Jr. is a arcade game by Rob Louie, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Charon Jr. to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Rob Louie",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/charon-jr.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/charon-jr",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 264,
        "slug": "deathwish",
        "name": "Deathwish",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Miguel Ángel — under 13KB of pure craft.",
        "about": "Deathwish is a arcade game by Miguel Ángel, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Deathwish to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Miguel Ángel",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/deathwish.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/deathwish",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 265,
        "slug": "heart-of-the-gods",
        "name": "Heart of the Gods",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Benjamin Brown — under 13KB of pure craft.",
        "about": "Heart of the Gods is a arcade game by Benjamin Brown, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Heart of the Gods to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Benjamin Brown",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/heart-of-the-gods.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/heart-of-the-gods",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 266,
        "slug": "death-or-gloria",
        "name": "Death or Gloria",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Brian Hambley — under 13KB of pure craft.",
        "about": "Death or Gloria is a arcade game by Brian Hambley, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Death or Gloria to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Brian Hambley",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/death-or-gloria.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/death-or-gloria",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 267,
        "slug": "skeleathon",
        "name": "Skeleathon",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Eric Ros — under 13KB of pure craft.",
        "about": "Skeleathon is a arcade game by Eric Ros, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Skeleathon to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Eric Ros",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/skeleathon.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/skeleathon",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 268,
        "slug": "templo-mayor",
        "name": "Templo Mayor",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by ckolin — under 13KB of pure craft.",
        "about": "Templo Mayor is a arcade game by ckolin, submitted to the js13kGames 2022 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2022 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Templo Mayor to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: ckolin",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/templo-mayor.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2022/games/templo-mayor",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2022",
        "featured": false
    },
    {
        "id": 269,
        "slug": "azetz",
        "name": "Azetz",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Guillermo — under 13KB of pure craft.",
        "about": "Azetz is a arcade game by Guillermo, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Azetz to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Guillermo",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/azetz.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/azetz",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 270,
        "slug": "orbital-golfing",
        "name": "Orbital Golfing",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Benjamin Brown — under 13KB of pure craft.",
        "about": "Orbital Golfing is a arcade game by Benjamin Brown, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Orbital Golfing to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Benjamin Brown",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/orbital-golfing.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/orbital-golfing",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 271,
        "slug": "master-of-13k-suns",
        "name": "Master of 13k Suns",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Luke Nickerson — under 13KB of pure craft.",
        "about": "Master of 13k Suns is a arcade game by Luke Nickerson, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Master of 13k Suns to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Luke Nickerson",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/master-of-13k-suns.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/master-of-13k-suns",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 272,
        "slug": "space-huggers",
        "name": "Space Huggers",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Frank Force — under 13KB of pure craft.",
        "about": "Space Huggers is a arcade game by Frank Force, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Space Huggers to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Frank Force",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/space-huggers.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/space-huggers",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 273,
        "slug": "brokenspace",
        "name": "brokenSpace",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Orange — under 13KB of pure craft.",
        "about": "brokenSpace is a arcade game by Orange, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for brokenSpace to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Orange",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/brokenspace.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/brokenspace",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 274,
        "slug": "mars-short-adventure",
        "name": "Mars: Short Adventure",
        "category": "arcade",
        "tagline": "A 2021 js13kGames entry by Viktor Uhryn — under 13KB of pure craft.",
        "about": "Mars: Short Adventure is a arcade game by Viktor Uhryn, submitted to the js13kGames 2021 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2021 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Mars: Short Adventure to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Viktor Uhryn",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/mars-short-adventure.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2021/games/mars-short-adventure",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2021",
        "featured": false
    },
    {
        "id": 275,
        "slug": "the-king-s-missing-page",
        "name": "The King's Missing Page",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Lance Ewing — under 13KB of pure craft.",
        "about": "The King's Missing Page is a arcade game by Lance Ewing, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The King's Missing Page to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Lance Ewing",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/the-king-s-missing-page",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 276,
        "slug": "digicrush",
        "name": "Digicrush",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by William Wong — under 13KB of pure craft.",
        "about": "Digicrush is a arcade game by William Wong, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Digicrush to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: William Wong",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/digicrush.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/digicrush",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 277,
        "slug": "realm-404",
        "name": "Realm 404",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Benjamin Brown — under 13KB of pure craft.",
        "about": "Realm 404 is a arcade game by Benjamin Brown, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Realm 404 to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Benjamin Brown",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/realm-404.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/realm-404",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 278,
        "slug": "sculpting-done-quick",
        "name": "Sculpting Done Quick",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Alex Swan — under 13KB of pure craft.",
        "about": "Sculpting Done Quick is a arcade game by Alex Swan, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Sculpting Done Quick to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Alex Swan",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/sculpting-done-quick.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/sculpting-done-quick",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "minimal"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 279,
        "slug": "404-snake-monochrome",
        "name": "404 Snake Monochrome",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by John Swana — under 13KB of pure craft.",
        "about": "404 Snake Monochrome is a arcade game by John Swana, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for 404 Snake Monochrome to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: John Swana",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/404-snake-monochrome.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/404-snake-monochrome",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 280,
        "slug": "adopt-a-fire",
        "name": "Adopt-a-Fire",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Dickson Chui — under 13KB of pure craft.",
        "about": "Adopt-a-Fire is a arcade game by Dickson Chui, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Adopt-a-Fire to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Dickson Chui",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/adopt-a-fire.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/adopt-a-fire",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 281,
        "slug": "found-bomb",
        "name": "Found bomb ?",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Hiroshi Okazaki — under 13KB of pure craft.",
        "about": "Found bomb ? is a arcade game by Hiroshi Okazaki, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Found bomb ? to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Hiroshi Okazaki",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/found-bomb.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/found-bomb",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 282,
        "slug": "robots-txt",
        "name": "robots.txt",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Thiago Romão Barcala — under 13KB of pure craft.",
        "about": "robots.txt is a arcade game by Thiago Romão Barcala, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for robots.txt to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Thiago Romão Barcala",
            "Competition-recognised entry"
        ],
        "screenshots": [],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/robots-txt",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 283,
        "slug": "jam-champs-404-princess-not-found",
        "name": "Jam Champs: 404 Princess Not Found",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Jordan Watkins — under 13KB of pure craft.",
        "about": "Jam Champs: 404 Princess Not Found is a arcade game by Jordan Watkins, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Jam Champs: 404 Princess Not Found to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Jordan Watkins",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/jam-champs-404-princess-not-found.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/jam-champs-404-princess-not-found",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 284,
        "slug": "exit",
        "name": "Exit",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by James — under 13KB of pure craft.",
        "about": "Exit is a arcade game by James, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Exit to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: James",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/exit.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/exit",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 285,
        "slug": "emoji-memory",
        "name": "Emoji Memory",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Daniel Jeffery — under 13KB of pure craft.",
        "about": "Emoji Memory is a arcade game by Daniel Jeffery, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Emoji Memory to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Daniel Jeffery",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/emoji-memory.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/emoji-memory",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 286,
        "slug": "planet-404-that-is-yet-to-be-found",
        "name": "Planet 404 that is yet to be found",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Nikita Zaytsev — under 13KB of pure craft.",
        "about": "Planet 404 that is yet to be found is a arcade game by Nikita Zaytsev, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Planet 404 that is yet to be found to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Nikita Zaytsev",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/planet-404-that-is-yet-to-be-found.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/planet-404-that-is-yet-to-be-found",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 287,
        "slug": "oh-no-all-the-textures-are-404",
        "name": "Oh no! All the textures are 404!",
        "category": "arcade",
        "tagline": "A 2020 js13kGames entry by Michał Budzyński and Stanisław Małolepszy — under 13KB of pure craft.",
        "about": "Oh no! All the textures are 404! is a arcade game by Michał Budzyński and Stanisław Małolepszy, submitted to the js13kGames 2020 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2020 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Oh no! All the textures are 404! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Michał Budzyński and Stanisław Małolepszy",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/oh-no-all-the-textures-are-404.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2020/games/oh-no-all-the-textures-are-404",
        "licence": "ISC",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2020",
        "featured": false
    },
    {
        "id": 288,
        "slug": "meadow",
        "name": "Meadow",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Jason Alvarez — under 13KB of pure craft.",
        "about": "Meadow is a arcade game by Jason Alvarez, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Meadow to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Jason Alvarez",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/meadow.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/meadow",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 289,
        "slug": "reptour",
        "name": "Reptour",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Yash Jha — under 13KB of pure craft.",
        "about": "Reptour is a arcade game by Yash Jha, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Reptour to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Yash Jha",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/reptour.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/reptour",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 290,
        "slug": "jouer",
        "name": "Jouer",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Yash Jha — under 13KB of pure craft.",
        "about": "Jouer is a arcade game by Yash Jha, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Jouer to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Yash Jha",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/jouer.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/jouer",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 291,
        "slug": "back-to-the-battle-ship",
        "name": "Back to the Battle Ship",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Jorge Rubiano — under 13KB of pure craft.",
        "about": "Back to the Battle Ship is a arcade game by Jorge Rubiano, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back to the Battle Ship to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Jorge Rubiano",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-to-the-battle-ship.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-to-the-battle-ship",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 292,
        "slug": "the-martians-are-back",
        "name": "The Martians are Back!",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Michael M. — under 13KB of pure craft.",
        "about": "The Martians are Back! is a arcade game by Michael M., submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for The Martians are Back! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Michael M.",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/the-martians-are-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/the-martians-are-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 293,
        "slug": "regresso",
        "name": "Regresso",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by João Lopes — under 13KB of pure craft.",
        "about": "Regresso is a arcade game by João Lopes, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Regresso to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: João Lopes",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/regresso.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/regresso",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 294,
        "slug": "time-runner",
        "name": "Time Runner",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Marek Łabuz — under 13KB of pure craft.",
        "about": "Time Runner is a arcade game by Marek Łabuz, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Time Runner to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Marek Łabuz",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/time-runner.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/time-runner",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 295,
        "slug": "rectangles",
        "name": "Rectangles",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Locisvv — under 13KB of pure craft.",
        "about": "Rectangles is a arcade game by Locisvv, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Rectangles to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Locisvv",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/rectangles.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/rectangles",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 296,
        "slug": "jewelsback",
        "name": "Jewelsback",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Erick Petrucelli — under 13KB of pure craft.",
        "about": "Jewelsback is a arcade game by Erick Petrucelli, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Jewelsback to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Erick Petrucelli",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/jewelsback.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/jewelsback",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 297,
        "slug": "sand-adder",
        "name": "Sand Adder",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Claudio Guarisco — under 13KB of pure craft.",
        "about": "Sand Adder is a arcade game by Claudio Guarisco, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Sand Adder to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Claudio Guarisco",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/sand-adder.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/sand-adder",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 298,
        "slug": "saptcha",
        "name": "Saptcha",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Konrad Linkowski — under 13KB of pure craft.",
        "about": "Saptcha is a arcade game by Konrad Linkowski, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Saptcha to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Konrad Linkowski",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/saptcha.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/saptcha",
        "licence": "MIT",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 299,
        "slug": "way-out",
        "name": "Way Out",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Samir Hodzic — under 13KB of pure craft.",
        "about": "Way Out is a arcade game by Samir Hodzic, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Way Out to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Samir Hodzic",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/way-out.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/way-out",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 300,
        "slug": "back-read",
        "name": "Back Read",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Victor Nogueira — under 13KB of pure craft.",
        "about": "Back Read is a arcade game by Victor Nogueira, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back Read to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Victor Nogueira",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-read.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-read",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 301,
        "slug": "back-to-the-stars",
        "name": "Back To The Stars",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Marco Fernandes — under 13KB of pure craft.",
        "about": "Back To The Stars is a arcade game by Marco Fernandes, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back To The Stars to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Marco Fernandes",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-to-the-stars.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-to-the-stars",
        "licence": "GPL-3.0",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 302,
        "slug": "back-down-the-tower",
        "name": "Back Down The Tower",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Quang-Thuy Hoang and Kevin Leong — under 13KB of pure craft.",
        "about": "Back Down The Tower is a arcade game by Quang-Thuy Hoang and Kevin Leong, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Back Down The Tower to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Quang-Thuy Hoang and Kevin Leong",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/back-down-the-tower.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/back-down-the-tower",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 303,
        "slug": "beat-bricks",
        "name": "Beat Bricks",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Keith Karnage — under 13KB of pure craft.",
        "about": "Beat Bricks is a arcade game by Keith Karnage, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Beat Bricks to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Keith Karnage",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/beat-bricks.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/beat-bricks",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 304,
        "slug": "bakpak",
        "name": "bakpak",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by nes and egghead — under 13KB of pure craft.",
        "about": "bakpak is a arcade game by nes and egghead, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for bakpak to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: nes and egghead",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/bakpak.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/bakpak",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 305,
        "slug": "pizza-undelivery",
        "name": "Pizza Undelivery",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by Niki Gawlik — under 13KB of pure craft.",
        "about": "Pizza Undelivery is a arcade game by Niki Gawlik, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for Pizza Undelivery to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Niki Gawlik",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/pizza-undelivery.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/pizza-undelivery",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 306,
        "slug": "we-must-go-back",
        "name": "We Must Go Back!",
        "category": "arcade",
        "tagline": "A 2019 js13kGames entry by ByGm3 — under 13KB of pure craft.",
        "about": "We Must Go Back! is a arcade game by ByGm3, submitted to the js13kGames 2019 competition. Like every js13k entry, it was built from scratch in under 13 kilobytes — code, art, audio and all — which is an extraordinary constraint that forces clever, focused design. It was recognised in the 2019 competition.\n\nThis entry is part of our catalogue because it represents the spirit of the size-limited game jam: complete, playable experiences distilled to their essence. Play it on the official js13k showcase to see what fits in 13KB. (This is a factual placeholder — a full review will follow.)",
        "howToPlay": "Most js13kGames entries use keyboard or mouse controls. Click through to the official js13kGames page for We Must Go Back! to see the in-game instructions, as controls vary per entry.\n\nGenerally: arrow keys or WASD for movement, mouse for point-and-click titles, and space for primary actions. Many entries display their controls on a title screen. (This is a factual placeholder — specific controls will be documented in the full guide.)",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: ByGm3",
            "Competition-recognised entry"
        ],
        "screenshots": [
            "/screenshots/we-must-go-back.jpg"
        ],
        "sourceName": "js13kGames",
        "sourceUrl": "https://js13kgames.com/2019/games/we-must-go-back",
        "licence": "source-available",
        "tags": [
            "13kb",
            "skill-based",
            "quick-fix",
            "experimental"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "2019",
        "featured": false
    },
    {
        "id": 307,
        "slug": "3d-hartwing-chess-set",
        "name": "3D Hartwing Chess Set",
        "category": "strategy",
        "tagline": "3D chess game done in HTML/CSS/JS",
        "about": "3D Hartwing Chess Set — 3D chess game done in HTML/CSS/JS. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Boardgame\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for 3D Hartwing Chess Set vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Boardgame",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "3D Hartwing Chess Set",
        "sourceUrl": "http://codepen.io/juliangarnier/full/BsIih",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 308,
        "slug": "c4",
        "name": "c4",
        "category": "strategy",
        "tagline": "Connect Four game, with AI, in HTML/CSS/JS",
        "about": "c4 — Connect Four game, with AI, in HTML/CSS/JS. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Boardgame\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for c4 vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Boardgame",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "c4",
        "sourceUrl": "https://kenrick95.github.io/c4/demo/",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 309,
        "slug": "desperate-gods",
        "name": "Desperate Gods",
        "category": "strategy",
        "tagline": "Free online board game that was designed to be played just like a board game ...",
        "about": "Desperate Gods — Free online board game that was designed to be played just like a board game in real-life: no rules are enforced by the computer. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Boardgame\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Desperate Gods vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Boardgame",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Desperate Gods",
        "sourceUrl": "http://www.wolfire.com/desperate-gods",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 310,
        "slug": "lichess",
        "name": "Lichess",
        "category": "strategy",
        "tagline": "Free chess game using HTML5 & websockets, built with Scala, Play 2.1, MongoDB...",
        "about": "Lichess — Free chess game using HTML5 & websockets, built with Scala, Play 2.1, MongoDB and Elasticsearch. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Boardgame\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Lichess vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Boardgame",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Lichess",
        "sourceUrl": "http://lichess.org/",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 311,
        "slug": "alge-s-escapade",
        "name": "Alge's Escapade",
        "category": "arcade",
        "tagline": "HTML5, JavaScript, GameJs arcade game where you control an Algae",
        "about": "Alge's Escapade — HTML5, JavaScript, GameJs arcade game where you control an Algae. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Alge's Escapade vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Alge's Escapade",
        "sourceUrl": "http://dave-and-mike.github.io/game-off-2012/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 312,
        "slug": "alien-invasion",
        "name": "Alien Invasion",
        "category": "arcade",
        "tagline": "Demo Game for Mobile HTML5 Game Development",
        "about": "Alien Invasion — Demo Game for Mobile HTML5 Game Development. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Alien Invasion vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Alien Invasion",
        "sourceUrl": "http://cykod.github.io/AlienInvasion/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 313,
        "slug": "arashi",
        "name": "Arashi",
        "category": "arcade",
        "tagline": "Arashi is a clone of the Arcade game Tempest",
        "about": "Arashi — Arashi is a clone of the Arcade game Tempest. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Arashi vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Arashi",
        "sourceUrl": "http://stephank.github.io/arashi-js/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 314,
        "slug": "asteroids",
        "name": "Asteroids",
        "category": "arcade",
        "tagline": "Pure JavaScript asteroids",
        "about": "Asteroids — Pure JavaScript asteroids. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Asteroids vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Asteroids",
        "sourceUrl": "http://dougmcinnes.com/html-5-asteroids/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 315,
        "slug": "avabranch",
        "name": "Avabranch",
        "category": "arcade",
        "tagline": "GitHub Game Off 2012 entry",
        "about": "Avabranch — GitHub Game Off 2012 entry. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Avabranch vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Avabranch",
        "sourceUrl": "http://avabranch.zolmeister.com/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 316,
        "slug": "ball-and-wall",
        "name": "Ball And Wall",
        "category": "arcade",
        "tagline": "Pure JavaScript arkanoid style game",
        "about": "Ball And Wall — Pure JavaScript arkanoid style game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Ball And Wall vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Ball And Wall",
        "sourceUrl": "http://ballandwall.com/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 317,
        "slug": "captain-rogers",
        "name": "Captain Rogers",
        "category": "arcade",
        "tagline": "Captain Rogers: Asteroid Belt of Sirius - HTML5 mobile game created using Imp...",
        "about": "Captain Rogers — Captain Rogers: Asteroid Belt of Sirius - HTML5 mobile game created using ImpactJS. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Captain Rogers vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Captain Rogers",
        "sourceUrl": "http://enclavegames.com/games/captain-rogers/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 318,
        "slug": "coil",
        "name": "Coil",
        "category": "arcade",
        "tagline": "HTML5 canvas game where you defeat enemies by wrapping enemies in your trail",
        "about": "Coil — HTML5 canvas game where you defeat enemies by wrapping enemies in your trail. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Coil vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Coil",
        "sourceUrl": "http://hakim.se/experiments/html5/coil/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 319,
        "slug": "color-quest",
        "name": "Color Quest",
        "category": "arcade",
        "tagline": "Infinite runner following a black and white pixel's quest to change into a co...",
        "about": "Color Quest — Infinite runner following a black and white pixel's quest to change into a color pixel. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Color Quest vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Color Quest",
        "sourceUrl": "http://redbluegames.com/game-off-2013/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 320,
        "slug": "custom-tetris",
        "name": "Custom Tetris",
        "category": "arcade",
        "tagline": "Play the classic Tetris game the way you like it",
        "about": "Custom Tetris — Play the classic Tetris game the way you like it. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Custom Tetris vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Custom Tetris",
        "sourceUrl": "http://ondras.github.io/custom-tetris/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 321,
        "slug": "drill-bunny",
        "name": "Drill Bunny",
        "category": "arcade",
        "tagline": "Written in JavaScript and using the great Phaser library",
        "about": "Drill Bunny — Written in JavaScript and using the great Phaser library. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Drill Bunny vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Drill Bunny",
        "sourceUrl": "http://dreamshowadventures.github.io/LudumDare29/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 322,
        "slug": "duckhunt-js",
        "name": "DuckHunt JS",
        "category": "arcade",
        "tagline": "DuckHunt ported to JS and HTML5 with a level creator",
        "about": "DuckHunt JS — DuckHunt ported to JS and HTML5 with a level creator. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for DuckHunt JS vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "DuckHunt JS",
        "sourceUrl": "http://mattsurabian.com/duckhunt/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 323,
        "slug": "flxinvaders",
        "name": "FlxInvaders",
        "category": "arcade",
        "tagline": "Very simple Flixel game inspired by the Taito classic",
        "about": "FlxInvaders — Very simple Flixel game inspired by the Taito classic. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for FlxInvaders vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "FlxInvaders",
        "sourceUrl": "http://flixel.org/flxinvaders/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 324,
        "slug": "flxteroids",
        "name": "FlxTeroids",
        "category": "arcade",
        "tagline": "Very simple Flixel game inspired by the classic arcade shooter",
        "about": "FlxTeroids — Very simple Flixel game inspired by the classic arcade shooter. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for FlxTeroids vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "FlxTeroids",
        "sourceUrl": "http://www.flixel.org/flxteroids/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 325,
        "slug": "grave-robbers",
        "name": "Grave Robbers",
        "category": "arcade",
        "tagline": "Sort of GIRP-inspired tower defense",
        "about": "Grave Robbers — Sort of GIRP-inspired tower defense. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Grave Robbers vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Grave Robbers",
        "sourceUrl": "http://adamatomic.com/graverobbers",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 326,
        "slug": "hurry",
        "name": "hurry!",
        "category": "arcade",
        "tagline": "Small but speedy arcade shooter",
        "about": "hurry! — Small but speedy arcade shooter. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for hurry! vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "hurry!",
        "sourceUrl": "http://hughsk.io/ludum-dare-27/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 327,
        "slug": "hyperspace-garbage-collector",
        "name": "Hyperspace Garbage Collector",
        "category": "arcade",
        "tagline": "General Hyperspace Waste Management Solutions",
        "about": "Hyperspace Garbage Collector — General Hyperspace Waste Management Solutions. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Hyperspace Garbage Collector vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Hyperspace Garbage Collector",
        "sourceUrl": "http://razh.github.io/game-off-2013/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 328,
        "slug": "i-spy-a-ghost",
        "name": "I Spy A Ghost",
        "category": "arcade",
        "tagline": "an experimental p2p multiplayer game made in HTML5/Phaser using WebRTC",
        "about": "I Spy A Ghost — an experimental p2p multiplayer game made in HTML5/Phaser using WebRTC. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for I Spy A Ghost vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "I Spy A Ghost",
        "sourceUrl": "http://omarshehata.me/html/ludum/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 329,
        "slug": "jekyll-hyde-collide",
        "name": "Jekyll & Hyde Collide",
        "category": "arcade",
        "tagline": "Multi-layered infinite side-scroller",
        "about": "Jekyll & Hyde Collide — Multi-layered infinite side-scroller. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Jekyll & Hyde Collide vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Jekyll & Hyde Collide",
        "sourceUrl": "http://awesome-interactive.github.io/game-off-2013/ExportedGame.html",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 330,
        "slug": "mega-girl",
        "name": "Mega Girl",
        "category": "arcade",
        "tagline": "Megaman inspired game",
        "about": "Mega Girl — Megaman inspired game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Mega Girl vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Mega Girl",
        "sourceUrl": "http://www.renegadeware.com/web_games/megagirl/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 331,
        "slug": "mode",
        "name": "Mode",
        "category": "arcade",
        "tagline": "Small(but sadly not that simple) demo game built on the Flixel framework",
        "about": "Mode — Small(but sadly not that simple) demo game built on the Flixel framework. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Mode vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Mode",
        "sourceUrl": "http://www.adamatomic.com/mode/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 332,
        "slug": "monster-wants-candy",
        "name": "Monster Wants Candy",
        "category": "arcade",
        "tagline": "Simple HTML5 game created with Phaser 2.0.7",
        "about": "Monster Wants Candy — Simple HTML5 game created with Phaser 2.0.7. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Monster Wants Candy vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Monster Wants Candy",
        "sourceUrl": "http://candy-demo.enclavegames.com/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 333,
        "slug": "octocat-jump",
        "name": "Octocat Jump",
        "category": "arcade",
        "tagline": "GitHub Game Off 2012 Entry",
        "about": "Octocat Jump — GitHub Game Off 2012 Entry. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Octocat Jump vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Octocat Jump",
        "sourceUrl": "http://ogoshen.github.io/game-off-2012/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 334,
        "slug": "onslaught-arena",
        "name": "Onslaught Arena",
        "category": "arcade",
        "tagline": "Fight off hordes of classic medieval monsters in this fast paced arcade shooter!",
        "about": "Onslaught Arena — Fight off hordes of classic medieval monsters in this fast paced arcade shooter!. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Onslaught Arena vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Onslaught Arena",
        "sourceUrl": "http://arcade.lostdecadegames.com/onslaught_arena/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 335,
        "slug": "polybranch",
        "name": "PolyBranch",
        "category": "arcade",
        "tagline": "Minimalist 3D game. Dodging branches may seem easy at first, but how long can...",
        "about": "PolyBranch — Minimalist 3D game. Dodging branches may seem easy at first, but how long can you hold up as you approach terminal velocity?. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for PolyBranch vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "PolyBranch",
        "sourceUrl": "http://gregbatha.com/branches/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 336,
        "slug": "save-the-forest",
        "name": "Save The Forest",
        "category": "arcade",
        "tagline": "Save the burning forest!",
        "about": "Save The Forest — Save the burning forest!. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Save The Forest vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Save The Forest",
        "sourceUrl": "http://js13kgames.com/games/save-the-forest/index.html",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 337,
        "slug": "snake",
        "name": "Snake",
        "category": "arcade",
        "tagline": "Clone of the classic Snake game",
        "about": "Snake — Clone of the classic Snake game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Snake vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Snake",
        "sourceUrl": "http://diz.es/snake/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 338,
        "slug": "snake-new",
        "name": "Snake_new",
        "category": "arcade",
        "tagline": "Classic nokia snake game using web",
        "about": "Snake_new — Classic nokia snake game using web. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Snake_new vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Snake_new",
        "sourceUrl": "https://rabiroshan.github.io/snake_game/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 339,
        "slug": "space-shooter",
        "name": "Space-Shooter",
        "category": "arcade",
        "tagline": "A classic shoot'em up space shooter build in HTML5 with multiplayer",
        "about": "Space-Shooter — A classic shoot'em up space shooter build in HTML5 with multiplayer. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Space-Shooter vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Space-Shooter",
        "sourceUrl": "http://couchfriends.com/games/5",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 340,
        "slug": "spashal",
        "name": "Spashal",
        "category": "arcade",
        "tagline": "Danger lurks around every corner in space",
        "about": "Spashal — Danger lurks around every corner in space. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Spashal vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Spashal",
        "sourceUrl": "http://mrrar.github.io/spashal/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 341,
        "slug": "square-off",
        "name": "Square Off!",
        "category": "arcade",
        "tagline": "multiplayer 1v1 air-hockey style game, place squares to deflect the ball",
        "about": "Square Off! — multiplayer 1v1 air-hockey style game, place squares to deflect the ball. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Square Off! vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Square Off!",
        "sourceUrl": "http://sqoff.com/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 342,
        "slug": "sorades-13k",
        "name": "SORADES 13K",
        "category": "arcade",
        "tagline": "Scrolling shooter in the vein of \"Raptor: Call of the Shadows\" and \"Warning F...",
        "about": "SORADES 13K — Scrolling shooter in the vein of \"Raptor: Call of the Shadows\" and \"Warning Forever\". Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for SORADES 13K vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "SORADES 13K",
        "sourceUrl": "http://maettig.com/code/canvas/starship-sorades-13k/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 343,
        "slug": "space-invaders",
        "name": "Space Invaders",
        "category": "arcade",
        "tagline": "Remake of Space Invaders in require.js",
        "about": "Space Invaders — Remake of Space Invaders in require.js. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Space Invaders vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Space Invaders",
        "sourceUrl": "http://strykerkkd.github.io/SpaceInvaders/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 344,
        "slug": "super-mario-bros",
        "name": "Super Mario Bros",
        "category": "arcade",
        "tagline": "Super Mario Bros level one written with Backbone Game Engine",
        "about": "Super Mario Bros — Super Mario Bros level one written with Backbone Game Engine. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Super Mario Bros vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Super Mario Bros",
        "sourceUrl": "http://martindrapeau.github.io/backbone-game-engine/super-mario-bros/index.html",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 345,
        "slug": "survivor",
        "name": "Survivor",
        "category": "arcade",
        "tagline": "Playable HTML + CSS + JavaScript remake of a space-based \"shoot-'em-up\" arcad...",
        "about": "Survivor — Playable HTML + CSS + JavaScript remake of a space-based \"shoot-'em-up\" arcade game for Atari / Commodore 64 from 1982, including a level editor and design tool. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Arcade\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Survivor vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Arcade",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Survivor",
        "sourceUrl": "http://www.schillmania.com/survivor/",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "retro"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 346,
        "slug": "bananabread",
        "name": "BananaBread",
        "category": "action",
        "tagline": "Port of the Cube 2/Sauerbraten 3D game engine/first person shooter to the web...",
        "about": "BananaBread — Port of the Cube 2/Sauerbraten 3D game engine/first person shooter to the web, compiling C++ and OpenGL to JavaScript and WebGL using Emscripten. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"FPS\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for BananaBread vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: FPS",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "BananaBread",
        "sourceUrl": "https://kripken.github.io/BananaBread/cube2/bb.html",
        "licence": "source-available",
        "tags": [
            "skill-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 347,
        "slug": "diablo-js",
        "name": "Diablo JS",
        "category": "simulation",
        "tagline": "Isometric minimal-code style game at html5 canvas and javascript",
        "about": "Diablo JS — Isometric minimal-code style game at html5 canvas and javascript. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"RPG\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Diablo JS vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: RPG",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Diablo JS",
        "sourceUrl": "http://mitallast.github.io/diablo-js/",
        "licence": "source-available",
        "tags": [
            "sandbox",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 348,
        "slug": "tap-tap-adventure",
        "name": "Tap Tap Adventure",
        "category": "simulation",
        "tagline": "Expansion of BrowserQuest",
        "about": "Tap Tap Adventure — Expansion of BrowserQuest. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"MMORPG\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Tap Tap Adventure vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: MMORPG",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Tap Tap Adventure",
        "sourceUrl": "http://taptapadventure.com/play",
        "licence": "source-available",
        "tags": [
            "sandbox",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 349,
        "slug": "ancient-beast",
        "name": "Ancient Beast",
        "category": "strategy",
        "tagline": "Materialize and control beasts in order to defeat your opponents!",
        "about": "Ancient Beast — Materialize and control beasts in order to defeat your opponents!. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Strategy\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Ancient Beast vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Strategy",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Ancient Beast",
        "sourceUrl": "http://ancientbeast.com/play",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 350,
        "slug": "command-conquer",
        "name": "Command & Conquer",
        "category": "strategy",
        "tagline": "Clone of the popular RTS",
        "about": "Command & Conquer — Clone of the popular RTS. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Strategy\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Command & Conquer vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Strategy",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Command & Conquer",
        "sourceUrl": "http://www.adityaravishankar.com/projects/games/command-and-conquer/",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 351,
        "slug": "hexa-battle",
        "name": "Hexa Battle",
        "category": "strategy",
        "tagline": "A turn based dungeon crawler written with Typescript, using React and SVG",
        "about": "Hexa Battle — A turn based dungeon crawler written with Typescript, using React and SVG. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Strategy\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Hexa Battle vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Strategy",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Hexa Battle",
        "sourceUrl": "http://giacomotag.io/hb/",
        "licence": "source-available",
        "tags": [
            "turn-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 352,
        "slug": "hexgl-game",
        "name": "HexGL",
        "category": "racing-sports",
        "tagline": "Futuristic HTML5 racing game by Thibaut Despoulain using HTML5, Javascript an...",
        "about": "HexGL — Futuristic HTML5 racing game by Thibaut Despoulain using HTML5, Javascript and WebGL. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Racing\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for HexGL vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Racing",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "HexGL",
        "sourceUrl": "http://hexgl.bkcore.com/",
        "licence": "source-available",
        "tags": [
            "skill-based",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 353,
        "slug": "3d-city",
        "name": "3d.city",
        "category": "simulation",
        "tagline": "3d city builder game",
        "about": "3d.city — 3d city builder game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Sandbox\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for 3d.city vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Sandbox",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "3d.city",
        "sourceUrl": "http://lo-th.github.io/3d.city/index.html",
        "licence": "source-available",
        "tags": [
            "sandbox",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 354,
        "slug": "blk-game",
        "name": "Blk Game",
        "category": "simulation",
        "tagline": "Multiplayer Javascript/WebGL voxel world game demo",
        "about": "Blk Game — Multiplayer Javascript/WebGL voxel world game demo. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Sandbox\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Blk Game vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Sandbox",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Blk Game",
        "sourceUrl": "http://benvanik.github.io/blk-game/",
        "licence": "source-available",
        "tags": [
            "sandbox",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 355,
        "slug": "cube-engine",
        "name": "Cube Engine",
        "category": "simulation",
        "tagline": "3D engine completely written in HTML5 without OpenGL",
        "about": "Cube Engine — 3D engine completely written in HTML5 without OpenGL. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Sandbox\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Cube Engine vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Sandbox",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Cube Engine",
        "sourceUrl": "http://nurgak.github.io/Cube-engine/",
        "licence": "source-available",
        "tags": [
            "sandbox",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 356,
        "slug": "0hh0",
        "name": "0hh0",
        "category": "puzzle",
        "tagline": "Companion game to 0hh1 by Q42",
        "about": "0hh0 — Companion game to 0hh1 by Q42. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for 0hh0 vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "0hh0",
        "sourceUrl": "http://0hh0.com",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 357,
        "slug": "0hh1",
        "name": "0hh1",
        "category": "puzzle",
        "tagline": "Lovely little logic game by Q42",
        "about": "0hh1 — Lovely little logic game by Q42. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for 0hh1 vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "0hh1",
        "sourceUrl": "http://0hh1.com",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 358,
        "slug": "2048-game",
        "name": "2048",
        "category": "puzzle",
        "tagline": "Sliding addition game",
        "about": "2048 — Sliding addition game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for 2048 vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "2048",
        "sourceUrl": "http://gabrielecirulli.github.io/2048/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 359,
        "slug": "a-dark-room",
        "name": "A Dark Room",
        "category": "puzzle",
        "tagline": "Minimalist Text Adventure game written in JavaScript",
        "about": "A Dark Room — Minimalist Text Adventure game written in JavaScript. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for A Dark Room vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "A Dark Room",
        "sourceUrl": "http://adarkroom.doublespeakgames.com/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 360,
        "slug": "anagramica",
        "name": "Anagramica",
        "category": "puzzle",
        "tagline": "A word game and API for anagrams",
        "about": "Anagramica — A word game and API for anagrams. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Anagramica vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Anagramica",
        "sourceUrl": "http://www.anagramica.com/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 361,
        "slug": "astry",
        "name": "Astry",
        "category": "puzzle",
        "tagline": "WebGL maze game built with Three.js and Box2dWeb",
        "about": "Astry — WebGL maze game built with Three.js and Box2dWeb. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Astry vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Astry",
        "sourceUrl": "http://wwwtyro.github.io/Astray/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 362,
        "slug": "beatrix",
        "name": "Beatrix",
        "category": "puzzle",
        "tagline": "Music game where you arrange the drums to catch the beats and play the right ...",
        "about": "Beatrix — Music game where you arrange the drums to catch the beats and play the right rhythm. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Beatrix vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Beatrix",
        "sourceUrl": "http://gamejolt.com/games/puzzle/beatrix/27454/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 363,
        "slug": "blockrain-js",
        "name": "Blockrain.js",
        "category": "puzzle",
        "tagline": "Embed & play the classic game on your site. Simple as that",
        "about": "Blockrain.js — Embed & play the classic game on your site. Simple as that. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Blockrain.js vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Blockrain.js",
        "sourceUrl": "http://aerolab.github.io/blockrain.js/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 364,
        "slug": "clone-man",
        "name": "Clone Man",
        "category": "puzzle",
        "tagline": "Puzzle, memory, retro game with simple graphics",
        "about": "Clone Man — Puzzle, memory, retro game with simple graphics. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Clone Man vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Clone Man",
        "sourceUrl": "http://www.kongregate.com/games/Sorobaid/clone-man",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 365,
        "slug": "couch-2048",
        "name": "Couch 2048",
        "category": "puzzle",
        "tagline": "A physics-based puzzle, loosely related to the original 2048 game",
        "about": "Couch 2048 — A physics-based puzzle, loosely related to the original 2048 game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Couch 2048 vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Couch 2048",
        "sourceUrl": "http://js13kgames.com/games/couch-2048/index.html",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 366,
        "slug": "cube-composer",
        "name": "cube-composer",
        "category": "puzzle",
        "tagline": "A puzzle game inspired by functional programming",
        "about": "cube-composer — A puzzle game inspired by functional programming. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for cube-composer vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "cube-composer",
        "sourceUrl": "http://david-peter.de/cube-composer",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 367,
        "slug": "drunken-viking",
        "name": "Drunken Viking",
        "category": "puzzle",
        "tagline": "Retrace your drunken rampage in reverse time",
        "about": "Drunken Viking — Retrace your drunken rampage in reverse time. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Drunken Viking vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Drunken Viking",
        "sourceUrl": "http://congusbongus.itch.io/drunken-viking",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 368,
        "slug": "ending",
        "name": "Ending",
        "category": "puzzle",
        "tagline": "Roguelike puzzle game",
        "about": "Ending — Roguelike puzzle game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Ending vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: author site"
        ],
        "screenshots": [],
        "sourceName": "Ending",
        "sourceUrl": "http://robotacid.com/flash/ending/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 369,
        "slug": "for-king",
        "name": "For King",
        "category": "puzzle",
        "tagline": "Puzzle platformer game about a king in search for his lost crown",
        "about": "For King — Puzzle platformer game about a king in search for his lost crown. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for For King vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "For King",
        "sourceUrl": "http://www.newgrounds.com/dump/item/1cc54f046fa51768d8169e65121b0af0",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 370,
        "slug": "hex-2048",
        "name": "Hex 2048",
        "category": "puzzle",
        "tagline": "Hexgrid-based clone of 2048",
        "about": "Hex 2048 — Hexgrid-based clone of 2048. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Hex 2048 vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Hex 2048",
        "sourceUrl": "https://jeffhou.github.io/hex-2048/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 371,
        "slug": "hexahedral",
        "name": "Hexahedral",
        "category": "puzzle",
        "tagline": "Push down all the blocks in the minimum number of moves",
        "about": "Hexahedral — Push down all the blocks in the minimum number of moves. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Hexahedral vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Hexahedral",
        "sourceUrl": "http://matthewminer.com/hexahedral",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 372,
        "slug": "hextris-game",
        "name": "Hextris",
        "category": "puzzle",
        "tagline": "Addictive puzzle game inspired by Tetris",
        "about": "Hextris — Addictive puzzle game inspired by Tetris. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Hextris vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Hextris",
        "sourceUrl": "http://hextris.io/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 373,
        "slug": "infectors",
        "name": "Infectors",
        "category": "puzzle",
        "tagline": "Sokoban-like puzzle game developed with Phaser",
        "about": "Infectors — Sokoban-like puzzle game developed with Phaser. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Infectors vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Infectors",
        "sourceUrl": "http://satanas.github.io/infectors/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 374,
        "slug": "monkey-rally",
        "name": "Monkey Rally",
        "category": "puzzle",
        "tagline": "JavaScript game created for the Ludum Dare #28 jam",
        "about": "Monkey Rally — JavaScript game created for the Ludum Dare #28 jam. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Monkey Rally vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Monkey Rally",
        "sourceUrl": "http://antila.github.io/ludum-dare-28/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 375,
        "slug": "orbium",
        "name": "Orbium",
        "category": "puzzle",
        "tagline": "Modern version of the 90's game Log!cal",
        "about": "Orbium — Modern version of the 90's game Log!cal. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Orbium vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Orbium",
        "sourceUrl": "http://bni.github.io/orbium/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 376,
        "slug": "parity",
        "name": "Parity",
        "category": "puzzle",
        "tagline": "A numbers puzzle game",
        "about": "Parity — A numbers puzzle game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Parity vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Parity",
        "sourceUrl": "http://abefehr.com/parity/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 377,
        "slug": "pond",
        "name": "Pond",
        "category": "puzzle",
        "tagline": "A narrow fellow in the Pond",
        "about": "Pond — A narrow fellow in the Pond. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Pond vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Pond",
        "sourceUrl": "http://thepond.zolmeister.com/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 378,
        "slug": "pop-pop-win",
        "name": "Pop Pop Win",
        "category": "puzzle",
        "tagline": "Implementation of Minesweeper in Dart",
        "about": "Pop Pop Win — Implementation of Minesweeper in Dart. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Pop Pop Win vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Pop Pop Win",
        "sourceUrl": "http://dart-lang.github.io/sample-pop_pop_win/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 379,
        "slug": "push-and-fork",
        "name": "Push and Fork",
        "category": "puzzle",
        "tagline": "Puzzle game in which you carry a fork, push blocks, and go back in time.",
        "about": "Push and Fork — Puzzle game in which you carry a fork, push blocks, and go back in time.. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Push and Fork vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Push and Fork",
        "sourceUrl": "http://gelisam.com/octocarina/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 380,
        "slug": "shape-experiment",
        "name": "Shape Experiment",
        "category": "puzzle",
        "tagline": "The shape recognition reflex game",
        "about": "Shape Experiment — The shape recognition reflex game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Shape Experiment vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Shape Experiment",
        "sourceUrl": "http://shapex.org/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 381,
        "slug": "swap",
        "name": "Swap",
        "category": "puzzle",
        "tagline": "New(award winning) take on the classic tile-based puzzle game, where you chan...",
        "about": "Swap — New(award winning) take on the classic tile-based puzzle game, where you change which character you're controlling to reach your goal. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Swap vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Swap",
        "sourceUrl": "http://nmoroze.github.io/swap/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 382,
        "slug": "transcube",
        "name": "TransCube",
        "category": "puzzle",
        "tagline": "2d puzzle platformer based on the concept of transforming into different \"blo...",
        "about": "TransCube — 2d puzzle platformer based on the concept of transforming into different \"blocks\", with their unique properties, and making you way to the end of the level with the provided transformations. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for TransCube vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "TransCube",
        "sourceUrl": "http://code.jerev.be/ggo13-transcube/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 383,
        "slug": "zoko",
        "name": "Zoko",
        "category": "puzzle",
        "tagline": "3D version of Sokoban",
        "about": "Zoko — 3D version of Sokoban. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Zoko vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Zoko",
        "sourceUrl": "http://lulea.github.io/game-off-2012/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 384,
        "slug": "zop",
        "name": "Zop",
        "category": "puzzle",
        "tagline": "Connect like colors",
        "about": "Zop — Connect like colors. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Puzzle\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Zop vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Puzzle",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Zop",
        "sourceUrl": "https://zop.zolmeister.com/",
        "licence": "source-available",
        "tags": [
            "brain-burner",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 385,
        "slug": "particle-clicker",
        "name": "Particle Clicker",
        "category": "simulation",
        "tagline": "Addictive incremental game that teaches players the history of high energy pa...",
        "about": "Particle Clicker — Addictive incremental game that teaches players the history of high energy particle physics. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Clicker\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Particle Clicker vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Clicker",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Particle Clicker",
        "sourceUrl": "http://cern.ch/particle-clicker",
        "licence": "source-available",
        "tags": [
            "sandbox",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 386,
        "slug": "binb",
        "name": "binb",
        "category": "arcade",
        "tagline": "Competitive, multiplayer, realtime, guess the song game",
        "about": "binb — Competitive, multiplayer, realtime, guess the song game. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Others\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for binb vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Others",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "binb",
        "sourceUrl": "https://binb.co",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 387,
        "slug": "dental-defender-saga-of-the-candy-horde",
        "name": "Dental Defender: Saga of the Candy Horde",
        "category": "arcade",
        "tagline": "HTML5 shooter/tower defense game for the #CandyJam",
        "about": "Dental Defender: Saga of the Candy Horde — HTML5 shooter/tower defense game for the #CandyJam. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Others\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Dental Defender: Saga of the Candy Horde vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Others",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Dental Defender: Saga of the Candy Horde",
        "sourceUrl": "http://cas002.itch.io/dental-defenders-saga-of-the-candy-horde",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 388,
        "slug": "the-killer",
        "name": "The Killer",
        "category": "arcade",
        "tagline": "Flash/ActionScript3-based \"nongame\"",
        "about": "The Killer — Flash/ActionScript3-based \"nongame\". Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Others\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for The Killer vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Others",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "The Killer",
        "sourceUrl": "http://www.gametrekking.com/the-games/cambodia/the-killer/play-now",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    },
    {
        "id": 389,
        "slug": "turkey-cooking-simulator",
        "name": "Turkey Cooking Simulator",
        "category": "arcade",
        "tagline": "You have been invited to craft the centerpiece of the American thanksgiving d...",
        "about": "Turkey Cooking Simulator — You have been invited to craft the centerpiece of the American thanksgiving dinner, the turkey. Woo your girlfriend / boyfriend and be judged by your future in-laws! Apply your culinary expertise to impress your family. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the \"Others\" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.",
        "howToPlay": "Controls for Turkey Cooking Simulator vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)",
        "keyFeatures": [
            "Open-source browser game",
            "Genre: Others",
            "Source: GitHub"
        ],
        "screenshots": [],
        "sourceName": "Turkey Cooking Simulator",
        "sourceUrl": "http://fernjager.github.io/game-off-2013/index.html",
        "licence": "source-available",
        "tags": [
            "quick-fix",
            "open-source",
            "classic"
        ],
        "addedDate": "2026-07-08",
        "releaseDate": "unknown",
        "featured": false
    }
];
