/* ========================================
   Alexandre Cabral Portfolio - JavaScript
   Interactive features and animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Custom Cursor =====
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            // Cursor follows immediately
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Follower has a delay
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
                cursorFollower.style.borderColor = 'var(--primary-light)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
                cursorFollower.style.borderColor = 'var(--primary-color)';
            });
        });
    }
    
    // ===== Mobile Navigation =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== Active Navigation Link =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    
    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            function updateCounter() {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }
            
            updateCounter();
        });
    }
    
    // Trigger counter animation when hero is visible
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(heroSection);
    }
    
    // ===== Dynamic Portfolio Loading from Config =====
    function renderPortfolio() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        
        if (!portfolioGrid || !window.portfolioConfig) {
            console.warn('Portfolio config não encontrado, usando fallback estático');
            return;
        }
        
        const { projects } = window.portfolioConfig;
        
        // Limpa o grid (remove noscript fallback)
        portfolioGrid.innerHTML = '';
        
        // Renderiza cada projeto
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.setAttribute('data-category', project.category);
            item.setAttribute('data-type', project.type);
            
            const isVideo = project.type === 'video';
            const icon = isVideo ? 'bx-play-circle' : 'bx-link-external';
            
            item.innerHTML = `
                <div class="portfolio-image">
                    <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <div class="portfolio-info">
                            <h4>${project.title}</h4>
                            <p>${project.description}</p>
                            ${project.tags ? `<div class="portfolio-tags">${project.tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>` : ''}
                        </div>
                        ${project.link ? `
                            <a href="${project.link}" target="_blank" class="portfolio-link" aria-label="Ver projeto">
                                <i class='bx ${icon}'></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
            
            portfolioGrid.appendChild(item);
        });
        
        // Re-inicializa os filtros com os novos itens
        initPortfolioFilters();
        
        // Re-inicializa as animações de reveal
        initRevealAnimations();
    }
    
    // ===== Portfolio Filter =====
    function initPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterBtns.forEach(btn => {
            // Remove event listeners antigos
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Re-seleciona os botões após clone
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }
    
    // ===== Scroll Reveal Animation =====
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-card, .about-content');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }
    
    // Inicializa o portfolio dinâmico
    renderPortfolio();
    
    // ===== Scroll Reveal Animation =====
    const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-card, .about-content');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
    
    // ===== Back to Top Button =====
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== Form Submission =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link or handle submission
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject || 'Contato via Portfolio')}&body=${encodeURIComponent(
                `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
            )}`;
            
            // Show success message
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="bx bx-check"></i> Mensagem Enviada!';
            btn.style.background = 'linear-gradient(135deg, #00D4AA, #00B894)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                this.reset();
            }, 3000);
            
            // Open email client
            window.location.href = mailtoLink;
        });
    }
    
    // ===== Typed Text Effect =====
    const typedText = document.querySelector('.typed-text');
    
    if (typedText) {
        const texts = ['| Motion Designer', '| Identidade Visual', '| Prototipagem 3D', '| 2D Artist'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typedText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingDelay = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingDelay = 500; // Pause before typing next
            } else {
                typingDelay = isDeleting ? 50 : 100;
            }
            
            setTimeout(type, typingDelay);
        }
        
        // Start typing effect after a short delay
        setTimeout(type, 1000);
    }
    
    // ===== Parallax Effect for Shapes =====
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // ===== Floating Cards Animation =====
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
    
    // ===== Tool Item Hover Effect =====
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const tool = item.getAttribute('data-tool');
            console.log(`Hovered: ${tool}`);
        });
    });
    
    // ===== Page Load Animations =====
    document.body.classList.add('loaded');
    
    // Add CSS animation for fade in
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        body.loaded .hero-content {
            animation: fadeInLeft 1s ease forwards;
        }
        
        body.loaded .hero-image {
            animation: fadeInRight 1s ease 0.3s forwards;
        }
    `;
    document.head.appendChild(style);
    
    // ===== Image Lazy Loading (if images are added later) =====
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ===== Console Easter Egg =====
    console.log('%c👋 Olá! Bem-vindo ao meu portfolio!', 'font-size: 20px; color: #FF8C00; font-weight: bold;');
    console.log('%c💼 Alexandre Cabral - Designer Industrial & Motion Designer', 'font-size: 14px; color: #1A1A2E;');
    console.log('%c📍 Rio de Janeiro, Brasil', 'font-size: 12px; color: #757575;');
});

// ===== Preloader (Optional) =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
