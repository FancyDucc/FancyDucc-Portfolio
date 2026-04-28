(() => {
  const SELECTOR = '.portfolio-image';
  const IMG_ATTR_FULL = 'data-full';
  const OPEN_ANIM_MS = 220;
  const FADE_MS = 160;

  const overlay = document.createElement('div');
  overlay.className = 'piLB';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-label','Image viewer');
  overlay.innerHTML = `
    <div class="piLB__frame" tabindex="-1">
      <div class="piLB__imgWrap">
        <img class="piLB__img" alt="">
        <div class="piLB__cap"></div>
      </div>
      <button class="piLB__arrow piLB__arrow--L" type="button" aria-label="Previous">‹</button>
      <button class="piLB__arrow piLB__arrow--R" type="button" aria-label="Next">›</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const frame   = overlay.querySelector('.piLB__frame');
  const imgEl   = overlay.querySelector('.piLB__img');
  const cap     = overlay.querySelector('.piLB__cap');
  const prevBtn = overlay.querySelector('.piLB__arrow--L');
  const nextBtn = overlay.querySelector('.piLB__arrow--R');

  const getImages = () => Array.from(document.querySelectorAll(SELECTOR))
    .filter(el => el instanceof HTMLImageElement);

  let images = [];
  let idx = -1;
  let open = false;
  let lastActive = null;

  const lockScroll = (on) => {
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
  };

  const bestSrc = (el) => el.getAttribute(IMG_ATTR_FULL) || el.currentSrc || el.src;

  function openAt(i) {
    images = getImages();
    if (!images.length) return;
    idx = Math.max(0, Math.min(i, images.length - 1));
    const src = bestSrc(images[idx]);
    lastActive = document.activeElement;

    const pre = new Image();
    pre.onload = () => {
      imgEl.src = src;
      imgEl.alt = images[idx].alt || '';
      cap.style.display = 'none';

      requestAnimationFrame(() => {
        overlay.classList.add('is-open');
        open = true;
        lockScroll(true);
        updateArrows();
        frame.focus({ preventScroll: true });
      });
    };
    pre.src = src;
  }

  function close() {
    if (!open) return;
    overlay.classList.remove('is-open');
    setTimeout(() => {
      imgEl.removeAttribute('src');
      lockScroll(false);
      if (lastActive) lastActive.focus?.();
    }, OPEN_ANIM_MS);
    open = false;
  }

  function updateArrows() {
    prevBtn.style.display = idx > 0 ? '' : 'none';
    nextBtn.style.display = idx < images.length - 1 ? '' : 'none';
  }

  function go(delta) {
    const next = idx + delta;
    if (next < 0 || next >= images.length) return;
    idx = next;
    updateArrows();

    imgEl.classList.add('is-fading');
    const nextSrc = bestSrc(images[idx]);
    const pre = new Image();
    pre.onload = () => {
      setTimeout(() => {
        imgEl.src = nextSrc;
        imgEl.alt = images[idx].alt || '';
        imgEl.classList.remove('is-fading');
      }, FADE_MS);
    };
    pre.src = nextSrc;
  }

  imgEl.addEventListener('dragstart', (e) => e.preventDefault());

  document.addEventListener('click', (e) => {
    const img = e.target.closest(SELECTOR);
    if (!img) return;
    e.preventDefault();
    openAt(getImages().indexOf(img));
  }, {passive:false});

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.piLB__frame')) return;
    close();
  });

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(+1); });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(+1);
  });

  let sX = 0, sY = 0, swiping = false;
  overlay.addEventListener('pointerdown', (e) => { swiping = true; sX=e.clientX; sY=e.clientY; });
  overlay.addEventListener('pointerup', (e) => {
    if (!swiping) return;
    const dx = e.clientX - sX, dy = e.clientY - sY;
    swiping = false;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40){
      if (dx < 0) go(+1); else go(-1);
    }
  });
})();
