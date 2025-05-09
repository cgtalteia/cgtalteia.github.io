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
        faqItems: document.querySelectorAll('.faq-item')
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize navigation with navModule
        const navElements = navModule.init({ isHomePage: true });
        
        // Merge the nav elements with our local elements
        elements = { ...elements, ...navElements };
        elements.heroContentWrapper.scrollTop = 0;
        initHero();
        initFAQ();
        initCopyButton();
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
     * Initialize copy button functionality
     */
    function initCopyButton() {
        function copiedSnackbar(textToCopy) {
            const snackbar = document.getElementById('copiedSnackbar');
            snackbar.classList.add('show');
            snackbar.innerHTML = `<p> Copié : ${textToCopy} </p>`;
            setTimeout(() => {
                snackbar.classList.remove('show');
            }, 2000);
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
                }
            });
        }, { threshold: 0.1 });
    
        document.querySelectorAll('.hero-content').forEach(el => observer.observe(el));
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('hero-button')) {
                elements.heroContentWrapper.style.overflowY = 'auto';
                // Scroll to next hero-content
                elements.heroContentWrapper.scrollTo({
                    top: elements.heroContentWrapper.scrollHeight,
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
     * FAQ accordion functionality
     */
    function initFAQ() {
        elements.faqItems.forEach(item => {

            item.addEventListener('click', () => {
                // Close other items
                elements.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const content = otherItem.querySelector('.faq-item-content');
                        content.style.maxHeight = null;
                        otherItem.style.height = 'auto';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                const content = item.querySelector('.faq-item-content');
                
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

})();