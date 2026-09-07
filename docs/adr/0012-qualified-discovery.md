# Content-qualified discovery and source archives

Accepted following the owner's SEO audit and correction requests.

Public discovery lists, search, related games and tag eligibility use the same
directory-content policy as game robots and the sitemap. Source records lacking
complete descriptions remain at their original noindex URLs and are reachable
through the noindex /catalogue/archive/ directory. Explicit drafts and unlisted
entries are excluded from that archive.

Category counts use qualified entries. Global navigation requires 20 qualified
games; homepage genre browsing and existing category URLs remain available.
Internal seeding targets are not visitor-facing copy. Tag links must use the
same qualified threshold as generated tag pages.

Legacy endpoints return actual HTTP 410 through scoped Pages Functions because
Pages _redirects does not support 410. Existing static 301 mappings remain.

Detail pages request one inline ad below 1440px and hide it above that breakpoint.
AdSense Side rails require publisher-account configuration; this code does not
claim to enable them or guarantee ad delivery. Window resizing never requests
a second inline slot. This amends the old single-placement description in CONTEXT.

Remaining operational/content work: www host redirect, verified modification
dates, sourced new Collections and AI entries, AdSense configuration and Search
Console inspection. These must not be reported as completed by this change.
