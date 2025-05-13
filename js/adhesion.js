/**
 * CGT Alteia Adhesion Form JavaScript
 * Script for handling the syndication form
 */

// Immediately-invoked Function Expression for encapsulation
(function() {
    'use strict';

    // DOM Elements
    let elements = {
        adhesionForm: document.getElementById('adhesion-form'),
        currentYear: document.getElementById('current-year')
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize navigation with navModule
        const navElements = navModule.init({ isHomePage: false });
        
        // Merge the nav elements with our local elements
        elements = { ...elements, ...navElements };
        
        submitAdhesionForm();
        updateCurrentYear();
        
        // Set default date values
        const today = new Date().toISOString().split('T')[0];
        const adhesionDateField = document.getElementById('adhesion-date');
        if (adhesionDateField) {
            adhesionDateField.value = today;
        }
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
     * Handle adhesion form submission
     */
    function submitAdhesionForm() {
        if (elements.adhesionForm) {
            elements.adhesionForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                
                try {
                    const formData = new FormData(e.target);
                    
                    // Fetch the PDF template
                    const existingPdfBytes = await fetch("/static/adhesion.pdf")
                        .then(res => {
                            if (!res.ok) {
                                throw new Error("Failed to fetch PDF template");
                            }
                            return res.arrayBuffer();
                        });
                
                    const { PDFDocument } = PDFLib;
                    const pdfDoc = await PDFDocument.load(existingPdfBytes);
                    
                    const page = pdfDoc.getPages()[0];
                    
                    const { width, height } = page.getSize();
                    
                    // Fill in form fields
                    // Civility
                    if (formData.get('civility') === 'mr') {
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
                    
                    // Name
                    page.drawText(formData.get('name'), {
                        x: 165,
                        y: height - 185,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // First name
                    page.drawText(formData.get('firstname'), {
                        x: 465,
                        y: height - 185,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Birthdate
                    var birthdate = formData.get('birthdate').split('-');
                    page.drawText(birthdate[2] + '   ' + birthdate[1] + '   ' + birthdate[0], {
                        x: 160,
                        y: height - 213,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Nationality
                    page.drawText(formData.get('nationality'), {
                        x: 465,
                        y: height - 210,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Address
                    page.drawText(formData.get('address'), {
                        x: 160,
                        y: height - 240,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // City
                    page.drawText(formData.get('city'), {
                        x: 400,
                        y: height - 240,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Zip code
                    page.drawText(formData.get('zipcode'), {
                        x: 160,
                        y: height - 267,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Phone
                    page.drawText(formData.get('phone'), {
                        x: 400,
                        y: height - 267,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Email
                    page.drawText(formData.get('email'), {
                        x: 160,
                        y: height - 294,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Category
                    page.drawText(formData.get('category'), {
                        x: 160,
                        y: height - 320,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Company address
                    page.drawText(formData.get('company-address'), {
                        x: 400,
                        y: height - 320,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Adhesion date
                    var adhesionDate = formData.get('adhesion-date').split('-');
                    page.drawText(adhesionDate[2] + '/' + adhesionDate[1] + '/' + adhesionDate[0], {
                        x: 160,
                        y: height - 347,
                        size: 12,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    // Mailing list preference
                    const mailingPref = formData.get('mailing-list');
                    if (mailingPref === 'email') {
                        page.drawText('X', {
                            x: 160,
                            y: height - 380,
                            size: 12,
                            color: PDFLib.rgb(0, 0, 0),
                        });
                    } else if (mailingPref === 'courrier') {
                        page.drawText('X', {
                            x: 250,
                            y: height - 380,
                            size: 12,
                            color: PDFLib.rgb(0, 0, 0),
                        });
                    } else {
                        page.drawText('X', {
                            x: 340,
                            y: height - 380,
                            size: 12,
                            color: PDFLib.rgb(0, 0, 0),
                        });
                    }
                
                    // Generate and download the PDF
                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = "formulaire_adhesion_" + formData.get('name') + "_" + formData.get('firstname') + ".pdf";
                    link.click();
                    
                    // Show success message
                    alert("Formulaire téléchargé avec succès ! Merci de l'envoyer signé à l'adresse email indiquée.");
                    
                } catch (error) {
                    console.error("Error generating PDF:", error);
                    alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer ou contacter l'administrateur.");
                }
            });
        }
    }

})(); 