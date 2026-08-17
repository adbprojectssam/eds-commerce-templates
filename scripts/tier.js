/*
 * Tier-gating utility shared by every vertical.
 *
 * A deployed client site is normally ONE tier for its whole lifetime (fork-per-client
 * model — see Adobe-Commerce-EDS-Template-Architecture.md §3.4). This module exists so a
 * single dev/demo repo can preview what any tier looks like before a client is forked,
 * without maintaining four separate content sets.
 *
 * Tier resolution order (first match wins):
 *   1. `?tier=` query param        — local/preview convenience, never used in production
 *   2. `<meta name="tier">`        — page metadata, authored per page if it ever needs to differ
 *   3. `config.json` "tier" field  — the deployment-wide default for a forked client site
 *   4. tier-features.json defaultTier
 */

import { getMetadata } from './aem.js';
import { getConfigValue } from '@dropins/tools/lib/aem/configs.js';

let featuresPromise;

async function loadFeatureConfig() {
  if (!featuresPromise) {
    featuresPromise = fetch(`${window.hlx.codeBasePath}/tier-features.json`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return featuresPromise;
}

function resolveTierSync(config) {
  const fromQuery = new URLSearchParams(window.location.search).get('tier');
  if (fromQuery && config.tierRank.includes(fromQuery)) return fromQuery;

  const fromMeta = getMetadata('tier');
  if (fromMeta && config.tierRank.includes(fromMeta)) return fromMeta;

  const fromConfig = getConfigValue('tier');
  if (fromConfig && config.tierRank.includes(fromConfig)) return fromConfig;

  return config.defaultTier;
}

/**
 * @returns {Promise<string>} the active tier for this page load
 */
export async function getTier() {
  const config = await loadFeatureConfig();
  if (!config) return 'complex';
  return resolveTierSync(config);
}

/**
 * @param {string} featureKey key from tier-features.json "features"
 * @returns {Promise<boolean>} whether the feature is enabled at the current tier
 */
export async function isEnabled(featureKey) {
  const config = await loadFeatureConfig();
  if (!config) return true;
  const feature = config.features[featureKey];
  if (!feature) return true; // unknown keys fail open rather than silently hiding content
  const tier = resolveTierSync(config);
  return config.tierRank.indexOf(tier) >= config.tierRank.indexOf(feature.minTier);
}

/**
 * Removes anchors pointing at a gated feature's nav paths from a container
 * (used by header.js to filter account/nav links that don't apply at the current tier).
 * @param {Element} container
 */
export async function filterGatedLinks(container) {
  const config = await loadFeatureConfig();
  if (!config) return;
  const tier = resolveTierSync(config);
  const tierIndex = config.tierRank.indexOf(tier);

  Object.values(config.features).forEach((feature) => {
    if (!feature.navPaths || config.tierRank.indexOf(feature.minTier) <= tierIndex) return;
    feature.navPaths.forEach((path) => {
      container.querySelectorAll(`a[href*="${path}"]`).forEach((a) => {
        const li = a.closest('li') || a;
        li.remove();
      });
    });
  });
}

/**
 * Marks <body> with a `tier-{tier}` class so CSS can use it as a last resort
 * (e.g. `body.tier-base .facets { display: none; }`).
 */
export async function applyTierBodyClass() {
  const tier = await getTier();
  document.body.classList.add(`tier-${tier}`);
}
