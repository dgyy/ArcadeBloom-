# Administrator Email — `wkrealmadrid@hotmail.com`

## Status

**Active public mailbox:** `wkrealmadrid@hotmail.com`.

## What this establishes

The administrator mailbox receives game submissions, corrections, takedown
requests and security reports. The site only prepares a local email draft;
visitors explicitly send it through their own mail app. No backend receipt is
claimed, and no unsolicited creator mail is introduced.

## Owner verification checklist

These steps require mailbox ownership and cannot be performed from the repo:

1. Confirm the administrator can sign in to the mailbox.
2. Send a controlled test mail from a third address to
   `wkrealmadrid@hotmail.com` and confirm it arrives at the verified destination.
3. Confirm replies do not expose credentials or an unintended sender identity.

## Security constraints (must hold)

- No credentials, tokens, recovery details or passwords related to the inbox are
  stored in the repository or in GitHub Secrets as part of this issue.
- No outbound mail automation is introduced here. The Bluesky and RSS
  distribution slices (#19, #18) are the only automated external channels this
  cycle; email outreach remains explicitly opt-in per ADR-0005/0009.

## Verification

Once the owner has completed the checklist above, a controlled test mail sent
to `wkrealmadrid@hotmail.com` from a third address must arrive at the verified
destination inbox. This is the acceptance gate for issue #4; it cannot be
automated from CI because it crosses an external mail provider.

## After this phase

The mailbox provides the current manual review channel. Any future automated
receipt or submission-status system requires a separate privacy and delivery
decision.
