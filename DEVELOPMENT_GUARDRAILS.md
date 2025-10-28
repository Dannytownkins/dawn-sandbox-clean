# 🛡️ Development Guardrails - Phase 4

## The Better Way: Feature-First Architecture

This theme follows a **feature-first architecture** where each feature is completely self-contained and isolated. This prevents the cascading issues that come from global changes.

---

## 📋 Core Principles

### 1. **One Feature = One Section/Snippet + Its Own Assets**
```liquid
<!-- ✅ GOOD: Self-contained feature -->
<!-- sections/split-hero-v2.liquid -->
{{ 'component-split-hero.css' | asset_url | stylesheet_tag }}
<section class="split-hero" data-section-type="split-hero">
  <!-- feature content -->
</section>
```

```css
/* ✅ GOOD: assets/component-split-hero.css */
.split-hero { display: grid; }
.split-hero__col { /* scoped styles */ }
```

### 2. **Never Load Feature CSS in Base Files**
```liquid
<!-- ❌ BAD: Global asset loading -->
<!-- layout/theme.liquid -->
{{ 'component-split-hero.css' | asset_url | stylesheet_tag }}
```

```css
/* ❌ BAD: Feature styles in base.css */
.split-hero { /* mixed with global styles */ }
```

### 3. **Gate with Schema - Control Where Features Appear**
```json
{
  "name": "Split hero v2",
  "enabled_on": { "templates": ["index"] },
  "settings": [...]
}
```

This prevents:
- ❌ Accidental rendering on wrong pages
- ❌ Cross-contamination between features
- ❌ Global template pollution

### 4. **Prefix & Scope Everything**
```css
/* ✅ GOOD: Scoped to feature */
.split-hero { /* feature container */ }
.split-hero__col { /* feature component */ }
.split-hero__content { /* feature element */ }

/* ❌ BAD: Global selectors */
.button { /* affects entire site */ }
.card { /* affects other features */ }
```

### 5. **JS Per Section (Optional)**
```javascript
// ✅ GOOD: Section-scoped JS
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('[data-section-type="split-hero"]');
  if (!section) return;

  // Feature-specific logic here
  section.addEventListener('click', handleClick);

  // Cleanup on section unload
  document.addEventListener('shopify:section:unload', (e) => {
    if (e.target === section) {
      // Clean up event listeners
    }
  });
});
```

---

## 🛠️ Tooling Setup

### Theme Check Configuration (`theme-check.yml`)
```yaml
root: .
extends:
  - "@shopify/theme-check-common"
  - "@shopify/theme-check-liquid"

rules:
  # Enforce scoped CSS - no global selectors in component files
  - name: "NoGlobalSelectors"
    severity: error
    files:
      - "assets/component-*.css"

  # Enforce schema gating
  - name: "SchemaGating"
    severity: warning
    files:
      - "sections/*.liquid"
```

### Prettier Configuration (`.prettierrc`)
```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto",
  "singleAttributePerLine": false,
  "proseWrap": "preserve",
  "overrides": [
    {
      "files": ["*.liquid"],
      "options": {
        "parser": "liquid-html"
      }
    },
    {
      "files": ["*.json"],
      "options": {
        "printWidth": 200
      }
    }
  ]
}
```

### Development Workflow
```bash
# 1. Run theme check before commits
shopify theme check

# 2. Format code
npx prettier --write "**/*.{js,css,liquid,json}"

# 3. Commit small, feature-focused changes
git add sections/split-hero-v2.liquid assets/component-split-hero.css
git commit -m "feat: add split hero v2 section"
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ **Global CSS in Base Files**
```css
/* assets/base.css - DON'T DO THIS */
.split-hero { /* feature styles in global file */ }
```

### ❌ **Missing Schema Gates**
```json
{
  "name": "My Section"
  // Missing "enabled_on" - can render anywhere!
}
```

### ❌ **Global Selectors in Component CSS**
```css
/* assets/component-hero.css - DON'T DO THIS */
.button { /* affects entire site */ }
.grid { /* conflicts with other features */ }
```

### ❌ **Asset Loading in Layout**
```liquid
<!-- layout/theme.liquid - DON'T DO THIS -->
{{ 'component-hero.css' | asset_url | stylesheet_tag }}
```

---

## ✅ **Feature Development Checklist**

Before merging any feature:

- [ ] **Self-contained**: Section + its own CSS/JS assets only
- [ ] **Schema gated**: Uses `"enabled_on"` to control placement
- [ ] **Scoped styles**: All classes prefixed (`.feature__element`)
- [ ] **Asset loading**: CSS loaded inside section, not globally
- [ ] **Theme check**: Passes `shopify theme check`
- [ ] **Formatted**: Code formatted with Prettier
- [ ] **Small diff**: Changes isolated to feature files only

---

## 🔧 **Rollback Strategy**

If something breaks:

1. **Identify the feature**: `git log --oneline` to see recent commits
2. **Revert the feature**: `git revert <commit-hash>` for that specific feature
3. **No global fallout**: Other features remain unaffected

---

## 📚 **Examples in This Theme**

### ✅ **Split Hero V2** (Following All Guardrails)
- **Section**: `sections/split-hero-v2.liquid`
- **CSS**: `assets/component-split-hero.css` (loaded inside section)
- **Schema**: `"enabled_on": { "templates": ["index"] }`
- **Scoped**: `.split-hero__*` classes only
- **Isolated**: No changes to base.css or global files

### ❌ **Old Hero** (What We're Avoiding)
- **Global styles**: Mixed in `assets/base.css`
- **No gating**: Could render anywhere
- **Global selectors**: `.button`, `.split-hero__btn` affecting site-wide
- **Asset loading**: CSS loaded globally in layout

---

## 🚀 **Getting Started**

1. **Install tools**:
   ```bash
   npm install -g @shopify/theme-check @shopify/prettier-plugin-liquid prettier
   ```

2. **Run checks**:
   ```bash
   shopify theme check
   npx prettier --check "**/*.{js,css,liquid,json}"
   ```

3. **Fix issues**: Address any linting errors before committing

4. **Format code**: Keep everything consistently formatted
   ```bash
   npx prettier --write "**/*.{js,css,liquid,json}"
   ```

---

## 📈 **Benefits of This Approach**

- **🔒 Isolation**: Features can't break each other
- **🔄 Rollback**: Easy to revert individual features
- **⚡ Performance**: Only load CSS/JS for visible features
- **🧪 Testing**: Each feature can be tested independently
- **👥 Team**: Multiple developers can work on different features
- **🚀 Deploy**: Smaller, safer deployments

---

## 🎯 **The Golden Rule**

**If it affects more than one feature, it belongs in base.css.**
**If it only affects one feature, it belongs in that feature's CSS file.**

This simple rule prevents 90% of theme architecture problems.
