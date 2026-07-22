#!/usr/bin/env node
// =============================================================================
// build-metrics-snapshot.js — emit a weekly metrics snapshot for the 120-day
// growth contract. Run by .github/workflows/growth-report.yml.
//
// The snapshot is written to docs/metrics/snapshots/<YYYY-MM-DD>.json. It is
// NOT committed by this script — the workflow uploads it as a 120-day
// artifact. Repository write stays scoped to the publication job (#12).
//
// Sources this script can read locally (no secrets required):
//   - catalogue size from src/_data/games.js
//   - the day-zero baseline (docs/metrics/baseline-2026-07-22.json)
//
// Sources that fill in later (left as null slots with explicit "not yet
// wired" notes so the report always has the full shape):
//   - Google Search Console API (issue #16) — needs GSC service account secret
//   - Play-click D1 aggregates (issue #5) — needs D1 read access from CI
//   - Evidence queue throughput (issues #10/#11/#12) — filled when live
//   - Bluesky post status (issue #19) — filled when live
//   - AdSense revenue — recorded only after actual cash receipt
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const games = require('../src/_data/games.js');

const BASELINE_PATH = path.resolve(__dirname, '../docs/metrics/baseline-2026-07-22.json');
const SNAPSHOTS_DIR = path.resolve(__dirname, '../docs/metrics/snapshots');

const NEW_SITE_START = '2026-07-22';

function todayUTC() {
    return new Date().toISOString().slice(0, 10);
}

function daysSince(dateStr) {
    const start = new Date(dateStr + 'T00:00:00Z').getTime();
    const now = Date.now();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

// Read the committed baseline for reference. If it is missing, the report
// still runs but flags the absence.
let baseline = null;
try {
    baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
} catch {
    // proceed without — flagged in output
}

const snapshot = {
    schemaVersion: 1,
    kind: 'weekly-snapshot',
    capturedAt: new Date().toISOString(),
    snapshotDay: todayUTC(),
    newSiteStart: NEW_SITE_START,
    daysIntoCycle: daysSince(NEW_SITE_START),
    cycleLengthDays: 120,
    contractEvaluationWindow: 'final 28 days of the cycle',

    // ---- Catalogue (locally readable) ----
    catalogue: {
        gameCount: games.length,
        source: 'src/_data/games.js'
    },

    // ---- Baseline reference ----
    baselineReference: baseline
        ? {
              asOf: baseline.asOf,
              path: 'docs/metrics/baseline-2026-07-22.json'
          }
        : { path: 'docs/metrics/baseline-2026-07-22.json', present: false },

    // ---- Cohort separation guard (always present) ----
    cohortNote: 'The 1,128 GSC-excluded URLs at baseline were legacy shapes ' +
        '(/game-detail, /games/, retired static pages), NOT current /game/<slug>/ pages. ' +
        'New pages are a fresh cohort starting ' + NEW_SITE_START + '. ' +
        'Never merge the two cohorts in trend calculations.',

    // ---- Slots filled by later slices (null until wired) ----
    googleSearchConsole: {
        wired: false,
        wiredByIssue: 16,
        note: 'Requires GSC service account secret (owner config). Slot present.',
        impressions7d: null,
        clicks7d: null,
        ctr7d: null,
        topPages: null,
        indexTrend: null
    },

    playClickAggregates: {
        wired: false,
        wiredByIssue: 5,
        note: 'Endpoint implemented; D1 read from CI pending owner binding config.',
        totalClicks7d: null,
        topSlugs7d: null
    },

    evidenceQueue: {
        wired: false,
        wiredByIssues: [10, 11, 12],
        note: 'Capture/assess/publish workflows not yet live.',
        throughput7d: null,
        failures7d: null,
        quotaPauses7d: null
    },

    publishedCollections: {
        count: 0,
        note: 'Collections (issue #17) not yet published.'
    },

    bluesky: {
        wired: false,
        wiredByIssue: 19,
        note: 'Account creation and app password are owner config.',
        postsThisWeek: null,
        capPerWeek: 3
    },

    adSenseRevenue: {
        receivedToDate: 0,
        note: 'Recorded only after actual cash receipt (operating constraint 3). No forecast revenue.'
    }
};

fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
const outPath = path.join(SNAPSHOTS_DIR, snapshot.snapshotDay + '.json');
fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');

console.log(`✓ wrote metrics snapshot → ${path.relative(process.cwd(), outPath)}`);
console.log(`  day ${snapshot.daysIntoCycle} of ${snapshot.cycleLengthDays}-day cycle`);
console.log(`  catalogue: ${games.length} games`);
if (!baseline) {
    console.warn('  ⚠ baseline record not found at ' + BASELINE_PATH);
}
