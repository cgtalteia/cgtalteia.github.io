/**
 * CGT Alteia Navigation Module
 * Shared navigation functionality for all pages
 */

// Immediately-invoked Function Expression to create a module
const navModule = (function() {
    'use strict';

    // Private variables and functions
    const getElements = () => {
        return {
            nav: document.querySelector('.nav'),
            navLogo: document.querySelector('.nav-logo'),
            navLinks: document.querySelectorAll('.nav a'),
            quiSommesNousLink: document.querySelectorAll('.qui-sommes-nous-link'),
            hamburger: document.querySelector('.hamburger'),
            overlay: document.querySelector('.overlay'),
            navAdhesionButton: document.querySelector('#nav-adhesion-button')
        };
    };

    // Hide nav with transition
    function hideNavWithTransition(nav, overlay) {
        nav.style.opacity = '0';
        // Listen for the end of the transition
        nav.addEventListener('transitionend', function handler() {
            if (window.getComputedStyle(nav).opacity === '0' && 
                window.getComputedStyle(overlay).opacity === '0') {
                nav.style.display = 'none';
            }
            nav.removeEventListener('transitionend', handler);
        });
    }

    // Show nav with transition
    function showNavWithTransition(nav) {
        nav.style.display = 'block';
        // Force a reflow to ensure the transition happens
        void nav.offsetWidth;
        nav.style.opacity = '1';
    }

    /**
     * Scroll to top of page
     */
    function scrollToTop(e) {
        if (e) e.preventDefault();
        document.querySelector('body').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    /**
     * Handle smooth scrolling for navigation links
     */
    function handleSmoothScroll(e) {
        e.preventDefault();
        const hrefElement = document.querySelector(this.getAttribute('href'));
        if (hrefElement) {
            const targetElement = hrefElement.querySelector('.hero-title');
            const parentContainer = targetElement.parentElement;
            parentContainer.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }

    /**
     * Initialize navigation logo functionality
     */
    function initNavLogo(elements, isHomePage) {
        if (isHomePage) {
            // On home page, clicking logo scrolls to top
            elements.navLogo.addEventListener('click', scrollToTop);
        } else {
            // On other pages, clicking logo returns to home page
            elements.navLogo.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }

        // Navigation opacity handling for scrolling
        var previousScrollPosition = window.scrollY;
        window.onscroll = function() {
            var currentScrollPosition = window.scrollY;
            if (Math.abs(previousScrollPosition - currentScrollPosition) > 20) {
                if (previousScrollPosition > currentScrollPosition) {
                    showNavWithTransition(elements.nav);
                } else {
                    hideNavWithTransition(elements.nav, elements.overlay);
                }
            }
            previousScrollPosition = currentScrollPosition;
        };
    }

    // Show overlay with transition
    function showOverlayWithTransition(overlay) {
        overlay.style.display = 'block';
        // Force a reflow to ensure the transition happens
        void overlay.offsetWidth;
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateY(0%)';
    }

    // Hide overlay with transition
    function hideOverlayWithTransition(overlay) {
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateY(-5%)';
        // Listen for the end of the transition
        overlay.addEventListener('transitionend', function handler() {
            if (window.getComputedStyle(overlay).opacity === '0') {
                overlay.style.display = 'none';
            }
            overlay.removeEventListener('transitionend', handler);
        });
    }

    /**
     * Initialize overlay/hamburger menu functionality
     */
    function handleOverlay(elements) {
        // Hamburger menu handling
        if (elements.hamburger && elements.overlay) {
            elements.hamburger.addEventListener('click', function() {
                if (window.getComputedStyle(elements.overlay).display === 'none') {
                    showOverlayWithTransition(elements.overlay);
                } else {
                    hideOverlayWithTransition(elements.overlay);
                }
            });
        }

        // Close overlay when scrolling
        window.addEventListener('scroll', function() {
            if (elements.overlay) {
                hideOverlayWithTransition(elements.overlay);
            }
        });

        // Handle navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (elements.overlay) {
                    hideOverlayWithTransition(elements.overlay);
                }
                // if not on home page, go to home page and then scroll to the target element
                if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/') && link.getAttribute('href').startsWith('#')) {
                    window.location.href = 'index.html#' + link.getAttribute('href').slice(1);
                }
                // Handle smooth scrolling for anchor links on current page
                if (link.getAttribute('href').startsWith('#')) {
                    handleSmoothScroll.call(link, e);
                }
            });
        });

        // Qui sommes-nous link special handling
        elements.quiSommesNousLink.forEach(link => {
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                link.addEventListener('click', scrollToTop);
            }
        });

        // Handle clicks outside of the overlay
        document.addEventListener('click', function(e) {
            if (elements.overlay && !elements.overlay.contains(e.target) && !elements.hamburger.contains(e.target)) {
                hideOverlayWithTransition(elements.overlay);
            }
        });
    }

    /**
     * Handle adhesion button clicks
     */
    function initAdhesionButton(elements) {
        if (elements.navAdhesionButton) {
            elements.navAdhesionButton.addEventListener('click', function() {
                window.location.href = 'adhesion.html';
            });
        }
    }

    // Public API
    return {
        /**
         * Initialize all navigation functionality
         * @param {Object} options - Configuration options
         * @param {boolean} options.isHomePage - Whether this is the home page
         */
        init: function(options = {}) {
            const isHomePage = options.isHomePage || false;
            const elements = getElements();
            
            initNavLogo(elements, isHomePage);
            handleOverlay(elements);
            initAdhesionButton(elements);
            
            // Return elements for page-specific customization
            return elements;
        }
    };
})();

// Make it available globally
window.navModule = navModule; 