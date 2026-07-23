#!/usr/bin/env node
// =============================================================================
// freeze-provisional-manifest.js — emit the frozen 2026-07-22 provisional
// manifest and seed the review registry.
//
// Backs issue #7 / ADR-0006 (grandfather existing indexed games). The
// manifest is the auditable record of which sourceKeys existed at the
// 2026-07-22 cut-over and therefore qualify for the existing-page exception
// (provisional indexability). New sourceKeys absent from BOTH the manifest
// AND an `eligible` evidence record fail closed — noindex (issue #8).
//
// Run ONCE to freeze the manifest. Re-running overwrites the registry with
// fresh provisional states ONLY for entries not already marked eligible or
// ineligible (it preserves reviewer decisions). To regenerate from scratch,
// delete evidence/review-registry.json first.
//
// Outputs:
//   evidence/index-manifest.json   — frozen sourceKey set + metadata
//   evidence/review-registry.json  — per-sourceKey state (provisional initially)
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const games = require('../src/_data/games.js');

const FROZEN_DATE = '2026-07-22';
const EVIDENCE_DIR = path.resolve(__dirname, '../evidence');
const MANIFEST_PATH = path.join(EVIDENCE_DIR, 'index-manifest.json');
const REGISTRY_PATH = path.join(EVIDENCE_DIR, 'review-registry.json');

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

// ---- Build the frozen manifest ----
// Deduplicate by sourceKey (a sourceKey must be unique per validate-data.js,
// but we belt-and-brace here so the manifest is a clean set).
const seen = new Map();
for (const g of games) {
    if (!g.sourceKey) {
        throw new Error(`game id=${g.id} slug=${g.slug} has no sourceKey — cannot freeze`);
    }
    if (seen.has(g.sourceKey)) {
        throw new Error(`duplicate sourceKey "${g.sourceKey}" — fix catalogue before freezing`);
    }
    seen.set(g.sourceKey, { slug: g.slug, id: g.id });
}

const sourceKeys = [...seen.keys()].sort();

// Canonical content hash of the manifest — tamper-evidence so a future edit
// to the manifest is detectable. Hash is over the sorted sourceKey list.
const hashInput = sourceKeys.join('\n') + '\n';
const contentHash = 'sha256:' + crypto.createHash('sha256').update(hashInput).digest('hex');

const manifest = {
    schemaVersion: 1,
    kind: 'provisional-index-manifest',
    frozenAt: FROZEN_DATE,
    authority: 'ADR-0006 (grandfather existing indexed games)',
    note: 'The sourceKeys in this manifest existed in the 2026-07-22 catalogue ' +
        'and qualify for the existing-page exception: they remain provisionally ' +
        'indexable until each is either promoted to `eligible` by an evidence ' +
        'record or marked `ineligible`. New sourceKeys absent from this manifest ' +
        'AND without an eligible evidence record must emit noindex,follow and ' +
        'stay out of the sitemap (issue #8).',
    grandfatherClause: 'ADR-0006: these entries earned index presence before the ' +
        'evidence gate existed; removing them would discard earned SEO. They ' +
        'remain indexable while the evidence pipeline catches up.',
    sourceKeyCount: sourceKeys.length,
    contentHash,
    sourceKeys
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

// ---- Seed/merge the review registry ----
// Preserve existing eligible/ineligible decisions; only add new provisional
// entries. This makes re-running safe after the registry accumulates decisions.
let registry;
if (fs.existsSync(REGISTRY_PATH)) {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
} else {
    registry = {
        schemaVersion: 1,
        kind: 'review-registry',
        manifestPath: 'evidence/index-manifest.json',
        states: {}
    };
}

const VALID_STATES = new Set(['provisional', 'eligible', 'ineligible']);
let added = 0;
let preserved = 0;

for (const key of sourceKeys) {
    const existing = registry.states[key];
    if (existing && VALID_STATES.has(existing.state) && existing.state !== 'provisional') {
        // Preserve reviewer decision.
        preserved++;
    } else {
        registry.states[key] = {
            state: 'provisional',
            provisionalSince: FROZEN_DATE
        };
        added++;
    }
}

// Detect sourceKeys in registry that are no longer in the manifest — flag
// them rather than silently dropping. Reviewer decides their fate.
registry.orphanedSourceKeys = Object.keys(registry.states).filter(
    (k) => !seen.has(k)
);

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');

console.log(`✓ froze manifest: ${sourceKeys.length} sourceKeys → evidence/index-manifest.json`);
console.log(`  contentHash: ${contentHash.slice(0, 24)}…`);
console.log(`✓ registry: ${added} provisional added, ${preserved} decisions preserved`);
if (registry.orphanedSourceKeys.length) {
    console.warn(`  ⚠ ${registry.orphanedSourceKeys.length} orphaned sourceKey(s) in registry (no longer in catalogue)`);
}
