/**
 * reveal.js
 * Professional entrance animations using IntersectionObserver.
 */

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered effect if data-delay is present
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Once visible, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly offset from bottom
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
