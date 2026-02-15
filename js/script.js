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
