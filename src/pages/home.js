// NexusAI — Home Page
import { CATEGORIES, TOOLS } from '../registry.js';

export function renderHomePage() {
    return `
    ${renderHero()}
    ${renderCategories()}
    ${renderFeaturedTools()}
    ${renderHowItWorks()}
    ${renderCTA()}`;
}

function renderHero() {
    return `
    <section class="hero">
        <div class="hero-orbs">
            <div class="hero-orb hero-orb-1"></div>
            <div class="hero-orb hero-orb-2"></div>
            <div class="hero-orb hero-orb-3"></div>
        </div>
        <div class="hero-content">
            <div class="hero-badge">
                <span class="pulse-dot"></span>
                30 Free AI Tools — No Signup Required
            </div>
            <h1>
                <span class="text-gradient-hero">AI-Powered Tools</span><br>
                for Everyone
            </h1>
            <p class="hero-subtitle">
                Write articles, generate images, build resumes, create logos, and more — 
                all powered by AI. Completely free, no account needed.
            </p>
            <div class="hero-cta">
                <a href="#/tools" class="btn btn-primary btn-lg">Explore All Tools →</a>
                <a href="#/category/writing" class="btn btn-secondary btn-lg">Start Writing</a>
            </div>
            <div class="hero-stats">
                <div class="hero-stat">
                    <div class="hero-stat-value">30</div>
                    <div class="hero-stat-label">AI Tools</div>
                </div>
                <div class="hero-stat">
                    <div class="hero-stat-value">6</div>
                    <div class="hero-stat-label">Categories</div>
                </div>
                <div class="hero-stat">
                    <div class="hero-stat-value">100%</div>
                    <div class="hero-stat-label">Free Forever</div>
                </div>
            </div>
        </div>
    </section>`;
}

function renderCategories() {
    return `
    <section class="categories-section">
        <div class="container">
            <div class="section-header">
                <h2>Explore by <span class="text-gradient">Category</span></h2>
                <p>Choose from 6 categories of AI-powered tools built for every need</p>
            </div>
            <div class="categories-grid">
                ${CATEGORIES.map((cat, i) => `
                <a href="#/category/${cat.id}" class="category-card animate-fade-in-up stagger-${i+1}">
                    <div class="category-icon">${cat.icon}</div>
                    <h3>${cat.name}</h3>
                    <p>${cat.desc}</p>
                    <span class="category-count">${cat.count} Tools Available</span>
                </a>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderFeaturedTools() {
    const featured = [TOOLS[0], TOOLS[5], TOOLS[15], TOOLS[25], TOOLS[6], TOOLS[20]]; // Mix of popular
    return `
    <section class="featured-section">
        <div class="container">
            <div class="section-header">
                <h2>Most Popular <span class="text-gradient">AI Tools</span></h2>
                <p>Start with our most popular tools loved by thousands of users</p>
            </div>
            <div class="tools-grid">
                ${featured.map((tool, i) => renderToolCard(tool, i)).join('')}
            </div>
        </div>
    </section>`;
}

function renderHowItWorks() {
    return `
    <section class="how-it-works">
        <div class="container">
            <div class="section-header">
                <h2>How It <span class="text-gradient">Works</span></h2>
                <p>Get started in seconds. No signup, no credit card, no hassle.</p>
            </div>
            <div class="steps-grid">
                <div class="step-card animate-fade-in-up stagger-1">
                    <div class="step-number">1</div>
                    <h3>Choose a Tool</h3>
                    <p>Browse our collection of 30 AI-powered tools across 6 categories.</p>
                </div>
                <div class="step-card animate-fade-in-up stagger-2">
                    <div class="step-number">2</div>
                    <h3>Enter Your Input</h3>
                    <p>Type your text, upload your image, or describe what you need.</p>
                </div>
                <div class="step-card animate-fade-in-up stagger-3">
                    <div class="step-number">3</div>
                    <h3>Get AI Results</h3>
                    <p>Receive instant, high-quality results. Copy, download, or share.</p>
                </div>
            </div>
        </div>
    </section>`;
}

function renderCTA() {
    return `
    <section class="cta-section">
        <div class="container">
            <div class="cta-card">
                <h2>Ready to <span class="text-gradient">Supercharge</span> Your Work?</h2>
                <p>Join thousands of professionals already using NexusAI's free tools every day.</p>
                <a href="#/tools" class="btn btn-primary btn-lg">Get Started — It's Free →</a>
            </div>
        </div>
    </section>`;
}

export function renderToolCard(tool, index = 0) {
    const cat = CATEGORIES.find(c => c.id === tool.category);
    return `
    <a href="#/tool/${tool.slug}" class="tool-card animate-fade-in-up stagger-${(index % 10) + 1}" data-category="${tool.category}" style="--card-accent:${cat?.color || 'var(--accent-primary)'}; --card-icon-bg:${cat?.color || 'var(--accent-primary)'}22;">
        <div class="tool-card-icon">${tool.icon}</div>
        <span class="badge badge-${tool.category}">${cat?.name || tool.category}</span>
        <h3 class="tool-card-title">${tool.name}</h3>
        <p class="tool-card-desc">${tool.desc}</p>
        <div class="tool-card-footer">
            <span class="badge badge-success">Free</span>
            <span class="tool-card-cta">Use Tool →</span>
        </div>
    </a>`;
}
