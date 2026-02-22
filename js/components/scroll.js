import { qs, qsa } from "../utils/helpers.js";

export function initScrollReveal() {

    const sections = qsa("#skills, #projects");

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const cards = qsa(".skill-card, .project-card", entry.target);

                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove("hidden");
                        card.classList.add("show");
                    }, index * 150);
                });

                observer.unobserve(entry.target);
            }

        });

    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
}