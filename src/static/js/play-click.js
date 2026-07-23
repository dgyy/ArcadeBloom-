// play-click.js — fire-and-forget Play-click beacon.
//
// Backs issue #5. Listens for clicks on any element with [data-play-slug]
// and sends a tiny same-origin POST via sendBeacon (or fetch keepalive as
// fallback) BEFORE the browser follows the real outbound link.
//
// Privacy: the payload contains ONLY { slug, referral_class, device_class }.
// No user ID, no IP-derived value, no full referrer URL, no cross-site id.
// referral_class collapses the referrer into one of four buckets.
//
// This script MUST degrade silently: if sendBeacon is unavailable, if the
// endpoint is unreachable, or if JS is disabled entirely, the outbound link
// still works (the <a href> is unchanged). Measurement is best-effort.

(function () {
    'use strict';

    function referralClass() {
        var r = document.referrer || '';
        if (!r) return 'direct';
        // Collapse to a bucket — never persist the full referrer URL.
        if (/(^|\.)google\./.test(r) || /^https:\/\/www\.google\./.test(r)) return 'google';
        if (/(^|\.)bing\.com/.test(r)) return 'bing';
        // Same-site / owned social = anything from arcadebloom or known owned.
        if (/(^|\.)arcadebloom\.com/.test(r)) return 'direct';
        return 'owned-social';
    }

    function deviceClass() {
        var w = window.innerWidth || 0;
        if (w < 768) return 'mobile';
        if (w < 1024) return 'tablet';
        return 'desktop';
    }

    function send(slug) {
        var payload = JSON.stringify({
            slug: slug,
            referral_class: referralClass(),
            device_class: deviceClass()
        });
        var url = '/api/play-click';
        try {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(url, payload);
                return;
            }
        } catch (e) { /* fall through */ }
        // keepalive fetch fallback (sendBeacon unavailable).
        try {
            fetch(url, { method: 'POST', body: payload, keepalive: true });
        } catch (e) { /* silent — measurement is best-effort */ }
    }

    // Delegate on the whole document so all three CTA placements
    // (hero, mid-page, sticky) are covered with one listener.
    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-play-slug]');
        if (!el) return;
        var slug = el.getAttribute('data-play-slug');
        if (!slug) return;
        send(slug);
        // Do NOT preventDefault — the link must still navigate. sendBeacon
        // and keepalive are designed to survive the navigation unload.
    }, { passive: true });
})();
