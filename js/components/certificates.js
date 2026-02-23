export function initCertificates() {

    const track = document.querySelector(".cert-track");
    const prevBtn = document.querySelector(".cert-prev");
    const nextBtn = document.querySelector(".cert-next");
    const titleEl = document.querySelector(".cert-title");
    const issuerEl = document.querySelector(".cert-issuer");
    const counterEl = document.querySelector(".cert-counter");

    if (!track) return;

    let certificates = [];
    let currentIndex = 0;

    fetch("certificates.json")
        .then(res => res.json())
        .then(data => {
            certificates = data;
            renderCertificates();
            updateSlider();
        });

    function renderCertificates() {
        track.innerHTML = "";

        certificates.forEach(cert => {

            const card = document.createElement("div");
            card.className = "cert-card";

            card.innerHTML = `
                <div class="cert-frame">
                    ${
                        cert.link
                        ? `<a href="${cert.link}" target="_blank">
                            <img src="${cert.image}" alt="${cert.title}">
                           </a>`
                        : `<img src="${cert.image}" alt="${cert.title}">`
                    }
                </div>
            `;

            track.appendChild(card);
        });
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateMeta();
        updateButtons();
    }

    function updateMeta() {
        const cert = certificates[currentIndex];
        titleEl.textContent = cert.title;
        issuerEl.textContent = `${cert.issuer} · ${cert.year}`;
        counterEl.textContent =
            `${String(currentIndex + 1).padStart(2,"0")} / ${String(certificates.length).padStart(2,"0")}`;
    }

    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === certificates.length - 1;
    }

    prevBtn?.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn?.addEventListener("click", () => {
        if (currentIndex < certificates.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    /* KEYBOARD (restricted visibility) */

    document.addEventListener("keydown", (e) => {

        const section = document.getElementById("certificates");
        if (!section) return;

        if (!isSectionMostlyVisible(section)) return;

        if (e.key === "ArrowRight" && currentIndex < certificates.length - 1) {
            currentIndex++;
            updateSlider();
        }

        if (e.key === "ArrowLeft" && currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    function isSectionMostlyVisible(section) {
        const rect = section.getBoundingClientRect();
        const visibleHeight =
            Math.min(rect.bottom, window.innerHeight) -
            Math.max(rect.top, 0);

        const visibilityRatio = visibleHeight / rect.height;

        return visibilityRatio >= 0.6;
    }
}