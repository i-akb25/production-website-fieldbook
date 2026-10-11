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
function cli(dir,...args) { return spawnSync(process.execPath,[executable,...args],{cwd:dir,encoding:"utf8"}); }
test("init creates a local review and never overwrites it",()=>sandbox(dir=>{
 const first=cli(dir,"init");
 assert.equal(first.status,0,first.stderr);
 const file=path.join(dir,".fieldbook/readiness.json");
 const before=readFileSync(file,"utf8");
 assert.equal(JSON.parse(before).reviews["FB-PRIVACY"].status,"unreviewed");
 const second=cli(dir,"init");
 assert.equal(second.status,2);
 assert.equal(readFileSync(file,"utf8"),before);
}));
test("check output is machine-readable and does not certify readiness",()=>sandbox(dir=>{
 writeFileSync(path.join(dir,"README.md"),"# Example\n");
 const result=cli(dir,"check","--json");
 assert.equal(result.status,0,result.stderr);
 const parsed=JSON.parse(result.stdout);
 assert.equal(parsed.advisory_only,true);
 assert.equal(parsed.checks.find(x=>x.id==="FB-REPO").status,"detected");
 assert.equal(parsed.manual.length,7);
 assert.equal(parsed.summary.approved,0);
}));
test("unknown command fails clearly",()=>sandbox(dir=>{
 assert.equal(cli(dir,"unknown").status,2);
}));
