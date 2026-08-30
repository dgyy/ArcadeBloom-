'use strict';

const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { validateRecord } = require('../scripts/validate-evidence.js');
const { validateBundleLayout } = require('../scripts/lib/evidence-bundle.js');

const projectRoot = path.resolve(__dirname, '..');
const slugDirectory = path.join(projectRoot, 'evidence', 'games', '2048');

test.describe('Real browser evidence capture (#24)', () => {
    test('desktop and mobile PNGs survive the capture-to-publication contract', () => {
        fs.rmSync(slugDirectory, { recursive: true, force: true });
        try {
            execFileSync(process.execPath, [
                path.join(projectRoot, 'scripts', 'capture-evidence.js'),
                '--slug=2048',
                '--source-url=http://127.0.0.1:4173/about/',
            ], {
                cwd: projectRoot,
                timeout: 60000,
                stdio: 'pipe',
            });

            const recordName = fs.readdirSync(slugDirectory)
                .find((name) => name.endsWith('.json'));
            const recordPath = path.join(slugDirectory, recordName);
            const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));

            expect(record.browser.screenshots.map((shot) => shot.viewport).sort())
                .toEqual(['desktop', 'mobile']);
            for (const shot of record.browser.screenshots) {
                const artifactPath = path.join(slugDirectory, shot.path);
                expect(fs.existsSync(artifactPath)).toBe(true);
                expect(fs.readFileSync(artifactPath).subarray(0, 8))
                    .toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
            }
            expect(validateRecord(recordPath).errors).toEqual([]);
            expect(validateBundleLayout(path.join(projectRoot, 'evidence'), '2048')).toEqual([]);
        } finally {
            fs.rmSync(slugDirectory, { recursive: true, force: true });
        }
    });
});
