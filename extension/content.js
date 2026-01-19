// Retrieve the Rust-generated CSS from storage and inject it into the page
chrome.storage.local.get("activeCSS", (data) => {
  if (data.activeCSS) {
    const style = document.createElement("style");
    style.textContent = data.activeCSS;
    (document.head || document.documentElement).appendChild(style);
  }
});
