# Release process

## 1. Freeze scope

Record the target repository version and exact book edition. Classify every material change as `clarifies`, `strengthens`, `deprecates`, or `breaks` the previous contract.

## 2. Review content and controls

Confirm that stable control meanings match the book, blank templates contain no product-specific facts, examples are explicitly fictional, and no URL, package command, integration, law, standard, or capability is claimed without verification.

## 3. Validate

Run:

```sh
npm run validate
```

Review the complete diff. Confirm there are no secrets, personal data, production records, unapproved legal text, or unexplained dependency changes.

## 4. Generate release evidence

Only after approval, run:

```sh
npm run checksums:write
npm run checksums:verify
```

Commit the checksum change with the exact release contents. A later content change invalidates the checksum file and requires another review.

## 5. Tag and archive

Create a signed or otherwise protected version tag where the hosting platform supports it. Build the archive from that exact reviewed source state. Verify the archive contents, checksum file, version, changelog, licenses, and release manifest before publication.

## 6. Publish without overclaiming

Release notes must identify the book edition, compatibility, known limitations, and any deprecated or breaking control. A passing validator is evidence of repository consistency only. It is not a security, privacy, legal, accessibility, or payment certification.

