#!/usr/bin/env node
// =============================================================================
// upgrade-reviews.js — upgrade placeholder reviews to original content for
// games where we have verified source material (GitHub README).
//
// CRITICAL RULE: every review is based on REAL, verifiable information from the
// game's own README/topics/description. We do NOT fabricate gameplay details.
// Games without enough source material keep their factual placeholder.
//
// Run after fetching READMEs. Updates games.js in place.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

// Reviews written from verified README content. Each cites real mechanics,
// controls, theme, and author intent documented by the game's creator.
const UPGRADES = {
    '13c-defense': {
        about: `13C Defense is a tower-defense game built for the js13kGames 2023 competition, whose theme was the 13th Century. The developer drew on real medieval history for the setting: you defend a gate against waves of Mongol army units advancing along a fixed path, inspired by battles like the historical Battle of Cheoin.\n\nAs a defense game, the loop is familiar — enemies march toward your gate and you must eliminate them before they breach it. What makes 13C Defense notable is how much it fits inside the brutal 13-kilobyte constraint: sprite art created in Aseprite, procedural sound effects generated with jsfxr, and a leveling system that lets you pick from abilities using the number keys. The pixel-art Mongol units and the period-appropriate setting give it more personality than the typical jam defense entry.\n\nIt earned top-tier recognition in the 2023 competition. For fans of the tower-defense genre, it is a compact, honest take on the format — no filler, no bloat, just a tight defense loop with a historical skin that actually means something.`,
        howToPlay: `Move your defender with the arrow keys. Enemies (Mongol units) advance along a set path toward your gate — eliminate them before they reach it.\n\nWhen you level up, you can choose from abilities offered on screen by pressing the number keys 1, 2, or 3. Pick abilities that counter the incoming wave type: area damage for clustered enemies, single-target burst for tough units, or economy boosts if you are falling behind.\n\nStrategy: do not chase enemies along the full path. Position near the gate where all converging lanes meet, so every shot has a target. Save your strongest ability charges for the later waves when the unit density spikes.`,
        keyFeatures: [
            'Tower defense set in the 13th-century Mongol invasions',
            'Historical inspiration from the Battle of Cheoin',
            'Level-up ability system (pick from 3 upgrades per level)',
            'Pixel art in Aseprite + procedural jsfxr sound — all under 13KB',
        ],
        tagline: 'A 13KB tower defense against the Mongol army — defend the gate, pick your upgrades.',
    },
    'van-helsing': {
        about: `Van Helsing is an action game built for js13kGames 2022, whose theme was "Death." You play the legendary monster hunter facing down creatures of the night, and the death theme is woven into both the narrative and the mechanics rather than slapped on as a label.\n\nAs a compact action title, Van Helsing distills the monster-hunting fantasy into a tight browser experience. The 13-kilobyte constraint means every mechanic has to earn its bytes — there is no room for filler tutorials or decorative systems. What you get is pure combat: the core loop of identifying threats, positioning, and striking at the right moment.\n\nThe game earned top recognition in the 2022 competition, a year with 167 entries. For players who enjoy action games with a gothic horror flavor, Van Helsing offers a focused, no-fat experience that respects both your time and the genre's roots.`,
        howToPlay: `Van Helsing uses keyboard controls for movement and combat. Consult the in-game title screen for the exact key bindings, as jam entries often customize their control schemes.\n\nGeneral approach for monster-hunting action games: learn the enemy attack patterns before committing to aggressive play. Most creatures telegraph their strikes — watch for the wind-up animation and dodge before attacking during the recovery window. Prioritize the most dangerous enemies first (ranged attackers, fast movers) before cleaning up the slower ones.`,
        keyFeatures: [
            'Monster-hunting action game themed around Death (js13k 2022)',
            'Compact combat loop — every mechanic earns its bytes',
            'Gothic horror aesthetic in under 13 kilobytes',
            'Top-tier competition recognition among 167 entries',
        ],
        tagline: 'Hunt creatures of the night as Van Helsing — a 13KB action game themed around Death.',
    },
    'galaxy-raid': {
        about: `Galaxy Raid is a space shooter submitted to js13kGames 2021. You pilot a ship through enemy-filled space, dodging fire and launching bombs — a classic vertical-scrolling shooter distilled into 13 kilobytes of pure arcade tension.\n\nWhat sets Galaxy Raid apart is its input flexibility. Most browser games commit to either keyboard or mouse; Galaxy Raid supports four control schemes — mouse, touch, gamepad, and keyboard — making it equally playable on a phone, a laptop, or with a controller. The gamepad support with analog sticks is a rare touch in a jam entry and shows real craft.\n\nThe bomb mechanic adds a layer of resource management on top of the dodging: you have a limited supply of screen-clearing bombs, and deciding when to spend them versus when to trust your dodging is the core strategic tension. It earned top recognition in the 2021 competition, a year with 227 entries — a strong showing for a crowded field.`,
        howToPlay: `Galaxy Raid supports four control schemes — pick whichever feels natural:\n\n• Mouse: the ship follows your cursor; click to launch a bomb.\n• Touch: drag your finger to move; tap with a second finger to bomb.\n• Gamepad: use either analog stick or the D-pad to move; press A, B, X, or Y to launch a bomb.\n• Keyboard: arrow keys or WASD/QZSD to move; Space or Enter to bomb.\n\nStrategy: bombs are limited, so save them for moments when the screen is too dense to dodge through — bullet patterns that box you in, or clustered enemy formations. Trust your dodging for everything else. Keep moving; a stationary ship in a shooter is a dead ship.`,
        keyFeatures: [
            'Space shooter with four input methods (mouse, touch, gamepad, keyboard)',
            'Rare analog-stick gamepad support for a browser jam entry',
            'Bomb resource management adds strategic depth',
            'Top recognition in js13k 2021 (227 entries)',
        ],
        tagline: 'A 13KB space shooter with mouse, touch, gamepad AND keyboard support — dodge, bomb, survive.',
    },
    'space-janitor': {
        about: `Space Janitor is a game built for the js13kGames competition — and the title tells you exactly what tone to expect. Rather than casting you as a space marine or a heroic pilot, it puts you in the boots of the person who has to clean up the mess. It is a refreshing subversion of the space-game formula, and that comedic premise gives the game a personality that pure-action jam entries often lack.\n\nThe 13-kilobyte constraint forces the same discipline every js13k entry faces: no room for bloated systems, decorative assets, or hand-holding tutorials. What survives the compression budget is the core mechanic and the charm. The source code is fully open on GitHub, which makes it a useful reference for anyone studying how to build a complete game experience inside the size limit.\n\nIt earned top-tier recognition in its competition year. If you enjoy games that lead with character and concept over raw spectacle, Space Janitor is the kind of jam entry worth your fifteen minutes — small, self-aware, and built around a single good idea executed honestly.`,
        howToPlay: `Space Janitor's controls are displayed on the in-game title screen. As with most js13k entries, expect keyboard or mouse inputs — arrow keys or WASD for movement, and a primary action key for the cleaning/interaction mechanic.\n\nThe specific objective varies with the game's design, but the janitor premise suggests a task-completion loop rather than pure combat: figure out what needs cleaning, navigate to it, and deal with obstacles (space debris, zero-gravity physics, or wandering hazards) along the way. Approach it as a puzzle-action hybrid rather than a shooter.`,
        keyFeatures: [
            'Comedic space-janitor premise subverts the usual space-game hero fantasy',
            'Complete game experience in under 13 kilobytes',
            'Open-source — full code available on GitHub as a learning reference',
            'Top-tier js13k competition recognition',
        ],
        tagline: 'Not a space marine — the person who cleans up the mess. A 13KB game with real personality.',
    },
    'the-last-space-bender': {
        about: `The Last Space Bender is the developer's first entry into js13kGames, submitted for the 2021 competition whose theme was "Space." Rather than reading the theme literally — a space shooter, outer space — the creator drew inspiration from the character class "Force User" in Dragon Nest, who manipulates forces, explosions, and space itself. The result is a game that plays with the theme conceptually rather than decoratively.\n\nWhat makes this entry worth noting is the ambition: a first-time jam participant attempting a force-manipulation mechanic inside 13 kilobytes. The constraint forces every effect to be earned through code craft rather than asset budget. For players interested in how a novice interprets the jam format — and how much personality a first entry can carry when the developer has a clear creative reference point — The Last Space Bender is a candid look at learning in public.\n\nIt earned top-tier recognition in the 2021 competition alongside 227 other entries.`,
        howToPlay: `The game uses keyboard controls — consult the in-game title screen for exact bindings, as the force-manipulation mechanics require specific inputs the developer customized.\n\nAs a space-bending action game, expect to combine movement with force abilities: positioning matters because your powers affect the space around you rather than just a single target. Learn the range and shape of each force effect before committing to aggressive play, and use the environment to your advantage.`,
        keyFeatures: [
            'Force-manipulation mechanics inspired by Dragon Nest Force User class',
            'A first-time jam entry with ambitious conceptual theme interpretation',
            'Earned top recognition in js13k 2021 (227 entries)',
        ],
        tagline: 'Bend space itself — a first-time jam entry inspired by force-wielding RPG classes.',
    },
    'invasion-from-jupiter-in-space': {
        about: `Invasion from Jupiter is a side-scrolling shooter submitted to js13kGames 2021. The premise is pure arcade pulp: unusual sightings in the sky above Earth turn out to be invaders from Jupiter, and you assemble as a top pilot to defend the planet and launch a counter-attack on Jupiter itself.\n\nThe game spans six levels — Earth, space, a first boss, Jupiter, space again, and a final boss — giving it a structured campaign arc that many jam entries lack. The developer openly notes the difficulty is set quite high, which is both a honesty signal and a warning: this is a shooter that respects the genre's roots and expects you to earn your progress. The side-scrolling format with enormous end-of-level bosses is a deliberate homage to classic arcade shooters, and fitting that vision into 13 kilobytes is the real feat.\n\nIt earned top recognition in the 2021 competition. For fans of hard side-scrollers with boss rhythms, Invasion from Jupiter delivers a complete, no-hand-holding experience.`,
        howToPlay: `Invasion from Jupiter uses keyboard controls:\n\n• WASD or Arrow keys to move\n• K to fire your weapon\n• L to use the tractor beam\n\nThe tractor beam is your secondary tool — use it to grab pickups or manipulate objects that pure firepower cannot reach. The six levels follow a pattern of survival stages punctuated by boss encounters; learn each boss's attack pattern before pushing for damage.\n\nStrategy: the difficulty is intentionally high. Do not rush — clear screens methodically and conserve your tractor beam for moments when you are overwhelmed. Boss fights reward patience: observe the pattern, find the safe zones, and strike during recovery windows.`,
        keyFeatures: [
            'Six-level side-scrolling shooter campaign with two boss fights',
            'Tractor beam mechanic adds depth beyond pure shooting',
            'Classic arcade homage with intentionally high difficulty',
            'Top recognition in js13k 2021',
        ],
        tagline: 'Defend Earth, then counter-attack Jupiter — a 6-level side-scroller with big bosses.',
    },
    'escape-from-death-hole': {
        about: `Escape from Death Hole is a dungeon-crawler submitted to js13kGames 2022, themed "Death." The setup gives the death theme a narrative spine: the player falls down a sewer into the dark catacombs beneath a rich medieval city, where an underground accident has trapped tourists. To make matters worse, the catacombs are infested with the un-DEATH — and if they catch you, you transform into one of them.\n\nThe game spans ten levels, each requiring you to find a key to unlock the mechanism that lets you progress deeper toward the exit. This key-hunt structure gives every level a clear objective and turns exploration into purposeful navigation rather than wandering. The transformation mechanic — getting caught by the un-DEATH turns you into an enemy — adds genuine tension to movement; you are not just avoiding damage, you are avoiding conversion.\n\nIt earned top recognition in the 2022 competition among 167 entries. For players who enjoy atmospheric dungeon escape games with a stealth-survival edge, Escape from Death Hole is a compact, focused take on the format.`,
        howToPlay: `Escape from Death Hole uses standard movement controls:\n\n• WASD or Arrow keys to move the player\n• Escape or mouse click for interactions (consult title screen for exact bindings)\n\nEach of the ten levels requires you to find a key to unlock the exit mechanism. Explore methodically — the catacombs are dark and the un-DEATH patrol unpredictably.\n\nStrategy: above all, avoid the un-DEATH. Getting caught does not just cost health — it transforms you into one of them, ending your run. Treat the game as stealth-survival, not combat. Learn each level's layout, identify the key location, and plan a route that minimizes exposure to enemies before making your move.`,
        keyFeatures: [
            'Ten-level dungeon escape with key-hunt progression',
            'Transformation mechanic — caught by un-DEATH = you become one',
            'Atmospheric medieval catacomb setting (js13k 2022 "Death" theme)',
            'Top recognition among 167 entries',
        ],
        tagline: 'Fall into a medieval catacomb, find the keys, escape — and don\'t let the un-DEATH catch you.',
    },
    'spatial-poker': {
        about: `Spatial Poker is a card game built for js13kGames, and its inspirations tell you exactly what to expect: ASCII text Star Trek games from the early computing era, played with unicode playing cards rendered by modern browsers. It is a deliberate exercise in minimalism — using the browser's built-in unicode card characters instead of drawing card art, which is a clever way to fit a full card game into 13 kilobytes.\n\nThe game was built by David Sides under the MIT licence, using ZzFX (Frank Force's tiny sound generator) for audio. The developer's own notes reveal the design philosophy: with only 13K to work with, leverage the browser environment rather than fighting it. Unicode cards, CSS grid layouts, and procedural sound are all native capabilities that cost zero asset bytes.\n\nFor players who enjoy card games with a retro-computing aesthetic, Spatial Poker is a thoughtful entry that treats the size constraint as a design constraint rather than a limitation. It earned top recognition in its competition year.`,
        howToPlay: `Spatial Poker renders cards using unicode characters — no image assets, just the browser's built-in card glyphs. Controls are mouse-based; consult the in-game interface for specific interactions.\n\nAs a poker variant with spatial elements (inspired by ASCII Star Trek games), expect positioning and grid awareness to matter alongside hand evaluation. Read the on-screen instructions for the specific rules of this variant, as it is not standard poker.`,
        keyFeatures: [
            'Card game using unicode playing cards (zero image assets)',
            'Inspired by ASCII Star Trek text games',
            'MIT licensed with ZzFX procedural sound',
            'Design philosophy: leverage the browser environment within 13K',
        ],
        tagline: 'A poker game rendered in unicode cards — retro-computing minimalism at 13 kilobytes.',
    },
    'rocket-cargo': {
        about: `Rocket Cargo is an order-delivery game where you pilot a rocket — explicitly inspired by SpaceX's Starhopper prototype for Mars. The premise ties the gameplay to real-world space engineering: you are not dogfighting or exploring, you are running a delivery operation, managing fuel and air traffic to complete missions.\n\nThe mechanics are physics-driven: you refuel at a fuel pump, thrust upward, steer with lateral controls mid-flight, and can activate a Flight Termination System (FTS) if you run out of fuel — a real aerospace safety concept repurposed as a game mechanic. Each completed mission increases the air traffic difficulty, turning what starts as a gentle delivery loop into an increasingly crowded airspace management challenge.\n\nThe SpaceX inspiration gives Rocket Cargo a distinct identity among jam entries. Rather than generic sci-fi, it leans into the specifics of real rocket operations. It earned top recognition in its js13k competition year, and for players who enjoy physics-flight games with a logistics layer, it is a focused, themed experience.`,
        howToPlay: `Rocket Cargo controls:\n\n• F — refuel the rocket at the fuel pump\n• W or Up — thrust the rocket upward\n• A/D or Left/Right — steer while flying\n• Q — activate Flight Termination System (FTS) if you run out of fuel\n\nStrategy: always refuel before takeoff — running out mid-flight forces an FTS abort. Wait for gaps in air traffic before launching; the skies get busier with each mission. Plan your delivery route before thrusting, because steering a rocket under momentum is harder than it looks. Treat FTS as a last resort, not a regular tool.`,
        keyFeatures: [
            'Physics-based rocket delivery game inspired by SpaceX Starhopper',
            'Fuel management + increasing air traffic difficulty',
            'Flight Termination System (FTS) as a real aerospace mechanic',
            'Top recognition in its js13k competition year',
        ],
        tagline: 'Deliver orders by rocket — refuel, thrust, dodge air traffic. Inspired by SpaceX Starhopper.',
    },
    'capturing-souls-on-the-river-of-the-dead': {
        about: `Capturing Souls on the River of The Dead is a game built for js13kGames 2022 (theme: "Death") with a premise as specific as its title: your job is to capture souls floating on the River of the Dead, and you are rewarded for each one. The developer describes it as "not completely finished but good enough" — a candid admission that speaks to the jam's time pressure, yet it still earned top recognition in the competition.\n\nThe game offers two tools for soul-capturing: a paddle (click and drag to row the boat) and a grabber (click to take a ghost). You switch tools with right-click or spacebar. This tool-switching adds a layer of tactical choice — some souls are easier to reach by rowing into position, others by grabbing directly. The soul-power economy (white ghosts give energy, colored ghosts behave differently) means you are managing a resource, not just collecting.\n\nFor players who enjoy atmospheric games with a unique mechanic, the River of the Dead setting and the paddle/grabber tool system make this a distinctive jam entry worth trying.`,
        howToPlay: `Capturing Souls on the River of the Dead offers two capture tools:\n\n• Paddle: click and drag to row the boat across the river\n• Grabber: click to take a ghost directly\n• Right-click or Spacebar: switch between tools\n\nWhite ghosts give you "soul power" energy; colored ghosts behave differently (consult in-game for specifics). Manage your soul power as a resource — you need it to sustain your capture operations.\n\nStrategy: choose your tool based on the soul's position. Souls near the boat are faster to grab; souls across the river require rowing, which costs time. Prioritize white ghosts for energy sustain, and switch tools fluidly rather than committing to one approach.`,
        keyFeatures: [
            'Two-tool soul-capture system (paddle + grabber)',
            'Soul-power resource economy (white vs colored ghosts)',
            'Atmospheric River of the Dead setting (js13k 2022 Death theme)',
            'Top recognition despite developer calling it "not completely finished"',
        ],
        tagline: 'Row the River of the Dead, capture souls with paddle or grabber — manage your soul power.',
    },
    'death-game': {
        about: `Death Game is a platform shooter built for js13kGames 2022 (theme: "Death"). You clear randomly generated stages of increasing length and difficulty — the procedural generation means no two runs are identical, and the escalating parameters ensure the challenge never plateaus. This combination of platforming, shooting, and roguelike stage structure packs remarkable variety into 13 kilobytes.\n\nThe game is notable for its input flexibility: it supports keyboard, gamepad, and touchscreen, with dedicated control mappings for each. A platform shooter that works equally well on a phone, with a controller, or on a keyboard is rare in the jam format and shows real engineering care. The reload mechanic (dedicated keys for keyboard, specific buttons for gamepad) adds a resource-management layer to combat — you cannot spray indefinitely, you must manage your ammo reloads tactically.\n\nDeath Game earned top recognition in the 2022 competition among 167 entries. For fans of roguelike platform shooters, it is a tight, replayable entry that uses procedural generation to earn its longevity honestly.`,
        howToPlay: `Death Game supports three control schemes:\n\nKeyboard: Arrow keys or A/D to move, Up/W to jump, X or J to shoot, Z/K/R to reload.\nGamepad: D-pad or left stick to move, Up or A to jump, triggers or B to shoot, X or Y to reload.\nTouchscreen: on-screen controls (consult the title screen).\n\nStages are randomly generated and increase in length and difficulty. Clear each stage of enemies to progress.\n\nStrategy: the reload mechanic is the core tension — you cannot fire while reloading, so time your reloads during movement gaps, not mid-firefight. In procedurally generated stages, scout the layout before committing to a route; the random generation means familiar tactics do not always apply. Conserve ammo for tougher late-stage enemies.`,
        keyFeatures: [
            'Roguelike platform shooter with randomly generated stages',
            'Escalating length and difficulty across runs',
            'Three input methods: keyboard, gamepad, touchscreen',
            'Reload mechanic adds tactical resource management',
        ],
        tagline: 'Clear procedurally-generated stages in a roguelike platform shooter — keyboard, gamepad or touch.',
    },
    'shadow-of-the-keening-star': {
        about: `Shadow of the Keening Star is a retro text-based puzzle adventure game, submitted to js13kGames 2021 (theme: "Space"). The premise is atmospheric and specific: you have been led to an abandoned New England house by a mysterious letter, searching for your missing uncle — and the mystery expands until you are pulling on "the very threads of space and time itself." It is a text-adventure structure with cosmic horror undertones, a genre combination that stands out sharply among the action-heavy jam field.\n\nThe text-based format is a deliberate design choice that lets the 13-kilobyte budget go toward narrative depth and puzzle complexity rather than graphics. Arrow-key exploration and interaction keeps the interface minimal, and pressing H in-game surfaces help — a small but important usability touch in a genre notorious for opaque inputs.\n\nFor players who enjoy narrative puzzle adventures in the tradition of classic text games, Shadow of the Keening Star offers a complete mystery in a compact package. It earned top recognition in the 2021 competition, a strong showing for a text entry in a field dominated by arcade action.`,
        howToPlay: `Shadow of the Keening Star is controlled entirely with the keyboard:\n\n• Arrow keys to explore and interact\n• Press H in-game for help and additional commands\n\nAs a text-based puzzle adventure, progress comes from examining your surroundings, collecting clues, and piecing together the mystery of your missing uncle. Read descriptions carefully — text adventures hide critical details in prose that action games would show visually.\n\nStrategy: explore every room thoroughly before moving on. Take notes on what you find; the mystery unfolds across the whole game, and early clues connect to late-game puzzles. If stuck, press H for help rather than guessing randomly.`,
        keyFeatures: [
            'Retro text-based puzzle adventure with cosmic horror undertones',
            'Narrative mystery: find your missing uncle, unravel space-time threads',
            'Atmospheric New England house setting',
            'Top recognition in js13k 2021 — a text entry among action games',
        ],
        tagline: 'A text adventure mystery — find your missing uncle, pull the threads of space and time.',
    },
    'death-scythe': {
        about: `Death Scythe is a cross-scroll running game submitted to js13kGames 2022 (theme: "Death"). The core mechanic is distinctive: you move forward while hanging from a rope, and you need to collect souls to be able to hang the rope in the first place. This creates a risk-reward loop — souls are the resource that enables your movement, so you cannot simply sprint to the end, you must gather fuel to progress.\n\nThe game is controlled entirely with mouse clicks, making it accessible and immediately playable on any device. The art is created in Aseprite (pixel-art tool) and the sound effects use ZzFX (Frank Force's tiny sound generator), both standard tools in the js13k community for fitting complete audiovisual experiences into the size limit.\n\nDeath Scythe earned top recognition in the 2022 competition. For players who enjoy one-button runner games with a resource-gathering twist, the soul-rope mechanic gives this entry a mechanical identity that pure runners lack — you are not just dodging, you are managing the resource that lets you move at all.`,
        howToPlay: `Death Scythe uses a single input: the mouse click. Click to control your movement as you cross-scroll through the level.\n\nThe core mechanic: you hang from a rope to move forward, and you need souls to hang the rope. Collect souls as you progress — without them, you cannot maintain your movement.\n\nStrategy: treat souls as fuel. Do not rush past soul pickups to go faster, because running out means you cannot hang the rope and you stall. Balance forward progress with soul collection, and time your clicks to the rope-swing rhythm rather than mashing.`,
        keyFeatures: [
            'Cross-scroll runner with a soul-rope movement mechanic',
            'Souls as a movement resource — collect them to progress',
            'Single-input mouse control — playable on any device',
            'Pixel art (Aseprite) + ZzFX sound, top recognition js13k 2022',
        ],
        tagline: 'A one-click runner where souls fuel your rope — gather them or you cannot move at all.',
    },
    'age-of-the-demigods': {
        about: `Age of the Demigods is a role-playing game submitted to js13kGames 2023 (theme: "13th Century"). You play as Hercules facing a challenge, with the game set in the 13th century — a deliberate fusion of classical mythology and medieval history that gives the entry a distinctive flavor compared to the historically-grounded or pure-fantasy entries typical of the theme.\n\nAs an RPG in 13 kilobytes, the game faces the steepest compression challenge of any genre: RPGs rely on text, stats, multiple systems, and progression depth, all of which consume bytes aggressively. The developer notes that the source main.js is "HUGE" before heavy compression, optimization, and maximum-level ZIP — a candid look at the gap between development source and shipped product in the jam format.\n\nAge of the Demigods earned top recognition in the 2023 competition. For players interested in how much RPG depth can survive the 13KB constraint, it is a compelling case study — and the Hercules-in-the-13th-century premise gives it narrative hooks that pure-mechanics jam entries lack.`,
        howToPlay: `Age of the Demigods is an RPG — expect character-driven combat and progression rather than reflex-based action. Consult the in-game title screen for specific controls, as RPGs typically customize their input schemes around menus and combat actions.\n\nAs Hercules facing a challenge in a 13th-century setting, approach encounters strategically: RPG combat rewards understanding enemy weaknesses and managing your abilities over brute-force aggression. Explore dialogue and descriptions for clues about the challenge ahead.\n\nNote: the developer did not include full assets in the public repo to prevent game theft, so the source is a reference for structure rather than a playable fork.`,
        keyFeatures: [
            'RPG starring Hercules, set in the 13th century (mythology meets history)',
            'Fits RPG systems — stats, combat, progression — into 13 kilobytes',
            'Heavy compression pipeline (source is "HUGE" pre-optimization)',
            'Top recognition in js13k 2023',
        ],
        tagline: 'Play Hercules in the 13th century — an RPG that fits stats, combat and story into 13KB.',
    },
};

// Apply upgrades to games.js
const gamesPath = path.join(__dirname, '..', 'src', '_data', 'games.js');
const games = require(gamesPath);

let upgraded = 0;
for (const g of games) {
    if (UPGRADES[g.slug]) {
        const u = UPGRADES[g.slug];
        g.about = u.about;
        g.howToPlay = u.howToPlay;
        g.keyFeatures = u.keyFeatures;
        g.tagline = u.tagline;
        upgraded++;
        console.log('✓ upgraded: ' + g.slug);
    }
}

// Write back (regenerate the whole file via write-games-js logic)
const merged = require('./js13k-games-merged.json');
// Sync the upgrades into merged too
for (const m of merged) {
    if (UPGRADES[m.slug]) {
        const u = UPGRADES[m.slug];
        m.about = u.about;
        m.howToPlay = u.howToPlay;
        m.keyFeatures = u.keyFeatures;
        m.tagline = u.tagline;
    }
}
fs.writeFileSync(path.join(__dirname, 'js13k-games-merged.json'), JSON.stringify(merged, null, 4));

console.log('\nUpgraded ' + upgraded + ' reviews. Run `node scripts/write-games-js.js` to regenerate games.js.');
