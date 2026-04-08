(function () {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const reloadFlag = "pwa-reset-reloaded";

  window.addEventListener("load", async function () {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (!registrations.length) {
        sessionStorage.removeItem(reloadFlag);
        return;
      }

      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ("caches" in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
      }

      const hasController = navigator.serviceWorker.controller;
      const alreadyReloaded = sessionStorage.getItem(reloadFlag) === "1";

      if (hasController && !alreadyReloaded) {
        sessionStorage.setItem(reloadFlag, "1");
        window.location.reload();
        return;
      }

      sessionStorage.removeItem(reloadFlag);
    } catch (error) {
      console.error("Failed to clear legacy PWA cache.", error);
    }
  });
})();
