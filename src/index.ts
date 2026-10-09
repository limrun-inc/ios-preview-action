import * as core from "@actions/core";
import { runMain, runPost } from "./run.ts";

const entrypoint = core.getState("is-post-run") === "true" ? runPost : runMain;
entrypoint().catch((err) => core.setFailed(err instanceof Error ? err.message : String(err)));
