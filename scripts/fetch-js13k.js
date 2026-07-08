#!/usr/bin/env node
// =============================================================================
// fetch-js13k.js — parse js13kGames yearly data files into a JSON catalogue.
//
// The {YEAR}.js files are compact length-prefixed binary blobs:
//   [version:1]
//   repeat: [nameLen:1][name:UTF-8][authorLen:1][author:UTF-8][awardFlag:1]
//   (the very last record omits the trailing awardFlag)
//
// Output: scripts/js13k-raw.json  — array of {year, name, author, slug, award}
// =============================================================================
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const YEARS = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) { reject(new Error(`${res.statusCode} for ${url}`)); return; }
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

// Slugify a js13k game name the same way the site does:
// lowercase, non-alphanumerics -> '-', trim leading/trailing/duplicate '-'.
function slugify(name) {
    return String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Parse one year's binary blob. Handles the "last record omits awardFlag" edge.
function parseYear(buf, year) {
    const entries = [];
    let i = 0;
    const version = buf[i++]; // eslint-disable-line no-unused-vars
    while (i < buf.length) {
        if (i >= buf.length) break;
        const nameLen = buf[i++];
        if (i + nameLen > buf.length) break;
        const name = buf.slice(i, i + nameLen).toString('utf8');
        i += nameLen;

        if (i >= buf.length) { // truncated trailing name with no author
            entries.push({ year, name, author: '', slug: slugify(name), award: 0 });
            break;
        }
        const authorLen = buf[i++];
        if (i + authorLen > buf.length) break;
        const author = buf.slice(i, i + authorLen).toString('utf8');
        i += authorLen;

        // The last record omits the award flag. Detect: if exactly at EOF after
        // reading author, there is no award byte.
        let award = 0;
        if (i < buf.length) {
            award = buf[i++];
        }
        entries.push({ year, name, author, slug: slugify(name), award });
    }
    return entries;
}

async function main() {
    const all = [];
    for (const year of YEARS) {
        try {
            const buf = await fetch(`https://js13kgames.com/${year}.js`);
            const entries = parseYear(buf, year);
            console.log(`${year}: ${entries.length} entries`);
            all.push(...entries);
        } catch (e) {
            console.error(`${year}: FAILED (${e.message})`);
        }
    }
    console.log(`\nTotal: ${all.length} entries`);

    // Deduplicate slugs (a few names slugify to the same thing across years).
    // When a collision occurs, suffix with the year.
    const seen = new Map();
    for (const e of all) {
        let s = e.slug;
        if (seen.has(s)) {
            s = `${e.slug}-${e.year}`;
            e.slug = s;
        }
        seen.set(s, true);
    }
    const collisions = all.filter((e) => e.slug.endsWith(`-${e.year}`) && !/-\d{4}$/.test(e.name.toLowerCase()));
    console.log(`Slug collisions resolved: ${collisions.length}`);

    const out = path.join(__dirname, 'js13k-raw.json');
    fs.writeFileSync(out, JSON.stringify(all, null, 2));
    console.log(`\nWrote ${out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
