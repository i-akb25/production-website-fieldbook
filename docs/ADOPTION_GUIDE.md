# Adoption guide

Use the companion repository as a control and evidence layer, not as a second application framework.

## 1. Define applicability

Copy `templates/control-applicability-matrix.md`. List the routes, data, providers, markets, environments, and release being reviewed. Mark a control not applicable only with a specific reason and owner.

## 2. Establish contracts before polish

Create page and component contracts before implementation becomes expensive to change. Complete states, server authority, responsive transformations, accessibility, failure, and recovery are part of the contract.

## 3. Attach evidence

Evidence must identify the exact code, configuration, release, environment, fixture, test command, result, and date. A screenshot alone rarely proves authorization, data handling, payment correctness, resilience, or accessibility.

## 4. Keep agents bounded

Install or merge `agent/AGENTS.md`, then complete the AI-agent task authorization for each material task. Agents must stop at missing authority, production data, legal facts, destructive actions, payment decisions, and unverified dependencies.

## 5. Review release blockers

Critical authorization failure, exposed secrets, payment correctness defects, fabricated claims, invalid consent, unrecoverable migration, absent rollback, or unisolated production data cannot be cleared by accumulating checklist points.

## 6. Validate and release

Run the validator, review the full diff, generate checksums only after approval, verify the archive, and record the exact book edition and repository version. Human owners make the final release decision.

