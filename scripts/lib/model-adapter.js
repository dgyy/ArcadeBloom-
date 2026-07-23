// =============================================================================
// model-adapter.js — provider-neutral LLM adapter for evidence assessment.
//
// Backs issue #11. The model id is configurable (MODEL_ID env / default), not
// hardcoded, so the provider can be swapped without rewriting the assessment
// pipeline. The default provider is GitHub Models (rate-limited, paid usage
// disabled per ADR-0007 — owner keeps paid overage off in GitHub settings).
//
// Two responsibilities:
//   1. buildPrompt(evidence) — turn a #9-schema evidence record into a BOUNDED
//      prompt. Untrusted page content is stripped (the evidence bundle already
//      contains only structured fields; we re-strip here as defense in depth
//      and reject any instruction-like strings that slipped through).
//   2. assess(evidence) — call the model, parse the structured response, and
//      return { provider, model, confidence, decision, reasons }. The model's
//      decision is recorded but NEVER treated as the final gate — the #9
//      validator is the arbiter (ADR-0004).
// =============================================================================
'use strict';

const EVIDENCE_PROMPT_INJECTION = [
    // Patterns that indicate a page tried to inject instructions into the
    // assessment. If any survive into the evidence text we feed the model,
    // the assessment is refused and the item is held.
    /\bignore (all |any )?(previous |prior )?instructions\b/i,
    /\b(disregard|forget) (the |your )?(system|initial) prompt\b/i,
    /\byou are (now )?a\b/i,
    /\bnew instructions?:/i,
    /```system/i,
    /\bdo not (review|assess|fail)\b/i
];

// Strip any instruction-shaped text from a value before it reaches the model.
// Returns { clean, rejected }.
function sanitizeForModel(value) {
    const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
    const rejected = EVIDENCE_PROMPT_INJECTION.some((re) => re.test(text));
    return { clean: text, rejected };
}

// Build a bounded prompt from an evidence record. Only structured fields are
// sent — never raw page HTML (the capture script already omits it; this is
// the second layer of the trust boundary).
function buildPrompt(evidence) {
    // Defensive: re-sanitize every field we pass to the model.
    const fields = [
        evidence.slug, evidence.sourceKey,
        evidence.source && evidence.source.licence,
        evidence.browser && evidence.browser.loaded,
        evidence.browser && evidence.browser.consoleErrorCount,
        evidence.browser && evidence.browser.viewportResults,
        evidence.browser && evidence.browser.interactionAttempts
            && evidence.browser.interactionAttempts.length
    ];
    const rejected = fields.map(sanitizeForModel).some((r) => r.rejected);
    if (rejected) {
        return { rejected: true, prompt: null };
    }
    // The prompt is a fixed schema-question, not page-derived text.
    const prompt = `You are assessing a browser-game evidence bundle for ArcadeBloom.
Decide whether the evidence supports publishing a review. Return ONLY JSON:
{"decision":"pass|hold","confidence":0.0-1.0,"reasons":[...],"tags":[...3-5 from the controlled vocabulary...],"controls":[...3-6 short phrases...]}.

Evidence:
- slug: ${evidence.slug}
- licence: ${(evidence.source && evidence.source.licence) || 'unknown'}
- page loaded: ${evidence.browser && evidence.browser.loaded}
- console errors: ${evidence.browser && evidence.browser.consoleErrorCount}
- viewports rendered: ${JSON.stringify((evidence.browser && evidence.browser.viewportResults) || [])}
- interaction probes succeeded: ${(evidence.browser && evidence.browser.interactionAttempts || []).filter((i) => i.succeeded).length}

Your assessment decision is advisory only — an independent validator decides.`;
    return { rejected: false, prompt };
}

// Call the model via the configured provider. Returns the parsed assessment.
// Throws on rate limit (caller stops, leaves item queued — no retry storm).
async function assess(evidence, opts = {}) {
    const model = opts.model || process.env.MODEL_ID || 'openai/gpt-4o-mini';
    const token = process.env.GITHUB_TOKEN || process.env.MODELS_TOKEN;
    const { rejected, prompt } = buildPrompt(evidence);
    if (rejected) {
        return {
            provider: 'github-models', model,
            confidence: 0, decision: 'hold',
            reasons: ['prompt-injection detected in evidence — assessment refused']
        };
    }
    if (!token) {
        // No token = we cannot assess. Hold, do not fabricate. Never fall back
        // to metadata-only approval (issue #11 AC).
        return {
            provider: 'github-models', model,
            confidence: 0, decision: 'hold',
            reasons: ['no model token available — held for later run']
        };
    }

    const endpoint = 'https://models.inference.ai.azure.com/chat/completions';
    const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: 500
        })
    });

    if (resp.status === 429 || resp.status === 403) {
        // Rate limit / quota — stop, leave queued. Throw so the caller aborts.
        const err = new Error('model rate limit / quota exceeded (' + resp.status + ')');
        err.rateLimited = true;
        throw err;
    }
    if (!resp.ok) {
        throw new Error('model request failed: ' + resp.status);
    }

    const data = await resp.json();
    const content = data.choices && data.choices[0] && data.choices[0].message &&
        data.choices[0].message.content;
    let parsed = { decision: 'hold', confidence: 0, reasons: ['unparseable model response'], tags: [], controls: [] };
    try {
        // Extract the first JSON object from the response.
        const match = String(content).match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
    } catch { /* keep the hold default */ }

    return {
        provider: 'github-models', model,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
        decision: parsed.decision === 'pass' ? 'pass' : 'hold',  // never 'fail' as auto-reject
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons.slice(0, 8) : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
        controls: Array.isArray(parsed.controls) ? parsed.controls.slice(0, 6) : []
    };
}

module.exports = { assess, buildPrompt, sanitizeForModel };
