// Capture actual gameplay elements for the homepage. Run against a local build:
// node scripts/capture-home-boards.js http://127.0.0.1:4174
const { chromium } = require('@playwright/test');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
        const base = process.argv[2] || 'http://127.0.0.1:4174';
        for (const slug of ['pulse-lock', 'echo-vault', 'circle-club']) {
            await page.goto(base + '/play/' + slug + '/');
            await page.evaluate(() => document.fonts.ready);
            const board = page.locator(slug === 'circle-club' ? '#canvas' : '.arena');
            if (slug === 'circle-club') {
                const box = await board.boundingBox();
                const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
                const radius = Math.min(box.width, box.height) * .3;
                await page.mouse.move(cx + radius, cy);
                await page.mouse.down();
                for (let i = 1; i <= 80; i++) {
                    const angle = i * Math.PI / 40;
                    await page.mouse.move(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
                }
                await page.mouse.up();
            }
            await board.screenshot({ path: path.join(__dirname, '../src/static/media', slug + '-board.png') });
        }
    } finally {
        await browser.close();
    }
})();
