import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

const requiredFiles = [
  "README.md", "VERSION", "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md", "PRIVACY.md", "LEGAL_DISCLAIMER.md", "REFERENCES.md", "RELEASE_MANIFEST.json",
  "LICENSES/CODE_LICENSE.txt", "LICENSES/DOCUMENTATION_LICENSE.md",
  "agent/AGENTS.md", "agent/agent-policy.md", "agent/controls.yaml",
  "schemas/control.schema.json", "schemas/page-spec.schema.json", "schemas/data-inventory.schema.json",
  "templates/component-contract.md", "templates/page-specification.md", "templates/placeholder-register.md", "templates/responsive-qa-matrix.md", "templates/release-sign-off.md", "templates/data-inventory.md", "templates/privacy-notice-drafting.md", "templates/terms-refund-contact-drafting.md", "templates/cookie-tracker-vendor-registers.md", "templates/ai-agent-task-authorization.md", "templates/threat-model.md", "templates/bug-root-cause.md", "templates/incident-timeline.md", "templates/release-exception.md", "templates/launch-checklist.md", "templates/control-applicability-matrix.md", "templates/persistent-connection-review.md", "templates/container-release-profile.md", "templates/storage-decision-record.md", "templates/dependency-lockfile-review.md",
  "docs/ADOPTION_GUIDE.md", "docs/RELEASE_PROCESS.md",
  "examples/fictional-reference-product/README.md", "examples/fictional-reference-product/page-spec.json", "examples/fictional-reference-product/data-inventory.json", "examples/fictional-reference-product/component-contract.md", "examples/fictional-reference-product/control-evidence.md",
  "integrations/codevet/README.md", "CHECKSUMS.sha256"
];

function fail(message) {
  failures.push(message);
}

async function text(relative) {
  return readFile(path.join(root, relative), "utf8");
}

async function json(relative) {
  try {
    return JSON.parse(await text(relative));
  } catch (error) {
    fail(`${relative}: invalid JSON-compatible data: ${error.message}`);
    return null;
  }
}

function typeMatches(type, value) {
  if (type === "array") return Array.isArray(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
}

function validateSchema(schema, value, location) {
  if (schema.type && !typeMatches(schema.type, value)) {
    fail(`${location}: expected ${schema.type}`);
    return;
  }
  if (Object.hasOwn(schema, "const") && value !== schema.const) fail(`${location}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) fail(`${location}: value is outside the allowed enum`);
  if (typeof value === "string") {
    if (schema.minLength && value.length < schema.minLength) fail(`${location}: string is shorter than ${schema.minLength}`);
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) fail(`${location}: does not match ${schema.pattern}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) fail(`${location}: requires at least ${schema.minItems} items`);
    if (schema.items) value.forEach((item, index) => validateSchema(schema.items, item, `${location}[${index}]`));
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) fail(`${location}: missing required property ${key}`);
    for (const [key, child] of Object.entries(schema.properties ?? {})) if (Object.hasOwn(value, key)) validateSchema(child, value[key], `${location}.${key}`);
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const key of Object.keys(value)) if (!allowed.has(key)) fail(`${location}: unexpected property ${key}`);
    }
  }
}

function capturedSchemaIssues(schema, value, location) {
  const start = failures.length;
  validateSchema(schema, value, location);
  return failures.splice(start);
}

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name.endsWith(".zip")) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(absolute));
    else if (entry.isFile()) result.push(absolute);
  }
  return result;
}

for (const relative of requiredFiles) {
  try { await access(path.join(root, relative)); } catch { fail(`Missing required file: ${relative}`); }
}

const version = (await text("VERSION")).trim();
const packageFile = await json("package.json");
const release = await json("RELEASE_MANIFEST.json");
const controlSchema = await json("schemas/control.schema.json");
const pageSchema = await json("schemas/page-spec.schema.json");
const dataSchema = await json("schemas/data-inventory.schema.json");
const controls = await json("agent/controls.yaml");
const examplePage = await json("examples/fictional-reference-product/page-spec.json");
const exampleData = await json("examples/fictional-reference-product/data-inventory.json");

if (packageFile && packageFile.version !== version) fail("package.json version does not match VERSION");
if (release && release.repository_version !== version) fail("RELEASE_MANIFEST.json version does not match VERSION");
if (controls && controls.repository_version !== version) fail("agent/controls.yaml version does not match VERSION");
if (release && controls && release.book_edition !== controls.book_edition) fail("Book edition differs between release manifest and controls");

if (controlSchema && controls) validateSchema(controlSchema, controls, "agent/controls.yaml");
if (pageSchema && examplePage) validateSchema(pageSchema, examplePage, "example page spec");
if (dataSchema && exampleData) validateSchema(dataSchema, exampleData, "example data inventory");

if (controlSchema && controls) {
  const invalid = structuredClone(controls);
  delete invalid.controls[0].id;
  if (capturedSchemaIssues(controlSchema, invalid, "negative control fixture").length === 0) fail("Control schema negative test accepted a missing required ID");
}
if (pageSchema && examplePage) {
  const invalid = structuredClone(examplePage);
  delete invalid.route;
  if (capturedSchemaIssues(pageSchema, invalid, "negative page fixture").length === 0) fail("Page schema negative test accepted a missing route");
}
if (dataSchema && exampleData) {
  const invalid = structuredClone(exampleData);
  delete invalid.records[0].retention;
  if (capturedSchemaIssues(dataSchema, invalid, "negative data fixture").length === 0) fail("Data schema negative test accepted a missing retention rule");
}

if (controls) {
  const ids = controls.controls.map((control) => control.id);
  if (new Set(ids).size !== ids.length) fail("Control IDs must be unique");
}
if (examplePage && examplePage.fictional !== true) fail("Example page specification must be explicitly fictional");
if (exampleData && exampleData.fictional !== true) fail("Example data inventory must be explicitly fictional");

const templateFiles = requiredFiles.filter((name) => name.startsWith("templates/") && name !== "templates/README.md");
for (const relative of templateFiles) {
  const value = await text(relative);
  if (!value.includes("<!-- REQUIRED:")) fail(`${relative}: missing REQUIRED marker guidance`);
}

const allFiles = await walk(root);
for (const absolute of allFiles.filter((file) => file.endsWith(".md"))) {
  const relative = path.relative(root, absolute).split(path.sep).join("/");
  const value = await readFile(absolute, "utf8");
  for (const match of value.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().split("#", 1)[0];
    if (!target || /^(https:\/\/|mailto:)/.test(target)) continue;
    if (/^[a-z]+:/i.test(target)) { fail(`${relative}: unsupported link scheme in ${target}`); continue; }
    try { await access(path.resolve(path.dirname(absolute), target)); } catch { fail(`${relative}: broken relative link ${target}`); }
  }
}

const secretPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:password|secret|token)\s*[=:]\s*["'][^"']{8,}["']/i
];
for (const absolute of allFiles.filter((file) => !file.includes(`${path.sep}scripts${path.sep}`))) {
  const value = await readFile(absolute, "utf8");
  for (const pattern of secretPatterns) if (pattern.test(value)) fail(`${path.relative(root, absolute)}: possible committed secret`);
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${requiredFiles.length} required files, ${controls.controls.length} controls, 3 positive schema fixtures, 3 rejected negative fixtures, and 1 fictional reference product.`);
}
