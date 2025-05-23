document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM moment");

  const LazyElements = document.querySelectorAll("img[loading='lazy'], video, .portfolio-item, .custom-audio-player");
  const ScrollToTopBtn = document.getElementById("scrollToTopBtn");

  // lazy loading
  console.log("hello?");
  if ("IntersectionObserver" in window) {
    const LazyObserver = new IntersectionObserver(
      (Entries, Observer) => {
        Entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio === 1) {
            const LazyElement = entry.target;
            if (LazyElement.tagName === "IMG" || LazyElement.tagName === "VIDEO") {
              if (LazyElement.hasAttribute("data-src")) {
                LazyElement.src = LazyElement.getAttribute("data-src");
                LazyElement.removeAttribute("data-src");
              }
            }
            LazyElement.classList.add("visible-element");
            Observer.unobserve(LazyElement);
          }
        });
      },
      { threshold: 1 }
    );

    LazyElements.forEach(element => {
      element.classList.add("hidden-element");
      LazyObserver.observe(element);
    });
  } else {
    LazyElements.forEach(element => {
      if (element.tagName === "IMG" || element.tagName === "VIDEO") {
        if (element.hasAttribute("data-src")) {
          element.src = element.getAttribute("data-src");
          element.removeAttribute("data-src");
        }
      }
      element.classList.add("visible-element");
    });
  }

  // scrroll to top
  if (ScrollToTopBtn) {
    let Previous = window.scrollY;
    let Scrolling = false;
    let scrollAnimationFrame;

    const CancelScroll = () => {
      if (Scrolling) {
        Scrolling = false;
        cancelAnimationFrame(scrollAnimationFrame);
        window.removeEventListener("wheel", onUserScroll, { passive: true });
        window.removeEventListener("touchmove", onUserScroll, { passive: true });
      }
    };
  
    const onUserScroll = () => {
      CancelScroll();
    };

    const ToTheTop = () => {
      CancelScroll();
      Scrolling = true;
      const Start = window.scrollY;
      const Duration = 800;
      const StartTime = performance.now();
  
      window.addEventListener("wheel", CancelScroll, { passive: true });
      window.addEventListener("touchmove", CancelScroll, { passive: true });
  
      const step = (CurrentTime) => {
        if (!Scrolling) return;
        const Elapsed = CurrentTime - StartTime;
        const Progress = Math.min(Elapsed / Duration, 1);
        const Ease = 1 - Math.pow(1 - Progress, 3);
        const NewPosition = Start * (1 - Ease);
        window.scrollTo(0, NewPosition);
  
        if (Progress < 1 && Scrolling) {
          scrollAnimationFrame = requestAnimationFrame(step);
        } else {
          Scrolling = false;
          window.removeEventListener("wheel", CancelScroll, { passive: true });
          window.removeEventListener("touchmove", CancelScroll, { passive: true });
        }
      };
  
      scrollAnimationFrame = requestAnimationFrame(step);
    };
  
    const Toggle = () => {
      let Current = window.scrollY;
      const Height = document.documentElement.scrollHeight;
      const WindowHeight = window.innerHeight;
      const NearBottom = (WindowHeight + Current) >= (0.9 * Height);
  
      if (NearBottom) {
        ScrollToTopBtn.classList.add('show');
        ScrollToTopBtn.classList.remove('hide');
      } else {
        if (Current < Previous && Current > 50) {
          ScrollToTopBtn.classList.add('show');
          ScrollToTopBtn.classList.remove('hide');
        } else {
          ScrollToTopBtn.classList.add('hide');
          ScrollToTopBtn.classList.remove('show');
        }
      }
      Previous = Current;
    };
  
    window.addEventListener("scroll", () => {
      if (Scrolling) {
        CancelScroll();
      }
      Toggle();
    });
  
    ScrollToTopBtn.addEventListener("click", ToTheTop);
    Toggle();
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
    const Caption = btn.parentElement;
    const ExtraDesc = Caption.querySelector(".portfolio-extra-description");

    if (ExtraDesc && ExtraDesc.textContent.trim() !== "") {
      btn.style.display = "block";
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