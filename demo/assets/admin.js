/* Snapshot demo — back bar + the app's local nav pill bar (exact replica of AppLocalNav). */
(function () {
  var TABS = [
    { id: "dashboard", label: "Dashboard", href: "index.html" },
    { id: "store", label: "Store Snapshots", href: "store-snapshots.html" },
    { id: "channel", label: "Channel Snapshots", href: "channel-snapshots.html" },
    { id: "customer", label: "Customer Snapshots", href: "customer-snapshots.html" },
    { id: "page", label: "Page Snapshots", href: "page-snapshots.html" },
    { id: "ab", label: "A/B Tests", href: "ab-tests.html" },
  ];

  window.AdminDemo = {
    init: function (activeTab) {
      var shell = document.getElementById("shell");
      if (shell) {
        shell.innerHTML =
          '<header class="tb">' +
          '<a class="tb-back" href="/">' +
          '<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M12.5 4 6.5 10l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "<span>Back to The Real Heroes of Ecommerce</span>" +
          "</a>" +
          '<div class="tb-right">' +
          '<span class="tb-note">Interactive demo — sample data</span>' +
          '<a class="tb-cta" href="/snapshot-cro.html">About Snapshot</a>' +
          "</div>" +
          "</header>";
      }

      var chrome = document.getElementById("app-chrome");
      if (chrome) {
        chrome.innerHTML =
          '<nav class="app-nav" aria-label="Snapshot sections">' +
          TABS.map(function (tab) {
            return (
              '<a class="app-nav-link' + (tab.id === activeTab ? " active" : "") + '" href="' + tab.href + '"' +
              (tab.id === activeTab ? ' aria-current="page"' : "") + ">" +
              tab.label +
              "</a>"
            );
          }).join("") +
          "</nav>";
      }
    },

    /* fitted tab switcher: buttons with data-panel, panels with ids */
    wireTabs: function (rootId) {
      var root = document.getElementById(rootId);
      if (!root) return;
      var buttons = root.querySelectorAll(".tab");
      var panels = root.querySelectorAll(".tab-panel");
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          buttons.forEach(function (other) { other.classList.remove("active"); });
          panels.forEach(function (panel) { panel.style.display = "none"; });
          button.classList.add("active");
          var panel = root.querySelector("#" + button.getAttribute("data-panel"));
          if (panel) panel.style.display = "";
        });
      });
    },

    toggle: function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = el.style.display === "none" ? "" : "none";
    },
  };
})();
