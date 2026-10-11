import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
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
  assert.equal(result.stdout.trim(),"1.0.1");
}));

test("init creates a local review and never overwrites it",()=>sandbox(dir=>{
  const first=cli(dir,"init");
  assert.equal(first.status,0,first.stderr);
  const file=path.join(dir,".fieldbook/readiness.json");
  const before=readFileSync(file,"utf8");
  const parsed=JSON.parse(before);
  assert.equal(parsed.fieldbook_version,"1.0.1");
  assert.equal(parsed.reviews["FB-PRIVACY"].status,"unreviewed");
  const second=cli(dir,"init");
  assert.equal(second.status,2);
  assert.equal(readFileSync(file,"utf8"),before);
}));

test("check output uses observations rather than pass claims",()=>sandbox(dir=>{
  writeFileSync(path.join(dir,"README.md"),"# Example\n");
  const result=cli(dir,"check","--json");
  assert.equal(result.status,0,result.stderr);
  const parsed=JSON.parse(result.stdout);
  assert.equal(parsed.advisory_only,true);
  assert.equal(parsed.observed.find(x=>x.id==="FB-REPO").status,"observed");
  assert.equal(parsed.manual.length,7);
  assert.equal(parsed.summary.approved_reviews,0);
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

test("unknown command fails clearly",()=>sandbox(dir=>{
  assert.equal(cli(dir,"unknown").status,2);
}));
