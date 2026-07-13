// =============================================================================
// paginatedLists.js — pre-computed, deterministic pagination arrays.
// =============================================================================
// Eleventy's single-template pagination cannot do "paginate per category AND
// within the category", so we flatten the work here: produce one entry per
// (list, page) and let each list template iterate the relevant array with
// `pagination.data`.
//
// Three lists are paginated at site.gamesPerPage (24):
//   categoryPages  — one entry per category × page
//   tagPages       — one entry per populated tag (>= minGamesPerTag) × page
//   newPages       — all games by addedDate desc × page
//
// Sort order mirrors .eleventy.js `sortByScreenshotThenDate` so the first page
// of every list matches what the (previously un-paginated) templates showed.
//
// Determinism: games.js is an ordered array and V8 sort is stable, so the same
// input always yields byte-identical output (extend.md §5.2 idempotency).
//
// Page-1 href is the clean list URL (/category/puzzle/); page N>1 is
// /category/puzzle/N/. The first page stays index,follow; deeper pages are
// noindex,follow (set in each template's frontmatter) to keep low-value
// pagination pages out of the index without breaking crawlability.
// =============================================================================

'use strict';

const games = require('./games.js');
const site = require('./site.js');
const tags = require('./tags.js');

const PER_PAGE = site.gamesPerPage;   // 24
const MIN_TAG = site.minGamesPerTag;  // 8

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

// Mirrors .eleventy.js sortByScreenshotThenDate — screenshots first, then date desc.
function sortByScreenshotThenDate(items) {
    return [...items].sort((a, b) => {
        const aShot = Array.isArray(a.screenshots) && a.screenshots.length ? 1 : 0;
        const bShot = Array.isArray(b.screenshots) && b.screenshots.length ? 1 : 0;
        if (aShot !== bShot) return bShot - aShot;
        return String(b.addedDate || '').localeCompare(String(a.addedDate || ''));
    });
}

function sortByDateDesc(items) {
    return [...items].sort((a, b) => String(b.addedDate || '').localeCompare(String(a.addedDate || '')));
}

// Build page descriptors from an already-sorted item list.
function buildPages(baseHref, sortedItems) {
    let chunks = chunk(sortedItems, PER_PAGE);
    if (chunks.length === 0) chunks = [[]]; // empty list still emits one (empty-state) page
    const totalGames = sortedItems.length;
    const totalPages = chunks.length;
    return chunks.map((pageGames, i) => {
        const page = i + 1; // 1-based for display/URLs
        const isFirst = i === 0;
        const isLast = i === totalPages - 1;
        return {
            page,
            pageNumber: i, // 0-based
            totalPages,
            totalGames,
            games: pageGames,
            isFirst,
            isLast,
            href: isFirst ? `${baseHref}/` : `${baseHref}/${page}/`,
            prevHref: isFirst ? null : (page === 2 ? `${baseHref}/` : `${baseHref}/${page - 1}/`),
            nextHref: isLast ? null : `${baseHref}/${page + 1}/`,
        };
    });
}

// ---- Category pages ----
const categoryPages = [];
for (const cat of site.categories) {
    const catGames = games.filter((g) => g.category === cat.slug);
    buildPages(`/category/${cat.slug}`, sortByScreenshotThenDate(catGames)).forEach((p) =>
        categoryPages.push({ ...p, category: cat.slug })
    );
}

// ---- Tag pages (only tags carried by >= minGamesPerTag games) ----
const tagPages = [];
for (const tag of tags) {
    const tagGames = games.filter((g) => Array.isArray(g.tags) && g.tags.includes(tag.slug));
    if (tagGames.length < MIN_TAG) continue;
    buildPages(`/tag/${tag.slug}`, sortByScreenshotThenDate(tagGames)).forEach((p) =>
        tagPages.push({ ...p, tag: tag.slug })
    );
}

// ---- New pages (all games, date desc) ----
const newPages = buildPages('/new', sortByDateDesc(games));

module.exports = { categoryPages, tagPages, newPages };
