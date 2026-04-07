(function () {
  const root = document.getElementById("visitor-counter");

  if (!root || root.dataset.provider !== "countapi") {
    return;
  }

  const namespace = root.dataset.namespace;
  const timezone = root.dataset.timezone || "Asia/Seoul";
  const totalValue = root.querySelector('[data-counter="total"]');
  const todayValue = root.querySelector('[data-counter="today"]');
  const yesterdayValue = root.querySelector('[data-counter="yesterday"]');

  if (!namespace || !totalValue || !todayValue || !yesterdayValue) {
    return;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const toKeyDate = (date) => formatter.format(date);
  const todayKey = toKeyDate(new Date());
  const yesterdayKey = toKeyDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const totalSeenKey = ["visitor-counter", namespace, "total"].join(":");
  const todaySeenKey = ["visitor-counter", namespace, "day", todayKey].join(":");

  const formatValue = (value) => new Intl.NumberFormat("en-US").format(value || 0);

  const request = async (path) => {
    const response = await fetch(`https://api.countapi.xyz/${path}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`CountAPI request failed: ${response.status}`);
    }

    return response.json();
  };

  const getCount = async (key) => {
    try {
      const result = await request(`get/${namespace}/${key}`);
      return result.value || 0;
    } catch (error) {
      return 0;
    }
  };

  const hitCount = async (key) => {
    const result = await request(`hit/${namespace}/${key}`);
    return result.value || 0;
  };

  const syncCounters = async () => {
    try {
      const countedTotal = localStorage.getItem(totalSeenKey) === "1";
      const countedToday = localStorage.getItem(todaySeenKey) === "1";

      const totalPromise = countedTotal ? getCount("total") : hitCount("total");
      const todayPromise = countedToday ? getCount(`day-${todayKey}`) : hitCount(`day-${todayKey}`);
      const yesterdayPromise = getCount(`day-${yesterdayKey}`);

      const [total, today, yesterday] = await Promise.all([
        totalPromise,
        todayPromise,
        yesterdayPromise,
      ]);

      if (!countedTotal) {
        localStorage.setItem(totalSeenKey, "1");
      }

      if (!countedToday) {
        localStorage.setItem(todaySeenKey, "1");
      }

      totalValue.textContent = formatValue(total);
      todayValue.textContent = formatValue(today);
      yesterdayValue.textContent = formatValue(yesterday);
      root.classList.add("is-ready");
    } catch (error) {
      root.classList.add("is-error");
    }
  };

  syncCounters();
})();
