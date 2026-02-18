/* =====================================================
   GLOBAL STATE
===================================================== */

// All projects loaded from JSON
let allProjects = [];

// Projects currently displayed in slider (after filtering)
let filteredProjects = [];

// Slider state
let sliderIndex = 0;
let autoSlideInterval = null;

// Hero rotator state
let heroIndex = 0;


/* =====================================================
   THEME TOGGLE LOGIC
===================================================== */

const themeToggle = document.getElementById('theme-toggle');

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
}

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
});


/* =====================================================
   LOAD PROJECT DATA
===================================================== */

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();

        // Initial render (show all)
        renderSlider(allProjects);

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects();


/* =====================================================
   PROJECT SLIDER RENDERING
===================================================== */

function renderSlider(projects) {

    filteredProjects = projects;
    sliderIndex = 0;

    const track = document.querySelector('.project-track');
    const dotsContainer = document.getElementById('slider-dots');

    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    projects.forEach((project, index) => {

        // Create card
        const card = document.createElement('div');
        card.classList.add('project-card');

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
                <div class="overlay">
                    <button class="view-details" data-index="${index}">
                        View Details
                    </button>
                </div>
            </div>

            <h3>${project.title}</h3>
            <p>${project.description}</p>

            <div class="tech-badges">
                ${project.tech.map(tech =>
                    `<span class="badge">${tech}</span>`
                ).join('')}
            </div>

            <div class="project-links">
                <a href="${project.github}" target="_blank" class="project-btn">
                    GitHub
                </a>
                <a href="${project.demo}" target="_blank" class="project-btn outline">
                    Live Demo
                </a>
            </div>
        `;

        track.appendChild(card);

        // Create dot
        const dot = document.createElement('span');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            stopAutoSlide();

            sliderIndex = index;
            updateSlider();

            startAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    updateSlider();
    startAutoSlide();
}


/* =====================================================
   UPDATE SLIDER POSITION + UI STATE
===================================================== */

function updateSlider() {
    const track = document.querySelector('.project-track');

    track.style.opacity = 0.8;

    setTimeout(() => {
        track.style.transform = `translateX(-${sliderIndex * 100}%)`;
        track.style.opacity = 1;
    }, 100);
    
    const dots = document.querySelectorAll('.slider-dots span');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Slide animation
    track.style.transform = `translateX(-${sliderIndex * 100}%)`;

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[sliderIndex]) {
        dots[sliderIndex].classList.add('active');
    }

    // Disable arrows at boundaries
    prevBtn.disabled = sliderIndex === 0;
    nextBtn.disabled = sliderIndex === filteredProjects.length - 1;
}

/* =====================================================
   Auto Slide Logic
===================================================== */

function startAutoSlide() {
    stopAutoSlide(); // prevent duplicates

    autoSlideInterval = setInterval(() => {

        if (sliderIndex < filteredProjects.length - 1) {
            sliderIndex++;
        } else {
            sliderIndex = 0; // loop back
        }

        updateSlider();

    }, 5000); // 5 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Pause auto-slide on hover
const sliderWrapper = document.querySelector('.project-slider-wrapper');

sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
sliderWrapper.addEventListener('mouseleave', startAutoSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        document.getElementById('next-btn').click();
    }
    if (e.key === 'ArrowLeft') {
        document.getElementById('prev-btn').click();
    }
});


/* =====================================================
   SLIDER NAVIGATION BUTTONS
===================================================== */

document.getElementById('prev-btn').addEventListener('click', () => {
    stopAutoSlide();

    if (sliderIndex > 0) {
        sliderIndex--;
        updateSlider();
    }

    startAutoSlide();
});

document.getElementById('next-btn').addEventListener('click', () => {
    stopAutoSlide();

    if (sliderIndex < filteredProjects.length - 1) {
        sliderIndex++;
        updateSlider();
    }

    startAutoSlide();
});


/* =====================================================
   PROJECT FILTER LOGIC
===================================================== */

document.querySelectorAll('.filter-btn').forEach(button => {

    button.addEventListener('click', () => {

        // Update active button UI
        document.querySelectorAll('.filter-btn')
            .forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');

        const filter = button.dataset.filter;

        if (filter === 'all') {
            renderSlider(allProjects);
        } else {
            const filtered = allProjects.filter(project =>
                project.tech.includes(filter)
            );
            renderSlider(filtered);
        }
    });

});


/* =====================================================
   PROJECT MODAL LOGIC
===================================================== */

document.addEventListener('click', function (e) {

    // Open modal
    if (e.target.classList.contains('view-details')) {

        const index = e.target.dataset.index;
        const project = filteredProjects[index];

        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.details;

        document.getElementById('project-modal').style.display = 'flex';
    }

    // Close modal (X)
    if (e.target.classList.contains('close-modal')) {
        document.getElementById('project-modal').style.display = 'none';
    }

    // Close modal (background click)
    if (e.target.id === 'project-modal') {
        document.getElementById('project-modal').style.display = 'none';
    }
});


/* =====================================================
   SCROLL ANIMATION (Intersection Observer)
===================================================== */

const sections = document.querySelectorAll('#skills, #projects');

const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const cards = entry.target.querySelectorAll('.skill-card');

            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                }, index * 150);
            });

            observer.unobserve(entry.target);
        }

    });

}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));


/* =====================================================
   HERO ROTATING TEXT
===================================================== */

const rotatingText = document.getElementById("rotating-text");

const heroTexts = [
    "Scalable Backend Systems",
    "ERP Solutions",
    "Modern JavaScript Applications",
    "Clean & Maintainable Code"
];

// Initial state
rotatingText.textContent = heroTexts[heroIndex];
rotatingText.classList.add("slide-in");

function rotateHeroText() {

    rotatingText.classList.remove("slide-in");
    rotatingText.classList.add("slide-out");

    setTimeout(() => {
        heroIndex = (heroIndex + 1) % heroTexts.length;
        rotatingText.textContent = heroTexts[heroIndex];

        rotatingText.classList.remove("slide-out");
        rotatingText.classList.add("slide-in");
    }, 600);
}

setInterval(rotateHeroText, 4000);
