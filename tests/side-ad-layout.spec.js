const { test, expect } = require('@playwright/test');

test('rails follow content edges and use available space below 1600px', async ({ page }) => {
    await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }));
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/about/');
    await expect(page.locator('.game-side-ad')).toHaveCount(2);
    for (const width of [1366, 2560]) {
        await page.setViewportSize({ width, height: 900 });
        await expect.poll(() => page.evaluate(() => {
            const content = document.querySelector('#main').firstElementChild;
            const rect = content.getBoundingClientRect();
            const style = getComputedStyle(content);
            const left = document.querySelector('.game-side-ad--left').getBoundingClientRect();
            const right = document.querySelector('.game-side-ad--right').getBoundingClientRect();
            return [Math.round(rect.left + parseFloat(style.paddingLeft) - left.right),
                Math.round(right.left - rect.right + parseFloat(style.paddingRight))];
        })).toEqual([28, 28]);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.game-side-ad')).toHaveCount(0);
});
