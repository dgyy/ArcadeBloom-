# ArcadeBloom playable games

- `病毒式传播网站/`: original Circle Club copy. Its deployment source remains `src/static/play/circle-club/`.
- `pulse-lock/`: twenty-round precision timing game, increasing speed, narrowing windows, late shifting targets, chain bonuses and three lives.
- `echo-vault/`: twelve-chamber memory game, three-to-nine tile sequences, reverse and mirror recall, replay penalties and three lives.
- `_shared/`: deterministic course generation, sharing, local records, optional audio and responsive visual styles for the two new games.

From the repository root run `npm run serve`, then open `/play/pulse-lock/` or `/play/echo-vault/`. For a production preview use `npm run build` and `npx http-server dist -p 4173`. Eleventy copies only the named runtime files; no second production copy needs editing. The original Circle Club folder is not a build source.

After building, `npm run test:games` runs seeded-course, full-playthrough, pause/resume, failure, sharing, score-card, storage and responsive checks for the new games. `npm test` runs the complete site suite.

Both games support touch and keyboards, optional synthesized sound, daily UTC courses, fresh practice courses, seeded friend links, downloadable PNG score cards and local records. No account, external service or paid API is required. Shared scores are not server verified. Sharing mechanisms do not guarantee popularity.

New games were created for ArcadeBloom using AI-assisted code generation. Their runtime is deterministic JavaScript, with no model calls. No public reuse licence is granted by these game files; catalogue records use NOASSERTION. See CONTENT-LICENSE.md and ADR-0014.
