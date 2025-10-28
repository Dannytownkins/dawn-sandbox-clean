# Shopify Theme Conventions
- Use Dawn’s existing classes, markup, and section schema structure.
- For new sections:
  - Always include {% schema %} with presets so it’s addable in Customize.
  - Scope styles by section.id inside a <style> block.
- Keep CSS minimal; reuse Dawn’s utilities whenever possible.
- For labels, prefer translation keys in locales unless it’s section-specific.
