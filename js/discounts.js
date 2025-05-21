document.addEventListener("DOMContentLoaded", () => {
  const DEVEX_RATE = 30000 / 105;
  const cumulativeDiscounts = {};

  function getSuffix(text) {
    const m = text.match(/\/(build|script|animation|track|asset)/);
    return m ? m[0] : "";
  }

  function initBasePrices() {
    document
      .querySelectorAll(".price[data-original-price]")
      .forEach(el => {
        const orig = parseFloat(el.dataset.originalPrice);
        const suffix = getSuffix(el.textContent);

        if (el.classList.contains("usd")) {
          el.textContent = `$${orig.toFixed(2)}${suffix}`;
        } else if (el.classList.contains("robux")) {
          const robux = Math.round(orig * DEVEX_RATE);
          el.textContent = `${robux} Robux${suffix}`;
        }

        el.style.color = "";
        el.style.fontWeight = "";
      });
  }

  function applyDiscount(discountPct, services) {
    const discountCard = document.getElementById("discount-card");
    const discountedList = document.getElementById("discounted-services-list");

    if (!discountCard || !discountedList) {
      const payments = document.getElementById("payments");
      payments?.insertAdjacentHTML(
        "afterbegin",
        '<p style="color: #a1a1a1;">No discounts are currently available. Please check back later!</p>'
      );
      return;
    }

    services.forEach(({ name, description }) => {
      const key = name.toLowerCase();
      cumulativeDiscounts[key] = (cumulativeDiscounts[key] || 1) * (1 - discountPct / 100);

      if (![...discountedList.children].some(li => li.textContent.includes(description))) {
        const li = document.createElement("li");
        li.textContent = `${discountPct}% Discount on ${description}`;
        discountedList.appendChild(li);
      }

      document.querySelectorAll(".card").forEach(card => {
        const header = card.querySelector("h3, h4");
        if (!header || !header.textContent.toLowerCase().includes(key)) return;

        card.querySelectorAll(".price[data-original-price]").forEach(el => {
          const orig = parseFloat(el.dataset.originalPrice);
          const discountedUsd = orig * cumulativeDiscounts[key];
          const suffix = getSuffix(el.textContent);

          if (el.classList.contains("usd")) {
            el.textContent = `$${discountedUsd.toFixed(2)}${suffix}`;
          } else if (el.classList.contains("robux")) {
            const robux = Math.round(discountedUsd * DEVEX_RATE);
            el.textContent = `${robux} Robux${suffix}`;
          }

          el.style.color = "#ff5252";
          el.style.fontWeight = "bold";
        });
      });
    });
  }
  initBasePrices();


  applyDiscount(30, [{ name: "vfx", description: "VFX" }]);
});