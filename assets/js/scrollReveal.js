/**
 * scrollReveal.js
 * Handles entrance animations as elements enter the viewport.
 * Supports staggered delays via data-delay attribute.
 */

document.addEventListener('DOMContentLoaded', () => {
    const revealOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = parseInt(target.getAttribute('data-delay')) || 0;

                setTimeout(() => {
                    target.classList.add('is-visible');
                }, delay);

                // Stop observing after animation starts
                observer.unobserve(target);
            }
        });
    }, revealOptions);

    // Observe all .reveal and .reveal-item elements
    const elementsToReveal = document.querySelectorAll('.reveal, .reveal-item');
    elementsToReveal.forEach(el => revealObserver.observe(el));
});
