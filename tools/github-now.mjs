#!/usr/bin/env node
import { execFileSync } from "node:child_process";
const run = (args) => execFileSync("git", args, { stdio: "inherit" });
run(["fetch", "origin", "--prune"]); run(["push", "origin", "HEAD:main"]); run(["push", "origin", "--tags"]); console.log("GitHub is up to date.");
