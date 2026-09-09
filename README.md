[![Validate companion repository](https://github.com/i-akb25/production-website-fieldbook/actions/workflows/validate.yml/badge.svg)](https://github.com/i-akb25/production-website-fieldbook/actions/workflows/validate.yml)

# The Production Website Companion Repository

Practical adoption material for **The Production Website**, Edition 1.0, written by AKB and published by AKB Studio.

This repository turns the book's guidance into reusable records, machine-readable controls, validation scripts, and a safe fictional example. The PDF remains the editorial authority. This repository is the implementation layer.

## What is included

- `agent/`: bounded instructions and machine-readable controls for coding agents
- `templates/`: the 14 operational templates from Appendix A
- `schemas/`: JSON Schemas for controls, page specifications, and data inventory records
- `examples/fictional-reference-product/`: completed, explicitly fictional records
- `scripts/`: dependency-free release and validation tooling
- `integrations/codevet/`: a documented boundary for a future verified integration

Architecture Case Studies and personal-project examples are intentionally excluded from Edition 1.

## Start here

1. Read the book sections that apply to the work.
2. Copy only the templates the project needs. Do not fill every file for appearance.
3. Replace every `<!-- REQUIRED: ... -->` marker with approved project facts.
4. Put `agent/AGENTS.md` at the relevant repository root or merge its controls into the repository's existing agent instructions.
5. Map each applicable control to implementation, tests, evidence, owner, and any time-bounded exception.
6. Run validation before review:

   ```sh
   npm run validate
   ```

7. Run `npm run checksums:verify` before publishing an unchanged release archive.

The tooling has no runtime package dependencies. `agent/controls.yaml` deliberately uses the JSON-compatible subset of YAML, so the validator can parse it without installing a YAML package.

## Control language

| Level | Meaning |
| --- | --- |
| `MUST` | Required when the control is applicable. Failure blocks release unless the control explicitly permits an approved exception. |
| `SHOULD` | Expected default. A deviation needs a recorded reason, owner, evidence, and review date. |
| `MAY` | Optional technique. Using it does not replace applicable MUST or SHOULD controls. |

Control IDs are stable within an edition. A later release may clarify or strengthen a control without silently changing its meaning. Breaking changes require a new major repository version and an explicit compatibility note.

## Important boundaries

- This material does not certify legal, privacy, accessibility, security, payment, or contractual compliance.
- Do not use the fictional example as public legal text or production configuration.
- Never add secrets, real customer data, production exports, real payments, or private incident evidence.
- Security testing is limited to systems you own or are explicitly authorized to assess.
- Coding agents may propose and verify bounded changes. Humans retain authority for product truth, law, privacy, security, money, migrations, destructive actions, and production release.
- The book itself is not included here and remains subject to its own copyright notice.

## Release identity

- Repository version: `1.0.0`
- Implemented book edition: `1.0`
- Publisher: AKB Studio
- Status: Edition 1 companion release

See the [adoption guide](docs/ADOPTION_GUIDE.md), [release process](docs/RELEASE_PROCESS.md), [CHANGELOG.md](CHANGELOG.md), [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [PRIVACY.md](PRIVACY.md), and [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md).
