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
        {
            title: "R6 IK + FK Blender Rig",
            description: "A very intuitive blender R6 rig for any kind of R6 animation, I update this frequently and check replies.",
            type: "link",
            link: "https://devforum.roblox.com/t/r6-ik-fk-blender-rig/3586405?u=aeresei"
        },
    ];

    const freeStuffList = document.getElementById("free-stuff-list");

    freeStuffItems.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("col-lg-4", "col-md-6", "col-sm-12");

        itemElement.innerHTML = `
            <div class="card free-stuff-card showcase-card">
                <div class="card-body">
                    <div class="resource-type">${item.type === "file" ? "File" : "Link"}</div>
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <a href="${item.link}" ${item.type === "file" ? "download" : "target=\"_blank\""} class="btn btn-primary text-uppercase">${item.type === "file" ? "Download" : "Open"}</a>
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

    if (scrollToTopBtn) {
        window.addEventListener("scroll", toggleScrollToTopBtn);
        scrollToTopBtn.addEventListener("click", scrollToTop);
        toggleScrollToTopBtn();
    }
});
