/**
 * Typewriter Effect
 * Loops through a list of phrases, typing and deleting them.
 */

const phrases = [
    "analyzing data",
    "storytelling with dashboards",
    "sketching & journaling",
    "art + design",
    "building agentic AI tools"
];

const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 1500; // Time to wait before deleting

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const typewriterElement = document.getElementById("typewriter-text");
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Deleting
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Typing
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let nextSpeed = typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing phrase
        isDeleting = true;
        nextSpeed = pauseTime;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        nextSpeed = 500;
    } else if (isDeleting) {
        nextSpeed = deletingSpeed;
    }

    setTimeout(typeWriter, nextSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    // Only start if element exists
    if (document.getElementById("typewriter-text")) {
        typeWriter();
    }
});
