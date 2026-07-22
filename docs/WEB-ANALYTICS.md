# Cloudflare Web Analytics

## Status

**Code complete (issue #6); owner configuration required to activate.**

## What this is

Privacy-respecting real-user page analytics from Cloudflare. This is the
human-traffic signal the growth contract leans on — as opposed to Cloudflare's
edge analytics, which are dominated by requests and possible bots and are
explicitly **excluded** from the contract (see
`docs/metrics/baseline-2026-07-22.json` → `cloudflareEdgeAnalytics`).

## Owner setup (cannot be done from code)

1. In Cloudflare, open **Web Analytics** (not the zone's general analytics).
2. Add the `arcadebloom.com` site as a Web Analytics property.
3. Cloudflare provides a JS beacon snippet. For a static Cloudflare Pages site
   the simplest path is to enable **automatic beacon insertion** at the Pages
   project level (Pages project → Settings → Web Analytics → enable) so no
   code change is needed. Otherwise, add the beacon snippet to
   `src/_includes/base.njk` `<head>`.
4. Confirm real visits appear in the Web Analytics dashboard within 24 hours.

Cloudflare Web Analytics does not use cookies and does not collect personal
data — it is consistent with the privacy page's promise.

## What the weekly report consumes

`growth-report.yml` (`.github/workflows/growth-report.yml`) emits a weekly
snapshot. Cloudflare Web Analytics does not currently have a first-class
read API for arbitrary aggregation; the report's `playClickAggregates` and
`googleSearchConsole` slots are the machine-readable metrics. Web Analytics
figures are read manually from the dashboard into the snapshot when a human
reviews the 120-day contract.

## Relationship to the day-zero baseline

The baseline (`docs/metrics/baseline-2026-07-22.json`) records that Cloudflare
edge analytics are NOT a human-traffic baseline. Web Analytics is the
human-traffic baseline. The two must not be conflated.
