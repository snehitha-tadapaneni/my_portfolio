/**
 * pageTransitions.js
 * Handles smooth fade-in/out transitions between pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
});

function initPageTransitions() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Fade in on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's not a valid internal page link
            if (!href ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.includes('Resume.pdf') ||
                link.classList.contains('no-transition')) return;

            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.4s ease';

            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}
