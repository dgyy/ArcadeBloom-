'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { CONTRACT, CONTRACT_FILENAME, validateBundleLayout } =
    require('../scripts/lib/evidence-bundle.js');

const projectRoot = path.resolve(__dirname, '..');

function makeBundle() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'arcadebloom-bundle-'));
    fs.writeFileSync(path.join(root, CONTRACT_FILENAME), JSON.stringify(CONTRACT));
    const slugDir = path.join(root, 'games', '2048');
    fs.mkdirSync(slugDir, { recursive: true });
    fs.writeFileSync(path.join(slugDir, 'review-1.json'), '{}');
    return root;
}

test.describe('Evidence artifact bundle (#24)', () => {
    test('canonical games/<slug> layout is accepted unchanged', () => {
        const root = makeBundle();
        try {
            expect(validateBundleLayout(root, '2048')).toEqual([]);
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });

    test('flattened artifact download layout is rejected', () => {
        const root = makeBundle();
        try {
            fs.renameSync(path.join(root, 'games', '2048', 'review-1.json'),
                path.join(root, 'review-1.json'));
            fs.rmSync(path.join(root, 'games'), { recursive: true, force: true });
            expect(validateBundleLayout(root, '2048').join(' ')).toContain('games/2048/');
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });

    test('missing contract marker is rejected', () => {
        const root = makeBundle();
        try {
            fs.unlinkSync(path.join(root, CONTRACT_FILENAME));
            expect(validateBundleLayout(root, '2048').join(' ')).toContain(CONTRACT_FILENAME);
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });

    test('capture, assess, and publish workflows preserve the same artifact root', () => {
        const capture = fs.readFileSync(
            path.join(projectRoot, '.github/workflows/growth-capture.yml'), 'utf8');
        const assess = fs.readFileSync(
            path.join(projectRoot, '.github/workflows/growth-assess.yml'), 'utf8');
        const publish = fs.readFileSync(
            path.join(projectRoot, '.github/workflows/growth-publish.yml'), 'utf8');

        for (const workflow of [capture, assess]) {
            expect(workflow).toContain('evidence/artifact-contract.json');
            expect(workflow).toContain('evidence/games/${{ steps.');
        }
        for (const workflow of [assess, publish]) {
            expect(workflow).toContain('-D evidence');
            expect(workflow).toContain('validate-evidence-bundle.js --root=evidence');
            expect(workflow).not.toContain('evidence-download');
            expect(workflow).not.toContain('cp -r');
        }
    });
});
