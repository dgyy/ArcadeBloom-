#!/usr/bin/env node
// =============================================================================
// assess-evidence.js — assess the latest captured evidence record with the
// provider-neutral model adapter.
//
// Backs issue #11. Invoked by .github/workflows/growth-assess.yml. Finds the
// most recent unassessed evidence record for a slug, calls the model adapter
// (scripts/lib/model-adapter.js), writes the assessment back into the record,
// and recomputes the integrity hash. The model's decision is recorded but is
// NOT the gate — the #9 validator is the arbiter (ADR-0004).
//
// Usage:
//   node scripts/assess-evidence.js --slug=<slug>
//
// On rate limit, exits non-zero so the workflow stops and leaves the item
// queued. Never produces a metadata-only approval fallback.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { assess } = require('./lib/model-adapter.js');

const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
        const m = a.match(/^--([^=]+)=(.*)$/);
        return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
    })
);

function die(msg, code = 1) { console.error('✗ ' + msg); process.exit(code); }

const slug = args.slug;
if (!slug) die('required: --slug=<slug>');

const gamesDir = path.resolve(__dirname, '../evidence/games', slug);
if (!fs.existsSync(gamesDir)) {
    die(`no evidence records for slug "${slug}" — run capture first (issue #10)`);
}

// Find the most recent unassessed record (assessment.decision === 'pending').
const records = fs.readdirSync(gamesDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse();
const recordFile = records.find((f) => {
    const r = JSON.parse(fs.readFileSync(path.join(gamesDir, f), 'utf8'));
    return r.assessment && r.assessment.decision === 'pending';
});
if (!recordFile) die(`no unassessed evidence record for "${slug}"`);
const recordPath = path.join(gamesDir, recordFile);
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));

function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
        return Object.keys(value).sort().reduce((acc, k) => {
            acc[k] = canonicalize(value[k]); return acc;
        }, {});
    }
    return value;
}
function computeHash(rec) {
    const clone = JSON.parse(JSON.stringify(rec));
    if (clone.integrity) clone.integrity.evidenceHash = '';
    return 'sha256:' + crypto.createHash('sha256')
        .update(JSON.stringify(canonicalize(clone))).digest('hex');
}

async function main() {
    console.log(`assessing ${recordPath}`);
    let assessment;
    try {
        assessment = await assess(record);
    } catch (e) {
        if (e.rateLimited) {
            console.error('rate limited — leaving item queued, no retry');
            process.exit(2);  // non-zero: workflow stops
        }
        die('assessment error: ' + e.message);
    }

    record.assessment = assessment;
    record.integrity.evidenceHash = computeHash(record);
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n');
    console.log(`✓ assessment written: decision=${assessment.decision} confidence=${assessment.confidence}`);
    console.log(`  reasons: ${(assessment.reasons || []).join('; ')}`);
    if (assessment.decision === 'pass') {
        console.log('  NOTE: model pass is advisory only — the #9 validator is the gate.');
    }
}

main().catch((e) => die('assess failed: ' + e.message, 3));
