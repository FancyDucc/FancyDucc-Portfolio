document.addEventListener("DOMContentLoaded", function () {
    const freeStuffItems = [
        {
            title: "VortexFX",
            description: "My most notable project, this is a 3D particle system that is updated frequently with more and more features, this system has many many features that can turn normal 2D particles into 3D masses of beauty and chaos, all while being incredibly optimized.",
            type: "link",
            link: "https://fancyducc.github.io/3D-Particle-System/getting-started/"
        },
        {
            title: "Nodegraphing Tools",
            description: "Use this plugin to create nodegraphing, an alternate way of making pathfinding for AI's.",
            type: "link",
            link: "https://create.roblox.com/store/asset/17829135912/Nodegraphing-Tools"
        },
        {
            title: "Camera Handler",
            description: "A very neat system for making a main menu camera or a camera that is locked in place and follows the players mouse.",
            type: "file",
            link: "../assets/rbxm/CameraHandler.rbxm"
        },
        {
            title: "Bad Doppler System",
            description: "very bad doppler sound effect system 👍",
            type: "file",
            link: "../assets/rbxm/BadDopplerSystem.rbxm"
        },
        {
            title: "Synth Waveform Generator",
            description: "Generation thing that is NOT meant for games, it's simply to simulate how different shapes make synth waveforms",
            type: "file",
            link: "../assets/rbxm/WaveformGenerator.rbxm"
        },
        {
            title: "Fidelity Engineer",
            description: "A full fidelity engineer plugin that can make setting CollisionFidelity and similar properties much easier.",
            type: "link",
            link: "https://devforum.roblox.com/t/fidelity-engineer-plugin-an-easier-and-more-modular-way-to-edit-fidelity/3452485"
        },
    ];

    const freeStuffList = document.getElementById("free-stuff-list");

    freeStuffItems.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("col-lg-12", "mb-4");

        itemElement.innerHTML = `
            <div class="card" style="background-color:rgb(12, 12, 12); border-radius: 10px; padding: 20px; color: #f0f0f0;">
                <div class="card-body text-center">
                    <h5 class="card-title" style="color: rgb(80, 0, 230);"><strong>${item.title}</strong></h5>
                    <p class="card-text">${item.description}</p>
                    <a href="${item.link}" ${item.type === "file" ? "download" : "target=\"_blank\""} class="btn btn-primary text-uppercase" style="color: #ffffff; width: 50%; margin: 0 auto;">Download</a>
                </div>
            </div>
        `;

        freeStuffList.appendChild(itemElement);
    });

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
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
});