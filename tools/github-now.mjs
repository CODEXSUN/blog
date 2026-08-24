#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { platform } from "node:os";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import {
  formatChangelogCommitSubject,
  readLatestVersionedChangelogEntry,
} from "./changelog.mjs";

const root = resolve(import.meta.dirname, "..");
function runGit(args, quiet = false) {
  try {
    const output = execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: quiet ? "pipe" : "inherit",
    });
    return typeof output === "string" ? output.trim() : "";
  } catch (error) {
    if (quiet) return "";
    throw error;
  }
}
function bumpVersion(title) {
  execFileSync(process.execPath, ["tools/version-bump.mjs", "patch", title], {
    cwd: root,
    stdio: "inherit",
  });
}
async function withPrompt(callback) {
  if (!process.stdin.isTTY && platform() === "win32")
    return callback(askWindowsModal);
  if (!process.stdin.isTTY)
    throw new Error("Interactive terminal input is required for github:now.");
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    return await callback(
      (question, fallback = "") =>
        new Promise((done) =>
          terminal.question(question, (answer) =>
            done(answer.trim() || fallback),
          ),
        ),
    );
  } finally {
    terminal.close();
  }
}
function askWindowsModal(question, fallback = "") {
  const confirmation = /\[y\/N\]:\s*$/iu.test(question);
  const script = confirmation
    ? [
        "Add-Type -AssemblyName System.Windows.Forms",
        `$result=[System.Windows.Forms.MessageBox]::Show(${quote(question.replace(/\s*\[y\/N\]:\s*$/iu, ""))},'GitHub Commit Review','YesNo','Question')`,
        "if($result -eq 'Yes'){'yes'}else{'no'}",
      ].join("; ")
    : [
        "Add-Type -AssemblyName Microsoft.VisualBasic",
        `[Microsoft.VisualBasic.Interaction]::InputBox(${quote(question)},'GitHub Commit Review',${quote(fallback)})`,
      ].join("; ");
  return execFileSync(
    "powershell.exe",
    ["-NoProfile", "-STA", "-Command", script],
    { encoding: "utf8", windowsHide: false },
  ).trim();
}
function quote(value) {
  return `'${value.replaceAll("'", "''")}'`;
}
function yes(value) {
  return ["y", "yes"].includes(value.trim().toLowerCase());
}
function review(entry, subject, fileCount) {
  return `\n  GitHub Commit Review\n  Version: ${entry.version}\n  Subject: ${subject}\n  Files: ${fileCount}\n`;
}
function changedFiles() {
  const status = runGit(["status", "--porcelain"], true);
  return status ? status.split(/\r?\n/u).filter(Boolean) : [];
}
function pullIfBehind() {
  const upstream = runGit(
    ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"],
    true,
  );
  if (!upstream)
    return console.log("\n  No upstream branch found. Skipping pull.\n");
  runGit([
    "-c",
    "maintenance.auto=false",
    "-c",
    "gc.auto=0",
    "fetch",
    "--quiet",
  ]);
  const behind = Number(
    runGit(["rev-list", "--count", `HEAD..${upstream}`], true) || 0,
  );
  if (!behind) return console.log("\n  Already up to date.\n");
  runGit([
    "-c",
    "maintenance.auto=false",
    "-c",
    "gc.auto=0",
    "pull",
    "--rebase",
    "--autostash",
  ]);
}
async function main() {
  let entry = readLatestVersionedChangelogEntry(root);
  let subject = formatChangelogCommitSubject(entry);
  const files = changedFiles();
  console.log(review(entry, subject, files.length));
  files.forEach((file) => console.log(`    ${file}`));
  if (process.argv.includes("--dry-run"))
    return console.log(
      "\n  Dry run only. No pull, commit, or push was performed.\n",
    );
  const message = await withPrompt(async (ask) => {
    if (yes(await ask("  Bump next version before commit? [y/N]: "))) {
      bumpVersion(
        await ask("  Version title [version update]: ", "version update"),
      );
      entry = readLatestVersionedChangelogEntry(root);
      subject = formatChangelogCommitSubject(entry);
      console.log(review(entry, subject, changedFiles().length));
    }
    const commitSubject = await ask(`  Commit message [${subject}]: `, subject);
    if (!yes(await ask("  Continue with pull, commit, and push? [y/N]: ")))
      throw new Error("Cancelled.");
    return commitSubject;
  });
  pullIfBehind();
  runGit(["add", "-A"]);
  runGit(["commit", "-m", message]);
  runGit(["push"]);
  console.log(`\n  Done - ${message}\n`);
}
main().catch((error) => {
  console.error(
    `\n  Error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
