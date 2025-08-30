/**
 * CGT Alteia Website JavaScript
 * Main script for handling UI interactions and initializations
 */

// Immediately-invoked Function Expression for encapsulation
(function () {
    'use strict';

    // DOM Elements
    let elements = {};

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
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

            console.log('Initializing components...');
            loadBlogFromStorage(); // Load blog posts and initialize filters
            initCopyButton();
            initHero();
            initWhatsAppModal();
            initContactButtons();
            updateCurrentYear();

            // Load the static blog posts - no dynamic updating needed

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
            snackbar.innerHTML = `<p style="color: var(--color-linen);"> ${textToCopy} </p>`;
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

    /**
     * Initialize hero section functionality
     */
    function initHero() {
        console.log('Initializing hero section...');

        const heroJoinStrikeBtn = document.getElementById('heroJoinStrike');
        const heroScrollIndicator = document.querySelector('.hero-scroll-indicator');

        // Hero join strike button - show WhatsApp QR modal
        if (heroJoinStrikeBtn) {
            heroJoinStrikeBtn.addEventListener('click', function () {
                openWhatsAppModal();
            });
        }

        // Hero scroll indicator - smooth scroll to blog section
        if (heroScrollIndicator) {
            heroScrollIndicator.addEventListener('click', function () {
                document.getElementById('blog').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }

        console.log('Hero section initialization complete');
    }

    /**
     * Initialize contact buttons functionality
     */
    function initContactButtons() {
        console.log('Initializing contact buttons...');

        const navContactBtn = document.getElementById('nav-contact-button');
        const overlayContactBtn = document.getElementById('overlay-contact-button');
        const contactWhatsappBtn = document.getElementById('contactWhatsappBtn');

        // Navigation contact button - scroll to contact section
        if (navContactBtn) {
            navContactBtn.addEventListener('click', function () {
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }

        // Mobile overlay contact button - scroll to contact section
        if (overlayContactBtn) {
            overlayContactBtn.addEventListener('click', function () {
                // Close mobile menu first (if navModule is available)
                if (typeof navModule !== 'undefined' && navModule.closeMobileMenu) {
                    navModule.closeMobileMenu();
                }

                // Then scroll to contact
                setTimeout(() => {
                    document.getElementById('contact').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300); // Wait for menu close animation
            });
        }

        // Contact section WhatsApp button - open WhatsApp modal
        if (contactWhatsappBtn) {
            contactWhatsappBtn.addEventListener('click', function () {
                openWhatsAppModal();
            });
        }

        console.log('Contact buttons initialization complete');
    }

    /**
     * Helper function to show snackbar with transition (exposed for hero usage)
     */
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

    /**
     * Initialize WhatsApp modal functionality
     */
    function initWhatsAppModal() {
        console.log('Initializing WhatsApp modal...');

        const whatsappModal = document.getElementById('whatsappModal');
        const whatsappModalClose = document.getElementById('whatsappModalClose');
        const copyEmailFromWhatsapp = document.getElementById('copyEmailFromWhatsapp');
        const copyPhoneFromWhatsapp = document.getElementById('copyPhoneFromWhatsapp');

        // Close modal events
        if (whatsappModalClose) {
            whatsappModalClose.addEventListener('click', closeWhatsAppModal);
        }

        if (whatsappModal) {
            whatsappModal.addEventListener('click', function (e) {
                if (e.target === whatsappModal) {
                    closeWhatsAppModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && whatsappModal && whatsappModal.classList.contains('active')) {
                closeWhatsAppModal();
            }
        });

        // Copy email button
        if (copyEmailFromWhatsapp) {
            copyEmailFromWhatsapp.addEventListener('click', async function () {
                try {
                    await navigator.clipboard.writeText('cgt.alteia@gmail.com');
                    const snackbar = document.getElementById('copiedSnackbar');
                    snackbar.innerHTML = '<p style="color: var(--color-linen);">📧 Email copié !</p>';
                    showSnackbarWithTransition(snackbar);
                } catch (error) {
                    console.error('Error copying email:', error);
                }
            });
        }

        // Copy phone button
        if (copyPhoneFromWhatsapp) {
            copyPhoneFromWhatsapp.addEventListener('click', async function () {
                try {
                    await navigator.clipboard.writeText('+33 6 46 76 55 54');
                    const snackbar = document.getElementById('copiedSnackbar');
                    snackbar.innerHTML = '<p style="color: var(--color-linen);">📞 Téléphone copié !</p>';
                    showSnackbarWithTransition(snackbar);
                } catch (error) {
                    console.error('Error copying phone:', error);
                }
            });
        }

        console.log('WhatsApp modal initialization complete');
    }

    /**
     * Open WhatsApp QR modal
     */
    function openWhatsAppModal() {
        console.log('Opening WhatsApp modal');

        const modal = document.getElementById('whatsappModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    /**
     * Close WhatsApp QR modal
     */
    function closeWhatsAppModal() {
        console.log('Closing WhatsApp modal');

        const modal = document.getElementById('whatsappModal');
        const modalContent = modal?.querySelector('.whatsapp-modal-content');

        if (modal && modalContent) {
            // Add slide-out animation
            modalContent.classList.add('slide-out');

            // Wait for animation to complete before hiding modal
            setTimeout(() => {
                modal.classList.remove('active');
                modalContent.classList.remove('slide-out');
                document.body.style.overflow = ''; // Restore background scrolling
                console.log('WhatsApp modal closed successfully');
            }, 300); // Match the animation duration (0.3s = 300ms)
        }
    }

    /**
     * Initialize blog expandable functionality
     */
    function initBlog() {
        console.log('Initializing blog functionality...');
        initBlogInteractions();
    }

    /**
     * Initialize blog interactions (separate from setup to allow re-initialization)
     */
    function initBlogInteractions() {
        const blogItems = document.querySelectorAll('.blog-item');
        const modal = document.getElementById('blogModal');
        const modalClose = document.getElementById('blogModalClose');
        const sortButton = document.getElementById('sortButton');

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

        // Sort functionality removed for static newspaper format

        blogItems.forEach((item, index) => {
            console.log(`Processing blog item ${index}:`, item);
            const header = item.querySelector('.blog-item-header');
            const expandIcon = item.querySelector('.blog-item-expand-icon');
            const thumbnail = item.querySelector('.blog-item-thumbnail');

            console.log(`Blog item ${index} elements:`, {
                header: !!header,
                expandIcon: !!expandIcon,
                thumbnail: !!thumbnail
            });

            if (!header || !expandIcon) {
                console.warn(`Blog item ${index} missing required elements`);
                return;
            }

            // Add click event to the entire header
            header.addEventListener('click', function (e) {
                console.log(`Header clicked for item ${index}`);
                // Prevent event bubbling if clicking on the icon specifically
                if (e.target.closest('.blog-item-expand-icon')) {
                    console.log('Click was on expand icon, ignoring header click');
                    return;
                }
                openBlogModal(item);
            });

            // Add click event to the thumbnail if it exists
            if (thumbnail) {
                thumbnail.addEventListener('click', function (e) {
                    console.log(`Thumbnail clicked for item ${index}`);
                    openBlogModal(item);
                });
                thumbnail.style.cursor = 'pointer';
            }

            // Add click event to the expand icon
            expandIcon.addEventListener('click', function (e) {
                console.log(`Expand icon clicked for item ${index}`);
                e.stopPropagation();
                openBlogModal(item);
            });

            // Make header cursor pointer to indicate it's clickable
            header.style.cursor = 'pointer';
            expandIcon.style.cursor = 'pointer';

            console.log(`Blog item ${index} initialized successfully`);
        });

        // Close modal events (only initialize once)
        if (!modalClose.hasAttribute('data-initialized')) {
            modalClose.addEventListener('click', closeBlogModal);
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    closeBlogModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeBlogModal();
                }
            });

            modalClose.setAttribute('data-initialized', 'true');
        }

        console.log('Blog interactions initialization complete');
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
        const content = item.querySelector('.blog-item-body')?.innerHTML || '';
        const thumbnail = item.querySelector('.blog-item-thumbnail');
        const thumbnailUrl = thumbnail ? window.getComputedStyle(thumbnail).backgroundImage.slice(5, -2) : '';

        console.log('Extracted content:', { title, date, subtitle, contentLength: content.length, thumbnailUrl });

        // Populate modal
        modalTitle.textContent = title;
        modalDate.textContent = date;
        modalSubtitle.textContent = subtitle;

        // Add thumbnail and content to modal body
        let modalContent = '';
        if (thumbnailUrl && thumbnailUrl !== 'none') {
            // Process the extracted thumbnail URL to handle local files properly
            const processedThumbnailUrl = processThumbnailPath(thumbnailUrl);
            modalContent += `<div class="blog-modal-thumbnail" style="background-image: url(${processedThumbnailUrl})"></div>`;
        }
        modalContent += content;
        modalBody.innerHTML = modalContent;

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

    /**
     * Load static blog posts for newspaper format
     */
    function loadBlogFromStorage() {
        console.log('Loading static blog posts...');
        const posts = getDefaultPosts();
        initBlogFiltersAndSort(posts);
        updateBlogTimeline(posts);
    }

    // Global variables for filtering and sorting
    let allPosts = [];
    let currentFilter = 'all';
    let currentSort = 'newest';

    /**
     * Get default blog posts with categories
     * Note: thumbnails should be specified as relative paths from the HTML root (e.g., 'media/blog/image.jpg')
     * without the url() wrapper - this will be added automatically by the CSS
     */
    function getDefaultPosts() {
        return [
            {
                id: 0,
                date: '2025-08-25',
                title: '10 Septembre : Bloquons la France !',
                subtitle: 'Un mouvement d\'ampleur qui dépasse le répertoire syndical habituel se dessine. Face au plan d\'austérité de Bayrou, l\'heure est à la mobilisation générale.',
                thumbnail: 'media/blog/stopbudgetbayrou.jpg',
                category: 'daily',
                content: `
Le temps de lire ce tract, l'État aura déjà versé ½ million d'euros d'aides publiques aux entreprises, sans conditions, contreparties ni effets avérés sur les emplois et les salaires.

Tandis que 211 milliards d'aides publiques sont versés chaque année aux entreprises, M. Bayrou estime que, pour éponger la dette publique, il faut davantage essorer les Français·e·s :

<ul>
  <li>Deux jours fériés supprimés</li>
  <li>Mise en vente de la 5<sup>ème</sup> semaine de congés payés</li>
  <li>Raccourcissement des délais de recours devant les prud'hommes en cas de licenciement abusif</li>
  <li>Baisse des allocations familiales, des aides au logement, de l'allocation adulte handicapé, des bourses d'études et du RSA</li>
  <li>Baisse de toutes les retraites, même les plus basses</li>
  <li>Raccourcissement des droits au chômage et de leur montant</li>
  <li>Baisse des budgets des universités, des hôpitaux, des collectivités, de la culture et de tous les services publics, à l'exception du ministère de la Défense</li>
</ul>

<p>
  <strong>Pour défendre nos acquis sociaux – notre service public, notre couverture sociale, nos salaires, nos congés et nos plus vulnérables, mettons-nous tous·tes en grève et rejoignons toutes les actions de blocage, manifestations et regroupements qui auront lieu le 10 septembre à Toulouse et dans nos communes.</strong>
</p>

<p>
  Pour rejoindre la mobilisation des salarié·e·s d'Alteia, rejoins le groupe WhatsApp en bas de cette page.
</p>
`
            },
            // Example of how to add more posts with local thumbnails:
            // {
            //     id: 1,
            //     date: '2025-01-15',
            //     title: 'Stop Budget Bayrou',
            //     subtitle: 'Mobilisation contre les mesures d\'austérité',
            //     thumbnail: 'media/blog/stopbudgetbayrou.jpg',
            //     category: 'daily',
            //     content: `Your content here...`
            // },
        ];
    }

    /**
     * Initialize blog filters and sorting
     */
    function initBlogFiltersAndSort(posts) {
        allPosts = posts;

        // Initialize desktop filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (!btn.hasAttribute('data-initialized')) {
                btn.addEventListener('click', function () {
                    // Remove active class from all buttons
                    filterButtons.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');

                    // Update current filter
                    currentFilter = this.getAttribute('data-category');

                    // Sync mobile dropdown
                    const categoryDropdown = document.getElementById('categoryDropdown');
                    if (categoryDropdown) {
                        categoryDropdown.value = currentFilter;
                    }

                    // Apply filter and sort, then update timeline
                    const filteredAndSorted = getFilteredAndSortedPosts();
                    updateBlogTimeline(filteredAndSorted);
                });
                btn.setAttribute('data-initialized', 'true');
            }
        });

        // Initialize mobile dropdown
        const categoryDropdown = document.getElementById('categoryDropdown');
        if (categoryDropdown && !categoryDropdown.hasAttribute('data-initialized')) {
            categoryDropdown.addEventListener('change', function () {
                // Update current filter
                currentFilter = this.value;

                // Sync desktop filter buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-category') === currentFilter) {
                        btn.classList.add('active');
                    }
                });

                // Apply filter and sort, then update timeline
                const filteredAndSorted = getFilteredAndSortedPosts();
                updateBlogTimeline(filteredAndSorted);
            });
            categoryDropdown.setAttribute('data-initialized', 'true');
        }

        // Initialize sort button
        const sortBtn = document.getElementById('sortBtn');
        if (sortBtn && !sortBtn.hasAttribute('data-initialized')) {
            sortBtn.addEventListener('click', function () {
                // Toggle sort order
                if (currentSort === 'newest') {
                    currentSort = 'oldest';
                    sortBtn.querySelector('span').textContent = 'Plus ancien';
                    sortBtn.querySelector('i').style.transform = 'rotate(180deg)';
                } else {
                    currentSort = 'newest';
                    sortBtn.querySelector('span').textContent = 'Plus récent';
                    sortBtn.querySelector('i').style.transform = 'rotate(0deg)';
                }

                // Apply filter and sort, then update timeline
                const filteredAndSorted = getFilteredAndSortedPosts();
                updateBlogTimeline(filteredAndSorted);
            });
            sortBtn.setAttribute('data-initialized', 'true');
        }
    }

    /**
     * Get filtered and sorted posts
     */
    function getFilteredAndSortedPosts() {
        let filteredPosts = allPosts;

        // Apply category filter
        if (currentFilter !== 'all') {
            filteredPosts = allPosts.filter(post => post.category === currentFilter);
        }

        // Apply sorting
        filteredPosts = [...filteredPosts].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (currentSort === 'newest') {
                return dateB - dateA; // Newest first
            } else {
                return dateA - dateB; // Oldest first
            }
        });

        return filteredPosts;
    }

    // Export functions for potential external use
    window.loadBlogFromStorage = loadBlogFromStorage;

    /**
     * Update blog timeline with static posts
     */
    function updateBlogTimeline(posts) {
        console.log('Updating blog timeline with', posts.length, 'posts');
        const timeline = document.querySelector('.blog-timeline');
        const readMoreContainer = document.getElementById('blogReadMoreContainer');
        const readMoreBtn = document.getElementById('blogReadMoreBtn');

        if (!timeline || !posts || posts.length === 0) return;

        // Clear existing posts
        timeline.innerHTML = '';

        const INITIAL_POSTS_COUNT = 4; // Show 4 posts initially
        let showingAll = false;

        function renderPosts(count = INITIAL_POSTS_COUNT) {
            timeline.innerHTML = '';
            const postsToShow = posts.slice(0, count);

            postsToShow.forEach((post, index) => {
                console.log(`Creating blog item ${index} with thumbnail:`, post.thumbnail);
                const blogItem = createBlogItemElement(post);
                timeline.appendChild(blogItem);
            });

            // Re-initialize blog functionality for new items
            setTimeout(() => {
                initBlogInteractions();
            }, 100);
        }

        // Initial render with limited posts
        renderPosts();

        // Show/hide read more button
        if (posts.length <= INITIAL_POSTS_COUNT) {
            readMoreContainer.classList.add('hidden');
        } else {
            readMoreContainer.classList.remove('hidden');

            // Reset read more button state
            showingAll = false;
            readMoreBtn.querySelector('span').textContent = 'Voir plus d\'articles';
            readMoreBtn.querySelector('i').style.transform = 'rotate(0deg)';

            // Handle read more button click
            if (readMoreBtn && !readMoreBtn.hasAttribute('data-initialized')) {
                readMoreBtn.addEventListener('click', function () {
                    if (!showingAll) {
                        renderPosts(posts.length); // Show all posts
                        readMoreBtn.querySelector('span').textContent = 'Voir moins d\'articles';
                        readMoreBtn.querySelector('i').style.transform = 'rotate(180deg)';
                        showingAll = true;
                    } else {
                        renderPosts(INITIAL_POSTS_COUNT); // Show limited posts
                        readMoreBtn.querySelector('span').textContent = 'Voir plus d\'articles';
                        readMoreBtn.querySelector('i').style.transform = 'rotate(0deg)';
                        showingAll = false;

                        // Scroll back to blog section
                        document.getElementById('blog').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
                readMoreBtn.setAttribute('data-initialized', 'true');
            }
        }
    }

    /**
     * Process thumbnail path to ensure it works with local files
     * @param {string} thumbnailPath - The thumbnail path from post data
     * @returns {string} - Processed path ready for CSS background-image
     */
    function processThumbnailPath(thumbnailPath) {
        if (!thumbnailPath) return '';
        
        // If it already starts with url(), remove it to avoid double wrapping
        if (thumbnailPath.startsWith('url(') && thumbnailPath.endsWith(')')) {
            return thumbnailPath.slice(4, -1);
        }
        
        // Return the path as-is for local files
        return thumbnailPath;
    }

    /**
     * Get category information with icons and labels
     */
    function getCategoryInfo(categoryKey) {
        const categories = {
            'enterprise': {
                label: 'Entreprise',
                icon: 'fa-solid fa-building',
                color: 'var(--color-red)'
            },
            'daily': {
                label: 'Actu du jour',
                icon: 'fa-solid fa-calendar-day',
                color: 'var(--color-pumpkin)'
            },
            'world': {
                label: 'Monde',
                icon: 'fa-solid fa-globe',
                color: 'var(--color-poppy)'
            },
            'trivia': {
                label: 'Le saviez-vous ?',
                icon: 'fa-solid fa-lightbulb',
                color: 'var(--color-dun)'
            }
        };

        return categories[categoryKey] || {
            label: 'Actualité',
            icon: 'fa-solid fa-newspaper',
            color: 'var(--color-gray)'
        };
    }

    /**
     * Create blog item element from post data
     */
    function createBlogItemElement(post) {
        console.log('Creating blog item element for:', post.title, 'with thumbnail:', post.thumbnail);
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';
        blogItem.setAttribute('data-expanded', 'false');
        blogItem.setAttribute('data-category', post.category || 'general');

        // Format date to French
        const formattedDate = formatDateToFrench(post.date);

        // Convert content newlines to paragraphs
        const contentParagraphs = post.content.split('\n\n').map(p => `<p>${p}</p>`).join('');

        // Get category info
        const categoryInfo = getCategoryInfo(post.category);

        // Process thumbnail path for local files
        const thumbnailPath = processThumbnailPath(post.thumbnail);
        console.log('Processed thumbnail path:', thumbnailPath);

        blogItem.innerHTML = `
            <div class="blog-item-content">
                <div class="blog-item-thumbnail" style="background-image: url(${thumbnailPath})">
                    <div class="blog-item-category" style="background-color: ${categoryInfo.color}">
                        <i class="${categoryInfo.icon}"></i>
                        <span>${categoryInfo.label}</span>
                    </div>
                </div>
                <div class="blog-item-text">
                    <div class="blog-item-header">
                        <span class="blog-item-date">${formattedDate}</span>
                        <h3 class="blog-item-title">${post.title}</h3>
                        <p class="blog-item-subtitle">${post.subtitle}</p>
                        <div class="blog-item-expand-icon">
                            <i class="fa-solid fa-chevron-down"></i>
                        </div>
                    </div>
                    <div class="blog-item-body">
                        ${contentParagraphs}
                    </div>
                </div>
            </div>
        `;

        console.log('Blog item element created with HTML:', blogItem.outerHTML.slice(0, 200) + '...');
        return blogItem;
    }

    /**
     * Format date from YYYY-MM-DD to French format
     */
    function formatDateToFrench(dateString) {
        const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

})();