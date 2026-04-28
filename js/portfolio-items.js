document.addEventListener("DOMContentLoaded", async () => {
  const grids = document.querySelectorAll("[data-portfolio-category]");
  if (!grids.length) return;

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const defaultCol = (category) => {
    if (category === "animation" || category === "scripting" || category === "vfx") {
      return "col-lg-3 col-md-6 col-sm-12";
    }
    return "col-lg-4 col-md-6 col-sm-12";
  };

  const asArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value == null) return [];
    return [value];
  };

  const inferMediaType = (src) => {
    const cleanSrc = String(src || "").split("?")[0].split("#")[0].toLowerCase();
    if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(cleanSrc)) return "image";
    return "video";
  };

  const renderDescription = (item) => {
    const htmlItems = asArray(item.descriptionHtml);
    const textItems = asArray(item.description);
    const mediaItems = [
      ...asArray(item.descriptionMedia),
      ...asArray(item.descriptionVideos).map((media) => (
        typeof media === "string" ? { src: media, mediaType: "video" } : { ...media, mediaType: media.mediaType || "video" }
      )),
      ...asArray(item.descriptionImages).map((media) => (
        typeof media === "string" ? { src: media, mediaType: "image" } : { ...media, mediaType: media.mediaType || "image" }
      ))
    ];
    const parts = [
      ...htmlItems.map((line) => `<p>${line}</p>`),
      ...textItems.map((line) => `<p>${escapeHtml(line)}</p>`),
      ...mediaItems.map((media) => renderDescriptionMedia(media))
    ];

    if (!parts.length) return "";

    return `
      <div class="portfolio-extra-description">
        ${parts.join("")}
      </div>
      <button class="toggle-description" type="button" style="display: none;">
        Show Description <span class="arrow">&#x25BC;</span>
      </button>
    `;
  };

  const renderDescriptionMedia = (media) => {
    if (typeof media === "string") {
      media = { src: media };
    }
    if (!media?.src) return "";

    const src = escapeHtml(media.src);
    const mediaType = media.mediaType || inferMediaType(media.src);
    const alt = escapeHtml(media.alt || media.title || "Description media");
    const title = media.title
      ? `<div class="portfolio-description-media-title">${escapeHtml(media.title)}</div>`
      : "";

    if (mediaType === "image") {
      return `
        <figure class="portfolio-description-media">
          <img class="portfolio-image" src="${src}" alt="${alt}" loading="lazy">
          ${title}
        </figure>
      `;
    }

    return `
      <figure class="portfolio-description-media">
        <video data-src="${src}" preload="metadata" playsinline aria-label="${alt}" ${media.controls === false ? "" : "controls"} ${media.muted ? "muted" : ""} ${media.loop ? "loop" : ""} ${media.autoplay ? "autoplay" : ""}></video>
        ${title}
      </figure>
    `;
  };

  const renderMedia = (item) => {
    if (!item.src) return "";
    const alt = escapeHtml(item.alt || item.title || "Portfolio item");
    const src = escapeHtml(item.src);

    if (item.mediaType === "video") {
      return `<video class="img-fluid" data-src="${src}" preload="metadata" playsinline aria-label="${alt}" controls></video>`;
    }

    return `<img class="img-fluid portfolio-image" src="${src}" alt="${alt}" loading="lazy">`;
  };

  const renderItem = (item, category) => {
    const colClass = item.columnClass || defaultCol(category);
    const title = item.title ? `<div class="portfolio-caption-heading">${escapeHtml(item.title)}</div>` : "";
    const date = item.date ? `<div class="portfolio-caption-subheading text-muted">${escapeHtml(item.date)}</div>` : "";

    return `
      <div class="${colClass}">
        <div class="portfolio-item">
          ${renderMedia(item)}
          <div class="portfolio-caption">
            ${title}
            ${date}
            ${renderDescription(item)}
          </div>
        </div>
      </div>
    `;
  };

  const renderSection = (section, category, index) => {
    const sectionId = `portfolio-section-${category}-${index}`;
    const sectionItems = Array.isArray(section.items) ? section.items : [];
    const isOpen = !!section.defaultOpen;
    const colClass = section.columnClass || "col-12";
    const description = section.description
      ? `<p class="portfolio-section-description">${escapeHtml(section.description)}</p>`
      : "";

    return `
      <div class="${colClass} portfolio-section-col">
        <section class="portfolio-section-block ${isOpen ? "is-open" : ""}">
          <button class="portfolio-section-toggle" type="button" aria-expanded="${isOpen}" aria-controls="${sectionId}">
            <span>
              <span class="portfolio-section-title">${escapeHtml(section.title || "Portfolio Section")}</span>
              ${description}
            </span>
          </button>
        </section>
      </div>
      <div class="col-12 portfolio-section-panel ${isOpen ? "is-open" : ""}" id="${sectionId}" aria-hidden="${!isOpen}">
        <div class="row">
          ${sectionItems.map((item) => renderItem(item, category)).join("")}
        </div>
      </div>
    `;
  };

  const renderEntry = (entry, category, index) => {
    if (entry.type === "section" || Array.isArray(entry.items)) {
      return renderSection(entry, category, index);
    }

    return renderItem(entry, category);
  };

  const setupDescriptionToggles = (root) => {
    root.querySelectorAll(".toggle-description").forEach((btn) => {
      const caption = btn.parentElement;
      const extraDesc = caption?.querySelector(".portfolio-extra-description");

      if (!extraDesc || !extraDesc.children.length) {
        btn.style.display = "none";
        return;
      }

      btn.style.display = "block";
      btn.dataset.descriptionBound = "true";
      btn.addEventListener("click", () => {
        if (extraDesc.classList.contains("expanded")) {
          extraDesc.style.height = `${extraDesc.scrollHeight}px`;
          extraDesc.offsetHeight;
          extraDesc.style.height = "0";
          extraDesc.classList.remove("expanded");
          btn.innerHTML = 'Show Description <span class="arrow">&#x25BC;</span>';
        } else {
          extraDesc.style.height = `${extraDesc.scrollHeight}px`;
          extraDesc.classList.add("expanded");
          btn.innerHTML = 'Hide Description <span class="arrow">&#x25B2;</span>';
          setupLazyVideos(extraDesc);
          extraDesc.addEventListener("transitionend", function handler() {
            if (extraDesc.classList.contains("expanded")) {
              extraDesc.style.height = "auto";
            }
            extraDesc.removeEventListener("transitionend", handler);
          });
        }
      });
    });
  };

  const setupSectionToggles = (root) => {
    root.querySelectorAll(".portfolio-section-toggle").forEach((btn) => {
      const section = btn.closest(".portfolio-section-block");
      const items = document.getElementById(btn.getAttribute("aria-controls"));
      if (!section || !items) return;

      btn.addEventListener("click", () => {
        const isOpen = section.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
        items.classList.toggle("is-open", isOpen);
        items.setAttribute("aria-hidden", String(!isOpen));
        if (isOpen) {
          setupLazyVideos(items);
        }
      });
    });
  };

  const loadVideo = (video) => {
    if (!video?.dataset.src) return;
    video.src = video.dataset.src;
    delete video.dataset.src;
    video.load();
  };

  const setupLazyVideos = (root) => {
    const videos = Array.from(root.querySelectorAll("video[data-src]")).filter((video) => {
      if (video.dataset.lazyBound === "true") return false;
      return !video.closest(".portfolio-section-panel:not(.is-open)");
    });
    if (!videos.length) return;

    if (!("IntersectionObserver" in window)) {
      videos.forEach(loadVideo);
      return;
    }

    const observer = new IntersectionObserver((entries, videoObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideo(entry.target);
        videoObserver.unobserve(entry.target);
      });
    }, { rootMargin: "450px 0px", threshold: 0.01 });

    videos.forEach((video) => {
      video.dataset.lazyBound = "true";
      observer.observe(video);
      video.addEventListener("pointerdown", () => loadVideo(video), { once: true });
      video.addEventListener("focus", () => loadVideo(video), { once: true });
    });
  };

  try {
    const response = await fetch("/assets/portfolio-items.json");
    if (!response.ok) throw new Error(`Portfolio data returned ${response.status}`);

    const data = await response.json();
    grids.forEach((grid) => {
      const category = grid.dataset.portfolioCategory;
      const items = data[category] || [];
      grid.innerHTML = items.map((item, index) => renderEntry(item, category, index)).join("");
      setupSectionToggles(grid);
      setupDescriptionToggles(grid);
      setupLazyVideos(grid);
    });
  } catch (error) {
    console.error("Unable to load portfolio items:", error);
  }
});
