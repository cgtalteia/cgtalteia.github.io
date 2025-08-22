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
            hamburger: document.querySelector('.hamburger'),
            overlay: document.querySelector('.overlay'),
            navAdhesionButton: document.querySelector('#nav-adhesion-button'),
            adminLoginButton: document.querySelector('#admin-login-button'),
            floatingLoginContainer: document.querySelector('#floating-login-container'),
            floatingAdminMenu: document.querySelector('#floating-admin-menu'),
            floatingLoginForm: document.querySelector('#floating-login-form'),
            floatingLoginError: document.querySelector('#floating-login-error'),
            adminEditPosts: document.querySelector('#admin-edit-posts'),
            adminLogout: document.querySelector('#admin-logout')
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
            hrefElement.scrollIntoView({
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
                const element = document.querySelector(link.getAttribute('href'));
                if (element) {
                    handleSmoothScroll.call(link, e);
                } else {
                    // External links don't need special handling
                    return;
                }
            });
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

    /**
     * Handle admin logout functionality
     */
    function initAdminLogout(elements) {
        if (elements.adminLogout) {
            elements.adminLogout.addEventListener('click', function() {
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminUsername');
                updateAdminButtonState(elements, false);
                hideFloatingMenus(elements);
            });
        }
    }

    /**
     * Initialize floating login system
     */
    function initFloatingLogin(elements) {
        // Simple demo credentials
        const ADMIN_CREDENTIALS = {
            'admin': 'cgt2025',
            'moderateur': 'alteia123'
        };

        // Admin login button click handler
        if (elements.adminLoginButton) {
            elements.adminLoginButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
                
                if (isLoggedIn) {
                    // Show admin menu
                    hideFloatingMenus(elements);
                    showFloatingAdminMenu(elements);
                } else {
                    // Show login form
                    hideFloatingMenus(elements);
                    showFloatingLogin(elements);
                }
            });
        }

        // Floating login form handler
        if (elements.floatingLoginForm) {
            elements.floatingLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('floating-username').value;
                const password = document.getElementById('floating-password').value;
                
                if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username] === password) {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    sessionStorage.setItem('adminUsername', username);
                    updateAdminButtonState(elements, true);
                    hideFloatingMenus(elements);
                    elements.floatingLoginError.style.display = 'none';
                    
                    // Clear form
                    elements.floatingLoginForm.reset();
                } else {
                    elements.floatingLoginError.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
                    elements.floatingLoginError.style.display = 'block';
                }
            });
        }

        // Admin edit posts button
        if (elements.adminEditPosts) {
            elements.adminEditPosts.addEventListener('click', function() {
                window.location.href = 'admin.html';
            });
        }

        // Close floating menus when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.floating-login') && 
                !e.target.closest('.floating-admin-menu') && 
                !e.target.closest('#admin-login-button')) {
                hideFloatingMenus(elements);
            }
        });
    }

    /**
     * Position the floating login container correctly
     */
    function positionFloatingLogin(elements) {
        const navContainer = elements.nav.querySelector('.nav-container');
        const loginButton = elements.adminLoginButton;
        const loginContainer = elements.floatingLoginContainer;

        if (navContainer && loginButton && loginContainer) {
            const navRect = navContainer.getBoundingClientRect();
            const buttonRect = loginButton.getBoundingClientRect();

            // Calculate the correct position
            const offsetRight = window.innerWidth - navRect.right + parseInt(getComputedStyle(document.documentElement).getPropertyValue(window.innerWidth <= 760 ? '--spacing-xs' : '--spacing-lg'));
            loginContainer.style.top = `${buttonRect.bottom}px`;
            loginContainer.style.right = `${offsetRight}px`;
        }
    }

    /**
     * Position the floating admin menu correctly
     */
    function positionFloatingAdminMenu(elements) {
        const navContainer = elements.nav.querySelector('.nav-container');
        const loginButton = elements.adminLoginButton;
        const adminMenu = elements.floatingAdminMenu;

        if (navContainer && loginButton && adminMenu) {
            const navRect = navContainer.getBoundingClientRect();
            const buttonRect = loginButton.getBoundingClientRect();

            // Calculate the correct position
            const offsetRight = window.innerWidth - navRect.right;
            adminMenu.style.top = `${buttonRect.bottom}px`;
            adminMenu.style.right = `${offsetRight}px`;
        }
    }

    /**
     * Show floating login
     */
    function showFloatingLogin(elements) {
        if (elements.floatingLoginContainer) {
            positionFloatingLogin(elements);
            elements.floatingLoginContainer.classList.add('active');
        }
    }

    /**
     * Show floating admin menu
     */
    function showFloatingAdminMenu(elements) {
        if (elements.floatingAdminMenu) {
            positionFloatingAdminMenu(elements);
            elements.floatingAdminMenu.classList.add('active');
        }
    }

    /**
     * Hide all floating menus
     */
    function hideFloatingMenus(elements) {
        if (elements.floatingLoginContainer) {
            elements.floatingLoginContainer.classList.remove('active');
        }
        if (elements.floatingAdminMenu) {
            elements.floatingAdminMenu.classList.remove('active');
        }
    }

    /**
     * Update admin button state
     */
    function updateAdminButtonState(elements, isLoggedIn) {
        if (elements.adminLoginButton) {
            if (isLoggedIn) {
                elements.adminLoginButton.classList.add('logged-in');
            } else {
                elements.adminLoginButton.classList.remove('logged-in');
            }
        }
    }

    /**
     * Check admin session and show/hide logout button
     */
    function checkAdminSession(elements) {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        updateAdminButtonState(elements, isLoggedIn);
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
            initAdminLogout(elements);
            initFloatingLogin(elements); // Initialize floating login
            checkAdminSession(elements);
            
            // Return elements for page-specific customization
            return elements;
        }
    };
})();

// Make it available globally
window.navModule = navModule; 