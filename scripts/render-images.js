#!/usr/bin/env node
// =============================================================================
// render-images.js — render the OG image and favicon PNGs from their SVG
// sources using Playwright's chromium. No external image library needed.
//
// Produces:
//   src/static/og-image.png   (1200×630, for social share meta)
//   src/static/favicon.ico    (32×32 PNG-renamed — browsers accept PNG as .ico)
//   src/static/apple-touch-icon.png (180×180)
//
// Run after editing the SVG sources. Re-runnable.
// =============================================================================
'use strict';

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const STATIC = path.join(__dirname, '..', 'src', 'static');
const ogSvg = fs.readFileSync(path.join(STATIC, 'og-image.svg'), 'utf8');
const favSvg = fs.readFileSync(path.join(STATIC, 'favicon.svg'), 'utf8');

async function renderPng(page, svg, width, height, outPath) {
    await page.setViewportSize({ width, height });
    await page.setContent(`
        <!DOCTYPE html><html><head><style>
            html,body{margin:0;padding:0;background:transparent;overflow:hidden}
            svg{display:block;width:${width}px;height:${height}px}
        </style></head><body>${svg}</body></html>`,
        { waitUntil: 'networkidle' }
    );
    await page.screenshot({ path: outPath, omitBackground: false });
    console.log(`  wrote ${path.relative(path.join(STATIC, '..'), outPath)} (${width}×${height})`);
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ deviceScaleFactor: 1 });

    console.log('Rendering images from SVG sources...');
    // OG image — 1200×630 (social share standard)
    await renderPng(page, ogSvg, 1200, 630, path.join(STATIC, 'og-image.png'));
    // Favicon — render as PNG first (Playwright only knows png/jpeg), then rename to .ico.
    // Browsers accept PNG-content .ico files for the favicon link.
    await renderPng(page, favSvg, 32, 32, path.join(STATIC, 'favicon-tmp.png'));
    fs.renameSync(path.join(STATIC, 'favicon-tmp.png'), path.join(STATIC, 'favicon.ico'));
    console.log('  wrote static/favicon.ico (32×32, PNG-content)');
    // Apple touch icon — 180×180
    await renderPng(page, favSvg, 180, 180, path.join(STATIC, 'apple-touch-icon.png'));

    await browser.close();
    console.log('Done.');
})();
