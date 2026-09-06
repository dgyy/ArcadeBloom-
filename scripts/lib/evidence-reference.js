'use strict';

const fs = require('fs');
const path = require('path');
const { validateRecord } = require('../validate-evidence.js');

function loadReferencedEvidence({
    evidenceRef,
    projectRoot,
    evidenceRoot = path.resolve(projectRoot, 'evidence/games'),
    validateEvidence = validateRecord,
}) {
    const errors = [];
    if (typeof evidenceRef !== 'string' || evidenceRef.trim() === '') {
        return { record: null, evidencePath: null, errors: ['evidenceRef is missing'] };
    }
    if (path.isAbsolute(evidenceRef)) {
        return { record: null, evidencePath: null, errors: ['evidenceRef must be repository-relative'] };
    }

    const evidencePath = path.resolve(projectRoot, evidenceRef);
    const root = path.resolve(evidenceRoot);
    const relative = path.relative(root, evidencePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return { record: null, evidencePath, errors: ['evidenceRef must stay under the configured evidence root'] };
    }
    if (!fs.existsSync(evidencePath)) {
        return { record: null, evidencePath, errors: ['evidenceRef does not exist'] };
    }

    let record;
    try {
        record = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
    } catch (error) {
        return { record: null, evidencePath, errors: [`evidenceRef is invalid JSON: ${error.message}`] };
    }

    const pathParts = relative.split(path.sep);
    const expectedFilename = record && typeof record.reviewId === 'string'
        ? `${record.reviewId}.json`
        : null;
    if (pathParts.length !== 2 ||
        !record ||
        pathParts[0] !== record.slug ||
        pathParts[1] !== expectedFilename) {
        errors.push('evidenceRef must match evidence/games/<slug>/<review-id>.json');
    }

    const validation = validateEvidence(evidencePath);
    if (!validation || !Array.isArray(validation.errors)) {
        errors.push('evidence validator returned an invalid result');
    } else {
        errors.push(...validation.errors);
    }

    return { record, evidencePath, errors };
}

module.exports = { loadReferencedEvidence };
