#!/usr/bin/env node
// =============================================================================
// freeze-provisional-manifest.js — preserve the historical manifest and
// register catalogue sourceKeys in the review registry.
//
// ADR-0010 superseded provisional indexability. The manifest is now immutable
// audit data only. Re-running this command NEVER edits it and NEVER grants
// search eligibility; new catalogue keys receive a provisional registry state,
// which the trust-index policy treats as noindex.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const games = require('../src/_data/games.js');
const { registerCatalogueKeys } = require('./lib/review-registry.js');

const EVIDENCE_DIR = path.resolve(__dirname, '../evidence');
const MANIFEST_PATH = path.join(EVIDENCE_DIR, 'index-manifest.json');
const REGISTRY_PATH = path.join(EVIDENCE_DIR, 'review-registry.json');
const registeredAt = new Date().toISOString().slice(0, 10);

if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('historical index manifest is missing; refusing to recreate it');
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
if (!Array.isArray(manifest.sourceKeys)) {
    throw new Error('historical index manifest has no sourceKeys array');
}
const sortedManifestKeys = [...manifest.sourceKeys].sort();
const manifestHash = 'sha256:' + crypto.createHash('sha256')
    .update(sortedManifestKeys.join('\n') + '\n').digest('hex');
if (manifestHash !== manifest.contentHash) {
    throw new Error('historical index manifest hash mismatch; refusing to continue');
}

if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error('review registry is missing; refusing to recreate editorial state');
}
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const result = registerCatalogueKeys({ registry, games, registeredAt });

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(result.registry, null, 2) + '\n');

console.log(`✓ historical manifest preserved unchanged: ${manifest.sourceKeys.length} sourceKeys`);
console.log(`✓ registry: ${result.added} provisional added, ${result.preserved} states preserved`);
if (result.registry.orphanedSourceKeys.length) {
    console.warn(`  ⚠ ${result.registry.orphanedSourceKeys.length} orphaned sourceKey(s) in registry`);
}
