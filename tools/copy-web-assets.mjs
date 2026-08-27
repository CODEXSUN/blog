#!/usr/bin/env node
import { cp, mkdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "node:fs/promises";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(root, "src/web/src");
const outputRoot = resolve(root, "dist/apps/blogs/web");

for await (const source of glob("**/*.css", { cwd: sourceRoot })) {
  const destination = resolve(outputRoot, relative(sourceRoot, resolve(sourceRoot, source)));
  await mkdir(dirname(destination), { recursive: true });
  await cp(resolve(sourceRoot, source), destination);
}

console.log("Blog web CSS assets copied.");
