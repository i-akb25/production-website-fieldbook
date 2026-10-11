# Fieldbook CLI and website preview

## Scope

This is a non-breaking addition to the Edition 1.0 companion repository. The authoritative edition content, schemas and existing repository validation scripts remain unchanged.

- CLI: `packages/cli/`, a dependency-free Node.js package with `init`, `check`, `report` and `doctor`.
- Website: `website/index.html`, a static responsive informational website with `website/vercel.json` security headers.
- Neither is yet publicly published or deployed.

## Local verification

```sh
npm run validate
npm run checksums:verify
node --test packages/cli/test/*.test.mjs
node packages/cli/bin/fieldbook.mjs --help
```

Run `fieldbook init` in a disposable example project first. It creates a local review record at `.fieldbook/readiness.json`. Decide explicitly whether the record belongs under version control.

## Deployment

To deploy the static website using Vercel, import this repository as a project and set **Root Directory** to `website`. Choose **Other** as framework preset; no build command or environment variables are required. Verify headers, navigation, mobile layouts, links, accessibility and deployment rollback before connecting a custom domain.

## Publishing the CLI

This preview uses the proposed scoped npm name `@akb-studio/fieldbook`. Before public npm publication, confirm registry ownership, publication rights, license compatibility with the companion's existing LICENSES files, and user-facing documentation. Run the tests and publish from a reviewed tagged release. Never publish automatically on a pull request.

## Current limitations

The CLI detects only a small set of repository metadata signals. It does not execute the Edition 1 control catalog, validate CI results, prove security, assess legal compliance, or approve any production release. The manual statuses are user supplied, not independently verified. CodeVet integration remains optional and future work.
