'use strict';

const fs = require('fs');
const path = require('path');

const CONTRACT_FILENAME = 'artifact-contract.json';
const CONTRACT = Object.freeze({
    schemaVersion: 1,
    kind: 'arcadebloom-evidence-bundle',
    gamesDirectory: 'games',
});

function validateBundleLayout(bundleRoot, slug) {
    const errors = [];
    let contract;
    try {
        contract = JSON.parse(fs.readFileSync(path.join(bundleRoot, CONTRACT_FILENAME), 'utf8'));
    } catch {
        return [`bundle is missing valid ${CONTRACT_FILENAME}`];
    }
    for (const [key, value] of Object.entries(CONTRACT)) {
        if (contract[key] !== value) errors.push(`bundle contract ${key} must be ${value}`);
    }
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        errors.push('bundle slug must be kebab-case');
        return errors;
    }
    const slugDirectory = path.join(bundleRoot, CONTRACT.gamesDirectory, slug);
    if (!fs.existsSync(slugDirectory) || !fs.statSync(slugDirectory).isDirectory()) {
        errors.push(`bundle is missing games/${slug}/`);
        return errors;
    }
    const records = fs.readdirSync(slugDirectory)
        .filter((name) => name.endsWith('.json'));
    if (records.length === 0) {
        errors.push(`bundle games/${slug}/ must contain an evidence record`);
    }
    return errors;
}

function writeBundleContract(bundleRoot) {
    fs.mkdirSync(bundleRoot, { recursive: true });
    const contractPath = path.join(bundleRoot, CONTRACT_FILENAME);
    fs.writeFileSync(contractPath, JSON.stringify(CONTRACT, null, 2) + '\n');
    return contractPath;
}

module.exports = {
    CONTRACT,
    CONTRACT_FILENAME,
    validateBundleLayout,
    writeBundleContract,
};
