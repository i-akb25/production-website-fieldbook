# Contributing

Contributions should make the fieldbook more precise, usable, or verifiable. Cosmetic churn, invented claims, personal case studies, and framework promotion do not belong in Edition 1.

## Change requirements

Every pull request must state:

1. the affected book section or stable control ID;
2. whether the change clarifies, strengthens, deprecates, or breaks the existing contract;
3. the implementation and validation evidence;
4. privacy, security, accessibility, payment, legal, and migration impact where relevant;
5. any compatibility consequence for existing templates or schemas.

Run `npm run validate` and include the exact result. Do not disable checks to obtain a passing result.

## Content rules

- Use plain, product-neutral language.
- Do not invent laws, standards, provider capabilities, commands, package versions, metrics, users, testimonials, incidents, or certifications.
- Use fictional examples that are unmistakably marked as fictional.
- Do not commit secrets, personal data, production data, payment credentials, private incident records, or copied proprietary material.
- Legal and policy templates are drafting worksheets, not publishable legal advice.

## Schema changes

Additive optional fields may be a compatible minor release. New required fields, changed meanings, removed values, or stricter validation are breaking unless the release includes a migration path and version change.

