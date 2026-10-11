#!/usr/bin/env node
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { inspectRepository } from "../lib/checks.mjs";
import { readCodeVetReport } from "../lib/codevet.mjs";

const VERSION = "1.1.0";
const args = process.argv.slice(2);
const command = args[0] ?? "help";
const root = process.cwd();
const recordPath = path.join(root, ".fieldbook", "readiness.json");

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
  fieldbook codevet <report.json> [--attach] [--json]
  fieldbook doctor [--json]
  fieldbook --version

Fieldbook records evidence and review state locally. Automatic observations are not proof of correctness. Imported CodeVet evidence never approves a manual security review automatically.`);
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
    reviews: Object.fromEntries(reviewDefinitions.map(([id,title]) => [id,{ title, status:"unreviewed", evidence:"", owner:"" }])),
    integrations: {}
  };
}

function reviewRecord() {
  const record=existsSync(recordPath) ? safeReadJson(recordPath) : baseline();
  if (!record.integrations || typeof record.integrations!=="object") record.integrations={};
  return record;
}

function inspection() {
  const repository=inspectRepository(root);
  const record=reviewRecord();
  const manual=reviewDefinitions.map(([id,title])=>{
    const entry=record.reviews?.[id] ?? {};
    const status=["approved","blocked","unreviewed"].includes(entry.status)?entry.status:"unreviewed";
    return {id,title,status,owner:entry.owner??"",evidence:entry.evidence??""};
  });
  return {
    tool:"fieldbook",
    version:VERSION,
    advisory_only:true,
    ecosystems:repository.ecosystems,
    manifests:repository.manifests,
    observed:repository.observed,
    manual,
    integrations:record.integrations,
    summary:{
      observed:repository.observed.filter(x=>x.status==="observed").length,
      attention:repository.observed.filter(x=>x.status==="attention").length,
      not_observed:repository.observed.filter(x=>x.status==="not_observed").length,
      total_observations:repository.observed.length,
      approved_reviews:manual.filter(x=>x.status==="approved").length,
      blocked_reviews:manual.filter(x=>x.status==="blocked").length,
      unreviewed:manual.filter(x=>x.status==="unreviewed").length,
      total_reviews:manual.length
    }
  };
}

function optionValue(name) {
  const i=args.indexOf(name);
  return i>=0 && typeof args[i+1]==="string" ? args[i+1] : "";
}

function writeRecord(record) {
  mkdirSync(path.dirname(recordPath),{recursive:true});
  writeFileSync(recordPath,JSON.stringify(record,null,2)+"\n",{mode:0o600});
}

function printCheck(result) {
  if(result.ecosystems.length) console.log("[PROFILE] "+result.ecosystems.join(", "));
  for(const item of result.observed){
    const label=item.status==="observed"?"OBSERVED":item.status==="attention"?"ATTENTION":"NOT OBSERVED";
    const detail=item.details?.length?" ("+item.details.join(", ")+")":"";
    console.log("["+label+"] "+item.id+" "+item.title+detail);
  }
  for(const item of result.manual) console.log("[MANUAL "+item.status.toUpperCase()+"] "+item.id+" "+item.title);
  if(result.integrations?.codevet){
    const cv=result.integrations.codevet;
    console.log("[EVIDENCE CODEVET] "+cv.interpretation);
  }
  console.log("Observations are not pass/fail claims. Manual reviews remain human-owned.");
}

try {
  if(command==="help"||command==="-h"||command==="--help") help();
  else if(command==="--version"||command==="-v"||command==="version") console.log(VERSION);
  else if(command==="init"){
    if(existsSync(recordPath)){ console.error("Record already exists; refusing to overwrite: .fieldbook/readiness.json"); process.exitCode=2; }
    else { writeRecord(baseline()); console.log("Created .fieldbook/readiness.json. Review each manual gate and attach evidence before release."); }
  } else if(command==="check"){
    const result=inspection();
    if(args.includes("--json")) console.log(JSON.stringify(result,null,2));
    else printCheck(result);
  } else if(command==="report"){
    const result=inspection();
    console.log(args.includes("--json")?JSON.stringify(result,null,2):JSON.stringify({summary:result.summary,manual:result.manual,integrations:result.integrations},null,2));
  } else if(command==="review"){
    const id=args[1], status=args[2];
    if(!reviewDefinitions.some(([candidate])=>candidate===id)) throw new Error("Unknown review ID. Run fieldbook check to see available manual review IDs.");
    if(!["approved","blocked","unreviewed"].includes(status)) throw new Error("Review status must be approved, blocked, or unreviewed.");
    const record=reviewRecord();
    record.fieldbook_version=VERSION;
    record.reviews[id]={
      ...record.reviews[id],
      status,
      owner:optionValue("--owner")||record.reviews[id]?.owner||"",
      evidence:optionValue("--evidence")||record.reviews[id]?.evidence||""
    };
    writeRecord(record);
    console.log(id+" set to "+status+".");
  } else if(command==="codevet"){
    const reportArg=args[1];
    if(!reportArg) throw new Error("Usage: fieldbook codevet <report.json> [--attach] [--json]");
    const reportFile=path.resolve(root,reportArg);
    if(!existsSync(reportFile)) throw new Error("CodeVet report not found: "+reportArg);
    const evidence=readCodeVetReport(reportFile);
    if(args.includes("--attach")){
      const record=reviewRecord();
      record.fieldbook_version=VERSION;
      record.integrations.codevet={
        ...evidence,
        report_path:path.relative(root,reportFile).split(path.sep).join("/")||path.basename(reportFile)
      };
      writeRecord(record);
    }
    if(args.includes("--json")) console.log(JSON.stringify(evidence,null,2));
    else {
      console.log("CodeVet evidence:");
      console.log("  "+evidence.interpretation);
      console.log("  coverage: "+Object.entries(evidence.coverage).map(([k,v])=>k+"="+v).join(", "));
      console.log("  findings: "+Object.values(evidence.counts).reduce((a,b)=>a+b,0));
      console.log("  high-risk findings: "+Object.values(evidence.high_risk_counts).reduce((a,b)=>a+b,0));
      if(args.includes("--attach")) console.log("  attached summary to .fieldbook/readiness.json");
      console.log("CodeVet evidence does not approve FB-SECURITY automatically.");
    }
  } else if(command==="doctor"){
    const repository=inspectRepository(root);
    const data={
      fieldbook:VERSION,
      node:process.version,
      node_supported:Number(process.versions.node.split(".")[0])>=20,
      platform:process.platform,
      record_exists:existsSync(recordPath),
      workspace:root,
      ecosystems:repository.ecosystems,
      manifests:repository.manifests,
      codevet_evidence_attached:Boolean(reviewRecord().integrations?.codevet)
    };
    console.log(args.includes("--json")?JSON.stringify(data,null,2):Object.entries(data).map(([k,v])=>k+": "+(Array.isArray(v)?v.join(", "):v)).join("\n"));
  } else {
    console.error("Unknown command: "+command);
    help();
    process.exitCode=2;
  }
} catch(error){
  console.error("Fieldbook: "+error.message);
  process.exitCode=2;
}
