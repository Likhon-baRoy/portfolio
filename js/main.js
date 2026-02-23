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