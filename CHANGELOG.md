# Changelog

All material changes are classified as `clarifies`, `strengthens`, `deprecates`, or `breaks` the previous contract.

## Fieldbook CLI 1.1.0 - 2026-10-11

- `strengthens`: Expands framework-neutral repository observations across Node.js, Python, Go, Rust, Java, PHP, and Ruby project manifests.
- `strengthens`: Adds build, lint, type-check, release-automation, ownership, dependency-update, changelog, environment-template, and lock-consistency observations.
- `strengthens`: Adds optional local CodeVet JSON evidence normalization without executing CodeVet or copying raw findings into Fieldbook records.
- `clarifies`: CodeVet evidence never auto-approves the human-owned `FB-SECURITY` review.
- `strengthens`: Replaces token-based npm automation with a Trusted Publishing/OIDC workflow and automatic provenance support.

The companion control catalog remains Edition 1.0; this is a CLI/tooling release, not a breaking control-edition change.


## 1.0.0 - 2026-09-08

Implements **The Production Website**, Edition 1.0.

- `clarifies`: Converts Appendix A into reusable Markdown templates.
- `clarifies`: Adds JSON Schemas for control, page-specification, and data-inventory records.
- `strengthens`: Adds a dependency-free validator, checksum tooling, and pinned continuous-integration actions.
- `strengthens`: Preserves Chapter 30 stop conditions, production-data isolation, prompt-injection resistance, and dependency/lockfile verification.
- `clarifies`: Provides one explicitly fictional reference product.
- `clarifies`: Documents the CodeVet integration boundary without claiming an implemented integration.

No controls are deprecated or broken in this release.

