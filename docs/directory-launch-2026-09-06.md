# Indie and AI directory: first implementation

Implements the owner-approved direction in ADR-0011. Source changes are local; this
document does not claim a production deployment or that third-party games were played.

## Pages and behavior

- Homepage: indie discovery, picks, latest additions, AI shelf and creator invitation.
- Game details: concise introduction, how to begin, source/licence, AI disclosure where
  present. Removes the duplicated FAQ, review promise and unsupported global free-play
  claim. Both primary and mobile Play actions retain the current game's source.
- `/ai-games/`: separates AI gameplay and AI-assisted creation. A game can appear in
  both. Initially noindex because the directory contains fewer than eight qualified AI entries.
- `/submit/`: browser-local email composition, a copyable draft and explicit send-through-
  mail-app action. Works through direct email instructions without JavaScript. No inbox
  service, database submission or successful delivery is claimed.
- Navigation, About, contact links, RSS and discovery metadata follow the new direction.

## Catalogue changes and sources

Adds two entries to `src/_data/games.js` and the existing importer snapshot; no existing
game descriptions are rewritten. Historical stubs remain noindex and the display
omits their obsolete parenthetical promise of a future review.

| Entry | Official source | Recorded AI use | Licence treatment |
| --- | --- | --- | --- |
| AI Dungeon | [Latitude product page](https://aidungeon.com/) and [official play URL](https://play.aidungeon.com/) | AI gameplay: generated text adventures | Proprietary service, supported by [Latitude's terms](https://help.aidungeon.com/terms-of-service); release date unknown |
| Circuits Royale | [Puzzmo developer account](https://blog.puzzmo.com/posts/2025/09/08/the-making-of-circuits-royale/) and its [linked game](https://royale.circuitsgame.com/) | AI gameplay: phrase judging; AI-assisted creation: prototype, effects and interface work | NOASSERTION, displayed as “Not declared”; no open-source licence inferred |

Sources checked 2026-09-06. Both public game URLs responded when opened. Source
descriptions support the short introductions; they do not establish gameplay quality,
universal availability, mobile compatibility or account-free access. No third-party
screenshots were copied or fabricated for these entries.

## Policy and workflow migration

The shared directory policy replaces the browser-evidence gate for robots, sitemap,
RSS and Collections. Strict schema, duplicate identity/URL checks and content stub
guards remain. AI claims require controlled types and a creator disclosure reference.

The historical manifest, registry and evidence records remain unchanged. CI no longer
requires evidence assessment or registry registration. The historical registry validator
checks archived cohort members. Capture, assessment and evidence publication workflows
have no scheduled/chained triggers; retained scripts are archival tools.

The source of truth is `CONTEXT.md` and ADR-0011. Prior growth plans and the two research
notes dated 2026-09-05 describe previous hypotheses, not the approved implementation.

## Local review artifacts

UI comparison images are in `test-results/ui/2026-09-06-directory/`: `home-before.png`,
`home-after.png`, `game-before.png`, `game-after.png`, `ai-after.png`, `submit-after.png`
and `home-mobile-after.png`. Before images are reconstructed from the original HEAD
templates and data. Full Playwright reports use dated folders under
`test-results/html-report/`; test temporary files have their own `artifacts/` folder.

## Validation results

- `npm run validate`: passed, 2,021 entries. Existing placeholder-content warnings
  remain advisory; those entries are still excluded by the directory-content policy.
- `npm run build`: passed, including strict validation and static rendering.
- Full Playwright suite: **163 passed**. Final invocation used
  `node node_modules/@playwright/test/cli.js test --fully-parallel --workers=4`
  against the fresh build (the same suite invoked by `npm test`).
- Collection validation and historical registry validation: passed.
- Post-deployment health checker against the local preview: all checks passed.
- `git diff --check`: passed. Historical manifest and registry data are unchanged.

Final logs: `test-results/directory-tests-final.log`,
`test-results/directory-build-final.log` and `test-results/directory-validation.log`.
