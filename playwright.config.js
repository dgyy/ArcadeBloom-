// =============================================================================
// Playwright config — ArcadeBloom smoke tests.
// Serves the built dist/ on a local static server, then runs smoke checks.
// Run: `npm run test` (build must be fresh — `npm run build && npm run test`).
// =============================================================================
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    // Fail fast on errors — this is a smoke suite, not a regression suite
    retries: 0,
    reporter: [['list']],
    use: {
        baseURL: 'http://localhost:4173',
        // Capture console errors per page for the "no console errors" checks
        // (collected in test helpers, not globally — keeps output readable)
    },
    webServer: {
        command: 'npx http-server dist -p 4173 --silent',
        port: 4173,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        // Graceful shutdown: SIGTERM first, then SIGKILL. Without this the
        // http-server process can exit non-zero when Playwright tears it down,
        // which fails the whole run even when every test passed.
        gracefulShutdown: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});
