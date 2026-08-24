import { readFileSync } from "node:fs";
import { join } from "node:path";

const changelogPath = join("assist", "documentation", "CHANGELOG.md");
export function readLatestVersionedChangelogEntry(root) {
  const content = readFileSync(join(root, changelogPath), "utf8");
  const match = content.match(
    /^### \[v\s+(\d+)\.(\d+)\.(\d+)\]\s+\d{4}-\d{2}-\d{2}(?:\s+(?:[1-9]|1[0-2]):[0-5]\d\s+(?:am|pm))?\s+-\s+(.+)$/mu,
  );
  if (!match)
    throw new Error(`Could not read the latest entry from ${changelogPath}.`);
  return {
    reference: Number(match[3]),
    title: match[4].trim(),
    version: `${match[1]}.${match[2]}.${match[3]}`,
  };
}
export function formatChangelogCommitSubject(entry) {
  return `#${entry.reference} - ${entry.title}`;
}
