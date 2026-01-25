// =========================================
// VAAYAK Motors - Complete JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initConfigurator();
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
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    navLinks.classList.remove('active');
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
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
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section-header, .industry-card, .model-card, .support-card, .fleet-feature, .gallery-item').forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-element { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .animate-element.animate-in { opacity: 1; transform: translateY(0); }
        .industry-card:nth-child(1), .support-card:nth-child(1), .gallery-item:nth-child(1) { transition-delay: 0s; }
        .industry-card:nth-child(2), .support-card:nth-child(2), .gallery-item:nth-child(2) { transition-delay: 0.1s; }
        .industry-card:nth-child(3), .support-card:nth-child(3), .gallery-item:nth-child(3) { transition-delay: 0.2s; }
        .gallery-item:nth-child(4) { transition-delay: 0.3s; }
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
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
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
    img.style.filter = getColorFilter(btn.dataset.color);
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
    document.getElementById('totalPrice').textContent = '$' + total.toLocaleString();
}

function changeView(thumb, imageUrl) {
    document.querySelectorAll('.config-thumbnails .thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    
    const mainImage = document.getElementById('configTruckImage');
    mainImage.style.opacity = '0.5';
    
    setTimeout(() => {
        mainImage.src = imageUrl;
        mainImage.style.opacity = '1';
    }, 200);
}

// ========== CTA FUNCTIONS ==========
function scrollToModels(industry) {
    document.getElementById('models').scrollIntoView({ behavior: 'smooth' });
    showToast('Showing ' + industry + ' vehicles', 'info');
}

function selectModel(modelId) {
    const btn = document.querySelector('.model-btn[data-model="' + modelId + '"]');
    if (btn) {
        selectModelBtn(btn);
    }
}

function downloadSpecs(modelName) {
    showToast('Downloading ' + modelName + ' specifications...', 'success');
    
    setTimeout(() => {
        const content = 'VAAYAK MOTORS - ' + modelName + ' SPECIFICATIONS\n============================================\n\nEngine: Heavy-Duty Diesel\nPower: 380-500 HP\nTorque: 1800-2500 Nm\nTransmission: 12-Speed Automated\nDrive Configuration: 4x2 / 6x4 / 8x4\nGVW: 45-70 Tonnes\n\nDIMENSIONS\n-----------\nLength: 7,500 - 9,200 mm\nWidth: 2,550 mm\nHeight: 3,200 - 3,500 mm\n\nFEATURES\n--------\n- Premium Cabin with A/C\n- Advanced Telematics\n- ABS + EBS Braking System\n- Hill Start Assist\n- Cruise Control\n\nContact: sales@vaayakmotors.com\nPhone: +234 800 VAAYAK';
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = modelName.replace(/\s+/g, '_') + '_Specs.txt';
        a.click();
        URL.revokeObjectURL(url);
    }, 1000);
}

function openCatalog() {
    showToast('Opening full catalog...', 'info');
    setTimeout(() => {
        document.getElementById('models').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function requestQuote() {
    const total = document.getElementById('totalPrice').textContent;
    showToast('Quote request for ' + total + ' - Redirecting to contact form...', 'success');
    
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('interest').value = 'mining';
        document.getElementById('message').value = 'I am interested in a configured truck at ' + total + '. Please contact me with more details.';
    }, 1000);
}

function saveConfiguration() {
    const config = {
        model: configState.model,
        total: document.getElementById('totalPrice').textContent,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('vaayak_config', JSON.stringify(config));
    showToast('Configuration saved! You can return anytime to continue.', 'success');
}

function openFleetPortal() {
    showToast('Fleet Portal requires authentication. Contact sales for access.', 'info');
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('interest').value = 'fleet';
    }, 1500);
}

function submitForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    
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

// Add slideOut animation
const toastStyle = document.createElement('style');
toastStyle.textContent = '@keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
document.head.appendChild(toastStyle);

// ========== PARALLAX ==========
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg');
    const scrolled = window.pageYOffset;
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
    }
});

// Console branding
console.log('%c VAAYAK MOTORS ', 'background: #c8102e; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px;');