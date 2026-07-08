// =============================================================================
// populatedTagSlugs — slugs of tags that have >= minGamesPerTag games.
// Exposed as global data so templates can link only to tag pages that exist
// (avoids dead links to /tag/<slug>/ when a tag is below the thin-content guard).
// Re-computed from the same source as the populatedTags collection in .eleventy.js.
// =============================================================================

const site = require('./site.js');
const tags = require('./tags.js');
const games = require('./games.js');

module.exports = (() => {
    const min = site.minGamesPerTag;
    return tags
        .filter((tag) => games.filter((g) => Array.isArray(g.tags) && g.tags.includes(tag.slug)).length >= min)
        .map((tag) => tag.slug);
})();
