let statsChart = null;

function initChart() {
  const ctx = document.getElementById("statsChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 150);
  gradient.addColorStop(0, "rgba(46, 204, 113, 0.35)");
  gradient.addColorStop(1, "rgba(46, 204, 113, 0.0)");

  statsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#2ecc71",
          borderWidth: 2.5,
          fill: true,
          backgroundColor: gradient,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: "rgba(255, 255, 255, 0.05)", drawTicks: false },
          ticks: { color: "#666", font: { size: 10 } },
        },
        y: { display: false },
      },
    },
  });
}

function updateUI() {
  chrome.storage.local.get(
    ["blockedTotal", "blockedAds", "blockedCosmetic", "weeklyHistory"],
    (data) => {
      document.getElementById("blocked-count").textContent =
        data.blockedTotal || 0;
      document.getElementById("count-ads").textContent = data.blockedAds || 0;
      document.getElementById("count-cosmetic").textContent =
        data.blockedCosmetic || 0;

      // Load active arrays into the visual canvas chart data frame
      if (data.weeklyHistory && statsChart) {
        statsChart.data.datasets[0].data = data.weeklyHistory;
        statsChart.update();
      }
    },
  );
}

initChart();
updateUI();

// Listen for updates while the popup is open
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedTotal) {
    document.getElementById("blocked-count").textContent =
      changes.blockedTotal.newValue;
  }
  if (changes.blockedAds) {
    document.getElementById("count-ads").textContent =
      changes.blockedAds.newValue;
  }
  if (changes.blockedCosmetic) {
    document.getElementById("count-cosmetic").textContent =
      changes.blockedCosmetic.newValue;
  }
  if (changes.weeklyHistory && statsChart) {
    statsChart.data.datasets[0].data = changes.weeklyHistory.newValue;
    statsChart.update();
  }
});
