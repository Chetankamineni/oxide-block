import init, {
  parse_bulk_rules,
  generate_cosmetic_css,
} from "./pkg/oxide_block.js";

async function applyProtection() {
  try {
    await init();
    console.log("OxideBlock Engine Re-Initialized");

    const filterList = `
||doubleclick.net^
||google-analytics.com^
||ads.example.com^
##.ad-sidebar
##.sponsored-content
##div[id^="ad_"]
    `;

    // 1. Handle Network Blocking
    const dnrRules = parse_bulk_rules(filterList, 100);

    // Clear old rules to prevent build-up
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldIds = oldRules.map((r) => r.id);

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldIds,
      addRules: dnrRules,
    });
    console.log(`Network: ${dnrRules.length} rules active.`);

    // 2. Handle Cosmetic Hiding
    const cosmeticCSS = generate_cosmetic_css(filterList);
    await chrome.storage.local.set({ activeCSS: cosmeticCSS });
  } catch (e) {
    console.error("❌ Startup Error:", e);
  }
}

// Track matches
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  chrome.storage.local.get(["blockedTotal", "blockedAds"], (data) => {
    const total = (data.blockedTotal || 0) + 1;
    const ads = (data.blockedAds || 0) + 1;

    chrome.storage.local.set({
      blockedTotal: total,
      blockedAds: ads,
    });
  });
});

chrome.runtime.onInstalled.addListener(applyProtection);
chrome.runtime.onStartup.addListener(applyProtection);
