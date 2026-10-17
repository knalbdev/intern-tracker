import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

// Exercise the server module without loading Next.js or real credentials.
function loadContent(fetch, env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
}) {
  const source = fs.readFileSync(path.join(testDirectory, "../lib/public-content.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const context = {
    exports: {},
    require: (name) => { assert.equal(name, "server-only"); return {}; },
    process: { env }, fetch, URL, URLSearchParams, AbortSignal,
    console: { error() {} },
  };
  vm.runInNewContext(compiled, context);
  return context.exports;
}

test("public queries select published content, omit operational fields, and cache for five minutes", async () => {
  const requests = [];
  const content = loadContent(async (url, options) => {
    requests.push({ url: new URL(url), options });
    return { ok: true, json: async () => [{ id: "published-content" }] };
  });
  const result = await content.getPublicContent();
  assert.equal(requests.length, 3);
  for (const { url, options } of requests) {
    assert.equal(url.searchParams.get("is_published"), "eq.true");
    assert.equal(options.headers.apikey, "test-publishable-key");
    assert.equal(options.next.revalidate, 300);
    assert.ok(options.signal);
    assert.ok(!url.searchParams.get("select").includes("spreadsheet_aliases"));
    assert.ok(!url.searchParams.get("select").includes("salary"));
  }
  assert.equal(result.sections.items.length, 1);
  assert.equal(result.companies.unavailable, false);
  const postsRequest = requests.find(({ url }) => url.pathname.endsWith("documentation_posts"));
  assert.ok(postsRequest.url.searchParams.get("select").includes("documentation_images("));
  assert.equal(postsRequest.url.searchParams.get("academic_year"), "eq.2026/2027");
});

test("failure in one table leaves other content available", async () => {
  const content = loadContent(async (url) => {
    if (url.pathname.endsWith("companies")) return { ok: false, status: 503 };
    return { ok: true, json: async () => [] };
  });
  const result = await content.getPublicContent();
  assert.equal(result.companies.unavailable, true);
  assert.equal(result.posts.unavailable, false);
  assert.equal(result.sections.unavailable, false);
});

test("missing configuration, network failure, and malformed response degrade safely", async () => {
  const missing = loadContent(() => { throw new Error("must not fetch"); }, {});
  const empty = await missing.getPublicContent();
  assert.equal(empty.sections.unavailable, true);
  const failed = loadContent(async () => { throw new Error("offline"); });
  assert.equal((await failed.getPublicContent()).posts.unavailable, true);
  const malformed = loadContent(async () => ({ ok: true, json: async () => ({ error: "unexpected" }) }));
  assert.equal((await malformed.getPublicContent()).companies.unavailable, true);
});

test("media URLs stay in the public bucket and reject external URLs or traversal", () => {
  const { publicMediaUrl } = loadContent(() => {});
  assert.equal(publicMediaUrl("companies/Logo baru.webp"), "https://example.supabase.co/storage/v1/object/public/site-media/companies/Logo%20baru.webp");
  for (const invalid of [null, "", "../secret.pdf", "a/../secret.pdf", "https://another.example/file.jpg", "/absolute.jpg", "a//file.jpg", "a/./file.jpg"]) {
    assert.equal(publicMediaUrl(invalid), null);
  }
  assert.equal(loadContent(() => {}, {}).publicMediaUrl("photo.webp"), null);
});
