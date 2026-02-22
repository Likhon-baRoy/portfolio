export function initModal() {
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const closeBtn = document.querySelector(".close-modal");

    if (!modal) return;

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("view-details")) {
            const card = e.target.closest(".project-card");

            const title = card.dataset.title;
            const details = card.dataset.details;

            modalTitle.textContent = title;
            modalDescription.textContent = details;

            modal.style.display = "flex";
        }
    });

    closeBtn?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}