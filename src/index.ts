import * as core from "@actions/core";
import * as github from "@actions/github";
import Limrun from "@limrun/api";
import { existsSync, statSync } from "fs";
import { postOrUpdateComment, updateCommentClosed } from "./comment";

async function run(): Promise<void> {
  const apiKey = core.getInput("api-key", { required: true });
  core.setSecret(apiKey);
  const consoleUrl = process.env.LIMRUN_CONSOLE_URL || "https://console.limrun.com";
  const ghToken = core.getInput("github-token");
  const client = new Limrun({ apiKey });
  const projectPath = core.getInput("project-path") || ".";
  const platform = "ios";

  const { payload } = github.context;
  const pr = payload.pull_request;
  if (!pr) {
    core.setFailed("This action only works on pull_request events.");
    return;
  }

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const prNumber = pr.number;
  const sha = pr.head.sha;
  const action = payload.action;

  const assetName = `preview/${owner}/${repo}/pr-${prNumber}-${platform}`;
  if (assetName.includes("..")) {
    core.setFailed("Asset name must not contain '..'");
    return;
  }

  if (action === "closed") {
    core.info("PR closed, cleaning up asset...");
    try {
      const assets = await client.assets.list({ nameFilter: assetName });
      const asset = assets.find((a) => a.name === assetName);
      if (!asset) {
        core.warning(`Asset "${assetName}" not found.`);
        return;
      }
      await client.assets.delete(asset.id);
    } catch (err) {
      core.warning(`Failed to delete asset: ${err}`);
    }
    if (ghToken) {
      try {
        await updateCommentClosed(ghToken, owner, repo, prNumber, platform);
      } catch (err) {
        core.warning(`Failed to update comment: ${err}`);
      }
    }
    return;
  }

  if (!["opened", "synchronize", "reopened", "labeled"].includes(action as string)) {
    core.info(`Ignoring PR action "${action}", nothing to do.`);
    return;
  }

  if (!existsSync(projectPath)) {
    core.setFailed(`project-path "${projectPath}" does not exist.`);
    return;
  }
  if (!statSync(projectPath).isDirectory()) {
    core.setFailed(`project-path "${projectPath}" must be a directory.`);
    return;
  }

  let xcodeInstanceId: string | undefined;
  try {
    core.info("Creating Xcode instance...");
    const xcodeInstance = await client.xcodeInstances.create({
      wait: true,
      reuseIfExists: true,
      metadata: {
        displayName: `${repo} PR #${prNumber} preview`,
        labels: {
          managed_by: "preview-action",
          github_owner: owner,
          github_repo: repo,
          github_pr: String(prNumber),
          github_platform: platform,
        },
      },
    });
    xcodeInstanceId = xcodeInstance.metadata.id;
    core.info(`Xcode instance ready: ${xcodeInstanceId}`);

    const xcode = await client.xcodeInstances.createClient({ instance: xcodeInstance });
    core.info(`Syncing project from ${projectPath}...`);
    await xcode.sync(projectPath, { watch: false, install: false });

    core.info(`Building project and uploading asset "${assetName}"...`);
    const build = xcode.xcodebuild(undefined, { upload: { assetName } });

    build.command.on("data", (chunk) => logChunk(chunk.toString(), core.info, "$ "));
    build.stdout.on("data", (chunk) => logChunk(chunk.toString(), core.info));
    build.stderr.on("data", (chunk) => logChunk(chunk.toString(), core.warning));

    const result = await build;
    if (result.exitCode !== 0) {
      throw new Error(`xcodebuild failed with exit code ${result.exitCode}`);
    }
  } finally {
    if (xcodeInstanceId) {
      try {
        core.info(`Deleting Xcode instance ${xcodeInstanceId}...`);
        await client.xcodeInstances.delete(xcodeInstanceId);
      } catch (err) {
        core.warning(`Failed to delete Xcode instance ${xcodeInstanceId}: ${err}`);
      }
    }
  }

  const previewUrl = `${consoleUrl}/preview?asset=${encodeURIComponent(assetName)}&platform=${platform}`;
  core.info(`Preview URL: ${previewUrl}`);
  core.setOutput("preview-url", previewUrl);
  core.setOutput("asset-name", assetName);

  if (ghToken) {
    try {
      await postOrUpdateComment(ghToken, owner, repo, prNumber, platform, sha, previewUrl);
      core.info("PR comment posted.");
    } catch (err) {
      core.warning(`Failed to post comment: ${err}`);
    }
  } else {
    core.warning("github-token not available, skipping PR comment.");
  }
}

function logChunk(
  chunk: string,
  log: (message: string) => void,
  prefix = ""
): void {
  for (const line of chunk.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed) {
      log(`${prefix}${trimmed}`);
    }
  }
}

run().catch((err) => core.setFailed(err instanceof Error ? err.message : String(err)));