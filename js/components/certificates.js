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
            updateMeta();
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
                        ? `<a href="${cert.link}" target="_blank" rel="noopener">
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
    }

    function updateMeta() {
        const cert = certificates[currentIndex];

        titleEl.textContent = cert.title;
        issuerEl.textContent = `${cert.issuer} · ${cert.year}`;

        counterEl.textContent =
            `${String(currentIndex + 1).padStart(2, "0")} / ${String(certificates.length).padStart(2, "0")}`;
    }

    nextBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % certificates.length;
        updateSlider();
    });

    prevBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
        updateSlider();
    });
    
    document.addEventListener("keydown", (e) => {

        const section = document.getElementById("certificates");
        if (!section) return;

        const rect = section.getBoundingClientRect();

        const isVisible =
            rect.top < window.innerHeight &&
            rect.bottom > 0;

        if (!isVisible) return;

        if (e.key === "ArrowRight") {
            currentIndex = (currentIndex + 1) % certificates.length;
            updateSlider();
        }

        if (e.key === "ArrowLeft") {
            currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
            updateSlider();
        }

    });
}