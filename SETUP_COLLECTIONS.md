# Collection & Product Setup Guide

## 🎯 Quick Setup Checklist

### 1. Create Collections

#### Light Humor Collection
1. Navigate to **Products → Collections → Create collection**
2. Settings:
   - **Title:** `Light Humor`
   - **Handle:** `light-humor` (auto-generated)
   - **Description:** `Sarcastic optimism for sunnier days`
3. Collection type: **Automated**
4. Conditions: `Product tag` **is equal to** `light`
5. Click **Save**

#### Dark Humor Collection
1. Navigate to **Products → Collections → Create collection**
2. Settings:
   - **Title:** `Dark Humor`
   - **Handle:** `dark-humor` (auto-generated)
   - **Description:** `Pitch-black jokes, midnight cotton`
3. Collection type: **Automated**
4. Conditions: `Product tag` **is equal to** `dark`
5. Click **Save**

---

### 2. Tag & Add Products

#### For Each Product:
1. Go to **Products → [Select Product]**
2. In the **Tags** field, add either:
   - `light` (for Light Humor collection)
   - `dark` (for Dark Humor collection)
3. Ensure **Product availability:**
   - Channel: ✅ **Online Store** is checked
4. **Inventory settings:**
   - Option A: Set `Track quantity` = **OFF** (unlimited stock)
   - Option B: Set quantity to `> 0` (e.g., 100)
5. Click **Save**

> **Tip:** Add at least 2-3 products to each collection for carousel/grid testing

---

### 3. Theme Settings (Customize)

1. Navigate to **Online Store → Themes → Customize**
2. Open **Theme settings** (⚙️ icon in left sidebar)

#### Developer Settings
- Go to **Astra Dev** section
- Toggle **ON**: ✅ `Dev: Force products appear in stock (preview only)`
- This ensures ATC buttons show even if inventory = 0

#### Navigation Settings
- Ensure **Cart icon** is visible in header
- Check **Mini-cart drawer** is enabled (if available)

#### Brand Settings (optional)
- **Primary brand color:** `#eded6b` (yellow)
- **Secondary brand color:** `#0b0b0c` (dark)

3. Click **Save** in top-right

---

### 4. Verify Homepage

1. In the Customize editor, navigate to **Home page**
2. Ensure the **Duo Hero** section shows:
   - "Shop Light" button → links to `/collections/light-humor`
   - "Shop Dark" button → links to `/collections/dark-humor`
3. Click buttons to test navigation

---

### 5. Test PDP (Product Detail Page)

1. Navigate to any product in the preview
2. Verify:
   - ✅ Add to Cart button is visible (even if OOS with dev toggle)
   - ✅ Sticky ATC appears when scrolling down
   - ✅ Size guide link shows (if enabled in settings)
   - ✅ Trust badges render under ATC
   - ✅ Product accordions expand/collapse

---

### 6. Test 404 Page

1. In preview, go to a non-existent URL: `/pages/does-not-exist`
2. Should show:
   - Humorous headline
   - Search bar
   - Links to Light Humor & Dark Humor collections
   - 4 product suggestions

---

## 🏷️ Recommended Product Tags

For maximum theme compatibility, use these tags:

### Collection Tags
- `light` → Light Humor collection
- `dark` → Dark Humor collection

### Badge Tags (optional)
- `new` → Shows "New" badge on PDP
- `bestseller` → Shows "Bestseller" badge
- `limited` → Shows "Limited" badge

### Example Product
```
Title: "Existential Crisis" T-Shirt
Tags: dark, new, bestseller
Price: $28.00
Inventory: Track quantity OFF (or qty = 100)
```

---

## 🚨 Troubleshooting

### "Sold Out" shows even with dev toggle ON
- **Fix:** Go to Theme settings → Astra Dev → ensure toggle is **ON**, then refresh preview

### Collections are empty
- **Fix:** Verify products have the correct tags (`light` or `dark`) and are published to Online Store channel

### Sticky ATC doesn't appear
- **Fix:** Scroll down past the main product form. If still hidden, check browser console for JS errors

### 404 page doesn't show products
- **Fix:** Ensure you have products in the `All Products` collection (published to Online Store)

---

## ✅ Final Checklist

- [ ] Light Humor collection created with handle `light-humor`
- [ ] Dark Humor collection created with handle `dark-humor`
- [ ] At least 2 products tagged `light`
- [ ] At least 2 products tagged `dark`
- [ ] All products published to Online Store channel
- [ ] All products have inventory available (track OFF or qty > 0)
- [ ] Dev toggle `dev_force_in_stock` = ON in theme settings
- [ ] Homepage duo-hero buttons navigate correctly
- [ ] PDP shows ATC + sticky ATC + trust badges
- [ ] 404 page shows collection links + products

---

## 🎨 Next Steps (Phase 4.0)

Once collections are set up, you're ready for:
- Size guide modal
- Product accordions (shipping, care, sizing, fabric)
- Reviews scaffold
- Analytics hooks
- JSON-LD + social sharing
- "Drop" landing template

See `# Codex Job Spec – Phase 4.0` for implementation details.
