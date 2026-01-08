import init, { parse_to_dnr } from "./pkg/oxide_block.js";

async function start() {
  try {
    await init();
    console.log("OxideBlock Engine Initialized");

    const rule = parse_to_dnr("||doubleclick.net^", 1);

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [rule],
    });
    console.log("🛡️ Blocking Active");
  } catch (e) {
    console.error("❌ Failed to start engine:", e);
  }
}

start();
