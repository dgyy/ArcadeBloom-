#!/usr/bin/env node
// One-off: regenerate src/_data/games.js from scripts/js13k-games-merged.json,
// preserving the schema docstring header. Re-run after catalogue updates.
'use strict';
const fs = require('fs');
const path = require('path');
const merged = require('./js13k-games-merged.json');

const HEADER = `// =============================================================================
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

`;

const body = 'module.exports = ' + JSON.stringify(merged, null, 4) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'src', '_data', 'games.js'), HEADER + body);
console.log(`Wrote ${merged.length} entries to src/_data/games.js`);
