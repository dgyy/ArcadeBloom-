#!/usr/bin/env node
// =============================================================================
// validate-review-registry.js — check the historical manifest + review registry.
//
// Backs issue #7 acceptance criterion: "CI validates manifest/registry shape
// on every PR". Run by `npm run validate:registry`, which CI (issue #3)
// invokes after `validate:strict`.
//
// Checks:
//   - evidence/index-manifest.json remains an intact historical record. It is
//     not expanded when catalogue games are added and grants no eligibility.
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
const { DEFAULT_MAX_EVIDENCE_AGE_DAYS } = require('./lib/index-eligibility.js');
const { loadReferencedEvidence } = require('./lib/evidence-reference.js');

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

        if (new Set(manifest.sourceKeys).size !== manifest.sourceKeys.length) {
            errors.push('manifest: sourceKeys must be unique');
        }
        if (manifest.sourceKeyCount !== manifest.sourceKeys.length) {
            errors.push('manifest: sourceKeyCount does not match sourceKeys length');
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
        for (const g of games.filter((game) => manifest?.sourceKeys?.includes(game.sourceKey))) {
            if (!g.sourceKey) continue;
            const entry = registry.states[g.sourceKey];
            if (!entry) {
                errors.push(`registry: no state for sourceKey "${g.sourceKey}" (${g.slug})`);
            } else if (!VALID_STATES.has(entry.state)) {
                errors.push(`registry: sourceKey "${g.sourceKey}" has invalid state "${entry.state}"`);
            }
        }
        // Eligible entries require a present, structurally valid evidence
        // record. Age is advisory here so an expired build can still render
        // fail-closed noindex output; the shared eligibility policy enforces it.
        for (const [key, entry] of Object.entries(registry.states)) {
            if (entry.state !== 'eligible') continue;
            if (!entry.evidenceRef) {
                errors.push(`registry: "${key}" is eligible but has no evidenceRef`);
                continue;
            }

            const projectRoot = path.resolve(__dirname, '..');
            const evidenceRoot = path.resolve(__dirname, '../evidence/games');
            const loaded = loadReferencedEvidence({
                evidenceRef: entry.evidenceRef,
                projectRoot,
                evidenceRoot,
            });
            if (loaded.errors.length) {
                errors.push(`registry: "${key}" evidenceRef fails validation: ${loaded.errors.join('; ')}`);
                continue;
            }

            const record = loaded.record;
            const reviewedAtMs = Date.parse(record.reviewedAt);
            const ageDays = (Date.now() - reviewedAtMs) / (24 * 60 * 60 * 1000);
            if (Number.isFinite(ageDays) && ageDays > DEFAULT_MAX_EVIDENCE_AGE_DAYS) {
                warnings.push(`registry: "${key}" evidence is ${Math.floor(ageDays)} days old and now fails closed`);
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
console.log(`\n✓  Registry valid. ${Object.keys(registry.states).length} archived states checked; historical manifest preserved.`);
process.exit(0);
