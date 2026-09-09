# Master launch checklist

<!-- REQUIRED: Mark applicable items only after recording current evidence for the exact release. -->

## Strategy and truth

- [ ] Design thesis, audience, product job, evidence, constraints, non-goals, and no-go list are approved.
- [ ] Page and journey inventories are complete; every route has an owner and meaningful success condition.
- [ ] Public claims, logos, testimonials, metrics, prices, availability, and security statements have current evidence and permission.

## Visual and responsive

- [ ] Tokens are semantic and documented; typography, color, spacing, imagery, icons, elevation, and motion form one recognizable system.
- [ ] Core routes pass 320px, landscape, large desktop, 200/400% zoom, long locale, RTL where applicable, safe areas, pointer types, and virtual keyboard.
- [ ] No accidental overflow, unstable layout, illegible measure, obscured focus or action, or desktop-only interaction remains.

## Components and placeholders

- [ ] Components have purpose, anatomy, finite variants, complete states, accessibility, responsive and content rules, tests, owner, and misuse guidance.
- [ ] All placeholders are registered. Fake content, mock success, production fixtures, and unresolved integrations are blocked.
- [ ] Loading, empty, error, stale, offline, permission, rate-limited, and partial states explain status and recovery without false confirmation.

## Accessibility

- [ ] The WCAG 2.2 AA engineering target is tested with automated checks plus keyboard, screen reader, zoom/reflow, forced colors, and reduced motion.
- [ ] Forms, navigation, dialogs, tables, dynamic status, media, authentication, and errors pass representative assistive-technology journeys.

## Engineering and security

- [ ] Server/client boundary, data authority, APIs, errors, idempotency, concurrency, jobs, uploads, and tenant isolation are specified and tested.
- [ ] Threat model, authorization matrix, validation and encoding, browser controls, secrets, dependency supply chain, logging, redaction, and incident response are current.
- [ ] Development and test fixtures use synthetic or specifically approved data and are technically isolated from production databases, buckets, queues, credentials, analytics, and external side effects.
- [ ] No critical finding, exposed secret, broken authorization, unsafe migration, absent backup restore, or unowned alert remains.

## Performance and testing

- [ ] Route budgets, Core Web Vitals, API latency, availability, and capacity are measured on representative conditions with owners and rollback thresholds.
- [ ] Static, unit, component, integration, contract, end-to-end, visual, accessibility, security, performance, and resilience tests cover applicable risk and negative paths.
- [ ] Bugs record impact, reproduction, evidence, root cause, detection gap, fix, regression, rollout or rollback, production verification, and prevention.

## Privacy, legal, and payments

- [ ] Data inventory, purposes and grounds, notices, consent or opt-out, rights, retention and deletion, vendors, transfers, breach, and high-risk processing match reality.
- [ ] Applicable trust pages are accurate, versioned, readable, linked, and backed by monitored support, grievance, privacy, billing, and security routes.
- [ ] Payment amount and state are server-authoritative; webhooks are authenticated; effects are idempotent; refunds and settlement reconcile; PCI and market rules were revalidated.

## AI agents and operations

- [ ] Agent tasks are bounded by repository, tools, network, data, and credentials; forbidden actions and human approvals are explicit; diffs and tests were independently reviewed.
- [ ] Every dependency and lockfile change passed identity, source, compatibility, integrity, install-script, clean-install, test, scan, and rollback review.
- [ ] Deployment is progressive; flags and migrations have cleanup and rollback; observability is privacy-safe; runbooks and incident roles were exercised.

## Final evidence

- Release or commit: <!-- REQUIRED -->
- Evidence index: <!-- REQUIRED -->
- Exceptions and expiry: <!-- REQUIRED -->
- Final human owner and UTC decision: <!-- REQUIRED -->

