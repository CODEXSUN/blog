import { readFile } from "node:fs/promises";
const root = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
for (const file of ["src/api/package.json", "src/web/package.json", "src/contracts/package.json"]) {
  const value = JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
  if (value.version !== root.version) throw new Error(`${file} is ${value.version}; expected ${root.version}`);
}
const changelog = await readFile(new URL("../assist/documentation/CHANGELOG.md", import.meta.url), "utf8");
if (!changelog.includes(`Current version: ${root.version}`) || !changelog.includes(`Release tag: v-${root.version}`)) {
  throw new Error(`Changelog version state does not match ${root.version}`);
}
const contracts = await readFile(new URL("../src/contracts/src/index.ts", import.meta.url), "utf8");
if (!contracts.includes(`BLOG_PACKAGE_VERSION = "${root.version}"`)) {
  throw new Error(`Blog plugin manifest version does not match ${root.version}`);
}
console.log(`All Blog package versions are ${root.version}`);
