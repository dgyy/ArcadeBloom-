# Evidence schema

## Status

**Implemented and validator-enforced (issues #9, #23, and #24).**

This document fixes the shape of an immutable evidence record and its image
artifacts so the review registry (`evidence/review-registry.json`) can point at
a complete, integrity-checked observation bundle.

## Record location

One immutable JSON record per reviewed game, committed under:

```
evidence/games/<slug>/<review-id>.json
```

`<review-id>` is a stable identifier for the review attempt (e.g. an ISO date
or a short hash). Re-reviewing the same game produces a new file alongside
the old one; records are append-only and never overwritten.

## Record shape

```json
{
  "schemaVersion": 1,
  "slug": "example-game",
  "sourceKey": "github:owner/repo",
  "reviewedAt": "2026-07-22T00:00:00Z",
  "reviewId": "2026-07-22-001",
  "source": {
    "playUrl": "https://example.com/game",
    "repositoryUrl": "https://github.com/owner/repo",
    "licence": "MIT"
  },
  "browser": {
    "loaded": true,
    "finalUrl": "https://example.com/game",
    "consoleErrorCount": 0,
    "interactionAttempts": [],
    "screenshots": [
      {
        "viewport": "desktop",
        "width": 1280,
        "height": 720,
        "capturedAt": "2026-07-22T00:00:00Z",
        "path": "2026-07-22-001/desktop.png",
        "mediaType": "image/png",
        "bytes": 12345,
        "sha256": "sha256:..."
      }
    ],
    "viewportResults": []
  },
  "assessment": {
    "provider": "github-models",
    "model": "replaceable-model-id",
    "confidence": 0.0,
    "decision": "pass",
    "reasons": []
  },
  "integrity": {
    "evidenceHash": "sha256:...",
    "workflowRun": "..."
  }
}
```

## Arbitration rule (ADR-0004)

The **validator**, not the model, decides whether mandatory evidence fields
and thresholds are satisfied. A model can recommend `decision: "pass"`; it
cannot override a missing screenshot, failed source check, broken play page,
licence conflict, or policy flag. The validator's pass is what promotes a
sourceKey from `provisional` to `eligible` in the review registry.

## Mandatory browser fields (validator-enforced in #9)

- `browser.loaded` must be `true`
- `browser.finalUrl` must resolve on the source domain (not a parked/error page)
- `browser.screenshots` must contain at least one desktop and one mobile capture
- Every screenshot is a real file under
  `evidence/games/<slug>/<review-id>/`; `path` is relative to the record's
  directory and must begin with `<review-id>/`
- `bytes` and `sha256` bind the record to the captured file; a missing,
  substituted, malformed, or moved artifact fails validation
- `browser.consoleErrorCount` above a threshold fails (threshold set in #9)
- `browser.viewportResults` must show the game rendered at both breakpoints

## Integrity (tamper-evidence)

`integrity.evidenceHash` is a sha256 over the canonical JSON of the record
(excluding the hash field itself). `integrity.workflowRun` references the
GitHub Actions run that produced the evidence, so the capture is reproducible
from the run logs.

## CI artifact transport

Capture generates `evidence/artifact-contract.json` to fix the artifact root.
Capture and assess upload that marker together with `games/<slug>/`, so every download restores
directly into `evidence/` and retains the same paths used locally. Assess and
publish validate this layout before consuming it; they do not flatten, rename,
or manually relocate screenshots.

## Relationship to the review registry

When a record passes validation, the publication job (#12) sets:

```json
// evidence/review-registry.json → states["<sourceKey>"]
{
  "state": "eligible",
  "eligibleSince": "2026-07-23",
  "evidenceRef": "evidence/games/example-game/2026-07-22-001.json"
}
```

A sourceKey without an `eligible` entry backed by a present, valid, current
evidence record fails closed: `noindex,follow`, excluded from the sitemap.
The frozen manifest is historical audit data only and grants no eligibility
(ADR-0010).
