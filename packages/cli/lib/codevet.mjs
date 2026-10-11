import { readFileSync } from "node:fs";

function array(value) { return Array.isArray(value) ? value : []; }
function highSeverity(items) {
  return array(items).filter(item=>["critical","high"].includes(String(item?.severity||"").toLowerCase())).length;
}

export function readCodeVetReport(file) {
  let report;
  try { report=JSON.parse(readFileSync(file,"utf8")); }
  catch (error) { throw new Error("Cannot read CodeVet JSON report: "+error.message); }

  const required=["secrets","dependencies","hygiene","dataFlow","pythonDependencies"];
  for(const key of required) {
    if (!Array.isArray(report[key])) throw new Error("CodeVet report is missing array field: "+key);
  }

  const coverage={
    secrets: report.secretsScanSkipped ? "skipped" : "completed",
    dependencies: report.dependenciesScanFailed ? "failed" : report.dependenciesScanSkipped ? "skipped" : "completed",
    hygiene: report.hygieneScanSkipped ? "skipped" : "completed",
    data_flow: report.dataFlowScanFailed ? "failed" : report.dataFlowScanSkipped ? "skipped" : "completed",
    python_dependencies: report.pythonDependenciesApplicable
      ? (report.pythonDependenciesFailed ? "failed" : report.pythonDependenciesUnavailableReason ? "skipped" : "completed")
      : "not_applicable"
  };

  const counts={
    secrets:report.secrets.length,
    dependencies:report.dependencies.length,
    hygiene:report.hygiene.length,
    data_flow:report.dataFlow.length,
    python_dependencies:report.pythonDependencies.length
  };
  const highRisk={
    secrets:report.secrets.length,
    dependencies:highSeverity(report.dependencies),
    hygiene:highSeverity(report.hygiene),
    data_flow:highSeverity(report.dataFlow)
  };
  const incomplete=Object.values(coverage).some(v=>v==="failed"||v==="skipped");
  const findings=Object.values(counts).reduce((a,b)=>a+b,0);
  const highRiskFindings=Object.values(highRisk).reduce((a,b)=>a+b,0);

  return {
    source:"codevet",
    contract:"codevet-scan-report",
    coverage,
    counts,
    high_risk_counts:highRisk,
    findings_present:findings>0,
    high_risk_findings_present:highRiskFindings>0,
    incomplete,
    interpretation: incomplete
      ? "CodeVet evidence is incomplete because one or more applicable checks were skipped or failed."
      : highRiskFindings>0
        ? "CodeVet reported one or more high-risk findings. Review the original report before release."
        : findings>0
          ? "CodeVet reported findings. Review the original report and its severity/context."
          : "CodeVet reported no findings in the completed checks. This is not a security guarantee."
  };
}
