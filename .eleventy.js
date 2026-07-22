// =============================================================================
// Eleventy configuration — ArcadeBloom directory site
// =============================================================================
// Key decisions (see docs/adr/):
//  - Directory-style, extensionless URLs (ADR-0003): /game/<slug>/ etc.
//    Each URL is backed by a generated index.html at that path.
//  - Nunjucks templates (.njk) for all pages.
//  - src/ holds source; output goes to dist/.
// =============================================================================

module.exports = function (eleventyConfig) {
    // ---- Template engines -------------------------------------------------
    eleventyConfig.setTemplateFormats(['njk', 'md']);
    // Nunjucks is registered by default for .njk; nothing extra needed.

    // ---- Conditional ignore: collection template --------------------------
    // When no Collections are published yet, skip collection.njk so Eleventy
    // does not render an empty-pagination page. Re-enabled automatically once
    // src/_data/collections.js has >=1 entry (issue #17).
    const collectionsData = require('./src/_data/collections.js');
    if (!Array.isArray(collectionsData) || collectionsData.length === 0) {
        eleventyConfig.ignores.add('src/collection.njk');
    }

    // ---- Passthrough: static assets served as-is --------------------------
    // Favicon, og images, screenshots, robots.txt etc. live under src/static/
    // and are copied 1:1 to dist/.
    eleventyConfig.addPassthroughCopy({ 'src/static': './' });

    // ---- Filters ----------------------------------------------------------

    // Group a list of games by category slug -> { category, games }[]
    eleventyConfig.addFilter('groupByCategory', (games) => {
        const map = new Map();
        for (const g of games) {
            if (!map.has(g.category)) map.set(g.category, []);
            map.get(g.category).push(g);
        }
        return [...map.entries()].map(([category, list]) => ({ category, games: list }));
    });

    // Filter games by a field equality (e.g. category === 'puzzle')
    eleventyConfig.addFilter('whereEq', (items, field, value) =>
        (items || []).filter((i) => i[field] === value)
    );

    // Filter games by array membership (e.g. tags includes 'quick-fix')
    eleventyConfig.addFilter('whereIncludes', (items, field, value) =>
        (items || []).filter((i) => Array.isArray(i[field]) && i[field].includes(value))
    );

    // Sort by date desc (newest first)
    eleventyConfig.addFilter('sortByDateDesc', (items) =>
        [...(items || [])].sort((a, b) => String(b.addedDate).localeCompare(String(a.addedDate)))
    );

    // Featured-only
    eleventyConfig.addFilter('featuredOnly', (items) => (items || []).filter((g) => g.featured));

    // Take first N
    eleventyConfig.addFilter('limit', (items, n) => (items || []).slice(0, n));

    // Slice from index `start` for `length` items (default to end).
    // Used for asymmetric layouts (e.g. first game as a hero feature, the
    // rest as satellites) without precomputing arrays in data.
    eleventyConfig.addFilter('slice', (items, start, length) => {
        const arr = items || [];
        return typeof length === 'number'
            ? arr.slice(start, start + length)
            : arr.slice(start);
    });

    // Format an ISO date as e.g. "July 8, 2026"
    eleventyConfig.addFilter('dateReadable', (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    });

    // Look up a tag object by slug from the tags data
    eleventyConfig.addFilter('findTag', (tags, slug) =>
        (tags || []).find((t) => t.slug === slug)
    );

    // Look up a category object by slug from site.categories
    eleventyConfig.addFilter('findCat', (categories, slug) =>
        (categories || []).find((c) => c.slug === slug) || { slug, name: slug }
    );

    // Reject items where a field equals a value (inverse of whereEq)
    eleventyConfig.addFilter('reject', (items, field, value) =>
        (items || []).filter((i) => i[field] !== value)
    );

    // Split a string into paragraphs (on blank lines) — for multi-para about/howToPlay
    eleventyConfig.addFilter('paragraphs', (text) => {
        if (!text) return [];
        return String(text).split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    });

    // JSON-stringify a value for safe embedding in JSON-LD (replaces | dump | safe)
    eleventyConfig.addFilter('toJSON', (value) => JSON.stringify(value));

    // Project the games list down to the search index — only the fields the
    // client-side filter matches against (slug/name/tagline/category/tags).
    // Keeps /search/ small and keeps about/howToPlay/licence/sourceUrl out of
    // the inline HTML (extend.md §5.4.2).
    eleventyConfig.addFilter('toSearchIndex', (games) =>
        JSON.stringify((games || []).map((g) => ({
            slug: g.slug,
            name: g.name,
            tagline: g.tagline,
            category: g.category,
            tags: g.tags,
        })))
    );

    // String helpers for sitemap/template logic
    eleventyConfig.addFilter('startsWith', (str, prefix) => String(str || '').startsWith(prefix));
    eleventyConfig.addFilter('endsWith', (str, suffix) => String(str || '').endsWith(suffix));
    eleventyConfig.addFilter('contains', (str, needle) => String(str || '').indexOf(needle) > -1);

    // First character of a string (for placeholder initials on game cards)
    eleventyConfig.addFilter('first', (str) => String(str || '').charAt(0));

    // Lowercase (for inline text in templates)
    eleventyConfig.addFilter('lower', (str) => String(str || '').toLowerCase());

    // Locale-formatted integer with thousands separators (e.g. 2019 -> "2,019").
    // Used for the catalogue count in the hero/footer.
    eleventyConfig.addFilter('number', (n) =>
        Number(n || 0).toLocaleString('en-US')
    );

    // Sort: games WITH screenshots first, then by date desc.
    // Keeps the top of every list visually populated even when many
    // catalogue entries have no screenshot yet.
    eleventyConfig.addFilter('sortByScreenshotThenDate', (items) =>
        [...(items || [])].sort((a, b) => {
            const aShot = Array.isArray(a.screenshots) && a.screenshots.length ? 1 : 0;
            const bShot = Array.isArray(b.screenshots) && b.screenshots.length ? 1 : 0;
            if (aShot !== bShot) return bShot - aShot; // screenshots first
            return String(b.addedDate || '').localeCompare(String(a.addedDate || ''));
        })
    );

    // Absolute URL from a root-relative path (for canonical/og:url/sitemap)
    const SITE_URL = 'https://arcadebloom.com';
    eleventyConfig.addFilter('absoluteUrl', (path) => {
        if (!path) return SITE_URL + '/';
        if (/^https?:\/\//.test(path)) return path;
        return SITE_URL + (path.startsWith('/') ? path : '/' + path);
    });

    // ---- Global data ------------------------------------------------------
    // Build timestamp injected into every template as `asset_version`.
    // Used as a cache-busting query string on /css/styles.css so that a new
    // deploy invalidates the browser/CDN cache immediately (Cloudflare Pages
    // serves the CSS at a stable URL with max-age=14400, so without this
    // visitors can see a stale stylesheet for up to 4 hours after a deploy).
    eleventyConfig.addGlobalData('asset_version', () => Date.now().toString());

    // ---- Index eligibility (ADR-0006 + evidence gate, issue #8) ----------
    // Load the frozen manifest + review registry ONCE per build. A game is
    // indexable iff its sourceKey is in the frozen 2026-07-22 manifest
    // (grandfathered) OR its registry state is `eligible`. Everything else
    // (new unreviewed sourceKey, or `ineligible`) fails closed: noindex and
    // excluded from the sitemap. See docs/evidence-schema.md.
    const fs = require('fs');
    const path = require('path');
    let manifestSourceKeys = new Set();
    let registryStates = {};
    try {
        const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'evidence/index-manifest.json'), 'utf8'));
        manifestSourceKeys = new Set(manifest.sourceKeys || []);
    } catch { /* validate:registry reports the real error; build proceeds */ }
    try {
        const registry = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'evidence/review-registry.json'), 'utf8'));
        registryStates = registry.states || {};
    } catch { /* ditto */ }

    eleventyConfig.addFilter('isIndexable', (sourceKey) => {
        if (!sourceKey) return false;
        if (manifestSourceKeys.has(sourceKey)) return true;        // grandfathered
        const st = registryStates[sourceKey];
        return !!(st && st.state === 'eligible');                  // evidence gate
    });

    // isEligible: strictly passed the evidence gate (used by RSS #18 and
    // Collections #17 — these never include provisional/grandfathered entries,
    // only fully reviewed ones).
    eleventyConfig.addFilter('isEligible', (sourceKey) => {
        if (!sourceKey) return false;
        const st = registryStates[sourceKey];
        return !!(st && st.state === 'eligible');
    });

    // ---- Collections ------------------------------------------------------
    // gamesByCategory / gamesByTag are computed at build time for navigation
    // and for thin-content guards (category pages need >=20, tag pages >=8).

    // populatedTags: only tags carried by >= minGamesPerTag games.
    // Tag pages are only generated for these — the thin-content guard.
    eleventyConfig.addCollection('populatedTags', (collectionApi) => {
        const site = require('./src/_data/site.js');
        const tags = require('./src/_data/tags.js');
        const games = require('./src/_data/games.js');
        const min = site.minGamesPerTag;
        return tags.filter((tag) => {
            const count = games.filter((g) => Array.isArray(g.tags) && g.tags.includes(tag.slug)).length;
            return count >= min;
        }).map((tag) => ({ ...tag, count: games.filter((g) => g.tags.includes(tag.slug)).length }));
    });

    // ---- Project config ---------------------------------------------------
    return {
        dir: {
            input: 'src',
            includes: '_includes',
            data: '_data',
            output: 'dist',
        },
        // Nunjucks for HTML-ish templates
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        // We control URLs explicitly via permalink in each template, so no
        // default suffixing.
    };
};
