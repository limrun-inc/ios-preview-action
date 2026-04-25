# iOS Preview on Simulator Links for Pull Requests

GitHub Action that builds iOS apps on a temporary [Limrun](https://limrun.com) Xcode instance and posts live preview links on pull requests where you can test your app
in an iOS Simulator streamed to your browser.

**This lets you build and preview iOS apps without a Mac.**

## Usage

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
        uses: limrun-inc/ios-preview-action@main
        with:
          project-path: .
          api-key: ${{ secrets.LIM_API_KEY }}
```

## Setup

1. Create a Limrun account at [console.limrun.com](https://console.limrun.com)
2. Generate an API key in the console settings
3. Add it as `LIM_API_KEY` in your repo's Settings > Secrets and variables > Actions
4. Add the preview step to your existing CI workflow (see examples above)
5. Invite reviewers to your Limrun organization

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `project-path` | On open/sync | `.` | Directory to sync to the temporary Xcode instance. |
| `project` | No | | Path to the iOS project file to build. |
| `workspace` | No | | Path to the iOS workspace file to build. |
| `scheme` | No | | The scheme to build. |
| `sdk` | No | `iphonesimulator` | The SDK to build. |
| `api-key` | Yes | | Limrun API key. Pass as a secret: `${{ secrets.LIM_API_KEY }}` |
| `github-token` | No | `${{ github.token }}` | GitHub token for posting PR comments |

## Outputs

| Output | Description |
|--------|-------------|
| `preview-url` | The preview URL for the uploaded asset |
| `asset-id` | The Limrun asset ID |
| `asset-name` | The resolved asset name |

## Permissions

The workflow needs `pull-requests: write` to post PR comments. Without this, the action uploads the asset but skips the comment with a warning.
