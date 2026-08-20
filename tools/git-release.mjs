#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const run = (args, quiet = false) => {
  const output = execFileSync("git", args, { encoding: "utf8", stdio: quiet ? "pipe" : "inherit" });
  return typeof output === "string" ? output.trim() : "";
};
if (run(["status", "--porcelain"], true)) throw new Error("Release requires a clean worktree.");
const version = JSON.parse(readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8")).version; const tag = `v-${version}`;
if (run(["tag", "--list", tag], true)) throw new Error(`${tag} already exists.`);
run(["tag", "-a", tag, "-m", `Release ${tag}`]); run(["push", "origin", "main"]); run(["push", "origin", tag]); console.log(`Released ${tag}.`);
