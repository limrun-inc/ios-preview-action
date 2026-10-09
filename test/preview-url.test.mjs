import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPreviewUrl } from "../src/preview-url.ts";

test("keeps existing preview links unchanged when inputs are omitted", () => {
  assert.equal(
    buildPreviewUrl("https://console.limrun.com", "preview/org/app/pr-42-ios", "iphone"),
    "https://console.limrun.com/preview?asset=preview%2Forg%2Fapp%2Fpr-42-ios&platform=ios&model=iphone"
  );
});

test("encodes multiple env entries and a deep link without losing values", () => {
  const entries = [
    "API_URL=https://api.example.com?foo=1&bar=2",
    "FEATURE_FLAG=1",
    "EMPTY=",
    "TEXT= space + percent% # Unicode café = ",
    "FEATURE_FLAG=2",
  ];
  const openUrl = "myapp://checkout?item=123&source=preview+test#details";
  const url = new URL(buildPreviewUrl("https://console.limrun.com/", "app", "ipad", {
    env: `\r\n${entries.join("\r\n")}\r\n   \r\n`,
    openUrl,
  }));
  assert.deepEqual(url.searchParams.getAll("env"), entries);
  assert.equal(url.searchParams.get("openUrl"), openUrl);
  assert.equal(url.searchParams.get("model"), "ipad");
  assert.equal(url.hash, "");
  assert.deepEqual([...url.searchParams.keys()], [
    "asset", "platform", "model", "env", "env", "env", "env", "env", "openUrl",
  ]);
});

test("supports open-url without env", () => {
  const url = new URL(buildPreviewUrl("https://console.limrun.com", "app", "iphone", {
    env: "\n \n",
    openUrl: "https://example.com/?next=a%2Fb",
  }));
  assert.deepEqual(url.searchParams.getAll("env"), []);
  assert.equal(url.searchParams.get("openUrl"), "https://example.com/?next=a%2Fb");
});

test("supports env without open-url", () => {
  const url = new URL(buildPreviewUrl("https://console.limrun.com", "app", "iphone", {
    env: "FEATURE_FLAG=1\nEMPTY=\n",
  }));
  assert.deepEqual(url.searchParams.getAll("env"), ["FEATURE_FLAG=1", "EMPTY="]);
  assert.equal(url.searchParams.has("openUrl"), false);
});
