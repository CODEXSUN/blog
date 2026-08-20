import { readFile } from "node:fs/promises";
const root = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
for (const file of ["apps/blogs/api/package.json", "apps/blogs/web/package.json", "packages/contracts/package.json"]) {
  const value = JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
  if (value.version !== root.version) throw new Error(`${file} is ${value.version}; expected ${root.version}`);
}
console.log(`All Blog package versions are ${root.version}`);
