# Fieldbook

A local-first CLI for recording production-readiness evidence and human review state.

Fieldbook inspects a small set of repository signals, creates a local review record, and keeps important release questions visible. It deliberately avoids pretending that the presence of a file or workflow proves security, privacy, accessibility, legal compliance, or production readiness.

## Install

Fieldbook works with the major Node.js package managers. Node.js 20 or newer is required.

### npm

Global install:

```sh
npm install --global fieldbook
fieldbook --version
```

Run without installing globally:

```sh
npx fieldbook check
```

### pnpm

Global install:

```sh
pnpm add --global fieldbook
fieldbook --version
```

Run without installing globally:

```sh
pnpm dlx fieldbook check
```

### Yarn

Global install:

```sh
yarn global add fieldbook
fieldbook --version
```

For modern Yarn, run it temporarily with:

```sh
yarn dlx fieldbook check
```

### Bun

Global install:

```sh
bun add --global fieldbook
fieldbook --version
```

Run without installing globally:

```sh
bunx fieldbook check
```

## Quick start

```sh
fieldbook init
fieldbook check
fieldbook review FB-PRIVACY approved --owner "release owner" --evidence "docs/privacy-review.md"
fieldbook codevet codevet-report.json --attach
fieldbook report
fieldbook doctor
```

If you prefer not to install globally, replace `fieldbook` with your package manager runner, for example `npx fieldbook`, `pnpm dlx fieldbook`, `yarn dlx fieldbook`, or `bunx fieldbook`.

## Commands

The complete command reference is in [COMMANDS.md](COMMANDS.md).

### `fieldbook init`

Creates `.fieldbook/readiness.json` with all manual review gates in the `unreviewed` state. It refuses to overwrite an existing record.

### `fieldbook check [--json]`

Reports framework-neutral repository **observations** including recognized manifests/ecosystems, lock or integrity files, test/build/lint/typecheck entry points, CI and release workflows, license/security/ownership records, dependency-update automation, changelog presence, and environment templates.

These are observations only, not pass/fail certification.

### `fieldbook review <ID> <status>`

Updates one human-owned review gate.

Allowed statuses:

- `approved`
- `blocked`
- `unreviewed`

Optional metadata:

```sh
fieldbook review FB-A11Y approved \
  --owner "frontend owner" \
  --evidence "docs/accessibility-review.md"
```

### `fieldbook codevet <report.json> [--attach] [--json]`

Consumes the JSON file produced by CodeVet's `codevet scan --json <path>` command. Fieldbook stores only a normalized summary when `--attach` is used; it does not copy raw findings into the readiness record.

The imported evidence preserves skipped/failed coverage and finding counts. It **never** changes `FB-SECURITY` to `approved` automatically.

### `fieldbook report [--json]`

Prints the current observation and manual-review summary.

### `fieldbook doctor [--json]`

Shows runtime diagnostics including the Fieldbook version, Node version, supported-runtime status, platform, workspace, and whether a review record exists.

### `fieldbook --version`

Prints the installed Fieldbook version.

### `fieldbook --help`

Prints the built-in CLI help.

## Manual review gates

Fieldbook currently tracks:

| ID | Review |
| --- | --- |
| `FB-ACCESS` | Authorization and access controls |
| `FB-PRIVACY` | Data inventory, consent and retention |
| `FB-SECURITY` | Threat model and security verification |
| `FB-A11Y` | Accessibility and keyboard evaluation |
| `FB-ROLLBACK` | Deployment rollback and recovery |
| `FB-LEGAL` | Legal and contractual review |
| `FB-PERF` | Performance and real-device testing |

These review states are entered by people. Fieldbook does not independently verify the truth of an `approved` status.

## Repository observations

The CLI can observe:

| ID | Observation |
| --- | --- |
| `FB-REPO` | Repository documentation |
| `FB-IGNORE` | Ignore rules |
| `FB-LOCK` | Dependency lockfile or integrity file |
| `FB-TEST` | A package.json test script |
| `FB-CI` | GitHub Actions workflow |
| `FB-LICENSE` | Repository license record |
| `FB-SECURITY-POLICY` | Security reporting policy |
| `FB-MANIFEST` | Recognized ecosystem/project manifest |
| `FB-LOCK-CONSISTENCY` | Multiple lock families that may need review |
| `FB-BUILD` | Build/compile script |
| `FB-LINT` | Lint/check script |
| `FB-TYPECHECK` | Type-check script |
| `FB-RELEASE-AUTOMATION` | Release/deploy workflow |
| `FB-OWNERSHIP` | CODEOWNERS |
| `FB-DEPENDENCY-AUTOMATION` | Dependabot or Renovate config |
| `FB-CHANGELOG` | Change-history artifact |
| `FB-ENV-TEMPLATE` | Non-secret environment template |

An observed item means only that the corresponding artifact was found. It does not prove that the artifact is complete, correct, effective, or appropriate for the project.

## Privacy

Fieldbook is local-first. The CLI has no runtime dependencies, no account system, no database, no telemetry, and no network calls.

It reads repository metadata from the current working directory and writes only the local `.fieldbook/readiness.json` record when requested.

Do not place secrets, private production data, customer exports, credentials, or sensitive incident material in the review record.

## What Fieldbook does not claim

Fieldbook is not a vulnerability scanner, legal compliance engine, accessibility certification service, penetration-testing tool, privacy certification service, or production approval authority.

A detected file or a manually approved gate is evidence bookkeeping, not proof that the underlying implementation is correct.

For security scanning, use dedicated security tooling in addition to Fieldbook.

## Links

- Website: https://fieldbook-pro.vercel.app/
- Source: https://github.com/i-akb25/production-website-fieldbook
- Issues: https://github.com/i-akb25/production-website-fieldbook/issues
- Support: akbsupportinfo@gmail.com
- Full command reference: [COMMANDS.md](COMMANDS.md)

## License

MIT © 2026 AKB Studio

## Optional CodeVet evidence

Fieldbook and CodeVet have separate responsibilities. CodeVet scans for security findings; Fieldbook records release evidence and review state.

Generate a report with CodeVet:

```sh
npx codevet-cli scan --json codevet-report.json
```

Then inspect it with Fieldbook:

```sh
fieldbook codevet codevet-report.json
```

To attach only the normalized summary to `.fieldbook/readiness.json`:

```sh
fieldbook codevet codevet-report.json --attach
```

Fieldbook intentionally does not copy secret values or raw findings into its readiness record and does not auto-approve the security review.
