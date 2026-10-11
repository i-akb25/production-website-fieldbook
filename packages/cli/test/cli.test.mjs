import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const executable=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../bin/fieldbook.mjs");
function sandbox(run) {
  const dir=mkdtempSync(path.join(tmpdir(),"fieldbook-"));
  try { return run(dir); } finally { rmSync(dir,{recursive:true,force:true}); }
}
function cli(dir,...args) {
  return spawnSync(process.execPath,[executable,...args],{cwd:dir,encoding:"utf8"});
}

test("version is stable",()=>sandbox(dir=>{
  const result=cli(dir,"--version");
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.stdout.trim(),"1.1.0");
}));

test("init creates a local review and never overwrites it",()=>sandbox(dir=>{
  const first=cli(dir,"init");
  assert.equal(first.status,0,first.stderr);
  const file=path.join(dir,".fieldbook/readiness.json");
  const before=readFileSync(file,"utf8");
  const parsed=JSON.parse(before);
  assert.equal(parsed.fieldbook_version,"1.1.0");
  assert.equal(parsed.reviews["FB-PRIVACY"].status,"unreviewed");
  assert.deepEqual(parsed.integrations,{});
  const second=cli(dir,"init");
  assert.equal(second.status,2);
  assert.equal(readFileSync(file,"utf8"),before);
}));

test("check detects framework-neutral evidence without pass claims",()=>sandbox(dir=>{
  mkdirSync(path.join(dir,".github","workflows"),{recursive:true});
  writeFileSync(path.join(dir,"README.md"),"# Example\n");
  writeFileSync(path.join(dir,"package.json"),JSON.stringify({scripts:{test:"node --test",build:"node build.mjs",lint:"eslint .",typecheck:"tsc --noEmit"}}));
  writeFileSync(path.join(dir,"package-lock.json"),"{}\n");
  writeFileSync(path.join(dir,".github","workflows","validate.yml"),"name: Validate\n");
  const result=cli(dir,"check","--json");
  assert.equal(result.status,0,result.stderr);
  const parsed=JSON.parse(result.stdout);
  assert.equal(parsed.advisory_only,true);
  assert.ok(parsed.ecosystems.includes("node"));
  assert.equal(parsed.observed.find(x=>x.id==="FB-TEST").status,"observed");
  assert.equal(parsed.observed.find(x=>x.id==="FB-BUILD").status,"observed");
  assert.equal(parsed.manual.length,7);
  assert.equal(parsed.summary.approved_reviews,0);
}));

test("multiple lock families are attention, not failure",()=>sandbox(dir=>{
  writeFileSync(path.join(dir,"package.json"),"{}");
  writeFileSync(path.join(dir,"package-lock.json"),"{}");
  writeFileSync(path.join(dir,"pnpm-lock.yaml"),"lockfileVersion: 9\n");
  const result=cli(dir,"check","--json");
  assert.equal(result.status,0,result.stderr);
  const parsed=JSON.parse(result.stdout);
  assert.equal(parsed.observed.find(x=>x.id==="FB-LOCK-CONSISTENCY").status,"attention");
}));

test("review updates only a known manual gate",()=>sandbox(dir=>{
  assert.equal(cli(dir,"init").status,0);
  const result=cli(dir,"review","FB-A11Y","approved","--owner","frontend","--evidence","a11y-report.md");
  assert.equal(result.status,0,result.stderr);
  const record=JSON.parse(readFileSync(path.join(dir,".fieldbook/readiness.json"),"utf8"));
  assert.equal(record.reviews["FB-A11Y"].status,"approved");
  assert.equal(record.reviews["FB-A11Y"].owner,"frontend");
  assert.equal(record.reviews["FB-A11Y"].evidence,"a11y-report.md");
  assert.equal(cli(dir,"review","FB-UNKNOWN","approved").status,2);
}));

test("CodeVet JSON is normalized and attachment never auto-approves security",()=>sandbox(dir=>{
  assert.equal(cli(dir,"init").status,0);
  const report={
    secrets:[],
    dependencies:[{severity:"moderate"}],
    hygiene:[],
    dataFlow:[],
    pythonDependencies:[],
    pythonDependenciesApplicable:false
  };
  writeFileSync(path.join(dir,"codevet-report.json"),JSON.stringify(report));
  const result=cli(dir,"codevet","codevet-report.json","--attach","--json");
  assert.equal(result.status,0,result.stderr);
  const parsed=JSON.parse(result.stdout);
  assert.equal(parsed.findings_present,true);
  assert.equal(parsed.high_risk_findings_present,false);
  assert.equal(parsed.incomplete,false);
  const record=JSON.parse(readFileSync(path.join(dir,".fieldbook/readiness.json"),"utf8"));
  assert.equal(record.integrations.codevet.source,"codevet");
  assert.equal(record.reviews["FB-SECURITY"].status,"unreviewed");
}));

test("CodeVet incomplete coverage is preserved as incomplete evidence",()=>sandbox(dir=>{
  const report={
    secrets:[],
    dependencies:[],
    hygiene:[],
    dataFlow:[],
    pythonDependencies:[],
    dependenciesScanFailed:true,
    pythonDependenciesApplicable:false
  };
  writeFileSync(path.join(dir,"codevet-report.json"),JSON.stringify(report));
  const result=cli(dir,"codevet","codevet-report.json","--json");
  assert.equal(result.status,0,result.stderr);
  const parsed=JSON.parse(result.stdout);
  assert.equal(parsed.incomplete,true);
  assert.equal(parsed.coverage.dependencies,"failed");
}));

test("unknown command fails clearly",()=>sandbox(dir=>{
  assert.equal(cli(dir,"unknown").status,2);
}));

test("package exposes the fieldbook executable and runtime libraries",()=>{
  const packageJson=JSON.parse(readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../package.json"),"utf8"));
  assert.equal(packageJson.name,"fieldbook");
  assert.equal(packageJson.version,"1.1.0");
  assert.equal(packageJson.bin,"bin/fieldbook.mjs");
  assert.ok(packageJson.files.includes("lib"));
  assert.equal(existsSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../bin/fieldbook.mjs")),true);
  assert.equal(existsSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../lib/checks.mjs")),true);
  assert.equal(existsSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../lib/codevet.mjs")),true);
});
