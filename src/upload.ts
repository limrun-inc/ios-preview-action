import * as core from "@actions/core";
import Limrun from "@limrun/api";
import { execFileSync } from "child_process";
import { statSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join, dirname, basename } from "path";

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

interface UploadResult {
  id: string;
  name: string;
}

export async function uploadAsset(
  client: Limrun,
  appPath: string,
  assetName: string
): Promise<UploadResult> {
  // iOS .app bundles are directories and need tar. Android APKs are
  // single files and must be uploaded as-is (the emulator expects raw APK).
  let uploadPath = appPath;
  let tarPath: string | null = null;

  if (statSync(appPath).isDirectory()) {
    tarPath = join(tmpdir(), `limrun-preview-${Date.now()}.tar.gz`);
    execFileSync("tar", ["-czf", tarPath, "-C", dirname(appPath), basename(appPath)]);
    uploadPath = tarPath;
  }

  try {
    const { size } = statSync(uploadPath);
    if (size > MAX_SIZE_BYTES) {
      throw new Error(`File is ${Math.round(size / 1024 / 1024)}MB, exceeds 500MB limit`);
    }

    const asset = await client.assets.getOrUpload({ path: uploadPath, name: assetName });
    return { id: asset.id, name: asset.name };
  } finally {
    if (tarPath) {
      try { unlinkSync(tarPath); } catch { /* ignore */ }
    }
  }
}

export async function deleteAsset(client: Limrun, assetName: string): Promise<void> {
  const assets = await client.assets.list({ nameFilter: assetName });
  const match = assets.find((a) => a.name === assetName);
  if (!match) return;
  await client.assets.delete(match.id);
}
