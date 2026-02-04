/**
 * Theme Toggle
 * Switches between light and dark themes, persists preference in localStorage
 */

const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Update button icon based on current theme
function updateThemeIcon() {
    const theme = htmlElement.getAttribute('data-theme');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = theme === 'dark'
            ? '☀️' // Sun for dark mode (click to go light)
            : '🌙'; // Moon for light mode (click to go dark)
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

// Initialize
if (themeToggleBtn) {
    updateThemeIcon();
    themeToggleBtn.addEventListener('click', toggleTheme);
}
