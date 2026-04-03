import * as github from "@actions/github";

function marker(platform: string): string {
  return `<!-- limrun-preview-${platform} -->`;
}

const platformLabel: Record<string, string> = {
  ios: "iOS",
  android: "Android",
};

function buildComment(platform: string, sha: string, previewUrl: string): string {
  return [
    "**Limrun Preview**",
    "",
    `| Platform | Commit | Preview |`,
    `|---|---|---|`,
    `| ${platformLabel[platform] || platform} | \`${sha.slice(0, 7)}\` | [Open Preview →](${previewUrl}) |`,
    "",
    "Reviewer must be a member of the organization on Limrun.",
    "",
    marker(platform),
  ].join("\n");
}

function buildClosedComment(platform: string): string {
  return [
    "**Limrun Preview**",
    "",
    `${platformLabel[platform] || platform} preview removed. This PR is closed.`,
    "",
    marker(platform),
  ].join("\n");
}

async function findComment(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  prNumber: number,
  platform: string
): Promise<number | null> {
  const m = marker(platform);
  for await (const { data: comments } of octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    { owner, repo, issue_number: prNumber, per_page: 100 }
  )) {
    for (const comment of comments) {
      if (comment.body?.includes(m)) {
        return comment.id;
      }
    }
  }
  return null;
}

export async function postOrUpdateComment(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  platform: string,
  sha: string,
  previewUrl: string
): Promise<void> {
  const octokit = github.getOctokit(token);
  const body = buildComment(platform, sha, previewUrl);
  const existingId = await findComment(octokit, owner, repo, prNumber, platform);

  if (existingId) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existingId, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: prNumber, body });
  }
}

export async function updateCommentClosed(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  platform: string
): Promise<void> {
  const octokit = github.getOctokit(token);
  const existingId = await findComment(octokit, owner, repo, prNumber, platform);
  if (existingId) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingId,
      body: buildClosedComment(platform),
    });
  }
}
