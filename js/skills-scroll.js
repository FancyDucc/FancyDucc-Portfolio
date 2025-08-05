/*  skills-scroll.js  —  no-snap ribbon (working version)  */
document.addEventListener('DOMContentLoaded', async () => {

  const SPEED = -90;           // px / s (negative = left)
  const SNAP  = 120;           // easing after drag

  const wrap  = document.getElementById('skill-strip');
  if (!wrap) return;
  const track = wrap.querySelector('.skill-track');
  const baseHTML = track.innerHTML;            // markup for ONE slice

  await document.fonts.ready;                  // wait for accurate widths

  let sliceW = 0;
  let pos    = 0, vel = SPEED;
  let drag   = false;
  let lastT  = performance.now();
  let lastPtr= lastT;

  /* -------------------------------------------------- */
  function retile () {

    /* 1 · build the first slice and measure it -------- */
    track.innerHTML = baseHTML;                // start fresh
    const first = track.firstElementChild;     // <-- this one **is** in the DOM
    const gap   = parseFloat(getComputedStyle(track).gap) || 0;
    sliceW = first.getBoundingClientRect().width + gap;

    /* 2 · clone until we cover >2× viewport ---------- */
    while (track.scrollWidth < innerWidth * 2 + sliceW)
      track.insertAdjacentHTML('beforeend', baseHTML);

    /* 3 · keep the current pos inside new width ------ */
    pos = ((pos % sliceW) + sliceW) % sliceW - sliceW;
  }
  retile();
  addEventListener('resize', retile);

  /* -------------------------------------------------- */
  const loop = t => {
    const dt = (t - lastT) / 1000;  lastT = t;

    if (!drag) {
      vel += (SPEED - vel) * Math.min(1, SNAP * dt / Math.abs(SPEED));
      pos += vel * dt;
    }
    pos = ((pos % sliceW) + sliceW) % sliceW - sliceW;   // perfect wrap
    track.style.transform = `translate3d(${pos}px,0,0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* -------------------------------------------------- */
  let id = null;
  wrap.addEventListener('pointerdown', e => {
    id   = e.pointerId;
    drag = true;
    vel  = 0;
    lastPtr = performance.now();
    wrap.setPointerCapture(id);
  });
  wrap.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== id) return;
    pos += e.movementX;
    const now = performance.now();
    vel = 1000 * e.movementX / Math.max(1, now - lastPtr);
    lastPtr = now;
  });
  const release = e => {
    if (e.pointerId !== id) return;
    drag = false;
    wrap.releasePointerCapture(id);
  };
  wrap.addEventListener('pointerup',     release);
  wrap.addEventListener('pointercancel', release);

  wrap.style.userSelect = 'none';
});
