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

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
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
            updateAdhesionForm();
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

        initCopyButton();

        submitAdhesionForm();
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
    
    /**
     * Initialize dropdown functionality
     */
    function initDropdowns() {
        // Handle dropdown links
        elements.dropdownLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(this.getAttribute('href'), '_blank');
            });
        });
    }

    function updateAdhesionForm() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 105;
        if (elements.adhesionForm.style.marginLeft != "0%") {
            elements.adhesionForm.style.marginLeft = Math.max(0, 50 - scrolled) + "%";
        }
    }

    function submitAdhesionForm() {
        document.getElementById("adhesion-form").addEventListener("submit", async function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
        
            const existingPdfBytes = await fetch("http://localhost:8000/static/adhesion.pdf").then(res => res.arrayBuffer());
        
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
            const page = pdfDoc.getPages()[0];
            
            const { width, height } = page.getSize();
            
            if (formData.get('civility') == 'mr') {
                page.drawText('X', {
                    x: 160,
                    y: height - 170,
                    size: 12,
                    color: PDFLib.rgb(0, 0, 0),
                });
            } else {
                page.drawText('X', {
                    x: 225,
                    y: height - 170,
                    size: 12,
                    color: PDFLib.rgb(0, 0, 0),
                });
            }
            page.drawText(formData.get('name'), {
                x: 165,
                y: height - 185,
                size: 12,
                color: PDFLib.rgb(0, 0, 0),
            });
            page.drawText(formData.get('firstname'), {
                x: 465,
                y: height - 185,
                size: 12,
                color: PDFLib.rgb(0, 0, 0),
            });
            var birthdate = formData.get('birthdate').split('-');
            page.drawText(birthdate[2] + '   ' + birthdate[1] + '   ' + birthdate[0], {
                x: 160,
                y: height - 213,
                size: 12,
                color: PDFLib.rgb(0, 0, 0),
            });
            page.drawText(formData.get('nationality'), {
                x: 465,
                y: height - 210,
                size: 12,
                color: PDFLib.rgb(0, 0, 0),
            });
            
            // page.getTextField('civility').setText(formData.get('civility'));
            // page.getTextField('name').setText(formData.get('name'));
            // page.getTextField('firstname').setText(formData.get('firstname'));
            // page.getTextField('birthdate').setText(formData.get('birthdate'));
            // page.getTextField('nationality').setText(formData.get('nationality'));
            // page.getTextField('address').setText(formData.get('address'));
            // page.getTextField('city').setText(formData.get('city'));
            // page.getTextField('zipcode').setText(formData.get('zipcode'));
            // page.getTextField('phone').setText(formData.get('phone'));
            // page.getTextField('email').setText(formData.get('email'));
            // page.getTextField('adhesion-date').setText(formData.get('adhesion-date'));
            // page.getTextField('category').setText(formData.get('category'));
            // page.getTextField('company-address').setText(formData.get('company-address'));
            // page.getTextField('mailing-list').setText(formData.get('mailing-list'));
        
            const pdfBytes = await pdfDoc.save();
        
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "formulaire_adhesion.pdf";
            link.click();
        });
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
            const customIcon = "./media/poi.svg";

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