# Fieldbook command reference

This document describes the public Fieldbook CLI interface.

## Syntax

```text
fieldbook <command> [arguments] [options]
```

You can also use a package-manager runner:

```sh
npx fieldbook <command>
pnpm dlx fieldbook <command>
yarn dlx fieldbook <command>
bunx fieldbook <command>
```

## `fieldbook init`

Creates the local review record:

```text
.fieldbook/readiness.json
```

Example:

```sh
fieldbook init
```

Behavior:

- creates the `.fieldbook` directory when required
- initializes every manual review gate as `unreviewed`
- stores the Fieldbook version in the record
- refuses to overwrite an existing readiness record

Exit behavior:

- success: exit code 0
- record already exists: exit code 2

## `fieldbook check`

Inspects the current working directory for supported repository signals and displays all manual review gates.

```sh
fieldbook check
```

Machine-readable output:

```sh
fieldbook check --json
```

Automatic observations currently include:

- `FB-REPO` — repository documentation
- `FB-IGNORE` — ignore rules
- `FB-LOCK` — lockfile or integrity file
- `FB-TEST` — package.json test script
- `FB-CI` — GitHub Actions workflow
- `FB-LICENSE` — license record
- `FB-SECURITY-POLICY` — security reporting policy
- `FB-MANIFEST` — recognized project manifest
- `FB-LOCK-CONSISTENCY` — multiple lock/integrity families (attention state)
- `FB-BUILD` — build or compile script
- `FB-LINT` — lint or check script
- `FB-TYPECHECK` — type-check script
- `FB-RELEASE-AUTOMATION` — release/publish/deploy workflow
- `FB-OWNERSHIP` — CODEOWNERS
- `FB-DEPENDENCY-AUTOMATION` — Dependabot or Renovate configuration
- `FB-CHANGELOG` — change history
- `FB-ENV-TEMPLATE` — non-secret environment template

Possible automatic statuses:

- `observed`
- `not_observed`
- `attention`

These statuses are deliberately not named `passed` or `failed`. Fieldbook detects evidence artifacts; it does not prove their quality or correctness.

## `fieldbook review`

Updates one manual review gate.

Syntax:

```text
fieldbook review <ID> <approved|blocked|unreviewed> [--owner <text>] [--evidence <text>]
```

Example:

```sh
fieldbook review FB-A11Y approved --owner "frontend owner" --evidence "docs/accessibility-review.md"
```

Supported review IDs:

| ID | Meaning |
| --- | --- |
| `FB-ACCESS` | Authorization and access controls |
| `FB-PRIVACY` | Data inventory, consent and retention |
| `FB-SECURITY` | Threat model and security verification |
| `FB-A11Y` | Accessibility and keyboard evaluation |
| `FB-ROLLBACK` | Deployment rollback and recovery |
| `FB-LEGAL` | Legal and contractual review |
| `FB-PERF` | Performance and real-device testing |

Supported statuses:

- `approved`
- `blocked`
- `unreviewed`

Options:

### `--owner <text>`

Stores the owner responsible for the review.

### `--evidence <text>`

Stores an evidence reference. This can be a repository path, ticket ID, test artifact reference, or other non-sensitive evidence pointer.

Do not store secrets or sensitive production evidence directly in this field.

## `fieldbook codevet`

Consumes an existing CodeVet JSON report without running CodeVet itself.

```text
fieldbook codevet <report.json> [--attach] [--json]
```

CodeVet can generate the input with:

```sh
npx codevet scan --json codevet-report.json
```

Examples:

```sh
fieldbook codevet codevet-report.json
fieldbook codevet codevet-report.json --json
fieldbook codevet codevet-report.json --attach
```

Fieldbook normalizes:

- scanner coverage: `completed`, `skipped`, `failed`, or `not_applicable`
- finding counts by CodeVet category
- high/critical counts where CodeVet provides severity
- whether the evidence is incomplete

`--attach` writes only this normalized summary plus the report path into `.fieldbook/readiness.json`. It never copies raw CodeVet findings and never changes `FB-SECURITY` automatically.

## `fieldbook report`

Prints the current summary and manual review state.

```sh
fieldbook report
```

Machine-readable output:

```sh
fieldbook report --json
```

The summary includes:

- observed repository signals
- total automatic observations
- approved manual reviews
- blocked manual reviews
- unreviewed manual reviews
- total manual reviews

## `fieldbook doctor`

Prints local runtime diagnostics.

```sh
fieldbook doctor
```

Machine-readable output:

```sh
fieldbook doctor --json
```

Current diagnostics include:

- Fieldbook version
- Node.js version
- whether the Node.js major version is supported
- operating-system platform
- whether `.fieldbook/readiness.json` exists
- current workspace path

## `fieldbook --version`

Prints the installed Fieldbook version.

```sh
fieldbook --version
```

Aliases:

```sh
fieldbook -v
fieldbook version
```

## `fieldbook --help`

Prints the built-in command summary.

```sh
fieldbook --help
```

Aliases:

```sh
fieldbook -h
fieldbook help
```

## Exit codes

Fieldbook currently uses:

| Code | Meaning |
| ---: | --- |
| `0` | Command completed successfully |
| `2` | Invalid command, invalid input, unreadable JSON, duplicate initialization, or another user-correctable CLI error |

Fieldbook does not currently use exit status as a production-readiness gate.

## Data behavior

Fieldbook does not make network requests from the CLI.

The only persistent file it creates is:

```text
.fieldbook/readiness.json
```

The file remains under the user's control.

## Interpretation boundary

Fieldbook is an evidence and review-state tool. It does not independently certify:

- security
- privacy compliance
- accessibility compliance
- legal compliance
- operational resilience
- production readiness

Human owners remain responsible for the truth and adequacy of manual approvals.
