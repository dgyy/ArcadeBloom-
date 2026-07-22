// =============================================================================
// capture-priority.js — compute the capture queue order per the growth plan.
//
// Backs issue #10. Priority (GROWTH-AUTOMATION-PLAN.md growth-capture.yml):
//   1. the 50 most complete existing games (longest About + HowToPlay + has
//      screenshot) — quickest wins to promote to eligible
//   2. all eleven Featured games
//   3. Search Console opportunities (placeholder — fed by issue #16 when live)
//   4. underrepresented categories (fewest games relative to the average)
//
// A game already holding an `eligible` or `ineligible` registry state is
// skipped — only `provisional` entries are captured. New sourceKeys absent
// from the manifest are included too (they need evidence to become eligible).
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const games = require('../../src/_data/games.js');
const site = require('../../src/_data/site.js');

function loadRegistryStates() {
    try {
        const reg = JSON.parse(fs.readFileSync(
            path.resolve(__dirname, '../../evidence/review-registry.json'), 'utf8'));
        return reg.states || {};
    } catch { return {}; }
}

function wordCount(s) {
    return String(s || '').split(/\s+/).filter(Boolean).length;
}

// Completeness score: rewards filled About/HowToPlay and a screenshot, the
// three fields the baseline report checked. Higher = more complete = earlier.
function completeness(g) {
    let score = 0;
    score += Math.min(wordCount(g.about), 200);
    score += Math.min(wordCount(g.howToPlay), 150);
    score += (Array.isArray(g.screenshots) && g.screenshots.length > 0) ? 50 : 0;
    return score;
}

// Category counts → underrepresented = furthest below the per-category mean.
function underrepresentedCategories() {
    const counts = {};
    for (const cat of site.categories) counts[cat.slug] = 0;
    for (const g of games) if (counts[g.category] !== undefined) counts[g.category]++;
    const mean = Object.values(counts).reduce((a, b) => a + b, 0) / site.categories.length;
    // Sort categories by how far below mean they are (most underrepresented first).
    return site.categories
        .map((c) => ({ slug: c.slug, gap: mean - (counts[c.slug] || 0) }))
        .sort((a, b) => b.gap - a.gap)
        .map((c) => c.slug);
}

// Build the ordered queue. `limit` caps the result (free-capacity budget).
function buildCaptureQueue(opts = {}) {
    const limit = opts.limit || 5;  // small autonomous releases per ADR-0008
    const states = loadRegistryStates();
    const underrep = underrepresentedCategories();
    const underrepRank = new Map(underrep.map((slug, i) => [slug, i]));

    // Skip entries already decided.
    const pending = games.filter((g) => {
        const st = states[g.sourceKey];
        return !st || st.state === 'provisional';
    });

    // Tier 1: 50 most complete.
    const byCompleteness = [...pending]
        .sort((a, b) => completeness(b) - completeness(a));
    const tier1 = byCompleteness.slice(0, 50);
    const tier1Slugs = new Set(tier1.map((g) => g.slug));

    // Tier 2: Featured not already in tier 1.
    const featured = pending.filter((g) => g.featured && !tier1Slugs.has(g.slug));
    const tier2Slugs = new Set([...tier1Slugs, ...featured.map((g) => g.slug)]);

    // Tier 3: Search Console opportunities — placeholder slot; when issue #16
    // feeds a GSC opportunities file, it sorts here. For now empty.
    const gscPath = path.resolve(__dirname, '../../evidence/gsc-opportunities.json');
    let tier3 = [];
    if (fs.existsSync(gscPath)) {
        const opps = JSON.parse(fs.readFileSync(gscPath, 'utf8'));
        const oppSlugs = new Set(opps.map((o) => o.slug));
        tier3 = pending.filter((g) => oppSlugs.has(g.slug) && !tier2Slugs.has(g.slug));
    }
    const tier3Slugs = new Set([...tier2Slugs, ...tier3.map((g) => g.slug)]);

    // Tier 4: underrepresented categories, least-represented first.
    const tier4 = pending
        .filter((g) => !tier3Slugs.has(g.slug))
        .sort((a, b) => (underrepRank.get(a.category) ?? 99) - (underrepRank.get(b.category) ?? 99)
                       || completeness(b) - completeness(a));

    const ordered = [...tier1, ...featured, ...tier3, ...tier4];
    return ordered.slice(0, limit).map((g) => ({
        slug: g.slug,
        sourceKey: g.sourceKey,
        sourceUrl: g.sourceUrl,
        name: g.name,
        licence: g.licence,
        tier: tier1Slugs.has(g.slug) ? 1
             : featured.some((f) => f.slug === g.slug) ? 2
             : tier3.some((t) => t.slug === g.slug) ? 3 : 4
    }));
}

module.exports = { buildCaptureQueue, completeness, underrepresentedCategories };
