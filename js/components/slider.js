export function initSlider() {

    const track = document.querySelector(".project-track");
    const prevBtn = document.querySelector("#projects .prev");
    const nextBtn = document.querySelector("#projects .next");
    const dotsContainer = document.querySelector(".slider-dots");
    const filterButtons = document.querySelectorAll(".filter-btn");

    if (!track) return;

    let projects = [];
    let filteredProjects = [];
    let currentIndex = 0;
    let interval;

    /* ============================
       FETCH PROJECTS
    ============================ */

    fetch("projects.json")
        .then(res => res.json())
        .then(data => {
            projects = data;
            filteredProjects = data;
            renderProjects();
            startAutoSlide();
        });

    /* ============================
       RENDER
    ============================ */

    function renderProjects() {
        track.innerHTML = "";
        dotsContainer.innerHTML = "";

        filteredProjects.forEach((project, index) => {

            const card = document.createElement("div");
            card.className = "project-card";
            card.dataset.title = project.title;
            card.dataset.details = project.details || "";

            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="overlay">
                        <button class="view-details" data-index="${index}">
                            View Details
                        </button>
                    </div>
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
                resetAutoSlide();
            });

            dotsContainer.appendChild(dot);
        });

        currentIndex = 0;
        updateSlider();
    }

    /* ============================
       SLIDER UPDATE
    ============================ */

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
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === filteredProjects.length - 1;

        prevBtn.disabled = isFirst;
        nextBtn.disabled = isLast;

        prevBtn.classList.toggle("disabled", isFirst);
        nextBtn.classList.toggle("disabled", isLast);
    }

    /* ============================
       NAVIGATION
    ============================ */

    prevBtn?.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            resetAutoSlide();
        }
    });

    nextBtn?.addEventListener("click", () => {
        if (currentIndex < filteredProjects.length - 1) {
            currentIndex++;
            updateSlider();
            resetAutoSlide();
        }
    });

    /* ============================
       AUTO SLIDE
    ============================ */

    function startAutoSlide() {
        interval = setInterval(() => {

            if (filteredProjects.length <= 1) return;

            if (currentIndex < filteredProjects.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;   // loop back to start
            }

            updateSlider();

        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }

    track.addEventListener("mouseenter", () => clearInterval(interval));
    track.addEventListener("mouseleave", startAutoSlide);

    /* ============================
       FILTER SYSTEM
    ============================ */

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;

            if (filter === "all") {
                filteredProjects = projects;
            } else {
                filteredProjects = projects.filter(project =>
                    project.tech?.includes(filter)
                );
            }

            renderProjects();
            resetAutoSlide();
        });
    });

    /* ============================
       KEYBOARD (Visibility Controlled)
    ============================ */

    document.addEventListener("keydown", (e) => {

        const section = document.getElementById("projects");
        if (!section) return;

        if (!isSectionMostlyVisible(section)) return;

        if (e.key === "ArrowRight" && currentIndex < filteredProjects.length - 1) {
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