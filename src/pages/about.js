// NexusAI — About Page
export function renderAboutPage(type) {
    if (type === 'privacy') return renderPrivacy();
    return `
    <div class="tool-page">
        <div class="container" style="max-width:760px;">
            <div class="tool-hero"><h1>About NexusAI</h1><p class="tool-subtitle">Free AI tools for everyone, everywhere.</p></div>
            <div class="tool-workspace">
                <h3 style="margin-bottom:1rem;">Our Mission</h3>
                <p style="margin-bottom:1.5rem;">NexusAI provides 30 free, powerful AI tools that help individuals and businesses create, write, design, and automate — without expensive subscriptions or complicated software.</p>
                <h3 style="margin-bottom:1rem;">Why NexusAI?</h3>
                <p style="margin-bottom:1rem;">We believe AI should be accessible to everyone. Every tool on NexusAI is completely free to use, requires no signup, and works directly in your browser.</p>
                <ul style="list-style:disc;padding-left:1.5rem;color:var(--text-secondary);line-height:2;">
                    <li>30 AI-powered tools across 6 categories</li>
                    <li>No signup or account required</li>
                    <li>100% free — no hidden costs</li>
                    <li>Privacy-first: your data stays in your browser</li>
                    <li>Works on desktop, tablet, and mobile</li>
                </ul>
            </div>
        </div>
    </div>`;
}

function renderPrivacy() {
    return `
    <div class="tool-page">
        <div class="container" style="max-width:760px;">
            <div class="tool-hero"><h1>Privacy Policy</h1></div>
            <div class="tool-workspace">
                <p style="margin-bottom:1rem;">NexusAI respects your privacy. Here's how we handle your data:</p>
                <ul style="list-style:disc;padding-left:1.5rem;color:var(--text-secondary);line-height:2.2;">
                    <li><strong>No data collection:</strong> We don't collect personal information.</li>
                    <li><strong>Browser processing:</strong> Most tools process data locally in your browser.</li>
                    <li><strong>No cookies:</strong> We don't use tracking cookies.</li>
                    <li><strong>No accounts:</strong> No signup means no stored user data.</li>
                    <li><strong>Third-party APIs:</strong> Some tools use external APIs. Your input is sent only when you click "Generate" and is not stored.</li>
                </ul>
                <p style="margin-top:1.5rem;">Last updated: April 2026</p>
            </div>
        </div>
    </div>`;
}
