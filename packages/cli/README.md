# Fieldbook CLI (preview)

A small local-first companion to **The Production Website**, Edition 1.0.

## Try it from the repository

```sh
node packages/cli/bin/fieldbook.mjs init
node packages/cli/bin/fieldbook.mjs check
node packages/cli/bin/fieldbook.mjs report --json
node --test packages/cli/test/*.test.mjs
```

The CLI has no runtime dependencies and does not upload or transmit project data. The `init` command writes only `.fieldbook/readiness.json` and refuses to overwrite it. `check` detects five basic repository signals and exposes seven **manual** review gates. It does not run a penetration test, validate your legal compliance, or certify readiness.

To try a package install locally: `npm install ./packages/cli` followed by `npx fieldbook check`. The package is **not yet published on npm**. Package naming and licensing must be checked and approved before any publication.

The authoritative Edition 1 controls remain in the repository's `agent/controls.yaml`; this CLI preview does not claim full control coverage.
