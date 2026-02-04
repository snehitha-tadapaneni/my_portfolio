/**
 * Interactive Background
 * Canvas-based particle system with connection lines and cursor repulsion.
 * Respects prefers-reduced-motion.
 */

const canvas = document.getElementById('hero-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Configuration
const particleCount = window.innerWidth < 768 ? 60 : 140; // Increased for more density
const connectionDistance = 100;
const particleSpeed = 0.5;

class Particle {
    constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx; // Direction X
        this.dy = dy; // Direction Y
        this.size = size;
        this.color = color;
        this.baseX = x; // Remember original position for "spring back" text effect (optional, here we float freely)
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Move
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

        // Interaction with mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < canvas.width - 10) this.x += 2;
            if (mouse.x > this.x && this.x > 10) this.x -= 2;
            if (mouse.y < this.y && this.y < canvas.height - 10) this.y += 2;
            if (mouse.y > this.y && this.y > 10) this.y -= 2;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

function init() {
    if (!canvas) return;
    particles = [];

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // Or specific container height

    for (let i = 0; i < particleCount; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * (canvas.width - size * 2) + size * 2);
        let y = (Math.random() * (canvas.height - size * 2) + size * 2);
        let dx = (Math.random() * particleSpeed) - (particleSpeed / 2);
        let dy = (Math.random() * particleSpeed) - (particleSpeed / 2);
        let color = '#d97706'; // Accent color for particles

        particles.push(new Particle(x, y, dx, dy, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

            if (distance < (connectionDistance * connectionDistance)) {
                opacityValue = 1 - (distance / 10000);
                // Ensure opacity is valid
                if (opacityValue < 0) opacityValue = 0;

                ctx.strokeStyle = 'rgba(217, 119, 6,' + opacityValue * 0.2 + ')'; // Subtle amber lines
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
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connect();
}

// Event Listeners
if (canvas) {
    window.addEventListener('resize', init);

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
        init();
        animate();
    }
}
