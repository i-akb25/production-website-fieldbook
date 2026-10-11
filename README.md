[![Validate repository](https://github.com/i-akb25/production-website-fieldbook/actions/workflows/validate.yml/badge.svg)](https://github.com/i-akb25/production-website-fieldbook/actions/workflows/validate.yml)

# Fieldbook

Fieldbook is a local-first production-readiness toolkit for websites and software projects.

It combines a practical CLI with reusable controls, evidence templates, schemas, agent boundaries, and release records. The goal is not to produce a fake readiness score. The goal is to make release evidence, ownership, unresolved risk, and manual sign-off explicit.

Website: https://fieldbook-pro.vercel.app/

Support: akbsupportinfo@gmail.com

## CLI

The npm package name is:

```text
fieldbook
```

After publication:

```sh
npm install --global fieldbook
```

Or:

```sh
npx fieldbook check
```

Requires Node.js 20 or newer.

### Quick start

```sh
fieldbook init
fieldbook check
fieldbook review FB-PRIVACY approved --owner "release owner" --evidence "docs/privacy-review.md"
fieldbook report
fieldbook doctor
```

Fieldbook stores its manual review record at:

```text
.fieldbook/readiness.json
```

It refuses to overwrite an existing record during `init`.

## What the CLI observes

Fieldbook can detect repository signals such as:

- project documentation
- ignore rules
- dependency lockfiles or integrity files
- a package test script
- GitHub Actions workflows
- a repository license
- a security reporting policy

These are observations, not pass/fail claims. The presence of a file does not prove that the underlying implementation is correct.

## Human review gates

Fieldbook tracks explicit manual review state for:

- authorization and access controls
- privacy, data inventory, consent and retention
- threat modeling and security verification
- accessibility and keyboard behavior
- rollback and recovery
- legal and contractual review
- performance and real-device testing

A manually entered `approved` state is evidence bookkeeping only. Fieldbook does not independently certify the review.

## Repository structure

- `packages/cli/` — npm CLI package
- `agent/` — bounded coding-agent instructions and machine-readable controls
- `templates/` — operational review and evidence templates
- `schemas/` — JSON schemas for structured records
- `examples/fictional-reference-product/` — fictional example records
- `scripts/` — repository validation and checksum tooling
- `website/` — static Fieldbook website
- `integrations/codevet/` — documented optional security-tool boundary

## Privacy and security model

The Fieldbook CLI is local-first.

It has:

- no account requirement
- no database
- no telemetry
- no runtime dependencies
- no network calls from the CLI
- no automatic upload of repository content

Do not store secrets, production exports, customer data, credentials, or sensitive incident evidence inside `.fieldbook/readiness.json`.

## What Fieldbook does not do

Fieldbook is not:

- a vulnerability scanner
- a penetration-testing tool
- an accessibility certification service
- a legal compliance engine
- a privacy certification service
- a production approval authority

Use dedicated security, accessibility, legal, privacy, and operational review processes where required.

## Companion controls

The repository also contains the implementation material for **The Production Website, Edition 1.0**, published by AKB Studio.

The control language uses:

| Level | Meaning |
| --- | --- |
| `MUST` | Required when applicable unless the control explicitly permits an approved exception. |
| `SHOULD` | Expected default; deviations require a documented reason and owner. |
| `MAY` | Optional technique that does not replace applicable requirements. |

The repository validator checks structure and consistency only. It is not a production-readiness certification.

## Development

```sh
npm run validate
node --test packages/cli/test/*.test.mjs
npm run checksums:verify
```

## Documentation

- [Adoption guide](docs/ADOPTION_GUIDE.md)
- [Release process](docs/RELEASE_PROCESS.md)
- [Security policy](SECURITY.md)
- [Privacy](PRIVACY.md)
- [Legal disclaimer](LEGAL_DISCLAIMER.md)
- [Contributing](CONTRIBUTING.md)

## License

The CLI code is MIT licensed. Documentation licensing is described under `LICENSES/`.

© 2026 AKB Studio
