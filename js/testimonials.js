const testimonials = [
  {
    author: "JustPlain",
    stars: 4.5,
    text: "you are a really good friend to work with, you have some other nicer things you don't mention, but you are nice to work with and are helpful."
  },
  {
    author: "TuxLinux",
    stars: 5,
    text: "literally just the best at everything, HIRE THIS MAN"
  },
  {
    author: "Z1mbe",
    stars: 5,
    text: "Your work went past the rest of the dev team's thoughts lol, your animations were smooth, and you are somehow the best at scripting in the team."
  },
  {
    author: "Lighty_42 - Owner of DOORS: Paradox",
    stars: 5,
    text: "Very good service, he's just really cracked at what he does and fast, he's also really passionate on the stuff he works on.",
    gameLink: "https://www.roblox.com/games/95959136210771/PARADOX",
    banner: "/assets/img/portfolio/Paradox.webp"
  },
  {
    author: "Evan - Owner of Interliminality",
    stars: 5,
    text: "very happy with the final result! work flow was extremely fast and very productive - very accepting of criticism and feedback if needed",
    gameLink: "https://www.roblox.com/games/14237585680/Interliminality",
    banner: "/assets/img/portfolio/Interliminality.webp"
  },
  {
    author: "wenuxxe - Owner of The Deepstorm & The Underside",
    stars: 5,
    text: "Literally for less than 2 hours made the task, after payment once gave the file and helped to understand the scripts."
  },
  {
    author: "Failworks - Owner of Doorways",
    stars: 5,
    text: "Had a teaser due in the same day i received the model, i hit up Ducc and he absolutely smashed it out of the park, seriously saved us trouble and helped out asap, seriously, one of the coolest people out there (hire this guy)"
  },
  {
    author: "Pingolein",
    stars: 5,
    text: "Service was fast, extremely good results, and overall just extremely skilled at LITERALLY EVERYTHING!"
  },
  {
    author: "RealAndresYas110",
    stars: 4.5,
    text: "your 3D modeling isn't perfect, but it isn't bad by any means, it's still good"
  },
  {
    author: "Sam - Owner of Unpaid Workers and Sillygoofs",
    stars: 4.5,
    text: "Fancy Ducc is honestly one of the best people ive worked with, his work flow and quality is beyond expectations"
  },
  {
    author: "Slyifern - Commissioner of The Foundation",
    stars: 5,
    text: "genuinely rly sick animation work and was extremly fast, would recommend 🙏",
    gameLink: "https://www.roblox.com/games/18186775539/THE-FOUNDATION",
    banner: "/assets/img/portfolio/Foundation.webp"
  },
  {
    author: "Polyograthyms",
    stars: 5,
    text: "working with you was very nice, you were dedicated through any task i gave you"
  }
];

const container = document.getElementById("testimonialsContainer");

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const empty = 5 - full - (half ? 1 : 0);

  return [
    ...Array(full).fill('<span class="star full"></span>'),
    ...(half ? ['<span class="star half"></span>'] : []),
    ...Array(empty).fill('<span class="star"></span>')
  ].join("");
}

function placeIdFromRobloxUrl(url) {
  const match = String(url || "").match(/roblox\.com\/games\/(\d+)/i);
  return match ? match[1] : "";
}

function formatVisits(visits) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(visits);
}

async function loadVisits(testimonial, visitsEl) {
  const placeId = placeIdFromRobloxUrl(testimonial.gameLink);
  if (!placeId) return;

  return;

  // five server and static hosting cannot proxy Roblox APIs for some stupid reason, so this is disabled
  // try {
  //   const response = await fetch(`/api/roblox/game-visits?placeId=${encodeURIComponent(placeId)}`);
  //   if (!response.ok) return;

  //   const data = await response.json();
  //   if (typeof data.visits !== "number") return;

  //   visitsEl.textContent = `${formatVisits(data.visits)} visits`;
  //   visitsEl.hidden = false;
  // } catch {
  // }
}

function createTestimonial(testimonial) {
  const col = document.createElement("div");
  col.className = "col-lg-4 col-md-6 col-sm-12 fade-up";

  const card = document.createElement("article");
  card.className = "testimonial-card showcase-card h-100";
  if (testimonial.banner) {
    card.classList.add("testimonial-card-with-banner");
    card.style.setProperty("--testimonial-bg-image", `url("${encodeURI(testimonial.banner)}")`);
  }

  const rating = document.createElement("div");
  rating.className = "testimonial-rating mb-2";
  rating.innerHTML = stars(testimonial.stars);

  const text = document.createElement("p");
  text.className = "testimonial-text mb-3";
  text.textContent = testimonial.text;

  const meta = document.createElement("div");
  meta.className = "testimonial-meta";

  const author = document.createElement("div");
  author.className = "testimonial-author text-muted fw-semibold";
  author.textContent = `${testimonial.author}`;
  meta.appendChild(author);

  if (testimonial.gameLink) {
    const link = document.createElement("a");
    link.className = "testimonial-game-link";
    link.href = testimonial.gameLink;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "View game";
    meta.appendChild(link);

    const visits = document.createElement("div");
    visits.className = "testimonial-visits";
    visits.hidden = true;
    meta.appendChild(visits);
    loadVisits(testimonial, visits);
  }

  card.append(rating, text, meta);
  col.appendChild(card);
  return col;
}

testimonials.forEach((testimonial) => {
  container.appendChild(createTestimonial(testimonial));
});

const reveal = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".fade-up").forEach(el => reveal.observe(el));
