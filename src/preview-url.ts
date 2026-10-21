export function buildPreviewUrl(
  consoleUrl: string,
  assetName: string,
  model: "iphone" | "iphone-duo" | "ipad",
  options: { env?: string; openUrl?: string; tunnel?: string; deviceState?: string } = {}
): string {
  const baseUrl = consoleUrl.endsWith("/") ? consoleUrl : `${consoleUrl}/`;
  const url = new URL("preview", baseUrl);
  url.searchParams.set("asset", assetName);
  url.searchParams.set("platform", "ios");
  url.searchParams.set("model", model);
  for (const entry of (options.env ?? "").split(/\r?\n/)) {
    if (entry.trim()) {
      url.searchParams.append("env", entry);
    }
  }
  if (options.openUrl) {
    url.searchParams.set("openUrl", options.openUrl);
  }
  if (options.tunnel) {
    url.searchParams.set("tunnel", options.tunnel);
  }
  // The key is a name, never a secret: the link is posted on the PR for everyone. Who the saved
  // state belongs to comes from the reviewer's console login when they open it.
  if (options.deviceState) {
    url.searchParams.set("deviceState", options.deviceState);
  }
  return url.toString();
}
