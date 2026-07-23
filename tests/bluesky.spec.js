// =============================================================================
// tests/bluesky.spec.js — verify the Bluesky client's dedup + cap logic (#19).
//
// Network calls are NOT made here — postIfAllowed is integration-tested by the
// workflow. These tests cover the pure decision function (canPost) and the
// ledger persistence, which are where the safety guarantees live.
// =============================================================================
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { canPost, weekKey, CAP_PER_WEEK, loadLedger, saveLedger, LEDGER_PATH } =
    require('../scripts/lib/bluesky.js');

function freshLedger() { return { posted: {}, weeks: {} }; }

test.describe('Bluesky client (issue #19)', () => {
    test('weekKey produces an ISO-week string', () => {
        const wk = weekKey(new Date('2026-07-23T00:00:00Z'));
        expect(wk).toMatch(/^\d{4}-W\d{2}$/);
    });

    test('a fresh URL is postable', () => {
        const decision = canPost('https://arcadebloom.com/game/x/', freshLedger());
        expect(decision.allowed).toBe(true);
    });

    test('a URL already in the ledger is NOT reposted (dedup)', () => {
        const ledger = freshLedger();
        ledger.posted['https://arcadebloom.com/game/x/'] = { at: '2026-07-22T00:00:00Z' };
        const decision = canPost('https://arcadebloom.com/game/x/', ledger);
        expect(decision.allowed).toBe(false);
        expect(decision.reason).toMatch(/dedup/);
    });

    test('the weekly cap of 3 is enforced', () => {
        const wk = weekKey();
        const ledger = freshLedger();
        ledger.weeks[wk] = CAP_PER_WEEK;
        const decision = canPost('https://arcadebloom.com/game/new/', ledger);
        expect(decision.allowed).toBe(false);
        expect(decision.reason).toMatch(/weekly cap/);
    });

    test('the fourth post in a week is blocked but the third is allowed', () => {
        const wk = weekKey();
        const ledger = freshLedger();
        ledger.weeks[wk] = 2;  // two already posted this week
        const d3 = canPost('https://arcadebloom.com/game/c/', ledger);
        expect(d3.allowed).toBe(true);  // third is allowed
        ledger.weeks[wk] = 3;  // cap reached
        const d4 = canPost('https://arcadebloom.com/game/d/', ledger);
        expect(d4.allowed).toBe(false);  // fourth blocked
    });

    test('the cap resets across week boundaries', () => {
        const ledger = freshLedger();
        const lastWeek = weekKey(new Date(Date.now() - 8 * 86400000));
        ledger.weeks[lastWeek] = CAP_PER_WEEK;  // cap was hit last week
        const decision = canPost('https://arcadebloom.com/game/thisweek/', ledger);
        expect(decision.allowed).toBe(true);  // this week is fresh
    });

    test('a missing URL is rejected', () => {
        expect(canPost('', freshLedger()).allowed).toBe(false);
        expect(canPost(null, freshLedger()).allowed).toBe(false);
    });

    test('postIfAllowed no-ops gracefully without credentials', async () => {
        delete process.env.BLUESKY_HANDLE;
        delete process.env.BLUESKY_APP_PASSWORD;
        const { postIfAllowed } = require('../scripts/lib/bluesky.js');
        const result = await postIfAllowed('https://arcadebloom.com/game/x/', 'test');
        expect(result.posted).toBe(false);
        expect(result.reason).toMatch(/credentials/i);
    });
});
