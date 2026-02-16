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
        card.classList.add('project-card');

        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <small>${project.tech.join(' • ')}</small>
        `;

        projectContainer.appendChild(card);

        setTimeout(() => {
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
