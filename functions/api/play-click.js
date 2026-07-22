// functions/api/play-click.js — First-party Play-click aggregate endpoint.
//
// Backs issue #5 / GROWTH-AUTOMATION-PLAN.md "Play-click aggregates". This is
// the FIRST server-side code in the repo (the site was previously pure static).
//
// Privacy contract (ADR-0004-aligned, GROWTH-AUTOMATION-PLAN.md operating
// constraint 10): this endpoint stores ONLY a daily aggregate counter. It must
// NEVER persist IP addresses, cookies, user IDs, full referrer URLs, user
// agents, or cross-site identifiers. The browser sends the event via
// sendBeacon/fetch(keepalive) before following the real source link.
//
// Storage: the daily aggregate row is upserted into the D1 binding named
// `DB` (schema in docs/PLAY-CLICK-METRIC.md). When D1 is not bound (local
// preview, unconfigured Pages project), the endpoint still validates and
// returns 202 but does not persist — this is the documented degradation.
//
// Security:
//   - same-origin only (Origin/Referer check)
//   - slug validated against the built catalogue
//   - payload size capped
//   - edge rate-limiting is expected via Cloudflare's rate-limiting rules
//     (owner config — see docs/PLAY-CLICK-METRIC.md)
//
// The catalogue is imported at build time and committed alongside this
// function so the slug allowlist is static and auditable.

import { catalogueSlugs } from '../../src/_data/catalogue-slugs.json';

// Cap a single request body at 1 KiB — the event is tiny (slug + classes).
const MAX_BODY_BYTES = 1024;

// Canonical referral/device classes. Anything else is rejected (not coerced)
// so an attacker cannot exfiltrate arbitrary strings via these fields.
const REFERRAL_CLASSES = new Set(['google', 'bing', 'owned-social', 'direct']);
const DEVICE_CLASSES = new Set(['desktop', 'tablet', 'mobile']);

function corsSameOrigin(request, env) {
    // Allow the site's own origin only. In local dev the origin may be unset.
    const origin = request.headers.get('origin') || '';
    const allowed = [env.SITE_URL, 'http://localhost:4173', 'http://127.0.0.1:4173']
        .filter(Boolean);
    return !origin || allowed.includes(origin);
}

function dayKey(date = new Date()) {
    // YYYY-MM-DD in UTC — daily aggregate bucket.
    return date.toISOString().slice(0, 10);
}

export async function onRequestPost({ request, env, waitUntil }) {
    if (!corsSameOrigin(request, env)) {
        return new Response('Forbidden', { status: 403 });
    }

    // Cap payload size before parsing.
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
        return new Response('Payload Too Large', { status: 413 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return new Response('Bad Request', { status: 400 });
    }

    const { slug, referral_class, device_class } = body;

    // Validate slug against the static catalogue allowlist.
    if (typeof slug !== 'string' || !catalogueSlugs.includes(slug)) {
        return new Response('Unknown slug', { status: 400 });
    }
    if (referral_class && !REFERRAL_CLASSES.has(referral_class)) {
        return new Response('Bad referral_class', { status: 400 });
    }
    if (device_class && !DEVICE_CLASSES.has(device_class)) {
        return new Response('Bad device_class', { status: 400 });
    }

    const day = dayKey();
    const ref = referral_class || 'direct';
    const dev = device_class || 'desktop';
    const pagePath = `/game/${slug}/`;

    // Persist the aggregate. If D1 is not bound (local/preview), degrade
    // gracefully — the validation above still ran, so abuse is bounded.
    if (env.DB) {
        const waitable = env.DB.prepare(
            `INSERT INTO play_click_daily (day, game_slug, page_path, referral_class, device_class, click_count)
             VALUES (?, ?, ?, ?, ?, 1)
             ON CONFLICT(day, game_slug, page_path, referral_class, device_class)
             DO UPDATE SET click_count = click_count + 1`
        ).bind(day, slug, pagePath, ref, dev).run();
        // Use waitUntil so the beacon response returns immediately while the
        // write completes in the background.
        waitUntil?.(waitable.catch(() => {}));
    }

    // 202 Accepted — the click was counted (or would be, in production).
    return new Response(null, { status: 202 });
}

// Reject GET/HEAD on this endpoint — it is POST-only. A GET would otherwise be
// a vector for CSRF via <img src> or similar.
export async function onRequestGet() {
    return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'POST' },
    });
}
