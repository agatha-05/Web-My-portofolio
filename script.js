/* ===================================
   PREMIUM PORTFOLIO - SCRIPT.JS
   Muhammad Arif Portfolio
   =================================== */

// ===== UNIVERSE CANVAS ANIMATION =====
class UniverseCanvas {
    constructor() {
        this.canvas = document.getElementById('universeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.particles = [];
        this.starCount = 800;
        this.particleCount = 150;
        this.time = 0;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    init() {
        // Initialize stars
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                brightness: Math.random() * 0.5 + 0.5,
                color: Math.random() > 0.7 ? 'blue' : (Math.random() > 0.5 ? 'white' : 'purple')
            });
        }
        
        // Initialize particles
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000 - 500,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                hue: Math.random() * 60 + 200
            });
        }
    }
    
    drawStars() {
        const isLight = document.body.classList.contains('light-theme');
        
        this.stars.forEach(star => {
            const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset);
            const currentOpacity = star.opacity * (0.5 + twinkle * 0.5) * star.brightness;
            
            let starColor;
            if (isLight) {
                switch(star.color) {
                    case 'blue':
                        starColor = `rgba(74, 144, 226, ${currentOpacity * 0.6})`;
                        break;
                    case 'purple':
                        starColor = `rgba(147, 51, 234, ${currentOpacity * 0.6})`;
                        break;
                    default:
                        starColor = `rgba(100, 116, 139, ${currentOpacity * 0.7})`;
                }
            } else {
                switch(star.color) {
                    case 'blue':
                        starColor = `rgba(147, 197, 253, ${currentOpacity})`;
                        break;
                    case 'purple':
                        starColor = `rgba(196, 181, 253, ${currentOpacity})`;
                        break;
                    default:
                        starColor = `rgba(255, 255, 255, ${currentOpacity})`;
                }
            }
            
            // Draw star glow
            if (star.size > 1) {
                const glowGradient = this.ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 3
                );
                glowGradient.addColorStop(0, starColor);
                glowGradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw star core
            this.ctx.fillStyle = starColor;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add cross sparkle for bright stars
            if (star.brightness > 0.8 && star.size > 0.8) {
                this.ctx.strokeStyle = starColor;
                this.ctx.lineWidth = 0.5;
                this.ctx.globalAlpha = currentOpacity * 0.6;
                
                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y - star.size * 2);
                this.ctx.lineTo(star.x, star.y + star.size * 2);
                this.ctx.stroke();
                
                this.ctx.beginPath();
                this.ctx.moveTo(star.x - star.size * 2, star.y);
                this.ctx.lineTo(star.x + star.size * 2, star.y);
                this.ctx.stroke();
                
                this.ctx.globalAlpha = 1;
            }
        });
    }
    
    drawParticles() {
        const isLight = document.body.classList.contains('light-theme');
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // 3D projection
            const scale = 500 / (500 + particle.z);
            const projectedSize = particle.size * scale;
            
            // Draw particle with glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, projectedSize * 3
            );
            
            const particleColor = isLight 
                ? `hsla(${particle.hue}, 70%, 50%, ${particle.opacity * scale})`
                : `hsla(${particle.hue}, 80%, 60%, ${particle.opacity * scale})`;
            
            gradient.addColorStop(0, particleColor);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, projectedSize * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw core
            this.ctx.fillStyle = isLight 
                ? `hsla(${particle.hue}, 80%, 60%, ${particle.opacity * scale})`
                : `hsla(${particle.hue}, 100%, 70%, ${particle.opacity * scale})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, projectedSize, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dz = p1.z - p2.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.2;
                    this.ctx.strokeStyle = isLight 
                        ? `rgba(74, 144, 226, ${opacity})`
                        : `rgba(47, 47, 228, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.time++;
        
        const isLight = document.body.classList.contains('light-theme');
        const bgColor = isLight ? 'rgba(240, 242, 245, 0.1)' : 'rgba(8, 6, 22, 0.1)';
        
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawStars();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== TYPING EFFECT =====
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== SCROLL REVEAL ANIMATION =====
class ScrollReveal {
    constructor() {
        this.sections = document.querySelectorAll('.section-reveal');
        this.observeSections();
    }
    
    observeSections() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, options);
        
        this.sections.forEach(section => observer.observe(section));
    }
}

// ===== NAVBAR ACTIVE STATE =====
class NavbarController {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.initNavigation();
        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
    }
    
    initNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    updateActiveLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== ZEN MODE TOGGLE =====
class ZenMode {
    constructor() {
        this.btn = document.getElementById('zenModeBtn');
        this.isZenMode = false;
        
        this.btn.addEventListener('click', () => this.toggle());
    }
    
    toggle() {
        this.isZenMode = !this.isZenMode;
        document.body.classList.toggle('zen-mode', this.isZenMode);
        
        // Show notification
        this.showNotification(this.isZenMode ? 'Zen Mode Enabled' : 'Zen Mode Disabled');
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 2rem;
            background: var(--primary-glow);
            color: white;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ===== THEME TOGGLE =====
class ThemeToggle {
    constructor() {
        this.btn = document.getElementById('themeToggleBtn');
        this.isLight = false;
        
        this.btn.addEventListener('click', () => this.toggle());
    }
    
    toggle() {
        this.isLight = !this.isLight;
        document.body.classList.toggle('light-theme', this.isLight);
        
        // Update icon
        const icon = this.btn.querySelector('.theme-icon path');
        if (this.isLight) {
            icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
        } else {
            icon.setAttribute('d', 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z');
        }
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
    constructor() {
        this.btn = document.getElementById('backToTopBtn');
        
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.btn.addEventListener('click', () => this.scrollToTop());
    }
    
    toggleVisibility() {
        if (window.scrollY > 300) {
            this.btn.classList.add('visible');
        } else {
            this.btn.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== EASTER EGG - CONFETTI =====
class EasterEgg {
    constructor() {
        this.logo = document.getElementById('profileLogo');
        this.clickCount = 0;
        this.clickTimeout = null;
        
        this.logo.addEventListener('click', () => this.handleClick());
    }
    
    handleClick() {
        this.clickCount++;
        
        clearTimeout(this.clickTimeout);
        this.clickTimeout = setTimeout(() => {
            this.clickCount = 0;
        }, 1000);
        
        if (this.clickCount === 5) {
            this.triggerConfetti();
            this.clickCount = 0;
        }
    }
    
    triggerConfetti() {
        const container = document.getElementById('confettiContainer');
        const colors = ['#2F2FE4', '#ff79c6', '#50fa7b', '#8be9fd', '#f1fa8c', '#ff5f56'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                container.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 20);
        }
        
        // Show celebration message
        this.showCelebration();
    }
    
    showCelebration() {
        const message = document.createElement('div');
        message.innerHTML = '🎉 You found the Easter Egg! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2rem 3rem;
            background: var(--primary-glow);
            color: white;
            border-radius: 20px;
            font-size: 2rem;
            font-weight: 700;
            z-index: 10001;
            animation: scaleIn 0.5s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'scaleOut 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }
}

// ===== DOWNLOAD CV HANDLER =====
class DownloadCV {
    constructor() {
        this.btn = document.getElementById('downloadCV');
        this.btn.addEventListener('click', (e) => this.handleDownload(e));
    }
    
    handleDownload(e) {
        e.preventDefault();
        
        // Show notification
        const notification = document.createElement('div');
        notification.textContent = 'CV Download will be available soon!';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            background: var(--primary-glow);
            color: white;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ===== 3D CARD TILT EFFECT =====
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.role-card, .tech-card, .project-card, .contact-card');
        this.initTilt();
    }
    
    initTilt() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }
    
    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===== ADD ANIMATIONS TO CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes scaleIn {
        from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes scaleOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Universe Canvas
    new UniverseCanvas();
    
    // Initialize Typing Effect
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        new TypingEffect(typingElement, [
            'Web & Mobile Programmer',
            'IT Student',
            'COO @ Shift Digital Indonesia',
            'Full Stack Developer',
            'Tech Enthusiast'
        ], 80);
    }
    
    // Initialize Scroll Reveal
    new ScrollReveal();
    
    // Initialize Navbar Controller
    new NavbarController();
    
    // Initialize Zen Mode
    new ZenMode();
    
    // Initialize Theme Toggle
    new ThemeToggle();
    
    // Initialize Back to Top
    new BackToTop();
    
    // Initialize Easter Egg
    new EasterEgg();
    
    // Initialize Download CV
    new DownloadCV();
    
    // Initialize Card Tilt
    new CardTilt();
    
    console.log('🚀 Portfolio initialized successfully!');
    console.log('💡 Tip: Click the profile logo 5 times quickly for a surprise!');
});