#!/usr/bin/env node
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

for (const path of [
  "../dist/apps/blogs/api/index.js",
  "../dist/apps/blogs/api/index.d.ts",
  "../dist/apps/blogs/contracts/index.js",
  "../dist/apps/blogs/contracts/index.d.ts",
  "../dist/apps/blogs/web/index.js",
  "../dist/apps/blogs/web/index.d.ts",
  "../dist/apps/blogs/web/modules/editor/editor.css",
  "../dist/apps/blogs/web/modules/public-blog/public-blog.css",
]) {
  await access(new URL(path, import.meta.url));
}

assert.equal(packageJson.exports["./web"].import, "./dist/apps/blogs/web/index.js");
assert.equal(packageJson.scripts.prepare, undefined);
assert.deepEqual(packageJson.files, ["dist/", "LICENSE", "README.md"]);
console.log(`@codexsun/blog ${packageJson.version} package contents are ready.`);
