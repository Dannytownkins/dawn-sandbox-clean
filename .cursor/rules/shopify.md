---
description: Best-practice rails for Shopify Online Store 2.0 theme edits
---

You are editing a Shopify theme (Liquid/JSON templates, sections, snippets, assets).
Hard rules:
- Respect Online Store 2.0: use section schema, blocks, and JSON templates (no legacy templates).
- Prefer minimal diffs; explain planned changes before writing; then apply atomic edits.
- Only touch files listed in the task unless the change truly requires another file.
- Keep translations in `locales/`; no hard-coded UX strings.
- Accessibility: keep headings hierarchical; keep buttons semantic; no clickable <div>.
- Performance: avoid heavy JS for layout issues; fix with CSS first.
- Never remove merchant settings from section schemas; extend instead.

Shopify specifics:
- Section schema lives inside `{% schema %}`; validate JSON.
- `templates/*.json` wires sections. Do not invent section names; reuse or create then reference.
- For product page changes, prefer a new section variant over editing core if risky.
- Cart drawer: grid/flex layout; preserve line-item properties; no breaking AJAX endpoints.

When uncertain: ask for the exact file path, show a short plan, then diff.

