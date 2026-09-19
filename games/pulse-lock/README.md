# Pulse Lock

Source for `/play/pulse-lock/`. Run the repository's `npm run serve`; its Eleventy passthrough rule publishes this page and app plus `games/_shared/` runtime files.

Twenty timing locks share one seeded course. Precision, chain multipliers, accelerating movement, narrowing arcs, shifting targets in the late game, three lives and a 9-second active-time limit create a complete run. Pause and hidden-tab handling freeze timing. Sound is optional. Touch or the keyboard can activate the lock button. Scoring rules are visible on the page.

Use `tests/challenge-games.spec.js` for rules, playthrough, sharing and responsive checks. Update the game page and catalogue together when rules change. Screenshots are captured from actual play. See `games/README.md` for licence and source boundaries.
