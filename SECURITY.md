# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ArcadeBloom, please report it responsibly:

1. **Do not** open a public GitHub issue.
2. Email: hello@arcadebloom.com with a description of the vulnerability.
3. Include steps to reproduce if possible.

You will receive a response within 48 hours. If the vulnerability is confirmed, a fix will be prioritized and you will be credited (unless you prefer to remain anonymous).

## Scope

This policy covers the ArcadeBloom website code (templates, build scripts, data pipeline). It does not cover third-party games linked from the directory — those are hosted on their authors' own sites with their own security policies.

## What is NOT a vulnerability

- The AdSense publisher ID (`ca-pub-...`) is publicly visible in the page source by design — it is not a secret.
- The `llms.txt` file is intentionally public (it is a context file for AI systems).
- Game source URLs are public outbound links.
