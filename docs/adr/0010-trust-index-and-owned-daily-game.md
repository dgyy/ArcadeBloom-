# Make measured trust the product and one owned daily game the retention surface

## Status
accepted

ArcadeBloom will retain its outbound-only rule for third-party games but stop treating catalogue size or generated editorial prose as the product. Its primary product is a continuously refreshed browser-game trust index built from dated, reproducible compatibility, privacy, performance, source, and licence observations; only evidence-backed games and sufficiently populated measured cohorts may be indexed. ArcadeBloom may host its own original daily game as a separate retention and monetization surface, but will not mass-produce shallow games or host third-party builds. This trades broad index coverage for defensible data, safer search quality, and an unattended revenue loop.

ADR-0006 is superseded: the 2,019-entry manifest remains a historical cohort identifier, not a permanent indexing entitlement. Entries without sufficient current evidence fail closed to `noindex,follow` and leave the sitemap.

## Consequences

- Discovery, testing, evidence retention, eligibility, publication, monitoring, rollback, and growth allocation must run without routine human review.
- Human participation is limited to authorization checkpoints that cannot be delegated.
- Payment never changes evidence, eligibility, or editorial rank; any paid placement is separate and labelled.
- The catalogue is raw inventory. Verified observations and their history are the compounding asset.
