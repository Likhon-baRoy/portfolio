export async function loadLogo() {
    const response = await fetch('components/logo.html');
    const svg = await response.text();

    const container = document.getElementById('logo-link');
    container.innerHTML = svg;
}