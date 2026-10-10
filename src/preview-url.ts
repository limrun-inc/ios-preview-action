export function buildPreviewUrl(
  consoleUrl: string,
  assetName: string,
  model: "iphone" | "ipad",
  options: { env?: string; openUrl?: string; tunnel?: string } = {}
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
  return url.toString();
}
