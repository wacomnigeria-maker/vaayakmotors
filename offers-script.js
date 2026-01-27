// =========================================
// VAAYAK Motors - Offers Page JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initFilters();
    initScrollAnimations();
    
    console.log('%c VAAYAK MOTORS - OFFERS ', 'background: #c8102e; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px;');
});

// ========== LOADER ==========
function initLoader() {
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1000);
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
    });
    
    // FIXED: Hamburger menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
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

// ========== FILTERS ==========
function initFilters() {
    // Initialize with all offers visible
    filterOffers();
}

function filterOffers() {
    const industryFilter = document.getElementById('industryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const cards = Array.from(document.querySelectorAll('.offer-card'));
    
    // Filter by industry
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (industryFilter === 'all' || category === industryFilter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Get visible cards
    const visibleCards = cards.filter(card => card.style.display !== 'none');
    
    // Sort visible cards
    visibleCards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        
        switch(sortFilter) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                return b.getAttribute('data-date') - a.getAttribute('data-date');
            case 'featured':
            default:
                return a.classList.contains('featured') ? -1 : 1;
        }
    });
    
    // Reorder in DOM
    const grid = document.getElementById('offersGrid');
    visibleCards.forEach(card => {
        grid.appendChild(card);
    });
    
    // Show toast with filter results
    const count = visibleCards.length;
    const message = industryFilter === 'all' 
        ? `Showing all ${count} offers`
        : `Found ${count} offers in ${getIndustryName(industryFilter)}`;
    
    showToast(message, 'info');
}

function getIndustryName(value) {
    const names = {
        'haulage': 'Haulage & Construction',
        'oil-gas': 'Oil & Gas',
        'mining': 'Mining & Construction',
        'shipping': 'Import & Export Shipping'
    };
    return names[value] || value;
}

function resetFilters() {
    document.getElementById('industryFilter').value = 'all';
    document.getElementById('sortFilter').value = 'featured';
    filterOffers();
    showToast('Filters reset', 'success');
}

// ========== REQUEST QUOTE ==========
function requestQuote(vehicleName, category) {
    // Store in localStorage
    const quoteData = {
        vehicle: vehicleName,
        category: category,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('vaayak_quote_request', JSON.stringify(quoteData));
    
    // Show success message
    showToast(`Quote request for ${vehicleName} saved! Redirecting to contact form...`, 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'index.html#contact';
    }, 1500);
}

// ========== SPARE PARTS ==========
function requestSparePartQuote(partType) {
    const partNames = {
        'truck': 'Truck Spare Parts',
        'motorcycle': 'Motorcycle (Okada) Spare Parts',
        'tricycle': 'Tricycle (Keke/Maruwa) Spare Parts'
    };
    
    const quoteData = {
        type: 'spare-parts',
        category: partType,
        name: partNames[partType],
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('vaayak_spare_parts_quote', JSON.stringify(quoteData));
    
    showToast(`Request for ${partNames[partType]} saved! Redirecting to contact form...`, 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html#contact';
    }, 1500);
}

function viewSparePartsCatalog(partType) {
    const catalogNames = {
        'truck': 'Truck Spare Parts Catalog',
        'motorcycle': 'Motorcycle Spare Parts Catalog',
        'tricycle': 'Tricycle Spare Parts Catalog'
    };
    
    showToast(`Opening ${catalogNames[partType]}...`, 'info');
    
    // In a real implementation, this would open a PDF or catalog page
    setTimeout(() => {
        showToast('Catalog will be available soon. Please contact us for immediate assistance.', 'info');
    }, 1000);
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
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe cards
    document.querySelectorAll('.offer-card, .spare-part-card').forEach(el => {
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
        .offer-card:nth-child(1), .spare-part-card:nth-child(1) { transition-delay: 0s; }
        .offer-card:nth-child(2), .spare-part-card:nth-child(2) { transition-delay: 0.1s; }
        .offer-card:nth-child(3), .spare-part-card:nth-child(3) { transition-delay: 0.2s; }
        .offer-card:nth-child(4), .spare-part-card:nth-child(4) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
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
    
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${icon}
        </svg>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add toast animation
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideOutRight { 
        from { transform: translateX(0); opacity: 1; } 
        to { transform: translateX(100%); opacity: 0; } 
    }
`;
document.head.appendChild(toastStyle);

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
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