// NexusAI — Category Page
import { CATEGORIES, getToolsByCategory, getCategoryById } from '../registry.js';
import { renderToolCard } from './home.js';

export function renderCategoryPage(catId) {
    const cat = getCategoryById(catId);
    if (!cat) return `<div class="container" style="padding:6rem 0;text-align:center"><h1>Category not found</h1><a href="#/" class="btn btn-primary">Go Home</a></div>`;
    const tools = getToolsByCategory(catId);
    return `
    <div class="category-page">
        <div class="container">
            <div class="category-hero">
                <div class="category-hero-icon">${cat.icon}</div>
                <h1>${cat.name}</h1>
                <p>${cat.desc}</p>
            </div>
            <div class="tools-grid">
                ${tools.map((t, i) => renderToolCard(t, i)).join('')}
            </div>
        </div>
    </div>`;
}
