#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const run = (args, quiet = false) => {
  const output = execFileSync("git", args, { encoding: "utf8", stdio: quiet ? "pipe" : "inherit" });
  return typeof output === "string" ? output.trim() : "";
};
const dryRun = process.argv.includes("--dry-run");
run(["fetch", "origin", "--prune"]);
const dirty = run(["status", "--porcelain"], true);
if (dryRun) { console.log(`GitHub dry run: ${dirty ? dirty.split("\n").length : 0} changed files.`); process.exit(0); }
if (dirty) {
  const version = JSON.parse(readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8")).version;
  const changelog = readFileSync(resolve(import.meta.dirname, "../assist/documentation/CHANGELOG.md"), "utf8");
  const numbers = [...changelog.matchAll(/###\s+#(\d+)\s+-/gu)].map((match) => Number(match[1]));
  const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1;
  run(["add", "-A"]); run(["commit", "-m", `#${nextNumber} - Blog updates`]);
}
run(["push", "origin", "HEAD:main"]); run(["push", "origin", "--tags"]); console.log("GitHub is up to date.");
