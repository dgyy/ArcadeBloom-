# Clean directory-style URLs (no extension) for the new ArcadeBloom

## Status
accepted

## Context
The legacy sitemap is 378 URLs, of which 369 (96.8%) are `game-detail.html?slug=...` parameter pages — parameter URLs with no static crawlable landing page, the exact "parameter-page indexation sprawl" failure flagged in `Plan.md` P0. Because the legacy catalogue is being wiped (ADR-0001), the new directory's URL scheme is a greenfield choice, not a migration.

The directory lives on static hosting. Clean URLs require host-level rewrite rules; `.html`-suffixed URLs need no rewrite.

## Decision
Adopt **directory-style, extensionless URLs** for the new site, enforced by host rewrite rules:

```
/                       home
/game/<slug>/           game detail page
/category/<slug>/       category landing (paged: /category/<slug>/2/)
/tag/<slug>/            tag landing (paged: /tag/<slug>/2/)
/popular/  /new/  /featured/   aggregation pages
/about/  /contact/  /terms/  /privacy/   static pages
/search/                search page (noindex, query-param driven)
```

Implementation: each "directory" URL is backed by a generated `index.html` at that path (e.g. `/game/hextris/` → `/game/hextris/index.html`), which most static hosts serve without explicit rewrite. Where the host doesn't auto-resolve `index.html`, add a rewrite rule.

Canonical = the clean URL itself, with trailing slash. Sitemap contains clean URLs only. No parameter-style URLs are emitted anywhere.

## Considered Options
- **Directory-style extensionless (chosen)** — best SEO (no `.html`, clear hierarchy), matches industry convention (itch.io/Poki), shareable/professional-looking. The directory's entire acquisition model is organic search, so the URL-quality investment pays off. Cost: a host rewrite rule and a static-generation step that writes `index.html` per directory.
- **`.html`-suffixed** — zero config, works on any static host with no rewrite, matches the current `python -m http.server` dev preview in AGENTS.md. But inferior for a site whose lifeblood is SEO and external link-sharing. Rejected.
- **Hybrid (content pages extensionless, static pages `.html`)** — split standard creates two sets of rules for sitemap/canonical/link-generation and is a maintenance trap. Rejected.

## Consequences
- A **static site generator step** is now mandatory: `games-data.js` (or its successor) → generated `index.html` under each `/game/<slug>/`, `/category/<slug>/`, `/tag/<slug>/` directory. The legacy "single `game-detail.html` + client-side injection" model is dead — every content page must be pre-rendered so crawlers see full HTML without JS.
- Trailing slash is canonical. Internal links, sitemap, canonical tags, and OG `og:url` must all emit the trailing-slash form consistently.
- The legacy `game-detail.html` and its 369 sitemap entries are deleted wholesale. If any external backlinks point at old `game-detail.html?slug=...` URLs, decide later whether to 301 them to the home or category page (low priority — the legacy catalogue had little SEO authority).
- The `/search/` page is `noindex,follow` by design: infinite query combinations must not enter the index. Only static aggregation pages (`/popular/`, `/new/`, `/featured/`) are indexed.
