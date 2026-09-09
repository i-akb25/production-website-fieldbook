import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputName = "CHECKSUMS.sha256";

async function filesUnder(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name.endsWith(".zip") || entry.name === outputName) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(absolute));
    else if (entry.isFile()) result.push(absolute);
  }
  return result;
}

function canonicalContent(content) {
  if (content.includes(0)) return content;

  const text = content.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(content)) return content;

  return Buffer.from(text.replace(/\r\n/g, "\n"), "utf8");
}

async function manifest() {
  const files = (await filesUnder(root)).sort((a, b) => a.localeCompare(b));
  const lines = [];
  for (const file of files) {
    const content = canonicalContent(await readFile(file));
    const digest = createHash("sha256").update(content).digest("hex");
    lines.push(`${digest}  ${path.relative(root, file).split(path.sep).join("/")}`);
  }
  return `${lines.join("\n")}\n`;
}

const mode = process.argv[2];
const expected = await manifest();

if (mode === "--write") {
  await writeFile(path.join(root, outputName), expected, "utf8");
  console.log(`Wrote ${outputName}`);
} else if (mode === "--verify") {
  const actual = await readFile(path.join(root, outputName), "utf8");
  if (actual !== expected) {
    console.error(`${outputName} does not match the repository contents. Run npm run checksums:write only for an approved release.`);
    process.exitCode = 1;
  } else {
    console.log(`${outputName} verified`);
  }
} else {
  console.error("Use --write or --verify");
  process.exitCode = 2;
}
