# Catalogue Candidate Pipeline

Candidate discovery is deliberately separate from publication. Fetch commands
write ignored JSON files under `scripts/candidates/`; they never modify
`src/_data/games.js`.

## Commands

```bash
npm run candidates:js13k
node scripts/fetch-github-games.js --pages=6 --max=2000
node scripts/fetch-gitlab-games.js --pages=2 --max=600
npm run candidates:itch
npm run candidates:build
npm run candidates:validate
npm run candidates:review-batch
npm run candidates:review-evidence
```

GitHub, GitLab, and itch fetchers cache completed URL checks in their adapter
files. Re-running with a larger limit only checks newly discovered candidates.
Use `--partitioned` with the GitHub fetcher to split searches by update date and
work around GitHub's per-query result cap. The fetchers merge new results into
their existing cache instead of shrinking the candidate pool on later runs.
`--min-stars=0` includes low-visibility projects; these remain subject to the
same play-page, licence, and editorial review gates as every other candidate.
The itch adapter reads official HTML5 browse RSS feeds slowly and retries 429
responses; individual feeds may be skipped without discarding other results.

## Candidate states

- `accepted`: automated technical evidence indicates a browser game. This is
  ready for editorial review, not automatic publication.
- `review`: the source is plausible, but gameplay, attribution, licence,
  category, or controls still need a person to verify them.
- `rejected`: dead/non-HTML URL, blocked platform, library/tutorial, duplicate,
  or another clear failure.

Every published candidate must still receive accurate catalogue fields,
including original `about` and `howToPlay`, concrete controls, controlled tags,
licence evidence, and at least one reviewed screenshot.

`candidates:review-batch` writes an ignored `review-batch.json` work queue. It
excludes published and previously decided projects, then ranks accepted,
licence-asserted candidates by category need, play-page evidence, project
visibility, and clone/framework risk. Use `node scripts/prepare-review-batch.js
--size=20 --category=strategy` to request a focused batch.

`candidates:review-evidence` hydrates that batch from primary GitHub sources.
It extracts control/gameplay sections, licence metadata, likely screenshot
paths, repository dates, and editorial risk flags into ignored
`review-evidence.json`. A result marked `editorial-review` is ready for a human
decision, not automatically approved.

## 2026-07-21 snapshot

After thirty-four reviewed candidates were published, the queue contains 7,921
unique candidates: 1,101 accepted, 4,589 for review, and 2,231 rejected. The
5,690 non-rejected candidates plus 2,019 published games provide a theoretical
pool of 7,709. This clears the discovery safety target, but candidates must
still pass manual source, licence, gameplay, content, and screenshot review.

Non-rejected candidates by source:

| Source | Candidates |
|---|---:|
| GitHub | 3,827 |
| GitLab | 90 |
| js13k | 1,323 |
| itch.io | 450 |

The queue is still Arcade-heavy. Review and future discovery should prioritize
Puzzle, Action, Strategy, Simulation, and Racing & Sports.
