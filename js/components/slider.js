export function initSlider() {

    const track = document.querySelector(".project-track");
    const prevBtn = document.querySelector("#projects .prev");
    const nextBtn = document.querySelector("#projects .next");
    const dotsContainer = document.querySelector(".slider-dots");

    if (!track) return;

    let projects = [];
    let currentIndex = 0;

    fetch("projects.json")
        .then(res => res.json())
        .then(data => {
            projects = data;
            renderProjects();
            updateSlider();
        });

    function renderProjects() {
        track.innerHTML = "";
        dotsContainer.innerHTML = "";

        projects.forEach((project, index) => {

            const card = document.createElement("div");
            card.className = "project-card";

            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;

            track.appendChild(card);

            const dot = document.createElement("span");
            dot.addEventListener("click", () => {
                currentIndex = index;
                updateSlider();
            });

            dotsContainer.appendChild(dot);
        });
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        updateButtons();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll("span");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function updateButtons() {
        if (!prevBtn || !nextBtn) return;

        const isFirst = currentIndex === 0;
        const isLast = currentIndex === projects.length - 1;

        prevBtn.disabled = isFirst;
        nextBtn.disabled = isLast;

        prevBtn.classList.toggle("disabled", isFirst);
        nextBtn.classList.toggle("disabled", isLast);
    }

    prevBtn?.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn?.addEventListener("click", () => {
        if (currentIndex < projects.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    /* KEYBOARD (restricted visibility) */

    document.addEventListener("keydown", (e) => {

        const section = document.getElementById("projects");
        if (!section) return;

        if (!isSectionMostlyVisible(section)) return;

        if (e.key === "ArrowRight" && currentIndex < projects.length - 1) {
            currentIndex++;
            updateSlider();
        }

        if (e.key === "ArrowLeft" && currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    function isSectionMostlyVisible(section) {
        const rect = section.getBoundingClientRect();
        const visibleHeight =
            Math.min(rect.bottom, window.innerHeight) -
            Math.max(rect.top, 0);

        const visibilityRatio = visibleHeight / rect.height;

        return visibilityRatio >= 0.6;
    }
}