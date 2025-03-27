document.addEventListener('DOMContentLoaded', function () {
    console.log("bruh");
  
    // games array
    const Games = [
        { title: "Unseen Floors", start: "2024-12", end: "Present", description: "A Developer for another DOORS fangame called Unseen Floors, I Build, Script, and occasionally animate for this game.", link: null },
        { title: "Unseen Floors", start: "2024-12", end: "Present", description: "A Developer for another DOORS fangame called Unseen Floors, I Build, Script, and occasionally animate for this game.", link: null },
        { title: "Paradox", start: "2024-11", end: "Present", description: "Developer for a DOORS fangame known as Paradox, I am a Builder, Scripter, Animator, Sound Designer, and VFX Artist", link: "https://www.roblox.com/games/15185420347/DEMO-Paradox-DOORS" },
        { title: "Sane", start: "2024-10", end: "Present", description: "Creator and owner of a highly realistic and lore filled horror game, the goal behind visuals is making it look like a showcase game. Actively Under Development", link: null },
        { title: "Throw Bricks At People", start: "2024-07", end: "2024-11", description: "Main developer in a full and large team. I still periodically help out with the game when it is needed.", link: null },
        { title: "Inbetween", start: "2024-04", end: "2024-07", description: "Inspired by Interliminality, full 11 section game with a story, I was the main creator, collaborating with friends", link: null },
        { title: "Interliminality", start: "2024-03", end: "2024-04", description: "Second large impact and role for a large game, I enjoyed the time I worked on this game, I was an Animator, Scripter, Builder and Music artist", link: "https://www.roblox.com/games/14237585680/5-24-24-Interliminality-ALPHA-1-1-5" },
         { title: "Blade Ball", start: "2024-02", end: "2024-02", description: "Offered to help fix any possible lag and difficulties with server-adjustments, I gave a recommendation for a sword that got added though", link: "https://www.roblox.com/games/13772394625/UPD-Blade-Ball" },
        { title: "Terra-Isle", start: "2024-02", end: "2024-02", description: "Only creator, made in 13 hours without breaks, currently my most impressive Roblox game.", link: "https://www.roblox.com/games/16404803992/Terra-Isle" },
        { title: "Enigma", start: "2023-07", end: "2023-11", description: "My first game that had a story, ideas, and full set plan. Sadly Roblox had other plans and removed the game for a DMCA strike, only later that month reopening the game again", link: null },
        { title: "Cozy Cuddle", start: "2023-06", end: "2023-06", description: "Second collaboration with a large horror game group, I was a scripter, animator, and UI designer, I quit soon after joining as the work environment was unfriendly and development was far far too slow", link: null },
        { title: "The Bunker", start: "2023-08", end: "2024-01", description: "A game collaborated with Vizion, a close friend and a fellow game developer, this game was made throughout teaching my friend how to make a game and to actually make one on the way", link: "https://www.roblox.com/games/14350543850/The-Bunker-HORROR-Pre-Alpha" },
        { title: "Cutscene", start: "2023-06", end: "2023-06", description: "My first cutscene game, I am still very proud of this project, I made this to challenge my animation abilities, this entire thing was made in 2 days, 8 hours of animating, 3 hours of voice acting and sound design", link: "https://www.roblox.com/games/13695671920/Cutscene" },
        { title: "Quantum Decay", start: "2023-07", end: "2023-07", description: "Entire main menu, sound design, systems and the entire game made in 48 hours, no reason, just boredom.", link: "https://www.roblox.com/games/14084341057/Quantum-Decay" },
        { title: "Totally Epic Sword Battles", start: "2023-03", end: "2023-06", description: "Sword game, duo collaboration, main developer", link: null },
        { title: "The Frontrooms", start: "2022-11", end: "2022-12", description: "My second horror game, was made when the backrooms started to pop up everywhere, decided to get on the train", link: null },
        { title: "Noob Attack", start: "2022-02", end: "2022-06", description: "Almost a full game, inspired by Defend the Statue and got the original creator of DtS on board, almost made it to release, was the main developer.", link: null },
        { title: "Melee Blitz", start: "2021-06", end: "2021-11", description: "First collaboration with a studio, I was the main animator and a map designer", link: null },
        { title: "The Island", start: "2021-03", end: "2021-03", description: "My first showcase game, this was to challenge myself and to get a base idea on how to use studios technology and how to push it", link: "https://www.roblox.com/games/6573164158/The-Island" },
        { title: "Vindigo", start: "2020-12", end: "2021-01", description: "Second horror game that nearly finished, made it quite far in development but burnout was the death of it.", link: null },
        { title: "Planet Artifact", start: "2020-11", end: "2020-11", description: "First attempt at an open world game, did not get past alpha.", link: null },
        { title: "What Happened", start: "2020-06", end: "2020-07", description: "My very first solo horror game, the single project that kickstarted my entire lifestyle, hobby, and career.", link: "https://www.roblox.com/games/5212171853/What-Happened-Pre-Beta" }
    ];
  
    // Cool helper function
    function FormatDate(DateStr) {
      const [Year, Month] = DateStr.split('-');
      return new Date(Year, Month - 1);
    }
  
    // Sorting
    Games.sort((a, b) => FormatDate(b.start) - FormatDate(a.start));
    console.log("trying game list");
  
    const GameList = document.getElementById("game-list");
    if (GameList) {
      console.log("got game list, epic");
      Games.forEach(Game => {
        const GameElement = document.createElement("div");
        GameElement.classList.add("col-lg-12", "mb-4");
        GameElement.innerHTML = Game.link ? `
            <div class="card fade-in-item" style="background-color: #1a1a1a; border-radius: 10px; padding: 20px; color: #f0f0f0;">
                <div class="card-body">
                    <a href="${Game.link}" target="_blank" class="hover-link" style="text-decoration: none; color: rgb(80, 0, 230);">
                        <h5 class="card-title" style="color: inherit;"><strong>${Game.title} (${Game.start} - ${Game.end})</strong></h5>
                        <p class="card-text" style="color: inherit;"><strong>${Game.description}</strong></p>
                    </a>
                </div>
            </div>
        ` : `
            <div class="card fade-in-item" style="background-color: #1a1a1a; border-radius: 10px; padding: 20px; color: #f0f0f0;">
                <div class="card-body">
                    <h5 class="card-title" style="color: rgb(80, 0, 230);"><strong>${Game.title} (${Game.start} - ${Game.end})</strong></h5>
                    <p class="card-text" style="color: rgb(80, 0, 230);"><strong>${Game.description}</strong> <span style="font-size: 0.9em; color: #888;">(Unplayable)</span></p>
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