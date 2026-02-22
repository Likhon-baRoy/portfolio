import { SLIDER_INTERVAL } from "../utils/constants.js";

export function initSlider() {
    const track = document.querySelector(".project-track");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const dotsContainer = document.querySelector(".slider-dots");
    const filterButtons = document.querySelectorAll(".filter-btn");

    if (!track) return;

    let allProjects = [];
    let filteredProjects = [];
    let currentIndex = 0;
    let interval;

    // Fetch projects
    fetch("projects.json")
        .then(res => res.json())
        .then(data => {
            allProjects = data;
            filteredProjects = data;
            renderProjects(filteredProjects);
            startAutoSlide();
            
            const sliderWrapper = document.querySelector(".project-slider-wrapper");

            sliderWrapper?.addEventListener("mouseenter", () => {
                clearInterval(interval);
            });

            sliderWrapper?.addEventListener("mouseleave", () => {
                startAutoSlide();
            });
        });

    function renderProjects(projects) {
        track.innerHTML = "";

        projects.forEach(project => {
            const techBadges = project.tech
                ? project.tech.map(t => `<span class="badge">${t}</span>`).join("")
                : "";

            const card = document.createElement("div");
            card.className = "project-card hidden";

            // Attach full details to card
            card.dataset.details = project.details || "No additional details available.";
            card.dataset.title = project.title;

            card.innerHTML = `
                <div class="project-image">
                    ${project.image ? `<img src="${project.image}" alt="${project.title}">` : ""}
                    <div class="overlay">
                        <button class="view-details">View Details</button>
                    </div>
                </div>

                <h3>${project.title}</h3>
                <p>${project.description}</p>

                <div class="tech-badges">${techBadges}</div>

                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="project-btn">GitHub</a>` : ""}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-btn outline">Live</a>` : ""}
                </div>
            `;

            track.appendChild(card);
        });

        createDots(projects.length);
        updateSlider();
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function createDots(count) {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const dot = document.createElement("span");
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll("span");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % filteredProjects.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex =
            (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
        updateSlider();
    }

    function startAutoSlide() {
        interval = setInterval(nextSlide, SLIDER_INTERVAL);
    }

    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }

    nextBtn?.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn?.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
    });

    // FILTER FIX
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (filter === "all") {
                filteredProjects = allProjects;
            } else {
                filteredProjects = allProjects.filter(project =>
                    project.tech?.includes(filter)
                );
            }

            currentIndex = 0;
            renderProjects(filteredProjects);
            resetAutoSlide();
        });
    });
}