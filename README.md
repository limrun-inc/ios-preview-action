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
          build-settings: |
            SWIFT_ACTIVE_COMPILATION_CONDITIONS=$(inherited) LIMRUN
            APP_CONFIG_DEV_LOGIN_SECRET=${{ secrets.DEV_LOGIN_SECRET }}
```

For iPad-specific previews, set the simulator model:

```yaml
with:
  project-path: .
  model: ipad
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
| `model` | No | `iphone` | The iOS simulator model to use for previews. Supported values: `iphone` or `ipad`. |
| `build-settings` | No | | Newline-delimited `KEY=VALUE` Xcode build settings for the preview build. Allowlisted safe settings (currently `SWIFT_ACTIVE_COMPILATION_CONDITIONS`) plus any `APP_CONFIG_*` key. |
| `api-key` | Yes | | Limrun API key. Pass as a secret: `${{ secrets.LIM_API_KEY }}` |
| `github-token` | No | `${{ github.token }}` | GitHub token for posting PR comments |

## Build-time build settings

Use `build-settings` to pass Xcode build settings into the preview build. Allowed keys are a server-maintained allowlist of safe settings (currently `SWIFT_ACTIVE_COMPILATION_CONDITIONS`) plus any `APP_CONFIG_*` key for app configuration. Keys are passed to xcodebuild verbatim; use `$(inherited)` to append rather than replace.

```yaml
with:
  project-path: .
  scheme: Scripty
  api-key: ${{ secrets.LIM_API_KEY }}
  build-settings: |
    SWIFT_ACTIVE_COMPILATION_CONDITIONS=$(inherited) LIMRUN
    APP_CONFIG_DEV_LOGIN_SECRET=${{ secrets.DEV_LOGIN_SECRET }}
```

`SWIFT_ACTIVE_COMPILATION_CONDITIONS=$(inherited) LIMRUN` enables `#if LIMRUN` in your Swift sources for preview builds. An `APP_CONFIG_*` value (whose value is redacted in build logs) is referenced from your app's `Info.plist`, for example:

```xml
<key>DevLoginSecret</key>
<string>$(APP_CONFIG_DEV_LOGIN_SECRET)</string>
```

And read it at runtime:

```swift
let secret = Bundle.main.object(forInfoDictionaryKey: "DevLoginSecret") as? String
```

These values are available to the code being built and may be embedded into the app artifact. Use scoped preview/debug values rather than durable secrets. For non-Limrun builds, provide defaults in an `.xcconfig` or scheme, or make the app tolerate missing values.

## Outputs

| Output | Description |
|--------|-------------|
| `preview-url` | The preview URL for the uploaded asset |
| `asset-id` | The Limrun asset ID |
| `asset-name` | The resolved asset name |

## Permissions

The workflow needs `pull-requests: write` to post PR comments. Without this, the action uploads the asset but skips the comment with a warning.
