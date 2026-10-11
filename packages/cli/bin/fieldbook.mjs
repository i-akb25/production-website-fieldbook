#!/usr/bin/env node
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const root = process.cwd();
const recordPath = path.join(root, ".fieldbook", "readiness.json");
const rules = [
  { id:"FB-REPO", title:"Repository documentation", evidence:"README.md", kind:"file", severity:"warning" },
  { id:"FB-IGNORE", title:"Local secret and artifact exclusions", evidence:".gitignore", kind:"file", severity:"warning" },
  { id:"FB-LOCK", title:"Reproducible dependency resolution", evidence:"lockfile", kind:"lock", severity:"warning" },
  { id:"FB-TEST", title:"Automated test command", evidence:"package.json scripts.test", kind:"test", severity:"warning" },
  { id:"FB-CI", title:"Continuous integration configured", evidence:".github/workflows", kind:"ci", severity:"warning" }
];
const reviews = [
  ["FB-ACCESS", "Authorization and access controls"],
  ["FB-PRIVACY", "Data inventory, consent and retention"],
  ["FB-SECURITY", "Threat model and security verification"],
  ["FB-A11Y", "Accessibility and keyboard evaluation"],
  ["FB-ROLLBACK", "Deployment rollback and recovery"],
  ["FB-LEGAL", "Legal and contractual review"],
  ["FB-PERF", "Performance and real-device testing"]
];
function help() {
  console.log("Fieldbook CLI 0.1.0\n\nUsage: fieldbook <init|check|report|doctor> [--json]\n\ninit: create a local review record without overwriting it\ncheck: inspect a handful of repository signals and show manual gates\nreport: print stored human review states (or --json)\ndoctor: display local runtime and record diagnostics\n\nChecks are advisory: they do not certify a production release.");
}
function safeReadJson(file) {
  try { return JSON.parse(readFileSync(file,"utf8")); }
  catch (error) { throw new Error("Cannot read valid JSON at " + file + ": " + error.message); }
}
function baseline() {
  return { schema_version:1, notice:"This review does not certify production readiness.", reviews:Object.fromEntries(reviews.map(([id,title])=>[id,{title,status:"unreviewed",evidence:"",owner:""}])) };
}
function reviewRecord() {
  return existsSync(recordPath) ? safeReadJson(recordPath) : baseline();
}
function checkRule(rule) {
  if (rule.kind === "file") return existsSync(path.join(root,rule.evidence));
  if (rule.kind === "lock") return ["package-lock.json","pnpm-lock.yaml","yarn.lock","bun.lock","bun.lockb","uv.lock","poetry.lock","Pipfile.lock"].some(f=>existsSync(path.join(root,f)));
  if (rule.kind === "ci") {
    const folder=path.join(root,".github","workflows");
    return existsSync(folder) && readdirSync(folder).some(n=>/\.ya?ml$/i.test(n));
  }
  if (rule.kind === "test") {
    const pkg=path.join(root,"package.json");
    if (!existsSync(pkg)) return false;
    const data=safeReadJson(pkg);
    return typeof data.scripts?.test==="string" && data.scripts.test.trim().length>0;
  }
  return false;
}
function inspection() {
  const checks=rules.map(r=>({id:r.id,title:r.title,status:checkRule(r)?"detected":"not_detected",severity:r.severity,evidence:r.evidence}));
  const record=reviewRecord();
  const manual=reviews.map(([id,title])=>{
    const entry=record.reviews?.[id] ?? {};
    return {id,title,status:["approved","blocked","unreviewed"].includes(entry.status)?entry.status:"unreviewed",owner:entry.owner ?? "",evidence:entry.evidence ?? ""};
  });
  return {tool:"fieldbook",version:"0.1.0",advisory_only:true,checks,manual,summary:{detected:checks.filter(c=>c.status==="detected").length,total_checks:checks.length,approved:manual.filter(c=>c.status==="approved").length,total_manual:manual.length}};
}
try {
  if (command==="help" || command==="-h" || command==="--help") help();
  else if (command==="init") {
    if (existsSync(recordPath)) { console.error("Record already exists; refusing to overwrite: .fieldbook/readiness.json"); process.exitCode=2; }
    else {
      mkdirSync(path.dirname(recordPath),{recursive:true});
      writeFileSync(recordPath,JSON.stringify(baseline(),null,2)+"\n",{flag:"wx",mode:0o600});
      console.log("Created .fieldbook/readiness.json. Complete reviews and attach verifiable evidence before a release.");
    }
  } else if (command==="check") {
    const result=inspection();
    if (args.includes("--json")) console.log(JSON.stringify(result,null,2));
    else {
      for (const check of result.checks) console.log((check.status==="detected"?"[FOUND] ":"[REVIEW] ")+check.id+" "+check.title);
      for (const review of result.manual) console.log("[MANUAL "+review.status.toUpperCase()+"] "+review.id+" "+review.title);
      console.log("Advisory signals only. No security, legal, or production-readiness certification.");
    }
  } else if (command==="report") {
    const result=inspection();
    if (args.includes("--json")) console.log(JSON.stringify(result,null,2));
    else console.log(JSON.stringify({summary:result.summary,manual:result.manual},null,2));
  } else if (command==="doctor") {
    const data={node:process.version,platform:process.platform,record_exists:existsSync(recordPath),workspace:root};
    console.log(args.includes("--json")?JSON.stringify(data,null,2):Object.entries(data).map(([k,v])=>k+": "+v).join("\n"));
  } else { console.error("Unknown command: "+command); help(); process.exitCode=2; }
} catch (error) { console.error("Fieldbook: "+error.message); process.exitCode=2; }
