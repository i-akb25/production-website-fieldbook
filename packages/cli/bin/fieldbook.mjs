#!/usr/bin/env node
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const VERSION = "1.0.1";
const args = process.argv.slice(2);
const command = args[0] ?? "help";
const root = process.cwd();
const recordPath = path.join(root, ".fieldbook", "readiness.json");

const signals = [
  { id:"FB-REPO", title:"Repository documentation", kind:"fileAny", paths:["README.md","README"], note:"Project documentation detected." },
  { id:"FB-IGNORE", title:"Ignore rules", kind:"fileAny", paths:[".gitignore"], note:"Ignore rules detected." },
  { id:"FB-LOCK", title:"Dependency lockfile", kind:"fileAny", paths:["package-lock.json","pnpm-lock.yaml","yarn.lock","bun.lock","bun.lockb","uv.lock","poetry.lock","Pipfile.lock","Cargo.lock","go.sum"], note:"A lock or integrity file was detected." },
  { id:"FB-TEST", title:"Automated test command", kind:"packageScript", script:"test", note:"A package.json test script was detected." },
  { id:"FB-CI", title:"Continuous integration", kind:"workflow", note:"At least one GitHub Actions workflow was detected." },
  { id:"FB-LICENSE", title:"License record", kind:"filePattern", pattern:/^licen[cs]e(?:\.|$)/i, note:"A repository license file was detected." },
  { id:"FB-SECURITY-POLICY", title:"Security reporting policy", kind:"fileAny", paths:["SECURITY.md",".github/SECURITY.md"], note:"A security policy was detected." }
];

const reviewDefinitions = [
  ["FB-ACCESS", "Authorization and access controls"],
  ["FB-PRIVACY", "Data inventory, consent and retention"],
  ["FB-SECURITY", "Threat model and security verification"],
  ["FB-A11Y", "Accessibility and keyboard evaluation"],
  ["FB-ROLLBACK", "Deployment rollback and recovery"],
  ["FB-LEGAL", "Legal and contractual review"],
  ["FB-PERF", "Performance and real-device testing"]
];

function help() {
  console.log(`Fieldbook ${VERSION}

Usage:
  fieldbook init
  fieldbook check [--json]
  fieldbook report [--json]
  fieldbook review <ID> <approved|blocked|unreviewed> [--owner <text>] [--evidence <text>]
  fieldbook doctor [--json]
  fieldbook --version

Fieldbook records evidence and review state locally. Detected repository signals are observations, not proof of correctness. Fieldbook does not certify security, privacy, accessibility, legal compliance, or production readiness.`);
}

function safeReadJson(file) {
  try { return JSON.parse(readFileSync(file, "utf8")); }
  catch (error) { throw new Error("Cannot read valid JSON at " + file + ": " + error.message); }
}

function baseline() {
  return {
    schema_version: 1,
    fieldbook_version: VERSION,
    notice: "This record is evidence bookkeeping, not a production-readiness certification.",
    reviews: Object.fromEntries(reviewDefinitions.map(([id,title]) => [id,{ title, status:"unreviewed", evidence:"", owner:"" }]))
  };
}

function reviewRecord() {
  return existsSync(recordPath) ? safeReadJson(recordPath) : baseline();
}

function rootFiles() {
  try { return readdirSync(root); } catch { return []; }
}

function detectSignal(signal) {
  if (signal.kind === "fileAny") return signal.paths.some(p => existsSync(path.join(root,p)));
  if (signal.kind === "filePattern") return rootFiles().some(name => signal.pattern.test(name));
  if (signal.kind === "workflow") {
    const folder = path.join(root, ".github", "workflows");
    return existsSync(folder) && readdirSync(folder).some(name => /\.ya?ml$/i.test(name));
  }
  if (signal.kind === "packageScript") {
    const file = path.join(root,"package.json");
    if (!existsSync(file)) return false;
    const data = safeReadJson(file);
    return typeof data.scripts?.[signal.script] === "string" && data.scripts[signal.script].trim().length > 0;
  }
  return false;
}

function inspection() {
  const observed = signals.map(signal => ({
    id: signal.id,
    title: signal.title,
    status: detectSignal(signal) ? "observed" : "not_observed",
    interpretation: detectSignal(signal) ? signal.note : "Not detected automatically. This may be acceptable depending on project scope."
  }));
  const record = reviewRecord();
  const manual = reviewDefinitions.map(([id,title]) => {
    const entry = record.reviews?.[id] ?? {};
    const status = ["approved","blocked","unreviewed"].includes(entry.status) ? entry.status : "unreviewed";
    return { id, title, status, owner:entry.owner ?? "", evidence:entry.evidence ?? "" };
  });
  return {
    tool:"fieldbook",
    version:VERSION,
    advisory_only:true,
    observed,
    manual,
    summary:{
      observed: observed.filter(x => x.status === "observed").length,
      total_observations: observed.length,
      approved_reviews: manual.filter(x => x.status === "approved").length,
      blocked_reviews: manual.filter(x => x.status === "blocked").length,
      unreviewed: manual.filter(x => x.status === "unreviewed").length,
      total_reviews: manual.length
    }
  };
}

function optionValue(name) {
  const i = args.indexOf(name);
  return i >= 0 && typeof args[i+1] === "string" ? args[i+1] : "";
}

function writeRecord(record) {
  mkdirSync(path.dirname(recordPath), { recursive:true });
  writeFileSync(recordPath, JSON.stringify(record,null,2)+"\n", { mode:0o600 });
}

try {
  if (command === "help" || command === "-h" || command === "--help") help();
  else if (command === "--version" || command === "-v" || command === "version") console.log(VERSION);
  else if (command === "init") {
    if (existsSync(recordPath)) {
      console.error("Record already exists; refusing to overwrite: .fieldbook/readiness.json");
      process.exitCode = 2;
    } else {
      writeRecord(baseline());
      console.log("Created .fieldbook/readiness.json. Review each manual gate and attach evidence before release.");
    }
  } else if (command === "check") {
    const result = inspection();
    if (args.includes("--json")) console.log(JSON.stringify(result,null,2));
    else {
      for (const item of result.observed) console.log((item.status === "observed" ? "[OBSERVED] " : "[NOT OBSERVED] ") + item.id + " " + item.title);
      for (const item of result.manual) console.log("[MANUAL " + item.status.toUpperCase() + "] " + item.id + " " + item.title);
      console.log("Observations are not pass/fail claims. Manual reviews remain human-owned.");
    }
  } else if (command === "report") {
    const result = inspection();
    console.log(args.includes("--json") ? JSON.stringify(result,null,2) : JSON.stringify({summary:result.summary,manual:result.manual},null,2));
  } else if (command === "review") {
    const id = args[1];
    const status = args[2];
    const validId = reviewDefinitions.some(([candidate]) => candidate === id);
    if (!validId) throw new Error("Unknown review ID. Run fieldbook check to see available manual review IDs.");
    if (!["approved","blocked","unreviewed"].includes(status)) throw new Error("Review status must be approved, blocked, or unreviewed.");
    const record = reviewRecord();
    record.reviews[id] = {
      ...record.reviews[id],
      status,
      owner: optionValue("--owner") || record.reviews[id]?.owner || "",
      evidence: optionValue("--evidence") || record.reviews[id]?.evidence || ""
    };
    writeRecord(record);
    console.log(id + " set to " + status + ".");
  } else if (command === "doctor") {
    const data = {
      fieldbook: VERSION,
      node: process.version,
      node_supported: Number(process.versions.node.split(".")[0]) >= 20,
      platform: process.platform,
      record_exists: existsSync(recordPath),
      workspace: root
    };
    console.log(args.includes("--json") ? JSON.stringify(data,null,2) : Object.entries(data).map(([k,v]) => k + ": " + v).join("\n"));
  } else {
    console.error("Unknown command: " + command);
    help();
    process.exitCode = 2;
  }
} catch (error) {
  console.error("Fieldbook: " + error.message);
  process.exitCode = 2;
}
