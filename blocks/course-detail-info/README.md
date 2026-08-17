# Course Detail Info Block

## Overview

Education-vertical content overlay authored alongside the shared `product-details` block on a course PDP. Renders instructor/cohort/format/prerequisite facts that a generic Commerce product page has no slot for. Has no Commerce/GraphQL dependency — pure content block, per the "vertical overlay around shared drop-ins" pattern in the architecture spec (§5.4).

## Authoring

Two-column table, label | value:

| | |
|---|---|
| Instructor | Dr. Jane Smith |
| Cohort Starts | Oct 6, 2026 |
| Duration | 6 weeks, 4 hrs/week |
| Format | Live online + self-paced |
| Prerequisites | None |

## Reuse in other verticals

The same label/value pattern works for other verticals' PDP-adjacent facts (e.g. hotel room "Check-in", "Check-out", "Max Occupancy"; fitness class "Instructor", "Capacity", "Studio Location") — copy this block, rename it, and change the authored rows. No JS changes needed.
