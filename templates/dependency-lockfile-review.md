# Dependency and lockfile review

<!-- REQUIRED: Complete for every added, removed, upgraded, downgraded, renamed, or source-changed dependency. Never guess a package or hand-edit integrity entries. -->

## Identity and need

| Gate | Evidence |
| --- | --- |
| Exact package, version, source, and registry | <!-- REQUIRED --> |
| Namespace, publisher or maintainer continuity, linked source, release history, deprecation, and takeover warnings | <!-- REQUIRED --> |
| License and policy compatibility | <!-- REQUIRED --> |
| Why existing platform or installed code cannot satisfy the need | <!-- REQUIRED --> |
| Runtime, operating system, architecture, peer, framework, and language compatibility | <!-- REQUIRED --> |

## Change integrity

- Approved package manager and exact command: <!-- REQUIRED -->
- Manifest diff and direct dependency reason: <!-- REQUIRED -->
- Complete lockfile graph, source URLs, integrity entries, transitive additions/removals, and unexpected changes: <!-- REQUIRED -->
- Install, post-install, download, build, and native-code behavior: <!-- REQUIRED -->
- Security advisories, provenance, signature, checksum, and license-scan result as applicable: <!-- REQUIRED -->

## Verification and rollback

- Clean isolated install using the committed frozen lockfile: <!-- REQUIRED -->
- Type, lint, build, unit, integration, security, license, and representative runtime results: <!-- REQUIRED -->
- Performance, bundle, platform, data, and operational impact: <!-- REQUIRED -->
- Isolated commit or change set, rollback command, and manifest/lockfile reversion: <!-- REQUIRED -->
- Human reviewer and approval date: <!-- REQUIRED -->

