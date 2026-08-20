#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const files = ["package.json", "src/api/package.json", "src/web/package.json", "src/contracts/package.json"];
const current = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;
const parts = current.split(".").map(Number); const mode = process.argv[2] ?? "patch";
if (mode === "major") parts[0]++, parts[1] = 0, parts[2] = 0; else if (mode === "minor") parts[1]++, parts[2] = 0; else if (mode === "patch") parts[2]++; else if (/^\d+\.\d+\.\d+$/.test(mode)) parts.splice(0, 3, ...mode.split(".").map(Number)); else throw new Error("Use patch, minor, major, or x.y.z.");
const next = parts.join(".");
for (const file of files) { const path = resolve(root, file); const pkg = JSON.parse(readFileSync(path, "utf8")); pkg.version = next; writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`); }
const changelog = resolve(root, "assist/documentation/CHANGELOG.md"); let content = readFileSync(changelog, "utf8"); content = content.replace(/Current version: .*/u, `Current version: ${next}`).replace(/Release tag: .*/u, `Release tag: v-${next}`); const entry = `## v-${next}\n\n### [v ${next}] ${new Date().toISOString().slice(0, 10)} - Release update\n\n#### App Codebase Changes\n\n- Updated all Blog packages to ${next}.\n\n`; const marker = content.indexOf("## v-"); writeFileSync(changelog, marker < 0 ? `${content}\n${entry}` : `${content.slice(0, marker)}${entry}${content.slice(marker)}`);
console.log(`Blog version: ${current} -> ${next}`);
