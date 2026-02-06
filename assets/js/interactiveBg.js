/**
 * interactiveBg.js
 * A high-performance particle system for the hero section background.
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = window.innerWidth < 768 ? 30 : 80;
        this.connectionDistance = 150;

        this.init();
        this.animate();
        this.handleEvents();
    }

    init() {
        this.resize();
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            color: 'rgba(245, 158, 11, 0.4)' // var(--accent) with opacity
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleEvents() {
        window.addEventListener('resize', () => this.init());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Move
            p.x += p.dx;
            p.y += p.dy;

            // Constrain to bounds
            if (p.x < 0 || p.x > this.canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.dy *= -1;

            // Mouse interaction
            if (this.mouse.x) {
                let dx = this.mouse.x - p.x;
                let dy = this.mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    p.x -= (dx / distance) * force * 2;
                    p.y -= (dy / distance) * force * 2;
                }
            }

            // Draw particle
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connections
            for (let j = i + 1; j < this.particles.length; j++) {
                let p2 = this.particles[j];
                let dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

                if (dist < this.connectionDistance) {
                    let opacity = (1 - dist / this.connectionDistance) * 0.2;
                    this.ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('hero-canvas');
});
