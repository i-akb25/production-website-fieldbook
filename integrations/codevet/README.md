# CodeVet integration

Fieldbook can consume a **local CodeVet JSON report as optional release evidence**.

The integration is intentionally one-way and local:

1. CodeVet performs security scanning.
2. CodeVet writes its machine-readable JSON report.
3. Fieldbook reads that file and normalizes coverage and counts.
4. Fieldbook may attach the normalized summary to `.fieldbook/readiness.json`.

Example:

```sh
npx codevet scan --json codevet-report.json
npx fieldbook codevet codevet-report.json --attach
```

## Boundary

CodeVet and Fieldbook do not replace one another.

- **CodeVet** answers security-scanning questions: exposed secrets, known vulnerable dependencies, selected hygiene patterns, and personal-data-flow findings.
- **Fieldbook** answers release-evidence questions: which artifacts were observed, which manual gates remain unresolved, who owns a review, and what evidence was attached.

Fieldbook does **not** execute CodeVet automatically. This preserves Fieldbook's dependency-free, no-network CLI behavior and lets users choose when security scanning runs.

## Evidence semantics

Fieldbook preserves the distinction between:

- completed checks;
- skipped checks;
- failed checks;
- non-applicable checks;
- findings present;
- high/critical findings present where CodeVet provides severity;
- no findings reported by completed checks.

A CodeVet report with skipped or failed applicable checks is marked incomplete.

A report with no findings is **not** converted into a security guarantee.

Fieldbook never automatically changes `FB-SECURITY` to `approved`. Human review remains required.

## Data minimization

When `--attach` is used, Fieldbook stores only normalized counts, coverage state, interpretation, and the local report path. Raw findings are not copied into the readiness record. This avoids duplicating secret values or sensitive evidence.

The original CodeVet report remains under the user's control and should be handled according to the project's security policy.
