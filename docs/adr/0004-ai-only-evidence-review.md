# AI-only evidence review controls search eligibility

## Status
accepted

ArcadeBloom will not require human participation to decide whether a game page is eligible for search indexing. An automated browser agent must load and attempt to interact with the real game, combine that direct evidence with source and licence evidence, and assign eligibility only at high confidence; metadata-only assessment is insufficient, and uncertain entries remain browsable but `noindex`. This deliberately trades review throughput and recall for an autonomous pipeline whose editorial claims are grounded in observable evidence.
