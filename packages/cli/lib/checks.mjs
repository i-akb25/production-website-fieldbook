import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const manifests = [
  ["node","package.json"],
  ["python","pyproject.toml"],
  ["python","requirements.txt"],
  ["go","go.mod"],
  ["rust","Cargo.toml"],
  ["java","pom.xml"],
  ["java","build.gradle"],
  ["java","build.gradle.kts"],
  ["php","composer.json"],
  ["ruby","Gemfile"]
];

const lockfiles = [
  "package-lock.json","pnpm-lock.yaml","yarn.lock","bun.lock","bun.lockb",
  "uv.lock","poetry.lock","Pipfile.lock","Cargo.lock","go.sum",
  "composer.lock","Gemfile.lock","gradle.lockfile"
];

function readPackage(root) {
  const file=path.join(root,"package.json");
  if (!existsSync(file)) return null;
  try { return JSON.parse(readFileSync(file,"utf8")); } catch { return null; }
}

function filesIn(root, relative=".") {
  try { return readdirSync(path.join(root,relative)); } catch { return []; }
}

function hasAny(root, paths) {
  return paths.some(p=>existsSync(path.join(root,p)));
}

function packageScript(pkg, names) {
  if (!pkg?.scripts) return [];
  return names.filter(name=>typeof pkg.scripts[name]==="string" && pkg.scripts[name].trim());
}

function workflowFiles(root) {
  return filesIn(root,path.join(".github","workflows")).filter(n=>/\.ya?ml$/i.test(n));
}

function observation(id,title,status,details,interpretation) {
  return { id,title,status,details,interpretation };
}

export function inspectRepository(root) {
  const pkg=readPackage(root);
  const detectedManifests=manifests.filter(([,file])=>existsSync(path.join(root,file)));
  const ecosystems=[...new Set(detectedManifests.map(([ecosystem])=>ecosystem))];
  const locks=lockfiles.filter(file=>existsSync(path.join(root,file)));
  const workflows=workflowFiles(root);
  const testScripts=packageScript(pkg,["test","test:unit","test:integration","test:e2e"]);
  const buildScripts=packageScript(pkg,["build","compile"]);
  const lintScripts=packageScript(pkg,["lint","check"]);
  const typeScripts=packageScript(pkg,["typecheck","type-check","check:types"]);
  const rootNames=filesIn(root);
  const license=rootNames.find(n=>/^licen[cs]e(?:\.|$)/i.test(n));
  const releaseWorkflows=workflows.filter(n=>/(release|publish|deploy)/i.test(n));

  const observed=[
    observation("FB-REPO","Repository documentation",hasAny(root,["README.md","README"])?"observed":"not_observed",[], "Project documentation artifact."),
    observation("FB-IGNORE","Ignore rules",existsSync(path.join(root,".gitignore"))?"observed":"not_observed",[], "Repository ignore rules."),
    observation("FB-MANIFEST","Project manifest",detectedManifests.length?"observed":"not_observed",detectedManifests.map(([,f])=>f), "Recognized project manifests; framework-neutral applicability signal."),
    observation("FB-LOCK","Dependency lock or integrity file",locks.length?"observed":"not_observed",locks, "Lock/integrity files can support reproducible dependency resolution."),
    observation("FB-LOCK-CONSISTENCY","Multiple lock families",locks.length>1?"attention":"not_observed",locks, "Multiple lock/integrity files may be intentional in polyglot or monorepo projects; review package-manager ownership rather than treating this as a failure."),
    observation("FB-TEST","Automated test entry point",testScripts.length?"observed":"not_observed",testScripts, "Detected package test scripts only; other ecosystems may use different test entry points."),
    observation("FB-BUILD","Build entry point",buildScripts.length?"observed":"not_observed",buildScripts, "Detected package build/compile scripts."),
    observation("FB-LINT","Static-quality entry point",lintScripts.length?"observed":"not_observed",lintScripts, "Detected package lint/check scripts."),
    observation("FB-TYPECHECK","Type-check entry point",typeScripts.length?"observed":"not_observed",typeScripts, "Detected package type-check scripts."),
    observation("FB-CI","Continuous integration",workflows.length?"observed":"not_observed",workflows, "GitHub Actions workflow presence; execution success is not verified here."),
    observation("FB-RELEASE-AUTOMATION","Release/deploy workflow",releaseWorkflows.length?"observed":"not_observed",releaseWorkflows, "Workflow filename suggests release, publish, or deployment automation; behavior is not inferred."),
    observation("FB-LICENSE","License record",license?"observed":"not_observed",license?[license]:[], "Repository license artifact."),
    observation("FB-SECURITY-POLICY","Security reporting policy",hasAny(root,["SECURITY.md",".github/SECURITY.md"])?"observed":"not_observed",[], "Security reporting policy artifact."),
    observation("FB-OWNERSHIP","Code ownership",existsSync(path.join(root,".github","CODEOWNERS"))?"observed":"not_observed",[], "Repository ownership artifact."),
    observation("FB-DEPENDENCY-AUTOMATION","Dependency update automation",hasAny(root,[".github/dependabot.yml",".github/dependabot.yaml","renovate.json",".renovaterc",".renovaterc.json"])?"observed":"not_observed",[], "Dependency update automation configuration."),
    observation("FB-CHANGELOG","Change history",hasAny(root,["CHANGELOG.md","CHANGES.md","HISTORY.md"])?"observed":"not_observed",[], "Human-readable change-history artifact."),
    observation("FB-ENV-TEMPLATE","Environment variable template",hasAny(root,[".env.example",".env.sample",".env.template"])?"observed":"not_observed",[], "Non-secret environment-variable template artifact.")
  ];

  return { ecosystems, manifests:detectedManifests.map(([,f])=>f), observed };
}
