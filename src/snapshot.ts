import * as core from "@actions/core";
import type Limrun from "@limrun/api/index.js";
import type { XcodeSnapshotConfig } from "@limrun/api/index.js";

function getSnapshotInput(legacyName: string): string {
  const name = `xcode-${legacyName}`;
  const value = core.getInput(name).trim();
  const legacy = core.getInput(legacyName).trim();
  if (value && legacy && value !== legacy) {
    throw new Error(`${name} and ${legacyName} must match when both are set`);
  }
  return value || legacy;
}

export function getSnapshotConfig(): XcodeSnapshotConfig | undefined {
  const key = getSnapshotInput("snapshot-key");
  const restoreKeys = getSnapshotInput("snapshot-restore-keys").split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  const paths = getSnapshotInput("snapshot-paths").split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  if (!key && !restoreKeys.length && !paths.length) return undefined;
  return {
    ...(key && { key }),
    ...(restoreKeys.length && { restoreKeys }),
    ...(paths.length && { paths }),
  };
}

export async function restoreSnapshot(client: Limrun, id: string): Promise<void> {
  const { snapshot, gone } = await client.xcodeInstances.followSnapshot(id, {
    onUpdate: ({ restore }) => core.info(`Disk snapshot restore: ${restore.phase}${restore.reason ? ` (${restore.reason})` : ""}`),
  });
  if (gone || snapshot.restore.phase === "failed") {
    throw new Error(snapshot.restore.message ?? "Disk snapshot restore did not complete");
  }
}

export async function deleteWithSnapshot(client: Limrun, id: string, publish: boolean): Promise<void> {
  if (!publish) {
    await client.xcodeInstances.delete(id);
    return;
  }
  const abort = new AbortController();
  let open = () => {};
  const opened = new Promise<void>((resolve) => { open = resolve; });
  const done = client.xcodeInstances.followSnapshot(id, {
    side: "save",
    signal: abort.signal,
    onOpen: open,
    onUpdate: ({ save }) => core.info(`Disk snapshot publication: ${save.phase}${save.reason ? ` (${save.reason})` : ""}`),
  }).then((result) => ({ result }), (error: unknown) => ({ error }));
  // Subscribe before deletion so fast publications are observed, but a broken stream must not prevent cleanup.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const openDeadline = new Promise<void>((resolve) => { timer = setTimeout(resolve, 10_000); });
  try {
    await Promise.race([opened, done, openDeadline]);
    clearTimeout(timer);
    await client.xcodeInstances.delete(id);
    const followed = await done;
    if ("error" in followed) throw followed.error;
    const { snapshot, gone } = followed.result;
    if (snapshot.save.phase === "published") {
      core.info(`Disk snapshot published${snapshot.save.snapshotKey ? ` as ${snapshot.save.snapshotKey}` : ""}.`);
    } else if (gone || snapshot.save.phase === "failed" || snapshot.save.phase === "timed_out") {
      throw new Error(snapshot.save.message ?? "Disk snapshot publication did not complete");
    } else {
      core.info(`Disk snapshot was not published: ${snapshot.save.phase}${snapshot.save.reason ? ` (${snapshot.save.reason})` : ""}.`);
    }
  } finally {
    clearTimeout(timer);
    abort.abort();
    await done;
  }
}
