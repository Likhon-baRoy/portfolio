// ===============================
// State
// ===============================
let allProjects = [];


// ===============================
// Theme Logic
// ===============================
const themeToggle = document.getElementById('theme-toggle');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
}

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


// ===============================
// Project Rendering
// ===============================

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();

        renderProjects(allProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects(projects) {
    const projectContainer = document.querySelector('.project-list');
    projectContainer.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('project-card', 'hidden');

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
                <div class="overlay">
                    <button class="view-details" data-index="${index}">View Details</button>
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
                <a href="${project.github}" target="_blank" class="project-btn">GitHub</a>
                <a href="${project.demo}" target="_blank" class="project-btn outline">Live Demo</a>
            </div>
        `;

        projectContainer.appendChild(card);

        setTimeout(() => {
            card.classList.remove('hidden');
            card.classList.add('show');
        }, index * 150);
    });
}

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {

        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active')
        );

        button.classList.add('active');

        const filter = button.dataset.filter;

        if (filter === 'all') {
            renderProjects(allProjects);
        } else {
            const filtered = allProjects.filter(project =>
                project.tech.includes(filter)
            );
            renderProjects(filtered);
        }
    });
});

loadProjects();

// Project Modal Logic
document.addEventListener('click', function(e) {

    if (e.target.classList.contains('view-details')) {
        const index = e.target.dataset.index;
        const project = allProjects[index];

        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.details;

        document.getElementById('project-modal').style.display = 'flex';
    }

    if (e.target.classList.contains('close-modal')) {
        document.getElementById('project-modal').style.display = 'none';
    }

    if (e.target.id === 'project-modal') {
        document.getElementById('project-modal').style.display = 'none';
    }
});


// ===============================
// Scroll Animation
// ===============================

const sections = document.querySelectorAll('#skills, #projects');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            const cards = entry.target.querySelectorAll('.skill-card, .project-card');

            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                }, index * 150);
            });

            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

sections.forEach(section => observer.observe(section));


// ===============================
// Hero Rotating Specialization
// ===============================

const rotatingText = document.getElementById("rotating-text");

const texts = [
    "Scalable Backend Systems",
    "ERP Solutions",
    "Modern JavaScript Applications",
    "Clean & Maintainable Code"
];

let currentIndex = 0;

// Initial state
rotatingText.textContent = texts[currentIndex];
rotatingText.classList.add("slide-in");

function rotateText() {
    rotatingText.classList.remove("slide-in");
    rotatingText.classList.add("slide-out");

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        rotatingText.textContent = texts[currentIndex];

        rotatingText.classList.remove("slide-out");
        rotatingText.classList.add("slide-in");
    }, 600);
}

setInterval(rotateText, 4000);
