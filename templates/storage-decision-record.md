# Storage decision record

<!-- REQUIRED: Select storage by workload and evidence, not familiarity or trend. Product names are examples, not endorsements. -->

## Workload contract

- Canonical data and ownership: <!-- REQUIRED -->
- Read, write, query, transaction, and consistency requirements: <!-- REQUIRED -->
- Volume, growth, latency, availability, and durability targets: <!-- REQUIRED -->
- Data classification, purpose, region, access, recipients, retention, and deletion: <!-- REQUIRED -->
- Backup, restore, migration, corruption, portability, and exit requirements: <!-- REQUIRED -->
- Team operation capability and cost constraints: <!-- REQUIRED -->

## Candidate comparison

| Category and candidate | Good fit | Mismatch and risk | Security and privacy controls | Recovery evidence | Decision |
| --- | --- | --- | --- | --- | --- |
| Relational, such as PostgreSQL or MySQL | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> |
| Document, such as MongoDB | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> |
| Key-value or cache, such as Redis | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> |
| Object storage, such as S3-compatible storage | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> |
| Search or analytics store | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> |
| Client storage | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> | <!-- REQUIRED --> |

## Approval

- Selected system, provider, region, and version: <!-- REQUIRED -->
- Rejected candidates and reason: <!-- REQUIRED -->
- Benchmark, threat, cost, restore, and deletion evidence: <!-- REQUIRED -->
- Owner, reviewer, decision date, and review trigger: <!-- REQUIRED -->

