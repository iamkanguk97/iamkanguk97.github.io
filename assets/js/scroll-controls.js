(() => {
  const topRevealThreshold = 96;
  const bottomDisableThreshold = 180;
  const topButton = document.getElementById("back-to-top");
  const bottomButton = document.getElementById("scroll-to-bottom");

  if (!topButton || !bottomButton) {
    return;
  }

  const setButtonState = (button, state) => {
    button.classList.toggle("is-active", state === "active");
    button.classList.toggle("is-hidden", state === "hidden");
    button.classList.toggle("is-disabled", state === "disabled");
    button.disabled = state === "disabled";
    button.setAttribute("aria-disabled", state === "disabled" ? "true" : "false");
    button.tabIndex = state === "hidden" ? -1 : 0;
  };

  const syncButtons = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const isScrollable = maxScroll > topRevealThreshold;
    const nearBottom = scrollTop >= maxScroll - bottomDisableThreshold;

    if (!isScrollable) {
      setButtonState(topButton, "hidden");
      setButtonState(bottomButton, "hidden");
      return;
    }

    setButtonState(topButton, scrollTop > topRevealThreshold ? "active" : "disabled");
    setButtonState(bottomButton, nearBottom ? "disabled" : "active");
  };

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  bottomButton.addEventListener("click", () => {
    if (bottomButton.disabled) {
      return;
    }

    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  });

  window.addEventListener("scroll", syncButtons);
  window.addEventListener("resize", syncButtons);
  syncButtons();
})();
