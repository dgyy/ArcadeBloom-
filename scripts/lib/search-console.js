// =============================================================================
// search-console.js — read-only Google Search Console API client.
//
// Backs issue #16. Pulls impressions/clicks/CTR/pages/queries for the
// arcadebloom.com domain property into the weekly report (#6). Uses a Google
// Cloud service account; the private key lives ONLY in the GSC_CREDENTIALS
// repository secret (JSON), never in git or build output.
//
// When credentials are absent (local dev, unconfigured CI), every function
// returns null gracefully — the weekly snapshot keeps its shape with the GSC
// slot marked not-yet-wired.
//
// Cohort rule (issue #16 AC): the 2026-07-22 sitemap submission is the
// new-site start. Legacy GSC-excluded URLs (/game-detail, /games/, retired
// static) are a DIFFERENT cohort and are never merged with new-page metrics.
// =============================================================================
'use strict';

const crypto = require('crypto');

const SITE_URL = 'https://arcadebloom.com';
const NEW_SITE_START = '2026-07-22';
// Legacy URL shapes that are a separate cohort — filtered OUT of any
// new-page metric so they cannot pollute the trend.
const LEGACY_URL_PATTERNS = [
    /^\/game-detail/i,
    /^\/games\//i,
    /^\/all-games/i
];

function loadCredentials() {
    const raw = process.env.GSC_CREDENTIALS;
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

// Build a signed Google OAuth2 JWT for the service account (no external dep).
function buildJWT(creds) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: creds.client_email,
        scope: 'https://www.googleapis.com/auth/webmasters.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
    };
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const input = b64(header) + '.' + b64(payload);
    const key = crypto.createPrivateKey({
        key: creds.private_key,
        format: 'pem'
    });
    const sig = crypto.sign('RSA-SHA256', Buffer.from(input), key);
    return input + '.' + sig.toString('base64url');
}

async function getAccessToken(creds) {
    const jwt = buildJWT(creds);
    const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });
    if (!resp.ok) throw new Error('GSC token exchange failed: ' + resp.status);
    const data = await resp.json();
    return data.access_token;
}

// Pull the last N days of search analytics, filtered to the NEW-page cohort
// (legacy URL shapes excluded so they never merge into the trend).
async function fetchSearchAnalytics(token, days = 7) {
    const end = new Date();
    const start = new Date(end.getTime() - days * 86400000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    const resp = await fetch(
        'https://www.googleapis.com/webmasters/v3/sites/' +
        encodeURIComponent(SITE_URL) + '/searchAnalytics/query',
        {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                startDate: fmt(start), endDate: fmt(end),
                dimensions: ['page'],
                rowLimit: 1000
            })
        }
    );
    if (!resp.ok) throw new Error('GSC query failed: ' + resp.status);
    const data = await resp.json();
    // Split into new-page vs legacy cohorts — never merged.
    const rows = (data.rows || []).map((r) => ({
        page: r.keys[0], impressions: r.impressions, clicks: r.clicks,
        ctr: r.ctr, position: r.position,
        cohort: LEGACY_URL_PATTERNS.some((p) => p.test(r.keys[0])) ? 'legacy' : 'new'
    }));
    const newPages = rows.filter((r) => r.cohort === 'new');
    const legacyPages = rows.filter((r) => r.cohort === 'legacy');
    return {
        window: { start: fmt(start), end: fmt(end), days },
        newSiteStart: NEW_SITE_START,
        cohortNote: 'Legacy /game-detail, /games/, retired pages are a separate cohort and excluded from new-page totals.',
        newPages: {
            impressions: newPages.reduce((a, r) => a + r.impressions, 0),
            clicks: newPages.reduce((a, r) => a + r.clicks, 0),
            topPages: newPages.sort((a, b) => b.impressions - a.impressions).slice(0, 10)
        },
        legacyExcluded: {
            urlCount: legacyPages.length,
            note: 'Excluded from new-page metrics — see baseline-2026-07-22.json'
        }
    };
}

// Top-level entry: returns the GSC block for the weekly snapshot, or a
// not-wired marker when credentials are absent. Never throws to the caller.
async function collectGSC(days = 7) {
    const creds = loadCredentials();
    if (!creds) {
        return {
            wired: false,
            wiredByIssue: 16,
            note: 'GSC_CREDENTIALS secret not set — slot present, not populated.',
            newSiteStart: NEW_SITE_START
        };
    }
    try {
        const token = await getAccessToken(creds);
        const analytics = await fetchSearchAnalytics(token, days);
        return { wired: true, wiredByIssue: 16, ...analytics };
    } catch (e) {
        return {
            wired: false, wiredByIssue: 16,
            note: 'GSC pull failed: ' + e.message,
            newSiteStart: NEW_SITE_START
        };
    }
}

module.exports = { collectGSC, NEW_SITE_START, LEGACY_URL_PATTERNS };
