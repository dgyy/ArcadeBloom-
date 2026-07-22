// =============================================================================
// collections.js — ArcadeBloom editorial Collections.
//
// A Collection is an evidence-led editorial list, NOT a keyword permutation
// or tag page. Each published Collection must satisfy the schema enforced by
// scripts/validate-collections.js (issue #17):
//
//   - slug        : kebab-case, unique, equals /collection/<slug>/
//   - title       : Title Case editorial title (not a keyword string)
//   - thesis      : one audience question or editorial thesis (the reason
//                   this list exists — not just "best X games")
//   - games       : 5–12 game slugs, each must be `eligible` in the review
//                   registry (evidence gate, ADR-0004/0006)
//   - comparisons : a distinct comparison for every included game (what makes
//                   THIS game worth picking over the others in the list)
//   - synthesis   : a paragraph that helps the reader choose
//   - evidenceRefs: evidence record paths for every factual claim
//   - canonicalUrl: unique canonical URL
//   - socialImage : unique social image path
//   - addedDate   : YYYY-MM-DD
//
// Validation rejects: keyword-permutation titles, near-duplicate game lists,
// card-only pages (no synthesis), and lists with <5 or >12 games.
//
// Collections publish only after enough `eligible` games exist to support a
// real thesis (no padding). As of 2026-07-22 no games are eligible yet, so
// this array is empty — the validator enforces the gate as eligibility grows.
// =============================================================================
'use strict';

module.exports = [
    // No Collections yet — the evidence pipeline (#7-#12) must promote games
    // to `eligible` before any Collection can pass validation. A fixture used
    // by tests lives in tests/fixtures/collections/ (not loaded here).
];
