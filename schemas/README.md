# Schema contract

These schemas use JSON Schema Draft 2020-12. Schema version `1.0.0` implements book Edition `1.0`.

The bundled validator intentionally supports the keywords used by these files. Consuming projects may also validate them with a maintained Draft 2020-12 implementation after independently verifying the package and lockfile.

Compatibility rules:

- adding an optional field is normally backward-compatible;
- adding a required field, narrowing an enum, changing a field's meaning, or removing a field is breaking;
- examples must validate against the exact schemas committed in the same release;
- schema failures block release of this repository.

