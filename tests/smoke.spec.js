// =============================================================================
// ArcadeBloom smoke tests.
// Covers the four critical guarantees from the renovation plan:
//   1. No console errors on key page types (home/category/game/search)
//   2. Game page outbound CTA points to sourceUrl with rel="noopener nofollow"
//   3. Core content visible with JavaScript disabled (SEO crawlability)
//   4. No legacy fake-data artifacts (plays/rating/iframe) in rendered HTML
// =============================================================================

const { test, expect } = require('@playwright/test');

// Sample of game slugs present in the catalogue — used to parametrise checks.
// If the catalogue shrinks below these, update accordingly.
const GAME_SLUGS = ['hextris', 'proxx', '2048'];
const CATEGORY_SLUGS = ['puzzle', 'racing-sports', 'simulation'];

// ---- Helper: collect console errors on a page --------------------------------
// Note: 404 "Failed to load resource" messages are filtered out because the
// catalogue's screenshots and the og-image are populated during the content
// phase, not at build time. A missing image is a content gap, not a code bug.
// Real JavaScript errors (pageerror) are never filtered.
function expectNoConsoleErrors(page) {
    const errors = [];
    page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        if (/Failed to load resource.*404/i.test(text)) return; // image asset gaps
        errors.push(text);
    });
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    return () => expect(errors, `console errors: ${errors.join('\n')}`).toEqual([]);
}

// =============================================================================
// 1. No console errors
// =============================================================================
test.describe('Console health', () => {
    test('home has no console errors', async ({ page }) => {
        const assertClean = expectNoConsoleErrors(page);
        await page.goto('/');
        await expect(page.locator('h1')).toBeVisible();
        assertClean();
    });

    for (const slug of CATEGORY_SLUGS) {
        test(`category /${slug}/ has no console errors`, async ({ page }) => {
            const assertClean = expectNoConsoleErrors(page);
            await page.goto(`/category/${slug}/`);
            await expect(page.locator('h1')).toBeVisible();
            assertClean();
        });
    }

    for (const slug of GAME_SLUGS) {
        test(`game /game/${slug}/ has no console errors`, async ({ page }) => {
            const assertClean = expectNoConsoleErrors(page);
            await page.goto(`/game/${slug}/`);
            await expect(page.locator('h1')).toBeVisible();
            assertClean();
        });
    }

    test('search has no console errors', async ({ page }) => {
        const assertClean = expectNoConsoleErrors(page);
        await page.goto('/search/');
        await expect(page.locator('h1')).toBeVisible();
        assertClean();
    });
});

// =============================================================================
// 2. Game page outbound CTA — the ONLY play action, must be rel="noopener nofollow"
//    and must point to the source's own site, not an internal path.
// =============================================================================
test.describe('Game page outbound CTA', () => {
    for (const slug of GAME_SLUGS) {
        test(`/game/${slug}/ CTA links outbound with correct rel`, async ({ page }) => {
            await page.goto(`/game/${slug}/`);

            // The primary play button lives in the glass-card CTA section.
            const cta = page.locator('a.primary-button:has-text("Play on")').first();
            await expect(cta).toBeVisible();

            const href = await cta.getAttribute('href');
            const rel = await cta.getAttribute('rel');

            // Must be an absolute external URL — never an internal ./games/ path
            expect(href, 'CTA href must be absolute http(s)').toMatch(/^https?:\/\//);
            expect(href, 'CTA must not point internally').not.toMatch(/arcadebloom\.com\//);

            // rel must include both noopener (security) and nofollow (directory convention)
            expect(rel).toContain('noopener');
            expect(rel).toContain('nofollow');
        });
    }
});

// =============================================================================
// 3. Content visible without JavaScript — the directory's SEO crawlability core.
//    Every key page must show its primary content in the raw HTML, because
//    crawlers that do not run JS must still see it.
// =============================================================================
test.describe('No-JS content visibility', () => {
    test('home shows hero + categories without JS', async ({ browser }) => {
        const ctx = await browser.newContext({ javaScriptEnabled: false });
        const page = await ctx.newPage();
        await page.goto('/');

        await expect(page.locator('h1', { hasText: 'Discover the best free browser games' })).toBeVisible();
        await expect(page.locator('h2', { hasText: 'Browse by Category' })).toBeVisible();
        // The "Browse by Category" section must render exactly 6 category cards.
        // Scope to that section to avoid matching the 12 extra /category/ links
        // in the header nav and footer.
        const categorySection = page.locator('section', { has: page.locator('h2:has-text("Browse by Category")') });
        await expect(categorySection.locator('a[href^="/category/"]')).toHaveCount(6);

        await ctx.close();
    });

    test('game page shows About + How to Play without JS', async ({ browser }) => {
        const ctx = await browser.newContext({ javaScriptEnabled: false });
        const page = await ctx.newPage();
        await page.goto('/game/hextris/');

        await expect(page.locator('h1', { hasText: 'Hextris' })).toBeVisible();
        await expect(page.locator('h2', { hasText: 'About Hextris' })).toBeVisible();
        await expect(page.locator('h2', { hasText: 'How to Play' })).toBeVisible();
        await expect(page.locator('h2', { hasText: 'Key Features' })).toBeVisible();
        // Outbound CTA must be present even without JS
        await expect(page.locator('a:has-text("Play on Hextris")')).toBeVisible();

        await ctx.close();
    });

    test('category page shows intro + games without JS', async ({ browser }) => {
        const ctx = await browser.newContext({ javaScriptEnabled: false });
        const page = await ctx.newPage();
        await page.goto('/category/puzzle/');

        await expect(page.locator('h1', { hasText: 'Puzzle Games' })).toBeVisible();
        // Puzzle category has seeded games — at least one game card should render
        const cards = page.locator('a[href^="/game/"]');
        expect(await cards.count()).toBeGreaterThanOrEqual(1);

        await ctx.close();
    });
});

// =============================================================================
// 4. No legacy artifacts — guards against regressions of the ADR-0001 cleanup.
//    The rendered HTML must never contain fabricated play counts, ratings,
//    or the old iframe player.
// =============================================================================
test.describe('No legacy artifacts', () => {
    const PAGES_TO_CHECK = [
        '/',
        '/featured/',
        '/new/',
        '/category/puzzle/',
        '/game/hextris/',
        '/game/proxx/',
    ];

    for (const path of PAGES_TO_CHECK) {
        test(`${path} has no iframe player`, async ({ page }) => {
            await page.goto(path);
            // "iframe" as a word appears in about page copy, but an actual
            // <iframe> element must never exist.
            const iframes = page.locator('iframe');
            await expect(iframes).toHaveCount(0);
        });

        test(`${path} has no fabricated play-count text`, async ({ page }) => {
            await page.goto(path);
            const body = await page.locator('body').textContent();
            // The old formatPlays() emitted "NN.NK plays" / "NM plays" strings.
            // No such text should appear anywhere on the new site.
            expect(body).not.toMatch(/\d+(\.\d+)?[KM]?\s*plays/i);
            expect(body).not.toMatch(/\d+\.\d+\s*(rating|stars?)/i);
        });
    }
});

// =============================================================================
// 5. SEO essentials — canonical, title, meta description present and correct.
// =============================================================================
test.describe('SEO essentials', () => {
    test('home has correct canonical and structured data', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/ArcadeBloom/);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href', 'https://arcadebloom.com/'
        );
        // WebSite + SearchAction JSON-LD
        const jsonld = await page.locator('script[type="application/ld+json"]').allTextContents();
        const combined = jsonld.join('\n');
        expect(combined).toContain('"@type": "WebSite"');
        expect(combined).toContain('SearchAction');
        // SearchAction target must point to the real search URL
        expect(combined).toContain('/search/?q=');
    });

    test('game page has VideoGame + BreadcrumbList structured data', async ({ page }) => {
        await page.goto('/game/hextris/');
        const jsonld = await page.locator('script[type="application/ld+json"]').allTextContents();
        const combined = jsonld.join('\n');
        expect(combined).toContain('"@type": "VideoGame"');
        expect(combined).toContain('"@type": "BreadcrumbList"');
        // Game page must NOT emit aggregateRating (we have no real ratings — ADR-0001)
        expect(combined).not.toContain('aggregateRating');
    });

    test('search page is noindex', async ({ page }) => {
        await page.goto('/search/');
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            'content', /noindex/
        );
    });

    test('sitemap excludes search and lists all games', async ({ page }) => {
        const resp = await page.goto('/sitemap.xml');
        expect(resp.status()).toBe(200);
        const xml = await resp.text();
        // Search must be excluded from the sitemap
        expect(xml).not.toContain('/search/');
        // Every game slug should appear
        for (const slug of GAME_SLUGS) {
            expect(xml).toContain(`/game/${slug}/`);
        }
    });
});
