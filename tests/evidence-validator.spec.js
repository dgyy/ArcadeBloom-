// =============================================================================
// tests/evidence-validator.spec.js — verify the evidence validator (issue #9).
//
// The validator (scripts/validate-evidence.js) is the arbiter of pass/fail,
// NOT the model (ADR-0004). These tests assert the three fixture cases the
// issue's acceptance criteria require:
//   - known-good record passes
//   - broken-game record fails regardless of model "pass"
//   - metadata-only record cannot pass (no browser capture)
//
// Fixtures live in tests/fixtures/evidence/ so they are NOT picked up by the
// CLI scan of evidence/games/ — they are validated explicitly here.
// =============================================================================
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { validateRecord, computeEvidenceHash } = require('../scripts/validate-evidence.js');

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures/evidence');

function readFixture(sub) {
    const dir = path.join(FIXTURE_DIR, sub);
    const file = fs.readdirSync(dir).find((f) => f.endsWith('.json'));
    return path.join(dir, file);
}

test.describe('Evidence validator (issue #9, ADR-0004)', () => {
    test('known-good fixture passes with zero errors', () => {
        const { errors, warnings } = validateRecord(readFixture('good'));
        expect(errors, errors.join('\n')).toEqual([]);
        // A pass recommendation is fine as long as there are no hard errors.
        expect(warnings.length).toBeGreaterThanOrEqual(0);
    });

    test('broken-game fixture fails regardless of model decision:pass', () => {
        const { errors } = validateRecord(readFixture('broken-load'));
        // Must fail — the model said pass but the page was broken.
        expect(errors.length, 'broken game must fail even when model says pass').toBeGreaterThan(0);
        expect(errors.join(' ')).toContain('loaded must be true');
        expect(errors.join(' ')).toMatch(/consoleErrorCount/);
    });

    test('metadata-only fixture cannot pass (no browser capture)', () => {
        const { errors } = validateRecord(readFixture('metadata-only'));
        expect(errors.length, 'metadata-only approval must be impossible').toBeGreaterThan(0);
        // All the browser-field checks should fire.
        expect(errors.join(' ')).toContain('screenshots');
        expect(errors.join(' ')).toContain('interactionAttempts');
        expect(errors.join(' ')).toContain('loaded must be true');
    });

    test('tampered evidenceHash is detected', () => {
        const file = readFixture('good');
        const record = JSON.parse(fs.readFileSync(file, 'utf8'));
        record.integrity.evidenceHash = 'sha256:tampered';
        const tmp = file.replace('.json', '.tampered.json');
        fs.writeFileSync(tmp, JSON.stringify(record, null, 2) + '\n');
        try {
            const { errors } = validateRecord(tmp);
            expect(errors.join(' ')).toContain('evidenceHash mismatch');
        } finally {
            fs.unlinkSync(tmp);
        }
    });

    test('integrity hash is deterministic over canonical content', () => {
        const file = readFixture('good');
        const record = JSON.parse(fs.readFileSync(file, 'utf8'));
        const h1 = computeEvidenceHash(record);
        const h2 = computeEvidenceHash(record);
        expect(h1).toBe(h2);
        // Changing a non-hash field must change the hash.
        record.assessment.model = 'different-model';
        const h3 = computeEvidenceHash(record);
        expect(h3).not.toBe(h1);
    });

    test('licence/sourceKey mismatch against catalogue is caught', () => {
        const file = readFixture('good');
        const record = JSON.parse(fs.readFileSync(file, 'utf8'));
        record.source.licence = 'GPL-3.0';  // catalogue says MIT for 2048
        record.integrity.evidenceHash = computeEvidenceHash(record);
        const tmp = file.replace('.json', '.licence.json');
        fs.writeFileSync(tmp, JSON.stringify(record, null, 2) + '\n');
        try {
            const { errors } = validateRecord(tmp);
            expect(errors.join(' ')).toContain('does not match catalogue licence');
        } finally {
            fs.unlinkSync(tmp);
        }
    });
});
