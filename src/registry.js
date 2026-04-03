// NexusAI — Tool Registry (all 30 tools metadata)
export const CATEGORIES = [
    { id: 'writing', name: 'AI Writing Tools', icon: '✍️', color: '#7c5cfc', desc: 'Generate articles, emails, and more with AI-powered writing assistance.', count: 5 },
    { id: 'image', name: 'AI Image Tools', icon: '🎨', color: '#f472b6', desc: 'Create, edit, and enhance images with cutting-edge AI technology.', count: 5 },
    { id: 'video-audio', name: 'Video & Audio Tools', icon: '🎬', color: '#fbbf24', desc: 'Transform audio and video content with AI transcription, TTS, and scripts.', count: 5 },
    { id: 'business', name: 'AI Business Tools', icon: '💼', color: '#00d4aa', desc: 'Build resumes, generate invoices, and create business assets instantly.', count: 5 },
    { id: 'marketing', name: 'Marketing & SEO Tools', icon: '📱', color: '#38bdf8', desc: 'Boost your marketing with AI-generated copy, hashtags, and SEO content.', count: 5 },
    { id: 'utility', name: 'AI Utility Tools', icon: '🛠️', color: '#fb923c', desc: 'Code generation, translation, color palettes, QR codes, and more.', count: 5 },
];

export const TOOLS = [
    // Writing
    { id: 1, slug: 'article-writer', name: 'AI Article Writer', category: 'writing', icon: '📝', desc: 'Generate high-quality, SEO-optimized articles and blog posts on any topic in seconds.', keywords: 'AI article writer, AI blog writer, content generator' },
    { id: 2, slug: 'paraphraser', name: 'AI Paraphraser', category: 'writing', icon: '🔄', desc: 'Rewrite and rephrase text while keeping the original meaning. Perfect for avoiding plagiarism.', keywords: 'AI paraphrasing tool, reword text, rephrase sentence' },
    { id: 3, slug: 'grammar-checker', name: 'AI Grammar Checker', category: 'writing', icon: '✅', desc: 'Fix grammar, spelling, and punctuation errors instantly with AI-powered proofreading.', keywords: 'AI grammar checker, spell check, proofreading tool' },
    { id: 4, slug: 'email-writer', name: 'AI Email Writer', category: 'writing', icon: '📧', desc: 'Craft professional emails for any occasion — business, sales, follow-ups, and more.', keywords: 'AI email generator, professional email writer, email template' },
    { id: 5, slug: 'summarizer', name: 'AI Summarizer', category: 'writing', icon: '📋', desc: 'Condense long articles, documents, and text into clear, concise summaries instantly.', keywords: 'AI text summarizer, article summarizer, content summary' },
    // Image
    { id: 6, slug: 'image-generator', name: 'AI Image Generator', category: 'image', icon: '🖼️', desc: 'Create stunning images from text descriptions using AI. Perfect for social media and design.', keywords: 'AI image generator, text to image, AI art generator' },
    { id: 7, slug: 'bg-remover', name: 'Background Remover', category: 'image', icon: '✂️', desc: 'Remove image backgrounds instantly with AI. Get clean transparent PNGs in one click.', keywords: 'background remover, remove bg, transparent background' },
    { id: 8, slug: 'image-upscaler', name: 'AI Image Upscaler', category: 'image', icon: '🔍', desc: 'Enhance and upscale images without losing quality. Make low-res photos look sharp and clear.', keywords: 'AI image upscaler, enhance photo, upscale image' },
    { id: 9, slug: 'logo-maker', name: 'AI Logo Maker', category: 'image', icon: '⭐', desc: 'Design professional logos for your brand in seconds. Choose from styles, colors, and fonts.', keywords: 'AI logo maker, logo generator, brand logo creator' },
    { id: 10, slug: 'style-transfer', name: 'AI Style Transfer', category: 'image', icon: '🎭', desc: 'Transform your photos into artistic masterpieces inspired by famous art styles.', keywords: 'AI style transfer, photo to painting, art filter' },
    // Video & Audio
    { id: 11, slug: 'video-script', name: 'Video Script Writer', category: 'video-audio', icon: '🎥', desc: 'Generate engaging video scripts for YouTube, TikTok, and social media content.', keywords: 'AI video script generator, YouTube script writer' },
    { id: 12, slug: 'subtitle-generator', name: 'Subtitle Generator', category: 'video-audio', icon: '💬', desc: 'Auto-generate accurate subtitles and captions for your videos using speech recognition.', keywords: 'AI subtitle generator, auto caption, video subtitles' },
    { id: 13, slug: 'text-to-speech', name: 'Text to Speech', category: 'video-audio', icon: '🔊', desc: 'Convert text into natural-sounding speech with multiple voices and languages.', keywords: 'text to speech, AI voice generator, TTS online' },
    { id: 14, slug: 'audio-transcriber', name: 'Audio Transcriber', category: 'video-audio', icon: '🎙️', desc: 'Transcribe audio recordings to text with high accuracy using AI speech recognition.', keywords: 'audio to text, transcribe audio, speech to text' },
    { id: 15, slug: 'podcast-summarizer', name: 'Podcast Summarizer', category: 'video-audio', icon: '🎧', desc: 'Get quick, comprehensive summaries of podcast episodes and audio content.', keywords: 'podcast summary, audio summarizer, podcast notes' },
    // Business
    { id: 16, slug: 'resume-builder', name: 'AI Resume Builder', category: 'business', icon: '📄', desc: 'Build ATS-friendly, professional resumes that stand out. Multiple templates available.', keywords: 'AI resume builder, resume maker, ATS resume' },
    { id: 17, slug: 'cover-letter', name: 'Cover Letter Writer', category: 'business', icon: '✉️', desc: 'Generate tailored cover letters for any job application in seconds.', keywords: 'AI cover letter generator, cover letter writer' },
    { id: 18, slug: 'business-name', name: 'Business Name Generator', category: 'business', icon: '🏢', desc: 'Generate creative, memorable business names and check domain availability.', keywords: 'business name generator, company name ideas' },
    { id: 19, slug: 'slogan-generator', name: 'Slogan Generator', category: 'business', icon: '💡', desc: 'Create catchy taglines and slogans that capture your brand essence.', keywords: 'slogan generator, tagline maker, brand slogan' },
    { id: 20, slug: 'invoice-generator', name: 'Invoice Generator', category: 'business', icon: '🧾', desc: 'Create professional invoices instantly. Download as PDF, ready to send.', keywords: 'free invoice generator, invoice maker, invoice template' },
    // Marketing
    { id: 21, slug: 'seo-meta', name: 'SEO Meta Generator', category: 'marketing', icon: '🔎', desc: 'Generate optimized meta titles and descriptions to boost your search engine rankings.', keywords: 'SEO meta generator, meta description writer, title tag' },
    { id: 22, slug: 'hashtag-generator', name: 'Hashtag Generator', category: 'marketing', icon: '#️⃣', desc: 'Find the best performing hashtags for Instagram, Twitter, TikTok, and LinkedIn.', keywords: 'hashtag generator, best hashtags, trending hashtags' },
    { id: 23, slug: 'ad-copy', name: 'AI Ad Copy Writer', category: 'marketing', icon: '📢', desc: 'Generate high-converting ad copy for Facebook, Google, Instagram, and more.', keywords: 'AI ad copy generator, Facebook ad writer, Google ads' },
    { id: 24, slug: 'social-post', name: 'Social Media Writer', category: 'marketing', icon: '📲', desc: 'Create engaging social media posts optimized for each platform.', keywords: 'AI social media post generator, Instagram caption' },
    { id: 25, slug: 'product-desc', name: 'Product Description Writer', category: 'marketing', icon: '🛒', desc: 'Write compelling product descriptions that convert visitors into buyers.', keywords: 'AI product description generator, e-commerce copy' },
    // Utility
    { id: 26, slug: 'code-generator', name: 'AI Code Generator', category: 'utility', icon: '💻', desc: 'Generate code from natural language descriptions. Supports Python, JavaScript, and more.', keywords: 'AI code generator, code from description, programming AI' },
    { id: 27, slug: 'translator', name: 'AI Translator', category: 'utility', icon: '🌐', desc: 'Translate text between 50+ languages with AI-powered accuracy and context awareness.', keywords: 'AI translator, translate text, language translator' },
    { id: 28, slug: 'color-palette', name: 'Color Palette Generator', category: 'utility', icon: '🎨', desc: 'Generate beautiful, harmonious color palettes for your design projects.', keywords: 'AI color palette generator, color scheme, design colors' },
    { id: 29, slug: 'qr-code', name: 'QR Code Generator', category: 'utility', icon: '📱', desc: 'Create custom QR codes for URLs, text, WiFi, and more. Download in high resolution.', keywords: 'QR code generator, create QR code, custom QR' },
    { id: 30, slug: 'placeholder-text', name: 'AI Text Generator', category: 'utility', icon: '📜', desc: 'Generate meaningful placeholder text in any style — better than Lorem Ipsum.', keywords: 'AI text generator, placeholder text, dummy text' },
];

export function getToolBySlug(slug) {
    return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(categoryId) {
    return TOOLS.filter(t => t.category === categoryId);
}

export function getCategoryById(id) {
    return CATEGORIES.find(c => c.id === id);
}
