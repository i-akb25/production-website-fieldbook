# CodeVet integration boundary

No CodeVet integration is implemented or claimed in this Edition 1 companion release.

A future integration may map verified CodeVet findings to stable control IDs, attach raw and normalized evidence, and distinguish these states explicitly:

- scan not run;
- partial scan;
- tool error;
- scan completed with no findings;
- findings present;
- policy pass after applicable review.

It must also use pinned and reviewed tool versions, least privilege, redacted logs, traceable suppressions, and reproducible evidence. CodeVet remains an orchestration and CLI layer around established scanners. It is not a substitute for engineering judgment, threat modelling, authorization testing, or penetration testing.

Do not add a package command, repository URL, scanner claim, output contract, or automated pass/fail mapping here until the integration exists and has been independently verified.

