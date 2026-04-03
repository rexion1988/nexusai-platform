// NexusAI — Hash-based SPA Router
import { renderHomePage } from './pages/home.js';
import { renderToolsPage } from './pages/tools.js';
import { renderCategoryPage } from './pages/category.js';
import { renderToolPage } from './pages/toolPage.js';
import { renderAboutPage } from './pages/about.js';

const routes = {
    '/': renderHomePage,
    '/tools': renderToolsPage,
    '/about': renderAboutPage,
    '/privacy': () => renderAboutPage('privacy'),
};

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const content = document.getElementById('page-content');
    if (!content) return;

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const page = link.dataset.page;
        if ((hash === '/' && page === 'home') || hash.includes(page)) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Route matching
    if (routes[hash]) {
        content.innerHTML = '<div class="page-enter">' + routes[hash]() + '</div>';
    } else if (hash.startsWith('/category/')) {
        const catId = hash.split('/category/')[1];
        content.innerHTML = '<div class="page-enter">' + renderCategoryPage(catId) + '</div>';
    } else if (hash.startsWith('/tool/')) {
        const slug = hash.split('/tool/')[1];
        content.innerHTML = '<div class="page-enter">' + renderToolPage(slug) + '</div>';
    } else {
        content.innerHTML = '<div class="page-enter">' + render404() + '</div>';
    }

    // Init any tool-specific JS after render
    setTimeout(() => initPageScripts(hash), 50);
}

function render404() {
    return `
    <div class="tool-page">
        <div class="container" style="text-align:center;padding:6rem 0;">
            <div style="font-size:80px;margin-bottom:1rem;">🔮</div>
            <h1 style="font-size:2rem;margin-bottom:1rem;">Page Not Found</h1>
            <p style="margin-bottom:2rem;">The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn btn-primary">Go Home</a>
        </div>
    </div>`;
}

function initPageScripts(hash) {
    // Init FAQ accordions
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.faq-item').classList.toggle('open');
        });
    });

    // Init filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.tool-card[data-category]').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
            });
        });
    });

    // Init search
    const searchInput = document.getElementById('tools-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.tool-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }

    // Init tool-specific functionality
    if (hash.startsWith('/tool/')) {
        const slug = hash.split('/tool/')[1];
        initToolInteractivity(slug);
    }
}

// Each tool gets client-side interactivity initialized here
function initToolInteractivity(slug) {
    // Import and init tool-specific handlers dynamically
    import('./tools/toolHandlers.js').then(mod => {
        if (mod.initTool) mod.initTool(slug);
    });
}
