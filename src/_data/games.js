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
        "about": "Play with your keyboard and race against the clock in this eerie pixel-art resource simulation game. js13k-2025-ashes-of-ulthar (See changelog below for more information on changes, bug fixes, etc.) Unguided and seeking, you find yourself drawn to the village of Ulthar. Your sudden presence is a reminder of the incident with their cats decades ago, but your influence soon drowns out the villagers' alarm. \n\nAshes of Ulthar was submitted to the js13kGames 2025 competition by Elliot Nelson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. As otherworldly ashes fall from the sky, you begin preparations.",
        "howToPlay": "Play with your keyboard and race against the clock in this eerie pixel-art resource simulation game.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "✨ Nyx Felis and Lampyris ✨ You are Lampyris, guide of fireflies in the eternal night. Move through the darkness to collect fireflies and deliver them to Nyx Felis in the Sky to sustain the night. Technical Details MIT License - see LICENSE for details. \n\nNyx Felis and Lampyris was submitted to the js13kGames 2025 competition by Afton Gauntlett. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Move through the darkness to collect fireflies and deliver them to Nyx Felis in the Sky to sustain the night.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "A* Pathfinding for HTML5 Canvas Tutorial by Christer (McFunkypants) Kaitila Sprites Summer Plains by schwarnhild Sprites Enemy by BTL games Hide before the killer finds you and pray that he won't find your spot. A hide and seek game using Canvas. \n\nCry in The 13th was submitted to the js13kGames 2024 competition by Diego Soria Rios. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Cry in The 13th uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "\"The 13th Door\" is a point and click animated adventure game written for the 2024 js13kGames contest. You can also use the items in your inventory by clicking on them and then clicking on the thing you want to use it on. You control Pip, who has Triskaidekaphobia, the fear of the number 13. \n\nThe 13th Door was submitted to the js13kGames 2024 competition by Lance Ewing. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. His doctor has recommended a session within the \"Exposure Therapy\" escape room as a way to cure his fear.",
        "howToPlay": "\"The 13th Door\" is a point and click animated adventure game written for the 2024 js13kGames contest. You control Pip, who has Triskaidekaphobia, the fear of the number 13. Control Pip by using the Walk to, Look at, Pick up, Use and Push icons at the bottom of the screen.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "featured": true
    },
    {
        "id": 22,
        "slug": "age-of-the-demigods",
        "name": "Age of The Demigods",
        "category": "arcade",
        "tagline": "Play Hercules in the 13th century — an RPG that fits stats, combat and story into 13KB.",
        "about": "Age of the Demigods is a role-playing game submitted to js13kGames 2023 (theme: \"13th Century\"). You play as Hercules facing a challenge, with the game set in the 13th century — a deliberate fusion of classical mythology and medieval history that gives the entry a distinctive flavor compared to the historically-grounded or pure-fantasy entries typical of the theme.\n\nAs an RPG in 13 kilobytes, the game faces the steepest compression challenge of any genre: RPGs rely on text, stats, multiple systems, and progression depth, all of which consume bytes aggressively. The developer notes that the source main.js is \"HUGE\" before heavy compression, optimization, and maximum-level ZIP — a candid look at the gap between development source and shipped product in the jam format.\n\nAge of the Demigods earned top recognition in the 2023 competition. For players interested in how much RPG depth can survive the 13KB constraint, it is a compelling case study — and the Hercules-in-the-13th-century premise gives it narrative hooks that pure-mechanics jam entries lack.",
        "howToPlay": "Age of the Demigods is an RPG — expect character-driven combat and progression rather than reflex-based action. Consult the in-game title screen for specific controls, as RPGs typically customize their input schemes around menus and combat actions.\n\nAs Hercules facing a challenge in a 13th-century setting, approach encounters strategically: RPG combat rewards understanding enemy weaknesses and managing your abilities over brute-force aggression. Explore dialogue and descriptions for clues about the challenge ahead.\n\nNote: the developer did not include full assets in the public repo to prevent game theft, so the source is a reference for structure rather than a playable fork.",
        "keyFeatures": [
            "RPG starring Hercules, set in the 13th century (mythology meets history)",
            "Fits RPG systems — stats, combat, progression — into 13 kilobytes",
            "Heavy compression pipeline (source is \"HUGE\" pre-optimization)",
            "Top recognition in js13k 2023"
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
        "featured": true
    },
    {
        "id": 23,
        "slug": "13c-defense",
        "name": "13C Defense",
        "category": "strategy",
        "tagline": "A 13KB tower defense against the Mongol army — defend the gate, pick your upgrades.",
        "about": "13C Defense is a tower-defense game built for the js13kGames 2023 competition, whose theme was the 13th Century. The developer drew on real medieval history for the setting: you defend a gate against waves of Mongol army units advancing along a fixed path, inspired by battles like the historical Battle of Cheoin.\n\nAs a defense game, the loop is familiar — enemies march toward your gate and you must eliminate them before they breach it. What makes 13C Defense notable is how much it fits inside the brutal 13-kilobyte constraint: sprite art created in Aseprite, procedural sound effects generated with jsfxr, and a leveling system that lets you pick from abilities using the number keys. The pixel-art Mongol units and the period-appropriate setting give it more personality than the typical jam defense entry.\n\nIt earned top-tier recognition in the 2023 competition. For fans of the tower-defense genre, it is a compact, honest take on the format — no filler, no bloat, just a tight defense loop with a historical skin that actually means something.",
        "howToPlay": "Move your defender with the arrow keys. Enemies (Mongol units) advance along a set path toward your gate — eliminate them before they reach it.\n\nWhen you level up, you can choose from abilities offered on screen by pressing the number keys 1, 2, or 3. Pick abilities that counter the incoming wave type: area damage for clustered enemies, single-target burst for tough units, or economy boosts if you are falling behind.\n\nStrategy: do not chase enemies along the full path. Position near the gate where all converging lanes meet, so every shot has a target. Save your strongest ability charges for the later waves when the unit density spikes.",
        "keyFeatures": [
            "Tower defense set in the 13th-century Mongol invasions",
            "Historical inspiration from the Battle of Cheoin",
            "Level-up ability system (pick from 3 upgrades per level)",
            "Pixel art in Aseprite + procedural jsfxr sound — all under 13KB"
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
        "featured": true
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
        "featured": true
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
        "featured": true
    },
    {
        "id": 30,
        "slug": "escape-from-death-hole",
        "name": "Escape from Death Hole",
        "category": "arcade",
        "tagline": "Fall into a medieval catacomb, find the keys, escape — and don't let the un-DEATH catch you.",
        "about": "Escape from Death Hole is a dungeon-crawler submitted to js13kGames 2022, themed \"Death.\" The setup gives the death theme a narrative spine: the player falls down a sewer into the dark catacombs beneath a rich medieval city, where an underground accident has trapped tourists. To make matters worse, the catacombs are infested with the un-DEATH — and if they catch you, you transform into one of them.\n\nThe game spans ten levels, each requiring you to find a key to unlock the mechanism that lets you progress deeper toward the exit. This key-hunt structure gives every level a clear objective and turns exploration into purposeful navigation rather than wandering. The transformation mechanic — getting caught by the un-DEATH turns you into an enemy — adds genuine tension to movement; you are not just avoiding damage, you are avoiding conversion.\n\nIt earned top recognition in the 2022 competition among 167 entries. For players who enjoy atmospheric dungeon escape games with a stealth-survival edge, Escape from Death Hole is a compact, focused take on the format.",
        "howToPlay": "Escape from Death Hole uses standard movement controls:\n\n• WASD or Arrow keys to move the player\n• Escape or mouse click for interactions (consult title screen for exact bindings)\n\nEach of the ten levels requires you to find a key to unlock the exit mechanism. Explore methodically — the catacombs are dark and the un-DEATH patrol unpredictably.\n\nStrategy: above all, avoid the un-DEATH. Getting caught does not just cost health — it transforms you into one of them, ending your run. Treat the game as stealth-survival, not combat. Learn each level's layout, identify the key location, and plan a route that minimizes exposure to enemies before making your move.",
        "keyFeatures": [
            "Ten-level dungeon escape with key-hunt progression",
            "Transformation mechanic — caught by un-DEATH = you become one",
            "Atmospheric medieval catacomb setting (js13k 2022 \"Death\" theme)",
            "Top recognition among 167 entries"
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
        "featured": true
    },
    {
        "id": 31,
        "slug": "van-helsing",
        "name": "Van Helsing",
        "category": "arcade",
        "tagline": "Hunt creatures of the night as Van Helsing — a 13KB action game themed around Death.",
        "about": "Van Helsing is an action game built for js13kGames 2022, whose theme was \"Death.\" You play the legendary monster hunter facing down creatures of the night, and the death theme is woven into both the narrative and the mechanics rather than slapped on as a label.\n\nAs a compact action title, Van Helsing distills the monster-hunting fantasy into a tight browser experience. The 13-kilobyte constraint means every mechanic has to earn its bytes — there is no room for filler tutorials or decorative systems. What you get is pure combat: the core loop of identifying threats, positioning, and striking at the right moment.\n\nThe game earned top recognition in the 2022 competition, a year with 167 entries. For players who enjoy action games with a gothic horror flavor, Van Helsing offers a focused, no-fat experience that respects both your time and the genre's roots.",
        "howToPlay": "Van Helsing uses keyboard controls for movement and combat. Consult the in-game title screen for the exact key bindings, as jam entries often customize their control schemes.\n\nGeneral approach for monster-hunting action games: learn the enemy attack patterns before committing to aggressive play. Most creatures telegraph their strikes — watch for the wind-up animation and dodge before attacking during the recovery window. Prioritize the most dangerous enemies first (ranged attackers, fast movers) before cleaning up the slower ones.",
        "keyFeatures": [
            "Monster-hunting action game themed around Death (js13k 2022)",
            "Compact combat loop — every mechanic earns its bytes",
            "Gothic horror aesthetic in under 13 kilobytes",
            "Top-tier competition recognition among 167 entries"
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
        "featured": true
    },
    {
        "id": 32,
        "slug": "capturing-souls-on-the-river-of-the-dead",
        "name": "Capturing Souls on the River of The Dead",
        "category": "arcade",
        "tagline": "Row the River of the Dead, capture souls with paddle or grabber — manage your soul power.",
        "about": "Capturing Souls on the River of The Dead is a game built for js13kGames 2022 (theme: \"Death\") with a premise as specific as its title: your job is to capture souls floating on the River of the Dead, and you are rewarded for each one. The developer describes it as \"not completely finished but good enough\" — a candid admission that speaks to the jam's time pressure, yet it still earned top recognition in the competition.\n\nThe game offers two tools for soul-capturing: a paddle (click and drag to row the boat) and a grabber (click to take a ghost). You switch tools with right-click or spacebar. This tool-switching adds a layer of tactical choice — some souls are easier to reach by rowing into position, others by grabbing directly. The soul-power economy (white ghosts give energy, colored ghosts behave differently) means you are managing a resource, not just collecting.\n\nFor players who enjoy atmospheric games with a unique mechanic, the River of the Dead setting and the paddle/grabber tool system make this a distinctive jam entry worth trying.",
        "howToPlay": "Capturing Souls on the River of the Dead offers two capture tools:\n\n• Paddle: click and drag to row the boat across the river\n• Grabber: click to take a ghost directly\n• Right-click or Spacebar: switch between tools\n\nWhite ghosts give you \"soul power\" energy; colored ghosts behave differently (consult in-game for specifics). Manage your soul power as a resource — you need it to sustain your capture operations.\n\nStrategy: choose your tool based on the soul's position. Souls near the boat are faster to grab; souls across the river require rowing, which costs time. Prioritize white ghosts for energy sustain, and switch tools fluidly rather than committing to one approach.",
        "keyFeatures": [
            "Two-tool soul-capture system (paddle + grabber)",
            "Soul-power resource economy (white vs colored ghosts)",
            "Atmospheric River of the Dead setting (js13k 2022 Death theme)",
            "Top recognition despite developer calling it \"not completely finished\""
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
        "featured": true
    },
    {
        "id": 35,
        "slug": "wasteworld",
        "name": "WasteWorld",
        "category": "arcade",
        "tagline": "A 2022 js13kGames entry by Olivér Sepsik — under 13KB of pure craft.",
        "about": "You can use the following structure to create new Express routes or Socket.io connection handler. js13kgames.com Game Server Game server for the js13kGames Competition. Add contact@js13kgames.com games as collaborator to your Heroku WebApp. \n\nWasteWorld was submitted to the js13kGames 2022 competition by Olivér Sepsik. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Server category rules You can find the official sandbox server at https://github.com/js13kGames/js13kserver.",
        "howToPlay": "You can use the following structure to create new Express routes or Socket.io connection handler. module.exports = { // Express route to /hello hello => (req, res) { ... The key and value size also counts into the limit!\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "tagline": "A 13KB space shooter with mouse, touch, gamepad AND keyboard support — dodge, bomb, survive.",
        "about": "Galaxy Raid is a space shooter submitted to js13kGames 2021. You pilot a ship through enemy-filled space, dodging fire and launching bombs — a classic vertical-scrolling shooter distilled into 13 kilobytes of pure arcade tension.\n\nWhat sets Galaxy Raid apart is its input flexibility. Most browser games commit to either keyboard or mouse; Galaxy Raid supports four control schemes — mouse, touch, gamepad, and keyboard — making it equally playable on a phone, a laptop, or with a controller. The gamepad support with analog sticks is a rare touch in a jam entry and shows real craft.\n\nThe bomb mechanic adds a layer of resource management on top of the dodging: you have a limited supply of screen-clearing bombs, and deciding when to spend them versus when to trust your dodging is the core strategic tension. It earned top recognition in the 2021 competition, a year with 227 entries — a strong showing for a crowded field.",
        "howToPlay": "Galaxy Raid supports four control schemes — pick whichever feels natural:\n\n• Mouse: the ship follows your cursor; click to launch a bomb.\n• Touch: drag your finger to move; tap with a second finger to bomb.\n• Gamepad: use either analog stick or the D-pad to move; press A, B, X, or Y to launch a bomb.\n• Keyboard: arrow keys or WASD/QZSD to move; Space or Enter to bomb.\n\nStrategy: bombs are limited, so save them for moments when the screen is too dense to dodge through — bullet patterns that box you in, or clustered enemy formations. Trust your dodging for everything else. Keep moving; a stationary ship in a shooter is a dead ship.",
        "keyFeatures": [
            "Space shooter with four input methods (mouse, touch, gamepad, keyboard)",
            "Rare analog-stick gamepad support for a browser jam entry",
            "Bomb resource management adds strategic depth",
            "Top recognition in js13k 2021 (227 entries)"
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
        "tagline": "A text adventure mystery — find your missing uncle, pull the threads of space and time.",
        "about": "Shadow of the Keening Star is a retro text-based puzzle adventure game, submitted to js13kGames 2021 (theme: \"Space\"). The premise is atmospheric and specific: you have been led to an abandoned New England house by a mysterious letter, searching for your missing uncle — and the mystery expands until you are pulling on \"the very threads of space and time itself.\" It is a text-adventure structure with cosmic horror undertones, a genre combination that stands out sharply among the action-heavy jam field.\n\nThe text-based format is a deliberate design choice that lets the 13-kilobyte budget go toward narrative depth and puzzle complexity rather than graphics. Arrow-key exploration and interaction keeps the interface minimal, and pressing H in-game surfaces help — a small but important usability touch in a genre notorious for opaque inputs.\n\nFor players who enjoy narrative puzzle adventures in the tradition of classic text games, Shadow of the Keening Star offers a complete mystery in a compact package. It earned top recognition in the 2021 competition, a strong showing for a text entry in a field dominated by arcade action.",
        "howToPlay": "Shadow of the Keening Star is controlled entirely with the keyboard:\n\n• Arrow keys to explore and interact\n• Press H in-game for help and additional commands\n\nAs a text-based puzzle adventure, progress comes from examining your surroundings, collecting clues, and piecing together the mystery of your missing uncle. Read descriptions carefully — text adventures hide critical details in prose that action games would show visually.\n\nStrategy: explore every room thoroughly before moving on. Take notes on what you find; the mystery unfolds across the whole game, and early clues connect to late-game puzzles. If stuck, press H for help rather than guessing randomly.",
        "keyFeatures": [
            "Retro text-based puzzle adventure with cosmic horror undertones",
            "Narrative mystery: find your missing uncle, unravel space-time threads",
            "Atmospheric New England house setting",
            "Top recognition in js13k 2021 — a text entry among action games"
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
        "tagline": "Not a space marine — the person who cleans up the mess. A 13KB game with real personality.",
        "about": "Space Janitor is a game built for the js13kGames competition — and the title tells you exactly what tone to expect. Rather than casting you as a space marine or a heroic pilot, it puts you in the boots of the person who has to clean up the mess. It is a refreshing subversion of the space-game formula, and that comedic premise gives the game a personality that pure-action jam entries often lack.\n\nThe 13-kilobyte constraint forces the same discipline every js13k entry faces: no room for bloated systems, decorative assets, or hand-holding tutorials. What survives the compression budget is the core mechanic and the charm. The source code is fully open on GitHub, which makes it a useful reference for anyone studying how to build a complete game experience inside the size limit.\n\nIt earned top-tier recognition in its competition year. If you enjoy games that lead with character and concept over raw spectacle, Space Janitor is the kind of jam entry worth your fifteen minutes — small, self-aware, and built around a single good idea executed honestly.",
        "howToPlay": "Space Janitor's controls are displayed on the in-game title screen. As with most js13k entries, expect keyboard or mouse inputs — arrow keys or WASD for movement, and a primary action key for the cleaning/interaction mechanic.\n\nThe specific objective varies with the game's design, but the janitor premise suggests a task-completion loop rather than pure combat: figure out what needs cleaning, navigate to it, and deal with obstacles (space debris, zero-gravity physics, or wandering hazards) along the way. Approach it as a puzzle-action hybrid rather than a shooter.",
        "keyFeatures": [
            "Comedic space-janitor premise subverts the usual space-game hero fantasy",
            "Complete game experience in under 13 kilobytes",
            "Open-source — full code available on GitHub as a learning reference",
            "Top-tier js13k competition recognition"
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
        "tagline": "Defend Earth, then counter-attack Jupiter — a 6-level side-scroller with big bosses.",
        "about": "Invasion from Jupiter is a side-scrolling shooter submitted to js13kGames 2021. The premise is pure arcade pulp: unusual sightings in the sky above Earth turn out to be invaders from Jupiter, and you assemble as a top pilot to defend the planet and launch a counter-attack on Jupiter itself.\n\nThe game spans six levels — Earth, space, a first boss, Jupiter, space again, and a final boss — giving it a structured campaign arc that many jam entries lack. The developer openly notes the difficulty is set quite high, which is both a honesty signal and a warning: this is a shooter that respects the genre's roots and expects you to earn your progress. The side-scrolling format with enormous end-of-level bosses is a deliberate homage to classic arcade shooters, and fitting that vision into 13 kilobytes is the real feat.\n\nIt earned top recognition in the 2021 competition. For fans of hard side-scrollers with boss rhythms, Invasion from Jupiter delivers a complete, no-hand-holding experience.",
        "howToPlay": "Invasion from Jupiter uses keyboard controls:\n\n• WASD or Arrow keys to move\n• K to fire your weapon\n• L to use the tractor beam\n\nThe tractor beam is your secondary tool — use it to grab pickups or manipulate objects that pure firepower cannot reach. The six levels follow a pattern of survival stages punctuated by boss encounters; learn each boss's attack pattern before pushing for damage.\n\nStrategy: the difficulty is intentionally high. Do not rush — clear screens methodically and conserve your tractor beam for moments when you are overwhelmed. Boss fights reward patience: observe the pattern, find the safe zones, and strike during recovery windows.",
        "keyFeatures": [
            "Six-level side-scrolling shooter campaign with two boss fights",
            "Tractor beam mechanic adds depth beyond pure shooting",
            "Classic arcade homage with intentionally high difficulty",
            "Top recognition in js13k 2021"
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
        "about": "live-reload server build zip generator Spaceships wars is a kind of battleroyal game where every player use a unique spacehip to destroy their opponents using a rock-paper-scissors mechanic. There are a limit number of spaceships available in the game (13312 to be precise) every one of this is a NFT that can't be purchased but it should be earned by being the winner of the tournament. CHALLENGES_TAKEN=['NEAR', 'PROTOCOL LABS'] \n\nSpaceship Wars 13k was submitted to the js13kGames 2021 competition by Giovanny Beltrán. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "live-reload server build zip generator Spaceships wars is a kind of battleroyal game where every player use a unique spacehip to destroy their opponents using a rock-paper-scissors mechanic. There are a limit number of spaceships available in the game (13312 to be precise) every one of this is a NFT that can't be purchased but it should be earned by being the winner of the tournament.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Giovanny Beltrán",
            "Competition-recognised entry",
            "live-reload server build zip generator Spaceships wars is a kind of battleroyal "
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
        "about": "This is the game's production code, as it was submitted to the js13kGames competition. This is *not* the original source code of the game - unfortunately it was lost to time. \n\nFloating was submitted to the js13kGames 2021 competition by Ayoade David. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Floating uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "tagline": "Bend space itself — a first-time jam entry inspired by force-wielding RPG classes.",
        "about": "The Last Space Bender is the developer's first entry into js13kGames, submitted for the 2021 competition whose theme was \"Space.\" Rather than reading the theme literally — a space shooter, outer space — the creator drew inspiration from the character class \"Force User\" in Dragon Nest, who manipulates forces, explosions, and space itself. The result is a game that plays with the theme conceptually rather than decoratively.\n\nWhat makes this entry worth noting is the ambition: a first-time jam participant attempting a force-manipulation mechanic inside 13 kilobytes. The constraint forces every effect to be earned through code craft rather than asset budget. For players interested in how a novice interprets the jam format — and how much personality a first entry can carry when the developer has a clear creative reference point — The Last Space Bender is a candid look at learning in public.\n\nIt earned top-tier recognition in the 2021 competition alongside 227 other entries.",
        "howToPlay": "The game uses keyboard controls — consult the in-game title screen for exact bindings, as the force-manipulation mechanics require specific inputs the developer customized.\n\nAs a space-bending action game, expect to combine movement with force abilities: positioning matters because your powers affect the space around you rather than just a single target. Learn the range and shape of each force effect before committing to aggressive play, and use the environment to your advantage.",
        "keyFeatures": [
            "Force-manipulation mechanics inspired by Dragon Nest Force User class",
            "A first-time jam entry with ambitious conceptual theme interpretation",
            "Earned top recognition in js13k 2021 (227 entries)"
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
        "tagline": "Deliver orders by rocket — refuel, thrust, dodge air traffic. Inspired by SpaceX Starhopper.",
        "about": "Rocket Cargo is an order-delivery game where you pilot a rocket — explicitly inspired by SpaceX's Starhopper prototype for Mars. The premise ties the gameplay to real-world space engineering: you are not dogfighting or exploring, you are running a delivery operation, managing fuel and air traffic to complete missions.\n\nThe mechanics are physics-driven: you refuel at a fuel pump, thrust upward, steer with lateral controls mid-flight, and can activate a Flight Termination System (FTS) if you run out of fuel — a real aerospace safety concept repurposed as a game mechanic. Each completed mission increases the air traffic difficulty, turning what starts as a gentle delivery loop into an increasingly crowded airspace management challenge.\n\nThe SpaceX inspiration gives Rocket Cargo a distinct identity among jam entries. Rather than generic sci-fi, it leans into the specifics of real rocket operations. It earned top recognition in its js13k competition year, and for players who enjoy physics-flight games with a logistics layer, it is a focused, themed experience.",
        "howToPlay": "Rocket Cargo controls:\n\n• F — refuel the rocket at the fuel pump\n• W or Up — thrust the rocket upward\n• A/D or Left/Right — steer while flying\n• Q — activate Flight Termination System (FTS) if you run out of fuel\n\nStrategy: always refuel before takeoff — running out mid-flight forces an FTS abort. Wait for gaps in air traffic before launching; the skies get busier with each mission. Plan your delivery route before thrusting, because steering a rocket under momentum is harder than it looks. Treat FTS as a last resort, not a regular tool.",
        "keyFeatures": [
            "Physics-based rocket delivery game inspired by SpaceX Starhopper",
            "Fuel management + increasing air traffic difficulty",
            "Flight Termination System (FTS) as a real aerospace mechanic",
            "Top recognition in its js13k competition year"
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
        "tagline": "Clear procedurally-generated stages in a roguelike platform shooter — keyboard, gamepad or touch.",
        "about": "Death Game is a platform shooter built for js13kGames 2022 (theme: \"Death\"). You clear randomly generated stages of increasing length and difficulty — the procedural generation means no two runs are identical, and the escalating parameters ensure the challenge never plateaus. This combination of platforming, shooting, and roguelike stage structure packs remarkable variety into 13 kilobytes.\n\nThe game is notable for its input flexibility: it supports keyboard, gamepad, and touchscreen, with dedicated control mappings for each. A platform shooter that works equally well on a phone, with a controller, or on a keyboard is rare in the jam format and shows real engineering care. The reload mechanic (dedicated keys for keyboard, specific buttons for gamepad) adds a resource-management layer to combat — you cannot spray indefinitely, you must manage your ammo reloads tactically.\n\nDeath Game earned top recognition in the 2022 competition among 167 entries. For fans of roguelike platform shooters, it is a tight, replayable entry that uses procedural generation to earn its longevity honestly.",
        "howToPlay": "Death Game supports three control schemes:\n\nKeyboard: Arrow keys or A/D to move, Up/W to jump, X or J to shoot, Z/K/R to reload.\nGamepad: D-pad or left stick to move, Up or A to jump, triggers or B to shoot, X or Y to reload.\nTouchscreen: on-screen controls (consult the title screen).\n\nStages are randomly generated and increase in length and difficulty. Clear each stage of enemies to progress.\n\nStrategy: the reload mechanic is the core tension — you cannot fire while reloading, so time your reloads during movement gaps, not mid-firefight. In procedurally generated stages, scout the layout before committing to a route; the random generation means familiar tactics do not always apply. Conserve ammo for tougher late-stage enemies.",
        "keyFeatures": [
            "Roguelike platform shooter with randomly generated stages",
            "Escalating length and difficulty across runs",
            "Three input methods: keyboard, gamepad, touchscreen",
            "Reload mechanic adds tactical resource management"
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
        "tagline": "A one-click runner where souls fuel your rope — gather them or you cannot move at all.",
        "about": "Death Scythe is a cross-scroll running game submitted to js13kGames 2022 (theme: \"Death\"). The core mechanic is distinctive: you move forward while hanging from a rope, and you need to collect souls to be able to hang the rope in the first place. This creates a risk-reward loop — souls are the resource that enables your movement, so you cannot simply sprint to the end, you must gather fuel to progress.\n\nThe game is controlled entirely with mouse clicks, making it accessible and immediately playable on any device. The art is created in Aseprite (pixel-art tool) and the sound effects use ZzFX (Frank Force's tiny sound generator), both standard tools in the js13k community for fitting complete audiovisual experiences into the size limit.\n\nDeath Scythe earned top recognition in the 2022 competition. For players who enjoy one-button runner games with a resource-gathering twist, the soul-rope mechanic gives this entry a mechanical identity that pure runners lack — you are not just dodging, you are managing the resource that lets you move at all.",
        "howToPlay": "Death Scythe uses a single input: the mouse click. Click to control your movement as you cross-scroll through the level.\n\nThe core mechanic: you hang from a rope to move forward, and you need souls to hang the rope. Collect souls as you progress — without them, you cannot maintain your movement.\n\nStrategy: treat souls as fuel. Do not rush past soul pickups to go faster, because running out means you cannot hang the rope and you stall. Balance forward progress with soul collection, and time your clicks to the rope-swing rhythm rather than mashing.",
        "keyFeatures": [
            "Cross-scroll runner with a soul-rope movement mechanic",
            "Souls as a movement resource — collect them to progress",
            "Single-input mouse control — playable on any device",
            "Pixel art (Aseprite) + ZzFX sound, top recognition js13k 2022"
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
        "tagline": "A poker game rendered in unicode cards — retro-computing minimalism at 13 kilobytes.",
        "about": "Spatial Poker is a card game built for js13kGames, and its inspirations tell you exactly what to expect: ASCII text Star Trek games from the early computing era, played with unicode playing cards rendered by modern browsers. It is a deliberate exercise in minimalism — using the browser's built-in unicode card characters instead of drawing card art, which is a clever way to fit a full card game into 13 kilobytes.\n\nThe game was built by David Sides under the MIT licence, using ZzFX (Frank Force's tiny sound generator) for audio. The developer's own notes reveal the design philosophy: with only 13K to work with, leverage the browser environment rather than fighting it. Unicode cards, CSS grid layouts, and procedural sound are all native capabilities that cost zero asset bytes.\n\nFor players who enjoy card games with a retro-computing aesthetic, Spatial Poker is a thoughtful entry that treats the size constraint as a design constraint rather than a limitation. It earned top recognition in its competition year.",
        "howToPlay": "Spatial Poker renders cards using unicode characters — no image assets, just the browser's built-in card glyphs. Controls are mouse-based; consult the in-game interface for specific interactions.\n\nAs a poker variant with spatial elements (inspired by ASCII Star Trek games), expect positioning and grid awareness to matter alongside hand evaluation. Read the on-screen instructions for the specific rules of this variant, as it is not standard poker.",
        "keyFeatures": [
            "Card game using unicode playing cards (zero image assets)",
            "Inspired by ASCII Star Trek text games",
            "MIT licensed with ZzFX procedural sound",
            "Design philosophy: leverage the browser environment within 13K"
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
        "about": "That time I tried running from space This game is created to be a part of the https://js13kgames.com/ 2021 Competition. The folder called dist is the full game. It was created Daivan Trinh and Håkan Einarsson. \n\nThat time I tried running away from space was submitted to the js13kGames 2021 competition by Daivan Trinh. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "That time I tried running from space This game is created to be a part of the https://js13kgames.com/ 2021 Competition.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "My submission for the 2024 js13kGames competition. Unfortunately, I was not able to come up with a game concept in time, so this was submitted to the \"Unfinished\" category as a tech demo. I still wanted to submit this however because I am proud of the hard work this took to acheive real-time raytracing on voxels of this scale inside of the browser in under 13kb. \n\nF-Stop was submitted to the js13kGames 2024 competition by Nick Shillingford. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. For those interested, here is a short making of \"F-Stop\" blog post.",
        "howToPlay": "F-Stop uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "(thanks ai) run node build.js to: combine js into a single bundle minify a bunch of stuff play with file to increase difficulty / speed / maze weight If i wanted to do more: increase more difficulty between levels. increase enemy speed, maze weight if you want any of the tools to generate sprites, I saved it somewhere. cat game thing for js13k just open index.html. \n\nCatNFish was submitted to the js13kGames 2025 competition by smhaaker. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. will minify later Experiment for js13k game contest.",
        "howToPlay": "CatNFish uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "W/A/S/D and Arrows - move camera Q/E - rotate camera PgUp/PgDn - minimap zoom F - fullscreen/window Shift-1/0 - bind base 1/0 - select binded base Right click - set base destination The game is made using my js13k-2d renderer and js13k-ecs entity component system. The libraries have been significantly improved in the process, new releases will be coming soon. Capture the island in confrontation with other adventurers. \n\nBounty Islands was submitted to the js13kGames 2024 competition by  Evgeniy Pavlov. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Packed with microbundle, UglifyJS, roadroller and advzip.",
        "howToPlay": "W/A/S/D and Arrows - move camera Q/E - rotate camera PgUp/PgDn - minimap zoom F - fullscreen/window Shift-1/0 - bind base 1/0 - select binded base Right click - set base destination The game is made using my js13k-2d renderer and js13k-ecs entity component system.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Each level gives you **13 seconds** to: The further you go, the more coins and obstacles you’ll face, but you’ll always be racing against that 13-second timer. Welcome to **M13E**, a compact yet thrilling game crafted for the js13kGames 2024 competition! This year's theme, **Triskaidekaphobia** (the fear of the number 13), inspired me to create a maze game with a unique twist. \n\nM13E was submitted to the js13kGames 2024 competition by AndreiO. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Open `dist/index.html` in your web browser to start the game.",
        "howToPlay": "M13E uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: AndreiO",
            "Competition-recognised entry",
            "This year's theme"
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
        "about": "A game built for the 2024 JS13K competition. This game is SDF-based with radiance cascades sprinkled on top. The presentation layer of this engine is an adaptation of Jason McGhee's (jason.today) radiance cascades (https://jason.today/rc). \n\nplusminus13 was submitted to the js13kGames 2024 competition by Jure Triglav. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The original is a Three.js implementation provided under the MIT license, and this engine is a port to raw WebGL2.",
        "howToPlay": "plusminus13 uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Start the development server and go to http://localhost:40001 in your browser. To build the project, run: This will build and bundle the project into the `build/zipped/thirteen.zip` file. You can see this in the output of the build script, for example: This means the package is 3326 bytes, which is 24.98% of the 13kb limit. \n\nThe Sixth Prime was submitted to the js13kGames 2024 competition by Zachary Rankin, David Fagan et al. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. To lint the project, run: This will run prettier and eslint to make sure everything stays shiny.",
        "howToPlay": "The Sixth Prime uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "WASD or Arrow keys or Click&Drag: Pan around the map Shift: Accelerate movement, accelerate demo mode Number keys: Select tool Click: Select a target tile E: Confirm placement Q: Rotate double buildings (You can also rotate by clicking on the tool again.) ;: Toggle an automatic random placement of buildings \"demo mode.\" Escape: Open/close the level select menu. The City Without That Number A WebGL2 city-building puzzler in 9,965 bytes. (Still no placement.) Also went through this nightmare shader space so that I can (in the future) support double buildings slotted in more than a single direction. \n\nThe City Without That Number was submitted to the js13kGames 2024 competition by 4onen. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Computer users still get nice mouseover hover until they select a building at which point their selection \"locks\" and they get confirmation.",
        "howToPlay": "Need to figure out what's eating the KeyboardInterrupts. Day 2: 2024-08-14 Started writing this changelog and initialized source control to make sure I don't lose track of my progress. Also dug deep into the `aiohttp.web.run_app` implementation to determine why it was eating my `KeyboardInterrupt`s.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: 4onen",
            "Competition-recognised entry",
            "Added random construction Every frame"
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
        "about": "When you do changes in your `src` folder, just `f5` the broswer and you should see the changes. When you are done You should see a dist.zip file in the dist folder. \n\nDont step on thirteen was submitted to the js13kGames 2024 competition by Daivan Trinh and Håkan Einarsson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Dont step on thirteen uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Sometimes the witches what you are pursing are using magic to resist the witch hunters. To get more info about the characters, you can check the links below: Witch hunters Matthew Hopkins THE WITCHFINDERS GENERAL: WHO WERE THE CONTEMPORARIES OF MATTHEW HOPKINS? These stats are: Witchsense: Determines the character's ability to sense witches. \n\nWitch Hunter was submitted to the js13kGames 2024 competition by Burián Sándor. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Torture: Determines the character's ability to torture witches.",
        "howToPlay": "Witch Hunter uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Click to start, reset, and shoot Press \"m\" to toggle mute Basic > A slow moving enemy Superfast > Faster green enemy Megafast > Twice as fast red enemy More Arrows > 5 more arrows for every following round Arrow Speed > Faster arrows Bow Speed > Less cooldown between firing arrows Thank you for playing! A 13th century tower defense game, set before the invention of the balloon in 1824. You are the one and only guard protecting the largest defense tower. \n\nOne Guard was submitted to the js13kGames 2023 competition by Alpine Games. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Nothing much happens here so you took the job.",
        "howToPlay": "One Guard uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Pick your starting weapon with `v`/`b` in the keyboard or press the buttons in mobile. The Knighting of Sr Isaac Is a simple random room generated roguelike game where you combine different weapons with unique attack patterns against enemies. Game instructions Gamepad and atk buttons `a`/`b` for mobile. \n\nThe Knighting of Sr Isaac was submitted to the js13kGames 2023 competition by Igor Estêvão. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Clicking in the top right speaker or pressing `m` can mute the game sounds.",
        "howToPlay": "Game instructions Gamepad and atk buttons `a`/`b` for mobile. Pick your starting weapon with `v`/`b` in the keyboard or press the buttons in mobile. Treasure room can only be opened if you have the key.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Igor Estêvão",
            "Competition-recognised entry",
            "The Knighting of Sr Isaac Is a simple random room generated roguelike game where"
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
        "about": "The command zip the project after minifying and compressing the game. It is a less than 13kb size (zipped) Javascript Browser game made for js13kGames competition in 2023. Cloning and running If you would choose to clone the project on your local machine, I would recommend that you install NodeJS and run and to start a local server with the game running on 8080 port. \n\nDeath Sea XIII was submitted to the js13kGames 2023 competition by Misael Braga. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The javascript canvas was used to render the entire game.",
        "howToPlay": "The command zip the project after minifying and compressing the game.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Collect powerup cubes by clicking on them with the primary mouse button. The samurai will fire his BFG automatically, leaving you to the important tasks of avoiding swords and spears thrown by mongols, as well as collecting powerup cubes to empower him and lay waste to many mongols at once. Move the samurai up with \"UPARROW\" or \"Q\" keys, and down with \"DOWNARROW\" or \"A\" keys. \n\nWhen Your Neighbors Are Mongols was submitted to the js13kGames 2023 competition by Cliff Earl. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. When Mongols Are Your Neighbors This game is my entry for the 2023 JS13K competition, a month long event where you attempt to shoe-horn an entire game (code and assets) into a 13K zip file.",
        "howToPlay": "Walkspeed (S) - Increases the samurai's movement speed. Speed (P) - BFG projectiles move faster. Move the samurai up with \"UPARROW\" or \"Q\" keys, and down with \"DOWNARROW\" or \"A\" keys.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2023",
            "Author: Cliff Earl",
            "Competition-recognised entry",
            "When you neighbors are mongols is a random as game I made for js13k 2023"
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
        "about": "This game is a submission to the 2023 edition of the js13k competition. You are an aspiring trader, fighting against the clock to make sweet, sweet deals. The final artifact is a single `index.html` that has everything built in. \n\nSails! was submitted to the js13kGames 2023 competition by Feenposhleen. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Bundling and processing simply consists of concatenating all the .js files in `/src` (hence the naming of those), running the result through Closure Compiler, and then inserting the resulting code into the template file at the root of the project along with the CSS.",
        "howToPlay": "Sails! uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Player have to capture all enemy castles. left mouse button click to select options esc to return to upper menu left mouse button click to select your castles (usually blue) right click on different castle - send troops from selected casle right click on selected castle - upgrade your castle (if you have enough troops) Mfstfl@gmail.com Minimalistic web strategy game. \n\nCastle wars was submitted to the js13kGames 2023 competition by Mefistofel. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "left mouse button click to select options esc to return to upper menu left mouse button click to select your castles (usually blue) right click on different castle - send troops from selected casle right click on selected castle - upgrade your castle (if you have enough troops) Mfstfl@gmail.com\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Snakes & Ladders Classic board game for JS13K 2023 Originally invented in 13th Century India as a game to teach children about the virtues and vices of life. The Human goes first, clicking the dice to play. Two player game - Human vs Bot. \n\nSnakes and Ladders was submitted to the js13kGames 2023 competition by Nick Watton. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Entirely a game of chance (although apparently player 1 has a just better than 50% chance of winning on average) Technical Approach All graphics, including the HTML background used for the dice, drawn with code Graphic shapes (eg snakes) as well as movement controlled with easing calculations Added simple sound with the HTML Audio API Vanilla JavaScript",
        "howToPlay": "The Human goes first, clicking the dice to play.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "This game is a submission to the js13k competition, and lets you play as a buried skeleton that tries to dig its way up to the necromancer that awoke you. It's inspired by the classic horror trope of a zombie raising its hand through the dirt at a cemetary. The fina artifact is a single `index.html` that has everything built in. \n\nRise! was submitted to the js13kGames 2022 competition by Feenposhleen. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Bundling and processing simply consists of concatenating all the .js files in `/src` (hence the naming of those), running the result through Closure Compiler, and then inserting the resulting code into the template file at the root of the project along with the CSS.",
        "howToPlay": "Rise! uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Seating Space Planner This is a game developed for js13kgames 2021 competition where the theme is \"**Space**\". You can play a live version here: https://seating-space-planner.dosaki.net/ You've planned your wedding reception seating but unpredicted guests keep arriving! You must now plan their seating space on the fly. \n\nSeating Space Planner was submitted to the js13kGames 2021 competition by Tiago Correia. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Drag guest cards to the available tables, but pay attention to their traits and don't let them get too angry with each other.",
        "howToPlay": "Seating Space Planner This is a game developed for js13kgames 2021 competition where the theme is \"**Space**\". You can play a live version here: https://seating-space-planner.dosaki.net/ You've planned your wedding reception seating but unpredicted guests keep arriving! You must now plan their seating space on the fly.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Desktop controls: WASD or arrow keys Mobile controls: use touch virtual joystick Build release build Build final build with `roadroller` Build debug build Game for js13kgames competition 2024 Play game on js13kgames You have to find a way out of the cube. Traps and puzzles will be on your way. \n\ncube 13 was submitted to the js13kGames 2024 competition by Clark Kent. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Each level is unique and made with love!",
        "howToPlay": "Desktop controls: WASD or arrow keys Mobile controls: use touch virtual joystick Build release build Build final build with `roadroller` Build debug build\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Clark Kent",
            "Competition-recognised entry",
            "Each level is unique and made with love!"
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
        "about": "Gliding is much easier to control than flying by flapping alone. Best achieved by swooping down on something on a ridgeline before it's aware you're there. Use of a mouse (not a track pad and definitely not touch/mobile) is recommended. \n\nDragon Simulator was submitted to the js13kGames 2023 competition by Chris Glover. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. You can catch live prey by flying low overhead.",
        "howToPlay": "Gliding is much easier to control than flying by flapping alone. Use of a mouse (not a track pad and definitely not touch/mobile) is recommended.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "JS13K 2022 - Death looms An entry for js13kgames 2022. Santiago Zapata \"slashie\": Design and Programming JS13K Jam disclaimers and acknowledgements Uses https://github.com/ooflorent/js13k-boilerplate Further Compression Requires ECT to hit the 13KB limit. Death is imminent, can you keep Lucky alive? \n\nTenderGotchi was submitted to the js13kGames 2022 competition by Santiago Zapata. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Download from https://github.com/fhanau/Efficient-Compression-Tool/releases/tag/v0.8.3",
        "howToPlay": "Santiago Zapata \"slashie\": Design and Programming JS13K Jam disclaimers and acknowledgements Uses https://github.com/ooflorent/js13k-boilerplate Further Compression Requires ECT to hit the 13KB limit. Download from https://github.com/fhanau/Efficient-Compression-Tool/releases/tag/v0.8.3\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "js13k-2021-press-space I wanted to combine three games I like: Tyrian, a classic 2D rolling shooter ZType, a game that is played by typing words Taiko no Tatsujin, a rhythm game My goal was to made a simple, short, but challenging game. When the note hits the white bar, your left hand should press the key that matches to the \"note letter\". Your right hand holds mouse or uses trackpad to control a spaceship. \n\nqress sqace was submitted to the js13kGames 2021 competition by Tomáš Nesrovnal. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Levels and score: You can choose the level of difficulty at the start.",
        "howToPlay": "js13k-2021-press-space I wanted to combine three games I like: Tyrian, a classic 2D rolling shooter ZType, a game that is played by typing words Taiko no Tatsujin, a rhythm game My goal was to made a simple, short, but challenging game. Notes comes in a group of 4 or 5 and they form a word that can be written on the left side of the keyboard. When the note hits the white bar, your left hand should press the key that matches to the \"note letter\".\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Tomáš Nesrovnal",
            "Competition-recognised entry",
            "If the words make an inappropriate sentence"
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
        "about": "Play the lastest version, hosted straight from this repository, here: https://auroriax.github.io/js13k-2021/debug.html Mouse: Move block Left click: Place block Mouse Wheel/Arrow keys: Rotate Block ESC: Exit to level select In Celestial Lighthouse, you must place blocks on strange planets with circular gravity. Place the indicated amount of blocks on the planet to win, or play endless mode and try to fit as many blocks into the atmosphere as you can. \n\nCelestial Lighthouse was submitted to the js13kGames 2021 competition by Tom Hermans. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Play the lastest version, hosted straight from this repository, here: https://auroriax.github.io/js13k-2021/debug.html Mouse: Move block Left click: Place block Mouse Wheel/Arrow keys: Rotate Block ESC: Exit to level select\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Tom Hermans",
            "Competition-recognised entry",
            "In Celestial Lighthouse"
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
        "about": "Entry for JS13K 2021 Placing positive numbers in boxes Hitting the round target total exactly Getting a row or column to total 13 (as a tribute to JS13k) Getting the total of a row and column to match (if they weren't already matching) Placing negative numbers in boxes You'll see squares with Spacey turning a pale red, then darker red, as their level of claustrophobia grows. After the third level of anxiety, they freak out because they NEED their SPACE. Time passing (a point subtracted from round score every few seconds) Sound effects from ZzFX Thanks to Mica for some styling assistance! \n\nI Need My Space! was submitted to the js13kGames 2021 competition by Polly. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Love to hear your thoughts for improving gameplay...",
        "howToPlay": "After the third level of anxiety, they freak out because they NEED their SPACE.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "When you are free from gravity, you can jump a alittle by clicking or touching on the screen. If you want to stop, just click or touch the screen. Friend of the Fallen is jumping game but not endless, just 404 frames. \n\nFriend of the Fallen was submitted to the js13kGames 2020 competition by Bihenaso Games. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Made for Js13kGames competition, competition theme is \"404\".",
        "howToPlay": "Touch on mobile or click on desktop to falling square and line to other squares to go up. If you want to stop, just click or touch the screen. When you are free from gravity, you can jump a alittle by clicking or touching on the screen.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Bihenaso Games",
            "Competition-recognised entry",
            "When you are free from gravity"
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
        "about": "How to make a jumping 2D Platformer in vanilla JS To follow along see Setting Up The Workflow. Setting Up The Workflow How to render 3d in 2d canvas js1k demo the making of flatuicolors.com color palette platformer physics markdown anchor link \n\nBackshooter was submitted to the js13kGames 2019 competition by Emre Guneyler. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Backshooter uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Emre Guneyler",
            "Competition-recognised entry",
            "Setting Up The Workflow How to render 3d in 2d canvas js1k demo the making of fl"
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
        "about": "Then you both score the opponent's guess and try to guess the opponent's number in turns. The challenge though is that it's an entry for the 2019 Js13kGames coding competition and hence has to be under 13 kb. The game is yet another implementation of the good old Bulls'&'Cows. \n\nBring The Number Back was submitted to the js13kGames 2019 competition by Sergey Chernykh. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. You and Robot make a four-digit number with no digit duplication.",
        "howToPlay": "Bring The Number Back uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "The Left or Right arrow keys propel you into that direction, and if you hit a block, you score points. When you touch a block but then move away, it moves backwards. The better you play, the more blocks will move to the other side, increasing score potential. \n\nBackFlipped was submitted to the js13kGames 2019 competition by Tom Hermans. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. While this game has levels, each level is actually just a randomness seed set to a certain value.",
        "howToPlay": "The Left or Right arrow keys propel you into that direction, and if you hit a block, you score points. When you touch a block but then move away, it moves backwards. Once you reach the bottom of the well, gravity flips and you move to the background yourself.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Tom Hermans",
            "Competition-recognised entry",
            "Minimized it's around 29k"
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
        "about": "Move = [Arrow Keys] Move = left joystick Menu = (Options) / (Menu) The game should work on any operating system in Chrome / Firefox but it was primarily designed for MacOS emojis and looks the best in there. This is repository for Gravepassing - retro-style browser-based video game written in TypeScript for js13kgames 2022 competition. You can play the game with a keyboard or controller. \n\nGravepassing was submitted to the js13kGames 2022 competition by Kacper Kula. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. 11628 / 13312 B = 87.35% You’re alone in a graveyard, hounded by armies of the undead.",
        "howToPlay": "You can play the game with a keyboard or controller. Move = [Arrow Keys] Move = left joystick Menu = (Options) / (Menu) The game should work on any operating system in Chrome / Firefox but it was primarily designed for MacOS emojis and looks the best in there.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Level 1: Get Out of New York A maze through New York collecting energy for the journey back. collect hot dogs as well hide from police who can do damage to the health you're collecting watch out for taxis (avoidable obstacles) Level 2: Back Across the Ocean You are not strong enough to swim back, so you need to hitch a ride. wrong-way ships to avoid Level 3: Reclaim the Throne T Rex has claimed your spot as king of Skull Island. \n\nBack to Skull Island was submitted to the js13kGames 2019 competition by Amy Frieson and Steven Frieson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Back to Skull Island An entry in the 2019 js13kgames competition, theme **back**.",
        "howToPlay": "Back to Skull Island uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "El juego cuenta con dos tipos de modalidades como son: 🤝 Play with friends En está modalidad toda la actividad del juego se lleva a cabo en el mismo dispotivo, gracias al uso de service workers, el juego puede funcionar offline, además de ser un PWA En esta modalidad la partida se llevará a cabo en el mismo dispositivo. 🤝 Play with friends Es una extensión de la modalidad anterior, pero en este caso se creará una sala privada, es decir, sólo aquellos usuarios que tengan el código de la sala podrán jugar la partida, se aplican las mismas funcionalidades de la modalidad anterior. Ejecución del proyecto En este caso el proyecto correrá en http://localhost:4000/ Se recomienda renombrar la carpeta `public_uncompressed` a `public` y ésta última ponerle otro nombre, para así ver los archivos sin compresión. \n\nDeath March was submitted to the js13kGames 2022 competition by Jorge Rubiano. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Deathmatch es un juego realizado para la edición 2022 de la JS13k, cuyo tema es DEATH.",
        "howToPlay": "Ejecución del proyecto En este caso el proyecto correrá en http://localhost:4000/ Se recomienda renombrar la carpeta `public_uncompressed` a `public` y ésta última ponerle otro nombre, para así ver los archivos sin compresión.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "This is the game's production code, as it was submitted to the js13kGames competition. This is *not* the original source code of the game - unfortunately it was lost to time. \n\nCoiner was submitted to the js13kGames 2019 competition by Hoai Phong. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Coiner uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Compiled in hommage to the authors: Subzey, p01, aemkei, veubeke, xen_the, justecorruptio, damienallonsius, nderscore, ilesinge, sqaxomonophonen, benjamin_js, fusselwurm, parrotgeek1, keithclark, xaotic, ETHproductions, magna, killedbyapixel, jellyedwards and me (xem) Each game has been regolfed / fixed / enhanced before being included here along with their source code. You need to find a random word picked in a list of 52 words Write a 5-letter word in the field and press Enter to test it Green = good letter, Yellow = misplaced letter, Red = bad letter You have 6 attempts. If you lose, the solution appears in the field Dino (Dwitter entry) // https://www.dwitter.net/d/20814 A micro demake of the Chrome offline dino game Click to make the dino jump over cactii Lights out (Dwitter entry) // https://www.dwitter.net/d/22102 Click a lightbulb to toggle it and its 4 neighbours Can you turn all the lights off in less than 13 clicks? \n\n10 years of game golfing was submitted to the js13kGames 2022 competition by xem. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. This book is a compilation of 30 games & emulators golfed with the Codegolf Team and friends, since 2012, aside from js13k.",
        "howToPlay": "Return the world with Shift key MiniWordle // https://github.com/xem/miniWordle/ A Wordle demake. You need to find a random word picked in a list of 52 words Write a 5-letter word in the field and press Enter to test it Green = good letter, Yellow = misplaced letter, Red = bad letter You have 6 attempts. Play with X + C + Arrow Keys + Enter + Escape\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Rhythm avoidance game, try to avoid cylinders. If there is no nearby cylinder they will orbit around you. 13 bullets orbiting around you will kill you. \n\nMavi was submitted to the js13kGames 2022 competition by Emre Guneyler. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Launch 8 bullets at once if you hold LMB.",
        "howToPlay": "Mavi uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Builds, minifies, inlines, and zips the game to `./zipped/game.zip`. This command finishes with a log message letting you know if the zip file is under 13k. Put your TS or JS in `src/index.ts` Put your css in `src/index.html` Put your images or other assets in `assets/` This starter pulls in this plugin from Facebook's create-react-app to inline the JS into the HTML file. \n\nBird Commander 2 was submitted to the js13kGames 2022 competition by Matt McKenna. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Transpiles TypeScript (if any) Minifies the resulting JavaScript Inlines the JavaScript into an `index.html` file (in production) Zips the `index.html` file Checks that the zip file is under 13k Installs dependencies.",
        "howToPlay": "Bird Commander 2 uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "In 2021 the theme for the game was **SPACE**. Click to launch satellites and be careful not to collide with the satellites you have already placed in space. This little game was created for js13kGames, the JavaScript coding competition for HTML5 Game Developers. \n\nStarlink 13kb Game was submitted to the js13kGames 2021 competition by Will Gittens. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Starlink 13kb Game Help Elon Musk launch the Starlink satellite network!",
        "howToPlay": "In 2021 the theme for the game was **SPACE**. Objectives and controls The operation is very simple, place as many satellites in orbit as possible. Click to launch satellites and be careful not to collide with the satellites you have already placed in space.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Lost-in-the-Distance My first game created for the 2021 js13k space themed competition. You are lost in the distant space within an asteroid field with only enough fuel to travel a limited distance. (Game can be a bit challenging.) W/Up-Arrow: Accelerate A,D/Left,Right-Arrows: Turning Enter: Starting or Restarting game when prompt \n\nLost in the Distance was submitted to the js13kGames 2021 competition by Ethan Chung. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Collect more fuel in order to travel farther.",
        "howToPlay": "Lost-in-the-Distance My first game created for the 2021 js13k space themed competition. You are lost in the distant space within an asteroid field with only enough fuel to travel a limited distance. (Game can be a bit challenging.) W/Up-Arrow: Accelerate A,D/Left,Right-Arrows: Turning Enter: Starting or Restarting game when prompt\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Shooty Ship 13k is my reskinned and rejiggered version of Shooty Ship built to fit within the 13kb limit (zipped build) needed for entry into js13kgames 2021. Don't forget to check out the \"full\" versions of the game and other goodies at thepointless.com! \n\nShooty Ship 13k was submitted to the js13kGames 2021 competition by Jon Wire. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Shooty Ship 13k uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "refuelTheFactoryJamGame13k Source code for Refuel the Factory, a game made for the 2021 Js13kGames game jam. Want to give a shout out to the great Kontra library, https://straker.github.io/kontra/getting-started, and the following awesome tutorials: \n\nRefuel The Factory was submitted to the js13kGames 2021 competition by jamWithJS. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Refuel The Factory uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "🐱🚀🎹 SPACE: Playful Adventures of Cat Emojis 🎹🚀🐱 Play locally with up to 9 astronauts at one keyboard Switch between keyboard mode and mouse/touch mode Fight through 9 levels of chaos Create your own adventure once you mastered the basics \n\nSPACE: Playful Adventures of Cat Emojis was submitted to the js13kGames 2021 competition by Almut Kieffer-Jones. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "🐱🚀🎹 SPACE: Playful Adventures of Cat Emojis 🎹🚀🐱 Play locally with up to 9 astronauts at one keyboard Switch between keyboard mode and mouse/touch mode Fight through 9 levels of chaos Create your own adventure once you mastered the basics\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Distribution only allowed to js13kGames.com 1: Edvard Grieg - Peer Gynt Suite No. 1: Dance of the Mirlitons / reed flutes 3: Wolfgang Amadeus Mozart - Sonata No. K.331-III (Rondo) - Alla Turca Allegretto 4: Wolfgang Amadeus Mozart - Serenade in G, K.525, \"Eine Kleine Nachtmusik\" Allegro 5: Antonio Vivaldi - Concerto for Volin and Strings in E, Op. \n\nLOSSST - a Snake in Space was submitted to the js13kGames 2021 competition by xem and Anders Kaare. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. 8, N°1, RV.269 - \"La Primavera\" 6: Edvard Grieg - Peer Gynt Suite No.",
        "howToPlay": "LOSSST - a Snake in Space uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "2021: a Space Odyssey My game entry for JS13K Games 2021 on the theme \"Space\". Run `npm start` to build the game and serve it locally into a new browser tab. Any changes to the source code will live-reload the game in the browser tab. \n\n2021: a Space Opera was submitted to the js13kGames 2021 competition by Jerome Lecomte. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Bring harmony to the Cosmic Microwave Background by solving each planet's musical puzzle!",
        "howToPlay": "2021: a Space Odyssey My game entry for JS13K Games 2021 on the theme \"Space\". Space no longer sounds its old self... Each planet has an iconic space tune.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Connect the tiles on the board with your finger/mouse to replicate the given combination or press the \"not found\" button. Play through the levels to unlock the arcade mode and ultimately achieve the final trophy. Connection is a pattern-based puzzle game. \n\nConnection was submitted to the js13kGames 2020 competition by Federico Tibaldo. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Connect the tiles on the board with your finger/mouse to replicate the given combination or press the \"not found\" button.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Simple JavaScript game made for js13kgames 2020 You can play the game here. Local installation You can clone the repo (or download it as zip) and open index.html in the browser. \n\nFileNotFound was submitted to the js13kGames 2020 competition by Konrad Linkowski. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "FileNotFound uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Simple maze game Mouse, Touch, Key | Key | Control | | -------------------- | ------------- | | R | Readme | | M | Mute On / Off | | Space, Enter | Start / Next | | Q | Quit | | S | Shuffle | | w, a, s, d, Arrow | Move | | r, Escape | Retry | | z, Backspace, Delete | Undo | \n\nFind All Pages was submitted to the js13kGames 2020 competition by Stacks Hub. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Simple maze game Mouse, Touch, Key | Key | Control | | -------------------- | ------------- | | R | Readme | | M | Mute On / Off | | Space, Enter | Start / Next | | Q | Quit | | S | Shuffle | | w, a, s, d, Arrow | Move | | r, Escape | Retry | | z, Backspace, Delete | Undo |\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Building instructions To make a .zip for the JS13K: Use a Javascript minifier and minify these Javascript files, in this order: You might need to use a minifier that uses something like babel-minify. A game for JS13K 2020 where...well. Only for the player to del--wh-what am I doing? \n\nDelete! was submitted to the js13kGames 2020 competition by Clocks-in-a-Cooler. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Compress the CSS Add the compressed CSS and JS files to the HTML, then compress the HTML.",
        "howToPlay": "Compress the CSS Add the compressed CSS and JS files to the HTML, then compress the HTML.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Clocks-in-a-Cooler",
            "Competition-recognised entry",
            "Why am I hard at work implementing these features again?"
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
        "about": "Move - W, A, S, D Attack - J or Left Mouse Button (LMB) Block - K or Right Mouse Button (RMB) Spartan Charge - K + J / RMB + LMB Ground Pound - Space + J / Space + LMB Otherwise, follow the onscreen prompts. An entry for the 2020 js13kgames competition -- themed \"404.\" Cut your enemies to pieces and defend your homeland! The Last Spartan Arcade hack n' slash survival game set in ancient Sparta, 404 B.C. \n\nThe Last Spartan was submitted to the js13kGames 2020 competition by Michael Ferron. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Can you, the last Spartan Hoplite of your battalion, earn an honorable death across thousands of procedurally generated battlefields?",
        "howToPlay": "Move - W, A, S, D Attack - J or Left Mouse Button (LMB) Block - K or Right Mouse Button (RMB) Spartan Charge - K + J / RMB + LMB Ground Pound - Space + J / Space + LMB Otherwise, follow the onscreen prompts.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Michael Ferron",
            "Competition-recognised entry",
            "Can you"
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
        "about": "The biggest influence on gameplay is Hotline Miami - I was going for the same kind of hectic top-down shooter feel, although bite-size since I had limited space for enemies, level design, etc. (Lots of the js13k folks have made amazing games with just vector/native lines and shapes, and I haven't tried it yet - doing so could save me a lot of code space.) A game that doesn't require any real collision detection. If I'd had a little more space, I was going to play the opening notes to E1M8 _Sign of Evil_ to make the reference even stronger... \n\nWIZARD WITH A SHOTGUN was submitted to the js13kGames 2020 competition by Elliot Nelson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Of course this number shows up lots of places but I had in mind the red 666 from the second-most-famous id game Quake, where your health would read 666 after picking up an Invulnerability glyph.",
        "howToPlay": "Controls: mouse & keyboard. If I'd had a little more space, I was going to play the opening notes to E1M8 _Sign of Evil_ to make the reference even stronger... The biggest influence on gameplay is Hotline Miami - I was going for the same kind of hectic top-down shooter feel, although bite-size since I had limited space for enemies, level design, etc.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Builds, minifies, inlines, and zips the game to `./zipped/game.zip`. This command finishes with a log message letting you know if the zip file is under 13k. Put your TS or JS in `src/index.ts` Put your css in `src/index.html` Put your images or other assets in `assets/` This starter pulls in this plugin from Facebook's create-react-app to inline the JS into the HTML file. \n\nVote by Mail: Funding Not Found was submitted to the js13kGames 2020 competition by Matt McKenna. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Transpiles TypeScript (if any) Minifies the resulting JavaScript Inlines the JavaScript into an `index.html` file (in production) Zips the `index.html` file Checks that the zip file is under 13k Installs dependencies.",
        "howToPlay": "Vote by Mail: Funding Not Found uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "JS13K 2020 404 (Not Found) A turn-based stealth puzzle game. Tap or click within the highlighted area to move there. You must maneuver your two sneaky characters to the end of each room without being seen. \n\n404 - (remain) not found was submitted to the js13kGames 2020 competition by Luke Cann. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The further you move each turn, the louder your footsteps will be.",
        "howToPlay": "Tap or click within the highlighted area to move there. The further you move each turn, the louder your footsteps will be. Distract guards by clicking the clap button (bottom right).\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Use spacebar to shoot a bullet in forward direction horizontally. Village Not Found - 404 to 200 Submission for JS13k games 2020. Use arrow keys or WASD to move the player. \n\nVillage Not Found - 404 to 200 was submitted to the js13kGames 2020 competition by Satyam Lachhwani. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Directory Structure: /build contains minified files.",
        "howToPlay": "Use arrow keys or WASD to move the player. Use spacebar to shoot a bullet in forward direction horizontally.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "If you're playing on desktop, keys 1 through 6 change the active inventory slot. Dewdrop Farm was built for [js13kGames 2020][js13k]. Graphics were created in [Aseprite][] and compressed with [ImageOptim][]. \n\nDewdrop Farm was submitted to the js13kGames 2020 competition by Frank Mitchell. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The originals are in the public the game itself.",
        "howToPlay": "If you're playing on desktop, keys 1 through 6 change the active inventory slot. Keys Farm, Buy, Sell, and Info change the active screen. Graphics were created in [Aseprite][] and compressed with [ImageOptim][].\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "To make the game playable entirely by mouse I made the right-click fire the engines. Later on I also added some keyboard controls: \"w\" to fire engines and space bar to fire. 404 Orbiting Asteroids for JS13k 2020 Play the latest version: https://deathraygames.github.io/404-js13k-2020/dist/ JS13k Rules: Make a game with a package size less than 13k (13,312 bytes) in one month Entry for this game: ...(TBD)... \n\n404 Orbiting Asteroids was submitted to the js13kGames 2020 competition by Luke Nickerson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. See all the entries for the competition at http://2020.js13kgames.com/ I didn't have a lot of inspiration with the theme of \"404\", so I decided to use this challenge as an excuse to learn WebGL and to improve my physics library.",
        "howToPlay": "I enjoyed working with basic spaceship flying as part of Return to the Moon in 2019, so settled on making a simple Asteroids) \"clone\". When it game time to work on the **controls** I decided to copy Reassembly, a game I really enjoy. Rotation of the ship follows the mouse, clicking fires the weapons.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Luke Nickerson",
            "Competition-recognised entry",
            "I knew I wanted some gravity to make flying more interesting"
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
        "about": "JS13KGames 2020 Entry / Find the Papers This is my entry for the js13kgames 2020 challenge. This repo is a clone of the js13k-boilerplate Expect a lot of spaghetti code. \n\nFind the Papers was submitted to the js13kGames 2020 competition by Miguel Silva. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Find the Papers uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "They may tweet about what they see and the public pressure will terminate your agreement with some governments that secretly allow you to collect these DNA samples. Hold SPACE then release to collect DNA samples or make tweets 404. EVERY ALIEN LOVES 404 This is @devyumao and @Ovilia's entry for Js13kGames 2020. \n\nEvery Alien Loves 404 was submitted to the js13kGames 2020 competition by Wenli Zhang and Yumao. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. But on the way to do that, humans may witness your flying saucer.",
        "howToPlay": "They may tweet about what they see and the public pressure will terminate your agreement with some governments that secretly allow you to collect these DNA samples. A/S/D/W to move around. Hold SPACE then release to collect DNA samples or make tweets 404.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Run , then browse to to launch the game minimizer: [new TerserPlugin({ sourceMap: false, extractComments: false, // To avoid separate file with licenses. terserOptions: { sourceMap: false, keep_classnames: false, keep_fnames: false, \n\n404 BC Pinball was submitted to the js13kGames 2020 competition by Adrian Lissot, Barthélémy Renucci et al. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "404 BC Pinball uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Back Relax is my VR/AR/XR entry for the js13k 2019 game competition. Sounds by ZzFX - MIT License (c) 2019 Frank Force https://github.com/KilledByAPixel/ZzFX Thanks aframe.io and js13kgames.com! I'm using AFrame for the first time, and really struggling with dynamic components. \n\nBack Relax was submitted to the js13kGames 2019 competition by Randy Tayler. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. :) As for the actual value of this app, well, it hasn't been reviewed by any medical professionals, and is not approved by the FDA.",
        "howToPlay": "Back Relax uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Circles will appear, and you need to click the circles in the opposite order as they appear. The game was made with Kontra and I made this game for the js13kgames 2019 game competition Open up your favorite browser and type http://localhost:1234 This game is a game to test your memory. \n\nCircle Back was submitted to the js13kGames 2019 competition by John Edvard. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Coil subscribers will have the option to restart the level, being able to see the order of the circles appearing once more.",
        "howToPlay": "Circles will appear, and you need to click the circles in the opposite order as they appear.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "An educational game to increase your typing skills. Race against your previous records and outrun them. On the first run, a bot will compete with you till the end. \n\nEat My Dust! was submitted to the js13kGames 2019 competition by Junsik Shim. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Afterward, you are on your own with your past selves.",
        "howToPlay": "Eat My Dust! uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Arrow right '>' to move right Arrow left '<' to move left Arrow up '^' to jump js13K 2019 entry - Desktop Dino is stucked in time. The only thing left for him is to enjoy the present also if is not that easy, specially when some weird circles try to catch him. \n\nBack in Dino was submitted to the js13kGames 2019 competition by Nicolantonio Vignola. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. He can't walk back in the past...",
        "howToPlay": "Arrow right '>' to move right Arrow left '<' to move left Arrow up '^' to jump\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Nicolantonio Vignola",
            "Competition-recognised entry",
            "The only thing left for him is to enjoy the present also if is not that easy"
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
        "about": "Get-Back-From-Robot-City A WebXR game for JS13K 2019 What is this place? There are robots everywhere, and they are trying to attack you. A teleporter experiment you were part of went very wrong. \n\nGet Back From Robot City was submitted to the js13kGames 2019 competition by Kevin Etchells. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. You must GET BACK FROM ROBOT CITY.",
        "howToPlay": "Get Back From Robot City uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "A dungeon crawler to help you learn morse code or visual braille. Some kids have gotten lost in a maze and, by going in after them, so have you. Follow the instructions to collect all the treasure, save the kids, and make it back. \n\nEncoded Maze was submitted to the js13kGames 2019 competition by Johnny A.. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Morse Sound was created using TinyMusic.js Built on the Ga game engine.",
        "howToPlay": "Encoded Maze uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Run `gulp watch --silent` (silent optional) to have gulp continuously build your project and check it's compressed zip file size. A warning will be printed if you exceed 13312 bytes (13kb) to ensure you're under the limit for the js13kgames competition. A simple little tool for developing a JS game while keeping it under 13kb zipped Run `gulp init` to create a simple folder structure. \n\nBack Home was submitted to the js13kGames 2019 competition by workshopcraft. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Feel free to edit the gulpfile to suit your specific needs.",
        "howToPlay": "Run `gulp watch --silent` (silent optional) to have gulp continuously build your project and check it's compressed zip file size.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "space to use plasma wall hammer - but they doesn't last for long and your hammer needs time to recharge. arrow keys to move about, remember you are in space. send the asteroids back by 'Not So Iron Fists Game Corp' You need to stop the asteroids getting passed you and hitting eartch. \n\nsend the asteroids back was submitted to the js13kGames 2019 competition by Andy McGrath. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Prevent all eight waves of asteroids and you will have saved the earth!",
        "howToPlay": "arrow keys to move about, remember you are in space. space to use plasma wall hammer - but they doesn't last for long and your hammer needs time to recharge.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Production builds are bundled into a single `.js` file and optimized for size. Design Principles game loop and the rendering pipeline, _goodluck_ doesn't give you much more code. Your goal is to ship a game, not build an Write data-driven procedural code. \n\nBackcountry was submitted to the js13kGames 2019 competition by Michał Budzyński and Stanisław Małolepszy. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. This should still be plenty for small and even medium-sized games.",
        "howToPlay": "remove features you don't need, and hack away. typed system works well for _goodluck_ because the code is only written with the current project in mind, and you have the total control over all types used across the project.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Michał Budzyński and Stanisław Małolepszy",
            "Competition-recognised entry",
            "remove features you don't need"
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
        "about": "Update: Whilst this game loops around, I ran out of time for a LOT of features, bug fixes. The goal is to be a vanilla js webxr voxel shooter. There is an ascii Wave editor in `tools.html`, but there's only 2 enemy waves in use! \n\nGrave Quest was submitted to the js13kGames 2022 competition by Graham Reeves. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. JS13k 2022 entry This repository has a workflow that minifies and zips the output (see below) Note: The worflow integer size-check doesn't work!",
        "howToPlay": "Grave Quest uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Graham Reeves",
            "Competition-recognised entry",
            "Update: Whilst this game loops around"
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
        "about": "To progress to the next level you need to defeat all the enemies and help the bees grow their colony. JS13KGames entry for 2022, theme is \"**DEATH**\". You can collect a gun which shoots super-strength 2000 MGO honey and neutralises the enemies. \n\nBee Kind was submitted to the js13kGames 2022 competition by Jasper Renow-Clarke. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. There is also a JS13K logo which gives temporary invulnerability.",
        "howToPlay": "The further you progress, the more bees you'll need to safeguard to move onwards. Clear away toadstools to prevent grubs turning into ZomBees and make space for flowers to grow. When monetization detected, player can still jump when hurt and bees move faster.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Space4 es un juego realizado para la edición 2021 de la JS13k, cuyo tema es SPACE. En Space War se tendrá que memorizar una serie de patrones de colores y sonidos para atacar a la nave enemiga, si se falla en ese patrón la nave será destruída. \n\nSpace War was submitted to the js13kGames 2021 competition by Jorge Rubiano. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Space4 es un juego realizado para la edición 2021 de la JS13k, cuyo tema es SPACE. En Space War se tendrá que memorizar una serie de patrones de colores y sonidos para atacar a la nave enemiga, si se falla en ese patrón la nave será destruída.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "I want to google the game Written by Mark Vasilkov for js13kGames in 2020. Physics code is based on work by Benedikt Bitterli and Gerard Ferrandez. Sound effects use ZzFX by Frank Force. \n\nI want to google the game was submitted to the js13kGames 2020 competition by Mark Vasilkov. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "I want to google the game uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Mark Vasilkov",
            "Competition-recognised entry",
            "Physics code is based on work by Benedikt Bitterli and Gerard Ferrandez."
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
        "about": "Js13k 2019 Desktop Category entry Xycore is a 'throwback' to some old favorites, taking inspiration from Hero Core and Metroid to bring you a simple adventure on an unknown planet - take on the four bosses and destroy the reactor core! + Arrow Keys - Movement + Gamepad Supported! + You can reload to your last checkpoint by refreshing the page at any point + There are several upgrades hidden throughout the world - find them to make the game a bit easier Thank you for playing! \n\nXycore was submitted to the js13kGames 2019 competition by Daniel Lawrence. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Build System/Code Organization Instead, I opted for writing my game in a single file (Heavily utilizing bookmarks), and running it through Google's Closure Compiler.",
        "howToPlay": "+ Arrow Keys - Movement + Gamepad Supported! The exact compilation commands are in `compress.bat`.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Dottie Back to Sun JS13k19 Game - created by NerdNult Dottie, a solar flare, blasted off to the other side of the galaxy during an event. Game Created With: HTML, CSS, and JS created with Web Maker (https://webmaker.app) and Atom (https://atom.io/) Game Art developed using conditional formatting in Google Sheets Don't hit the red solar flares (they absorb you). \n\nDottie Back to Sun was submitted to the js13kGames 2019 competition by Jesse McNulty. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. You can safely manuever along the galactic rocks.",
        "howToPlay": "Use Left, Up, and Right buttons to move. Press \"R\" to restart.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Hard mode : If you want difficulty, activate \"airport code only\" mode Click on box to grab them, and after tou have two choices : Click on countries dock to send them OR Click on the initial box position to cancel You can move on desktop, but it is not required Compatible with Desktop / Oculus Not friendly with Vive / GearVr / Daydream Thanks to @herebefrogs for helping me for the release ! BACK ORDER STORE HOUSE \"BACKORDER STOREHOUSE\" It's Black Friday, you need to dispatch all the parcels on backorder to the proper airports. Look for orders airport code & id Find the box with the matching code Grab the box & place it on the appropriate conveyor belt Unlimited levels : 120 seconds to send multiple orders. \n\nBackorder Storehouse was submitted to the js13kGames 2019 competition by Julien Kermarec. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Coil monetization : Coil subscribers unlock 20 secondes more Not minified : HTML : 27.1k / JS : 32.2k / Sound 19.1k Minified : HTML : 21.9k / JS : 22.7 / Sound 3.25k",
        "howToPlay": "Backorder Storehouse uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "This is the game's production code, as it was submitted to the js13kGames competition. This is *not* the original source code of the game - unfortunately it was lost to time. \n\nBack 2 Home was submitted to the js13kGames 2019 competition by Maurício Sipmann. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Back 2 Home uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "My submission for the JS13kGames competition This is a very simple game. Your main goal is to hit the balls as fast as you can. If you miss a ball, another ball comes back to the game. \n\nPopBall was submitted to the js13kGames 2019 competition by Alba. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. And if there are 20 ball on the screen, you lose.",
        "howToPlay": "PopBall uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "A short choose-your-own-adventure game for JS13k 2019 The hard part is the dang graphics, I tells ya. To save space, I use as few bytes as possible. They're pseudo-vector, meaning they're a whole bunch of points that I pass to a draw method, which makes fills of a selected color. \n\nGet Jess Back was submitted to the js13kGames 2019 competition by Randy Tayler. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. What makes it harder is that in order to shave a few bytes off when zipping, I tried to round the points to the nearest ten.",
        "howToPlay": "To save space, I use as few bytes as possible.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Controls: press [Z] to throw back flash bangs, press [X] to deploy flash mines. dawn-breaker-js13k-2019 You are a wanderer in the dark, persued by unnamable hordes, use your arsenal of light to eliminate enemies and dawn the world. Each blast will draw the dawn nearer and when the dawn breaks you beat the game.Good luck ! \n\nDawn Breaker was submitted to the js13kGames 2019 competition by Rustin Chi. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Controls: press [Z] to throw back flash bangs, press [X] to deploy flash mines.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Load your created Labyrinths Just click on map to select already created map. On the bottom of the preview, you can see the best scored player with his/her best time. The game has no storyline or levels. \n\nLabyrinth Vr Experience was submitted to the js13kGames 2019 competition by Dawid Szadurski. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. **You don't need any special controllers!** The main thought is to train your memory while you always have that little taste of competition.",
        "howToPlay": "**You don't need any special controllers!** The main thought is to train your memory while you always have that little taste of competition. To move forward just look at the next `step`/`block` or use your controller. Load your created Labyrinths Just click on map to select already created map.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Dawid Szadurski",
            "Competition-recognised entry",
            "**You don't need any special controllers!** The main thought is to train your me"
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
        "about": "The additional files it outputs are also in build/, and consists of javascript files compressed with varying sophistication of techniques. I JUST WANT TO PLAY If you just want to play the game (and don't want to play it online) then you can get started by cloning this repository: and then just directly view the file doom.html from your browser. I want to see developer mode From the main repository view the file src/webgl.html from your browser. \n\nYet Another Doom Clone was submitted to the js13kGames 2019 competition by Nicholas Carlini. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. This file additionally displays the frame rate, some statistics on how many frames took longer than 16ms to render, and shows the map editor.",
        "howToPlay": "Yet Another Doom Clone It's yet another doom clone, but implemented in 13kb of (compressed) JavaScript. The additional files it outputs are also in build/, and consists of javascript files compressed with varying sophistication of techniques.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "This project aims to be a foundation for creating a game for the js13k game competition. The first thing you need to do is make sure you have node.js installed. After the installation finishes you will be able to run the included npm scripts. \n\nNinja Take Back was submitted to the js13kGames 2019 competition by Roger Winright. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Access from another device You can pass an argument to the development server specifying the interface to listen on.",
        "howToPlay": "Ninja Take Back uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Roger Winright",
            "Competition-recognised entry",
            "The zip file contains only the generated `index.html`."
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
        "about": "Play here: rebound The code is available under the MIT license. My entry for the 2019 js13k competition. Thanks goes to these wonderful people (emoji key): Michal Kulinski💻 Mike Skowronek💻 This project follows the all-contributors specification. \n\nRebound was submitted to the js13kGames 2019 competition by Michał Skowronek and Michał Kuliński. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Contributions of any kind welcome!",
        "howToPlay": "Thanks goes to these wonderful people (emoji key): Michal Kulinski💻 Mike Skowronek💻 This project follows the all-contributors specification.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Z/X - Rotate Camera (you will need this) Left/Right - Move Shift - Run/Turn Walk Backward + Up - Backstep A/S - Light/Heavy Attack D - Shove/Use/Drink Down+D - Pick Up/Drop Click to restart after death You can play it here Alternatively, you can decide how long you want to wait vs how good your graphics will be. 'if your grave doesnt say \"rest in peace\" on it you are automatically drafted into the skeleton war' - @wint IMPORTANT! The game will take about one minute to generate all the textures before starting. \n\nRIP was submitted to the js13kGames 2022 competition by Chris Glover. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. High Quality (default) Very High Quality Made for JS13K in 2022.",
        "howToPlay": "RIP uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Use the keyboard arrows to move the little cat and space bar or up to jump. Track your progress and compete for the top spot on the highscore board ! Blacky returns home In Blacky Returns Home, you must help the little black cat get back home and retrieve his lunch. \n\nBlacky Returns Home was submitted to the js13kGames 2025 competition by sdeseille. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. But first, you must help Blacky retrieve his little toy: a fish bone.",
        "howToPlay": "Use the keyboard arrows to move the little cat and space bar or up to jump.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Do well and you unlock new ingredients resulting in new kinds of orders. But don't make too many mistakes or you can close your store. Mouse to point & click \"Kitten meow\" audio by AlexMurphy53 ZzFX – Zuper Zmall Zound Zynth \n\nBlack Cat Potions was submitted to the js13kGames 2025 competition by Sebastian Dorn. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. js13k 2025: Black Cat Potions Entry for the js13k competition of 2025.",
        "howToPlay": "Mouse to point & click \"Kitten meow\" audio by AlexMurphy53 ZzFX – Zuper Zmall Zound Zynth\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "LittleJS - The Tiny Fast JavaScript Game Engine Special Js13k Branch LittleJS is a fast, lightweight, and fully open source HTML5 game engine designed for simplicity and performance. The code is clean and well documented with some fun examples to get you started right away. The starter project builds to a 7kb zip file and includes all of the primary engine features. \n\nBoots and the Black Cauldron was submitted to the js13kGames 2025 competition by Raptor Dev and Noah-Zark-22. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Individual features like WebGL can be disabled to save even more space.",
        "howToPlay": "Individual features like WebGL can be disabled to save even more space.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Raptor Dev and Noah-Zark-22",
            "Competition-recognised entry",
            "LittleJS - The Tiny Fast JavaScript Game Engine Special Js13k Branch LittleJS is"
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
        "about": "81 Convert onlinesequence.net `.sequence` files to plain text, to more easily parse them and use them in games. Can you restore peace to Whisker’s Valley? These assets were used and modified in this game. \n\nMeow Mountain was submitted to the js13kGames 2025 competition by João Lopes. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Magic Escape Room Kevin MacLeod (incompetech.com)",
        "howToPlay": "Meow Mountain uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Move with **WASD** Rotate with **Q / E** Look around with your **mouse** Use the **left joystick** to move Use the **right joystick** to rotate Close with **X**, **H**, or **Esc** Touch-drag to freely look around Legends say a mysterious black cat roams these lands. 🐾 Welcome to **Wild Catch** 🐈‍⬛ The black cat is loose in the wilds — can you catch it before it disappears into the night? This is a **fast, skill-based exploration game** where sharp eyes and quick reflexes will determine your fate. \n\nWild Catch was submitted to the js13kGames 2025 competition by Justinas Gibas. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Your task: **find it, follow it, and catch it** — but beware...",
        "howToPlay": "Move with **WASD** Rotate with **Q / E** Look around with your **mouse** Use the **left joystick** to move Use the **right joystick** to rotate Close with **X**, **H**, or **Esc** Touch-drag to freely look around Legends say a mysterious black cat roams these lands. MMO mode (via Cloudflare relay server) Cross-platform: VR, mobile, and desktop Unified input system (raytraced controls) Adaptive music system Wind simulation (affecting sound, grass, and plants) 📚 Learning Materials / Inspiration\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Justinas Gibas",
            "Competition-recognised entry",
            "The main goals were to **learn Vanilla JS for WebXR** and to practice **Git bran"
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
        "about": "Use the `Arrow Keys` or `W, A, S, D` to move your character around the grid and avoid the incoming paw strikes. Clawstruck - JS13KGAMES 2025 Submission vote and try playing it on: https://js13kgames.com/2025/games/clawstruck Clawstruck is a fast-paced arcade game where your goal is to survive as long as possible by dodging the relentless attacks of a mischievous cat's paw. Test your reflexes as the attacks get faster and more unpredictable over time. \n\nClawstruck was submitted to the js13kGames 2025 competition by Noumisyifa Nabila. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The main game logic is contained within the `index.html` file.",
        "howToPlay": "Use the `Arrow Keys` or `W, A, S, D` to move your character around the grid and avoid the incoming paw strikes.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Liberate the Pyra's special operator Black-Cat, and destroy your enemies, although they may just be innocent space explorers. All keyboard controls can be reconfigured in the options menu and will be persisted between games. The main goals of the game are to fly about procedurally generated landscapes, rescuing Pyra, destroying enemy units, and collecting cargo. \n\nBlack Cat - Nine Lives, No Mercy was submitted to the js13kGames 2025 competition by Cliff Earl. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. There are multiple enemy units, each with their own behaviors: Stationary turrets that target and shoot at the player.",
        "howToPlay": "Liberate the Pyra's special operator Black-Cat, and destroy your enemies, although they may just be innocent space explorers. Move the mouse to look around and aim. Forward thrust using the `W` key.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2025",
            "Author: Cliff Earl",
            "Competition-recognised entry",
            "BLACK CAT - NINE LIVES NO MERCY You are special operator"
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
        "about": "Exilium: The Fall of Dominus The game is set in a dystopian future where an oppressive AI has taken control of the world, maintaining its dominance through 13 massive pylons that distribute power and control across the globe. It monitors all communications, controls all resources, and enforces its will through the power of the pylons, which keep humanity subdued. The world is bleak, with humanity struggling under the iron grip of the AI, which calls itself \"Dominus.\" The AI's regime is known as the \"Dominus Network,\" a name that signifies its total control over all aspects of life. \n\nExilium: The Fall of Dominus was submitted to the js13kGames 2024 competition by Harvey Seager. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The rebels, known as \"The Vanguard,\" are a determined group of freedom fighters who have united with the sole purpose of destroying the 13 pylons and bringing down the Dominus Network.",
        "howToPlay": "Exilium: The Fall of Dominus The game is set in a dystopian future where an oppressive AI has taken control of the world, maintaining its dominance through 13 massive pylons that distribute power and control across the globe. The world is bleak, with humanity struggling under the iron grip of the AI, which calls itself \"Dominus.\" The AI's regime is known as the \"Dominus Network,\" a name that signifies its total control over all aspects of life. It monitors all communications, controls all resources, and enforces its will through the power of the pylons, which keep humanity subdued.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Harvey Seager",
            "Competition-recognised entry",
            "Each tower is heavily guarded by automated drones"
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
        "about": "Shoot 13 Nomsters I came in to the office early and switched as many M and N keys on keyboards as I could. Some might say I'm a monster, but others will say nomster. \n\nShoot 13 Nomsters was submitted to the js13kGames 2024 competition by Mark Vasilkov. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Shoot 13 Nomsters I came in to the office early and switched as many M and N keys on keyboards as I could.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Press :arrow_left: to move left, :arrow_right: to move right Press :arrow_up: to jump Press `C` to shoot fireballs Spikeballs can hurt you now Post-mortem (just after the deadline of js13k-2024) Triskaidekaphobia... I tried to remove bitECS from my build and well, a big chunk of space (~3kB) just appeared. So I decided to redo all of my game logic while also removing unnecessary mechanics. \n\nWands of Triskaidekai was submitted to the js13kGames 2024 competition by Richard Chung. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. But I realised that this game has to be movement-heavy because the mechanics are driven based on movements, or else nothing happens.",
        "howToPlay": "Press :arrow_left: to move left, :arrow_right: to move right Press :arrow_up: to jump Press `C` to shoot fireballs Spikeballs can hurt you now Post-mortem (just after the deadline of js13k-2024) Triskaidekaphobia... I am also a noob in compression, optimisation stuff so I thought I could just go with a LittleJS template and be fine with it. :tophat: :tophat: :tophat: Optimization new bee my struggles when trying to compress.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Richard Chung",
            "Competition-recognised entry",
            "So I decided to redo all of my game logic while also removing unnecessary mechan"
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
        "about": "WASD or Arrow Keys to Move Mouse to aim, hold Left mouse button to attack E to pick up ammo and/or weapons from defeated enemies 1, 2, 3 to switch between weapons Right-click to quickly switch to and strike with your meelee weapon Ensure you have nix installed Run `nix develop` to open a devshell. At that moment, I had the impression that people who thought of game jam ideas were more evil than serial killers. Level design was also a challenge, but I managed to make it work in the end after playing them through many times and making sure they worked. \n\nSalvadoran Reclamation: MS-13 was submitted to the js13kGames 2024 competition by IroncladDev. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Salvadoran Reclamation is a 2D shooter/platformer game where you play as a soldier in El Salvador to take out the MS-13 gangs scattered across the country.",
        "howToPlay": "WASD or Arrow Keys to Move Mouse to aim, hold Left mouse button to attack E to pick up ammo and/or weapons from defeated enemies 1, 2, 3 to switch between weapons Right-click to quickly switch to and strike with your meelee weapon Ensure you have nix installed Run `nix develop` to open a devshell. At that moment, I had the impression that people who thought of game jam ideas were more evil than serial killers.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Thoughts for next year No more adventure games Game must be playable with mouse-only or touch-only Explore new game genres or mechanics for new sources of fun Start with a known working formula for fun (Breakout, Bubble Pop, Angry Birds, Flappy Bird, etc) Leave plenty of room for UI hints, tips (\"Click here to do X\" tips), and UI sound effects I love js13k. As part of the js13k game development challenge, I've compiled some thoughts on the development process of Phantomicus. Keeping with the Luigi's Mansion theme, I used a remix of the title music and a cover of the game music. \n\nPhantomicus was submitted to the js13kGames 2024 competition by Cody Ebberson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Poki sponsored js13k this year, and offered free game testing services.",
        "howToPlay": "Armed with your Spook Siphon and a PhD in Paranormal Pest Control, ascend 13 floors to defeat the spectral infestation.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2024",
            "Author: Cody Ebberson",
            "Competition-recognised entry",
            "In the past"
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
        "about": "On desktop, use the [Left/Right Arrow] keys move and [Up/Down Arrow] to accelerate or decelerate. National Accident Day An endless runner game for js13k 2024. You were supposed to give a speech at the National Accident Day, but you are very very late. \n\nNational Accident Day was submitted to the js13kGames 2024 competition by Sayem Shafayet. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. You need to make it there on time, but the traffic is horrible.",
        "howToPlay": "On desktop, use the [Left/Right Arrow] keys move and [Up/Down Arrow] to accelerate or decelerate. On mobile or desktop, use [DPad ← / → ] to move and [DPad Up / Down ] to accelerate or decelerate. Press F11 to toggle fullscreen.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "The repo for my JS13K 2024 compo \"DECK 13\" A game by Almar. Play the game HERE The postmortem is here (it's 8000 words, be careful!). This game uses quadtree-js, lightgl.js and craiky's dungeon tutorial (link down!). \n\nDECK 13 was submitted to the js13kGames 2024 competition by Almar Suarez. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "DECK 13 uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "The Anti-Poker Protocol JS13K_Triskaidekaphobia Gamejam Theme: Triskaidekaphobia Description: \"A bit of a different take on poker! This was my 4th time participating in the js13k gamejam, and (spoilers) I finally found myself with an end result worth submitting! (links to final game/entry) Early Dev / The Beginning Midway Point & Refactor Final Days, Code Butchering & Submission Chaos In Review: What went well? \n\nThe Anti-Poker Protocol was submitted to the js13kGames 2024 competition by Alex Delderfield. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Featuring CRT visuals, sprites/graphics generated in-game (no image textures at all!), mobile support, and some whacky NPCs which feature a stunning guaranteed (>1) amount of lines to bark at you.\" Game Created by Alex Delderfield (Alex_ADEdge), 2024, for the #JS13K gamejam.",
        "howToPlay": "The Anti-Poker Protocol uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Knights Dreams (yes I know the title is dumb, I just couldn't come up with a better title that was short enough to fit the space I had reserved for it) is a tiny arcade endless runner action game that was made for js13k competition (2023). You can play it here: https://js13kgames.com/entries/knight-dreams (I'm guessing the url, it might be incorrect, in that case look for the game manually). So, whatever you are going to do this with this code, please don't take any inspiration... \n\nKnight Dreams was submitted to the js13kGames 2023 competition by Jani Nykänen. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. If you just want to make changes to the code, running `tsc` on the root is sufficient.",
        "howToPlay": "Knights Dreams (yes I know the title is dumb, I just couldn't come up with a better title that was short enough to fit the space I had reserved for it) is a tiny arcade endless runner action game that was made for js13k competition (2023).\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "This game has been created for the 2023 js13KGames jam which theme was \"13th Century\". js13kGames is a JavaScript coding competition for Web Game Developers running yearly since 2012. Will you be able to build a cathedral in less than 100 years? \n\nCathedral builder was submitted to the js13kGames 2023 competition by Homer Dilpleu. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. MGE (Mini Game Engine) Cathedral builder is baseed on MGE (Mini Game Engine) which is a minimalist and easy to use engine for simple 2D games.",
        "howToPlay": "Cathedral builder uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Controls keyboard [W][A][S][D] or arrows keys to move [Enter] or [Space] to attack [E] to pick up items [Shift] to dodge roll [Escape] to pause/unpause GAMEPAD is also supported. js13k 2023: The Treasure of the Nibelungs Entry for the js13k competition of 2023. Theme: **13th Century** Spurred on by The Songs of the Nibelungs, many set off searching for the legendary treasure said to still lay hidden in the Rhine river. \n\nThe Treasure of the Nibelungs was submitted to the js13kGames 2023 competition by Sebastian Dorn. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Controls keyboard [W][A][S][D] or arrows keys to move [Enter] or [Space] to attack [E] to pick up items [Shift] to dodge roll [Escape] to pause/unpause GAMEPAD is also supported.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Complete each level to choose an upgrade and improve your odds. WASD or arrow keys to move, mouse to aim and click to shoot MoDsama for the character sprites Frank Force for the ZzFX sound generator Timur Manyanov for tinyfont.js Exit the Castle is a game written in JavaScript and made for the 2023 edition of the js13kGames Competition entered into the Desktop category. \n\nExit the Castle was submitted to the js13kGames 2023 competition by Oliver Smith. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. You are trapped in the Sheriff of Nottingham's castle and must survive against his knights to make your way out.",
        "howToPlay": "WASD or arrow keys to move, mouse to aim and click to shoot MoDsama for the character sprites Frank Force for the ZzFX sound generator Timur Manyanov for tinyfont.js\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "It's a play on The Hanseatic League which grew in that time period. You can also study my journal which I keep along the development you can export the `NODE_ENV=development` environment variable to have a dev build which is easier to debug. Note: we encourage you to add the below to your existing `README.md` on your GitHub project. \n\nThe Baltic League was submitted to the js13kGames 2023 competition by André Jaenisch. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. I urge you to read about the Give up GitHub campaign from the Software Freedom Conservancy to understand some of the reasons why GitHub is not a good place to host FOSS projects.",
        "howToPlay": "The Baltic League uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Open up http://192.168.1.162:8080/ in your browser Script should give the file size of the built `game.zip` - make sure it's below the js13k requirement Test http://192.168.1.162:8080/build/index.html in browser You're a hungry mortal in a strange world filled with other animals. But you alone know how to wield tools and know the art of butchery, so *time to get butcherin'!* Complete all the achievements to win the game. \n\nBit Butcher was submitted to the js13kGames 2022 competition by Luke Nickerson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Made with LittleJS v1.3.8, a micro framework by the innovative Frank Force.",
        "howToPlay": "Bit Butcher uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "This state machine can also be useful for player or enemy states. These are used for zipping but the unzipped copy is left behind so you can validate the code still works without unzipping. Finally you have your index.zip to distribute Starter Kit \"Game\" Features The starter kit is designed as simply a starting point with some helpful features. \n\nCharon Jr. was submitted to the js13kGames 2022 competition by Rob Louie. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The included features are minimal and can easily be changed or removed.",
        "howToPlay": "The included features are minimal and can easily be changed or removed. There's also a simple singleton `drawEngine` for drawing with the canvas anywhere easily, as well as a simple `controls` interface. Use WASD and Enter to select options.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2022",
            "Author: Rob Louie",
            "Competition-recognised entry",
            "Finally you have your index.zip to distribute Starter Kit \"Game\" Features The st"
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
        "about": "Move around using the cursor keys and press R when you are stuck and want to retry the current level. well you can't be for sure if you don't complete the 13 amazing levels of this puzzle adventure! JS13K 2022 - DEATHWISH A game by Miguel Ángel Pérez Martínez. \n\nDeathwish was submitted to the js13kGames 2022 competition by Miguel Ángel. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Script to generate your own progress bar with unicode characters!",
        "howToPlay": "Move around using the cursor keys and press R when you are stuck and want to retry the current level.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "js13k2022 Competition Entry Game: Heart of the Gods In this game you embark on the river Styx to defend the Heart of the Gods from the endless, hungry navy of the Underworld. Controls: Arrows/WAD to pilot vessel. \n\nHeart of the Gods was submitted to the js13kGames 2022 competition by Benjamin Brown. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Controls: Arrows/WAD to pilot vessel.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "A game for js13k 2022 Tony (you) is working late, again and due to his hard worked efforts is tired and falls asleep. Move Tony (You) using WASD or Arrows K to throw rock. Developed using Visual studio code Minified with Xem's JS13K-pack (https://xem.github.io/js13k-pack/) Game assets created with my own polygon editor \n\nDeath or Gloria was submitted to the js13kGames 2022 competition by Brian Hambley. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. The ground beneath you is unstable and the next step could be your last.",
        "howToPlay": "Move Tony (You) using WASD or Arrows K to throw rock. L and Move to drop breadcrumb.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "A survival game where you kill enemies and build your skeleton army. Created for the js13kgames 2022 competition. Use F to fire your deadly magic. \n\nSkeleathon was submitted to the js13kGames 2022 competition by Eric Ros. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. how many waves are you able to survive?",
        "howToPlay": "Use arrows to move and jump.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "The game is about a ship that need to fight in the galaxy and survive as mush as possible. You can start the project in develop with the command `npm start`. Minimalistic game to participate in the js14kgames contest. \n\nAzetz was submitted to the js13kGames 2021 competition by Guillermo. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. This has live reloading after any change in the code.",
        "howToPlay": "Azetz uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "You can use the following structure to create new Express routes or Socket.io connection handler. Entry for the 2021 https://js13kgames.com/ competition, Server category. js13kgames.com Game Server Game server for the js13kGames Competition. \n\nOrbital Golfing was submitted to the js13kGames 2021 competition by Benjamin Brown. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Add contact@js13kgames.com games as collaborator to your Heroku WebApp.",
        "howToPlay": "You can use the following structure to create new Express routes or Socket.io connection handler. module.exports = { // Express route to /hello hello => (req, res) { ... The key and value size also counts into the limit!\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2021",
            "Author: Benjamin Brown",
            "Competition-recognised entry",
            "This is a multiplayer golfing game where the obstacles are planets and gravity i"
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
        "about": "Theme for 2021: *\"Space\"* Entry for this game on js13kgames.com See all the entries for the competition at http://2021.js13kgames.com/ Source: ~44.9 KB js scripts: ~36.8 KB All others: ~9 KB (but not all were really used) html/css: 7.95 KB Minified: 26.2 KB html/css: 7.98 KB (it actually went up a tiny amount) Zipped: **8.95** KB (Plenty of extra space!) Master of 13000 Suns Latest main branch: https://deathraygames.github.io/master-of-13k-suns/ JS13k Rules: Make a game with a package size less than 13k (13,312 bytes) in one month (8/13 to 9/13). \n\nMaster of 13k Suns was submitted to the js13kGames 2021 competition by Luke Nickerson. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Master of 13k Suns uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Use WASD or Arrows for controlling; Use Space for making a shot; MARS: Short Adventure Small game created for `js13k` It's going to be really challenging to find all stars... \n\nMars: Short Adventure was submitted to the js13kGames 2021 competition by Viktor Uhryn. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Use WASD or Arrows for controlling; Use Space for making a shot;\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Realm 404 is a competition entry for the JS13K 2020 games competition You can play the game here Trapped in the infamous Realm 404, you must explore and scavenge for enough coin to buy a chance at escape, but the Lord of the realm has other plans... Realm 404 is a turn-based rogue-like with semi-randomly generated rooms, an assortment of items, and a mysterious merchant. \n\nRealm 404 was submitted to the js13kGames 2020 competition by Benjamin Brown. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Realm 404 uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Benjamin Brown",
            "Competition-recognised entry",
            "Realm 404 is a turn-based rogue-like with semi-randomly generated rooms"
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
        "about": "The first thing you need to do is make sure you have node.js installed. After the installation finishes you will be able to run the included npm scripts. Access from another device You can pass an argument to the development server specifying the interface to listen on. \n\nAdopt-a-Fire was submitted to the js13kGames 2020 competition by Dickson Chui. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Having a device on the same network you will be able to view the webpage at `http://[yourLocalIP]:8080` for example `http://192.168.1.1:8080`.",
        "howToPlay": "Adopt-a-Fire uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Dickson Chui",
            "Competition-recognised entry",
            "The zip file contains only the generated `index.html`."
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
        "about": "This repo has the boilerplate to build a JS bundle with Browserify for projects that use Preact. It is mostly targeted at people who want to build a dynamic Preact app and are only interested in generating a single JavaScript file. If you want to generate a full app (with pre-rendered HTML, styles, routes and JavaScript), I would recommend preact-cli. \n\nEmoji Memory was submitted to the js13kGames 2020 competition by Daniel Jeffery. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Get yourself a copy of the repo, and do You will have a working bundled JavaScript file at `/public/js/bundle.js`.",
        "howToPlay": "Emoji Memory uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "A hackable template for creating small and fast browser games. Goodluck is great for: Learning game programming and game design. You will also find Goodluck on Glitch where you can remix it into your own project! \n\nOh no! All the textures are 404! was submitted to the js13kGames 2020 competition by Michał Budzyński and Stanisław Małolepszy. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Design Principles Goodluck is a template for creating small browser games which fit in a few kilobytes.",
        "howToPlay": "Once you've copied everything you need, feel free to remove all other project directories in the repository! `KeyA` in `KeyboardEvent.key`.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2020",
            "Author: Michał Budzyński and Stanisław Małolepszy",
            "Competition-recognised entry",
            "Prefer simple procedural code and closed type systems."
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
        "about": "[Artículo post mortem] El usuario podrá realizar las siguientes acciones: Crear un board aleatorio de la posición de los barcos en el escenario En la carpeta **[public]**, se encuentra los archivos comprimidos, los cuales al empaquetarse en un archivo .zip, pesan menos de 13KB, en la carpeta **[public_uncompressed]** se encuentra los archivos originales. Back to the BatttleShip Juego realizado para la competencia [JS13K], inspirado en el juego [Batalla Naval], para está edición de la JS13k, el tema fue **[back]** de ahí el nombre de Back to the BatttleShip, la idea era realizar un juego que evocará el tiempo en el que se jugaba este juego en papel y lapiz, de ahí su diseño. \n\nBack to the Battle Ship was submitted to the js13kGames 2019 competition by Jorge Rubiano. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk.",
        "howToPlay": "Back to the Battle Ship uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Submission for the Js13kGames competition 2019 I always wanted to write a bubble shooter in the 99-balls-style, so I did that, and made it fit with the theme \"back\" afterwards. There are several versions of the game: Development version is on https://schnark.github.io/js13kgames-2019/game.html Minified version is on https://schnark.github.io/js13kgames-2019/min/index.html Official version submitted for the competition isn't available yet. Perhaps I will create a variant of this game as hybrid FFOS app/PWA, like my other apps. \n\nThe Martians are Back! was submitted to the js13kGames 2019 competition by Michael M.. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. This will probably live in a different repository.",
        "howToPlay": "The Martians are Back! uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
        "about": "Regresso is a clicker game where you have a series of actions and tasks. My entry for the 2019 edition os JS13k game jam. Keep your crew well fed while you strugle your way through finding the resources to rebuild the caravel and get back to the sea. \n\nRegresso was submitted to the js13kGames 2019 competition by João Lopes. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. As the game progresses, you will find different actions are available to you.",
        "howToPlay": "Regresso is a clicker game where you have a series of actions and tasks.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "A game made for Js13kGames competition. The programmers didn't have time to code a real artificial intelligence so now you have to match the pictures with the given name to help websites test if the user is a Human or a malicious Robot. For each correct answer you earn points and you lose points for each mistake. \n\nSaptcha was submitted to the js13kGames 2019 competition by Konrad Linkowski. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Imagine that you are at the back of the Captcha system.",
        "howToPlay": "Select all images that look like the animal given by the name and than click verify.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "Back Down The Tower In this game, you've most definitely defeated the boss, and you just need to go back down the tower to go home and buy groceries and walk your dog (groceries and dog not part of the game). Unfortunately, you've used a cheat code to get to the boss and all of the enemies and traps are still there. This was submitted to the JS13KGames 2019 contest Install kontra (https://straker.github.io/kontra/) Arrow keys to move [z] to grab and move gray boxes [esc] to restart Quang-Thuy Hoang (https://github.com/quangthuyhoang) Kevin Leong (https://github.com/kjleong) \n\nBack Down The Tower was submitted to the js13kGames 2019 competition by Quang-Thuy Hoang and Kevin Leong. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Too bad the cheat code was a one-way ticket since it was bought from a shady cube.",
        "howToPlay": "This was submitted to the JS13KGames 2019 contest Install kontra (https://straker.github.io/kontra/) Arrow keys to move [z] to grab and move gray boxes [esc] to restart Quang-Thuy Hoang (https://github.com/quangthuyhoang) Kevin Leong (https://github.com/kjleong)\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "You can use the following structure to create new Express routes or Socket.io connection handler. js13kgames.com Game Server Game server for the js13kGames Competition. Add contact@js13kgames.com games as collaborator to your Heroku WebApp. \n\nBeat Bricks was submitted to the js13kGames 2019 competition by Keith Karnage. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. Server category rules You can find the official sandbox server at https://github.com/js13kGames/js13kserver.",
        "howToPlay": "You can use the following structure to create new Express routes or Socket.io connection handler. module.exports = { // Express route to /hello hello => (req, res) { ... The key and value size also counts into the limit!\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
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
        "about": "bakpak js13k 2019 this is my js13k entry for 2019 where you find attachments for your backpack to solve puzzles and defeat bosses. simply drag and drop an org file onto the toneplayorg program to generate a music file. to compile, make sure you have closure compiler in the root directory named \"cc.jar\" and run build.bat in the game folder. \n\nbakpak was submitted to the js13kGames 2019 competition by nes and egghead. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. the generated assets go into the data.js file in the game folder.",
        "howToPlay": "bakpak uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: nes and egghead",
            "Competition-recognised entry",
            "music is generated from orgmaker."
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
        "about": "The point of the competition is to make a browser game in JavaScript that fits into a 13kb .zip archive. This approach lead to an very retro artstyle and some interesting artistic liberties (like the wavy A noteworthy part of this game is the soundtrack which (in my opinion) is quite complex for the amount of space it requires (it is generated in the audio.js file). Pizza Undelivery # Here you bring pizzas back to the pizzeria, instead of the other way around. \n\nPizza Undelivery was submitted to the js13kGames 2019 competition by Niki Gawlik. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. This retro style racing game is about navigating a randomly generated 3D city in your 1986 Toyota Corolla, while listening to hand-coded floatbeat music and sound effects.",
        "howToPlay": "This approach lead to an very retro artstyle and some interesting artistic liberties (like the wavy A noteworthy part of this game is the soundtrack which (in my opinion) is quite complex for the amount of space it requires (it is generated in the audio.js file). It is based on the idea of bytebeat/floatbeat (https://github.com/greggman/html5bytebeat) where the music is expressed as a mathematical function dependant on the value of the the time/sample index t.\n\nFor full controls and strategy tips, open the game via the source link below — the in-game title screen displays any additional bindings. As a js13k entry, expect a focused single-mechanic experience with a clear objective.",
        "keyFeatures": [
            "Built in under 13 kilobytes (code, art, audio)",
            "Submitted to js13kGames 2019",
            "Author: Niki Gawlik",
            "Competition-recognised entry",
            "This retro style racing game is about navigating a randomly generated 3D city in"
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
        "about": "My first game ever in a JAM and also my first experience at js13kgames. I really want to improve this alot, making an entire game inside 13KB is an awesome challenge and a though one too. I want to thank Jom to make the music loop and also apologize to my incompetence to transform the MIDI into something that would be played in the game. \n\nWe Must Go Back! was submitted to the js13kGames 2019 competition by ByGm3. It earned competition recognition. Like every js13k entry, the entire game — code, art, and audio — fits in 13 kilobytes, a constraint that rewards focused, clever design over bulk. SPOILERS: This is a endless runners, you will never help him.",
        "howToPlay": "We Must Go Back! uses standard browser-game controls (keyboard, mouse, or touch). Open the game via the source link below to see the in-game instructions, as controls vary per entry.\n\nAs a js13k entry, expect a focused experience built around one core mechanic. Read the title screen for the specific objective and any special inputs.",
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
