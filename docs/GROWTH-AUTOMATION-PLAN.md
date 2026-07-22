# ArcadeBloom Growth Automation Plan

## Status and authority

Accepted design, 2026-07-22. This document turns the decisions in `CONTEXT.md`
and ADR-0004 through ADR-0009 into an implementation sequence. If this plan
conflicts with the historical `GROWTH-PLAYBOOK.md`, this plan wins.

The system remains an outbound-link game directory. Growth is successful only
when an English-language indie browser-game explorer arrives from organic
search and has a credible opportunity to click through to the verified source.

## Verified starting point

- The live catalogue contains 2,019 games. Google successfully read the current
  sitemap on 2026-07-22 and discovered 2,047 URLs.
- Search Console showed 38 impressions and zero clicks in the preceding three
  months. Its 1,128 principal excluded URLs were legacy `/game-detail...`,
  `/games/...`, and retired static pages, not the current `/game/<slug>/` pages.
- Legacy URLs currently return 404 and should be allowed to age out. Do not
  restore them, redirect them all to the homepage, or repeatedly resubmit the
  sitemap.
- Of the current catalogue, 1,754 games still contain explicit placeholder
  prose. Fifty games meet the provisional length checks for both About and How
  to Play; 42 of those also have a screenshot. Only three of eleven Featured
  games meet all three checks.
- Cloudflare edge analytics are dominated by requests and possible bots. They
  are not a human-traffic baseline.
- There is no current first-party Play-click measurement or visitor analytics
  script in the repository.
- `hello@arcadebloom.com` is displayed publicly but the domain currently has no
  inbound-mail MX configuration.

## 120-day contract

In the final 28 days of the first 120-day validation cycle, reach all of:

| Metric | Target | Authority |
|---|---:|---|
| Google Search impressions | 10,000 | Search Console |
| Qualified organic visits from Google | 300 | Search Console clicks |
| Outbound Play clicks | 30 | First-party aggregate measurement |
| Search visit to Play conversion | at least 10% | Derived from the two sources above |
| Fully evidence-reviewed game pages | 100 | Committed evidence registry |
| Evidence-led Collections | 8 | Published collection registry |

Edge requests, asset requests, bots, and Cloudflare's generic Unique Visitors
card do not count toward the contract.

## Operating constraints

1. **Zero new spend.** Use only public-repository GitHub Actions, rate-limited
   GitHub Models, and Cloudflare free allowances. Paid overage stays disabled.
   Exhausted capacity pauses the queue.
2. **Cloud-only.** No task depends on the owner's computer being online.
3. **Self-funded growth.** Only cash actually received from advertising may be
   reinvested, capped at 50% of receipts. No forecast revenue, borrowing,
   prepayment, or automatic plan upgrade.
4. **Evidence before claims.** AI must load and attempt to interact with a game.
   README text or metadata alone cannot substantiate a review.
5. **Existing-page exception.** The 2,019 entries live on 2026-07-22 remain
   provisionally indexable. New games cannot be indexed before passing review.
6. **Small autonomous releases.** A bot release contains at most five games or
   one Collection and reaches production only through a checked pull request.
7. **No unsolicited email.** Automated correspondence is limited to creators
   who contacted, submitted to, subscribed to, or explicitly authorized
   ArcadeBloom.
8. **Low-frequency owned distribution.** Bluesky is the only external automatic
   channel in this cycle, capped at three posts per week. RSS is the owned feed.
9. **Advertising remains enabled.** Ads are clearly labelled and non-intrusive.
   A game detail page has at most one ad after Source & Licence and before
   related games.
10. **Ad consent is separate from Play measurement.** The first-party Play
    metric remains anonymous, but the privacy notice and consent flow must
    accurately disclose AdSense. Where Google requires it, ads load through a
    Google-certified consent management platform rather than inheriting the
    Play metric's no-tracking claim.

## Target architecture

```text
GitHub schedule
    |
    v
candidate priority queue ---- Search Console aggregates
    |
    v
isolated Playwright capture (no write token, no production secrets)
    |
    v
bounded evidence bundle ---- source/licence checks
    |
    v
GitHub Models assessment (provider adapter, paid usage disabled)
    |
    +---- insufficient/failed ---> hold or provisional failure
    |
    v
generated review/Collection branch
    |
    v
PR gates: evidence + schema + build + browser + policy
    |
    v
auto-merge to main ---> Cloudflare Pages ---> live health check
                                               |
                              failure ---------+--> rollback + revert PR
                                               |
                              success ---------+--> RSS + Bluesky queue

Visitor Play click ---> first-party endpoint ---> daily aggregate only
```

### Trust boundaries

- A browser visiting a third-party game runs in an ephemeral runner with
  read-only repository permissions and no deployment, mail, social, or write
  credentials.
- Raw third-party HTML and instructions are untrusted. The model receives a
  bounded, sanitized evidence bundle rather than arbitrary page content.
- The model cannot merge, deploy, send mail, or post socially. Separate jobs
  enforce policy and consume only validated artifacts.
- Repository write credentials are available only to the publication job.
- Social credentials are available only after a successful production health
  check and only to the distribution job.

## Data model additions

### Review evidence

Commit one immutable JSON record per reviewed game under
`evidence/games/<slug>/<review-id>.json`. At minimum:

```json
{
  "schemaVersion": 1,
  "slug": "example-game",
  "sourceKey": "github:owner/repo",
  "reviewedAt": "2026-07-22T00:00:00Z",
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
    "screenshots": [],
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

The validator, not the model, decides whether mandatory evidence fields and
thresholds are satisfied. A model can recommend `pass`; it cannot override a
missing screenshot, failed source check, broken play page, licence conflict, or
policy flag.

### Index status

Add a generated review registry keyed by `sourceKey` with three states:

- `provisional`: only entries in the frozen 2026-07-22 catalogue manifest;
- `eligible`: evidence gate passed;
- `ineligible`: failed or explicitly held from indexing.

Commit the frozen manifest of the existing 2,019 `sourceKey` values. New source
keys absent from both the manifest and an `eligible` evidence record must emit
`noindex,follow` and stay out of the sitemap. This avoids a 2,019-entry rewrite
of `games.js` and makes the exception auditable.

### Collections

Create `src/_data/collections.js` and a generated `/collection/<slug>/` template.
Each published Collection must contain:

- one audience question or editorial thesis;
- 5–12 `eligible` games;
- a distinct comparison for every included game;
- a synthesis that helps the reader choose;
- evidence references for every factual claim;
- a unique canonical URL and social image;
- an independent quality decision and evidence record.

Keyword permutations, near-duplicate lists, and card-only pages fail validation.

### Play-click aggregates

Store only daily aggregate rows, not raw events:

```text
day, game_slug, page_path, referral_class, device_class, click_count
```

Do not persist IP addresses, cookies, user IDs, full referrer URLs, user agents,
or cross-site identifiers. Validate slugs against the catalogue, cap payload
size, require same-origin POST requests, and rate-limit abusive requests at the
edge. The browser sends the event with `sendBeacon` or `fetch(..., keepalive)`
before following the real source link. If a visitor navigates internally before
clicking Play, retain only an ephemeral session-level referral class (for
example `google`, `bing`, `owned-social`, or `direct`) without generating a
session or user identifier.

## Required workflows

### `ci.yml`

Run on every pull request:

- dependency install from lockfile;
- `npm run validate:strict`;
- `npm run build`;
- `npm test`;
- evidence schema and hash validation;
- outbound URL, licence, canonical, robots, sitemap, advertising-position, and
  privacy checks;
- collection originality and membership checks when applicable.

### `growth-capture.yml`

Run on a conservative schedule and by manual dispatch:

- pick the highest-priority unprocessed item;
- prioritize the 50 most complete existing games, then all eleven Featured
  games, then Search Console opportunities, then underrepresented categories;
- run Playwright in an isolated job with no sensitive secrets;
- capture desktop and mobile evidence, console/network failures, and bounded
  interaction attempts;
- upload the evidence bundle as a short-retention artifact.

The workflow processes only as many items as free capacity permits. It never
widens a batch after a quota error.

### `growth-assess.yml`

- sanitize and bound the capture bundle;
- call GitHub Models through a provider-neutral adapter;
- reject prompt instructions originating from the visited page;
- generate a structured assessment, proposed review, controls, features, tags,
  and source citations;
- stop on rate limit and leave the job queued for a later schedule;
- never fall back to unsupported prose or a metadata-only approval.

### `growth-publish.yml`

- materialize immutable evidence and catalogue/editorial changes on a bot
  branch;
- create a PR containing no more than five game pages or one Collection;
- attach an evidence summary and generated diff summary;
- request auto-merge only after every required check succeeds;
- forbid direct pushes to `main`.

Use a narrowly scoped GitHub App or equivalent repository-scoped credential so
bot-created PRs can trigger required checks without exposing a personal token.

### `post-deploy.yml`

After Cloudflare deploys `main`:

- check the homepage, changed game/Collection pages, sitemap, robots, CSS, ad
  placement, Play CTA, and source URLs;
- verify no console errors and no accidental legacy iframe/fake metrics;
- on failure, restore the preceding Cloudflare deployment and open an automatic
  revert PR;
- on success, release the changed URLs to the distribution queue.

### `growth-report.yml`

Run weekly and retain aggregate history for at least the full 120-day cycle:

- Search Console impressions, clicks, CTR, pages, queries, and index trend;
- first-party Play aggregates and conversion;
- evidence queue throughput, failures, and quota pauses;
- published game and Collection counts;
- Bluesky post status;
- AdSense revenue only after it is actually received and entered as cash.

The report must label the 2026-07-22 sitemap submission as the new-site start.
Do not compare new pages to legacy GSC exclusions as if they were one cohort.

## Implementation phases

### Phase 0 — measurement and external prerequisites

Deliverables:

1. Enable privacy-respecting real-user page analytics in Cloudflare.
2. Add the first-party Play-click endpoint and daily aggregate storage using a
   free Cloudflare database/binding.
3. Add CTA event emission and tests; update the privacy page to describe what is
   actually collected.
4. Configure AdSense Privacy & messaging with a Google-certified CMP for
   regions where Google requires one, and distinguish advertising data from
   first-party aggregate measurement in the privacy page.
5. Add a weekly metric snapshot and the day-zero baseline record.
6. Keep the successful `https://arcadebloom.com/sitemap.xml`; remove the stale
   `http://arcadebloom.com/` sitemap entry from Search Console.
7. Enable Cloudflare Email Routing for `hello@arcadebloom.com` and verify the
   owner's Gmail forwarding destination. This phase sends no unsolicited mail.

Exit gate: a controlled visit is visible as a page view, a controlled Play click
increments only the expected aggregate, no personal identifier is stored, and
mail to `hello@arcadebloom.com` reaches the verified destination.

### Phase 1 — evidence and index gates

Deliverables:

1. Add the frozen 2,019-entry provisional manifest and review registry.
2. Define and validate the immutable evidence schema.
3. Extend sitemap and robots rendering so new unreviewed games cannot index.
4. Convert the existing candidate states from `human editorial review` to
   automated evidence decisions without weakening licence or source checks.
5. Implement isolated capture and model-assessment workflows.

Exit gate: a known-good fixture passes, a broken game fails, a metadata-only
fixture cannot pass, and a new unreviewed catalogue entry is `noindex` and absent
from the sitemap while all grandfathered entries remain unchanged.

### Phase 2 — autonomous publication

Deliverables:

1. Add branch protection and required checks.
2. Create the repository-scoped publication identity.
3. Implement bot branches, bounded PRs, auto-merge, deployment health checks,
   rollback, and revert PRs.
4. Process the 50 most complete current entries and finish all Featured games
   first.

Exit gate: one fixture batch travels from evidence capture to production without
human approval, and an injected failure cannot merge or remain deployed.

### Phase 3 — Collections and distribution

Deliverables:

1. Add Collection data, templates, schema, canonical/JSON-LD, sitemap entries,
   social images, and quality validation.
2. Publish RSS containing only eligible reviews and Collections.
3. Create the ArcadeBloom Bluesky account once, store an app password in GitHub
   Secrets, and implement deduplicated posts capped at three per week.
4. Publish Collections only after sufficient eligible games support a real
   editorial thesis.

Exit gate: one Collection deploys, appears in RSS, posts exactly once to
Bluesky, and never triggers automated likes, follows, replies, private messages,
or cross-posts.

### Phase 4 — 120-day optimization

Prioritize work in this order:

1. Search Console pages with impressions but weak CTR;
2. Featured games and games needed by the next Collection;
3. queries aligned with independent, open-source, experimental, and js13k
   browser-game intent;
4. underrepresented categories;
5. provisional pages with errors or misleading placeholder controls;
6. additional catalogue discovery only after the 100-page cohort is on track.

Do not respond to slow indexing by resubmitting the sitemap repeatedly, changing
dates without substantive edits, generating keyword permutations, or lowering
the evidence threshold.

Exit gate: evaluate the 120-day contract from the final 28-day window. Missing
the traffic target triggers a query/content/distribution review, not automatic
paid expansion.

## Advertising implementation

- Load AdSense only on templates that render an ad slot; do not load its script
  globally on pages without advertising.
- Use a Google-certified CMP and the AdSense Privacy & messaging configuration
  for EEA, UK, and Swiss traffic where required; do not imply that anonymous
  Play measurement makes AdSense anonymous.
- Keep labelled ads on aggregation and Collection pages.
- Add exactly one labelled game-detail ad after Source & Licence and before More
  Games.
- Prohibit interstitials, pop-ups, page takeovers, sticky ads, and placements
  adjacent to a Play CTA.
- Add smoke tests for placement count and ordering.
- Advertising clicks and revenue never substitute for Qualified organic visits
  or Outbound Play clicks in the growth contract.

## One-time owner configuration

These actions require account ownership and cannot be inferred from the repo:

1. In Cloudflare, enable Web Analytics and the free storage/binding selected for
   Play aggregates; keep paid overage disabled.
2. Enable Email Routing for `arcadebloom.com`, verify the private forwarding
   destination supplied by the owner, and route `hello@arcadebloom.com` to it.
   Do not commit that destination address.
3. In GitHub, keep GitHub Models paid usage disabled, create the scoped bot
   identity, enable auto-merge, and protect `main` with required checks.
4. Create a Google Cloud service account for read-only Search Console API
   access and grant it access to the domain property; store credentials only as
   encrypted repository secrets.
5. Create the ArcadeBloom Bluesky account and app password; store the handle and
   app password only as encrypted repository secrets.

## Definition of done

The implementation is complete when:

- every metric in the contract has an auditable source;
- no private email destination, API credential, token, or social password is in
  git history or build output;
- the privacy page accurately separates first-party aggregate Play measurement
  from AdSense data practices, and required consent messaging is active;
- current games remain indexable while new unreviewed games fail closed;
- browser evidence is required and tamper-evident;
- autonomous PRs cannot bypass required checks;
- failed deployments roll back;
- the site contains at least 100 evidence-reviewed game pages and eight
  evidence-led Collections;
- Bluesky and RSS publish only after successful deploys and respect caps;
- no unsolicited author email is sent;
- the final 28 days can be evaluated against 10,000 impressions, 300 Google
  clicks, 30 Play clicks, and 10% conversion without using edge-request counts.
