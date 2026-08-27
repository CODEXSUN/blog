#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const releaseTag = process.env.GITHUB_REF_NAME?.trim();
const expectedTag = `v-${packageJson.version}`;

if (releaseTag !== expectedTag) {
  throw new Error(`Release tag ${releaseTag || "<missing>"} must match ${expectedTag}.`);
}

console.log(`Release tag ${releaseTag} matches the Blog package version.`);
