function updateUI() {
  chrome.storage.local.get("blockedTotal", (data) => {
    document.getElementById("blocked-count").textContent =
      data.blockedTotal || 0;
  });
}

// Update immediately when opened
updateUI();

// Listen for updates while the popup is open
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedTotal) {
    document.getElementById("blocked-count").textContent =
      changes.blockedTotal.newValue;
  }
});
