(() => {
  const STORAGE_KEY = "sidebar-collapsed";
  const COLLAPSED_CLASS = "sidebar-collapsed";
  const MID_OPEN_CLASS = "sidebar-mid-open";
  // Keep in sync with _sass/custom/_sidebar-toggle.scss
  const midWidthQuery = window.matchMedia("(min-width: 850px) and (max-width: 1199.98px)");
  const root = document.documentElement;
  const toggleButton = document.getElementById("sidebar-toggle");

  if (!toggleButton) {
    return;
  }

  const isCollapsed = () =>
    midWidthQuery.matches ? !root.classList.contains(MID_OPEN_CLASS) : root.classList.contains(COLLAPSED_CLASS);

  const syncButton = () => {
    const collapsed = isCollapsed();
    const label = collapsed ? "사이드바 펼치기" : "사이드바 접기";
    toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
    toggleButton.setAttribute("aria-label", label);
    toggleButton.title = label;
  };

  const saveCollapsed = (collapsed) => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "true" : "false");
    } catch (error) {
      console.warn("Failed to save sidebar state:", error);
    }
  };

  toggleButton.addEventListener("click", () => {
    // Mid width opens the sidebar only for this page, so its state is not saved
    if (midWidthQuery.matches) {
      root.classList.toggle(MID_OPEN_CLASS);
    } else {
      saveCollapsed(root.classList.toggle(COLLAPSED_CLASS));
    }
    syncButton();
  });

  midWidthQuery.addEventListener("change", () => {
    root.classList.remove(MID_OPEN_CLASS);
    syncButton();
  });

  syncButton();

  // The saved state was applied in <head> with transitions disabled; re-enable them after the first paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove("sidebar-no-transition"));
  });
})();
