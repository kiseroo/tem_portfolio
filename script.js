// Galaxy Animation
(function() {
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Resize canvas to full window
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    // Star class
    class Star {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 0.5;
            this.speed = Math.random() * 0.05 + 0.01;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = [
                '100, 99, 255', // Purple-Blue
                '0, 228, 255',   // Cyan
                '157, 78, 221',  // Purple
                '66, 218, 250'   // Light Blue
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speed;
            if (this.x > width) {
                this.reset();
                this.x = 0;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Particle class (for nebula effect)
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 15 + 5;
            this.vx = Math.random() * 0.2 - 0.1;
            this.vy = Math.random() * 0.2 - 0.1;
            this.opacity = Math.random() * 0.05 + 0.02;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = [
                '108, 99, 255',  // Purple
                '0, 228, 255',   // Cyan
                '157, 78, 221',  // Dark Purple
                '90, 150, 250'   // Light Blue
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            this.opacity = Math.max(0.01, Math.min(0.08, this.opacity + Math.random() * 0.01 - 0.005));
        }
        
        draw() {
            ctx.beginPath();
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            
            gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Connection class (for lines between particles)
    class Connection {
        constructor(particles) {
            this.particles = particles;
            this.distance = 150;
        }
        
        update() {
            // No specific update needed
        }
        
        draw() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.distance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(108, 99, 255, ${0.05 * (1 - distance / this.distance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }
    
    // Initialize
    let stars = [];
    let particles = [];
    let connection;
    
    function init() {
        resize();
        
        stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push(new Star());
        }
        
        particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle());
        }
        
        connection = new Connection(particles);
        
        animate();
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0A0E17');
        gradient.addColorStop(1, '#131B2E');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw stars
        for (let star of stars) {
            star.update();
            star.draw();
        }
        
        // Update and draw nebula particles
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        
        // Draw connections
        connection.update();
        connection.draw();
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', resize);
    
    // Initialize on load
    init();
})();

// Intersection Observer for fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(item => {
        observer.observe(item);
    });
    
    // Animate skill bars
    setTimeout(() => {
        document.querySelectorAll('.skill-progress').forEach(progress => {
            const width = progress.getAttribute('data-width');
            progress.style.width = width;
        });
    }, 500);
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navbarLinks.classList.toggle('active');
            navbarLinks.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navbarLinks.classList.remove('active');
                navbarLinks.classList.add('hidden');
            }
        });
    });
});