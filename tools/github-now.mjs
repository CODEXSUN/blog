#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const runGit = (args, quiet = false) => {
  try {
    const output = execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: quiet ? "pipe" : "inherit" });
    return typeof output === "string" ? output.trim() : "";
  } catch (error) {
    if (quiet) return "";
    throw error;
  }
};
const ask = (question, fallback = "") => new Promise((done) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`${question}${fallback ? ` [${fallback}]` : ""}: `, (answer) => { rl.close(); done(answer.trim() || fallback); });
});
const yes = (value) => ["y", "yes"].includes(value.trim().toLowerCase());
const packagePath = resolve(root, "package.json");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const status = runGit(["status", "--porcelain"], true);
const files = status ? status.split("\n").filter(Boolean) : [];
console.log(`\n  Changelog version: ${packageJson.version}`);
console.log(`  Uncommitted files: ${files.length}`);
files.forEach((file) => console.log(`    ${file}`));
if (process.argv.includes("--dry-run")) { console.log("\n  Dry run only. No pull, commit, or push was performed.\n"); process.exit(0); }
const bump = await ask("  Bump next version before commit? [y/N]", "n");
let title = "Version update";
if (yes(bump)) {
  title = await ask("  Version title", "Version update");
  runGit(["add", "-A"]);
  runGit(["commit", "-m", `chore: prepare ${title}`]);
}
const latest = JSON.parse(readFileSync(packagePath, "utf8")).version;
const releaseNumber = Number(latest.split(".").at(-1));
const message = await ask("  Commit message", `#${releaseNumber} - ${title}`);
const confirmation = await ask("  Continue with pull, commit, and push? [y/N]", "n");
if (!yes(confirmation)) throw new Error("Cancelled.");
runGit(["fetch", "origin", "--prune"]);
const upstream = runGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], true);
if (upstream && Number(runGit(["rev-list", "--count", `HEAD..${upstream}`], true) || 0)) runGit(["pull", "--rebase", "--autostash"]);
runGit(["add", "-A"]);
runGit(["add", "--renormalize", "-A"]);
const staged = runGit(["diff", "--cached", "--name-only"], true);
if (staged) runGit(["commit", "-m", message]);
runGit(["push"]);
runGit(["push", "origin", "--tags"]);
console.log(`\n  Done - ${message}\n`);
