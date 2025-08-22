/**
 * CGT Alteia Admin JavaScript
 * Script for handling admin login and blog post management
 */

(function() {
    'use strict';

    // Simple demo credentials (in production, this would be server-side)
    const ADMIN_CREDENTIALS = {
        'admin': 'cgt2025',
        'moderateur': 'alteia123'
    };

    // Demo blog posts data (in production, this would be in a database)
    let blogPosts = [
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

    let currentEditingPost = null;
    let isLoggedIn = false;

    // DOM Elements
    let elements = {};

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize navigation
        const navElements = navModule.init({ isHomePage: false });
        elements = { ...elements, ...navElements };
        
        // Get admin-specific elements
        elements.adminDashboard = document.getElementById('admin-dashboard');
        elements.adminDefault = document.getElementById('admin-default');
        elements.addPostButton = document.getElementById('add-post-button');
        elements.postsList = document.getElementById('posts-list');
        elements.postEditorModal = document.getElementById('post-editor-modal');
        elements.postForm = document.getElementById('post-form');
        elements.closeEditor = document.getElementById('close-editor');
        elements.cancelEdit = document.getElementById('cancel-edit');
        elements.editorTitle = document.getElementById('editor-title');

        // Load saved posts from localStorage
        loadSavedPosts();
        
        // Check login status first
        checkLoginStatus();
        
        initAdmin();
        updateCurrentYear();
    });

    /**
     * Check if user is logged in and show appropriate interface
     */
    function checkLoginStatus() {
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            showDashboard();
        } else {
            showDefault();
        }
    }

    /**
     * Load saved posts from localStorage
     */
    function loadSavedPosts() {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            try {
                blogPosts = JSON.parse(savedPosts);
            } catch (e) {
                console.error('Error loading saved posts:', e);
            }
        }
    }

    /**
     * Initialize admin functionality
     */
    function initAdmin() {
        // Add post button handler
        if (elements.addPostButton) {
            elements.addPostButton.addEventListener('click', () => openPostEditor());
        }
        
        // Close editor handlers
        if (elements.closeEditor) {
            elements.closeEditor.addEventListener('click', closePostEditor);
        }
        if (elements.cancelEdit) {
            elements.cancelEdit.addEventListener('click', closePostEditor);
        }
        
        // Post form handler
        if (elements.postForm) {
            elements.postForm.addEventListener('submit', handlePostSubmit);
        }
        
        // Close modal on overlay click
        if (elements.postEditorModal) {
            elements.postEditorModal.addEventListener('click', function(e) {
                if (e.target === elements.postEditorModal) {
                    closePostEditor();
                }
            });
        }
        
        // Thumbnail preview functionality
        const thumbnailInput = document.getElementById('post-thumbnail');
        const thumbnailPreview = document.getElementById('thumbnail-preview');
        
        if (thumbnailInput && thumbnailPreview) {
            thumbnailInput.addEventListener('input', function() {
                const url = this.value.trim();
                if (url && isValidUrl(url)) {
                    thumbnailPreview.style.backgroundImage = `url('${url}')`;
                    thumbnailPreview.classList.add('active');
                } else {
                    thumbnailPreview.classList.remove('active');
                }
            });
        }
    }

    /**
     * Handle login form submission
     */
    function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username] === password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username);
            showDashboard();
            elements.loginError.style.display = 'none';
        } else {
            elements.loginError.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
            elements.loginError.style.display = 'block';
        }
    }

    /**
     * Handle logout
     */
    function handleLogout() {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        showDefault();
    }

    /**
     * Show default content (for non-logged-in users)
     */
    function showDefault() {
        if (elements.adminDashboard) {
            elements.adminDashboard.style.display = 'none';
        }
        if (elements.adminDefault) {
            elements.adminDefault.style.display = 'flex';
        }
        isLoggedIn = false;
    }

    /**
     * Show admin dashboard
     */
    function showDashboard() {
        if (elements.adminDefault) {
            elements.adminDefault.style.display = 'none';
        }
        if (elements.adminDashboard) {
            elements.adminDashboard.style.display = 'flex';
        }
        isLoggedIn = true;
        loadPosts();
    }

    /**
     * Load and display blog posts in admin
     */
    function loadPosts() {
        elements.postsList.innerHTML = '';
        
        blogPosts.forEach(post => {
            const postElement = createPostElement(post);
            elements.postsList.appendChild(postElement);
        });
    }

    /**
     * Create post element for admin list
     */
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'admin-post-item';
        postDiv.innerHTML = `
            <div class="admin-post-info">
                <span class="admin-post-date">${formatDate(post.date)}</span>
                <h3 class="admin-post-title">${post.title}</h3>
                <p class="admin-post-subtitle">${post.subtitle}</p>
            </div>
            <div class="admin-post-actions">
                <button class="edit-button" onclick="editPost(${post.id})">
                    <i class="fa-solid fa-edit"></i>
                    Modifier
                </button>
                <button class="delete-button" onclick="deletePost(${post.id})">
                    <i class="fa-solid fa-trash"></i>
                    Supprimer
                </button>
            </div>
        `;
        return postDiv;
    }

    /**
     * Format date from YYYY-MM-DD to French format
     */
    function formatDate(dateString) {
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

    /**
     * Open post editor modal
     */
    function openPostEditor(post = null) {
        currentEditingPost = post;
        
        if (post) {
            elements.editorTitle.textContent = 'Modifier l\'Article';
            document.getElementById('post-date').value = post.date;
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-subtitle').value = post.subtitle;
            document.getElementById('post-thumbnail').value = post.thumbnail || '';
            document.getElementById('post-content').value = post.content;
            
            // Show thumbnail preview if URL exists
            const thumbnailPreview = document.getElementById('thumbnail-preview');
            if (post.thumbnail && thumbnailPreview) {
                thumbnailPreview.style.backgroundImage = `url('${post.thumbnail}')`;
                thumbnailPreview.classList.add('active');
            }
        } else {
            elements.editorTitle.textContent = 'Nouvel Article';
            elements.postForm.reset();
            document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
            
            // Hide thumbnail preview for new posts
            const thumbnailPreview = document.getElementById('thumbnail-preview');
            if (thumbnailPreview) {
                thumbnailPreview.classList.remove('active');
            }
        }
        
        elements.postEditorModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close post editor modal
     */
    function closePostEditor() {
        elements.postEditorModal.classList.remove('active');
        document.body.style.overflow = '';
        currentEditingPost = null;
    }

    /**
     * Handle post form submission
     */
    function handlePostSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const postData = {
            date: formData.get('date'),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            thumbnail: formData.get('thumbnail') || 'media/blog/default.jpg',
            content: formData.get('content')
        };

        if (currentEditingPost) {
            // Update existing post
            const index = blogPosts.findIndex(p => p.id === currentEditingPost.id);
            if (index !== -1) {
                blogPosts[index] = { ...currentEditingPost, ...postData };
            }
        } else {
            // Create new post
            const newPost = {
                id: Math.max(...blogPosts.map(p => p.id)) + 1,
                ...postData
            };
            blogPosts.unshift(newPost);
        }

        // Save to localStorage for demo purposes
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        
        // Trigger a storage event to update other pages
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'blogPosts',
            newValue: JSON.stringify(blogPosts)
        }));
        
        // Trigger custom event for immediate updates
        window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
        
        // Direct call to update main page if function is available
        if (typeof window.loadBlogFromStorage === 'function') {
            console.log('Directly calling loadBlogFromStorage...');
            window.loadBlogFromStorage();
        }
        
        loadPosts();
        closePostEditor();
        
        // Show success message
        alert(currentEditingPost ? 'Article modifié avec succès!' : 'Article créé avec succès!');
    }

    /**
     * Update main page blog timeline (if on main page)
     */
    function updateMainPageBlog() {
        if (typeof window.loadBlogFromStorage === 'function') {
            window.loadBlogFromStorage();
        }
    }

    /**
     * Edit post
     */
    window.editPost = function(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            openPostEditor(post);
        }
    };

    /**
     * Delete post
     */
    window.deletePost = function(postId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            blogPosts = blogPosts.filter(p => p.id !== postId);
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            loadPosts();
            alert('Article supprimé avec succès!');
        }
    };

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
     * Check if URL is valid
     */
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

})(); 