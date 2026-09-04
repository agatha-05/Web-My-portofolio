/* ===================================
   CYBERPUNK PORTFOLIO - SCRIPT.JS
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
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            const colorRand = Math.random();
            let color;
            if (colorRand > 0.85) color = 'green';
            else if (colorRand > 0.7) color = 'magenta';
            else if (colorRand > 0.55) color = 'cyan';
            else color = 'white';

            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                brightness: Math.random() * 0.5 + 0.5,
                color: color
            });
        }
        
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
                hue: Math.random() > 0.5 ? 150 : (Math.random() > 0.5 ? 300 : 190)
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
                    case 'green':
                        starColor = `rgba(0, 180, 90, ${currentOpacity * 0.6})`;
                        break;
                    case 'magenta':
                        starColor = `rgba(180, 0, 180, ${currentOpacity * 0.6})`;
                        break;
                    case 'cyan':
                        starColor = `rgba(0, 150, 180, ${currentOpacity * 0.6})`;
                        break;
                    default:
                        starColor = `rgba(100, 116, 139, ${currentOpacity * 0.7})`;
                }
            } else {
                switch(star.color) {
                    case 'green':
                        starColor = `rgba(0, 255, 136, ${currentOpacity})`;
                        break;
                    case 'magenta':
                        starColor = `rgba(255, 0, 255, ${currentOpacity})`;
                        break;
                    case 'cyan':
                        starColor = `rgba(0, 212, 255, ${currentOpacity})`;
                        break;
                    default:
                        starColor = `rgba(224, 224, 224, ${currentOpacity})`;
                }
            }
            
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
            
            this.ctx.fillStyle = starColor;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
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
        
        this.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            const scale = 500 / (500 + particle.z);
            const projectedSize = particle.size * scale;
            
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, projectedSize * 3
            );
            
            const particleColor = isLight 
                ? `hsla(${particle.hue}, 70%, 50%, ${particle.opacity * scale})`
                : `hsla(${particle.hue}, 100%, 65%, ${particle.opacity * scale})`;
            
            gradient.addColorStop(0, particleColor);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, projectedSize * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = isLight 
                ? `hsla(${particle.hue}, 80%, 50%, ${particle.opacity * scale})`
                : `hsla(${particle.hue}, 100%, 80%, ${particle.opacity * scale})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, projectedSize, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dz = p1.z - p2.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.15;
                    this.ctx.strokeStyle = isLight 
                        ? `rgba(0, 180, 90, ${opacity})`
                        : `rgba(0, 255, 136, ${opacity})`;
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
        const bgColor = isLight ? 'rgba(240, 242, 245, 0.1)' : 'rgba(10, 10, 15, 0.1)';
        
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
        
        this.showNotification(this.isZenMode ? '[ZEN MODE] ENABLED' : '[ZEN MODE] DISABLED');
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'cyber-notification';
        
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
        const colors = ['#00ff88', '#ff00ff', '#00d4ff', '#f1fa8c', '#ff5f56', '#ff3366'];
        
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
        
        this.showCelebration();
    }
    
    showCelebration() {
        const message = document.createElement('div');
        message.innerHTML = '[ EASTER EGG UNLOCKED ]';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2rem 3rem;
            background: var(--muted, #1c1c2e);
            border: 2px solid #00ff88;
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-align: center;
            z-index: 10001;
            animation: scaleIn 0.5s ease;
            box-shadow: 0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.3);
            clip-path: polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px));
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'scaleOut 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 3000);
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
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===== RANDOM GLITCH EFFECT =====
class RandomGlitch {
    constructor() {
        this.targets = document.querySelectorAll('.section-title, .hero-name');
        this.startRandomGlitches();
    }
    
    startRandomGlitches() {
        setInterval(() => {
            const target = this.targets[Math.floor(Math.random() * this.targets.length)];
            if (target && Math.random() > 0.7) {
                this.applyGlitch(target);
            }
        }, 5000);
    }
    
    applyGlitch(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        let glitched = '';
        
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.7) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += originalText[i];
            }
        }
        
        element.style.textShadow = '-2px 0 #ff00ff, 2px 0 #00d4ff';
        element.textContent = glitched;
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.textShadow = '';
        }, 100);
    }
}

// ===== SCROLL PROGRESS BAR =====
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scrollProgress');
        window.addEventListener('scroll', () => this.update());
        this.update();
    }
    
    update() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        this.progressBar.style.width = progress + '%';
    }
}

// ===== LIVE CLOCK =====
class LiveClock {
    constructor() {
        this.clockElement = document.getElementById('clockValue');
        if (!this.clockElement) return;
        this.update();
        setInterval(() => this.update(), 1000);
    }
    
    update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// ===== SKILL BARS ANIMATION =====
class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll('.skill-bar-fill');
        if (this.bars.length === 0) return;
        this.observeBars();
    }
    
    observeBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    fill.classList.add('animated');
                    observer.unobserve(fill);
                }
            });
        }, { threshold: 0.3 });
        
        this.bars.forEach(bar => observer.observe(bar));
    }
}

// ===== MAGNETIC CURSOR EFFECT =====
class MagneticCursor {
    constructor() {
        this.elements = document.querySelectorAll('.magnetic-element');
        this.initMagnetic();
    }
    
    initMagnetic() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMove(e, el));
            el.addEventListener('mouseleave', (e) => this.handleLeave(e, el));
        });
    }
    
    handleMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.03)`;
        el.style.transition = 'transform 0.15s ease-out';
    }
    
    handleLeave(e, el) {
        el.style.transform = 'translate(0, 0) scale(1)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
}

// ===== DOWNLOAD CV BUTTON =====
class DownloadCV {
    constructor() {
        this.btn = document.getElementById('downloadCV');
        if (!this.btn) return;
        this.btn.addEventListener('click', (e) => this.handleClick(e));
    }
    
    handleClick(e) {
        e.preventDefault();
        
        this.btn.style.animation = 'glitch 0.3s ease';
        setTimeout(() => {
            this.btn.style.animation = '';
        }, 300);
        
        const notification = document.createElement('div');
        notification.textContent = '[ CV ] Feature coming soon...';
        notification.className = 'cyber-notification';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    new UniverseCanvas();
    
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        new TypingEffect(typingElement, [
            'Web Developer',
            'Founder & COO @ Shift Digital Indonesia',
            'Mahasiswa D3 Teknik Informatika',
            'Koordinator Daerah PERMIKOMNAS Kalsel',
            'Koordinator PSDM HIMA TI',
            'Open for Internship'
        ], 80);
    }
    
    new ScrollReveal();
    new NavbarController();
    new ZenMode();
    new ThemeToggle();
    new BackToTop();
    new EasterEgg();
    new CardTilt();
    new RandomGlitch();
    new ScrollProgress();
    new LiveClock();
    new SkillBars();
    new MagneticCursor();
    new DownloadCV();
    
    console.log('%c[ SYSTEM ] Portfolio initialized', 'color: #00ff88; font-family: monospace; font-weight: bold;');
    console.log('%c[ TIP ] Click the profile logo 5 times for a surprise', 'color: #ff00ff; font-family: monospace;');
});
