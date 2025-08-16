/* ===== Fancy Ducc Lightbox: gradient frame + blur + magnifier + arrows ===== */
(() => {
  const SELECTOR = '.portfolio-image';
  const IMG_ATTR_FULL = 'data-full';
  const OPEN_ANIM_MS = 220;
  const FADE_MS = 160;

  // Build overlay once
  const overlay = document.createElement('div');
  overlay.className = 'piLB';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-label','Image viewer');
  overlay.innerHTML = `
    <div class="piLB__frame" tabindex="-1">
      <div class="piLB__imgWrap">
        <img class="piLB__img" alt="">
        <div class="piLB__lens" hidden></div>
        <div class="piLB__cap"></div>
      </div>
      <button class="piLB__arrow piLB__arrow--L" type="button" aria-label="Previous">‹</button>
      <button class="piLB__arrow piLB__arrow--R" type="button" aria-label="Next">›</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const frame   = overlay.querySelector('.piLB__frame');
  const imgEl   = overlay.querySelector('.piLB__img');
  const lens    = overlay.querySelector('.piLB__lens');
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
      lens.style.backgroundImage = `url("${src}")`;

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
      lens.classList.remove('is-on');
      lens.hidden = true;
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
        lens.style.backgroundImage = `url("${nextSrc}")`;
        imgEl.alt = images[idx].alt || '';
        imgEl.classList.remove('is-fading');
      }, FADE_MS);
    };
    pre.src = nextSrc;
  }

  // ===== Magnifier (press/hold) =====
  let zoom = 2.0;
  const minZoom = 1.5;
  const maxZoom = 5.0;

  function lensOn() {
    lens.hidden = false;
    lens.classList.add('is-on');
  }
  function lensOff() {
    lens.classList.remove('is-on');
    lens.hidden = true;
  }

  function moveLens(clientX, clientY) {
    const r   = imgEl.getBoundingClientRect();
    const wrap = overlay.querySelector('.piLB__imgWrap');
    const wr  = wrap.getBoundingClientRect();

    const size = lens.offsetWidth;
    const half = size / 2;

    // Clamp the *center* point to the image edges (lens can overflow visually)
    const cx = Math.max(r.left, Math.min(clientX, r.right));
    const cy = Math.max(r.top ,  Math.min(clientY, r.bottom));

    // Position lens relative to the wrapper's coordinate space
    lens.style.left = (cx - wr.left - half) + 'px';
    lens.style.top  = (cy - wr.top  - half) + 'px';

    // Background sizing in pixels (prevents the “mirror/crop” look)
    const zoomW = r.width  * zoom;
    const zoomH = r.height * zoom;
    lens.style.backgroundSize = `${zoomW}px ${zoomH}px`;

    // Center the magnified area under the lens center
    const xRatio = (cx - r.left) / r.width;
    const yRatio = (cy - r.top ) / r.height;
    const bgX = xRatio * zoomW - half;
    const bgY = yRatio * zoomH - half;
    lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  }


  // Desktop: hold left button to show lens and drag
  imgEl.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    lensOn();
    moveLens(e.clientX, e.clientY);

    const move = (ev) => moveLens(ev.clientX, ev.clientY);
    const up = () => {
      lensOff();
      window.removeEventListener('pointermove', move, {passive:false});
      window.removeEventListener('pointerup', up, {passive:false});
      window.removeEventListener('pointercancel', up, {passive:false});
    };

    window.addEventListener('pointermove', move, {passive:false});
    window.addEventListener('pointerup', up, {passive:false});
    window.addEventListener('pointercancel', up, {passive:false});
  }, {passive:false});

  // Disable default drag ghost on images
  imgEl.addEventListener('dragstart', (e) => e.preventDefault());

  // Wheel zoom while lens is visible
  overlay.addEventListener('wheel', (e) => {
    if (lens.hidden) return;
    e.preventDefault();
    const d = Math.sign(e.deltaY);
    zoom = Math.max(minZoom, Math.min(maxZoom, zoom - d*0.2));
    // use last known mouse position if available
    moveLens(e.clientX ?? (imgEl.getBoundingClientRect().left + imgEl.width/2),
             e.clientY ?? (imgEl.getBoundingClientRect().top  + imgEl.height/2));
  }, {passive:false});

  // Touch: press & move; pinch to zoom
  let touching = false;
  let lastDist = 0;
  const dist = (t) => {
    if (t.length < 2) return 0;
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx,dy);
  };
  imgEl.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    touching = true;
    lensOn();
    moveLens(e.touches[0].clientX, e.touches[0].clientY);
    lastDist = dist(e.touches);
  }, {passive:true});
  imgEl.addEventListener('touchmove', (e) => {
    if (!touching) return;
    if (e.touches.length >= 2){
      const d = dist(e.touches);
      if (lastDist){
        const delta = (d - lastDist) / 120;
        zoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
      }
      lastDist = d;
    } else {
      moveLens(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, {passive:true});
  imgEl.addEventListener('touchend', () => { touching = false; lensOff(); lastDist = 0; }, {passive:true});
  imgEl.addEventListener('touchcancel', () => { touching = false; lensOff(); lastDist = 0; }, {passive:true});

  // ===== Open / Close / Navigate =====
  document.addEventListener('click', (e) => {
    const img = e.target.closest(SELECTOR);
    if (!img) return;
    e.preventDefault();
    openAt(getImages().indexOf(img));
  }, {passive:false});

  // Close only when clicking the dimmed backdrop (NOT inside the frame)
  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.piLB__frame')) return;
    close();
  });

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(+1); });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(+1);
  });

  // swipe (simple)
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