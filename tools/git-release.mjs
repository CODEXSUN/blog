#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const run = (args, quiet = false) => {
  const output = execFileSync("git", args, { encoding: "utf8", stdio: quiet ? "pipe" : "inherit" });
  return typeof output === "string" ? output.trim() : "";
};
const dirty = run(["status", "--short"], true);
if (dirty) {
  console.error("Release requires a clean worktree. Changed files:");
  console.error(dirty);
  console.error("Run npm run github:now, review the commit, then run npm run git:release again.");
  process.exit(1);
}
const version = JSON.parse(readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8")).version; const tag = `v-${version}`;
const changelog = readFileSync(resolve(import.meta.dirname, "../assist/documentation/CHANGELOG.md"), "utf8");
if (!changelog.includes(`Release tag: ${tag}`)) throw new Error(`Changelog release tag must be ${tag}.`);
if (!new RegExp(`^## ${tag}$`, "mu").test(changelog)) throw new Error(`Changelog entry must include ## ${tag}.`);
if (run(["tag", "--list", tag], true)) throw new Error(`${tag} already exists.`);
run(["tag", "-a", tag, "-m", `Release ${tag}`]); run(["push", "origin", "main"]); run(["push", "origin", tag]); console.log(`Released ${tag}.`);
