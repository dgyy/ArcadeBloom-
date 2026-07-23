#!/usr/bin/env node
// =============================================================================
// build-catalogue-slugs.js — emit the static slug allowlist consumed by the
// Play-click endpoint (functions/api/play-click.js).
//
// The endpoint validates inbound POST slugs against a committed, auditable
// allowlist rather than importing games.js at request time (Pages Functions
// are read-only code; a build-time artifact keeps the allowlist static).
//
// Output: src/_data/catalogue-slugs.json — { catalogueSlugs: string[] }
//
// Run automatically by `npm run build:catalogue-slugs`, which `pretest` and
// the Pages Function build step both invoke.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');

const slugs = games.map((g) => g.slug).filter(Boolean).sort();
const out = { catalogueSlugs: slugs };

const outPath = path.resolve(__dirname, '../src/_data/catalogue-slugs.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 0) + '\n');
console.log(`✓ wrote ${slugs.length} slugs to src/_data/catalogue-slugs.json`);
