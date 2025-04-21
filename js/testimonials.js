const testimonials = [
  {
    author: "JustPlain",
    stars: 4.5,
    text: "You are a really good friend to work with, you have some other nicer qualities you don't mention, but you are nice to work with and are helpful."
  },
  {
    author: "TuxLinux",
    stars: 4,
    text: "i have worked with you on a few games, and you always get me good work, animations are very good, your buildings are very good also"
  },
  {
    author: "Z1mbe",
    stars: 5,
    text: "Your work went past the rest of the dev team's thoughts lol, your animations were smooth, and you are somehow the best at scripting in the team."
  },
  {
    author: "Lighty_42 - Owner of DOORS: Paradox",
    stars: 5,
    text: "Very good service, he's just really cracked at what he does and fast, he's also really passionate on the stuff he works on."
  },
  {
    author: "wenuxxe - Owner of The Deepstorm & The Underside",
    stars: 5,
    text: "Literally for less than 2 hours made the task, after payment once gave the file and helped to understand the scripts."
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
    author: "Polyograthyms",
    stars: 5,
    text: "Working with you was very nice, you were dedicated through the full game and tbh were the funniest person on the team by far. You are also very creative, which isn't very common anymore."
  }
];

const container = document.getElementById("testimonialsContainer");

function stars(rating){
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const empty = 5 - full - (half?1:0);

  return [
    ...Array(full).fill('<span class="star full"></span>'),
    ...(half ? ['<span class="star half"></span>'] : []),
    ...Array(empty).fill('<span class="star"></span>')
  ].join('');
}

testimonials.forEach(t => {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 fade-up";

  col.innerHTML = `
    <div class="testimonial-card h-100">
      <div class="testimonial-rating mb-2" style="color:#f5c518;">
        ${stars(t.stars)}
      </div>
      <p class="testimonial-text mb-3">${t.text}</p>
      <div class="testimonial-author text-muted fw-semibold">- ${t.author} -</div>
    </div>
  `;
  container.appendChild(col);
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