(() => {
  const cssVar = n => getComputedStyle(document.documentElement)
                      .getPropertyValue(n).trim();
  const FADE_MS   = +cssVar('--fade-ms')  || 300;
  const MIN_SHOW  = 200;
  let startTime   = performance.now();

  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.className = 'preloader show no-trans';
  loader.innerHTML = '<span class="loading-text">loading…</span>';
  document.documentElement.prepend(loader);

  let inFlightFetch = 0;
  const origFetch = window.fetch;
  window.fetch = (...args) => {
    inFlightFetch++;
    return origFetch(...args).finally(() => {
      inFlightFetch--;
      maybeDone();
    });
  };

  let nativeReady = false;
  window.addEventListener('load', async () => {
    await Promise.allSettled([
      document.fonts?.ready,
      decodeMedia()
    ]);
    nativeReady = true;
    maybeDone();
  });

  async function decodeMedia(){
    const imgs   = Array.from(document.images);

    await Promise.all([
      ...imgs.map(img => img.decode ? img.decode().catch(()=>{}) :
                       img.complete ? Promise.resolve() :
                       new Promise(r=>img.addEventListener('load',r,{once:true})))
    ]);
  }

  function maybeDone(){
    const elapsed = performance.now() - startTime;
    if (!nativeReady)          return;
    if (inFlightFetch)         return;
    if (elapsed < MIN_SHOW) {
      setTimeout(maybeDone, MIN_SHOW - elapsed);
      return;
    }

    loader.classList.remove('no-trans');
    loader.classList.add('fade-out');
    requestAnimationFrame(()=>loader.style.opacity = 0);
    loader.addEventListener('transitionend', ()=>loader.remove(), { once:true });
  }

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
    startTime = performance.now();
    loader.classList.add('show');
    loader.classList.remove('fade-out');
    loader.style.opacity = 1;
    setTimeout(cb, FADE_MS);
  }
})();
