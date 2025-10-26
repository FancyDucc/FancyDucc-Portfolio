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
    text: "Very good service, he's just really cracked at what he does and fast, he's also really passionate on the stuff he works on."
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
    text: "genuinely rly sick animation work and was extremly fast, would recommend 🙏"
  },
  {
    author: "Polyograthyms",
    stars: 5,
    text: "working with you was very nice, you were dedicated through any task i gave you"
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