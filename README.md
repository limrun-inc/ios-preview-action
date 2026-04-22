# Limrun Preview Action

GitHub Action that builds iOS apps on a temporary [Limrun](https://limrun.com) Xcode instance, uploads the resulting asset via `xcodebuild`, and posts live preview links on pull requests.

**This lets you build and preview iOS apps without a Mac.**

## Usage

The action creates a temporary Xcode instance, syncs your project, runs `xcodebuild`, uploads the resulting asset under a deterministic PR-scoped name, and posts the preview link. Make sure your workflow triggers include `closed` for cleanup, and has `pull-requests: write` permission for PR comments.

### iOS

```yaml
# In your existing workflow
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

permissions:
  contents: read
  pull-requests: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Preview
        uses: limrun-inc/preview-action@v1
        with:
          project-path: .
          api-key: ${{ secrets.LIMRUN_API_KEY }}
          platform: ios
```

## Setup

1. Create a Limrun account at [console.limrun.com](https://console.limrun.com)
2. Generate an API key in the console settings
3. Add it as `LIMRUN_API_KEY` in your repo's Settings > Secrets and variables > Actions
4. Add the preview step to your existing CI workflow (see examples above)
5. Invite reviewers to your Limrun organization

## What it does

**On PR open or new commits:** creates a temporary Xcode instance, syncs the project, builds it remotely, uploads the produced asset, and posts a comment with a preview link. Reviewers click the link, sign into Limrun, and get a live interactive simulator in the browser.

**On PR close:** deletes the asset and updates the comment.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `project-path` | On open/sync | `.` | Directory to sync to the temporary Xcode instance. |
| `api-key` | Yes | | Limrun API key. Pass as a secret: `${{ secrets.LIMRUN_API_KEY }}` |
| `github-token` | No | `${{ github.token }}` | GitHub token for posting PR comments |

## Outputs

| Output | Description |
|--------|-------------|
| `preview-url` | The preview URL for the uploaded asset |
| `asset-id` | The Limrun asset ID |
| `asset-name` | The resolved asset name |

## Permissions

The workflow needs `pull-requests: write` to post PR comments. Without this, the action uploads the asset but skips the comment with a warning.
