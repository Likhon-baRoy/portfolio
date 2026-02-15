// ===== Scroll Reveal (Intersection Observer) =====
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

// ===== Theme Toggle =====
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

// ===== Load Projects from JSON =====
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();

        const projectContainer = document.querySelector('.project-list');

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.classList.add('project-card', 'hidden');

            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <small>${project.tech.join(' • ')}</small>
            `;

            projectContainer.appendChild(card);

            // animate after short delay
            setTimeout(() => {
                card.classList.remove('hidden');
                card.classList.add('show');
            }, index * 150);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects();

