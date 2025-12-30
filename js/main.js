/**
 * ORDRE NATIONAL - Site Web Officiel
 * JavaScript Principal V1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initAccordions();
    initTabs();
    initScrollAnimations();
    initComparison();
    initSearch();
    initScrollSpy();
    initBreadcrumbs();
});

/* === NAVIGATION === */
function initNavbar() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
            });
        });
    }

    // Navbar au scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Marquer le lien actif
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

/* === ACCORDÉONS === */
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const wasActive = item.classList.contains('active');

            // Fermer tous les autres
            item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });

            // Toggle l'actuel
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

/* === TABS === */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs');
            const targetId = this.dataset.tab;

            // Désactiver tous les boutons et contenus
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Activer le bon
            this.classList.add('active');
            tabGroup.querySelector(`#${targetId}`).classList.add('active');
        });
    });
}

/* === SCROLL ANIMATIONS === */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* === COMPARAISON CONSTITUTION === */
function initComparison() {
    // Toggle pour afficher/masquer les articles inchangés
    const toggleUnchanged = document.querySelector('#toggle-unchanged');
    if (toggleUnchanged) {
        toggleUnchanged.addEventListener('change', function() {
            const unchanged = document.querySelectorAll('.article-block.unchanged');
            unchanged.forEach(el => {
                el.style.display = this.checked ? 'block' : 'none';
            });
        });
    }

    // Filtres par type de modification
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const allArticles = document.querySelectorAll('.article-block');

            if (filterType === 'all') {
                allArticles.forEach(el => el.style.display = 'block');
            } else {
                allArticles.forEach(el => {
                    el.style.display = el.classList.contains(filterType) ? 'block' : 'none';
                });
            }

            // Active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Synchronisation du scroll entre les colonnes
    const beforeCol = document.querySelector('.comparison-column.before .comparison-body');
    const afterCol = document.querySelector('.comparison-column.after .comparison-body');

    if (beforeCol && afterCol) {
        beforeCol.addEventListener('scroll', function() {
            afterCol.scrollTop = this.scrollTop;
        });
        afterCol.addEventListener('scroll', function() {
            beforeCol.scrollTop = this.scrollTop;
        });
    }
}

/* === RECHERCHE === */
function initSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();

            if (query.length < 2) {
                if (searchResults) searchResults.innerHTML = '';
                return;
            }

            // Recherche dans les articles
            const articles = document.querySelectorAll('.article-block');
            const matches = [];

            articles.forEach(article => {
                const text = article.textContent.toLowerCase();
                if (text.includes(query)) {
                    matches.push({
                        element: article,
                        number: article.querySelector('.article-number')?.textContent || 'Article',
                        content: article.querySelector('.article-content')?.textContent.substring(0, 100) + '...'
                    });
                }
            });

            // Afficher les résultats
            if (searchResults) {
                if (matches.length > 0) {
                    searchResults.innerHTML = matches.map(m => `
                        <div class="search-result-item" data-article="${m.number}">
                            <strong>${m.number}</strong>
                            <p>${m.content}</p>
                        </div>
                    `).join('');

                    // Clic pour naviguer
                    searchResults.querySelectorAll('.search-result-item').forEach((item, i) => {
                        item.addEventListener('click', () => {
                            matches[i].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            matches[i].element.classList.add('highlight');
                            setTimeout(() => matches[i].element.classList.remove('highlight'), 2000);
                        });
                    });
                } else {
                    searchResults.innerHTML = '<p class="no-results">Aucun résultat trouvé.</p>';
                }
            }
        });
    }
}

/* === UTILITAIRES === */

// Smooth scroll pour les liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Copier dans le presse-papier
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copié dans le presse-papier !');
    }).catch(err => {
        console.error('Erreur de copie:', err);
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Formatage des nombres
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

/* === SCROLL SPY (Table of Contents) === */
function initScrollSpy() {
    const toc = document.querySelector('.page-toc');
    if (!toc) return;

    const tocLinks = toc.querySelectorAll('.toc-list a');
    const sections = [];

    // Collecter les sections correspondantes
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ link, section });
            }
        }
    });

    if (sections.length === 0) return;

    // Observer pour détecter la section visible
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0
    };

    let currentActive = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeLink = sections.find(s => s.section === entry.target)?.link;
                if (activeLink && activeLink !== currentActive) {
                    // Retirer l'ancien actif
                    tocLinks.forEach(l => l.classList.remove('active'));
                    // Activer le nouveau
                    activeLink.classList.add('active');
                    currentActive = activeLink;
                }
            }
        });
    }, observerOptions);

    sections.forEach(({ section }) => {
        observer.observe(section);
    });

    // Smooth scroll pour les liens TOC
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

/* === BREADCRUMBS === */
function initBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;

    // Animation d'entrée
    breadcrumbs.style.opacity = '0';
    breadcrumbs.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        breadcrumbs.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        breadcrumbs.style.opacity = '1';
        breadcrumbs.style.transform = 'translateY(0)';
    }, 100);
}

/* === PROGRAMME HUB CARDS === */
function initProgrammeCards() {
    const cards = document.querySelectorAll('.hub-card');
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
        // Animation décalée à l'entrée
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

// Export pour utilisation globale
window.ON = {
    copyToClipboard,
    showToast,
    formatNumber,
    initProgrammeCards
};
