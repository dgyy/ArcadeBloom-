'use strict';

// ARCHIVED (ADR-0011): retained for historical evidence tooling only.
// Active site publication uses directory-policy.js.

const path = require('path');
const { validateRecord } = require('../validate-evidence.js');
const { loadReferencedEvidence } = require('./evidence-reference.js');

const DEFAULT_MAX_EVIDENCE_AGE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

function createIndexEligibilityPolicy({
    registry,
    projectRoot = path.resolve(__dirname, '../..'),
    evidenceRoot = path.resolve(projectRoot, 'evidence/games'),
    now = new Date(),
    maxEvidenceAgeDays = DEFAULT_MAX_EVIDENCE_AGE_DAYS,
    validateEvidence = validateRecord,
} = {}) {
    const states = registry && registry.states && typeof registry.states === 'object'
        ? registry.states
        : {};
    const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();
    const maxAgeMs = maxEvidenceAgeDays * DAY_MS;
    const decisions = new Map();

    return function isIndexable(sourceKey) {
        if (!sourceKey || !Number.isFinite(nowMs)) return false;
        if (decisions.has(sourceKey)) return decisions.get(sourceKey);

        const entry = states[sourceKey];
        let eligible = !!entry && entry.state === 'eligible';
        let record;
        if (eligible) {
            const loaded = loadReferencedEvidence({
                evidenceRef: entry.evidenceRef,
                projectRoot,
                evidenceRoot,
                validateEvidence,
            });
            record = loaded.record;
            eligible = loaded.errors.length === 0;
        }

        if (eligible) {
            const reviewedAtMs = Date.parse(record.reviewedAt);
            const ageMs = nowMs - reviewedAtMs;
            eligible = record.sourceKey === sourceKey &&
                Number.isFinite(reviewedAtMs) &&
                ageMs >= 0 &&
                ageMs <= maxAgeMs;
        }

        decisions.set(sourceKey, eligible);
        return eligible;
    };
}

module.exports = {
    createIndexEligibilityPolicy,
    DEFAULT_MAX_EVIDENCE_AGE_DAYS,
};
