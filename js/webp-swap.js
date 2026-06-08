// Swaps <img src="...png"> to ".webp" when a WebP version exists.
// Uses the manifest emitted by scripts/webp-manifest.js.
// PNG fallback kicks in via onerror if the WebP fails for any reason.
(function () {
  if (!window.__WEBP_MANIFEST__) return;
  const manifest = window.__WEBP_MANIFEST__;

  const toWebp = (url) => {
    if (!url) return null;
    if (!/\.png(\?|#|$)/i.test(url)) return null;
    // Normalize to absolute pathname (manifest entries are root-relative)
    let pathname;
    try {
      pathname = new URL(url, location.origin).pathname;
    } catch {
      pathname = url.split('?')[0];
    }
    const webpPath = pathname.replace(/\.png$/i, '.webp');
    return manifest.has(webpPath) ? webpPath : null;
  };

  const swapImg = (img) => {
    if (img.dataset.webpHandled === '1') return;

    // Handle data-src (lazy loader): swap that instead and let the loader continue.
    if (img.hasAttribute('data-src')) {
      const ds = img.getAttribute('data-src');
      const webp = toWebp(ds);
      if (webp) {
        img.dataset.pngFallback = ds;
        img.setAttribute('data-src', webp);
        img.dataset.webpHandled = '1';
      }
      return;
    }

    const src = img.getAttribute('src');
    const webp = toWebp(src);
    if (!webp) return;
    img.dataset.pngFallback = src;
    img.dataset.webpHandled = '1';
    img.addEventListener('error', function once() {
      if (img.dataset.fellBack === '1') return;
      img.dataset.fellBack = '1';
      img.src = img.dataset.pngFallback;
    }, { once: true });
    img.src = webp;
  };

  const scan = (root) => {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('img').forEach(swapImg);
  };

  // Initial scan
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan(document));
  } else {
    scan(document);
  }

  // Catch dynamically inserted images (portfolio-items.js, testimonials.js, etc.)
  if ('MutationObserver' in window) {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') swapImg(n);
          else scan(n);
        });
        if (m.type === 'attributes' && m.target.tagName === 'IMG') {
          // src changed externally — re-evaluate (but skip our own swap)
          if (m.target.dataset.webpHandled !== '1') swapImg(m.target);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'data-src'] });
  }
})();
