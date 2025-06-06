/**
 * CGT Alteia Website JavaScript
 * Main script for handling UI interactions and initializations
 */

// Immediately-invoked Function Expression for encapsulation
(function() {
    'use strict';

    // DOM Elements
    let elements = {
        heroContentWrapper: document.querySelector('.hero-content-wrapper'),
        heroText: document.querySelector('.hero-text'),
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log('DOM Content Loaded - Starting initialization...');
            
            // Check if navModule is available
            if (typeof navModule === 'undefined') {
                console.error('navModule is not available');
                return;
            }
            
            // Initialize navigation with navModule
            const navElements = navModule.init({ isHomePage: true });
            
            // Merge the nav elements with our local elements
            elements = { ...elements, ...navElements };
            elements.heroContentWrapper.scrollTop = 0;
            
            console.log('Initializing components...');
            initHero();
            initBlog();
            initCopyButton();
            updateCurrentYear();
            console.log('All components initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
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
     * Initialize copy button functionality
     */
    function initCopyButton() {

        function showSnackbarWithTransition(snackbar) {
            snackbar.style.display = 'flex';
            void snackbar.offsetWidth;
            snackbar.style.opacity = '1';
            snackbar.style.transform = 'translate(-50%, 0)';
        
            setTimeout(() => {
                snackbar.style.opacity = 0;
                snackbar.style.transform = 'translate(-50%, 10px)';
            }, 2000);
            if (snackbar.getComputedStyle(snackbar).opacity === '0') {
                snackbar.style.display = 'none';
            }
        }
        function copiedSnackbar(textToCopy) {
            const snackbar = document.getElementById('copiedSnackbar');
            snackbar.innerHTML = `<p style="color: var(--color-linen);"> Copié ! </p> <p> ${textToCopy} </p>`;
            void snackbar.clientWidth;
            showSnackbarWithTransition(snackbar);
        }
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
    }

    function initHero() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        const target = +counter.getAttribute('data-target');
                        let current = 0;
                        const duration = 2000;
                        const startTime = performance.now();
                        
                        function update(timestamp) {
                            const progress = Math.pow(Math.min((timestamp - startTime) / duration, 1), 5);
                            current = Math.floor(progress * target);
                            counter.textContent = current.toLocaleString(); // adds commas
                            if (progress < 1) requestAnimationFrame(update);
                        }
                        requestAnimationFrame(update);
                    }
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
    
        document.querySelectorAll('.hero-content').forEach(el => observer.observe(el));
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('hero-button')) {
                elements.heroContentWrapper.style.overflowY = 'auto';
                // Scroll to next hero-content
                elements.heroContentWrapper.scrollTo({
                    top: elements.heroContentWrapper.children[0].scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
        elements.heroContentWrapper.addEventListener('scroll', function() {
            if (elements.heroContentWrapper.scrollTop === 0) {
                elements.heroContentWrapper.style.overflowY = 'hidden';
            }
            // If the scrollbar is at the bottom, use the main scrollbar
            if (elements.heroContentWrapper.scrollHeight - elements.heroContentWrapper.scrollTop === elements.heroContentWrapper.clientHeight) {
                elements.heroContentWrapper.style.overflowY = 'auto';
            }
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

        // Initialize map
        const map = new google.maps.Map(document.getElementById("google-map"), mapOptions);

        // Add markers to map
        const bounds = new google.maps.LatLngBounds();
        
        markers.forEach(markerInfo => {
            const marker = new google.maps.Marker({
                position: markerInfo.position,
                map: map,
                title: markerInfo.title,
                icon: {
                    url: 'media/poi.svg',
                    scaledSize: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 30),
                }
            });

            // Info window content
            const contentString = `
                <div class="infowindow">
                    <h3>${markerInfo.title}</h3>
                    <p><strong>Adresse:</strong> ${markerInfo.address}</p>
                    <p><strong>Téléphone:</strong> ${markerInfo.phone}</p>
                </div>
            `;

            // Create info window
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 200
            });

            // Add click event to open info window on marker click
            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });

            // Extend bounds with marker position
            bounds.extend(markerInfo.position);
        });

        // Fit map to marker bounds
        map.fitBounds(bounds);
        
        // Set center to third marker (CGT Alteia)
        map.setCenter(markers[2].position);
    };

    /**
     * Initialize blog expandable functionality
     */
    function initBlog() {
        console.log('Initializing blog functionality...');
        const blogItems = document.querySelectorAll('.blog-item');
        const modal = document.getElementById('blogModal');
        const modalClose = document.getElementById('blogModalClose');
        
        console.log('Found blog items:', blogItems.length);
        console.log('Modal elements:', { modal: !!modal, modalClose: !!modalClose });
        
        if (blogItems.length === 0) {
            console.warn('No blog items found');
            return;
        }
        
        if (!modal || !modalClose) {
            console.error('Modal elements not found');
            return;
        }
        
        blogItems.forEach((item, index) => {
            console.log(`Processing blog item ${index}:`, item);
            const header = item.querySelector('.blog-item-header');
            const expandIcon = item.querySelector('.blog-item-expand-icon');
            
            console.log(`Blog item ${index} elements:`, {
                header: !!header,
                expandIcon: !!expandIcon
            });
            
            if (!header || !expandIcon) {
                console.warn(`Blog item ${index} missing required elements`);
                return;
            }
            
            // Add click event to the entire header
            header.addEventListener('click', function(e) {
                console.log(`Header clicked for item ${index}`);
                // Prevent event bubbling if clicking on the icon specifically
                if (e.target.closest('.blog-item-expand-icon')) {
                    console.log('Click was on expand icon, ignoring header click');
                    return;
                }
                openBlogModal(item);
            });
            
            // Add click event to the expand icon
            expandIcon.addEventListener('click', function(e) {
                console.log(`Expand icon clicked for item ${index}`);
                e.stopPropagation();
                openBlogModal(item);
            });
            
            // Make header cursor pointer to indicate it's clickable
            header.style.cursor = 'pointer';
            expandIcon.style.cursor = 'pointer';
            
            console.log(`Blog item ${index} initialized successfully`);
        });
        
        // Close modal events
        modalClose.addEventListener('click', closeBlogModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBlogModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeBlogModal();
            }
        });
        
        console.log('Blog initialization complete');
    }
    
    /**
     * Open blog modal with article content
     * @param {HTMLElement} item - The blog item to display
     */
    function openBlogModal(item) {
        console.log('Opening blog modal for item:', item);
        
        const modal = document.getElementById('blogModal');
        const modalTitle = document.getElementById('blogModalTitle');
        const modalDate = document.getElementById('blogModalDate');
        const modalSubtitle = document.getElementById('blogModalSubtitle');
        const modalBody = document.getElementById('blogModalBody');
        
        // Extract content from the clicked item
        const title = item.querySelector('.blog-item-title')?.textContent || '';
        const date = item.querySelector('.blog-item-date')?.textContent || '';
        const subtitle = item.querySelector('.blog-item-subtitle')?.textContent || '';
        const content = item.querySelector('.blog-item-content')?.innerHTML || '';
        
        console.log('Extracted content:', { title, date, subtitle, contentLength: content.length });
        
        // Populate modal
        modalTitle.textContent = title;
        modalDate.textContent = date;
        modalSubtitle.textContent = subtitle;
        modalBody.innerHTML = content;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        console.log('Modal opened successfully');
    }
    
    /**
     * Close blog modal
     */
    function closeBlogModal() {
        console.log('Closing blog modal');
        
        const modal = document.getElementById('blogModal');
        const modalContent = modal.querySelector('.blog-modal-content');
        
        // Add slide-out animation
        modalContent.classList.add('slide-out');
        
        // Wait for animation to complete before hiding modal
        setTimeout(() => {
            modal.classList.remove('active');
            modalContent.classList.remove('slide-out');
            document.body.style.overflow = ''; // Restore background scrolling
            console.log('Modal closed successfully');
        }, 300); // Match the animation duration (0.3s = 300ms)
    }

})();