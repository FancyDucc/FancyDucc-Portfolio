document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM moment");

  const loadLazyMedia = (element) => {
    if (!element.hasAttribute("data-src")) return;
    element.src = element.getAttribute("data-src");
    element.removeAttribute("data-src");
    if (element.tagName === "VIDEO") {
      element.load();
    }
  };

  const LazyElements = document.querySelectorAll("img[loading='lazy'], video, .portfolio-item, .custom-audio-player");
  const ScrollToTopBtn = document.getElementById("scrollToTopBtn");

  // lazy loading
  console.log("hello?");
  if ("IntersectionObserver" in window) {
    const LazyObserver = new IntersectionObserver(
      (Entries, Observer) => {
        Entries.forEach(entry => {
          if (entry.isIntersecting) {
            const LazyElement = entry.target;
            if (LazyElement.tagName === "IMG" || LazyElement.tagName === "VIDEO") {
              loadLazyMedia(LazyElement);
            }
            LazyElement.classList.add("visible-element");
            Observer.unobserve(LazyElement);
          }
        });
      },
      { rootMargin: "300px 0px", threshold: 0.1 }
    );

    LazyElements.forEach(element => {
      element.classList.add("hidden-element");
      LazyObserver.observe(element);
    });
  } else {
    LazyElements.forEach(element => {
      if (element.tagName === "IMG" || element.tagName === "VIDEO") {
        loadLazyMedia(element);
      }
      element.classList.add("visible-element");
    });
  }

  // Scroll-to-top button — rAF-throttled, no layout reads on every event.
  if (ScrollToTopBtn) {
    let previous = window.scrollY;
    let cachedHeight = document.documentElement.scrollHeight;
    let cachedWinH = window.innerHeight;
    let scrolling = false;
    let scrollAnimationFrame;
    let pending = false;
    let isShown = false;

    const cancelScroll = () => {
      if (scrolling) {
        scrolling = false;
        cancelAnimationFrame(scrollAnimationFrame);
        window.removeEventListener("wheel", cancelScroll);
        window.removeEventListener("touchmove", cancelScroll);
      }
    };

    const toTheTop = () => {
      cancelScroll();
      scrolling = true;
      const start = window.scrollY;
      const duration = 800;
      const startTime = performance.now();

      window.addEventListener("wheel", cancelScroll, { passive: true });
      window.addEventListener("touchmove", cancelScroll, { passive: true });

      const step = (currentTime) => {
        if (!scrolling) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, start * (1 - ease));

        if (progress < 1 && scrolling) {
          scrollAnimationFrame = requestAnimationFrame(step);
        } else {
          scrolling = false;
          window.removeEventListener("wheel", cancelScroll);
          window.removeEventListener("touchmove", cancelScroll);
        }
      };

      scrollAnimationFrame = requestAnimationFrame(step);
    };

    const setShown = (next) => {
      if (next === isShown) return;
      isShown = next;
      ScrollToTopBtn.classList.toggle("show", next);
    };

    const evaluate = () => {
      pending = false;
      const current = window.scrollY;
      const nearBottom = (cachedWinH + current) >= (0.9 * cachedHeight);
      const scrollingUp = current < previous && current > 50;
      setShown(nearBottom || scrollingUp);
      previous = current;
    };

    const onScroll = () => {
      if (scrolling) cancelScroll();
      if (!pending) {
        pending = true;
        requestAnimationFrame(evaluate);
      }
    };

    // Recompute cached layout reads only when they actually can change
    let resizeTimer;
    const refreshCache = () => {
      cachedHeight = document.documentElement.scrollHeight;
      cachedWinH = window.innerHeight;
    };
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshCache, 150);
    }, { passive: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollToTopBtn.addEventListener("click", toTheTop);
    refreshCache();
    evaluate();
  }
});

window.onload = function () {
  const PortfolioItems = document.querySelectorAll(".portfolio-item");
  const Images = Array.from(document.querySelectorAll(".portfolio-image"));
  const Lightbox = document.getElementById("lightbox");
  const LightboxImg = document.getElementById("lightbox-img");
  const PrevArrow = document.getElementById("lightbox-prev");
  const NextArrow = document.getElementById("lightbox-next");
  let CurrentIndex = -1;

  if (Lightbox && LightboxImg && Images.length > 0) {
    Images.forEach((image, index) => {
      image.addEventListener("click", function () {
        CurrentIndex = index;
        showImage(index, false);
        Lightbox.classList.add("active");
      });
    });

    function showImage(index, fade) {
      if (index < 0 || index >= Images.length) return;
      const newSrc = Images[index].src;
      if (fade) {
        LightboxImg.style.opacity = "0";
        setTimeout(() => {
          LightboxImg.src = newSrc;
          LightboxImg.style.opacity = "1";
        }, 300);
      } else {
        LightboxImg.src = newSrc;
        LightboxImg.style.opacity = "1";
      }
      PrevArrow.classList.toggle("show", index > 0);
      NextArrow.classList.toggle("show", index < Images.length - 1);
    }

    Lightbox.addEventListener("click", function (e) {
      if (!e.target.classList.contains("lightbox-arrow")) {
        Lightbox.classList.remove("active");
      }
    });

    PrevArrow.addEventListener("click", function (e) {
      e.stopPropagation();
      if (CurrentIndex > 0) {
        CurrentIndex--;
        showImage(CurrentIndex, true);
      }
    });

    NextArrow.addEventListener("click", function (e) {
      e.stopPropagation();
      if (CurrentIndex < Images.length - 1) {
        CurrentIndex++;
        showImage(CurrentIndex, true);
      }
    });
  }

  const ToggleButtons = document.querySelectorAll(".toggle-description");
  ToggleButtons.forEach(function (btn) {
    if (btn.dataset.descriptionBound === "true") return;

    const Caption = btn.parentElement;
    const ExtraDesc = Caption.querySelector(".portfolio-extra-description");

    if (ExtraDesc && ExtraDesc.textContent.trim() !== "") {
      btn.style.display = "block";
      btn.dataset.descriptionBound = "true";
      btn.addEventListener("click", function () {
        if (ExtraDesc.classList.contains("expanded")) {
          ExtraDesc.style.height = ExtraDesc.scrollHeight + "px";
          ExtraDesc.offsetHeight;
          ExtraDesc.style.height = "0";
          ExtraDesc.classList.remove("expanded");
          btn.innerHTML = 'Show Description <span class="arrow">&#x25BC;</span>';
        } else {
          ExtraDesc.style.height = ExtraDesc.scrollHeight + "px";
          ExtraDesc.classList.add("expanded");
          btn.innerHTML = 'Hide Description <span class="arrow">&#x25B2;</span>';
          ExtraDesc.addEventListener("transitionend", function handler() {
            if (ExtraDesc.classList.contains("expanded")) {
              ExtraDesc.style.height = "auto";
            }
            ExtraDesc.removeEventListener("transitionend", handler);
          });
        }
      });
    } else {
      btn.style.display = "none";
    }
  });

  const Toggles = document.querySelectorAll('.process-toggle');
  let IsAnimating = false;

  Toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      if (IsAnimating) return;
      IsAnimating = true;

      const Arrow = toggle.querySelector('.arrow');
      const Desc = toggle.nextElementSibling;
      if (!Desc) return;
      const IsCollapsed = !Desc.style.maxHeight || Desc.style.maxHeight === '0px';

      if (IsCollapsed) {
        Arrow.classList.add('rotated');
        Desc.style.transition = 'none';
        Desc.style.maxHeight = '-10px';
        Desc.offsetHeight;
        Desc.style.transition = 'max-height 0.4s ease';
        Desc.style.maxHeight = Desc.scrollHeight + 'px';
        Desc.addEventListener('transitionend', function handler(e) {
          if (e.target === Desc) {
            Desc.style.maxHeight = 'none';
            Desc.removeEventListener('transitionend', handler);
            IsAnimating = false;
          }
        });
      } else {
        Arrow.classList.remove('rotated');
        Desc.style.maxHeight = Desc.scrollHeight + 'px';
        Desc.offsetHeight;
        Desc.style.maxHeight = '0px';
        Desc.addEventListener('transitionend', function handler(e) {
          if (e.target === Desc) {
            Desc.removeEventListener('transitionend', handler);
            IsAnimating = false;
          }
        });
      }
    });
  });
};
