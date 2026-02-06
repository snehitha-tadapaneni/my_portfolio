/**
 * Interactive Particle Background
 * Features: Drifting particles, connecting lines, cursor repulsion, responsiveness, and reduced motion respect.
 */

const canvas = document.getElementById('hero-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
let mouse = { x: null, y: null, radius: 100 };

// Configuration
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 40 : 100;
const connectionDistance = 120;
const particleSpeed = 0.4;
const repulsionForce = 0.5;

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = (Math.random() * 2) + 1;
        this.dx = (Math.random() * particleSpeed * 2) - particleSpeed;
        this.dy = (Math.random() * particleSpeed * 2) - particleSpeed;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = '#d97706'; // Professional amber/gold accent
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Drift
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

        // Mouse Interaction (Repulsion with easing)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x -= directionX * force * 5;
                this.y -= directionY * force * 5;
            }
        }

        this.draw();
    }
}

function init() {
    if (!canvas) return;

    // Set canvas dimensions to window size for global background
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = dx * dx + dy * dy;

            if (distance < connectionDistance * connectionDistance) {
                const opacity = 1 - (distance / (connectionDistance * connectionDistance));
                ctx.strokeStyle = `rgba(217, 119, 6, ${opacity * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connect();

    requestAnimationFrame(animate);
}

// Handle Resize
window.addEventListener('resize', () => {
    init();
});

// Global Mouse tracking
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Start Animation with reduced motion check
document.addEventListener('DOMContentLoaded', () => {
    // Reveal hero text
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        setTimeout(() => {
            heroText.classList.add('loaded');
        }, 100);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
        init();
        animate();
    }
});
