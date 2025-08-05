/* smart loader v2 – stick around until *really* ready */
(() => {
  const cssVar = n => getComputedStyle(document.documentElement)
                      .getPropertyValue(n).trim();
  const FADE_MS   = +cssVar('--fade-ms')  || 600;
  const MIN_SHOW  = 400;                        // ms
  let startTime   = performance.now();

  /* ---------- build element immediately ---------- */
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.className = 'preloader show no-trans';
  loader.innerHTML = '<span class="loading-text">loading…</span>';
  document.documentElement.prepend(loader);

  /* ---------- track fetch() ---------- */
  let inFlightFetch = 0;
  const origFetch = window.fetch;
  window.fetch = (...args) => {
    inFlightFetch++;
    return origFetch(...args).finally(() => {
      inFlightFetch--;
      maybeDone();
    });
  };

  /* ---------- app-level ready hook ---------- */
  let explicitReady = false;
  window.appReady = () => { explicitReady = true; maybeDone(); };

  /* ---------- wait for native resources ---------- */
  let nativeReady = false;
  window.addEventListener('load', async () => {
    await Promise.allSettled([
      document.fonts?.ready,      // wait for web-fonts
      decodeMedia()               // images & videos
    ]);
    nativeReady = true;
    maybeDone();
  });

  /* ---------- decode images + videos ---------- */
  async function decodeMedia(){
    const imgs   = Array.from(document.images);
    const vids   = Array.from(document.querySelectorAll('video'));

    await Promise.all([
      ...imgs.map(img => img.decode ? img.decode().catch(()=>{}) :
                       img.complete ? Promise.resolve() :
                       new Promise(r=>img.addEventListener('load',r,{once:true}))),

      ...vids.map(v  => v.readyState >= 4 ? Promise.resolve() :
                       new Promise(r=>v.addEventListener('canplaythrough',r,{once:true})))
    ]);
  }

  /* ---------- reveal page only when all clear ---------- */
  function maybeDone(){
    const elapsed = performance.now() - startTime;
    if (!nativeReady)          return;
    if (inFlightFetch)         return;
    if (window.appReady && !explicitReady) return;
    if (elapsed < MIN_SHOW) {
      setTimeout(maybeDone, MIN_SHOW - elapsed);
      return;
    }

    // fade out
    loader.classList.remove('no-trans');
    loader.classList.add('fade-out');
    requestAnimationFrame(()=>loader.style.opacity = 0);
    loader.addEventListener('transitionend', ()=>loader.remove(), { once:true });
  }

  /* ---------- seamless page transitions ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const u = new URL(a.href, location);
    if (u.origin !== location.origin || u.hash || a.target === '_blank') return;

    e.preventDefault();
    fadeIn(()=>location.href = u.href);
  });

  window.addEventListener('pageshow', e => { if (e.persisted) fadeIn(); });

  function fadeIn(cb = ()=>{}){
    if (!document.contains(loader)){
      document.documentElement.append(loader);
      void loader.offsetHeight;
    }
    startTime = performance.now();   // reset minimum time
    loader.classList.add('show');
    loader.classList.remove('fade-out');
    loader.style.opacity = 1;
    setTimeout(cb, FADE_MS);
  }
})();