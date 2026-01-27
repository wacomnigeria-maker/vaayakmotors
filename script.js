// =========================================
// VAAYAK Motors - Complete JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initConfigurator();
    initParallax();
    initButtonHoverEffects();
    
    // Console branding
    console.log('%c VAAYAK MOTORS ', 'background: #c8102e; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px;');
});

// ========== LOADER ==========
function initLoader() {
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1500);
    };
    
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}

// ========== NAVIGATION ==========
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // FIXED: Hamburger menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Close mobile menu
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    
                    // Smooth scroll to target
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.section-header, .industry-card, .model-card, .support-card, .fleet-feature, .gallery-item').forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-element { 
            opacity: 0; 
            transform: translateY(30px); 
            transition: opacity 0.6s ease, transform 0.6s ease; 
        }
        .animate-element.animate-in { 
            opacity: 1; 
            transform: translateY(0); 
        }
        .industry-card:nth-child(1), .support-card:nth-child(1), .gallery-item:nth-child(1) { transition-delay: 0s; }
        .industry-card:nth-child(2), .support-card:nth-child(2), .gallery-item:nth-child(2) { transition-delay: 0.1s; }
        .industry-card:nth-child(3), .support-card:nth-child(3), .gallery-item:nth-child(3) { transition-delay: 0.2s; }
        .industry-card:nth-child(4), .support-card:nth-child(4), .gallery-item:nth-child(4) { transition-delay: 0.3s; }
        .gallery-item:nth-child(5) { transition-delay: 0.4s; }
        .gallery-item:nth-child(6) { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);
}

// ========== COUNTERS ==========
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counter.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ========== CONFIGURATOR ==========
let configState = {
    model: 'nx430',
    modelPrice: 85000,
    colorPrice: 0,
    enginePrice: 0,
    featuresPrice: 0
};

function initConfigurator() {
    updatePrice();
}

function selectModelBtn(btn) {
    document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    configState.model = btn.dataset.model;
    configState.modelPrice = parseInt(btn.dataset.price);
    updatePrice();
    showToast('Selected ' + btn.querySelector('.model-btn-name').textContent, 'info');
}

function selectColor(btn) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    configState.colorPrice = parseInt(btn.dataset.price);
    updatePrice();
    
    const img = document.getElementById('configTruckImage');
    if (img) {
        img.style.filter = getColorFilter(btn.dataset.color);
    }
}

function getColorFilter(color) {
    const filters = {
        white: 'none',
        red: 'sepia(100%) saturate(300%) hue-rotate(-10deg)',
        blue: 'sepia(100%) saturate(300%) hue-rotate(180deg)',
        black: 'brightness(0.5)',
        silver: 'grayscale(100%)',
        orange: 'sepia(100%) saturate(500%) hue-rotate(10deg)'
    };
    return filters[color] || 'none';
}

function updatePrice() {
    const engineInput = document.querySelector('input[name="engine"]:checked');
    configState.enginePrice = engineInput ? parseInt(engineInput.dataset.price) : 0;
    
    let featuresTotal = 0;
    document.querySelectorAll('input[name="feature"]:checked').forEach(input => {
        featuresTotal += parseInt(input.dataset.price);
    });
    configState.featuresPrice = featuresTotal;
    
    const total = configState.modelPrice + configState.colorPrice + configState.enginePrice + configState.featuresPrice;
    const priceElement = document.getElementById('totalPrice');
    if (priceElement) {
        priceElement.textContent = '$' + total.toLocaleString();
    }
}

function changeView(thumb, imageUrl) {
    document.querySelectorAll('.config-thumbnails .thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    
    const mainImage = document.getElementById('configTruckImage');
    if (mainImage) {
        mainImage.style.opacity = '0.5';
        
        setTimeout(() => {
            mainImage.src = imageUrl;
            mainImage.style.opacity = '1';
        }, 200);
    }
}

// ========== CTA FUNCTIONS ==========
function scrollToModels(industry) {
    const modelsSection = document.getElementById('models');
    if (modelsSection) {
        modelsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Filter models by category
        const modelCards = document.querySelectorAll('.model-card');
        modelCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (industry === 'all' || category === industry) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
        
        showToast('Showing ' + industry + ' vehicles', 'info');
    }
}

function selectModel(modelId) {
    const btn = document.querySelector('.model-btn[data-model="' + modelId + '"]');
    if (btn) {
        selectModelBtn(btn);
    }
    showToast('Model ' + modelId.toUpperCase() + ' selected for configuration', 'info');
}

function downloadSpecs(modelName) {
    showToast('Downloading ' + modelName + ' specifications...', 'success');
    
    setTimeout(() => {
        const content = `VAAYAK MOTORS - ${modelName} SPECIFICATIONS
============================================

ENGINE & PERFORMANCE
-------------------
Engine: Heavy-Duty Diesel
Power: 380-500 HP
Torque: 1800-2500 Nm
Transmission: 12-Speed Automated
Drive Configuration: 4x2 / 6x4 / 8x4
GVW: 45-70 Tonnes

DIMENSIONS
----------
Length: 7,500 - 9,200 mm
Width: 2,550 mm
Height: 3,200 - 3,500 mm
Wheelbase: 3,600 - 5,200 mm

FEATURES
--------
✓ Premium Air-Conditioned Cabin
✓ Advanced Telematics System
✓ ABS + EBS Braking System
✓ Hill Start Assist
✓ Cruise Control
✓ Adjustable Driver Seat
✓ Multimedia System
✓ LED Headlights

SAFETY
------
✓ Electronic Stability Control
✓ Lane Departure Warning
✓ Blind Spot Monitoring
✓ Fire Suppression System
✓ Emergency Brake Assist

WARRANTY
--------
✓ 15+ Years Comprehensive Warranty
✓ 24/7 Roadside Assistance
✓ Free Maintenance (First 2 Years)

CONTACT
-------
Email: sales@vaayakmotors.com
Phone: +2347073125576
Website: www.vaayakmotors.com`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = modelName.replace(/\s+/g, '_') + '_Specifications.txt';
        a.click();
        URL.revokeObjectURL(url);
    }, 1000);
}

function openCatalog() {
    showToast('Opening full catalog...', 'info');
    setTimeout(() => {
        const modelsSection = document.getElementById('models');
        if (modelsSection) {
            modelsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 500);
}

function requestQuote() {
    const totalElement = document.getElementById('totalPrice');
    const total = totalElement ? totalElement.textContent : 'your configured vehicle';
    showToast('Quote request for ' + total + ' - Redirecting to contact form...', 'success');
    
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            const interestField = document.getElementById('interest');
            const messageField = document.getElementById('message');
            
            if (interestField) interestField.value = 'mining';
            if (messageField) messageField.value = 'I am interested in a configured truck at ' + total + '. Please contact me with more details.';
        }
    }, 1000);
}

function saveConfiguration() {
    const totalElement = document.getElementById('totalPrice');
    const config = {
        model: configState.model,
        total: totalElement ? totalElement.textContent : '$85,000',
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('vaayak_config', JSON.stringify(config));
    showToast('Configuration saved! You can return anytime to continue.', 'success');
}

function openFleetPortal() {
    showToast('Fleet Portal requires authentication. Contact sales for access.', 'info');
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            const interestField = document.getElementById('interest');
            if (interestField) interestField.value = 'fleet';
        }
    }, 1500);
}

// ========== FORM SUBMISSION ==========
function submitForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Form Data:', data);
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showToast('Thank you! Your enquiry has been submitted. We will contact you within 24 hours.', 'success');
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    
    const icon = type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
    
    toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + icon + '</svg><span>' + message + '</span>';
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ========== PARALLAX EFFECTS ==========
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Hero parallax
        const heroContent = document.querySelector('.hero-content');
        const heroImg = document.querySelector('.hero-bg');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
        
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// ========== BUTTON HOVER EFFECTS ==========
function initButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#home') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========== IMAGE LAZY LOADING FALLBACK ==========
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add slideOut animation to document
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideOutRight { 
        from { transform: translateX(0); opacity: 1; } 
        to { transform: translateX(100%); opacity: 0; } 
    }
`;
document.head.appendChild(toastStyle);