// NexusAI — All Tools Listing Page
import { TOOLS, CATEGORIES } from '../registry.js';
import { renderToolCard } from './home.js';

export function renderToolsPage() {
    return `
    <div class="tools-page">
        <div class="container">
            <div class="tools-page-header">
                <h1>All <span class="text-gradient">30 AI Tools</span></h1>
                <p class="hero-subtitle">Browse our complete collection of free AI-powered tools</p>
            </div>
            <div class="search-container">
                <span class="search-icon">🔍</span>
                <input type="text" class="search-input" id="tools-search" placeholder="Search tools..." aria-label="Search tools">
            </div>
            <div class="filter-bar">
                <button class="filter-btn active" data-filter="all">All Tools</button>
                ${CATEGORIES.map(c => `<button class="filter-btn" data-filter="${c.id}">${c.icon} ${c.name}</button>`).join('')}
            </div>
            <div class="tools-grid">
                ${TOOLS.map((tool, i) => renderToolCard(tool, i)).join('')}
            </div>
        </div>
    </div>`;
}
