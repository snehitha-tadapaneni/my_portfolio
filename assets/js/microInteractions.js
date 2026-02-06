/**
 * microInteractions.js
 * Implements premium micro-interactions like magnetic hover effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMagneticButtons();
});

/**
 * Adds a subtle 'magnetic' follow effect to elements with .magnetic class
 */
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic');

    // Skip on mobile or if reduced motion is preferred
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    magnets.forEach(anchor => {
        anchor.addEventListener('mousemove', function (e) {
            const rect = anchor.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle movement: max 10px
            const strength = 15;
            const moveX = (x / rect.width) * strength;
            const moveY = (y / rect.height) * strength;

            anchor.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        anchor.addEventListener('mouseleave', function () {
            anchor.style.transform = 'translate(0, 0)';
        });
    });
}
