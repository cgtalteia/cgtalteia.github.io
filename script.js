/**
 * CGT Alteia Website JavaScript
 * Main script for handling UI interactions and initializations
 */

// Immediately-invoked Function Expression for encapsulation
(function() {
    'use strict';

    // DOM Elements
    const elements = {
        nav: document.querySelector('.nav'),
        logo: document.querySelector('.nav-logo svg'),
        progressBar: document.querySelector('.progress-container'),
        headerTitle: document.getElementById('header-title'),
        headerSubtitle: document.getElementById('header-subtitle'),
        contentText: document.querySelector('.content-text'),
        navLogo: document.querySelector('.nav-logo'),
        navLinks: document.querySelectorAll('.nav-container a'),
        quiSommesNousLink: document.querySelectorAll('.qui-sommes-nous-link'),
        dropdowns: document.querySelectorAll('.dropdown'),
        dropdownLinks: document.querySelectorAll('.dropdown-content a'),
        hamburger: document.querySelector('.hamburger'),
        openBtn: document.querySelector('.openbtn'),
        closeBtn: document.querySelector('.closebtn'),
        faqItems: document.querySelectorAll('.faq-item'),
        adhesionForm: document.querySelector('#adhesion-form')
    };

    // Constants
    const HEADER_TEXT = {
        title: "std::cout << \"Bienvenue, camarade !\" << std::endl;",
        subtitle: "Retrouve toutes les informations nécessaires sur la section syndicale, ce qu'elle peut faire pour toi et comment la rejoindre."
    };
    const TYPE_SPEED = {
        title: 20,
        subtitle: 10
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initTypewriter();
        initFAQ();
        updateCurrentYear();
    });

    /**
     * Update copyright year in footer
     */
    function updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Navigation Functionality
     */
    function initNavigation() {
        // Set logo path colors
        elements.logo.querySelectorAll('path').forEach(path => {
            path.setAttribute('fill', 'white');
        });

        // Scroll progress bar
        window.addEventListener('scroll', function() {
            updateScrollProgress();
            updateAdhesionForm();
            updateNavigationState();
        });

        // Navigation links smooth scrolling
        elements.navLinks.forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        // Qui sommes-nous link special handling
        elements.quiSommesNousLink.forEach(link => {
            link.addEventListener('click', scrollToTop);
        });

        // Dropdown menu handling
        initDropdowns();

        // Hamburger menu handling
        elements.openBtn.addEventListener('click', function() {
            const overlay = elements.hamburger.querySelector('.overlay');
            overlay.style.height = '100%';
        });

        document.addEventListener('click', function(e) {
            if (!elements.openBtn.contains(e.target)) {
                const overlay = elements.hamburger.querySelector('.overlay');
                overlay.style.height = '0%';
            }
        });
        document.getElementById('copyPhone').addEventListener('click', async () => {
            const textToCopy = document.getElementById('tel').innerText;
            console.log('Texte à copier :', textToCopy);
            try {
                await navigator.clipboard.writeText(textToCopy);
                copiedSnackbar(textToCopy);
            } catch (err) {
                console.error('Erreur lors de la copie :', err);
            }
        });
        document.getElementById('copyMail').addEventListener('click', async () => {
            const textToCopy = document.getElementById('mail').innerText;
            try {
                await navigator.clipboard.writeText(textToCopy);
                copiedSnackbar(textToCopy);
            } catch (err) {
                console.error('Erreur lors de la copie :', err);
            }
        });
        document.getElementById('copyAddress').addEventListener('click', async () => {
            const textToCopy = document.getElementById('adresse').innerText;
            try {
                await navigator.clipboard.writeText(textToCopy);
                copiedSnackbar(textToCopy);
            } catch (err) {
                console.error('Erreur lors de la copie :', err);
            }
        });


        function copiedSnackbar(textToCopy) {
            const snackbar = document.getElementById('copiedSnackbar');
            snackbar.classList.add('show');
            snackbar.innerHTML = `<p> Copié : ${textToCopy} </p>`;
            setTimeout(() => {
                snackbar.classList.remove('show');
            }, 2000);
        }
    }

    /**
     * Initialize dropdown functionality
     */
    function initDropdowns() {
        elements.dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            elements.dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        });

        // Close dropdowns when scrolling
        document.addEventListener('scroll', function() {
            elements.dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });

        // Handle dropdown links
        elements.dropdownLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(this.getAttribute('href'), '_blank');
            });
        });
    }
    /**
     * Update navigation based on scroll position
     */
    function updateNavigationState() {
        if (window.scrollY > 0) {
            elements.nav.classList.add('active', 'nav-scrolled');
            elements.progressBar.classList.add('scrolled');
        } else {
            elements.nav.classList.remove('active', 'nav-scrolled');
            elements.progressBar.classList.remove('scrolled');
        }
    }

    /**
     * Update scroll progress bar
     */
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 105;
        elements.progressBar.style.width = scrolled + "%";
    }

    function updateAdhesionForm() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 105;
        if (elements.adhesionForm.style.marginLeft != "0%") {
            elements.adhesionForm.style.marginLeft = Math.max(0, 50 - scrolled) + "%";
        }
    }

    /**
     * Handle smooth scrolling for navigation links
     */
    function handleSmoothScroll(e) {
        e.preventDefault();
        const hrefElement = document.querySelector(this.getAttribute('href'));

        if (hrefElement) {
            const targetElement = hrefElement.querySelector('.content-title');
            targetElement.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }

    /**
     * Scroll to top of page
     */
    function scrollToTop(e) {
        e.preventDefault();
        document.querySelector('body').scrollIntoView({
            behavior: 'smooth',
        });
    }

    /**
     * Typewriter effect for header
     */
    function initTypewriter() {
        let titleIndex = 0;
        let subtitleIndex = 0;

        function typeWriter() {
            // Type the title first
            if (titleIndex < HEADER_TEXT.title.length) {
                elements.headerTitle.innerHTML += HEADER_TEXT.title.charAt(titleIndex);
                titleIndex++;
                setTimeout(typeWriter, TYPE_SPEED.title);
            } 
            // Then type the subtitle
            else if (subtitleIndex < HEADER_TEXT.subtitle.length) {
                elements.headerSubtitle.innerHTML += HEADER_TEXT.subtitle.charAt(subtitleIndex);
                subtitleIndex++;
                setTimeout(typeWriter, TYPE_SPEED.subtitle);
            }
            // Finally show the content
            else {
                elements.contentText.style.opacity = '100';
            }
        }

        // Start the typewriter effect
        typeWriter();
    }

    /**
     * FAQ accordion functionality
     */
    function initFAQ() {
        elements.faqItems.forEach(item => {

            item.addEventListener('click', () => {
                // Close other items
                elements.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const content = otherItem.querySelector('.faq-content');
                        content.style.maxHeight = null;
                        otherItem.style.height = 'auto';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                const content = item.querySelector('.faq-content');
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    item.style.height = 'auto';
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    item.style.height = 100 + content.scrollHeight + "px";
                }
            });
        });
    }

    /**
     * Google Maps initialization
     */
    window.initMap = function() {
        // Map markers
        const markers = [
            {
                position: { lat: 43.609080040558375, lng: 1.4367670648787751 },
                title: "Union Départementale - Bourse du Travail de Toulouse",
                address: "19 Pl. Saint-Sernin, 31000 Toulouse",
                phone: "05 61 21 53 75",
            },
            {
                position: { lat: 43.541360527559846, lng: 1.5225178242916866 },
                title: "Union Locale de Labège",
                address: "2058 Rte de Baziege la Lauragaise, 31670 Labège",
                phone: "05 61 80 01 99"
            },
            {
                position: { lat: 43.54355109518269, lng: 1.5079677919071945 },
                title: "Section Syndicale CGT Alteia",
                address: "1 L'Occitane, 31670 Labège",
                phone: "06 46 76 55 54"
            },
        ];

        // Map configuration
        const mapOptions = {
            zoom: 12,
            styles: [
                { featureType: "all", elementType: "labels", stylers: [{ visibility: "simplified" }] },
                { featureType: "all", elementType: "labels.text", stylers: [{ color: "#444444" }] },
                { featureType: "administrative.country", elementType: "all", stylers: [{ visibility: "simplified" }] },
                { featureType: "administrative.country", elementType: "geometry", stylers: [{ visibility: "simplified" }] },
                { featureType: "administrative.province", elementType: "all", stylers: [{ visibility: "off" }] },
                { featureType: "administrative.locality", elementType: "all", stylers: [{ visibility: "simplified" }, { saturation: -100 }, { lightness: 30 }] },
                { featureType: "administrative.neighborhood", elementType: "all", stylers: [{ visibility: "off" }] },
                { featureType: "administrative.land_parcel", elementType: "all", stylers: [{ visibility: "off" }] },
                { featureType: "landscape", elementType: "all", stylers: [{ visibility: "simplified" }, { gamma: 0.00 }, { lightness: 74 }] },
                { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
                { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ visibility: "simplified" }, { color: "#ff0000" }, { saturation: -15 }, { lightness: 40 }, { gamma: 1.25 }] },
                { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
                { featureType: "transit", elementType: "labels", stylers: [{ visibility: "simplified" }] },
                { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#ff0000" }, { lightness: 80 }] },
                { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#efefef" }] },
                { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] }
            ]
        };

        try {
            const bounds = new google.maps.LatLngBounds();
            const mapElement = document.getElementById('google-map');
            
            if (!mapElement) {
                console.error('Map element not found');
                return;
            }

            const map = new google.maps.Map(mapElement, mapOptions);
            const infoWindow = new google.maps.InfoWindow({
                minWidth: 200,
                maxWidth: 200
            });
            const customIcon = "./poi.svg";

            // Add markers to map
            markers.forEach(markerData => {
                const markerObj = new google.maps.Marker({
                    position: markerData.position,
                    map: map,
                    title: markerData.title,
                    icon: customIcon
                });

                // Add click listener to marker
                markerObj.addListener('click', () => {
                    infoWindow.setContent(`
                        <div class="info-window">
                            <h3>${markerData.title}</h3>
                            <address>
                                <p>${markerData.address}</p>
                            </address>
                            <p>${markerData.phone}</p>
                        </div>
                    `);
                    infoWindow.open(map, markerObj);
                });

                // Extend bounds for map centering
                bounds.extend(new google.maps.LatLng(markerData.position.lat, markerData.position.lng));
            });
            
            // Fit map to all markers
            map.fitBounds(bounds);
        } catch (error) {
            console.error('Error initializing Google Maps:', error);
        }
    };

    // Logo click event - scroll to top
    elements.navLogo.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('body').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
})();