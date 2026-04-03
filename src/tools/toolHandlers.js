// NexusAI — Tool Handlers (Live Backend integration & browser-native fallbacks)
export function initTool(slug) {
    const handlers = {
        'article-writer': handleArticleWriter,
        'paraphraser': handleParaphraser,
        'grammar-checker': handleGrammarChecker,
        'email-writer': handleEmailWriter,
        'summarizer': handleSummarizer,
        'image-generator': handleImageGenerator,
        'bg-remover': handleBgRemover,
        'image-upscaler': handleImageUpscaler,
        'logo-maker': handleLogoMaker,
        'style-transfer': handleStyleTransfer,
        'video-script': handleVideoScript,
        'subtitle-generator': handleSubtitleGen,
        'text-to-speech': handleTTS,
        'audio-transcriber': handleTranscriber,
        'podcast-summarizer': handlePodcastSummarizer,
        'resume-builder': handleResumeBuilder,
        'cover-letter': handleCoverLetter,
        'business-name': handleBusinessName,
        'slogan-generator': handleSloganGen,
        'invoice-generator': handleInvoiceGen,
        'seo-meta': handleSeoMeta,
        'hashtag-generator': handleHashtagGen,
        'ad-copy': handleAdCopy,
        'social-post': handleSocialPost,
        'product-desc': handleProductDesc,
        'code-generator': handleCodeGen,
        'translator': handleTranslator,
        'color-palette': handleColorPalette,
        'qr-code': handleQRCode,
        'placeholder-text': handlePlaceholderText,
        'pdf-editor': handlePdfEditor,
    };
    if (handlers[slug]) handlers[slug]();
    initFileUploads();
}

function initFileUploads() {
    const fi = document.getElementById('file-input');
    if (fi) {
        fi.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            // Provide raw file access for new tools like PDF Editor
            window._uploadedFileRaw = file;

            // Handle image rendering for image tools
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = ev => {
                    const img = new Image();
                    img.onload = () => {
                        const c = document.getElementById('source-canvas');
                        if (c) { c.style.display = 'block'; c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); }
                        window._uploadedImg = img;
                        const btn = document.getElementById('tool-generate');
                        if (btn) btn.style.display = '';
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                const btn = document.getElementById('tool-generate');
                if (btn) btn.style.display = '';
            }
        });
    }
}

function showOutput(html, withCopy = true) {
    const out = document.getElementById('tool-output');
    if (out) out.innerHTML = html;
    const actions = document.getElementById('output-actions');
    if (actions && withCopy) actions.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="copyToClipboard(document.getElementById('tool-output').innerText)">📋 Copy</button>`;
}

function typeOutput(text) {
    const out = document.getElementById('tool-output');
    if (!out) return;
    out.innerHTML = '';
    let i = 0;
    const timer = setInterval(() => {
        out.textContent += text[i]; i++;
        if (i >= text.length) {
            clearInterval(timer);
            const actions = document.getElementById('output-actions');
            if (actions) actions.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="copyToClipboard(document.getElementById('tool-output').innerText)">📋 Copy</button>`;
        }
    }, 8);
}

function getInput() { return document.getElementById('tool-input')?.value?.trim() || ''; }
function getVal(id) { return document.getElementById(id)?.value || ''; }

function escapeHtml(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function simulate(cb) {
    const out = document.getElementById('tool-output');
    if (out) out.innerHTML = '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';
    setTimeout(cb, 600 + Math.random() * 400);
}

// 🌐 UNIVERSAL AI BACKEND FETCHER
async function callAIBackend(systemPrompt, userPrompt, useTyping = true) {
    const out = document.getElementById('tool-output');
    if (out) out.innerHTML = '<div style="text-align:center;padding:2rem;"><div class="spinner spinner-lg" style="margin:0 auto 1rem;"></div><p style="color:var(--text-muted);font-size:var(--text-sm);">Generating...</p></div>';
    
    try {
        const res = await fetch('/api/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ systemPrompt, userPrompt })
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server returned ${res.status}: ${errorText}`);
        }
        
        const data = await res.json();
        const text = data.result || JSON.stringify(data);
        
        if (useTyping) typeOutput(text);
        else showOutput(`<div style="white-space:pre-wrap;">${escapeHtml(text)}</div>`);
    } catch (err) {
        console.error('AI Error:', err);
        showOutput(`<div style="color:var(--accent-danger);"><p>⚠️ Connection Error</p><p style="font-size:var(--text-sm);margin-top:0.5rem;">${err.message}</p></div>`);
    }
}

// ===== WRITING TOOLS =====
function handleArticleWriter() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Please enter a topic', 'error');
        const tone = getVal('tone'), length = getVal('length');
        const sys = `You are an expert article writer. Tone: ${tone}. Length requirement: ${length}. Write a comprehensive article with a title, subheadings, and a conclusion.`;
        callAIBackend(sys, `Write a comprehensive article about: "${topic}"`);
    };
}

function handleParaphraser() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Please enter text', 'error');
        const style = getVal('style');
        const sys = `You are a professional paraphrasing AI. Rewrite the user's text accurately but clearly using a "${style}" style. Only output the rewritten text.`;
        callAIBackend(sys, `Please rewrite this text:\n\n${text}`);
    };
}

function handleGrammarChecker() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Please enter text', 'error');
        const sys = `You are an advanced grammar and spelling correction AI. Fix any errors in the provided text. Never change the underlying meaning. Output only the corrected text.`;
        callAIBackend(sys, `Fix the grammar and spelling in this text:\n\n${text}`);
    };
}

function handleEmailWriter() {
    window.toolGenerate = () => {
        const purpose = getInput(); if (!purpose) return showToast('Please enter email purpose', 'error');
        const tone = getVal('tone'), type = getVal('type');
        const sys = `You are an expert email copywriter. Write a highly effective ${type} email. Tone: ${tone}. Include a descriptive Subject Line at the top. Use [Bracket] placeholders for missing info.`;
        callAIBackend(sys, `Write an email regarding: "${purpose}"`);
    };
}

function handleSummarizer() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Please enter text', 'error');
        const length = getVal('length');
        const sys = `You are an expert summarizer. Provide a ${length} summary of the provided text. Focus heavily on retaining core facts and concepts.`;
        callAIBackend(sys, `Summarize this text:\n\n${text}`);
    };
}

// ===== VIDEO/AUDIO TOOLS =====
function handleVideoScript() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter a topic', 'error');
        const platform = getVal('platform'), duration = getVal('duration');
        const sys = `You are an expert video scriptwriter specializing in ${platform} content. Write a highly engaging script for a ${duration} video. Provide scene descriptions, timings, hook, and outro.`;
        callAIBackend(sys, `Write a video script about: "${topic}"`);
    };
}

function handlePodcastSummarizer() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Paste transcript', 'error');
        const format = getVal('format');
        const sys = `You are an expert podcast analyst. Extract the core value propositions, arguments, and insights from the user's transcript. Format the output exactly as ${format}.`;
        callAIBackend(sys, `Analyze this podcast transcript:\n\n${text}`);
    };
}

// Subtitles, TTS, Transcriber remain fully clientside (using Canvas/Web APIs)
function handleSubtitleGen() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Enter text', 'error');
        const format = getVal('sub-format'), wordsPerSub = getVal('sub-words').includes('5') ? 6 : getVal('sub-words').includes('12') ? 13 : 9;
        simulate(() => {
            const words = text.split(/\s+/); let subs = [], current = [], time = 0;
            words.forEach(w => { current.push(w); if (current.length >= wordsPerSub) { subs.push({ start: time, end: time + 2.5, text: current.join(' ') }); time += 2.7; current = []; }});
            if (current.length) subs.push({ start: time, end: time + 2.5, text: current.join(' ') });
            const fmt = t => { const m = Math.floor(t/60), s = Math.floor(t%60), ms = Math.floor((t%1)*1000); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(ms).padStart(3,'0')}`; };
            let output = '';
            if (format === 'SRT') subs.forEach((s,i) => { output += `${i+1}\n${fmt(s.start).replace(':','.')} --> ${fmt(s.end).replace(':','.')}\n${s.text}\n\n`; });
            else if (format === 'VTT') { output = 'WEBVTT\n\n'; subs.forEach(s => { output += `${fmt(s.start)} --> ${fmt(s.end)}\n${s.text}\n\n`; }); }
            else subs.forEach(s => { output += `[${fmt(s.start)}] ${s.text}\n`; });
            typeOutput(output);
        });
    };
}
function handleTTS() {
    const voiceSelect = document.getElementById('tts-voice');
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        if (voiceSelect && voices.length) {
            voiceSelect.innerHTML = voices.map((v,i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join('');
        }
    }
    loadVoices(); speechSynthesis.onvoiceschanged = loadVoices;
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Enter text', 'error');
        speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        const idx = parseInt(voiceSelect?.value || '0');
        if (voices[idx]) utter.voice = voices[idx];
        utter.rate = parseFloat(document.getElementById('tts-rate')?.value || 1);
        utter.pitch = parseFloat(document.getElementById('tts-pitch')?.value || 1);
        utter.onstart = () => showOutput('<div style="text-align:center;padding:2rem;"><div class="spinner spinner-lg" style="margin:0 auto 1rem;"></div><p>Speaking...</p></div>', false);
        utter.onend = () => showOutput('<div style="text-align:center;padding:2rem;font-size:48px;">✅</div><p style="text-align:center;">Speech complete!</p>', false);
        speechSynthesis.speak(utter);
    };
}
function handleTranscriber() {
    window.toolGenerate = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return showToast('Speech recognition not supported in this browser', 'error');
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
        let transcript = '';
        recognition.onresult = (e) => {
            transcript = '';
            for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript + ' ';
            showOutput(`<div style="line-height:2;">${transcript}</div>`, true);
        };
        recognition.onstart = () => {
            document.getElementById('record-btn').style.display = 'none';
            document.getElementById('stop-btn').style.display = '';
            showOutput('<div style="text-align:center;padding:2rem;"><div class="spinner spinner-lg" style="margin:0 auto 1rem;border-top-color:var(--accent-danger);"></div><p style="color:var(--accent-danger);">🔴 Recording... Speak now</p></div>', false);
        };
        recognition.onend = () => {
            document.getElementById('record-btn').style.display = '';
            document.getElementById('stop-btn').style.display = 'none';
        };
        window.stopRecording = () => recognition.stop();
        recognition.start();
    };
}

// ===== BUSINESS TOOLS =====
function handleBusinessName() {
    window.toolGenerate = () => {
        const desc = getInput(); if (!desc) return showToast('Describe your business', 'error');
        const style = getVal('style'), count = parseInt(getVal('count')) || 10;
        const sys = `You are a brilliant branding strategist. Generate exactly ${count} highly memorable business names based on the user's description. The style should be: "${style}". Return them as a numbered list.`;
        callAIBackend(sys, `Provide business names for: ${desc}`);
    };
}

function handleSloganGen() {
    window.toolGenerate = () => {
        const brand = getInput(); if (!brand) return showToast('Enter brand info', 'error');
        const tone = getVal('tone');
        const sys = `You are a master copywriter. Create 10 impactful, snappy slogans or taglines for the user's brand. The tone should be: "${tone}". Output a numbered list.`;
        callAIBackend(sys, `Provide slogans for: "${brand}"`);
    };
}

function handleCoverLetter() {
    window.toolGenerate = () => {
        const jd = getInput(); if (!jd) return showToast('Enter job description', 'error');
        const exp = getVal('experience');
        const sys = `You are an expert career coach helping a client secure an interview. Write a compelling, highly professional cover letter targeting the provided job description. Focus on their "${exp}" of experience. Format with standard letter spacing and placeholders [Like This].`;
        callAIBackend(sys, `Write a cover letter for this job description:\n\n${jd}`);
    };
}

// ===== MARKETING TOOLS =====
function handleSeoMeta() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter topic', 'error');
        const sys = `You are an SEO wizard. Provide a complete SEO package for the requested topic. Your response must include: exactly 1 highly clickable SEO Title (under 60 chars), 1 optimized Meta Description (under 155 chars), an expert URL slug suggestion, and 5 LSI keywords.`;
        callAIBackend(sys, `Generate SEO Meta details for the phrase: "${topic}"`);
    };
}

function handleHashtagGen() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter topic', 'error');
        const count = parseInt(getVal('count')) || 20;
        const sys = `You are a social media growth expert. Generate exactly ${count} highly effective hashtags related to the topic. Output only the hashtags separated by spaces, with nothing else.`;
        callAIBackend(sys, `Topic: "${topic}"`);
    };
}

function handleAdCopy() {
    window.toolGenerate = () => {
        const product = getInput(); if (!product) return showToast('Enter product info', 'error');
        const platform = getVal('platform'), goal = getVal('goal');
        const sys = `You are an elite performance marketer. Write high-converting ad copy for ${platform}. The main objective is ${goal}. Provide 3 alternative hooks/headlines, followed by the main creative body text and a clear CTA.`;
        callAIBackend(sys, `Write an ad for: "${product}"`);
    };
}

function handleSocialPost() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter topic', 'error');
        const platform = getVal('platform'), tone = getVal('tone');
        const sys = `You are a social media manager. Write an engaging post optimized perfectly for the ${platform} algorithm. The tone should be ${tone}. Include emojis and relevant hashtags if appropriate for the platform.`;
        callAIBackend(sys, `Topic: "${topic}"`);
    };
}

function handleProductDesc() {
    window.toolGenerate = () => {
        const product = getInput(); if (!product) return showToast('Enter product details', 'error');
        const platform = getVal('platform');
        const sys = `You are an expert e-commerce copywriter. Write an optimized product description explicitly suited for ${platform}. Format with a catchy title, a persuasive paragraph, and bullet points highlighting features/benefits.`;
        callAIBackend(sys, `Product Details: "${product}"`);
    };
}

// ===== UTILITY TOOLS =====
function handleCodeGen() {
    window.toolGenerate = () => {
        const desc = getInput(); if (!desc) return showToast('Describe what to build', 'error');
        const lang = getVal('code-lang');
        const sys = `You are a Senior Software Engineer. The user will ask you to write code in ${lang}. Provide strictly the working, optimized code. Include minimal comments explaining complex parts. Use markdown code blocks.`;
        callAIBackend(sys, `Write code for: ${desc}`, false); // Don't use typewriter effect for code
    };
}

function handleTranslator() {
    window.swapLangs = () => {
        const from = document.getElementById('lang-from'), to = document.getElementById('lang-to');
        const tmp = from.value; from.value = to.value; to.value = tmp;
    };
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Enter text', 'error');
        const from = getVal('lang-from'), to = getVal('lang-to');
        const sys = `You are a professional native translator. Translate the text from ${from} to ${to}. Provide ONLY the final translation, absolutely nothing else. Maintain the original tone perfectly.`;
        callAIBackend(sys, `Text: ${text}`);
    };
}

function handlePlaceholderText() {
    window.toolGenerate = () => {
        const topic = getInput() || 'Technology';
        const count = parseInt(getVal('paragraphs')) || 3;
        const style = getVal('style');
        if (style === 'Lorem Ipsum') {
            const sys = `You generate standard Lorem Ipsum dummy text. Return exactly ${count} paragraphs. Output only the latin dummy text.`;
            callAIBackend(sys, `Generate lorem ipsum.`);
        } else {
            const sys = `You are a placeholder text generator. Write exactly ${count} paragraphs of coherent, dummy filler text relating to the topic of "${topic}". DO NOT use latin. Output only the paragraphs.`;
            callAIBackend(sys, `Topic: ${topic}`);
        }
    };
}

// ===== PREMIUM RESUME BUILDER =====
function handleResumeBuilder() {
    window.toolGenerate = () => {
        // Redesigned Zety-Style A4 Premium Resume
        const name = document.getElementById('resume-name')?.value?.trim() || 'John Doe';
        const title = document.getElementById('resume-title')?.value || 'Professional';
        const email = document.getElementById('resume-email')?.value || 'email@example.com';
        const phone = document.getElementById('resume-phone')?.value || '555-0100';
        const summary = document.getElementById('resume-summary')?.value || 'A highly motivated individual with a passion for excellence.';
        const skills = document.getElementById('resume-skills')?.value || 'Leadership, Communication, Management';
        const exp = document.getElementById('resume-exp')?.value || 'Senior Role - Company XYZ';
        const edu = document.getElementById('resume-edu')?.value || 'Bachelor of Science - University';
        
        simulatedPdfRender();
        
        function simulatedPdfRender() {
            showOutput(`
            <style>
                @media print {
                    body * { display: none !important; }
                    #resume-a4-canvas, #resume-a4-canvas * { display: block !important; }
                    #resume-a4-canvas { position: absolute; left: 0; top: 0; width: 100vw; margin: 0; padding: 40px; box-shadow: none; border-radius: 0; }
                }
                .resume-a4 {
                    background: #ffffff; width: 100%; max-width: 800px; margin: 0 auto;
                    aspect-ratio: 1 / 1.414; /* A4 Ratio */
                    padding: 40px 50px; font-family: 'Helvetica', 'Inter', sans-serif;
                    color: #2b2b35; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 4px;
                    display: flex; flex-direction: column; text-align: left;
                }
                .res-header { text-align: center; border-bottom: 2px solid #e0e0ea; padding-bottom: 20px; margin-bottom: 25px; }
                .res-name { font-size: 32px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #111; margin-bottom: 5px; }
                .res-title { font-size: 16px; font-weight: 600; color: var(--accent-primary-dark); text-transform: uppercase; letter-spacing: 1px; }
                .res-contact { display: flex; justify-content: center; gap: 15px; margin-top: 10px; font-size: 13px; color: #666; }
                .res-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 35px; }
                .res-section-title { font-size: 18px; font-weight: 700; color: #111; text-transform: uppercase; border-bottom: 2px solid #111; padding-bottom: 5px; margin-bottom: 15px; }
                .res-text { font-size: 13.5px; line-height: 1.6; color: #444; white-space: pre-wrap; }
                .res-skills { display: flex; flex-wrap: wrap; gap: 8px; }
                .res-skill-badge { font-size: 12px; font-weight: 600; background: #f0f0f5; padding: 4px 10px; border-radius: 4px; color: #333; }
            </style>
            
            <div id="resume-a4-canvas" class="resume-a4">
                <div class="res-header">
                    <div class="res-name">${escapeHtml(name)}</div>
                    <div class="res-title">${escapeHtml(title)}</div>
                    <div class="res-contact">
                        <span>✉️ ${escapeHtml(email)}</span>
                        <span>📱 ${escapeHtml(phone)}</span>
                    </div>
                </div>
                
                <div class="res-grid">
                    <div class="res-main">
                        <div class="res-section-title">Professional Summary</div>
                        <div class="res-text" style="margin-bottom:25px;">${escapeHtml(summary)}</div>
                        
                        <div class="res-section-title">Experience</div>
                        <div class="res-text">${escapeHtml(exp)}</div>
                    </div>
                    
                    <div class="res-sidebar">
                        <div class="res-section-title">Education</div>
                        <div class="res-text" style="margin-bottom:25px;">${escapeHtml(edu)}</div>
                        
                        <div class="res-section-title">Skills</div>
                        <div class="res-skills">
                            ${skills.split(',').map(s => `<span class="res-skill-badge">${escapeHtml(s.trim())}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            `, false);
            
            document.getElementById('output-actions').innerHTML = `
                <button class="btn btn-primary" onclick="window.print()">📥 Download PDF</button>
            `;
        }
    };
}

// ===== PREMIUM IMAGE GENERATOR =====
function handleImageGenerator() {
    window.toolGenerate = async () => {
        const prompt = getInput(); if (!prompt) return showToast('Please describe your image', 'error');
        const style = getVal('img-style');
        const aspect = getVal('aspect');
        const negative = getVal('negative-prompt');
        
        let width = 1024, height = 1024;
        if (aspect === '16:9') { width = 1024; height = 576; }
        if (aspect === '9:16') { width = 576; height = 1024; }

        const fullPrompt = `${prompt}, ${style} style`;
        
        document.getElementById('tool-output').innerHTML = `
            <div style="text-align:center;padding:4rem 0;">
                <div class="spinner spinner-lg" style="margin:0 auto 1rem;"></div>
                <h3 style="color:white;font-weight:600;">Brewing Pixels...</h3>
                <p style="color:var(--text-muted);font-size:var(--text-sm);">Accessing High-Fidelity Diffusion Model.</p>
            </div>
        `;
        
        try {
            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: fullPrompt, negativePrompt: negative, width, height })
            });
            
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            
            const data = await res.json();
            
            showOutput(`
                <div class="image-premium-gallery" style="text-align:center;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:12px;padding:var(--space-md);position:relative;">
                    <img src="${data.image}" style="width:100%;object-fit:cover;border-radius:8px;aspect-ratio:${width}/${height};" alt="Generated by AI" />
                    <div style="margin-top:1rem;color:var(--text-secondary);font-size:var(--text-sm);">
                        Prompt: "${escapeHtml(prompt)}"
                    </div>
                </div>
            `, false);
            
            document.getElementById('output-actions').innerHTML = `
                <a href="${data.image}" download="nexusai-vision.png" class="btn btn-primary">💿 High-Res Download</a>
            `;
        } catch (error) {
            console.error('Image Generation Error:', error);
            showOutput(`
                <div style="text-align:center;color:var(--accent-danger);padding:2rem;">
                    <h3>Generation Failed</h3>
                    <p style="font-size:var(--text-sm);">${error.message}</p>
                    <p style="margin-top:1rem;font-size:var(--text-xs);color:var(--text-muted);">Ensure your HF_TOKEN has sufficient inference permissions.</p>
                </div>
            `, false);
        }
    };
}


// Maintain native tools (Canvas/Local Processing)
function handleBgRemover() {
    window.toolGenerate = () => {
        if (!window._uploadedImg) return showToast('Please upload an image', 'error');
        simulate(() => {
            const img = window._uploadedImg, canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < data.data.length; i += 4) {
                const r = data.data[i], g = data.data[i+1], b = data.data[i+2];
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
                if (brightness > 220 || (Math.abs(r-g) < 15 && Math.abs(g-b) < 15 && brightness > 180)) data.data[i+3] = 0;
            }
            ctx.putImageData(data, 0, 0);
            showOutput(`<div style="text-align:center;background:repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50%/20px 20px;padding:1rem;border-radius:12px;"><img src="${canvas.toDataURL('image/png')}" style="max-width:100%;"/></div>`, false);
            document.getElementById('output-actions').innerHTML = `<a href="${canvas.toDataURL('image/png')}" download="bg-removed.png" class="btn btn-secondary btn-sm">💾 Download PNG</a>`;
        });
    };
}

function handleImageUpscaler() {
    window.toolGenerate = () => {
        if (!window._uploadedImg) return showToast('Please upload an image', 'error');
        const scale = parseInt(getVal('scale')) || 2;
        simulate(() => {
            const img = window._uploadedImg, canvas = document.createElement('canvas');
            canvas.width = img.width * scale; canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            showOutput(`<div style="text-align:center;"><img src="${canvas.toDataURL()}" style="max-width:100%;border-radius:12px;"/><p style="margin-top:1rem;color:var(--text-muted);">${img.width}×${img.height} → ${canvas.width}×${canvas.height} (${scale}x)</p></div>`, false);
            document.getElementById('output-actions').innerHTML = `<a href="${canvas.toDataURL()}" download="upscaled.png" class="btn btn-secondary btn-sm">💾 Download</a>`;
        });
    };
}

function handleLogoMaker() {
    window.toolGenerate = () => {
        const name = document.getElementById('logo-name')?.value?.trim();
        if (!name) return showToast('Please enter a brand name', 'error');
        const tagline = document.getElementById('logo-tagline')?.value?.trim();
        const color = document.getElementById('logo-color')?.value || '#7c5cfc';
        const style = getVal('logo-style');
        simulate(() => {
            const shapes = ['border-radius:50%', 'border-radius:20%', 'border-radius:0;transform:rotate(45deg)', 'border-radius:50% 0 50% 0', 'clip-path:polygon(50% 0%,100% 100%,0% 100%)'];
            const shape = shapes[Math.abs([...name].reduce((a,c) => a + c.charCodeAt(0), 0)) % shapes.length];
            const initial = name.charAt(0).toUpperCase();
            showOutput(`
            <div class="logo-canvas">
                <div class="logo-shape" style="background:${color};${shape}">${style === 'Minimal' ? '' : initial}</div>
                <div class="logo-brand-name" style="color:${color}">${name}</div>
                ${tagline ? `<div style="color:var(--text-muted);font-size:var(--text-sm);letter-spacing:0.1em;text-transform:uppercase;">${tagline}</div>` : ''}
            </div>`, false);
        });
    };
}

function handleStyleTransfer() {
    window.toolGenerate = () => {
        if (!window._uploadedImg) return showToast('Please upload an image', 'error');
        const style = getVal('art-style');
        simulate(() => {
            const img = window._uploadedImg, canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            ctx.globalAlpha = 0.4;
            const filters = { 'Van Gogh': 'saturate(180%) contrast(120%)', 'Monet': 'saturate(130%) brightness(110%) blur(1px)', 'Picasso': 'contrast(150%) hue-rotate(30deg)', 'Pop Art': 'saturate(300%) contrast(150%)', 'Sketch': 'grayscale(100%) contrast(200%)', 'Watercolor': 'saturate(80%) brightness(120%) blur(0.5px)' };
            ctx.filter = filters[style] || 'none';
            ctx.drawImage(img, 0, 0);
            ctx.globalAlpha = 1; ctx.filter = 'none';
            showOutput(`<div style="text-align:center;"><img src="${canvas.toDataURL()}" style="max-width:100%;border-radius:12px;"/><p style="margin-top:1rem;color:var(--text-muted);">Style: ${style}</p></div>`, false);
        });
    };
}

function handleColorPalette() {
    window.toolGenerate = () => {
        const mood = getVal('palette-mood'), count = parseInt(getVal('palette-count')) || 5;
        const base = Math.random() * 360;
        const palettes = {
            Warm: () => Array.from({length: count}, (_, i) => `hsl(${(base + i * 15) % 60}, ${60 + i * 5}%, ${45 + i * 8}%)`),
            Cool: () => Array.from({length: count}, (_, i) => `hsl(${180 + (i * 20) % 80}, ${50 + i * 5}%, ${40 + i * 8}%)`),
            Pastel: () => Array.from({length: count}, (_, i) => `hsl(${(base + i * 60) % 360}, 60%, 80%)`),
            Vibrant: () => Array.from({length: count}, (_, i) => `hsl(${(base + i * 72) % 360}, 85%, 55%)`),
            Earthy: () => Array.from({length: count}, (_, i) => `hsl(${20 + i * 15}, ${30 + i * 5}%, ${35 + i * 10}%)`),
            Neon: () => Array.from({length: count}, (_, i) => `hsl(${(base + i * 60) % 360}, 100%, 60%)`),
            Monochrome: () => Array.from({length: count}, (_, i) => `hsl(${base}, 50%, ${20 + i * (60/count)}%)`),
        };
        const colors = (palettes[mood] || (() => Array.from({length: count}, (_, i) => `hsl(${(base + i * (360/count)) % 360}, 70%, 55%)`)))();
        const out = document.getElementById('tool-output');
        out.innerHTML = colors.map(c => `<div class="color-swatch" style="background:${c};" onclick="copyToClipboard('${c}')"><span class="color-swatch-label">${c}</span></div>`).join('');
        out.className = 'color-grid';
    };
    window.toolGenerate();
}

function handleQRCode() {
    window.toolGenerate = () => {
        const content = document.getElementById('tool-input')?.value?.trim();
        if (!content) return showToast('Enter content', 'error');
        const fg = document.getElementById('qr-fg')?.value || '#000000';
        const bg = document.getElementById('qr-bg')?.value || '#ffffff';
        simulate(() => {
            const canvas = document.createElement('canvas');
            const size = 300; canvas.width = size; canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
            const modules = 25, cellSize = size / modules;
            const hash = [...content].reduce((a, c, i) => a ^ (c.charCodeAt(0) << (i % 24)), 0);
            ctx.fillStyle = fg;
            const drawFinder = (x, y) => {
                ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
                ctx.fillStyle = bg;
                ctx.fillRect((x+1) * cellSize, (y+1) * cellSize, 5 * cellSize, 5 * cellSize);
                ctx.fillStyle = fg;
                ctx.fillRect((x+2) * cellSize, (y+2) * cellSize, 3 * cellSize, 3 * cellSize);
            };
            drawFinder(0, 0); drawFinder(modules - 7, 0); drawFinder(0, modules - 7);
            for (let y = 0; y < modules; y++) {
                for (let x = 0; x < modules; x++) {
                    if ((x < 8 && y < 8) || (x > modules-9 && y < 8) || (x < 8 && y > modules-9)) continue;
                    const charCode = content.charCodeAt((x + y * modules) % content.length);
                    if ((charCode ^ hash ^ (x * y)) % 3 === 0) {
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                }
            }
            const out = document.getElementById('tool-output');
            out.innerHTML = `<div style="text-align:center;"><canvas id="qr-canvas"></canvas><p style="margin-top:1rem;color:var(--text-muted);font-size:var(--text-sm);">${content.slice(0,50)}</p></div>`;
            const qc = document.getElementById('qr-canvas');
            qc.width = size; qc.height = size;
            qc.getContext('2d').drawImage(canvas, 0, 0);
            document.getElementById('output-actions').innerHTML = `<a href="${canvas.toDataURL()}" download="qrcode.png" class="btn btn-secondary btn-sm">💾 Download</a>`;
        });
    };
}

function handleInvoiceGen() {
    window.toolGenerate = () => {
        const from = document.getElementById('inv-from')?.value || 'Your Company';
        const to = document.getElementById('inv-to')?.value || 'Client';
        const num = document.getElementById('inv-num')?.value || 'INV-001';
        const date = document.getElementById('inv-date')?.value || new Date().toISOString().split('T')[0];
        const itemsRaw = document.getElementById('inv-items')?.value || '';
        simulate(() => {
            const items = itemsRaw.split('\n').filter(Boolean).map(line => {
                const parts = line.split('|').map(p => p.trim());
                return { desc: parts[0] || 'Item', qty: parseInt(parts[1]) || 1, price: parseFloat(parts[2]) || 0 };
            });
            const total = items.reduce((s, i) => s + i.qty * i.price, 0);
            
            showOutput(`
            <style>
                @media print {
                    body * { display: none !important; }
                    .invoice-preview, .invoice-preview * { display: block !important; }
                    .invoice-preview { position: absolute; left: 0; top: 0; width: 100vw; box-shadow: none; padding: 40px; }
                }
            </style>
            <div class="invoice-preview">
                <div style="display:flex;justify-content:space-between;margin-bottom:2rem;">
                    <div><h2 style="color:#7c5cfc;margin-bottom:4px;">INVOICE</h2><p style="color:#666;">${num}</p></div>
                    <div style="text-align:right;"><p style="font-weight:600;color:#333;">${from}</p><p style="color:#666;">Date: ${date}</p></div>
                </div>
                <p style="margin-bottom:1.5rem;"><strong>Bill To:</strong> ${to}</p>
                <table class="invoice-table"><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>${items.map(i => `<tr><td>${i.desc}</td><td>${i.qty}</td><td>$${i.price.toFixed(2)}</td><td>$${(i.qty * i.price).toFixed(2)}</td></tr>`).join('')}</tbody>
                <tfoot><tr><td colspan="3" style="text-align:right;font-weight:700;">Total:</td><td style="font-weight:700;color:#7c5cfc;">$${total.toFixed(2)}</td></tr></tfoot></table>
            </div>`, false);
            document.getElementById('output-actions').innerHTML = `<button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print / PDF</button>`;
        });
    };
}

// ===== BRAND NEW: VISUAL WYSIWYG PDF EDITOR =====
function handlePdfEditor() {
    // 1. Initialize pdf.js worker safely
    const pdfjs = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
    if (!pdfjs) {
        showToast("PDF Renderer not loaded from CDN.", "error");
        console.error("PDF.js global object missing.");
    } else {
        // Disable worker to prevent Cross-Origin SecurityErrors on GitHub Pages / Netlify
        pdfjs.GlobalWorkerOptions.workerSrc = '';
        pdfjs.disableWorker = true;
    }

    let pdfDoc = null;
    let pageNum = 1;
    let scale = 1.5;
    let currentViewport = null;

    // Attach File Upload Hook specifically for this tool
    const fi = document.getElementById('file-input');
    if (fi) {
        fi.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file || file.type !== 'application/pdf') return;
            
            document.getElementById('pdf-setup').style.display = 'none';
            document.getElementById('pdf-active-editor').style.display = 'flex';
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                window._pdfArrayBuffer = arrayBuffer; 
            
                if (!pdfjs) throw new Error("PDF.js library is missing.");
                
                pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                renderPage(pageNum);
            } catch (err) {
                console.error("Error loading PDF", err);
                showToast("Failed to load PDF via Viewer: " + err.message, "error");
            }
        });
    }

    async function renderPage(num) {
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas?.getContext('2d');
        if(!canvas) return;
        
        const page = await pdfDoc.getPage(num);
        currentViewport = page.getViewport({ scale: scale });
        
        canvas.height = currentViewport.height;
        canvas.width = currentViewport.width;
        
        const renderContext = { canvasContext: ctx, viewport: currentViewport };
        await page.render(renderContext).promise;
    }

    // Add Overlay Text
    window.addPdfText = () => {
        const overlay = document.getElementById('pdf-overlay');
        const wrapper = document.createElement('textarea');
        wrapper.className = 'pdf-text-node';
        wrapper.value = "New Text";
        wrapper.style.left = '50px';
        wrapper.style.top = '50px';
        wrapper.style.fontSize = document.getElementById('pdf-font-size').value + 'px';
        wrapper.style.color = document.getElementById('pdf-text-color').value;
        
        // Dragging Logic
        let isDragging = false, startX, startY, initialX, initialY;
        
        wrapper.addEventListener('mousedown', (e) => {
            // Prevent dragging from firing if the user is resizing the textarea via the bottom-right corner
            if (e.offsetX > wrapper.offsetWidth - 15 && e.offsetY > wrapper.offsetHeight - 15) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = parseInt(wrapper.style.left, 10);
            initialY = parseInt(wrapper.style.top, 10);
            wrapper.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            wrapper.style.left = (initialX + dx) + 'px';
            wrapper.style.top = (initialY + dy) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            if(isDragging) {
                isDragging = false;
                wrapper.style.cursor = 'grab';
            }
        });

        overlay.appendChild(wrapper);
        wrapper.focus();
    };

    // Compile & Download (Translating Coordinates)
    window.toolGenerate = async () => {
        const out = document.getElementById('tool-output');
        out.style.display = 'flex';
        out.innerHTML = '<div style="text-align:center;padding:2rem;"><div class="spinner spinner-lg"></div><p>Compiling visual layers into native PDF bytes...</p></div>';
        
        try {
            if (!window.PDFLib) throw new Error("pdf-lib not loaded");
            if (!window._pdfArrayBuffer) throw new Error("No PDF loaded");
            
            const pdfDocLib = await window.PDFLib.PDFDocument.load(window._pdfArrayBuffer);
            const pages = pdfDocLib.getPages();
            const firstPage = pages[0];
            
            const overlay = document.getElementById('pdf-overlay');
            const nodes = overlay.querySelectorAll('.pdf-text-node');
            
            for (let node of nodes) {
                const text = node.value;
                const cssLeft = parseInt(node.style.left, 10) || 0;
                const cssTop = parseInt(node.style.top, 10) || 0;
                const fontSize = parseInt(node.style.fontSize, 10) || 16;
                
                // Color Parsing
                let r = 0, g = 0, b = 0;
                let cStr = node.style.color || '#000000';
                if (cStr.startsWith('rgb')) {
                    const vals = cStr.match(/\\d+/g);
                    if (vals) { r = parseInt(vals[0])/255; g = parseInt(vals[1])/255; b = parseInt(vals[2])/255; }
                } else if (cStr.startsWith('#')) {
                    const match = cStr.match(/#([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})/i);
                    if(match) { r = parseInt(match[1], 16) / 255; g = parseInt(match[2], 16) / 255; b = parseInt(match[3], 16) / 255; }
                }

                // Coordinate Translation Mapper Native Math
                // Adjust cssTop down by ~80% of font size to account for text baseline bounding
                const baselineY = cssTop + (fontSize * 0.8);
                
                // Fallback mathematical matrix translation if convertToPdfPoint is missing in CDN version
                let pdfX, pdfY;
                if (currentViewport.convertToPdfPoint) {
                    [pdfX, pdfY] = currentViewport.convertToPdfPoint(cssLeft, baselineY);
                } else {
                    const transform = currentViewport.transform;
                    pdfX = (cssLeft - transform[4]) / transform[0];
                    pdfY = (baselineY - transform[5]) / transform[3];
                }
                
                // Scale map the DOM font size back to PDF Native Point Size 
                const nativeFontSize = fontSize / scale;

                firstPage.drawText(text, {
                    x: pdfX,
                    y: pdfY,
                    size: nativeFontSize,
                    font: await pdfDocLib.embedFont(window.PDFLib.StandardFonts.Helvetica),
                    color: window.PDFLib.rgb(r, g, b),
                });
            }
            
            const pdfBytes = await pdfDocLib.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const docUrl = URL.createObjectURL(blob);
            
            out.innerHTML = `
                <div style="text-align:center;padding:2rem;">
                    <div style="font-size:48px;margin-bottom:1rem;">✅</div>
                    <h3 style="color:#111;">PDF Compiled Successfully</h3>
                </div>
            `;
            
            document.getElementById('output-actions').innerHTML = `
                <a href="\${docUrl}" download="nexusai-edited.pdf" class="btn btn-primary" style="margin-top:1rem;background:#10b981;border:none;">💿 Download Compiled PDF</a>
            `;
            
        } catch (error) {
            console.error('Compiler Error:', error);
            out.innerHTML = \`<p style="color:var(--accent-danger);">Compiler Error: \${error.message}</p>\`;
        }
    };
}
