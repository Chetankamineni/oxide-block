import init, {
  parse_bulk_rules,
  generate_cosmetic_css,
} from "./pkg/oxide_block.js";

async function applyProtection() {
  try {
    await init();
    console.log("OxideBlock Engine Re-Initialized");
    // Mocking a standard filter list
    const filterList = `
||doubleclick.net^
||google-analytics.com^
||ads.example.com^
##.ad-sidebar
##.sponsored-content
##div[id^="ad_"]
        `;
    // A. Handle Network Blocking (Bulk)
    const dnrRules = parse_bulk_rules(filterList, 100);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 100), // Clean old IDs
      addRules: dnrRules,
    });
    console.log(`Network: ${dnrRules.length} rules active.`);

    // B. Handle Cosmetic Hiding
    const cosmeticCSS = generate_cosmetic_css(filterList);
    await chrome.storage.local.set({ activeCSS: cosmeticCSS });
    console.log("Cosmetic: CSS generated and stored.");
  } catch (e) {
    console.error("❌ Startup Error:", e);
  }
}

chrome.runtime.onInstalled.addListener(applyProtection);
chrome.runtime.onStartup.addListener(applyProtection);
