# Autonomous publication only through pull-request gates

## Status
accepted

ArcadeBloom's growth system may publish without human approval only by creating small pull requests—at most five game pages or one Collection—that pass evidence integrity, catalogue validation, build, Playwright, outbound-link, canonical, indexing, and advertising checks. GitHub may auto-merge a passing batch and Cloudflare may deploy only from `main`; direct bot pushes, bypassed checks, and failed post-deployment health checks are prohibited, with the latter triggering batch rollback. This preserves unattended throughput while containing the blast radius of erroneous AI output.
