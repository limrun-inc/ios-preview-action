import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { EventEmitter } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let inputs, state, calls, outputs, instances, failure, restorePhase, savePhase, finishSave;
const context = {
  runId: 123, runAttempt: 1, repo: { owner: "org", repo: "app" },
  payload: { action: "opened", pull_request: { number: 42, head: { sha: "abc" } } },
};
mock.module("@actions/core", { namedExports: {
  getInput: (name) => inputs[name] ?? "", getState: (name) => state[name] ?? "",
  saveState: (name, value) => { state[name] = value; },
  setSecret: () => {}, info: () => {}, warning: (line) => calls.push(["warning", line]),
  setFailed: (line) => { throw new Error(line); },
  setOutput: (name, value) => { outputs[name] = value; },
}});
mock.module("@actions/github", { namedExports: { context } });
const command = (result) => Object.assign(Promise.resolve(result), {
  command: new EventEmitter(), stdout: new EventEmitter(), stderr: new EventEmitter(),
});
const instanceAPI = {
  create: async (options) => {
    calls.push(["create", options]); instances = [{ metadata: { id: "sandbox_eu_test" } }]; return instances[0];
  },
  createClient: async () => ({
    setXcode: async () => ({ alreadyBound: true }),
    sync: async () => { calls.push(["sync"]); },
    run: (script) => {
      calls.push(["prepare", script]);
      return command({ status: failure === "prepare" ? "FAILED" : "SUCCEEDED", exitCode: failure === "prepare" ? 1 : 0 });
    },
    xcodebuild: () => {
      calls.push(["build"]);
      return command({ status: failure === "build" ? "FAILED" : "SUCCEEDED", exitCode: failure === "build" ? 1 : 0 });
    },
  }),
  list: async function* () { yield* instances; },
  delete: async (id) => {
    calls.push(["delete", id]);
    if (failure === "delete") throw new Error("delete failed");
    instances = [];
    finishSave?.({ snapshot: { save: { phase: savePhase, snapshotKey: "pr42" } }, gone: false });
  },
  followSnapshot: async (id, options = {}) => {
    calls.push([options.side === "save" ? "watch-save" : "restore"]);
    if (options.side !== "save") return { snapshot: { restore: { phase: restorePhase } }, gone: false };
    if (failure === "watch") throw new Error("watch failed before opening");
    options.onOpen();
    return new Promise((resolve, reject) => {
      finishSave = resolve;
      options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    });
  },
};
const { default: Limrun } = await import("@limrun/api/index.js");
const prototype = Object.getPrototypeOf(new Limrun({ apiKey: "test" }).xcodeInstances);
for (const [name, implementation] of Object.entries(instanceAPI)) {
  mock.method(prototype, name, implementation);
}
mock.module("../src/comment.ts", { namedExports: {
  postOrUpdateComment: async () => calls.push(["comment"]), updateCommentClosed: async () => {},
}});
mock.module("../src/media.ts", { namedExports: { attachMediaToPullRequest: async () => {} } });
const { runMain, runPost } = await import("../src/run.ts");
const { getSnapshotConfig, deleteWithSnapshot } = await import("../src/snapshot.ts");

beforeEach(() => {
  inputs = { "api-key": "test", "github-token": "test", "snapshot-key": "pr42", prepare: "bundle exec pod install\nxcodegen generate" };
  state = {}; calls = []; outputs = {}; instances = []; failure = undefined; finishSave = undefined;
  restorePhase = "restored"; savePhase = "published";
});

test("restores before sync, prepares before build, and observes publication before deletion", async () => {
  inputs["snapshot-restore-keys"] = "pr42\nmain\n";
  inputs["snapshot-paths"] = "Pods\r\n.build\r\n";
  await runMain();
  assert.deepEqual(calls.map(([kind]) => kind), ["create", "restore", "sync", "prepare", "build", "watch-save", "delete", "comment"]);
  assert.deepEqual(calls[0][1].spec.snapshot, { key: "pr42", restoreKeys: ["pr42", "main"], paths: ["Pods", ".build"] });
  assert.equal(calls[0][1].reuseIfExists, undefined);
  assert.equal(calls.find(([kind]) => kind === "prepare")[1], "set -e\nbundle exec pod install\nxcodegen generate");
  assert.match(state["cleanup-label-selector"], /github_run_id=123,github_run_attempt=1/);
  assert.ok(outputs["preview-url"]);
  await runPost();
  assert.equal(calls.filter(([kind]) => kind === "delete").length, 1);
});

test("omitted inputs retain the plain sync-build flow", async () => {
  delete inputs.prepare; delete inputs["snapshot-key"];
  await runMain();
  assert.deepEqual(calls.map(([kind]) => kind), ["create", "sync", "build", "delete", "comment"]);
  assert.equal(calls[0][1].spec, undefined);
});

test("a cold snapshot miss still prepares and builds", async () => {
  restorePhase = "skipped";
  await runMain();
  assert.ok(calls.some(([kind]) => kind === "build"));
});

test("failed restore prevents sync and build but still cleans up", async () => {
  restorePhase = "failed"; savePhase = "skipped";
  await assert.rejects(runMain(), /restore did not complete/);
  assert.deepEqual(calls.map(([kind]) => kind), ["create", "restore", "watch-save", "delete"]);
});

for (const phase of ["prepare", "build"]) {
  test(`cleans up and does not publish a preview when ${phase} fails`, async () => {
    failure = phase; savePhase = "skipped";
    await assert.rejects(runMain());
    assert.ok(calls.some(([kind]) => kind === "delete"));
    assert.deepEqual(outputs, {});
    if (phase === "prepare") assert.equal(calls.some(([kind]) => kind === "build"), false);
  });
}

test("restore-only configuration does not wait for publication", async () => {
  delete inputs["snapshot-key"]; inputs["snapshot-restore-keys"] = "main";
  await runMain();
  assert.ok(calls.some(([kind]) => kind === "restore"));
  assert.equal(calls.some(([kind]) => kind === "watch-save"), false);
});

test("publication failure is reported without hiding the successful preview", async () => {
  savePhase = "failed";
  await runMain();
  assert.ok(calls.some(([kind, message]) => kind === "warning" && message.includes("publication did not complete")));
  assert.ok(outputs["preview-url"]);
});

test("watch failure before opening cannot block deletion", async () => {
  failure = "watch";
  await assert.rejects(deleteWithSnapshot({ xcodeInstances: instanceAPI }, "id", true), /watch failed/);
  assert.deepEqual(calls.map(([kind]) => kind), ["watch-save", "delete"]);
});

test("delete failure aborts the publication watcher", async () => {
  failure = "delete";
  await assert.rejects(deleteWithSnapshot({ xcodeInstances: instanceAPI }, "id", true), /delete failed/);
});

test("snapshot inputs parse newline lists and leave defaults to the server", () => {
  inputs = {}; assert.equal(getSnapshotConfig(), undefined);
  inputs = { "snapshot-key": "key" }; assert.deepEqual(getSnapshotConfig(), { key: "key" });
  inputs = { "snapshot-paths": "Pods\n \n.build" }; assert.deepEqual(getSnapshotConfig(), { paths: ["Pods", ".build"] });
});

test("Bazel rejects preparation and snapshot inputs before creating a sandbox", async () => {
  const dir = mkdtempSync(join(tmpdir(), "preview-bazel-"));
  try {
    writeFileSync(join(dir, "MODULE.bazel"), "");
    inputs["project-path"] = dir;
    await assert.rejects(runMain(), /prepare, snapshot inputs only applies/);
    assert.equal(calls.some(([kind]) => kind === "create"), false);
  } finally { rmSync(dir, { recursive: true }); }
});

test("names the persistent tunnel in the preview link", async () => {
  inputs.tunnel = "staging";
  await runMain();
  assert.equal(new URL(outputs["preview-url"]).searchParams.get("tunnel"), "staging");
});

test("a malformed tunnel name fails before creating a sandbox", async () => {
  inputs.tunnel = "Staging_1";
  await assert.rejects(runMain(), /tunnel must be a persistent tunnel's name/);
  assert.deepEqual(calls, []);
});
