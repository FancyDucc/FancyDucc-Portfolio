document.addEventListener("DOMContentLoaded", () => {
  const ROBUX_PER_USD = 10000 / 38;
  const STORE_CUR = "fd.currency.code";
  const STORE_MODE = "fd.currency.mode";
  const STORE_FX = "fd.fx.usd";

  let rates = { USD: 1 };
  let mode = localStorage.getItem(STORE_MODE) || "FIAT";
  let fiat = localStorage.getItem(STORE_CUR)  || "USD";

  // ui stuff
  const toggle = document.getElementById("currency-toggle");
  const pillFiat = document.getElementById("pill-fiat");
  const pillRobux = document.getElementById("pill-robux");

  // dropdown stuff
  const fiatSelect = document.getElementById("fiat-select");
  const fiatBtn = document.getElementById("fiat-btn");
  const fiatList = document.getElementById("fiat-list");
  const fiatValue = document.getElementById("fiat-value");

  pillFiat?.addEventListener("click", () => setMode("FIAT"));
  pillRobux?.addEventListener("click", () => setMode("ROBUX"));
  fiatList.addEventListener("click", (e) => e.stopPropagation());

  const getSuffix = t => (t.match(/\/(build|script|animation|track|asset)/i)?.[0]) || "";

  function wrapRobuxChunks() {
    document.querySelectorAll(".price.robux").forEach(rb => {
      const parent = rb.parentNode;
      if (!parent || parent.classList?.contains("robux-chunk")) return;
      const group = document.createElement("span");
      group.className = "robux-chunk";
      const prev = rb.previousSibling;
      if (prev && prev.nodeType === Node.TEXT_NODE) {
        parent.insertBefore(group, prev);
        group.appendChild(prev);
        group.appendChild(rb);
      } else {
        parent.insertBefore(group, rb);
        group.appendChild(rb);
      }
    });
  }

  function fmtFiat(usdAmount, code) {
    const rate = (rates && typeof rates[code] === "number") ? rates[code] : 1;
    const value = usdAmount * rate;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2
    }).format(value);
  }

  function renderPriceEl(el, usdAmount, discounted) {
    const suffix = getSuffix(el.textContent);
    if (mode === "ROBUX") el.textContent = `${Math.round(usdAmount * ROBUX_PER_USD)} Robux${suffix}`;
    else el.textContent = `${fmtFiat(usdAmount, fiat)}${suffix}`;
    el.classList.toggle("discounted", !!discounted);
  }

  const discountMultipliers = {};

  function renderAll() {
    const showRobux = mode === "ROBUX";
    document.querySelectorAll(".robux-chunk").forEach(span => span.classList.toggle("hidden", !showRobux));

    document.querySelectorAll(".price.usd[data-original-price]").forEach(el => {
      const baseUSD = parseFloat(el.dataset.originalPrice) || 0;
      const header  = el.closest(".card")?.querySelector("h3,h4")?.textContent?.toLowerCase() || "";
      const mul = Object.entries(discountMultipliers)
        .reduce((acc, [k, v]) => (header.includes(k) ? acc * v : acc), 1);
      renderPriceEl(el, baseUSD * mul, mul < 1);
    });
  }

  // thanks stack overflow :3
  async function fetchRates() {
    try {
      const r = await fetch("https://api.exchangerate.host/latest?base=USD");
      const j = await r.json();
      if (j && j.rates && typeof j.rates.USD !== "undefined") {
        rates = { USD: 1, ...j.rates };
        localStorage.setItem(STORE_FX, JSON.stringify({ ts: Date.now(), rates }));
        return;
      }
      throw new Error("Malformed response");
    } catch {
      try {
        const cache = JSON.parse(localStorage.getItem(STORE_FX) || "{}");
        if (cache.rates && typeof cache.rates.USD === "number") {
          rates = cache.rates; return;
        }
      } catch {}
      rates = { USD:1, EUR:0.85, GBP:0.77, CAD:1.36, AUD:1.52, NZD:1.66, JPY:155, KRW:1370, INR:83.2,
                BRL:5.5, MXN:18.3, SEK:10.6, NOK:10.7, DKK:6.35, CHF:0.90, PLN:3.9, CZK:23.4, HUF:370,
                TRY:33, ZAR:18.5, AED:3.67, SAR:3.75, ILS:3.8, CNY:7.2 };
    }
  }

  function makeOption(code) {
    const li = document.createElement("div");
    li.className = "fiat-option";
    li.setAttribute("role","option");
    li.dataset.value = code;
    li.innerHTML = `<span>${code}</span><span>${fmtFiat(1, code)}</span>`;
    if (code === fiat) li.setAttribute("aria-selected","true");
    li.addEventListener("click", () => { selectFiat(code); closeMenu(); });
    li.addEventListener("mouseenter", () => setFocus(code));
    return li;
  }

  function buildFiatMenu() {
    fiatList.innerHTML = "";
    const codes = Object.keys(rates).sort();
    const preferred = ["USD","EUR","GBP","CAD","AUD","JPY","CNY","KRW","INR","BRL","MXN"];

    const popular = document.createElement("div");
    popular.className = "fiat-group"; popular.textContent = "Popular";
    fiatList.appendChild(popular);
    preferred.forEach(c => { if (rates[c]) fiatList.appendChild(makeOption(c)); });

    const all = document.createElement("div");
    all.className = "fiat-group"; all.textContent = "All";
    fiatList.appendChild(all);
    codes.forEach(c => { if (!preferred.includes(c) && rates[c]) fiatList.appendChild(makeOption(c)); });
  }

  function openMenu(){ fiatSelect.dataset.open = "true"; fiatBtn.setAttribute("aria-expanded","true"); setFocus(fiat); fiatList.focus(); }
  function closeMenu(){ fiatSelect.dataset.open = "false"; fiatBtn.setAttribute("aria-expanded","false"); clearFocus(); }
  function toggleMenu(){ (fiatSelect.dataset.open === "true") ? closeMenu() : openMenu(); }

  function selectFiat(code){
    setFiat(code);
    fiatValue.textContent = code;
    fiatList.querySelectorAll('.fiat-option[aria-selected="true"]').forEach(el=>el.removeAttribute("aria-selected"));
    const el = fiatList.querySelector(`.fiat-option[data-value="${code}"]`);
    if (el) el.setAttribute("aria-selected","true");
  }

  let focusIndex = -1;
  function setFocus(code){
    clearFocus();
    const els = [...fiatList.querySelectorAll(".fiat-option")];
    focusIndex = els.findIndex(el => el.dataset.value === code);
    if (focusIndex >= 0){
      els[focusIndex].classList.add("focus");
      els[focusIndex].scrollIntoView({ block:"nearest" });
    }
  }
  function clearFocus(){ fiatList.querySelectorAll(".fiat-option.focus").forEach(el => el.classList.remove("focus")); }

  fiatBtn.addEventListener("click", e => { e.stopPropagation(); toggleMenu(); });
  document.addEventListener("click", e => { if (fiatSelect.dataset.open === "true" && !fiatSelect.contains(e.target)) closeMenu(); });

  fiatBtn.addEventListener("keydown", e => {
    if (e.key === "ArrowDown"){ e.preventDefault(); openMenu(); }
  });
  fiatList.addEventListener("keydown", e => {
    const els = [...fiatList.querySelectorAll(".fiat-option")];
    if (e.key === "Escape"){ e.preventDefault(); closeMenu(); fiatBtn.focus(); }
    else if (e.key === "ArrowDown"){ e.preventDefault(); const i = Math.min(els.length-1, focusIndex+1); setFocus(els[i].dataset.value); }
    else if (e.key === "ArrowUp"){ e.preventDefault(); const i = Math.max(0, focusIndex-1); setFocus(els[i].dataset.value); }
    else if (e.key === "Enter" || e.key === " "){ e.preventDefault(); const el = els[focusIndex]; if (el){ selectFiat(el.dataset.value); closeMenu(); fiatBtn.focus(); } }
  });

  function syncWidths(){
    const t = document.getElementById("currency-toggle");
    const s = document.getElementById("fiat-select");
    if (t && s){ s.style.minWidth = `${t.offsetWidth}px`; }
  }
  window.addEventListener("resize", syncWidths);

  function setMode(newMode) {
    mode = newMode;
    toggle.dataset.mode = newMode;
    pillFiat.classList.toggle("active", newMode !== "ROBUX");
    pillRobux.classList.toggle("active", newMode === "ROBUX");
    localStorage.setItem(STORE_MODE, newMode);
    renderAll();
  }
  function setFiat(code) {
    fiat = code;
    localStorage.setItem(STORE_CUR, code);
    pillFiat.textContent = code;
    if (mode !== "ROBUX") renderAll();
  }

  window.applyDiscount = function(discountPct, services) {
    const list = document.getElementById("discounted-services-list");
    const card = document.getElementById("discount-card");
    if (!list || !card) return;

    services.forEach(({ name, description }) => {
      const key = (name || "").toLowerCase();
      discountMultipliers[key] = (discountMultipliers[key] || 1) * (1 - discountPct / 100);
      if (![...list.children].some(li => li.textContent.includes(description))) {
        const li = document.createElement("li");
        li.textContent = `${discountPct}% Discount on ${description}`;
        list.appendChild(li);
      }
    });
    renderAll();
  };

  (async function init() {
    wrapRobuxChunks();
    await fetchRates();
    buildFiatMenu();
    syncWidths();

    setFiat(fiat);
    fiatValue.textContent = fiat;
    setMode(mode);
    renderAll();

    applyDiscount(30, [{ name: "vfx", description: "VFX" }]);
  })();
});