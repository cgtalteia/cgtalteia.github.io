/**
 * CGT Alteia Website JavaScript
 * Main script for handling UI interactions and initializations
 */

// Immediately-invoked Function Expression for encapsulation
(function() {
    'use strict';

    // DOM Elements
    let elements = {};

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
            
            console.log('Initializing components...');
            loadBlogFromStorage(); // Load blog posts from localStorage if available
            initBlog();
            initCopyButton();
            updateCurrentYear();
            
            // Listen for storage changes from other tabs/windows
            window.addEventListener('storage', function(e) {
                if (e.key === 'blogPosts') {
                    console.log('Blog posts updated from another tab, refreshing timeline...');
                    loadBlogFromStorage();
                }
            });
            
            // Listen for custom event for same-page updates
            window.addEventListener('blogPostsUpdated', function() {
                console.log('Blog posts updated on same page, refreshing timeline...');
                loadBlogFromStorage();
            });
            
            // Polling mechanism for localStorage changes (fallback)
            let lastBlogPostsHash = '';
            setInterval(() => {
                const currentPosts = localStorage.getItem('blogPosts');
                if (currentPosts) {
                    const currentHash = btoa(currentPosts).slice(0, 20); // Simple hash
                    if (lastBlogPostsHash && lastBlogPostsHash !== currentHash) {
                        console.log('Blog posts changed detected via polling, refreshing...');
                        loadBlogFromStorage();
                    }
                    lastBlogPostsHash = currentHash;
                }
            }, 2000); // Check every 2 seconds
            
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
        
        // Initialize sort functionality (only once)
        if (sortButton && !sortButton.hasAttribute('data-initialized')) {
            let isSorted = false;
            sortButton.addEventListener('click', function() {
                const timeline = document.querySelector('.blog-timeline');
                const items = Array.from(timeline.children);
                
                if (!isSorted) {
                    // Sort by date (newest first)
                    items.sort((a, b) => {
                        const dateA = parseFrenchDate(a.querySelector('.blog-item-date').textContent);
                        const dateB = parseFrenchDate(b.querySelector('.blog-item-date').textContent);
                        return dateB - dateA;
                    });
                    sortButton.querySelector('span').textContent = 'Trier par date (plus récent)';
                    isSorted = true;
                } else {
                    // Sort by date (oldest first)
                    items.sort((a, b) => {
                        const dateA = parseFrenchDate(a.querySelector('.blog-item-date').textContent);
                        const dateB = parseFrenchDate(b.querySelector('.blog-item-date').textContent);
                        return dateA - dateB;
                    });
                    sortButton.querySelector('span').textContent = 'Trier par date (plus ancien)';
                    isSorted = false;
                }
                
                // Re-append sorted items
                items.forEach(item => timeline.appendChild(item));
            });
            sortButton.setAttribute('data-initialized', 'true');
        }
        
        /**
         * Parse French date format (e.g., "15 janvier 2025")
         * @param {string} dateString - French date string
         * @returns {Date} - JavaScript Date object
         */
        function parseFrenchDate(dateString) {
            const months = {
                'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
                'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
            };
            
            const parts = dateString.split(' ');
            const day = parseInt(parts[0]);
            const month = months[parts[1].toLowerCase()];
            const year = parseInt(parts[2]);
            
            return new Date(year, month, day);
        }
        
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
            header.addEventListener('click', function(e) {
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
                thumbnail.addEventListener('click', function(e) {
                    console.log(`Thumbnail clicked for item ${index}`);
                    openBlogModal(item);
                });
                thumbnail.style.cursor = 'pointer';
            }
            
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
        
        // Close modal events (only initialize once)
        if (!modalClose.hasAttribute('data-initialized')) {
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
            modalContent += `<div class="blog-modal-thumbnail" style="background-image: url(${thumbnailUrl})"></div>`;
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
     * Load blog posts from localStorage if available (for admin-created posts)
     */
    function loadBlogFromStorage() {
        console.log('Loading blog from storage...');
        const savedPosts = localStorage.getItem('blogPosts');
        let posts;
        
        if (savedPosts) {
            try {
                posts = JSON.parse(savedPosts);
                console.log('Loaded saved posts:', posts.length, 'posts');
                console.log('First post thumbnail:', posts[0]?.thumbnail);
            } catch (e) {
                console.error('Error loading saved posts:', e);
                posts = getDefaultPosts();
            }
        } else {
            // Load default posts if no saved posts exist
            console.log('No saved posts found, loading defaults');
            posts = getDefaultPosts();
            localStorage.setItem('blogPosts', JSON.stringify(posts));
        }
        
        updateBlogTimeline(posts);
    }

    /**
     * Get default blog posts
     */
    function getDefaultPosts() {
        return [
            {
                id: 1,
                date: '2025-01-15',
                title: 'Négociations Salariales : Une Victoire Collective',
                subtitle: 'Après plusieurs semaines de mobilisation, la direction accepte enfin nos revendications concernant les augmentations salariales et les primes exceptionnelles.',
                thumbnail: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&h=200&fit=crop',
                content: 'Les négociations qui ont débuté en décembre dernier ont abouti à un accord historique pour l\'ensemble des salarié·es d\'Alteia. Grâce à la mobilisation de tous et toutes, nous avons obtenu une augmentation générale de 3,5% des salaires, ainsi qu\'une prime exceptionnelle de 800€ pour chaque employé·e.\n\nCette victoire démontre une fois de plus l\'importance de l\'action collective et de la solidarité syndicale. La direction, initialement réticente, a dû céder face à notre détermination et à l\'unité de nos revendications.\n\nNous tenons à remercier tous les collègues qui ont participé aux assemblées générales et qui ont soutenu cette action. C\'est ensemble que nous construisons de meilleures conditions de travail pour tous.'
            },
            {
                id: 2,
                date: '2025-01-08',
                title: 'Réorganisation des Services : Vigilance Requise',
                subtitle: 'La direction annonce une restructuration des équipes. Nous analysons les impacts sur l\'emploi et les conditions de travail de chacun·e.',
                thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
                content: 'Suite à l\'annonce de la direction concernant la réorganisation des services, votre section syndicale CGT reste mobilisée pour défendre vos intérêts et surveiller les évolutions.\n\nNous avons demandé la tenue d\'un Comité Social et Économique extraordinaire afin d\'obtenir toutes les informations nécessaires sur cette restructuration. Aucune décision ne doit être prise sans consultation préalable des représentant·es du personnel.\n\nSi vous avez des questions ou des inquiétudes concernant votre poste ou votre service, n\'hésitez pas à nous contacter. Nous sommes là pour vous accompagner et défendre vos droits.'
            },
            {
                id: 3,
                date: '2024-12-22',
                title: 'Formation Syndicale : Inscriptions Ouvertes',
                subtitle: 'La CGT organise des sessions de formation pour mieux connaître vos droits et comprendre le fonctionnement syndical. Rejoignez-nous !',
                thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop',
                content: 'Dans le cadre de notre mission d\'information et de formation, nous organisons plusieurs sessions dédiées à la connaissance de vos droits en tant que salarié·e.\n\nAu programme : droit du travail, négociation collective, fonctionnement des instances représentatives du personnel, et bien d\'autres sujets essentiels pour votre vie professionnelle.\n\nCes formations sont ouvertes à tous les salarié·es, syndiqué·es ou non. Elles se dérouleront sur le temps de travail, conformément au droit à la formation syndicale. Pour vous inscrire, contactez-nous par email ou passez nous voir directement.'
            },
            {
                id: 4,
                date: '2024-12-18',
                title: 'Télétravail : Nouveaux Accords en Vue',
                subtitle: 'Les discussions sur l\'évolution du télétravail progressent. Nous défendons un cadre équitable et respectueux de l\'équilibre vie privée-vie professionnelle.',
                thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop',
                content: 'Les négociations sur le télétravail entrent dans une phase décisive. Votre section syndicale porte des propositions concrètes pour améliorer les conditions de travail à distance.\n\nNos revendications portent notamment sur : la prise en charge des frais liés au télétravail, la garantie du droit à la déconnexion, l\'amélioration de l\'équipement informatique, et la préservation du lien social entre collègues.\n\nNous veillerons à ce que le télétravail reste un choix et non une obligation, et qu\'il ne devienne pas un prétexte pour dégrader les conditions de travail ou réduire les espaces collectifs.'
            },
            {
                id: 5,
                date: '2024-12-10',
                title: 'Solidarité : Collecte pour les Sinistrés',
                subtitle: 'Face aux récentes catastrophes naturelles, notre section organise une collecte de solidarité. Chaque geste compte pour aider les familles touchées.',
                thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop',
                content: 'La solidarité est une valeur fondamentale de la CGT. Face aux difficultés que traversent de nombreuses familles suite aux intempéries récentes, nous ne pouvions rester indifférents.\n\nUne collecte est organisée dans tous les services de l\'entreprise. Les dons récoltés seront intégralement reversés aux associations locales qui viennent en aide aux sinistrés.\n\nAu-delà de l\'aide matérielle, cette action témoigne de notre engagement pour une société plus juste et solidaire. Merci à tous ceux qui participent à cet élan de générosité collective.'
            }
        ];
    }

    // Make loadBlogFromStorage globally available
    window.loadBlogFromStorage = loadBlogFromStorage;
    window.updateBlogTimeline = updateBlogTimeline;

    /**
     * Update blog timeline with posts from localStorage
     */
    function updateBlogTimeline(posts) {
        console.log('Updating blog timeline with', posts.length, 'posts');
        const timeline = document.querySelector('.blog-timeline');
        if (!timeline || !posts || posts.length === 0) return;

        // Clear existing posts
        timeline.innerHTML = '';

        // Add each post
        posts.forEach((post, index) => {
            console.log(`Creating blog item ${index} with thumbnail:`, post.thumbnail);
            const blogItem = createBlogItemElement(post);
            timeline.appendChild(blogItem);
        });
        
        // Re-initialize blog functionality for new items
        setTimeout(() => {
            initBlogInteractions();
        }, 100);
    }

    /**
     * Create blog item element from post data
     */
    function createBlogItemElement(post) {
        console.log('Creating blog item element for:', post.title, 'with thumbnail:', post.thumbnail);
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';
        blogItem.setAttribute('data-expanded', 'false');

        // Format date to French
        const formattedDate = formatDateToFrench(post.date);
        
        // Convert content newlines to paragraphs
        const contentParagraphs = post.content.split('\n\n').map(p => `<p>${p}</p>`).join('');

        blogItem.innerHTML = `
            <div class="blog-item-content">
                <div class="blog-item-thumbnail" style="background-image: url('${post.thumbnail}')"></div>
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