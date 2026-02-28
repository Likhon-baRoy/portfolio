export function initThemeToggle() {

    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("theme");

    /* ============================
       DEFAULT: DARK MODE
    ============================ */

    if (savedTheme === "light") {
        document.body.classList.remove("dark");
        themeToggle.textContent = "🌙";
    } else {
        // default dark
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    }

    /* ============================
       TOGGLE ON CLICK
    ============================ */

    themeToggle.addEventListener("click", () => {

        const isDark = document.body.classList.toggle("dark");

        if (isDark) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        }

    });
}