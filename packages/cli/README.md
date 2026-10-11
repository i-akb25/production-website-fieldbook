# Fieldbook

A local-first CLI for recording production-readiness evidence and human review state.

Fieldbook inspects a small set of repository signals, creates a local review record, and keeps important release questions visible. It deliberately avoids pretending that the presence of a file or workflow proves security, privacy, accessibility, legal compliance, or production readiness.

## Install

```sh
npm install --global fieldbook
```

Or run without a global install:

```sh
npx fieldbook check
```

Requires Node.js 20 or newer.

## Quick start

```sh
fieldbook init
fieldbook check
fieldbook review FB-PRIVACY approved --owner "release owner" --evidence "docs/privacy-review.md"
fieldbook report
fieldbook doctor
```

`fieldbook init` creates `.fieldbook/readiness.json` and refuses to overwrite an existing record.

## Commands

### `fieldbook init`

Creates a local readiness record containing the manual review gates.

### `fieldbook check [--json]`

Reports repository **observations** such as whether documentation, ignore rules, a lockfile, a test script, CI workflow, license, or security policy can be detected. These are observations only, not pass/fail certification.

### `fieldbook review <ID> <status>`

Updates one human-owned review gate.

Statuses:

- `approved`
- `blocked`
- `unreviewed`

Optional metadata:

```sh
fieldbook review FB-A11Y approved \
  --owner "frontend owner" \
  --evidence "docs/accessibility-review.md"
```

### `fieldbook report [--json]`

Prints the current observation and manual-review summary.

### `fieldbook doctor [--json]`

Shows runtime diagnostics including the Fieldbook version, Node version, platform, workspace and whether a review record exists.

## Manual review gates

Fieldbook currently tracks:

- authorization and access controls
- data inventory, consent and retention
- threat model and security verification
- accessibility and keyboard evaluation
- deployment rollback and recovery
- legal and contractual review
- performance and real-device testing

These review states are entered by people. Fieldbook does not independently verify the truth of an `approved` status.

## Privacy

Fieldbook is local-first. The CLI has no runtime dependencies, no account system, no database, no telemetry, and no network calls. It reads repository metadata from the current working directory and writes only the local `.fieldbook/readiness.json` record when requested.

Do not place secrets, private production data, customer exports, or sensitive incident material in the review record.

## What Fieldbook does not claim

Fieldbook is not a vulnerability scanner, legal compliance engine, accessibility certification service, penetration-testing tool, or production approval authority. A detected file or a manually approved gate is evidence bookkeeping, not proof that the underlying implementation is correct.

For security scanning, use dedicated security tooling in addition to Fieldbook.

## Links

- Website: https://fieldbook-pro.vercel.app/
- Source: https://github.com/i-akb25/production-website-fieldbook
- Issues: https://github.com/i-akb25/production-website-fieldbook/issues
- Support: akbsupportinfo@gmail.com

## License

MIT © 2026 AKB Studio
