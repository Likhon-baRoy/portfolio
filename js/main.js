import { loadLogo } from './components/logo.js';
import { initThemeToggle } from "./components/themeToggle.js";
import { initRotator } from "./components/rotator.js";
import { initSlider } from "./components/slider.js";
import { initModal } from "./components/modal.js";
import { initScrollReveal } from "./components/scroll.js";
import { initCertificates } from "./components/certificates.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadLogo();
    initThemeToggle();
    initRotator();
    initSlider();
    initModal();
    initScrollReveal();
    initCertificates();
});


/* ========================================
   Responsive Adjustments for Navigation
======================================== */
const menuToggle = document.getElementById("menu-toggle");
const navLinksContainer = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
});

// Close Menu On Link Click
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinksContainer.classList.remove("active");
    });
});

// Close Menu If Click Outside
document.addEventListener("click", (e) => {
    const menu = document.querySelector(".nav-links");
    const toggle = document.getElementById("menu-toggle");

    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove("active");
    }
});