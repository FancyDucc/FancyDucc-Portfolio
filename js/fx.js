document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mast = document.querySelector('header.masthead .masthead-content');

  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      root.style.setProperty('--scrollY', y.toFixed(2));

      if (mast && !reduce){
        const offset = Math.min(y * 0.25, 140);
        mast.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
});