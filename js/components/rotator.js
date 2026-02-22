import { ROTATOR_WORDS, ROTATOR_INTERVAL } from "../utils/constants.js";

export function initRotator() {

    const rotatingText = document.getElementById("rotating-text");
    if (!rotatingText) return;

    let currentIndex = 0;

    function rotate() {
        rotatingText.classList.remove("slide-in");
        rotatingText.classList.add("slide-out");

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % ROTATOR_WORDS.length;
            rotatingText.textContent = ROTATOR_WORDS[currentIndex];

            rotatingText.classList.remove("slide-out");
            rotatingText.classList.add("slide-in");
        }, 800);
    }

    rotatingText.textContent = ROTATOR_WORDS[0];
    rotatingText.classList.add("slide-in");

    setInterval(rotate, ROTATOR_INTERVAL);
}