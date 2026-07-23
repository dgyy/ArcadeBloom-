#!/usr/bin/env node
// =============================================================================
// validate-evidence.js — validate immutable evidence records under
// evidence/games/**/*.json. The arbiter of pass/fail, NOT the model.
//
// Backs issue #9 / ADR-0004 (AI-only evidence review). A model can recommend
// decision: "pass"; it CANNOT override a missing screenshot, failed source
// check, broken play page, licence conflict, or policy flag. This validator
// is the gate.
//
// Checks per record (evidence/games/<slug>/<review-id>.json):
//   - schemaVersion, slug, sourceKey, reviewedAt, reviewId present
//   - source: playUrl absolute, repositoryUrl absolute, licence valid
//   - browser: loaded === true, finalUrl on source domain, screenshots
//     contains >=1 desktop + >=1 mobile, consoleErrorCount below threshold,
//     interactionAttempts + viewportResults non-empty
//   - assessment: provider is the expected adapter, model present
//   - integrity: evidenceHash matches recomputed sha256 over canonical
//     content (excluding the hash field), workflowRun present
//   - licence consistency: record licence matches the catalogue entry
//
// Exit non-zero on any error. Warnings are advisory.
//
// Run: `npm run validate:evidence` (wired into CI by issue #9).
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const games = require('../src/_data/games.js');

// --- Licence vocabulary (must match validate-data.js) ---
const VALID_LICENCES = /^(MIT|ISC|Apache-2\.0|GPL-3\.0|GPL-2\.0|AGPL-3\.0|BSD-[23]-Clause|MPL-2\.0|CC0-1\.0|CC-BY(-\d\.\d)?(-\w+)?|Unlicense|NOASSERTION|source-available|proprietary|commercial)$/i;

// --- Thresholds (ADR-0004: the validator decides) ---
const MAX_CONSOLE_ERRORS = 3;          // > this → broken page
const EXPECTED_PROVIDER = 'github-models';

// Catalogue lookup by slug + sourceKey for cross-checking.
const catalogueBySlug = new Map(games.map((g) => [g.slug, g]));
const catalogueByKey = new Map(games.map((g) => [g.sourceKey, g]));

const EVIDENCE_GAMES_DIR = path.resolve(__dirname, '../evidence/games');

function listEvidenceFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) results = results.concat(listEvidenceFiles(full));
        else if (entry.name.endsWith('.json')) results.push(full);
    }
    return results;
}

// Recompute the integrity hash: sha256 over canonical JSON of the record
// with the integrity.evidenceHash field set to empty string. Keys are sorted
// recursively so the hash is stable regardless of key insertion order.
function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
        return Object.keys(value).sort().reduce((acc, k) => {
            acc[k] = canonicalize(value[k]);
            return acc;
        }, {});
    }
    return value;
}

function computeEvidenceHash(record) {
    const clone = JSON.parse(JSON.stringify(record));
    if (clone.integrity) clone.integrity.evidenceHash = '';
    const canonical = JSON.stringify(canonicalize(clone));
    return 'sha256:' + crypto.createHash('sha256').update(canonical).digest('hex');
}

function hostname(urlStr) {
    try { return new URL(urlStr).hostname.toLowerCase().replace(/^www\./, ''); }
    catch { return ''; }
}

function validateRecord(filePath) {
    const rel = path.relative(process.cwd(), filePath);
    const errors = [];
    const warnings = [];
    let record;
    try {
        record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return { file: rel, errors: [`invalid JSON — ${e.message}`], warnings };
    }

    // --- Top-level fields ---
    if (record.schemaVersion !== 1) errors.push('schemaVersion must be 1');
    if (!record.slug) errors.push('missing slug');
    if (!record.sourceKey) errors.push('missing sourceKey');
    if (!record.reviewedAt) errors.push('missing reviewedAt');
    if (!record.reviewId) errors.push('missing reviewId');

    // --- Source block ---
    const src = record.source || {};
    if (!src.playUrl || !/^https?:\/\//.test(src.playUrl)) {
        errors.push('source.playUrl must be an absolute http(s) URL');
    }
    if (!src.repositoryUrl || !/^https?:\/\//.test(src.repositoryUrl)) {
        errors.push('source.repositoryUrl must be an absolute http(s) URL');
    }
    if (!src.licence || !VALID_LICENCES.test(String(src.licence))) {
        errors.push(`source.licence "${src.licence}" does not match known SPDX/CC/proprietary pattern`);
    }

    // --- Browser block (the heart of evidence — ADR-0004) ---
    const br = record.browser || {};
    if (br.loaded !== true) {
        errors.push('browser.loaded must be true (page did not load — broken play page)');
    }
    if (src.playUrl && br.finalUrl) {
        const srcHost = hostname(src.playUrl);
        const finalHost = hostname(br.finalUrl);
        if (srcHost && finalHost && srcHost !== finalHost) {
            errors.push(`browser.finalUrl host "${finalHost}" does not match source host "${srcHost}" (redirected off-site or parked)`);
        }
    }
    if (!Array.isArray(br.screenshots) || br.screenshots.length === 0) {
        errors.push('browser.screenshots must contain at least one capture');
    } else {
        const hasDesktop = br.screenshots.some((s) => s.viewport === 'desktop');
        const hasMobile = br.screenshots.some((s) => s.viewport === 'mobile');
        if (!hasDesktop) errors.push('browser.screenshots missing a desktop capture');
        if (!hasMobile) errors.push('browser.screenshots missing a mobile capture');
    }
    if (typeof br.consoleErrorCount !== 'number' || br.consoleErrorCount > MAX_CONSOLE_ERRORS) {
        errors.push(`browser.consoleErrorCount ${br.consoleErrorCount} exceeds threshold ${MAX_CONSOLE_ERRORS} (broken page)`);
    }
    if (!Array.isArray(br.interactionAttempts) || br.interactionAttempts.length === 0) {
        errors.push('browser.interactionAttempts must be non-empty (no interaction evidence)');
    }
    if (!Array.isArray(br.viewportResults) || br.viewportResults.length === 0) {
        errors.push('browser.viewportResults must be non-empty');
    }

    // --- Assessment block ---
    const as = record.assessment || {};
    if (!as.provider) {
        errors.push('assessment.provider missing');
    } else if (as.provider !== EXPECTED_PROVIDER) {
        errors.push(`assessment.provider "${as.provider}" must be "${EXPECTED_PROVIDER}"`);
    }
    if (!as.model) errors.push('assessment.model missing');
    // The model's decision is recorded but NEVER used to override the above.
    if (as.decision === 'pass') {
        warnings.push(`model recommended pass — validator still decides; ${errors.length} hard error(s) so far`);
    }

    // --- Integrity block (tamper-evidence) ---
    const integ = record.integrity || {};
    if (!integ.workflowRun) errors.push('integrity.workflowRun missing (cannot reproduce capture)');
    if (!integ.evidenceHash) {
        errors.push('integrity.evidenceHash missing');
    } else {
        const recomputed = computeEvidenceHash(record);
        if (recomputed !== integ.evidenceHash) {
            errors.push('integrity.evidenceHash mismatch — record was edited after capture');
        }
    }

    // --- Catalogue cross-check (licence + sourceKey consistency) ---
    if (record.slug && catalogueBySlug.has(record.slug)) {
        const g = catalogueBySlug.get(record.slug);
        if (record.sourceKey && g.sourceKey && record.sourceKey !== g.sourceKey) {
            errors.push(`sourceKey "${record.sourceKey}" does not match catalogue sourceKey "${g.sourceKey}" for slug ${record.slug}`);
        }
        if (src.licence && g.licence && src.licence !== g.licence) {
            errors.push(`licence "${src.licence}" does not match catalogue licence "${g.licence}" for slug ${record.slug}`);
        }
    }

    return { file: rel, errors, warnings };
}

// Exported for unit tests so fixtures can be validated without spawning a
// subprocess. The CLI main runs only when invoked directly.
module.exports = { validateRecord, computeEvidenceHash, listEvidenceFiles,
    EVIDENCE_GAMES_DIR, MAX_CONSOLE_ERRORS, EXPECTED_PROVIDER };

// --- CLI main (only when run directly, not required) ---
if (require.main === module) {
    const files = listEvidenceFiles(EVIDENCE_GAMES_DIR);
    if (files.length === 0) {
        console.log('✓  No evidence records to validate (evidence/games/ empty).');
        process.exit(0);
    }

    let totalErrors = 0;
    let totalWarnings = 0;
    for (const f of files) {
        const { file, errors, warnings } = validateRecord(f);
        totalErrors += errors.length;
        totalWarnings += warnings.length;
        if (errors.length) {
            console.error(`\n✗  ${file}: ${errors.length} error(s):`);
            errors.forEach((e) => console.error('   ' + e));
        }
        if (warnings.length) {
            console.warn(`   ⚠  ${file}: ${warnings.length} warning(s)`);
        }
    }

    if (totalErrors) {
        console.error(`\n✗  Evidence validation FAILED. ${totalErrors} error(s) across ${files.length} record(s).`);
        console.error('   The validator (not the model) is the arbiter — see ADR-0004.\n');
        process.exit(1);
    }
    console.log(`\n✓  Evidence valid. ${files.length} record(s) passed. ${totalWarnings} warning(s).`);
    process.exit(0);
}
