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

    // String helpers for sitemap/template logic
    eleventyConfig.addFilter('startsWith', (str, prefix) => String(str || '').startsWith(prefix));
    eleventyConfig.addFilter('endsWith', (str, suffix) => String(str || '').endsWith(suffix));
    eleventyConfig.addFilter('contains', (str, needle) => String(str || '').indexOf(needle) > -1);

    // First character of a string (for placeholder initials on game cards)
    eleventyConfig.addFilter('first', (str) => String(str || '').charAt(0));

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
