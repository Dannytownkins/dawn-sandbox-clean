#!/usr/bin/env node
// Simple CLI: `node tools/mcp-stabilizer/cli.js audit` or `fix-all`
import fs from "fs-extra";
import path from "path";
import { globSync } from "glob";

const repo = process.cwd();
const p = (...x) => path.join(repo, ...x);
const exists = (f) => fs.pathExists(f);
const read = async (f) => (await exists(f)) ? fs.readFile(f, "utf8") : "";
const write = async (f, s) => { await fs.ensureFile(f); await fs.writeFile(f, s); };
const appendOnce = async (file, marker, block) => {
  const cur = await read(file);
  if (!cur.includes(marker)) await write(file, (cur + "\n" + block).trim() + "\n");
};

// ----- FIXERS -----
async function fixJsonLd() {
  const snip = p("snippets/jsonld-website.liquid");
  const layout = p("layout/theme.liquid");
  const notes = [];
  if (!(await exists(snip))) {
    await write(snip, `<script type="application/ld+json">{
"@context":"https://schema.org","@type":"WebSite",
"url": {{ shop.url | json }},"name": {{ shop.name | json }},
"potentialAction":{"@type":"SearchAction",
"target": {{ shop.url | append: "/search?q={query}" | json }},
"query-input":"required name=query"}}</script>\n`);
    notes.push("created snippets/jsonld-website.liquid");
  }
  const src = await read(layout);
  if (src && !src.includes("{% render 'jsonld-website' %}")) {
    await write(layout, src.replace(/<\/head>/i, "  {% render 'jsonld-website' %}\n</head>"));
    notes.push("inserted render in layout/theme.liquid");
  }
  return notes.length ? notes : ["jsonld ok"];
}

async function fixCatalog() {
  const css = p("assets/base.css");
  await appendOnce(css, "MCP_COLLECTION", `/* MCP_COLLECTION */
.template-collection .grid.product-grid{grid-template-columns:repeat(2,minmax(360px,1fr))!important;gap:28px!important;}
@media (max-width:989px){.template-collection .grid.product-grid{grid-template-columns:1fr!important;gap:20px!important;}}
.template-collection .card--product .card__inner .media{padding-top:120%!important;}
.card--product .media img{object-fit:cover;}
.card--product .card__content,.card--product .card__information{text-align:center!important;align-items:center;}
.card--product .price{justify-content:center;}
.card--product .card__cta{margin-top:10px;}
.card--product .card__cta .button{width:100%;}
`);
  const card = p("snippets/card-product.liquid");
  let notes = ["catalog css ok"];
  if (await exists(card)) {
    const src = await read(card);
    if (!src.includes("MCP_QUICK_ADD")) {
      await write(card, (src + `
{%- assign first_available = product.variants | where: 'available', true | first -%}
<div class="card__cta"><!-- MCP_QUICK_ADD -->
  {%- if product.has_only_default_variant and first_available -%}
    <form method="post" action="/cart/add" class="quick-add">
      <input type="hidden" name="id" value="{{ first_available.id }}">
      <button type="submit" class="button button--full">Add to cart</button>
    </form>
  {%- else -%}
    <a href="{{ product.url }}" class="button button--full button--secondary">View options</a>
  {%- endif -%}
</div>
`).trim() + "\n");
      notes = ["catalog: quick-add injected"];
    }
  }
  return notes;
}

async function fixTrustBar() {
  const css = p("assets/base.css");
  await appendOnce(css, "MCP_USP", `/* MCP_USP */
.ast-usp__inner{display:flex;align-items:center;justify-content:center;gap:22px;min-height:44px;}
.ast-usp__inner>*{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;}
@media (max-width:640px){.ast-usp__inner{justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px;}.ast-usp__inner>*{flex:0 0 auto;}}
`);
  const files = globSync(p("**/*.liquid"), { ignore: ["**/node_modules/**"] });
  for (const f of files) {
    let s = await read(f);
    if (s.includes("SSL Secure") && !s.includes("ast-usp__inner")) {
      s = s.replace(
        /(SSL[\s\S]*?Shipping[\s\S]*?)(<\/|$)/m,
        `<div class="ast-usp"><div class="page-width ast-usp__inner">$1</div></div>$2`
      );
      await write(f, s);
      return ["trust bar: wrapped + css"];
    }
  }
  return ["trust bar: css ok"];
}

async function fixHeaderIcons() {
  const css = p("assets/base.css");
  await appendOnce(css, "MCP_HEADER_ICONS", `/* MCP_HEADER_ICONS */
.header__icons .header__icon,.header__icons .menu-drawer__trigger{background:transparent!important;border:0!important;box-shadow:none!important;color:#fff;width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;}
.header__icon--cart .cart-count-bubble{position:absolute;top:4px;right:4px;background:#F7E06A;color:#111;min-width:16px;height:16px;line-height:16px;padding:0 4px;border-radius:999px;font-size:11px;}
.menu-drawer__inner-container{background:#0b0b0c;color:#fff;}
.menu-drawer__menu-item{color:#fff;}
`);
  return ["header icons: ok"];
}

async function fixLocales() {
  const loc = p("locales/en.default.json");
  if (!(await exists(loc))) return ["locales: file missing (skipped)"];
  const j = JSON.parse(await read(loc) || "{}");
  j.cart ??= {};
  j.cart.upsells ??= {};
  j.cart.upsells.heading ??= "You may also like";
  j.cart.upsells.add ??= "Add";
  j.cart.discount ??= {};
  j.cart.discount.have_code ??= "Have a discount code?";
  await write(loc, JSON.stringify(j, null, 2) + "\n");
  return ["locales: ok"];
}

// ----- AUDIT -----
async function audit() {
  const problems = [];
  if (!(await exists(p("snippets/jsonld-website.liquid")))) problems.push("missing: snippets/jsonld-website.liquid");
  const base = await read(p("assets/base.css"));
  if (!base.includes("MCP_COLLECTION")) problems.push("catalog css missing");
  if (!base.includes("MCP_USP")) problems.push("trust bar css missing");
  if (!base.includes("MCP_HEADER_ICONS")) problems.push("header icon css missing");
  const card = await read(p("snippets/card-product.liquid"));
  if (!card.includes("MCP_QUICK_ADD")) problems.push("card quick-add missing");
  return problems;
}

// ----- CLI -----
const cmd = (process.argv[2] || "").toLowerCase();
(async () => {
  if (cmd === "audit") {
    const probs = await audit();
    if (probs.length) {
      console.log("Problems:"); probs.forEach((p) => console.log(" -", p));
      process.exitCode = 1;
    } else { console.log("Audit clean ✅"); }
    return;
  }
  if (cmd === "fix-all") {
    const notes = [];
    notes.push(...await fixJsonLd());
    notes.push(...await fixCatalog());
    notes.push(...await fixTrustBar());
    notes.push(...await fixHeaderIcons());
    notes.push(...await fixLocales());
    console.log("Applied:"); notes.forEach((n) => console.log(" -", n));
    console.log("Done ✅");
    return;
  }
  console.log("Usage:");
  console.log("  node tools/mcp-stabilizer/cli.js audit");
  console.log("  node tools/mcp-stabilizer/cli.js fix-all");
})();
