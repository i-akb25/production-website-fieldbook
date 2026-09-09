# Fictional control evidence map

This is an example structure, not proof that a real product passed review.

| Control | Applicability | Implementation | Test or evidence | Owner | Exception |
| --- | --- | --- | --- | --- | --- |
| CORE-00 | Applicable | Purpose and restrained read-only composition are recorded in `page-spec.json` | Human design review | fictional product owner | None |
| PAGE-01 | Applicable | Complete machine-readable page specification | Schema validation and state review | fictional route owner | None |
| PLH-01 | Applicable | No invented entries; missing content becomes an unavailable state | Placeholder scan and empty fixture | fictional content owner | None |
| SEC-14 | Applicable | Server validates content and allow-lists HTTPS sources | Invalid source and encoding tests | fictional security owner | None |
| FIX-08 | Applicable | Events go only to an isolated fictional sink | Production-endpoint denial test | fictional engineering owner | None |
| DATA-01 | Applicable | Event is listed in `data-inventory.json` | Inventory-schema and expiry tests | fictional data owner | None |
| PAY-01 | Not applicable | Product has no payment or entitlement behavior | Route and network review | fictional product owner | None |
| RT-14 | Not applicable | Product has no persistent connection | Architecture review | fictional engineering owner | None |
| AGENT-DEP | Applicable to implementation work | No package dependency is needed for the example | Manifest and lockfile review | fictional maintainer | None |

