// =============================================================================
// bluesky.js — Bluesky posting client with dedup + weekly cap.
//
// Backs issue #19. The ONLY external automatic channel in this cycle
// (operating constraint 8). Posts are deduplicated (no item posts twice) and
// capped at three per week. Released only after a successful production health
// check (issue #14) — a rolled-back deploy never posts.
//
// NEVER triggers automated likes, follows, replies, private messages, or
// cross-posts (ADR-0005). Only publishes the site's own eligible content.
//
// Credentials: BLUESKY_HANDLE + BLUESKY_APP_PASSWORD repository secrets (owner
// config — account created once). Without them, every function is a no-op.
//
// Dedup state: a small JSON ledger at evidence/bluesky-posted.json records
// which URLs have been posted and a week-stamped counter for the cap.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const CAP_PER_WEEK = 3;
const LEDGER_PATH = path.resolve(__dirname, '../../evidence/bluesky-posted.json');
const BSKY_HOST = 'https://bsky.social';
const BSKY_PDS = process.env.BLUESKY_PDS || 'https://bsky.social';

function weekKey(date = new Date()) {
    // ISO week — Monday-starting. Used for the per-week cap counter.
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function loadLedger() {
    try { return JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')); }
    catch { return { posted: {}, weeks: {} }; }
}

function saveLedger(ledger) {
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
}

// Decide whether a URL MAY be posted right now: not already posted AND the
// weekly cap is not exhausted. Pure function — no network.
function canPost(url, ledger, date = new Date()) {
    if (!url) return { allowed: false, reason: 'no url' };
    if (ledger.posted && ledger.posted[url]) {
        return { allowed: false, reason: 'already posted (dedup)' };
    }
    const wk = weekKey(date);
    const count = (ledger.weeks && ledger.weeks[wk]) || 0;
    if (count >= CAP_PER_WEEK) {
        return { allowed: false, reason: `weekly cap reached (${count}/${CAP_PER_WEEK})` };
    }
    return { allowed: true, week: wk, count };
}

async function createSession(handle, password) {
    const resp = await fetch(BSKY_PDS + '/xrpc/com.atproto.server.createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: handle, password })
    });
    if (!resp.ok) throw new Error('Bluesky session failed: ' + resp.status);
    const data = await resp.json();
    return { accessJwt: data.accessJwt, did: data.did };
}

async function postRecord(session, text, url) {
    // Facet the URL so it links cleanly. AT Proto requires a record blob.
    const resp = await fetch(BSKY_PDS + '/xrpc/com.atproto.repo.createRecord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.accessJwt
        },
        body: JSON.stringify({
            repo: session.did,
            collection: 'app.bsky.feed.post',
            record: {
                $type: 'app.bsky.feed.post',
                text,
                createdAt: new Date().toISOString(),
                // Single embedded link card pointing at the site.
                embed: {
                    $type: 'app.bsky.embed.external',
                    external: { uri: url, title: text, description: '' }
                }
            }
        })
    });
    if (!resp.ok) {
        const body = await resp.text();
        throw new Error('Bluesky post failed: ' + resp.status + ' ' + body);
    }
    return resp.json();
}

// Top-level: post about a URL if allowed. Returns { posted, reason }.
// Never throws to the caller on rate/cap/dedup — those are soft declines.
// Throws only on auth/network failure so the caller can surface it.
async function postIfAllowed(url, text) {
    const handle = process.env.BLUESKY_HANDLE;
    const password = process.env.BLUESKY_APP_PASSWORD;
    if (!handle || !password) {
        return { posted: false, reason: 'BLUESKY credentials not set (owner config)' };
    }
    const ledger = loadLedger();
    const decision = canPost(url, ledger);
    if (!decision.allowed) return { posted: false, reason: decision.reason };

    const session = await createSession(handle, password);
    await postRecord(session, text, url);

    // Record success in the ledger (dedup + cap).
    ledger.posted = ledger.posted || {};
    ledger.posted[url] = { at: new Date().toISOString() };
    ledger.weeks = ledger.weeks || {};
    ledger.weeks[decision.week] = decision.count + 1;
    saveLedger(ledger);
    return { posted: true, week: decision.week, count: decision.count + 1 };
}

module.exports = { postIfAllowed, canPost, weekKey, CAP_PER_WEEK, loadLedger, saveLedger, LEDGER_PATH };
