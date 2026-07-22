# Email Routing — `hello@arcadebloom.com`

## Status

**Phase: owner configuration required.** This document records the setup that
must be performed in Cloudflare by the repository owner. It is the actionable
record for issue #4 / `GROWTH-AUTOMATION-PLAN.md` Phase 0 deliverable 7.

## What this establishes

An inbound mail channel for `hello@arcadebloom.com` so that future opt-in
creator correspondence (per ADR-0005) has a destination. This phase sends **no
unsolicited mail** — it is inbound-only, consistent with ADR-0009
(opt-in only creator email).

## Owner setup checklist (Cloudflare dashboard)

These steps require account ownership and cannot be performed from the repo:

1. In Cloudflare, select the `arcadebloom.com` zone.
2. Open **Email → Email Routing → Overview** and enable Email Routing.
3. Cloudflare will offer to add the required MX and TXT records automatically —
   accept. The MX records point at Cloudflare's mail servers
   (`route1.mx.cloudflare.net`, etc.); the TXT record is the SPF include
   (`include:_spf.mx.cloudflare.net`).
4. Under **Email Routing → Routing rules**, add a custom address rule:
   - Address: `hello@`
   - Action: Send to an email
   - Destination: the owner-supplied private forwarding address (e.g. a Gmail
     inbox the owner controls).
5. Cloudflare sends a verification mail to that destination. The owner must
   click the verification link in that mailbox to activate the route.
6. Send a controlled test mail from a third address to
   `hello@arcadebloom.com` and confirm it arrives at the verified destination.

## Security constraints (must hold)

- The private forwarding destination address is **never** committed to git, the
  build output, or any plaintext config. It lives only in Cloudflare and the
  owner's mailbox.
- No credentials, tokens, or passwords related to the destination inbox are
  stored in the repository or in GitHub Secrets as part of this issue.
- No outbound mail automation is introduced here. The Bluesky and RSS
  distribution slices (#19, #18) are the only automated external channels this
  cycle; email outreach remains explicitly opt-in per ADR-0005/0009.

## Verification

Once the owner has completed the checklist above, a controlled test mail sent
to `hello@arcadebloom.com` from a third address must arrive at the verified
destination inbox. This is the acceptance gate for issue #4; it cannot be
automated from CI because it crosses an external mail provider.

## After this phase

Email Routing is a prerequisite for any future opt-in creator correspondence,
but no such correspondence is built in the 120-day cycle. This issue only
opens the inbound channel.
