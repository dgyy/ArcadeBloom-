#!/usr/bin/env node
// =============================================================================
// merge-leereilly.js — convert leereilly-raw.json into schema entries and
// append to the merged catalogue. Dedupe against existing slugs.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const leereilly = require('./leereilly-raw.json');
const existing = require('../src/_data/games.js');

const existingSlugs = new Set(existing.map((g) => g.slug));
const existingUrls = new Set(existing.map((g) => g.sourceUrl));

// Tags from controlled vocab — assign based on category + leereilly subsection
const tags = require('../src/_data/tags.js');
const tagSlugs = new Set(tags.map((t) => t.slug));

function slugify(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function pickTags(name, category, sub) {
    const t = [];
    // category-based tag
    const catTag = {
        puzzle: 'brain-burner', strategy: 'turn-based', simulation: 'sandbox',
        'racing-sports': 'skill-based', action: 'skill-based', arcade: 'quick-fix',
    }[category];
    if (catTag && tagSlugs.has(catTag)) t.push(catTag);
    // open-source (leereilly games are GitHub-hosted)
    t.push('open-source');
    // mood
    if (/retro|classic|arcade|old/i.test(name + sub)) t.push('retro');
    else t.push('classic');
    return [...new Set(t)].slice(0, 3);
}

let id = existing.length + 1; // continue after existing max id
const newEntries = [];

for (const g of leereilly) {
    let slug = slugify(g.name);
    // dedupe by slug
    if (existingSlugs.has(slug)) slug = `${slug}-game`;
    if (existingSlugs.has(slug)) continue; // still collides, skip
    // dedupe by play URL
    if (existingUrls.has(g.play)) continue;

    const desc = g.desc || `A ${g.category} game.`;
    newEntries.push({
        id: id++,
        slug,
        name: g.name,
        category: g.category,
        tagline: desc.length > 80 ? desc.slice(0, 77) + '...' : desc,
        about: `${g.name} — ${desc}. Originally an open-source browser game catalogued from the Games-on-GitHub collection under the "${g.sub}" category. This is a factual entry; a full review is pending.\n\nPlay it at the author's own site via the link below.`,
        howToPlay: `Controls for ${g.name} vary — open the game via the source link to see in-game instructions. Most browser games in this category use keyboard, mouse, or touch. (Full how-to-play guide pending.)`,
        keyFeatures: [
            `Open-source browser game`,
            `Genre: ${g.sub}`,
            `Source: ${g.repo.includes('github.com') ? 'GitHub' : 'author site'}`,
        ],
        screenshots: [],
        sourceName: g.name,
        sourceUrl: g.play,
        licence: 'source-available',
        tags: pickTags(g.name, g.category, g.sub),
        addedDate: '2026-07-08',
        releaseDate: '',
        featured: false,
    });
    existingSlugs.add(slug);
}

console.log(`Adding ${newEntries.length} leereilly entries (after dedupe).`);

// Final merged = existing + new
const merged = [...existing, ...newEntries];
// Re-number ids monotonically
merged.forEach((g, i) => { g.id = i + 1; });

fs.writeFileSync(path.join(__dirname, 'js13k-games-merged.json'), JSON.stringify(merged, null, 2));
console.log(`Total merged catalogue: ${merged.length} games.`);

// Category distribution after merge
const byCat = {};
merged.forEach((g) => (byCat[g.category] = (byCat[g.category] || 0) + 1));
console.log('\nFinal category distribution:');
Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    const mark = v >= 20 ? '✓' : '✗';
    console.log(`  ${mark} ${k}: ${v}`);
});
