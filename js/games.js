document.addEventListener('DOMContentLoaded', function () {
    console.log("bruh");
  
    // games
    const Games = [
        { title: "Inbetween", start: "2025-07", end: "Present", description: "I've picked this game back up, this time with a full team, currently in pre-production and writing. Full development will begin soon.", image: "/assets/img/portfolio/Inbetween Entrance.png", link: null },
        { title: "Paradox", start: "2025-09", end: "2025-09", description: "Animated for a commision for the Graveyard Update.", link: "https://www.roblox.com/games/18186775539/THE-FOUNDATION" },
        { title: "Unseen Floors", start: "2024-12", end: "2025-02", description: "A Developer for another DOORS fangame called Unseen Floors, I left the team to focus on Paradox and later the game was cancelled.", link: null },
        { title: "Paradox", start: "2024-11", end: "Present", description: "Co-Owner for a DOORS fangame known as Paradox, I am a Builder, Scripter, Animator, Sound Designer, VFX Artist, and Modeler, I was recently promoted to co-owner.", image: "/assets/img/portfolio/destroyed_paradox_room.png", link: "https://www.roblox.com/games/15185420347/DEMO-Paradox-DOORS" },
        { title: "Sane", start: "2024-10", end: "2025-04", description: "Creator and owner of a realistic and lore filled horror game, the goal behind visuals is making it look like a showcase game with the gameplay of a well-thought out horror game. Actively Under Development", image: "/assets/img/portfolio/Sane Living Room.png", link: null },
        { title: "Throw Bricks At People", start: "2024-07", end: "2024-11", description: "Main developer in a full and large team. I still periodically help out with the game when it is needed.", link: null },
        { title: "Inbetween", start: "2024-04", end: "2024-07", description: "Inspired by Interliminality, full 11 section game with a story, I was the main creator, collaborating with friends, the game was cancelled and development ceased due to the game not being fun.", image: "/assets/img/portfolio/Inbetween Puzzle.png", link: null },
        { title: "Interliminality", start: "2024-03", end: "2024-04", description: "Second large impact and role for a large game, I enjoyed the time I worked on this game, I was an Animator, Scripter, and Builder.", image: "/assets/img/portfolio/Interliminality Things Warehouse.png", link: "https://www.roblox.com/games/14237585680/5-24-24-Interliminality-ALPHA-1-1-5" },
        { title: "Blade Ball", start: "2024-02", end: "2024-02", description: "Offered to help fix any possible lag and difficulties with server-adjustments, I gave a recommendation for a sword that got added though", link: "https://www.roblox.com/games/13772394625/UPD-Blade-Ball" },
        { title: "Terra-Isle", start: "2024-02", end: "2024-02", description: "Only creator, made in 13 hours without breaks. Successor to The Island", image: "/assets/img/portfolio/Terraisle1.png", link: "https://www.roblox.com/games/16404803992/Terra-Isle" },
        { title: "Enigma", start: "2023-07", end: "2023-11", description: "Original horror game that had a story, ideas, and full set plan. Sadly Roblox had other plans and removed the game for a DMCA strike, only later that month reopening the game again", image: "/assets/img/portfolio/Enigma Hallway.png", link: null },
        { title: "Cozy Cuddle", start: "2023-06", end: "2023-06", description: "Second collaboration with a large horror game group, I was a scripter, animator, and UI designer, I quit soon after joining as the work environment was unfriendly and development was far far FAR too slow", link: null },
        { title: "The Bunker", start: "2023-08", end: "2024-01", description: "A game collaborated with Vizion, a close friend and a fellow game developer, this game was made throughout teaching my friend how to make a game and to actually make one on the way", link: "https://www.roblox.com/games/14350543850/The-Bunker-HORROR-Pre-Alpha" },
        { title: "Cutscene", start: "2023-06", end: "2023-06", description: "My first cutscene game, I am still mildly proud of this project, I made this to challenge my animation abilities, this entire thing was made in 2 days. This was before I knew how to animate in Blender.", link: "https://www.roblox.com/games/13695671920/Cutscene" },
        { title: "Quantum Decay", start: "2023-07", end: "2023-07", description: "Entire main menu, sound design, systems and the entire game made in 48 hours, no reason, just boredom.", image: "/assets/img/portfolio/Quantum Decay Main Menu.png", link: "https://www.roblox.com/games/14084341057/Quantum-Decay" },
        { title: "Totally Epic Sword Battles", start: "2023-03", end: "2023-06", description: "PvP Sword game, duo collaboration, main developer", link: null },
        { title: "The Frontrooms", start: "2022-11", end: "2022-12", description: "Another horror game, was made when the backrooms started to pop up everywhere, decided to get on the train, development paused due to it not being original and also.. the frontrooms? seriously??", link: null },
        { title: "Noob Attack", start: "2022-02", end: "2022-06", description: "Almost a full game, inspired by Defend the Statue and got the original creator of DtS on board, almost made it to release, was the main developer.", image: "/assets/img/portfolio/Noob Attack Castle.png", link: null },
        { title: "Melee Blitz", start: "2021-06", end: "2021-11", description: "Collaboration with a medium-sized studio, I was the main animator and a map designer", link: null },
        { title: "The Island", start: "2021-03", end: "2021-03", description: "My first showcase game, this was to challenge myself and to get a base idea on how to use studios technology and how to push it", link: "https://www.roblox.com/games/6573164158/The-Island" },
        { title: "Vindigo", start: "2020-12", end: "2021-01", description: "Another horror game that nearly finished, made it quite far in development but burnout was the death of it.", link: null },
        { title: "Planet Artifact", start: "2020-11", end: "2020-11", description: "First attempt at an open world game, did not get past alpha.", link: null },
        { title: "What Happened", start: "2020-06", end: "2020-07", description: "Solo horror game made in 1 week, it sucked, I was not as good as I am now.", link: null }
    ];
  
    function FormatDate(DateStr) {
      const [Year, Month] = DateStr.split('-');
      return new Date(Year, Month - 1);
    }
  
    Games.sort((a, b) => FormatDate(b.start) - FormatDate(a.start));
    console.log("trying game list");
  
    const GameList = document.getElementById("game-list");
    if (GameList) {
      console.log("got game list, epic");
      Games.forEach(Game => {
        const GameElement = document.createElement("div");
        GameElement.classList.add("col-lg-12", "mb-4");
        const imageHtml = Game.image ? `
            <div class="game-card-media">
                <img src="${encodeURI(Game.image)}" alt="${Game.title} preview" loading="lazy">
            </div>
        ` : "";
        const titleHtml = `
            <h5 class="card-title game-card-title"><strong>${Game.title} (${Game.start} - ${Game.end})</strong></h5>
        `;
        const descHtml = Game.link ? `
            <p class="card-text game-card-text"><strong>${Game.description}</strong></p>
        ` : `
            <p class="card-text game-card-text"><strong>${Game.description}</strong> <span class="game-card-status">(Unplayable)</span></p>
        `;
        const contentHtml = `
            <div class="game-card-content">
                ${titleHtml}
                ${descHtml}
            </div>
        `;
        GameElement.innerHTML = Game.link ? `
            <div class="card fade-in-item game-card">
                <a href="${Game.link}" target="_blank" class="hover-link game-card-link">
                    ${imageHtml}
                    ${contentHtml}
                </a>
            </div>
        ` : `
            <div class="card fade-in-item game-card">
                <div class="game-card-inner">
                    ${imageHtml}
                    ${contentHtml}
                </div>
            </div>
        `;
        console.log("done loading game: ", GameElement);
        GameList.appendChild(GameElement);
      });
    } else {
      console.log("game list unsuccessful, ok this either means the website broke or ur on a page without a game list needed");
    }
  });  
