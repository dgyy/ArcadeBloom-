// Helper to build fixture records with correct integrity hashes.
// Run: node tests/fixtures/make-good.js  (regenerates the good fixture hash)
// The broken/metadata-only fixtures are deliberately invalid and their hash
// field reflects their (broken) content — the validator must reject them.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function computeHash(record) {
    const clone = JSON.parse(JSON.stringify(record));
    if (clone.integrity) clone.integrity.evidenceHash = '';
    const canonical = JSON.stringify(canonicalize(clone));
    return 'sha256:' + crypto.createHash('sha256').update(canonical).digest('hex');
}

const good = {
    schemaVersion: 1,
    slug: '2048',
    sourceKey: 'url:play2048.co/',
    reviewedAt: '2026-07-23T00:00:00Z',
    reviewId: '2026-07-23-fixture-good',
    source: {
        playUrl: 'https://play2048.co/',
        repositoryUrl: 'https://github.com/gabrielecirulli/2048',
        licence: 'MIT'
    },
    browser: {
        loaded: true,
        finalUrl: 'https://play2048.co/',
        consoleErrorCount: 0,
        interactionAttempts: [
            { type: 'keydown', key: 'ArrowUp', succeeded: true },
            { type: 'keydown', key: 'ArrowLeft', succeeded: true }
        ],
        screenshots: [
            { viewport: 'desktop', width: 1280, height: 720, capturedAt: '2026-07-23T00:00:00Z' },
            { viewport: 'mobile', width: 375, height: 667, capturedAt: '2026-07-23T00:00:00Z' }
        ],
        viewportResults: [
            { viewport: 'desktop', rendered: true },
            { viewport: 'mobile', rendered: true }
        ]
    },
    assessment: {
        provider: 'github-models',
        model: 'gpt-4o-mini-fixture',
        confidence: 0.9,
        decision: 'pass',
        reasons: ['game loads', 'controls responsive', 'licence verified']
    },
    integrity: {
        evidenceHash: '',
        workflowRun: 'fixture-test-run-1'
    }
};
good.integrity.evidenceHash = computeHash(good);

fs.writeFileSync(
    path.resolve(__dirname, 'evidence/good/2026-07-23-fixture-good.json'),
    JSON.stringify(good, null, 2) + '\n'
);
console.log('✓ wrote good fixture');
module.exports = { computeHash };
