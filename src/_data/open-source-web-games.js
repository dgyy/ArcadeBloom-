'use strict';

// Browser-playable projects verified from newgames.md on 2026-09-22.
// sourceUrl always points to the creator-controlled play page. The hostedPath
// allowlist may offer a local mirror without weakening upstream attribution.
module.exports = [
    {
        id: 3054, slug: 'anarch', name: 'Anarch', category: 'action',
        tagline: 'Explore a tiny pacifist maze shooter built to run almost anywhere.',
        about: 'Anarch is drummyfish\'s deliberately tiny, from-scratch first-person action game inspired by 1990s ray-casting shooters. Its robots, levels, textures and sounds are original, and the complete project is dedicated to the public domain. The browser build packs the whole campaign into a compact WebAssembly download.',
        howToPlay: 'Use the on-screen direction controls or keyboard movement keys to explore each maze. Search for exits, manage health and ammunition, and disable hostile robots while working through the included levels.',
        keyFeatures: ['Compact WebAssembly build', 'Original public-domain code and assets', 'Retro ray-cast presentation', 'Keyboard and touch controls'],
        screenshots: [], sourceName: 'drummyfish', sourceUrl: 'https://drummyfish.gitlab.io/anarch/bin/web/anarch.html',
        licence: 'CC0-1.0', licenceStatus: 'osi-approved', sourceKey: 'gitlab:drummyfish/anarch',
        tags: ['shooter', 'retro', 'minimal', 'open-source'], addedDate: '2026-09-22', releaseDate: '2021', featured: false
    },
    {
        id: 3055, slug: 'isocity', name: 'IsoCity', category: 'simulation',
        tagline: 'Build an isometric city one road, home and service at a time.',
        about: 'IsoCity is Alex Milich\'s open-source city-building sandbox for the browser. Place roads, zones and civic services on an isometric grid, then watch the settlement change as its connected systems grow. The project is actively developed in TypeScript and publishes its playable build on the creator\'s own domain.',
        howToPlay: 'Choose a map and use the build menu to place roads, residential areas, businesses and public services. Keep the network connected, balance expansion with available resources, and inspect the city as it develops.',
        keyFeatures: ['Isometric city construction', 'Road and zoning systems', 'Browser-based saveable sandbox', 'Open TypeScript source'],
        screenshots: [], sourceName: 'Alex Milich', sourceUrl: 'https://iso-city.com/',
        licence: 'MIT', licenceStatus: 'osi-approved', sourceKey: 'github:amilich/isometric-city',
        tags: ['sandbox', 'relaxing', 'open-source'], addedDate: '2026-09-22', releaseDate: '2023', featured: false
    },
    {
        id: 3056, slug: 'server-survival', name: 'Server Survival', category: 'simulation',
        tagline: 'Design resilient cloud systems while traffic, failures and costs keep climbing.',
        about: 'Server Survival by Kostyantyn Pshenychnyy turns cloud architecture into an interactive systems game. Build a service diagram, route several kinds of traffic and respond to attacks, outages and capacity limits. Survival, campaign and sandbox modes introduce real infrastructure concepts through a fully client-side three-dimensional simulation.',
        howToPlay: 'Select a mode, place infrastructure services from the toolbar and connect them into valid request paths. Watch budget, reputation, latency and capacity, then upgrade, repair or reroute the system as traffic and failures escalate.',
        keyFeatures: ['Survival, campaign and sandbox modes', 'Twenty-six infrastructure services', 'Traffic and failure simulation', 'Multiple interface languages'],
        screenshots: [], sourceName: 'Kostyantyn Pshenychnyy', sourceUrl: 'https://pshenok.github.io/server-survival/',
        licence: 'MIT', licenceStatus: 'osi-approved', sourceKey: 'github:pshenok/server-survival',
        tags: ['sandbox', 'survival', 'brain-burner', 'open-source'], addedDate: '2026-09-22', releaseDate: '2025', featured: false
    },
    {
        id: 3057, slug: 'dungeon-crawl-stone-soup', name: 'Dungeon Crawl Stone Soup', category: 'strategy',
        tagline: 'Descend through a famously deep roguelike on an official WebTiles server.',
        about: 'Dungeon Crawl Stone Soup is a long-running community roguelike about retrieving the Orb of Zot from a dangerous, procedurally generated dungeon. The official play selector links regional WebTiles servers, bringing the complete turn-based game to a browser with spectator support and persistent online characters.',
        howToPlay: 'Choose a nearby WebTiles server and create an account or sign in. Pick a species and background, then move one turn at a time, examine items, develop skills and descend carefully; character death is permanent.',
        keyFeatures: ['Deep turn-based dungeon exploration', 'Procedurally generated runs', 'Many species, backgrounds and gods', 'Official regional WebTiles servers'],
        screenshots: [], sourceName: 'DCSS Devteam', sourceUrl: 'https://crawl.develz.org/play.htm',
        licence: 'GPL-2.0', licenceStatus: 'osi-approved', sourceKey: 'github:crawl/crawl',
        tags: ['roguelike', 'turn-based', 'hardcore', 'procedurally-generated', 'open-source'], addedDate: '2026-09-22', releaseDate: '1997', featured: false
    },
    {
        id: 3059, slug: 'hurry-curry', name: 'Hurry Curry!', category: 'action',
        tagline: 'Coordinate a frantic curry kitchen with friends before the orders pile up.',
        about: 'Hurry Curry! is a cooperative cooking game from the metamuffin community. Players share a compact kitchen, move ingredients through preparation stations and race to complete curry orders together. The official browser edition connects to the project\'s multiplayer service, so the experience is designed around live teamwork.',
        howToPlay: 'Open the browser version, join or create a session and coordinate jobs with the other cooks. Collect ingredients, use each preparation station in the right order and deliver completed dishes before waiting orders expire.',
        keyFeatures: ['Online cooperative cooking', 'Short coordination-focused rounds', 'Official browser client', 'Community-developed source'],
        screenshots: [], sourceName: 'Hurry Curry contributors', sourceUrl: 'https://hurrycurry-web.metamuffin.org/',
        licence: 'AGPL-3.0', licenceStatus: 'osi-approved', sourceKey: 'codeberg:hurrycurry/hurrycurry',
        tags: ['timing', 'multiplayer', 'couch-co-op', 'quick-fix', 'open-source'], addedDate: '2026-09-22', releaseDate: '2024', featured: false
    },
    {
        id: 3060, slug: 'openlara-demo', name: 'OpenLara Demo', category: 'action',
        tagline: 'Try a browser demo of the open engine recreating classic tomb exploration.',
        about: 'OpenLara is XProger\'s open-source engine for classic Tomb Raider environments. Its official WebGL page provides an authorised demonstration level directly in the browser, showing the engine\'s movement, swimming, climbing and three-dimensional exploration. This listing covers that demo rather than the commercial original game or its data.',
        howToPlay: 'Load the official demo and use its keyboard controls to move, jump, climb, swim and interact with the environment. Explore the supplied level and consult the on-page control reference if an action is unfamiliar.',
        keyFeatures: ['Official WebGL demonstration', 'Classic three-dimensional exploration', 'Keyboard and gamepad-style controls', 'Open engine implementation'],
        screenshots: [], sourceName: 'XProger', sourceUrl: 'http://xproger.info/projects/OpenLara/',
        licence: 'source-available', licenceStatus: 'source-available', sourceKey: 'github:XProger/OpenLara',
        tags: ['platformer', 'retro', 'experimental'], addedDate: '2026-09-22', releaseDate: '2016', featured: false
    },
    {
        id: 3062, slug: 'open-golf', name: 'Open Golf', category: 'racing-sports',
        tagline: 'Line up compact miniature-golf shots in a clean author-hosted Web build.',
        about: 'Open Golf is Michael Gerdes\' small open-source miniature-golf game, built from a custom C codebase and published as a browser version by its author. Simple courses focus on reading slopes, choosing an angle and controlling shot power rather than navigating menus or progression systems.',
        howToPlay: 'Aim the shot toward the hole, set an appropriate power level and release to strike the ball. Use the course walls and slopes carefully, then finish each hole in as few strokes as possible.',
        keyFeatures: ['Compact miniature-golf courses', 'Angle and power shot control', 'Author-hosted Web build', 'Open portable codebase'],
        screenshots: [], sourceName: 'Michael Gerdes', sourceUrl: 'https://mgerdes.github.io/minigolf.html',
        licence: 'MIT', licenceStatus: 'osi-approved', sourceKey: 'github:mgerdes/Open-Golf',
        tags: ['sports', 'physics', 'quick-fix', 'open-source'], addedDate: '2026-09-22', releaseDate: '2022', featured: false
    },
    {
        id: 3063, slug: 'fish-folk-jumpy', name: 'Fish Folk: Jumpy', category: 'action',
        tagline: 'Battle other fish in a fast local arena platformer with chaotic weapons.',
        about: 'Fish Folk: Jumpy is a fast arena platformer from the Fish Folk community. Several fish leap around a compact stage, collect weapons and try to knock one another out in quick multiplayer rounds. The official browser demo makes the Bevy-based project immediately playable without a download.',
        howToPlay: 'Add players, choose controls and enter an arena. Run and jump between platforms, pick up weapons and time attacks to defeat opponents while avoiding their shots and the stage hazards.',
        keyFeatures: ['Local multiplayer arena battles', 'Platform movement and weapon pickups', 'Short replayable rounds', 'Official Web demo'],
        screenshots: [], sourceName: 'Fish Folk', sourceUrl: 'https://fishfolk.github.io/jumpy/player/latest/',
        licence: 'source-available', licenceStatus: 'source-available', sourceKey: 'github:fishfolk/jumpy',
        tags: ['platformer', 'shooter', 'couch-co-op', 'open-source'], addedDate: '2026-09-22', releaseDate: '2021', featured: false
    },
    {
        id: 3064, slug: 'fish-folk-punchy', name: 'Fish Folk: Punchy', category: 'action',
        tagline: 'Trade quick close-range blows in a colorful fish folk arena.',
        about: 'Fish Folk: Punchy is a community-made two-dimensional arena fighting game built with the Bevy engine. Its official Web demo puts expressive fish characters into compact stages for immediate local matches. The source code is open, while this listing leaves the hosted media with its original publisher.',
        howToPlay: 'Configure the participating players and their controls, then move around the arena and use attacks, dodges and positioning to outlast the opposition. Learn each action\'s timing across repeated short matches.',
        keyFeatures: ['Local arena fighting', 'Distinct animated fish characters', 'Quick rematch-friendly rounds', 'Official browser demo'],
        screenshots: [], sourceName: 'Fish Folk', sourceUrl: 'https://fishfolk.github.io/punchy/player/latest/',
        licence: 'source-available', licenceStatus: 'source-available', sourceKey: 'github:fishfolk/punchy',
        tags: ['timing', 'couch-co-op', 'skill-based', 'quick-fix', 'open-source'], addedDate: '2026-09-22', releaseDate: '2022', featured: false
    },
    {
        id: 3065, slug: 'whatajong', name: 'Whatajong', category: 'puzzle',
        tagline: 'Build and clear hands in a playful solo spin on mahjong tiles.',
        about: 'Whatajong is Mario Menti\'s browser-based tile game inspired by mahjong patterns and modern run-building games. It presents compact rounds through a polished Web interface and keeps the focus on recognising combinations, choosing which tiles to retain and adapting a hand as new options appear.',
        howToPlay: 'Start a run and inspect the available tiles and scoring goals. Select, keep or replace tiles to form valuable combinations, then commit the hand when it meets a useful pattern and continue through the next round.',
        keyFeatures: ['Mahjong-inspired tile combinations', 'Solo run-based structure', 'Responsive browser interface', 'Open Vite and Electron source'],
        screenshots: [], sourceName: 'Mario Menti', sourceUrl: 'https://whatajong.com/',
        licence: 'MIT', licenceStatus: 'osi-approved', sourceKey: 'github:masylum/whatajong',
        tags: ['board-game', 'turn-based', 'brain-burner', 'open-source'], addedDate: '2026-09-22', releaseDate: '2024', featured: false
    },
    {
        id: 3066, slug: 'micropolisjs', name: 'micropolisJS', category: 'simulation',
        tagline: 'Grow a classic city simulation through a faithful JavaScript browser port.',
        about: 'micropolisJS is Graeme McCutcheon\'s JavaScript port of Micropolis, the open-source release descended from the original SimCity code. Zone land, connect utilities, set taxes and respond to an evolving urban simulation directly in the browser. The project preserves the old interface and systemic city-building focus.',
        howToPlay: 'Generate or load a map, lay roads and power lines, then zone residential, commercial and industrial districts. Add services, adjust the budget and watch demand, traffic, pollution and disasters as the city grows.',
        keyFeatures: ['Classic city simulation systems', 'Zoning, utilities and budgets', 'Disasters and changing demand', 'Direct JavaScript browser port'],
        screenshots: [], sourceName: 'Graeme McCutcheon', sourceUrl: 'https://www.graememcc.co.uk/micropolisJS/',
        licence: 'GPL-3.0', licenceStatus: 'osi-approved', sourceKey: 'github:graememcc/micropolisJS',
        tags: ['sandbox', 'classic', 'retro', 'open-source'], addedDate: '2026-09-22', releaseDate: '2013', featured: false
    }
];
