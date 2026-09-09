# Reading entry component contract

**FICTIONAL EXAMPLE.**

## Identity

- Name and path: `ReadingEntry`, local to the fictional `/reading-list` route
- Owner: fictional content owner
- Status: example-ready, not production-approved
- Consumers: fictional reading-list page only

## Purpose and use

The component presents one reviewed title, short description, source name, content review date, and source link. It must not present ratings, prices, endorsements, availability, or claims that are absent from the approved content file.

## Anatomy and API

- Required: title, description, source label, review date, and HTTPS source URL
- Optional: compact category label from an allow-list
- Invalid: missing source, non-HTTPS URL, unreviewed content, nested interactive elements, or description presented as an endorsement
- Authority: the server-validated content entry is canonical; client state cannot replace it

## States

| State | Behavior | Recovery |
| --- | --- | --- |
| Default | Shows complete reviewed content | Open the named source |
| Long content | Wraps without truncating meaning | None required |
| Invalid source | Entry is excluded and a safe diagnostic is recorded | Content owner corrects the source |
| Offline | Existing page remains readable; external action explains connectivity failure | Retry when connected |
| Denied or rate-limited | No false success is shown | Wait or return later |

## Accessibility and responsive behavior

The item is a semantic list item. The source is a descriptive link with visible focus. Metadata follows the title in reading order. At narrow widths it moves below the description. At 400 percent zoom it reflows without a two-dimensional scroll area. No motion is required.

## Evidence

Required evidence includes schema validation, unsafe URL rejection, keyboard navigation, visible focus, long-title reflow, 320px rendering, 400 percent zoom, offline behavior, and a check that the initial view sends no third-party request.

