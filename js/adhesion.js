/**
 * CGT Alteia Adhesion Form JavaScript
 * Script for handling the syndication form
 */

// Immediately-invoked Function Expression for encapsulation
(function() {
    'use strict';

    // DOM Elements
    const elements = {
        navAdhesionButton: document.querySelector('#nav-adhesion-button'),
        adhesionForm: document.getElementById('adhesion-form'),
        currentYear: document.getElementById('current-year')
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        submitAdhesionForm();
        updateCurrentYear();
    });

    /**
     * Update copyright year in footer
     */
    function updateCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }

    /**
     * Navigation Functionality
     */
    function initNavigation() {
        // Hamburger menu handling
        const hamburger = document.querySelector('.hamburger');
        const overlay = document.querySelector('.overlay');
        const navLogo = document.querySelector('.nav-logo');

        navLogo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        
        if (hamburger && overlay) {
            hamburger.addEventListener('click', function() {
                if (overlay.style.display == 'none') {
                    overlay.style.display = 'block';
                } else {
                    overlay.style.display = 'none';
                }
            });
        }

        // Close overlay when clicking on a link
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (overlay) {
                    overlay.style.display = 'none';
                }
                if (!link.getAttribute('href').includes('#') && !link.getAttribute('href').includes('.html')) {
                    // open site in new tab
                    window.open(link.getAttribute('href'), '_blank');
                }
            });
        });
    }
    
    /**
     * Handle adhesion form submission
     */
    function submitAdhesionForm() {
        if (elements.adhesionForm) {
            elements.adhesionForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                const formData = new FormData(e.target);
            
                const existingPdfBytes = await fetch("/static/adhesion.pdf").then(res => res.arrayBuffer());
            
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
                
                // More fields could be added here
            
                const pdfBytes = await pdfDoc.save();
            
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "formulaire_adhesion.pdf";
                link.click();
            });
        }
    }

})(); 