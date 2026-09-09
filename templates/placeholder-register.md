# Placeholder register

<!-- REQUIRED: Every deliberate placeholder must be mechanically discoverable. -->

Allowed status values: `open`, `approved-local-only`, `resolved`, `release-blocking`.

| ID | Route or component | Type | Visible marker or query | Reason | Approved source | Owner | Ticket | Status | Blocks release |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PLH-001 | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | release-blocking | yes |

## Release rule

Fake testimonials, users, metrics, policies, payment success, production fixtures, completed integrations, or security claims block release. Skeleton states and clearly marked local-only fixtures may remain only when excluded from production output and covered by a test.

