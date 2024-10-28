document.addEventListener('DOMContentLoaded', function () {
    const games = [
        { title: "Sane", start: "2024-10", end: "Present", description: "Creator and owner of a simplistic but lore filled horror game. Actively Under Development", link: null },
        { title: "Throw Bricks At People", start: "2024-07", end: "Present", description: "Main developer in a full and large team.  Actively Under Development", link: null },
        { title: "Inbetween", start: "2024-04", end: "2024-07", description: "Inspired by Interliminality, full 11 section game with a story, I was the main creator, collaborating with friends", link: null },
        { title: "Interliminality", start: "2024-03", end: "2024-04", description: "Second large impact and role for a large game, I enjoyed the time I worked on this game, I was an animator, scripter, builder and music artist", link: "https://www.roblox.com/games/14237585680/5-24-24-Interliminality-ALPHA-1-1-5" },
        { title: "Blade Ball", start: "2024-02", end: "2024-02", description: "Offered to help fix any possible lag and difficulties with server-adjustments, I gave a recommendation for a sword that got added though", link: "https://www.roblox.com/games/13772394625/UPD-Blade-Ball" },
        { title: "Terra-Isle", start: "2024-02", end: "2024-02", description: "Only creator, made in 13 hours without breaks, currently my most impressive Roblox creation.", link: "https://www.roblox.com/games/16404803992/Terra-Isle" },
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

    function formatDate(dateStr) {
        const [year, month] = dateStr.split('-');
        return new Date(year, month - 1);
    }
    games.sort((a, b) => formatDate(b.start) - formatDate(a.start));
    const gameList = document.getElementById("game-list");
    if (gameList) {
        games.forEach(game => {
            const gameElement = document.createElement("div");
            gameElement.classList.add("col-lg-10", "mb-4");
            gameElement.innerHTML = `
                <div class="card" style="background-color: #1a1a1a; border-radius: 10px; padding: 20px; color: #f0f0f0;">
                    <div class="card-body">
                    ${game.link ? `<a href="${game.link}" target="_blank" class="hover-link" style="text-decoration: none; color: rgb(80, 0, 230);">
                        <h5 class="card-title" style="color: inherit;"><strong>${game.title} (${game.start} - ${game.end})</strong></h5>
                        <p class="card-text" style="color: inherit;"><strong>${game.description}</strong></p>
                    </a>` : `<h5 class="card-title" style="color: rgb(80, 0, 230);"><strong>${game.title} (${game.start} - ${game.end})</strong></h5>
                    <p class="card-text" style="color: rgb(80, 0, 230);"><strong>${game.description}<strong> <span style="font-size: 0.9em; color: #888;">(Unplayable)</span></p>`}
                    </div>
                </div>
            `;
            gameList.appendChild(gameElement);
        });
    }
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        const toggleScrollToTopBtn = () => {
            if (window.scrollY > 50) {
                scrollToTopBtn.classList.add('show');
                scrollToTopBtn.classList.remove('hide');
            } else {
                scrollToTopBtn.classList.add('hide');
                scrollToTopBtn.classList.remove('show');
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
            });
        };

        window.addEventListener("scroll", toggleScrollToTopBtn);
        scrollToTopBtn.addEventListener("click", scrollToTop);
        toggleScrollToTopBtn();
    }
    const audioPlayers = document.querySelectorAll('.custom-audio-player');
    let savedVolume = localStorage.getItem('audioVolume') || 1;d

    audioPlayers.forEach(function (playerContainer) {
        const audio = playerContainer.nextElementSibling;
        if (!audio || audio.tagName !== 'AUDIO') {
            console.error('Audio element not found or incorrect tag for custom player container');
            return;
        }

        const playPauseButton = playerContainer.querySelector('.play-pause-button');
        const seekSlider = playerContainer.querySelector('.seek-slider');
        const volumeSlider = playerContainer.querySelector('.volume-slider');
        const currentTimeElem = playerContainer.querySelector('.current-time');
        const totalTimeElem = playerContainer.querySelector('.total-time');
        audio.volume = savedVolume;
        if (volumeSlider) {
            volumeSlider.value = savedVolume;
        }
        if (playPauseButton) {
            playPauseButton.addEventListener('click', function () {
                if (audio.paused) {
                    audio.play();
                    playPauseButton.textContent = 'Pause';
                } else {
                    audio.pause();
                    playPauseButton.textContent = 'Play';
                }
                updateVolumeSliderPosition();
            });
        }
        if (seekSlider) {
            audio.addEventListener('timeupdate', function () {
                seekSlider.value = (audio.currentTime / audio.duration) * 100;
                if (currentTimeElem) {
                    currentTimeElem.textContent = formatTime(audio.currentTime);
                }
                updateVolumeSliderPosition();
            });
            seekSlider.addEventListener('input', function () {
                audio.currentTime = (seekSlider.value / 100) * audio.duration;
                updateVolumeSliderPosition();
            });
        }
        audio.addEventListener('loadedmetadata', function () {
            if (totalTimeElem) {
                totalTimeElem.textContent = formatTime(audio.duration);
            }
            updateVolumeSliderPosition();
        });
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function () {
                const newVolume = volumeSlider.value;
                setVolumeForAllPlayers(newVolume);
            });
        }
        function updateVolumeSliderPosition() {
            if (!seekSlider || !volumeSlider) return;
            const seekRect = seekSlider.getBoundingClientRect();
            const playerRect = playerContainer.getBoundingClientRect();
            const offsetLeft = seekRect.left - playerRect.left;

            volumeSlider.style.left = `${offsetLeft}px`;
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        updateVolumeSliderPosition();
    });

    function setVolumeForAllPlayers(volume) {
        audioPlayers.forEach(function (playerContainer) {
            const audio = playerContainer.nextElementSibling;
            const volumeSlider = playerContainer.querySelector('.volume-slider');
            if (audio && audio.tagName === 'AUDIO') audio.volume = volume;
            if (volumeSlider) volumeSlider.value = volume;
        });
        localStorage.setItem('audioVolume', volume);
    } 
});