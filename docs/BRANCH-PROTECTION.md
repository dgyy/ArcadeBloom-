# Branch protection + required checks (issue #13)

## Status

**Owner configuration required.** The settings below are GitHub repository
configuration that must be applied by the repository owner. They cannot be
fully captured in code — branch protection rules are account-owned state.

## Required: protect `main`

Apply via GitHub UI (Settings → Branches → Branch protection rules → Add rule
for `main`) or via `gh api`:

```bash
gh api -X PUT repos/dgyy/ArcadeBloom-/branches/main/protection -F required_status_checks[strict]=true -F required_status_checks[contexts][]="build-and-test" -F enforce_admins=true -F required_pull_request_reviews[required_approving_review_count]=0 -F restrictions=
```

Settings:

- **Require a pull request before merging**: yes (the bot publishes through PRs only, per #12)
- **Require status checks to pass**: yes
  - `build-and-test` (the job name in `.github/workflows/ci.yml`)
  - Require branches to be up to date before merging
- **Require conversation resolution**: optional
- **Do not allow bypassing the above settings**: yes (`enforce_admins=true`)
- **Direct pushes to `main`**: blocked

## Required: enable auto-merge

GitHub UI: Settings → General → Pull Requests → Allow auto-merge. This lets
`growth-publish.yml` request `gh pr merge --auto` so a bot PR lands the moment
its required checks pass, without a human pressing merge.

## Required: scoped bot identity

The default `GITHUB_TOKEN` works for `growth-publish.yml` but is broad. For
stricter scoping (ADR-0008 Trust boundaries), create a GitHub App with:
- Repository contents: write (one repo)
- Pull requests: write (one repo)
- NO access to: actions secrets, environments, deploy keys, other repos

Store the App's private key + App ID as encrypted repository secrets
(`BOT_APP_ID`, `BOT_PRIVATE_KEY`) and swap `growth-publish.yml` to generate an
installation token via `tibdex/github-app-token` action. This keeps the bot
from touching anything outside this repo's PR flow.

## Verification

After applying the above, an injected failing check must NOT merge. Test:
open a PR that breaks `validate:strict` (e.g. add a duplicate slug). The PR's
`build-and-test` check fails, and GitHub blocks merge. This is the gate that
makes autonomous publication (#12) safe.
