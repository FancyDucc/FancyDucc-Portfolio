document.addEventListener('DOMContentLoaded', async () => {

  const SPEED = -90;
  const SNAP  = 120;

  const wrap  = document.getElementById('skill-strip');
  if (!wrap) return;
  const track = wrap.querySelector('.skill-track');
  const baseHTML = track.innerHTML;

  await document.fonts.ready;

  let sliceW = 0;
  let pos    = 0, vel = SPEED;
  let drag   = false;
  let lastT  = performance.now();
  let lastPtr= lastT;

  function retile () {
    track.innerHTML = baseHTML;
    const first = track.firstElementChild;
    const gap   = parseFloat(getComputedStyle(track).gap) || 0;
    sliceW = first.getBoundingClientRect().width + gap;

    while (track.scrollWidth < innerWidth * 2 + sliceW)
      track.insertAdjacentHTML('beforeend', baseHTML);

    pos = ((pos % sliceW) + sliceW) % sliceW - sliceW;
  }
  retile();
  addEventListener('resize', retile);

  const loop = t => {
    const dt = (t - lastT) / 1000;  lastT = t;

    if (!drag) {
      vel += (SPEED - vel) * Math.min(1, SNAP * dt / Math.abs(SPEED));
      pos += vel * dt;
    }
    pos = ((pos % sliceW) + sliceW) % sliceW - sliceW;
    track.style.transform = `translate3d(${pos}px,0,0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

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
