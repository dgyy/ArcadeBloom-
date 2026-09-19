# Two additional hosted challenge games

Accepted 2026-09-19 at the owner's request to create two substantial shareable games and integrate the whole project.

Pulse Lock and Echo Vault extend ADR-0013's explicit hosting allowlist. Their source lives under `games/pulse-lock/` and `games/echo-vault/`, with shared runtime under `games/_shared/`. These named directories are active source, an exception to the legacy `games/` retirement rule. Existing Circle Club production files retain their location.

Eleventy copies an explicit runtime allowlist into `/play/`; no iframe, dependency download or new backend is introduced. Catalogue entries, screenshot cards, homepage discovery, sitemap, robots and source metadata use the existing directory pipeline. All other entries keep outbound play behavior.

The new games use seeded UTC daily and random practice courses, escalating rounds, round breakdowns, keyboard/touch inputs and replay. Sharing carries the course seed and an unverified score. Completed scores are stored locally with a clear-records control; sound is opt-in. No leaderboard, percentile, competitive integrity or viral-growth claim is made.

Difficulty calibration updated 2026-09-19 after playtesting: Pulse Lock now runs twenty locks, narrows its capture window to 14 degrees, accelerates each round, shifts late targets and times out after nine seconds. Echo Vault now runs twelve chambers, grows sequences from three to nine tiles, accelerates playback, and introduces reverse and mirrored-column recall. These changes make a complete run a sustained challenge while keeping three lives and an optional replay as recovery tools.

New game pages visibly disclose AI-assisted creation, which supports their catalogue AI metadata. No AI runs in their gameplay. No public reuse licence is asserted. Users can read instructions and scoring rules without JavaScript; gameplay requires it.
