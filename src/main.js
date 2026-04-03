import './styles/index.css'
import './styles/components.css'
import './styles/animations.css'
import './styles/pages.css'
import './styles/tools.css'
import { initRouter } from './router.js'
import { TOOLS } from './registry.js'

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderHeader()}
        <main id="page-content" class="main-content"></main>
        ${renderFooter()}
        <div class="toast-container" id="toast-container"></div>
    `;
    initMobileMenu();
    initHeaderScroll();
    initRouter();
});

function renderHeader() {
    return `
    <header class="site-header" id="site-header">
        <nav class="nav-container">
            <a href="#/" class="logo" id="logo-link">
                <span class="logo-icon">⚡</span>
                <span class="logo-text">Nexus<span class="logo-accent">AI</span></span>
            </a>
            <div class="nav-links" id="nav-links">
                <a href="#/" class="nav-link" data-page="home">Home</a>
                <a href="#/tools" class="nav-link" data-page="tools">All Tools</a>
                <a href="#/category/writing" class="nav-link" data-page="writing">Writing</a>
                <a href="#/category/image" class="nav-link" data-page="image">Image</a>
                <a href="#/category/video-audio" class="nav-link" data-page="video-audio">Video</a>
                <a href="#/category/business" class="nav-link" data-page="business">Business</a>
                <a href="#/category/marketing" class="nav-link" data-page="marketing">Marketing</a>
                <a href="#/category/utility" class="nav-link" data-page="utility">Utility</a>
            </div>
            <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </nav>
    </header>`;
}

function renderFooter() {
    const cats = [
        { title: 'Writing Tools', tools: TOOLS.filter(t => t.category === 'writing').slice(0,5) },
        { title: 'Image Tools', tools: TOOLS.filter(t => t.category === 'image').slice(0,5) },
        { title: 'Business Tools', tools: TOOLS.filter(t => t.category === 'business').slice(0,5) },
    ];
    return `
    <footer class="site-footer" id="site-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="#/" class="logo"><span class="logo-icon">⚡</span><span class="logo-text">Nexus<span class="logo-accent">AI</span></span></a>
                    <p class="footer-desc">30 free AI-powered tools for writing, design, business, marketing, and development. No signup required.</p>
                </div>
                ${cats.map(c => `<div class="footer-col"><h4>${c.title}</h4>${c.tools.map(t => `<a href="#/tool/${t.slug}">${t.name}</a>`).join('')}</div>`).join('')}
                <div class="footer-col"><h4>More</h4>
                    <a href="#/category/marketing">Marketing Tools</a>
                    <a href="#/category/utility">Utility Tools</a>
                    <a href="#/category/video-audio">Video & Audio</a>
                    <a href="#/tools">View All 30 Tools →</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 NexusAI. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="#/about">About</a>
                    <a href="#/privacy">Privacy</a>
                </div>
            </div>
        </div>
    </footer>`;
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav-links');
    btn?.addEventListener('click', () => {
        btn.classList.toggle('active');
        nav.classList.toggle('open');
    });
    nav?.addEventListener('click', e => {
        if (e.target.classList.contains('nav-link')) {
            btn.classList.remove('active');
            nav.classList.remove('open');
        }
    });
}

function initHeaderScroll() {
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 20);
    });
}

// Global toast
window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Global copy
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
};
