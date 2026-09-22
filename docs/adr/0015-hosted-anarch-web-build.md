# Host the pinned Anarch Web build

Accepted 2026-09-22 at the owner's explicit request to add direct-link and safely hostable games from `newgames.md`.

Anarch is an exact third-party hosting exception to ArcadeBloom's outbound-only default. The creator dedicates the code and original game assets to the public domain under CC0. ArcadeBloom serves the upstream Web build at `/play/anarch/` while the catalogue retains the creator-controlled play URL, creator name and `gitlab:drummyfish/anarch` identity.

The vendored files under `games/anarch/` come from upstream commit `6f90562161200682459e772f1dacb747f23c5f95` and include the upstream `LICENSE`. Updating them requires a new source review, an updated commit in this record and a successful build and smoke test. Eleventy and `hosted-games.js` use an exact allowlist; no other third-party directory is copied implicitly.

Server Survival, IsoCity, Whatajong and OpenLara remain outbound entries. Server Survival currently loads Tailwind and Three.js from third-party CDNs; IsoCity and Whatajong need complete bundled-asset audits; OpenLara's engine licence does not cover commercial Tomb Raider data. These projects are not added to the hosting allowlist by this decision.
