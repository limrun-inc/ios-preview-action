import * as core from "@actions/core";
import * as github from "@actions/github";
import { spawn } from "child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { basename, join } from "path";

// The action owns the body section between these markers and rewrites it on
// every run, so a new push replaces the media instead of appending a copy.
const blockStart = "<!-- limrun-preview-media -->";
const blockEnd = "<!-- /limrun-preview-media -->";

// Splits `path#alt text` the way gh does, so the embed names the same file gh
// uploads: the longest prefix that exists wins, since `#` is legal in filenames.
function parseAttachment(attachment: string): { path: string; alt: string } {
  if (existsSync(attachment)) {
    return { path: attachment, alt: "" };
  }
  for (let i = attachment.lastIndexOf("#"); i > 0; i = attachment.lastIndexOf("#", i - 1)) {
    if (existsSync(attachment.slice(0, i))) {
      return { path: attachment.slice(0, i), alt: attachment.slice(i + 1) };
    }
  }
  const i = attachment.lastIndexOf("#");
  return i > 0
    ? { path: attachment.slice(0, i), alt: attachment.slice(i + 1) }
    : { path: attachment, alt: "" };
}

// One embed per paragraph. gh swaps each local path for its uploaded URL, and
// a video embed that stands alone becomes a bare URL, which renders as a player.
function buildBlock(attachments: string[]): string {
  const embeds = attachments.map((attachment) => {
    const { path, alt } = parseAttachment(attachment);
    const label = (alt || basename(path)).replace(/[\\[\]]/g, "\\$&");
    return `![${label}](<${path}>)`;
  });
  return [blockStart, ...embeds, blockEnd].join("\n\n");
}

export function withMediaBlock(body: string, attachments: string[]): string {
  const block = buildBlock(attachments);
  const start = body.indexOf(blockStart);
  const end = body.indexOf(blockEnd, start);
  if (start !== -1 && end !== -1) {
    return body.slice(0, start) + block + body.slice(end + blockEnd.length);
  }
  return body.trim() ? `${body.trimEnd()}\n\n${block}\n` : `${block}\n`;
}

export async function attachMediaToPullRequest(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  attachments: string[]
): Promise<void> {
  const octokit = github.getOctokit(token);
  const { data: pr } = await octokit.rest.pulls.get({ owner, repo, pull_number: prNumber });

  const dir = mkdtempSync(join(tmpdir(), "limrun-media-"));
  const bodyFile = join(dir, "body.md");
  writeFileSync(bodyFile, withMediaBlock(pr.body ?? "", attachments));

  const args = [
    "pr",
    "edit",
    String(prNumber),
    "--repo",
    `${owner}/${repo}`,
    "--body-file",
    bodyFile,
    ...attachments.flatMap((attachment) => ["--attach", attachment]),
  ];

  core.info(`Attaching ${attachments.length} media file(s) to the pull request body...`);
  try {
    await new Promise<void>((resolvePromise, reject) => {
      const child = spawn("gh", args, {
        env: { ...process.env, GH_TOKEN: token },
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stderr = "";
      child.stdout.on("data", (chunk) => core.info(chunk.toString().trimEnd()));
      child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
      child.on("error", (err: NodeJS.ErrnoException) => {
        reject(
          err.code === "ENOENT"
            ? new Error("gh v2.99.0 or newer is required when the media input is set.")
            : err
        );
      });
      child.on("close", (code, signal) => {
        if (code === 0) {
          resolvePromise();
        } else if (signal) {
          reject(new Error(`gh pr edit was killed by ${signal}`));
        } else {
          reject(new Error(`gh pr edit failed with exit code ${code}: ${stderr.trim()}`));
        }
      });
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
