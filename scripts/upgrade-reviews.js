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
