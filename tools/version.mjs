#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const changelogPath = resolve(root, "assist/documentation/CHANGELOG.md");
const packagePath = resolve(root, "package.json");
const [, , command = "show", ...args] = process.argv;
const value = (name, fallback) => { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1] ?? fallback; };
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
if (command === "show") { console.log(`CODEXSUN Blog version ${pkg.version}`); process.exit(0); }
const title = value("--title", "Release update"); const databaseUpdate = value("--database-update", "No");
if (command === "bump") { const explicit = value("--version", ""); const target = explicit || nextPatch(pkg.version); process.argv = [process.argv[0], process.argv[1], target, title]; await import("./version-bump.mjs"); process.exit(0); }
if (command !== "append") throw new Error("Use show, bump, or append.");
const stamp = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Calcutta", year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date()).replaceAll("/", "-").replace(",", "").replace("am", "am").replace("pm", "pm");
const entry = `### [v ${pkg.version}] ${stamp} - ${title}\n\n#### Database Changes\n\n- Database update: ${databaseUpdate}.\n\n#### App Codebase Changes\n\n- ${value("--note", "Updated Blog application code.")}\n\n`;
let changelog = readFileSync(changelogPath, "utf8"); const header = `## v-${pkg.version}`; const index = changelog.indexOf(header); changelog = index >= 0 ? `${changelog.slice(0, index + header.length)}\n\n${entry}${changelog.slice(index + header.length)}` : `${changelog}\n${header}\n\n${entry}`; writeFileSync(changelogPath, changelog); console.log(`Appended changelog entry under ${header}`);
function nextPatch(version) { const [major, minor, patch] = version.split(".").map(Number); return `${major}.${minor}.${patch + 1}`; }
