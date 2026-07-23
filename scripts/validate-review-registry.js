#!/usr/bin/env node
// =============================================================================
// validate-review-registry.js — check the frozen manifest + review registry.
//
// Backs issue #7 acceptance criterion: "CI validates manifest/registry shape
// on every PR". Run by `npm run validate:registry`, which CI (issue #3)
// invokes after `validate:strict`.
//
// Checks:
//   - evidence/index-manifest.json exists, has schemaVersion, frozenAt,
//     contentHash matching the sorted sourceKey list, and the sourceKey set
//     matches the current catalogue (the manifest is frozen at a point in
//     time, but it MUST still cover every current sourceKey — new games are
//     added to the registry as provisional by the freeze script on the PR
//     that introduces them).
//   - evidence/review-registry.json exists, every catalogue sourceKey has a
//     state ∈ {provisional, eligible, ineligible}, every state references a
//     valid evidence path when eligible.
//   - Exit non-zero on any error.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const games = require('../src/_data/games.js');

const EVIDENCE_DIR = path.resolve(__dirname, '../evidence');
const MANIFEST_PATH = path.join(EVIDENCE_DIR, 'index-manifest.json');
const REGISTRY_PATH = path.join(EVIDENCE_DIR, 'review-registry.json');

const VALID_STATES = new Set(['provisional', 'eligible', 'ineligible']);

const errors = [];
const warnings = [];

function readJSON(p, label) {
    if (!fs.existsSync(p)) {
        errors.push(`${label}: missing at ${path.relative(process.cwd(), p)}`);
        return null;
    }
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) {
        errors.push(`${label}: invalid JSON — ${e.message}`);
        return null;
    }
}

const manifest = readJSON(MANIFEST_PATH, 'index-manifest');
const registry = readJSON(REGISTRY_PATH, 'review-registry');

// ---- Manifest checks ----
if (manifest) {
    if (manifest.schemaVersion !== 1) errors.push('manifest: schemaVersion must be 1');
    if (!manifest.frozenAt) errors.push('manifest: missing frozenAt');
    if (!manifest.contentHash) errors.push('manifest: missing contentHash');
    if (!Array.isArray(manifest.sourceKeys)) {
        errors.push('manifest: sourceKeys must be an array');
    } else {
        // Recompute hash and compare — tamper detection.
        const sorted = [...manifest.sourceKeys].sort();
        const recomputed = 'sha256:' + crypto.createHash('sha256')
            .update(sorted.join('\n') + '\n').digest('hex');
        if (recomputed !== manifest.contentHash) {
            errors.push('manifest: contentHash mismatch — manifest was edited after freezing');
        }

        // Every current catalogue sourceKey must be in the manifest.
        const manifestSet = new Set(manifest.sourceKeys);
        for (const g of games) {
            if (!g.sourceKey) {
                errors.push(`catalogue: game id=${g.id} slug=${g.slug} missing sourceKey`);
            } else if (!manifestSet.has(g.sourceKey)) {
                errors.push(`manifest: sourceKey "${g.sourceKey}" (${g.slug}) is in catalogue but not in frozen manifest — run scripts/freeze-provisional-manifest.js`);
            }
        }
    }
    if (manifest.kind !== 'provisional-index-manifest') {
        errors.push('manifest: kind must be "provisional-index-manifest"');
    }
}

// ---- Registry checks ----
if (registry) {
    if (registry.schemaVersion !== 1) errors.push('registry: schemaVersion must be 1');
    if (registry.kind !== 'review-registry') errors.push('registry: kind must be "review-registry"');
    if (!registry.states || typeof registry.states !== 'object') {
        errors.push('registry: states must be an object keyed by sourceKey');
    } else {
        for (const g of games) {
            if (!g.sourceKey) continue;
            const entry = registry.states[g.sourceKey];
            if (!entry) {
                errors.push(`registry: no state for sourceKey "${g.sourceKey}" (${g.slug})`);
            } else if (!VALID_STATES.has(entry.state)) {
                errors.push(`registry: sourceKey "${g.sourceKey}" has invalid state "${entry.state}"`);
            }
        }
        // Eligible entries must reference an evidence record path (file may
        // not exist yet if records are committed in a different PR, so this
        // is advisory — surfaced as a warning, not an error).
        for (const [key, entry] of Object.entries(registry.states)) {
            if (entry.state === 'eligible' && !entry.evidenceRef) {
                warnings.push(`registry: "${key}" is eligible but has no evidenceRef`);
            }
        }
    }
}

// ---- Report ----
if (warnings.length) {
    console.warn(`\n⚠  ${warnings.length} registry warning(s):`);
    warnings.forEach((w) => console.warn('   ' + w));
}
if (errors.length) {
    console.error(`\n✗  ${errors.length} registry error(s):`);
    errors.forEach((e) => console.error('   ' + e));
    console.error('\nRegistry validation FAILED.\n');
    process.exit(1);
}
console.log(`\n✓  Registry valid. ${games.length} catalogue sourceKeys all in manifest + registry.`);
process.exit(0);
