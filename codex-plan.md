# Codex Plan – Launch Slice V1
## Goals
- Fix theme-check warnings (incl. OrphanedSnippet).
- Add sections: hero-min.liquid, usp-row.liquid; snippet: sticky-atc.liquid.
- Inject `{% render 'sticky-atc' %}` into sections/main-product.liquid directly above the `{% schema %}` block.
- Keep CSS additions under 12KB. No functional regressions.

## Tasks
1. Verify snippet path and reference; eliminate OrphanedSnippet.
2. Run Shopify Theme Check; autofix safe issues; list remaining.
3. Create a PR: `feat: launch slice v1 (hero, usp, sticky atc)` with concise commit history.
