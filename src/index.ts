import * as core from "@actions/core";
import * as github from "@actions/github";
import Limrun from "@limrun/api";
import { existsSync, statSync } from "fs";
import { postOrUpdateComment, updateCommentClosed } from "./comment";

const IS_POST_RUN_STATE = "is-post-run";
const CLEANUP_LABEL_SELECTOR_STATE = "cleanup-label-selector";
const platform = "ios";

function getPreviewLabels(owner: string, repo: string, prNumber: number): Record<string, string> {
  return {
    managed_by: "preview-action",
    github_owner: owner,
    github_repo: repo,
    github_pr: String(prNumber),
    github_platform: platform,
  };
}

function toLabelSelector(labels: Record<string, string>): string {
  return Object.entries(labels)
    .map(([key, value]) => `${key}=${value}`)
    .join(",");
}

async function cleanupXcodeInstances(client: Limrun, labelSelector: string): Promise<void> {
  const page = await client.xcodeInstances.list({
    labelSelector,
    state: "creating,assigned,ready,unknown",
  });
  const instances = page.items ?? page.getPaginatedItems();

  if (instances.length === 0) {
    core.info(`No Xcode instances found for label selector "${labelSelector}".`);
    return;
  }

  for (const instance of instances) {
    try {
      core.info(`Deleting Xcode instance ${instance.metadata.id}...`);
      await client.xcodeInstances.delete(instance.metadata.id);
    } catch (err) {
      core.warning(`Failed to delete Xcode instance ${instance.metadata.id}: ${err}`);
    }
  }
}

async function runPost(): Promise<void> {
  const apiKey = core.getInput("api-key", { required: true });
  core.setSecret(apiKey);

  const labelSelector = core.getState(CLEANUP_LABEL_SELECTOR_STATE);
  if (!labelSelector) {
    core.info("No Xcode cleanup state found, skipping post cleanup.");
    return;
  }

  const client = new Limrun({ apiKey });
  await cleanupXcodeInstances(client, labelSelector);
}

async function runMain(): Promise<void> {
  const apiKey = core.getInput("api-key", { required: true });
  core.setSecret(apiKey);
  // Mark the main step immediately so the GitHub Actions post hook
  // always routes into runPost(), even if main exits early.
  core.saveState(IS_POST_RUN_STATE, "true");
  const consoleUrl = process.env.LIMRUN_CONSOLE_URL || "https://console.limrun.com";
  const ghToken = core.getInput("github-token");
  const client = new Limrun({ apiKey });
  const projectPath = core.getInput("project-path") || ".";

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
  const labels = getPreviewLabels(owner, repo, prNumber);
  const labelSelector = toLabelSelector(labels);

  const assetName = `preview/${owner}/${repo}/pr-${prNumber}-${platform}`;
  if (assetName.includes("..")) {
    core.setFailed("Asset name must not contain '..'");
    return;
  }

  core.saveState(CLEANUP_LABEL_SELECTOR_STATE, labelSelector);

  if (action === "closed") {
    try {
      core.info("PR closed, cleaning up asset...");
      try {
        await cleanupXcodeInstances(client, labelSelector);
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
    } catch (err) {
      core.warning(`Failed to cleanup asset: ${err}`);
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

  try {
    core.info("Creating Xcode instance...");
    const xcodeInstance = await client.xcodeInstances.create({
      wait: true,
      reuseIfExists: true,
      metadata: {
        displayName: `${repo} PR #${prNumber} preview`,
        labels,
      },
    });
    core.info(`Xcode instance ready: ${xcodeInstance.metadata.id}`);

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
    await cleanupXcodeInstances(client, labelSelector);
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

const isPostRun = core.getState(IS_POST_RUN_STATE) === "true";
const entrypoint = isPostRun ? runPost : runMain;

entrypoint().catch((err) => core.setFailed(err instanceof Error ? err.message : String(err)));