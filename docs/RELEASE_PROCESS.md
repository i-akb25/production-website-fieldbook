# Release process

## 1. Freeze scope

Record the target repository version and exact book edition. Classify every material change as `clarifies`, `strengthens`, `deprecates`, or `breaks` the previous contract.

For the npm CLI, choose a new immutable semantic version before publication.

## 2. Review content and controls

Confirm that stable control meanings match the book, blank templates contain no product-specific facts, examples are explicitly fictional, and no URL, package command, integration, law, standard, or capability is claimed without verification.

## 3. Validate

Run:

```sh
npm run validate
node --test packages/cli/test/*.test.mjs
cd packages/cli
npm pack --dry-run
```

Review the complete diff and package contents. Confirm there are no secrets, personal data, production records, unapproved legal text, or unexplained dependency changes.

## 4. Trusted npm publishing setup

The public npm package is `fieldbook`. GitHub Actions publishing uses npm Trusted Publishing/OIDC and must not depend on a reusable write token.

The configured identity is:

- GitHub owner: `i-akb25`
- repository: `production-website-fieldbook`
- workflow filename: `publish.yml`
- allowed action: direct `npm publish`

The package must already exist before creating the trust relationship.

### Configure from npmjs.com

Open the `fieldbook` package settings → **Trusted publishing** → GitHub Actions and enter the values above. Use only `publish.yml`, not the full `.github/workflows/publish.yml` path.

### Configure from the npm CLI

The `npm trust` command requires a sufficiently recent npm CLI (currently npm 11.15.0+). After interactive npm authentication and 2FA:

```sh
npm trust github fieldbook --file publish.yml --repo i-akb25/production-website-fieldbook --allow-publish
npm trust list fieldbook
```

Do not store npm write tokens in the repository.

After the first successful trusted publish, set npm package **Publishing access** to require 2FA and disallow traditional tokens if that matches the maintainer recovery plan.

## 5. Publish from GitHub Actions

From the repository's **Actions** tab, run **Publish Fieldbook to npm** from `main` and enter:

```text
publish-fieldbook
```

The workflow:

1. checks out reviewed source;
2. uses Node.js 24 on a GitHub-hosted runner;
3. confirms the npm CLI supports trusted publishing;
4. runs the CLI tests;
5. runs `npm pack --dry-run`;
6. refuses a version already present on npm;
7. executes `npm publish --access public` using OIDC.

Trusted publishing automatically generates npm provenance for this public package from this public repository.

## 6. Generate repository release evidence

For a repository release archive, run from the repository root:

```sh
npm run checksums:write
npm run checksums:verify
```

Commit the checksum change with the exact release contents. A later content change invalidates the checksum file and requires another review.

## 7. Tag and verify

Create the version tag from the exact reviewed commit after npm publication succeeds.

Verify:

```sh
npm view fieldbook version
npx fieldbook@latest --version
npx fieldbook@latest --help
```

## 8. Publish without overclaiming

Release notes must identify compatibility, known limitations, and any deprecated or breaking control.

A passing validator or successful Fieldbook check is evidence of repository state only. It is not a security, privacy, legal, accessibility, payment, operational, or production-readiness certification.
