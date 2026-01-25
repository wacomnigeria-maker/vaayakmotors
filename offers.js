// =========================================
// VAAYAK Motors - Special Offers Page JS
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initScrollAnimations();
    initFilters();
});

// ========== LOADER ==========
function initLoader() {
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1200);
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
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
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
    
    document.querySelectorAll('.offer-card').forEach((el, index) => {
        el.classList.add('animate-element');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
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
    `;
    document.head.appendChild(style);
}

// ========== FILTERS ==========
function initFilters() {
    // Add initial count
    updateResultsCount();
}

function filterOffers() {
    const industryFilter = document.getElementById('industryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const cards = Array.from(document.querySelectorAll('.offer-card'));
    
    // Filter by industry
    cards.forEach(card => {
        const category = card.dataset.category;
        if (industryFilter === 'all' || category === industryFilter) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Sort
    const visibleCards = cards.filter(card => !card.classList.contains('hidden'));
    const grid = document.getElementById('offersGrid');
    
    if (sortFilter === 'price-low') {
        visibleCards.sort((a, b) => {
            return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        });
    } else if (sortFilter === 'price-high') {
        visibleCards.sort((a, b) => {
            return parseInt(b.dataset.price) - parseInt(a.dataset.price);
        });
    } else if (sortFilter === 'newest') {
        visibleCards.reverse();
    }
    
    // Re-append cards in sorted order
    visibleCards.forEach(card => {
        grid.appendChild(card);
    });
    
    updateResultsCount();
    showToast(`Filtered: ${visibleCards.length} offers found`, 'info');
}

function resetFilters() {
    document.getElementById('industryFilter').value = 'all';
    document.getElementById('sortFilter').value = 'featured';
    
    const cards = document.querySelectorAll('.offer-card');
    cards.forEach(card => {
        card.classList.remove('hidden');
    });
    
    updateResultsCount();
    showToast('Filters reset - Showing all offers', 'info');
}

function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.offer-card:not(.hidden)');
    console.log(`Showing ${visibleCards.length} offers`);
}

// ========== CTA FUNCTIONS ==========
function requestQuote(modelName, category) {
    const message = `I am interested in the ${modelName} (${category}). Please provide me with a detailed quote including:\n\n` +
                   `- Final pricing\n` +
                   `- Available financing options\n` +
                   `- Delivery timeline\n` +
                   `- Warranty details\n\n` +
                   `Thank you!`;
    
    showToast('Redirecting to contact form...', 'success');
    
    setTimeout(() => {
        // In production, this would navigate to contact page with pre-filled data
        window.location.href = `index.html#contact`;
        
        // If on same page, pre-fill form
        setTimeout(() => {
            const messageField = document.getElementById('message');
            const interestField = document.getElementById('interest');
            
            if (messageField) {
                messageField.value = message;
            }
            
            if (interestField) {
                const categoryMap = {
                    'haulage': 'construction',
                    'oil-gas': 'logistics',
                    'mining': 'mining',
                    'shipping': 'logistics'
                };
                interestField.value = categoryMap[category] || 'mining';
            }
        }, 500);
    }, 1000);
}

function viewDetails(offerId) {
    showToast('Loading detailed specifications...', 'info');
    
    setTimeout(() => {
        // In production, this would open a modal or navigate to detail page
        const detailsHTML = `
            <div style="padding: 20px; max-width: 800px;">
                <h2>Detailed Specifications</h2>
                <p>Complete technical specifications, features, and pricing breakdown for ${offerId}</p>
                <ul style="margin-top: 20px; line-height: 2;">
                    <li>Engine Performance & Fuel Economy</li>
                    <li>Chassis & Suspension Details</li>
                    <li>Safety Features & Certifications</li>
                    <li>Interior Comfort & Technology</li>
                    <li>Warranty & Service Packages</li>
                    <li>Financing Options Available</li>
                </ul>
            </div>
        `;
        
        showToast('Details view coming soon - Please contact sales for full specs', 'info');
    }, 800);
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

// ========== PHONE CALL TRACKING ==========
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Call initiated: ' + link.href);
        showToast('Connecting your call...', 'success');
    });
});

// Console branding
console.log('%c VAAYAK MOTORS - SPECIAL OFFERS ', 'background: #c8102e; color: white; font-size: 18px; font-weight: bold; padding: 10px 20px;');
console.log('%c Browse our exclusive deals on heavy-duty commercial vehicles ', 'color: #666; font-size: 12px; padding: 5px;');