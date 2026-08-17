# Education Vertical

Working slice of the "Education" vertical from `Adobe-Commerce-EDS-Template-Architecture.md` §5.4, built on the shared boilerplate at the repo root. Course = a Commerce product, framed with education copy and a vertical-specific content overlay — nothing in `/blocks`, `/scripts`, or `/styles` was forked; only this folder and `tier-features.json` (shared, but authored per-vertical values live here) differ per vertical.

## What's real vs. stand-in

- **Real and live**: every Commerce interaction (catalog search/facets on `/courses`, product data/gallery/price/add-to-cart on the course detail page) calls Adobe's public Commerce demo sandbox (`www.aemshop.net`) via the same `@dropins/*` components the official boilerplate ships. This proves the underlying architecture works end-to-end, not just that a screen was drawn.
- **Stand-in**: the sandbox has no real "course" catalog, so the course detail page points at a real demo SKU (`ADB150`, a t-shirt) re-framed with the `course-detail-info` block (instructor/cohort/duration/format/prerequisites). Before selling this to a client, a real course catalog (configurable/bookable products per §5.4) needs to exist in their Commerce instance, and `config.json` needs to point at it instead of the demo sandbox.

## Running it locally

```
npm install
npm run install:dropins
npx @adobe/aem-cli up --html-folder verticals/education/drafts --html-mount / --port 3001
```

Then visit `http://localhost:3001/`, `/courses`, `/courses/intro-to-data-science`.

## Known local-preview limitation (not a bug in this vertical)

`--html-folder` only serves extensionless routes (`/nav` works) — it does not serve the `.plain.html` fragment requests that `header.js`/`footer.js` make (`/nav.plain.html`, `/footer.plain.html`, `/mini-cart.plain.html` all 404 locally, confirmed by direct testing). This means header/footer chrome doesn't render in this static-file preview mode; page content and every Commerce block render correctly regardless. The `nav.plain.html` / `footer.plain.html` / `mini-cart.plain.html` files in `drafts/` are still the correct, real content for this vertical — they'll work as soon as this is previewed through the real content pipeline (Document Authoring/SharePoint + `aem.page`), which is the actual production-adjacent path. This is a constraint of the local dev CLI's static-file fallback mode, not of the architecture.

## Tier preview

Append `?tier=base`, `?tier=simple`, `?tier=medium`, or `?tier=complex` to any URL to preview what that tier hides (e.g. `/courses?tier=base` hides the facets sidebar; the nav strips Addresses/Store Locator below Complex). See `tier-features.json` at the repo root and `scripts/tier.js`.

## Extending to another vertical

Copy this folder's shape (`config.json`, `drafts/`, this README) under `verticals/{name}/`, write vertical-specific content in `drafts/`, and add any vertical-specific content-only blocks (like `course-detail-info`) under the root `/blocks/` folder — the block loader requires flat `/blocks/{name}/{name}.js` paths, so vertical-specific block *code* always lives at the root, only vertical *config and content* live under `verticals/{name}/`.
