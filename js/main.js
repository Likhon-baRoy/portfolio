import { initThemeToggle } from "./components/themeToggle.js";
import { initRotator } from "./components/rotator.js";
import { initSlider } from "./components/slider.js";
import { initModal } from "./components/modal.js";
import { initScrollReveal } from "./components/scroll.js";

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initRotator();
    initSlider();
    initModal();
    initScrollReveal();
});