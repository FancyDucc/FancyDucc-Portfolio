document.addEventListener("DOMContentLoaded", function () {
  const games = [
    { title: "Inbetween", start: "2025-07", end: "Present", description: "I've picked this game back up, this time with a full team, currently in pre-production and writing. Full development will begin soon.", image: "/assets/img/portfolio/Inbetween Entrance.png", link: null },
    { title: "The Foundation", start: "2025-09", end: "2025-09", description: "Animated for a commision for the Graveyard Update.", image: "/assets/img/portfolio/Foundation.png",  link: "https://www.roblox.com/games/18186775539/THE-FOUNDATION" },
    { title: "Unseen Floors", start: "2024-12", end: "2025-02", description: "A Developer for another DOORS fangame called Unseen Floors, I left the team to focus on Paradox and later the game was cancelled.", link: null },
    { title: "PARADOX", start: "2024-11", end: "Present", description: "Co-Owner for a DOORS fangame known as Paradox, I am a Builder, Scripter, Animator, Sound Designer, VFX Artist, and Modeler, I was recently promoted to co-owner.", image: "/assets/img/portfolio/Paradox.png", link: "https://www.roblox.com/games/95959136210771/PARADOX" },
    { title: "Sane", start: "2024-10", end: "2025-04", description: "Creator and owner of a realistic and lore filled horror game, the goal behind visuals is making it look like a showcase game with the gameplay of a well-thought out horror game. Actively Under Development", image: "/assets/img/portfolio/Sane Living Room.png", link: null },
    { title: "Throw Bricks At People", start: "2024-07", end: "2024-11", description: "Main developer in a full and large team, I eventually lowered how much I was involved. I still periodically help out with the game when it is needed.", link: null },
    { title: "Inbetween", start: "2024-04", end: "2024-07", description: "Inspired by Interliminality, full 11 section game with a story, I was the main creator, collaborating with friends, the game was cancelled and development ceased due to the game not being fun.", image: "/assets/img/portfolio/Inbetween Puzzle.png", link: null },
    { title: "Interliminality", start: "2024-03", end: "2024-04", description: "Second large impact and role for a large game, I enjoyed the time I worked on this game, I was an Animator, Scripter, and Builder.", image: "/assets/img/portfolio/Interliminality Things Warehouse.png", link: "https://www.roblox.com/games/14237585680/5-24-24-Interliminality-ALPHA-1-1-5" },
    { title: "Terra-Isle", start: "2024-02", end: "2024-02", description: "Only creator, made in 13 hours without breaks. Successor to The Island", image: "/assets/img/portfolio/Terraisle1.png", link: "https://www.roblox.com/games/16404803992/Terra-Isle" },
    { title: "Enigma", start: "2023-07", end: "2023-11", description: "Original horror game that had a story, ideas, and full set plan. Sadly Roblox had other plans and removed the game for a DMCA strike, only later that month reopening the game again", image: "/assets/img/portfolio/Enigma Hallway.png", link: null },
    { title: "Cozy Cuddle", start: "2023-06", end: "2023-06", description: "Second collaboration with a large horror game group, I was a scripter, animator, and UI designer, I quit soon after joining as the work environment was unfriendly and development was far far FAR too slow", link: null },
    { title: "The Bunker", start: "2023-08", end: "2024-01", description: "A game collaborated with Vizion, a close friend and a fellow game developer, this game was made throughout teaching my friend how to make a game and to actually make one on the way", link: null },
    { title: "Cutscene", start: "2023-06", end: "2023-06", description: "My first cutscene game, I am still mildly proud of this project, I made this to challenge my animation abilities, this entire thing was made in 2 days. This was before I knew how to animate in Blender.", link: "https://www.roblox.com/games/13695671920/Cutscene" },
    { title: "Quantum Decay", start: "2023-07", end: "2023-07", description: "Entire main menu, sound design, systems and the entire game made in 48 hours, no reason, just boredom.", image: "/assets/img/portfolio/Quantum Decay Main Menu.png", link: "https://www.roblox.com/games/14084341057/Quantum-Decay" },
    { title: "Totally Epic Sword Battles", start: "2023-03", end: "2023-06", description: "PvP Sword game, duo collaboration, main developer", link: null },
    { title: "The Frontrooms", start: "2022-11", end: "2022-12", description: "Another horror game, was made when the backrooms started to pop up everywhere, decided to get on the train, development paused due to it not being original and also.. the frontrooms? seriously??", link: null },
    { title: "Noob Attack", start: "2022-02", end: "2022-06", description: "Almost a full game, inspired by Defend the Statue and got the original creator of DtS on board, almost made it to release, was the main developer.", link: null },
    { title: "Melee Blitz", start: "2021-06", end: "2021-11", description: "Collaboration with a medium-sized studio, I was the main animator and a map designer", link: null },{ title: "Vindigo", start: "2020-12", end: "2021-01", description: "Another horror game that nearly finished, made it quite far in development but burnout was the death of it.", link: null },
    { title: "Planet Artifact", start: "2020-11", end: "2020-11", description: "First attempt at an open world game, did not get past alpha.", link: null },
    { title: "What Happened", start: "2020-06", end: "2020-07", description: "Solo horror game made in 1 week, it sucked, I was not as good as I am now.", link: null }
  ];

  const gameList = document.getElementById("game-list");
  if (!gameList) {
    console.log("game list unsuccessful, ok this either means the website broke or ur on a page without a game list needed");
    return;
  }

  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1);
  };

  const setCardImage = (card, src, title) => {
    if (!src) return;

    const media = document.createElement("div");
    media.className = "game-card-media";

    const img = document.createElement("img");
    img.className = "portfolio-image";
    img.src = src;
    img.alt = `${title} preview`;
    img.loading = "lazy";

    media.appendChild(img);
    card.querySelector(".game-card-inner")?.prepend(media);
    card.classList.add("game-card-with-image");
    card.classList.remove("game-card-feature");
    card.closest(".game-card-col")?.classList.remove("game-card-feature-col");
  };

  const setupDescriptionToggle = (text) => {
    requestAnimationFrame(() => {
      if (text.scrollHeight <= text.clientHeight + 2) return;

      const button = document.createElement("button");
      button.className = "game-card-description-toggle";
      button.type = "button";
      button.textContent = "Show more";
      button.setAttribute("aria-expanded", "false");

      button.addEventListener("click", () => {
        const expanded = text.classList.toggle("is-expanded");
        button.textContent = expanded ? "Show less" : "Show more";
        button.setAttribute("aria-expanded", String(expanded));
      });

      text.after(button);
    });
  };

  const createGameCard = (game) => {
    const col = document.createElement("div");
    col.className = "game-card-col";
    if (!game.image) {
      col.classList.add("game-card-feature-col");
    }

    const card = document.createElement("div");
    card.className = `card fade-in-item game-card showcase-card ${game.image ? "game-card-with-image" : "game-card-feature"}`;

    const inner = document.createElement("div");
    inner.className = "game-card-inner";
    card.appendChild(inner);

    if (game.image) {
      setCardImage(card, game.image, game.title);
    }

    const content = document.createElement("div");
    content.className = "game-card-content";

    const title = document.createElement("h5");
    title.className = "card-title game-card-title";

    if (game.link) {
      const titleLink = document.createElement("a");
      titleLink.className = "hover-link game-card-title-link";
      titleLink.href = game.link;
      titleLink.target = "_blank";
      titleLink.rel = "noopener";
      titleLink.textContent = game.title;
      title.appendChild(titleLink);
    } else {
      title.textContent = game.title;
    }

    const date = document.createElement("div");
    date.className = "game-card-date";
    date.textContent = `${game.start} - ${game.end}`;

    const description = document.createElement("p");
    description.className = "card-text game-card-text is-collapsed";
    description.textContent = game.description;

    content.append(title, date, description);

    if (!game.link) {
      const status = document.createElement("div");
      status.className = "game-card-status";
      status.textContent = "Unplayable";
      content.appendChild(status);
    }

    inner.appendChild(content);
    col.appendChild(card);

    setupDescriptionToggle(description);

    return col;
  };

  games
    .sort((a, b) => formatDate(b.start) - formatDate(a.start))
    .forEach((game) => gameList.appendChild(createGameCard(game)));
});
