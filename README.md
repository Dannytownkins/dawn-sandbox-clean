# Danliora Shopify Theme

## Setup

1. Install Shopify CLI: `npm install -g @shopify/cli @shopify/theme`
2. Authenticate: `shopify login --store=your-store-name`
3. Start local dev server: `shopify theme dev`
4. Use Cursor for development; run tests via `shopify theme check`

## Dev Toggles

- `⚡ Dev: Force products appear in stock (preview only)` – bypass sold-out checks.
- `⚡ Dev: Show all sections` – surfaces all sections in editor.

## Notes

- Large assets moved to Shopify CDN; see `.shopifyignore`.
- Sticky ATC, PDP upsell carousel, and hero video sections require relevant settings.
