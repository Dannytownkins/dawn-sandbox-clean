# Danliora Shopify Theme (Phase 2)

A high-conversion Shopify theme built on Dawn, featuring Light vs Dark product categories and modern UX enhancements.

## Setup

### 1. Install Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
```

### 2. Authenticate
```bash
shopify login --store=your-store-name
```

### 3. Create Collections & Products (Automated)
```bash
# Set up API credentials (one-time)
$env:SHOPIFY_STORE="yourstore.myshopify.com"
$env:SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"  # Get from Admin → Apps → Create custom app

# Run setup script
node setup_collections.js
```

This will automatically create:
- **Light Humor** collection (handle: `light-humor`)
- **Dark Humor** collection (handle: `dark-humor`)
- 4 sample products with proper tags and inventory settings

See [`SETUP_COLLECTIONS.md`](./SETUP_COLLECTIONS.md) for manual setup instructions.

### 4. Start local dev server
```bash
shopify theme dev
```

### 5. Run Theme Check
```bash
shopify theme check
```

## Features Added in Phase 2

### Homepage & Layout
- **Duo Hero Section** (`sections/duo-hero.liquid`) – Split Light vs Dark cards with asymmetric styling
- **Design System** (`assets/astra.css`) – Fluid type scale, button variants, and accessibility utilities
- **Sticky Header** with logo shrink-on-scroll effect

### Product Discovery
- **Product Badges** (`snippets/product-badges.liquid`) – Bestseller, New, and Sold Out tags
- **Quick Add** (`snippets/quick-add.liquid`) – One-click ATC for single-variant products
- **Predictive Search** (`snippets/predictive-search.liquid`) – Live product suggestions as you type
- **Tag Filter Pills** – Collection page tag filtering with active states

### Cart & Checkout
- **Free Shipping Progress Bar** (`snippets/cart-progress.liquid`) – Visual threshold tracker
- **Cart Settings** – Configurable free shipping threshold in Theme Settings

### Navigation
- **Mega Menu** (`snippets/mega-menu.liquid`) – Configurable multi-column navigation
- **Improved Mobile Navigation** – Touch-optimized drawer

### Accessibility & Performance
- Font preloading for critical typography
- Comprehensive `focus-visible` states for keyboard navigation
- `prefers-reduced-motion` support across animations
- Optimized `.shopifyignore` to keep theme package under 50MB

## Dev Toggles (Theme Settings)

- **⚡ Dev: Force products appear in stock** – Override availability checks for preview
- **⚡ Dev: Show all sections** – Surface all sections in theme editor

## Theme Settings

### Navigation
- **Mega Menu Handle** – Menu to use for mega menu content (default: `mega-menu`)
- **Mega Menu Trigger Text** – Top-level link that triggers mega menu (default: `Shop`)

### Cart & Checkout
- **Free Shipping Threshold** – Dollar amount required for free shipping (default: $50)

## Using the Duo Hero

1. Go to **Theme Customization** → Homepage
2. Add the **Duo Hero** section
3. Configure:
   - **Light Card**: Heading, text, CTA, optional image
   - **Dark Card**: Heading, text, CTA, optional image
4. Set collection links for each CTA

## Heavy Media Best Practices

- Large assets (videos, high-res images) should be uploaded to **Content → Files** in Shopify Admin
- Reference them in Liquid using `{{ 'filename.ext' | file_url }}`
- See `.shopifyignore` for excluded file patterns

## File Structure

```
assets/
  astra.css                    # Design system tokens
sections/
  duo-hero.liquid              # Light vs Dark hero
  main-collection-product-grid.liquid  # Enhanced with tag pills
  header.liquid                # Predictive search integration
snippets/
  product-badges.liquid        # Product tags
  quick-add.liquid             # Fast ATC
  cart-progress.liquid         # Free shipping bar
  predictive-search.liquid     # Search dropdown
  mega-menu.liquid             # Multi-column nav
```

## Commit History (Phase 2)

1. `feat(home): add duo-hero section (Light vs Dark)`
2. `chore(css): add type scale + button variants`
3. `feat(pdp+plp): product badges (new/bestseller/oos)`
4. `feat(plp): quick-add for single-variant products`
5. `feat(cart): free-shipping progress bar + setting`
6. `feat(search): lightweight predictive search dropdown`
7. `feat(nav): mega-menu with configurable handle`
8. `feat(collection): tag pills, per-page size, badges + quick-add`
9. `a11y+perf: preloads, reduced-motion guard, focus states`
10. `perf: migrate heavy assets to Shopify CDN + tighten .shopifyignore`

## QA Checklist

- [ ] Duo hero loads with balanced weight; CTAs link properly
- [ ] Predictive search shows 6 items with thumbnails; closes on outside click/escape
- [ ] Cart drawer shows progress bar and updates as qty changes
- [ ] Collection pills filter visually; badges show on cards
- [ ] Quick-add works for single-variant products
- [ ] Lighthouse mobile ≥ 90; no console errors
- [ ] Focus states visible for all interactive elements
- [ ] Reduced motion respected in animations
