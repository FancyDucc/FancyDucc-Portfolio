document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 992;
  const lowMem = (navigator.deviceMemory || 8) < 4;

  // Skip the parallax/scroll-var update entirely on mobile, touch devices,
  // low-memory devices, or when the user prefers reduced motion.
  // The CSS handles a static fallback for those cases.
  if (reduce || isCoarse || isNarrow || lowMem) return;

  const mast = document.querySelector('header.masthead .masthead-content');

  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      root.style.setProperty('--scrollY', y.toFixed(2));

      if (mast){
        const offset = Math.min(y * 0.4, 3000);
        mast.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
