// NexusAI — Tool UI Templates for all 30 tools
export function getToolUI(slug) {
    const uis = {
        // ===== WRITING TOOLS =====
        'article-writer': textTool('Article Topic', 'e.g., Benefits of AI in Healthcare', 'Write a comprehensive article about...', [
            { label: 'Tone', id: 'tone', options: ['Professional', 'Casual', 'Academic', 'Conversational'] },
            { label: 'Length', id: 'length', options: ['Short (300 words)', 'Medium (600 words)', 'Long (1000+ words)'] }
        ]),
        'paraphraser': dualPaneTool('Original Text', 'Paste the text you want to paraphrase...', 'Paraphrased Text', [
            { label: 'Style', id: 'style', options: ['Standard', 'Formal', 'Simple', 'Creative', 'Academic'] }
        ]),
        'grammar-checker': dualPaneTool('Your Text', 'Paste your text to check for grammar errors...', 'Corrected Text', []),
        'email-writer': textTool('Email Purpose', 'e.g., Follow up on job application', 'Write a professional email...', [
            { label: 'Tone', id: 'tone', options: ['Formal', 'Friendly', 'Persuasive', 'Apologetic'] },
            { label: 'Type', id: 'type', options: ['Business', 'Sales', 'Follow-up', 'Thank You', 'Introduction'] }
        ]),
        'summarizer': dualPaneTool('Text to Summarize', 'Paste the article or text you want to summarize...', 'Summary', [
            { label: 'Length', id: 'length', options: ['Brief (1-2 sentences)', 'Short paragraph', 'Detailed summary'] }
        ]),
        // ===== IMAGE TOOLS =====
        'image-generator': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Generate Image</h3></div>
            <div class="input-group" style="margin-bottom:1.5rem;">
                <label class="input-label">Describe your image</label>
                <textarea class="input-field" id="tool-input" rows="3" placeholder="e.g., A futuristic city at sunset with flying cars and neon lights..."></textarea>
            </div>
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Style</label>
                    <select class="input-field" id="img-style"><option>Realistic</option><option>Digital Art</option><option>Anime</option><option>Oil Painting</option><option>Watercolor</option><option>3D Render</option></select>
                </div>
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Size</label>
                    <select class="input-field" id="img-size"><option>1024x1024</option><option>512x512</option><option>768x768</option></select>
                </div>
            </div>
            <button class="btn btn-primary" id="tool-generate" onclick="window.toolGenerate()">🎨 Generate Image</button>
            <div class="tool-output" id="tool-output" style="margin-top:1.5rem;">
                <div class="tool-output-empty"><span class="empty-icon">🖼️</span><p>Your generated image will appear here</p></div>
            </div>
        </div>`,
        'bg-remover': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Remove Background</h3></div>
            <div class="tool-grid-2">
                <div class="tool-input-section">
                    <div class="input-group">
                        <label class="input-label">Upload Image</label>
                        <div style="border:2px dashed var(--border-medium);border-radius:var(--radius-lg);padding:3rem;text-align:center;cursor:pointer;" id="upload-zone" onclick="document.getElementById('file-input').click()">
                            <div style="font-size:48px;margin-bottom:1rem;">📤</div>
                            <p>Click or drag & drop an image here</p>
                            <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:0.5rem;">Supports JPG, PNG, WebP</p>
                            <input type="file" id="file-input" accept="image/*" style="display:none;">
                        </div>
                    </div>
                    <canvas id="source-canvas" style="display:none;max-width:100%;border-radius:var(--radius-lg);"></canvas>
                    <button class="btn btn-primary" id="tool-generate" onclick="window.toolGenerate()" style="display:none;">✂️ Remove Background</button>
                </div>
                <div class="tool-output-section">
                    <div class="tool-output" id="tool-output">
                        <div class="tool-output-empty"><span class="empty-icon">✂️</span><p>Processed image will appear here</p></div>
                    </div>
                </div>
            </div>
        </div>`,
        'image-upscaler': uploadTool('Upload Image to Upscale', '🔍', 'Upscaled image will appear here', '🔍 Upscale Image', [
            { label: 'Scale', id: 'scale', options: ['2x', '3x', '4x'] }
        ]),
        'logo-maker': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Design Your Logo</h3></div>
            <div class="tool-grid-2">
                <div class="tool-input-section">
                    <div class="input-group"><label class="input-label">Brand Name</label><input class="input-field" id="logo-name" placeholder="e.g., TechVibe"></div>
                    <div class="input-group"><label class="input-label">Tagline (optional)</label><input class="input-field" id="logo-tagline" placeholder="e.g., Innovation Simplified"></div>
                    <div class="input-group"><label class="input-label">Style</label><select class="input-field" id="logo-style"><option>Modern</option><option>Minimal</option><option>Bold</option><option>Elegant</option><option>Playful</option><option>Tech</option></select></div>
                    <div class="input-group"><label class="input-label">Color</label><input type="color" class="input-field" id="logo-color" value="#7c5cfc" style="height:48px;padding:4px;"></div>
                    <button class="btn btn-primary" onclick="window.toolGenerate()">⭐ Generate Logo</button>
                </div>
                <div class="tool-output-section">
                    <div class="logo-preview" id="tool-output"><div class="tool-output-empty"><span class="empty-icon">⭐</span><p>Your logo will appear here</p></div></div>
                </div>
            </div>
        </div>`,
        'style-transfer': uploadTool('Upload Photo', '🎭', 'Styled image will appear here', '🎭 Apply Style', [
            { label: 'Art Style', id: 'art-style', options: ['Van Gogh', 'Monet', 'Picasso', 'Pop Art', 'Sketch', 'Watercolor'] }
        ]),
        // ===== VIDEO & AUDIO TOOLS =====
        'video-script': textTool('Video Topic', 'e.g., Top 10 AI Tools for Productivity', 'Write an engaging video script...', [
            { label: 'Platform', id: 'platform', options: ['YouTube', 'TikTok/Shorts', 'Instagram Reels', 'LinkedIn'] },
            { label: 'Duration', id: 'duration', options: ['30 seconds', '1 minute', '3 minutes', '5-10 minutes'] }
        ]),
        'subtitle-generator': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Generate Subtitles</h3></div>
            <div class="input-group" style="margin-bottom:1.5rem;">
                <label class="input-label">Enter text or paste speech content</label>
                <textarea class="input-field" id="tool-input" rows="6" placeholder="Paste the spoken content of your video here..."></textarea>
            </div>
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Format</label>
                    <select class="input-field" id="sub-format"><option>SRT</option><option>VTT</option><option>Plain Text</option></select>
                </div>
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Words per subtitle</label>
                    <select class="input-field" id="sub-words"><option>8-10 words</option><option>5-7 words</option><option>12-15 words</option></select>
                </div>
            </div>
            <button class="btn btn-primary" onclick="window.toolGenerate()">💬 Generate Subtitles</button>
            <div class="tool-output" id="tool-output" style="margin-top:1.5rem;font-family:var(--font-mono);font-size:var(--text-sm);">
                <div class="tool-output-empty"><span class="empty-icon">💬</span><p>Subtitles will appear here</p></div>
            </div>
            <div class="tool-actions" style="margin-top:1rem;" id="output-actions"></div>
        </div>`,
        'text-to-speech': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Text to Speech</h3></div>
            <div class="input-group" style="margin-bottom:1.5rem;">
                <label class="input-label">Enter text to speak</label>
                <textarea class="input-field" id="tool-input" rows="5" placeholder="Type or paste text to convert to speech..."></textarea>
            </div>
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Voice</label>
                    <select class="input-field" id="tts-voice"></select>
                </div>
                <div class="input-group" style="flex:1;min-width:100px;">
                    <label class="input-label">Speed</label>
                    <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" class="input-field" style="padding:8px;">
                </div>
                <div class="input-group" style="flex:1;min-width:100px;">
                    <label class="input-label">Pitch</label>
                    <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1" class="input-field" style="padding:8px;">
                </div>
            </div>
            <div class="tool-actions">
                <button class="btn btn-primary" onclick="window.toolGenerate()">🔊 Speak</button>
                <button class="btn btn-secondary" onclick="window.speechSynthesis.cancel()">⏹️ Stop</button>
            </div>
            <div class="tool-output" id="tool-output" style="margin-top:1.5rem;">
                <div class="tool-output-empty"><span class="empty-icon">🔊</span><p>Click "Speak" to hear your text</p></div>
            </div>
        </div>`,
        'audio-transcriber': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Audio Transcriber</h3></div>
            <p style="margin-bottom:1.5rem;color:var(--text-secondary);">Click the button below and speak into your microphone. Your speech will be transcribed in real-time.</p>
            <div class="tool-actions" style="margin-bottom:1.5rem;">
                <button class="btn btn-primary" id="record-btn" onclick="window.toolGenerate()">🎙️ Start Recording</button>
                <button class="btn btn-secondary" id="stop-btn" onclick="window.stopRecording()" style="display:none;">⏹️ Stop</button>
            </div>
            <div class="tool-output" id="tool-output" style="min-height:200px;">
                <div class="tool-output-empty"><span class="empty-icon">🎙️</span><p>Transcribed text will appear here</p></div>
            </div>
            <div class="tool-actions" style="margin-top:1rem;" id="output-actions"></div>
        </div>`,
        'podcast-summarizer': dualPaneTool('Podcast Transcript', 'Paste the podcast transcript or notes...', 'Summary', [
            { label: 'Format', id: 'format', options: ['Key Points', 'Paragraph Summary', 'Bullet Notes'] }
        ]),
        // ===== BUSINESS TOOLS =====
        'resume-builder': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Build Your Resume</h3></div>
            <div class="tool-grid-2">
                <div class="tool-input-section">
                    <div class="input-group"><label class="input-label">Full Name</label><input class="input-field" id="resume-name" placeholder="John Doe"></div>
                    <div class="input-group"><label class="input-label">Job Title</label><input class="input-field" id="resume-title" placeholder="Software Engineer"></div>
                    <div class="input-group"><label class="input-label">Email</label><input class="input-field" id="resume-email" placeholder="john@example.com"></div>
                    <div class="input-group"><label class="input-label">Phone</label><input class="input-field" id="resume-phone" placeholder="+1 234 567 890"></div>
                    <div class="input-group"><label class="input-label">Professional Summary</label><textarea class="input-field" id="resume-summary" rows="3" placeholder="Brief description of your experience and skills..."></textarea></div>
                    <div class="input-group"><label class="input-label">Skills (comma separated)</label><input class="input-field" id="resume-skills" placeholder="JavaScript, React, Node.js, Python"></div>
                    <div class="input-group"><label class="input-label">Experience</label><textarea class="input-field" id="resume-exp" rows="4" placeholder="Company | Role | Duration\n- Achievement 1\n- Achievement 2"></textarea></div>
                    <div class="input-group"><label class="input-label">Education</label><textarea class="input-field" id="resume-edu" rows="3" placeholder="University | Degree | Year"></textarea></div>
                    <button class="btn btn-primary" onclick="window.toolGenerate()">📄 Generate Resume</button>
                </div>
                <div class="tool-output-section">
                    <div class="resume-preview" id="tool-output"><div class="tool-output-empty" style="color:#666;"><span class="empty-icon">📄</span><p>Your resume preview will appear here</p></div></div>
                    <div class="tool-actions" id="output-actions"></div>
                </div>
            </div>
        </div>`,
        'cover-letter': textTool('Job Description', 'Paste the job description or describe the role...', 'Generate a tailored cover letter', [
            { label: 'Your Experience', id: 'experience', options: ['Entry Level', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'] }
        ]),
        'business-name': textTool('Business Description', 'e.g., An eco-friendly clothing brand for young professionals', 'Generate creative business names', [
            { label: 'Style', id: 'style', options: ['Modern', 'Classic', 'Techy', 'Fun', 'Professional'] },
            { label: 'Count', id: 'count', options: ['5 Names', '10 Names', '20 Names'] }
        ]),
        'slogan-generator': textTool('Brand/Product', 'e.g., NexusAI - a platform of free AI tools', 'Generate catchy slogans', [
            { label: 'Tone', id: 'tone', options: ['Inspiring', 'Funny', 'Professional', 'Bold', 'Minimal'] }
        ]),
        'invoice-generator': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Create Invoice</h3></div>
            <div class="tool-grid-2">
                <div class="tool-input-section">
                    <div class="input-group"><label class="input-label">Your Business Name</label><input class="input-field" id="inv-from" placeholder="Your Company"></div>
                    <div class="input-group"><label class="input-label">Client Name</label><input class="input-field" id="inv-to" placeholder="Client Company"></div>
                    <div class="input-group"><label class="input-label">Invoice Number</label><input class="input-field" id="inv-num" placeholder="INV-001"></div>
                    <div class="input-group"><label class="input-label">Date</label><input type="date" class="input-field" id="inv-date"></div>
                    <div class="input-group"><label class="input-label">Items (one per line: Description | Qty | Price)</label><textarea class="input-field" id="inv-items" rows="4" placeholder="Web Design | 1 | 500\nSEO Setup | 1 | 300\nHosting (monthly) | 12 | 10"></textarea></div>
                    <button class="btn btn-primary" onclick="window.toolGenerate()">🧾 Generate Invoice</button>
                </div>
                <div class="tool-output-section">
                    <div class="invoice-preview" id="tool-output"><div class="tool-output-empty" style="color:#666;"><span class="empty-icon">🧾</span><p>Invoice preview will appear here</p></div></div>
                    <div class="tool-actions" id="output-actions"></div>
                </div>
            </div>
        </div>`,
        // ===== MARKETING TOOLS =====
        'seo-meta': textTool('Page Topic / URL', 'e.g., Best AI tools for content creation in 2026', 'Generate SEO meta tags', [
            { label: 'Type', id: 'type', options: ['Blog Post', 'Product Page', 'Landing Page', 'Service Page'] }
        ]),
        'hashtag-generator': textTool('Topic / Post Content', 'e.g., New launch of eco-friendly water bottles', 'Generate hashtags', [
            { label: 'Platform', id: 'platform', options: ['Instagram', 'Twitter/X', 'TikTok', 'LinkedIn', 'All Platforms'] },
            { label: 'Count', id: 'count', options: ['10 Hashtags', '20 Hashtags', '30 Hashtags'] }
        ]),
        'ad-copy': textTool('Product/Service', 'e.g., Online project management tool for remote teams', 'Generate ad copy', [
            { label: 'Platform', id: 'platform', options: ['Facebook/Meta', 'Google Ads', 'Instagram', 'LinkedIn', 'Twitter/X'] },
            { label: 'Goal', id: 'goal', options: ['Brand Awareness', 'Lead Generation', 'Sales', 'App Install'] }
        ]),
        'social-post': textTool('Topic / Message', 'e.g., We just launched our new AI-powered design tool!', 'Create social media posts', [
            { label: 'Platform', id: 'platform', options: ['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook', 'TikTok'] },
            { label: 'Tone', id: 'tone', options: ['Professional', 'Casual', 'Enthusiastic', 'Informative'] }
        ]),
        'product-desc': textTool('Product Name & Details', 'e.g., EcoBottle - Reusable stainless steel water bottle, 750ml, keeps drinks cold 24hrs', 'Write product description', [
            { label: 'Platform', id: 'platform', options: ['Amazon', 'Shopify', 'General E-commerce', 'Etsy'] },
            { label: 'Length', id: 'length', options: ['Short (50 words)', 'Medium (150 words)', 'Long (300 words)'] }
        ]),
        // ===== UTILITY TOOLS =====
        'code-generator': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Generate Code</h3></div>
            <div class="input-group" style="margin-bottom:1.5rem;">
                <label class="input-label">Describe what you want to build</label>
                <textarea class="input-field" id="tool-input" rows="4" placeholder="e.g., A Python function that sorts a list of dictionaries by a given key..."></textarea>
            </div>
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Language</label>
                    <select class="input-field" id="code-lang"><option>JavaScript</option><option>Python</option><option>HTML/CSS</option><option>Java</option><option>C++</option><option>SQL</option><option>PHP</option><option>TypeScript</option></select>
                </div>
            </div>
            <button class="btn btn-primary" onclick="window.toolGenerate()">💻 Generate Code</button>
            <div class="tool-output" id="tool-output" style="margin-top:1.5rem;font-family:var(--font-mono);font-size:var(--text-sm);background:#0d1117;">
                <div class="tool-output-empty"><span class="empty-icon">💻</span><p>Generated code will appear here</p></div>
            </div>
            <div class="tool-actions" style="margin-top:1rem;" id="output-actions"></div>
        </div>`,
        'translator': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Translate Text</h3></div>
            <div class="tool-grid-2">
                <div class="tool-input-section">
                    <div style="display:flex;gap:1rem;margin-bottom:1rem;">
                        <div class="input-group" style="flex:1;">
                            <label class="input-label">From</label>
                            <select class="input-field" id="lang-from"><option>English</option><option>Spanish</option><option>French</option><option>German</option><option>Italian</option><option>Portuguese</option><option>Chinese</option><option>Japanese</option><option>Korean</option><option>Hindi</option><option>Arabic</option><option>Russian</option></select>
                        </div>
                        <div style="display:flex;align-items:flex-end;padding-bottom:8px;"><button class="btn btn-ghost" onclick="window.swapLangs()">⇄</button></div>
                        <div class="input-group" style="flex:1;">
                            <label class="input-label">To</label>
                            <select class="input-field" id="lang-to"><option>Spanish</option><option>English</option><option>French</option><option>German</option><option>Italian</option><option>Portuguese</option><option>Chinese</option><option>Japanese</option><option>Korean</option><option>Hindi</option><option>Arabic</option><option>Russian</option></select>
                        </div>
                    </div>
                    <textarea class="input-field" id="tool-input" rows="6" placeholder="Enter text to translate..."></textarea>
                    <button class="btn btn-primary" onclick="window.toolGenerate()" style="margin-top:1rem;">🌐 Translate</button>
                </div>
                <div class="tool-output-section">
                    <div class="tool-output" id="tool-output" style="min-height:230px;">
                        <div class="tool-output-empty"><span class="empty-icon">🌐</span><p>Translation will appear here</p></div>
                    </div>
                    <div class="tool-actions" id="output-actions"></div>
                </div>
            </div>
        </div>`,
        'color-palette': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Generate Color Palette</h3><button class="btn btn-primary" onclick="window.toolGenerate()">🎨 Generate New Palette</button></div>
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Mood</label>
                    <select class="input-field" id="palette-mood"><option>Random</option><option>Warm</option><option>Cool</option><option>Pastel</option><option>Vibrant</option><option>Earthy</option><option>Neon</option><option>Monochrome</option></select>
                </div>
                <div class="input-group" style="flex:1;min-width:150px;">
                    <label class="input-label">Colors</label>
                    <select class="input-field" id="palette-count"><option>5</option><option>3</option><option>4</option><option>6</option><option>8</option></select>
                </div>
            </div>
            <div class="color-grid" id="tool-output">
                <div class="tool-output-empty" style="grid-column:1/-1;"><span class="empty-icon">🎨</span><p>Click "Generate" to create a palette</p></div>
            </div>
        </div>`,
        'qr-code': `
        <div class="tool-workspace">
            <div class="tool-workspace-header"><h3 class="tool-workspace-title">Create QR Code</h3></div>
            <div class="tool-grid-2">
                <div class="tool-input-section">
                    <div class="input-group"><label class="input-label">Content Type</label><select class="input-field" id="qr-type"><option>URL</option><option>Text</option><option>Email</option><option>WiFi</option><option>Phone</option></select></div>
                    <div class="input-group"><label class="input-label">Content</label><input class="input-field" id="tool-input" placeholder="https://example.com"></div>
                    <div class="input-group"><label class="input-label">Foreground Color</label><input type="color" class="input-field" id="qr-fg" value="#000000" style="height:48px;padding:4px;"></div>
                    <div class="input-group"><label class="input-label">Background Color</label><input type="color" class="input-field" id="qr-bg" value="#ffffff" style="height:48px;padding:4px;"></div>
                    <button class="btn btn-primary" onclick="window.toolGenerate()">📱 Generate QR Code</button>
                </div>
                <div class="tool-output-section">
                    <div class="qr-output" id="tool-output"><div class="tool-output-empty"><span class="empty-icon">📱</span><p>QR code will appear here</p></div></div>
                    <div class="tool-actions" id="output-actions"></div>
                </div>
            </div>
        </div>`,
        'placeholder-text': textTool('Topic / Style', 'e.g., Technology, Medieval, Space Exploration', 'Generate placeholder text', [
            { label: 'Paragraphs', id: 'paragraphs', options: ['1', '2', '3', '5', '10'] },
            { label: 'Style', id: 'style', options: ['Professional', 'Casual', 'Technical', 'Creative', 'Lorem Ipsum'] }
        ]),
    };
    return uis[slug] || defaultToolUI(slug);
}

// Template: Simple text input → output
function textTool(inputLabel, placeholder, actionText, selects) {
    return `
    <div class="tool-workspace">
        <div class="tool-workspace-header"><h3 class="tool-workspace-title">${actionText}</h3></div>
        <div class="input-group" style="margin-bottom:1.5rem;">
            <label class="input-label">${inputLabel}</label>
            <textarea class="input-field" id="tool-input" rows="4" placeholder="${placeholder}"></textarea>
        </div>
        ${selects.length ? `<div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
            ${selects.map(s => `<div class="input-group" style="flex:1;min-width:150px;"><label class="input-label">${s.label}</label><select class="input-field" id="${s.id}">${s.options.map(o => `<option>${o}</option>`).join('')}</select></div>`).join('')}
        </div>` : ''}
        <button class="btn btn-primary" onclick="window.toolGenerate()">✨ Generate</button>
        <div class="tool-output" id="tool-output" style="margin-top:1.5rem;">
            <div class="tool-output-empty"><span class="empty-icon">✨</span><p>Results will appear here</p></div>
        </div>
        <div class="tool-actions" style="margin-top:1rem;" id="output-actions"></div>
    </div>`;
}

// Template: Dual pane (input left, output right)
function dualPaneTool(inputLabel, placeholder, outputLabel, selects) {
    return `
    <div class="tool-workspace">
        <div class="tool-workspace-header"><h3 class="tool-workspace-title">${outputLabel}</h3></div>
        ${selects.length ? `<div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
            ${selects.map(s => `<div class="input-group" style="flex:1;min-width:150px;"><label class="input-label">${s.label}</label><select class="input-field" id="${s.id}">${s.options.map(o => `<option>${o}</option>`).join('')}</select></div>`).join('')}
        </div>` : ''}
        <div class="tool-grid-2">
            <div class="tool-input-section">
                <label class="input-label">${inputLabel}</label>
                <textarea class="input-field" id="tool-input" rows="8" placeholder="${placeholder}" style="flex:1;min-height:200px;"></textarea>
                <button class="btn btn-primary" onclick="window.toolGenerate()">✨ Process</button>
            </div>
            <div class="tool-output-section">
                <label class="input-label">${outputLabel}</label>
                <div class="tool-output" id="tool-output" style="flex:1;min-height:200px;">
                    <div class="tool-output-empty"><span class="empty-icon">✨</span><p>Output will appear here</p></div>
                </div>
                <div class="tool-actions" id="output-actions"></div>
            </div>
        </div>
    </div>`;
}

// Template: File upload tool
function uploadTool(label, icon, emptyText, btnText, selects) {
    return `
    <div class="tool-workspace">
        <div class="tool-workspace-header"><h3 class="tool-workspace-title">${label}</h3></div>
        <div class="tool-grid-2">
            <div class="tool-input-section">
                <div style="border:2px dashed var(--border-medium);border-radius:var(--radius-lg);padding:3rem;text-align:center;cursor:pointer;" onclick="document.getElementById('file-input').click()">
                    <div style="font-size:48px;margin-bottom:1rem;">📤</div>
                    <p>Click or drag an image here</p>
                    <input type="file" id="file-input" accept="image/*" style="display:none;">
                </div>
                <canvas id="source-canvas" style="display:none;max-width:100%;border-radius:var(--radius-lg);margin-top:1rem;"></canvas>
                ${selects.map(s => `<div class="input-group"><label class="input-label">${s.label}</label><select class="input-field" id="${s.id}">${s.options.map(o => `<option>${o}</option>`).join('')}</select></div>`).join('')}
                <button class="btn btn-primary" id="tool-generate" onclick="window.toolGenerate()">${btnText}</button>
            </div>
            <div class="tool-output-section">
                <div class="tool-output" id="tool-output">
                    <div class="tool-output-empty"><span class="empty-icon">${icon}</span><p>${emptyText}</p></div>
                </div>
            </div>
        </div>
    </div>`;
}

function defaultToolUI(slug) {
    return textTool('Your Input', 'Enter your content here...', 'Generate with AI', []);
}
