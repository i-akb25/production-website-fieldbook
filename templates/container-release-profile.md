# Container release profile

<!-- REQUIRED: Complete when containers are part of build, deployment, or an edge workload. A container is not automatically a security boundary. -->

| Area | Decision and evidence |
| --- | --- |
| Image | Approved minimal base, digest pin, reproducible build, vulnerability result, SBOM, provenance, signing decision: <!-- REQUIRED --> |
| Runtime identity | Non-root user, file permissions, read-only filesystem, temporary storage, dropped capabilities, privileged-mode prohibition: <!-- REQUIRED --> |
| Network and host | Ingress, egress, service identity, host mounts, device and hardware access, namespace and isolation boundary: <!-- REQUIRED --> |
| Resources | CPU, memory, process, storage, queue, bandwidth, restart, and workload limits: <!-- REQUIRED --> |
| Configuration and secrets | Environment configuration outside image, runtime secret source, rotation, redaction, and no build-log exposure: <!-- REQUIRED --> |
| Health | Startup, readiness, liveness, graceful shutdown, application-journey signal, and bounded restart policy: <!-- REQUIRED --> |
| State | External canonical state, volumes, backup, restore, migration, corruption, and replacement behavior: <!-- REQUIRED --> |
| Release | Same-image promotion, architecture compatibility, canary, thresholds, rollback by digest, obsolete image and credential removal: <!-- REQUIRED --> |

## Edge workload extension

- Representative hardware, operating system, architecture, and connectivity conditions: <!-- REQUIRED -->
- Bounded offline buffer, priority, overflow, expiry, replay, deduplication, and state authority: <!-- REQUIRED -->
- Minimum device, serial, file, network, and hardware access: <!-- REQUIRED -->
- Log rotation, storage quota, time synchronization, restart recovery, and remote health evidence: <!-- REQUIRED -->
- Known-good image and configuration, unreliable-connectivity update behavior, and rollback: <!-- REQUIRED -->

