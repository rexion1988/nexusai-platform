// NexusAI — Tool Handlers (client-side AI simulation for all 30 tools)
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
            const reader = new FileReader();
            reader.onload = ev => {
                const img = new Image();
                img.onload = () => {
                    const c = document.getElementById('source-canvas');
                    if (c) { c.style.display = 'block'; c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); }
                    const btn = document.getElementById('tool-generate');
                    if (btn) btn.style.display = '';
                    window._uploadedImg = img;
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
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

function simulate(cb) {
    const out = document.getElementById('tool-output');
    if (out) out.innerHTML = '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';
    setTimeout(cb, 600 + Math.random() * 400);
}

async function callAIBackend(systemPrompt, userPrompt, useTyping = true) {
    const out = document.getElementById('tool-output');
    if (out) out.innerHTML = '<div style="text-align:center;padding:2rem;"><div class="spinner spinner-lg" style="margin:0 auto 1rem;"></div><p style="color:var(--text-muted);font-size:var(--text-sm);">Thinking...</p></div>';
    
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
        else showOutput(`<div style="white-space:pre-wrap;">${text}</div>`);
    } catch (err) {
        console.error('AI Error:', err);
        showOutput(`<div style="color:var(--accent-danger);"><p>⚠️ Connection Error</p><p style="font-size:var(--text-sm);margin-top:0.5rem;">${err.message}</p></div>`);
    }
}

// ===== WRITING =====
function handleArticleWriter() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Please enter a topic', 'error');
        const tone = getVal('tone'), length = getVal('length');
        
        const systemPrompt = `You are an expert article writer. Your task is to write an engaging, well-structured article. Tone: ${tone}. Length requirement: ${length}. Ensure the article has a clear intro, body paragraphs, and a conclusion.`;
        
        callAIBackend(systemPrompt, `Write a comprehensive article about: "${topic}"`);
    };
}

function generateArticle(topic, tone, length) {
    const wordCount = length.includes('Short') ? 300 : length.includes('Long') ? 1000 : 600;
    const intro = `# ${topic}\n\n${tone === 'Academic' ? 'This paper examines' : tone === 'Casual' ? "Let's dive into" : 'In this comprehensive guide, we explore'} the fascinating world of ${topic.toLowerCase()}. ${tone === 'Casual' ? "Trust me, you'll want to read this!" : 'This article provides valuable insights and actionable information.'}\n\n`;
    const sections = ['Understanding the Basics', 'Key Benefits and Advantages', 'Practical Applications', 'Best Practices', 'Future Outlook'];
    let body = '';
    sections.forEach((s, i) => {
        body += `## ${i+1}. ${s}\n\n`;
        body += `${topic} has significantly impacted how we approach ${s.toLowerCase()}. `;
        body += `Research shows that implementing effective strategies in this area can lead to remarkable improvements. `;
        body += `Organizations and individuals who embrace these concepts often see substantial benefits including increased efficiency, better outcomes, and greater satisfaction.\n\n`;
        if (wordCount > 500) body += `Furthermore, experts in the field recommend a systematic approach to ${s.toLowerCase()}. By following proven methodologies and staying updated with the latest developments, one can achieve optimal results.\n\n`;
    });
    body += `## Conclusion\n\n${topic} continues to evolve and shape our future. By understanding and applying the principles discussed in this article, you can stay ahead of the curve and make informed decisions. The key is to start implementing these strategies today and continuously adapt to new developments in the field.\n`;
    return intro + body;
}

function handleParaphraser() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Please enter text', 'error');
        simulate(() => typeOutput(paraphraseText(text, getVal('style'))));
    };
}

function paraphraseText(text, style) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.map(s => {
        const words = s.split(' ');
        const synonyms = { 'good': 'excellent', 'bad': 'poor', 'big': 'substantial', 'small': 'compact', 'important': 'crucial', 'use': 'utilize', 'help': 'assist', 'make': 'create', 'show': 'demonstrate', 'get': 'obtain', 'very': 'remarkably', 'also': 'additionally', 'but': 'however', 'so': 'therefore', 'because': 'since', 'thing': 'aspect', 'way': 'approach', 'people': 'individuals', 'work': 'function', 'need': 'require' };
        const result = words.map(w => { const lower = w.toLowerCase().replace(/[.,!?;:]$/, ''); const punct = w.match(/[.,!?;:]$/) ? w.slice(-1) : ''; return (synonyms[lower] || w.toLowerCase()) + punct; });
        if (style === 'Formal') result.unshift('Furthermore,');
        if (style === 'Simple') return result.join(' ').replace(/\b\w{10,}\b/g, m => m.slice(0,6));
        return result.join(' ');
    }).join(' ');
}

function handleGrammarChecker() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Please enter text', 'error');
        simulate(() => {
            let corrected = text
                .replace(/\bi\b/g, 'I').replace(/\bteh\b/g, 'the').replace(/\brecieve\b/g, 'receive')
                .replace(/\bthier\b/g, 'their').replace(/\byour\s+(welcome|right|correct)/gi, "you're $1")
                .replace(/\bits\s+(a|an|the|very|not|been)/gi, "it's $1").replace(/\balot\b/g, 'a lot')
                .replace(/\bdefinately\b/g, 'definitely').replace(/\bwich\b/g, 'which')
                .replace(/\s{2,}/g, ' ').replace(/\s+([.,!?])/g, '$1');
            corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
            if (!corrected.match(/[.!?]$/)) corrected += '.';
            typeOutput(corrected);
        });
    };
}

function handleEmailWriter() {
    window.toolGenerate = () => {
        const purpose = getInput(); if (!purpose) return showToast('Please enter email purpose', 'error');
        const tone = getVal('tone'), type = getVal('type');
        simulate(() => typeOutput(generateEmail(purpose, tone, type)));
    };
}

function generateEmail(purpose, tone, type) {
    const greetings = { Formal: 'Dear Sir/Madam,', Friendly: 'Hi there!', Persuasive: 'Dear [Name],', Apologetic: 'Dear [Name],' };
    const closings = { Formal: 'Best regards,', Friendly: 'Cheers,', Persuasive: 'Looking forward to hearing from you,', Apologetic: 'Sincerely yours,' };
    return `Subject: ${type} - ${purpose}\n\n${greetings[tone] || 'Dear [Name],'}\n\nI hope this email finds you well. I am writing to you regarding ${purpose.toLowerCase()}.\n\n${tone === 'Apologetic' ? `I sincerely apologize for any inconvenience caused. ` : ''}${tone === 'Persuasive' ? `I believe this opportunity could be highly beneficial for you. ` : ''}I would like to discuss this matter further and explore how we can move forward productively.\n\nPlease let me know a convenient time for us to connect. I am available at your earliest convenience and happy to accommodate your schedule.\n\n${closings[tone] || 'Best regards,'}\n[Your Name]\n[Your Title]\n[Contact Information]`;
}

function handleSummarizer() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Please enter text', 'error');
        simulate(() => {
            const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
            const len = getVal('length');
            const count = len.includes('Brief') ? 2 : len.includes('Detailed') ? Math.ceil(sentences.length * 0.4) : Math.ceil(sentences.length * 0.25);
            const summary = sentences.slice(0, Math.max(count, 1)).join(' ');
            typeOutput(`📋 Summary:\n\n${summary}\n\n---\nOriginal: ${text.split(' ').length} words → Summary: ${summary.split(' ').length} words (${Math.round((summary.split(' ').length / text.split(' ').length) * 100)}% of original)`);
        });
    };
}

// ===== IMAGE =====
function handleImageGenerator() {
    window.toolGenerate = () => {
        const prompt = getInput(); if (!prompt) return showToast('Please describe your image', 'error');
        const style = getVal('img-style');
        simulate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 512;
            const ctx = canvas.getContext('2d');
            generateArtCanvas(ctx, 512, 512, prompt, style);
            showOutput(`<div style="text-align:center;"><img src="${canvas.toDataURL()}" style="max-width:100%;border-radius:12px;"/><p style="margin-top:1rem;color:var(--text-muted);font-size:var(--text-sm);">Generated: "${prompt}" (${style})</p></div>`, false);
            const actions = document.getElementById('output-actions');
            if (actions) actions.innerHTML = `<a href="${canvas.toDataURL()}" download="nexusai-image.png" class="btn btn-secondary btn-sm">💾 Download</a>`;
        });
    };
}

function generateArtCanvas(ctx, w, h, prompt, style) {
    const hash = [...prompt].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
    const hue1 = Math.abs(hash % 360), hue2 = (hue1 + 120) % 360, hue3 = (hue1 + 240) % 360;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, `hsl(${hue1},70%,15%)`); bg.addColorStop(1, `hsl(${hue2},60%,10%)`);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
        const grd = ctx.createRadialGradient(Math.abs((hash * (i+1)) % w), Math.abs((hash * (i+2)) % h), 0, Math.abs((hash * (i+1)) % w), Math.abs((hash * (i+2)) % h), 80 + i * 30);
        grd.addColorStop(0, `hsla(${(hue1 + i * 45) % 360},80%,60%,0.3)`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
    }
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.abs((hash * (i+3)) % w), Math.abs((hash * (i+7)) % h), 2 + (i % 4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue3},90%,80%,${0.3 + (i % 5) * 0.1})`;
        ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'bold 20px Inter'; ctx.textAlign = 'center';
    ctx.fillText(prompt.slice(0, 40), w/2, h - 30);
    ctx.font = '14px Inter'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`Style: ${style} | NexusAI`, w/2, h - 10);
}

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

// ===== VIDEO & AUDIO =====
function handleVideoScript() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter a topic', 'error');
        const platform = getVal('platform'), duration = getVal('duration');
        simulate(() => typeOutput(generateVideoScript(topic, platform, duration)));
    };
}

function generateVideoScript(topic, platform, duration) {
    const isShort = duration.includes('30') || duration.includes('1 min') || platform.includes('TikTok');
    if (isShort) return `🎬 SHORT-FORM SCRIPT: ${topic}\n━━━━━━━━━━━━━━━━━━\n\n[HOOK - 0:00-0:03]\n"Did you know that ${topic.toLowerCase()}? Here's what nobody tells you..."\n\n[CONTENT - 0:03-0:25]\n"First, ${topic.toLowerCase()} is changing everything because...\nSecond, the biggest mistake people make is...\nThird, here's the secret that experts use..."\n\n[CTA - 0:25-0:30]\n"Follow for more tips like this! Drop a comment if you want part 2."\n\n#${topic.replace(/\s+/g,'')} #viral #tips`;
    return `🎬 VIDEO SCRIPT: ${topic}\nPlatform: ${platform} | Duration: ${duration}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n[INTRO - 0:00-0:30]\nHey everyone! Welcome back to the channel. Today we're diving deep into ${topic.toLowerCase()}, and trust me, you don't want to miss this.\n\n[SECTION 1 - 0:30-2:00]\n"Let's start with the basics. ${topic} is important because..."\n- Key point 1: Overview and context\n- Key point 2: Why this matters now\n- Visual suggestion: Show relevant statistics or graphics\n\n[SECTION 2 - 2:00-4:00]\n"Now here's where it gets interesting..."\n- Deep dive into the main content\n- Real-world examples and case studies\n- Visual suggestion: Screen recordings or demonstrations\n\n[SECTION 3 - 4:00-6:00]\n"The part everyone's been waiting for..."\n- Practical tips and actionable advice\n- Step-by-step walkthrough\n- Common mistakes to avoid\n\n[CONCLUSION - 6:00-7:00]\n"So to wrap up, ${topic.toLowerCase()} is something we all need to pay attention to."\n- Quick recap of key points\n- Call to action\n\n[OUTRO]\n"If you found this helpful, smash that like button and subscribe! See you in the next one!"`;
}

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
    // Populate voices
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

function handlePodcastSummarizer() {
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Paste transcript', 'error');
        const format = getVal('format');
        simulate(() => {
            const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
            const keyPoints = sentences.filter((_, i) => i % 3 === 0).slice(0, 8);
            let output = format === 'Key Points' ? '🎧 Key Takeaways:\n\n' + keyPoints.map((p, i) => `${i+1}. ${p}`).join('\n\n') : format === 'Bullet Notes' ? '🎧 Notes:\n\n' + keyPoints.map(p => `• ${p}`).join('\n') : `🎧 Summary:\n\n${keyPoints.join(' ')}`;
            typeOutput(output);
        });
    };
}

// ===== BUSINESS =====
function handleResumeBuilder() {
    window.toolGenerate = () => {
        const name = document.getElementById('resume-name')?.value?.trim();
        if (!name) return showToast('Please enter your name', 'error');
        const title = document.getElementById('resume-title')?.value || '', email = document.getElementById('resume-email')?.value || '';
        const phone = document.getElementById('resume-phone')?.value || '', summary = document.getElementById('resume-summary')?.value || '';
        const skills = document.getElementById('resume-skills')?.value || '', exp = document.getElementById('resume-exp')?.value || '';
        const edu = document.getElementById('resume-edu')?.value || '';
        simulate(() => {
            showOutput(`<div class="resume-preview">
                <h2>${name}</h2><p style="font-size:1.1rem;color:#7c5cfc;margin-bottom:4px;">${title}</p>
                <p>${[email, phone].filter(Boolean).join(' | ')}</p>
                ${summary ? `<h3>Professional Summary</h3><p>${summary}</p>` : ''}
                ${skills ? `<h3>Skills</h3><p>${skills.split(',').map(s => `<span style="display:inline-block;background:#f0f0ff;padding:2px 10px;border-radius:12px;margin:2px;font-size:0.85rem;">${s.trim()}</span>`).join('')}</p>` : ''}
                ${exp ? `<h3>Experience</h3><p style="white-space:pre-line;">${exp}</p>` : ''}
                ${edu ? `<h3>Education</h3><p style="white-space:pre-line;">${edu}</p>` : ''}
            </div>`, false);
            document.getElementById('output-actions').innerHTML = `<button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print / Save PDF</button>`;
        });
    };
}

function handleCoverLetter() {
    window.toolGenerate = () => {
        const jd = getInput(); if (!jd) return showToast('Enter job description', 'error');
        const exp = getVal('experience');
        simulate(() => typeOutput(`Dear Hiring Manager,\n\nI am writing to express my strong interest in the position described in your job posting. With ${exp.toLowerCase()} of relevant experience, I am confident in my ability to make a significant contribution to your team.\n\nYour requirements align perfectly with my professional background. Throughout my career, I have developed expertise in the key areas you've outlined, particularly in ${jd.split(' ').slice(0, 5).join(' ').toLowerCase()}.\n\nIn my previous roles, I have:\n• Delivered measurable results that directly impacted business objectives\n• Collaborated effectively with cross-functional teams\n• Demonstrated strong problem-solving and analytical skills\n• Maintained a commitment to continuous learning and professional development\n\nI am particularly drawn to this opportunity because of the chance to work on ${jd.split(' ').slice(5, 10).join(' ').toLowerCase() || 'innovative projects'}. I believe my combination of skills, experience, and enthusiasm makes me an ideal candidate.\n\nI would welcome the opportunity to discuss how my background and skills would benefit your organization. Thank you for considering my application.\n\nBest regards,\n[Your Name]`));
    };
}

function handleBusinessName() {
    window.toolGenerate = () => {
        const desc = getInput(); if (!desc) return showToast('Describe your business', 'error');
        const style = getVal('style'), count = parseInt(getVal('count')) || 10;
        simulate(() => {
            const words = desc.split(' ').filter(w => w.length > 3);
            const prefixes = ['Nova', 'Apex', 'Zen', 'Pulse', 'Flux', 'Vibe', 'Aura', 'Prism', 'Spark', 'Orbit', 'Nexus', 'Peak', 'Edge', 'Core', 'Hive', 'Bold', 'Sync', 'Flow', 'Glow', 'Rise'];
            const suffixes = ['Hub', 'Lab', 'Works', 'Craft', 'Base', 'Spot', 'Zone', 'Verse', 'Mind', 'Wave', 'Bridge', 'Path', 'Shift', 'Loop', 'Stack', 'Link', 'Forge', 'Realm', 'Grid', 'Nest'];
            let names = [];
            for (let i = 0; i < count; i++) {
                const w = words[i % words.length] || 'Tech';
                const cap = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                names.push(`${prefixes[i % prefixes.length]}${cap}`, `${cap}${suffixes[i % suffixes.length]}`);
            }
            typeOutput(`🏢 Business Name Ideas:\n\n${names.slice(0, count).map((n, i) => `${i+1}. ${n}`).join('\n')}\n\n💡 Tip: Check domain availability at namecheap.com`);
        });
    };
}

function handleSloganGen() {
    window.toolGenerate = () => {
        const brand = getInput(); if (!brand) return showToast('Enter brand info', 'error');
        const tone = getVal('tone');
        simulate(() => {
            const templates = {
                Inspiring: ['{} — Where Dreams Take Flight', 'Empowering Tomorrow with {}', '{}: Your Journey, Our Mission', 'Together with {}, Anything is Possible', 'Believe in {}. Believe in You.'],
                Funny: ['{} — Because Life\'s Too Short for Bad Choices', 'Warning: {} May Cause Extreme Satisfaction', '{}: Officially Better Than a Nap', 'Like Magic, But Real. That\'s {}.', '{} — We Promise We\'re Not AI... Wait.'],
                Professional: ['{}: Excellence Delivered', 'Trusted Solutions by {}', '{} — Setting the Standard', 'Innovation Meets Reliability at {}', '{}: Where Quality Meets Performance'],
                Bold: ['{}: Break the Rules.', 'Unstoppable. Unapologetic. {}.', '{} — No Limits.', 'Think Bigger. Think {}.', '{}: Built Different.'],
                Minimal: ['{}.', 'Simply {}.', '{} — Less is More.', 'Pure {}.', '{}, Reimagined.']
            };
            const t = templates[tone] || templates.Professional;
            const name = brand.split(' ')[0];
            typeOutput(`💡 Slogans for "${brand}":\n\n${t.map((s, i) => `${i+1}. ${s.replace('{}', name)}`).join('\n')}`);
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
            showOutput(`<div class="invoice-preview">
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

// ===== MARKETING =====
function handleSeoMeta() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter topic', 'error');
        simulate(() => typeOutput(`🔎 SEO Meta Tags for: "${topic}"\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📌 Title Tag (60 chars):\n${topic.slice(0, 50)} — Complete Guide [2026]\n\n📝 Meta Description (155 chars):\nDiscover everything about ${topic.toLowerCase()}. Expert tips, best practices, and actionable insights to help you succeed. Updated for 2026.\n\n🏷️ Open Graph Title:\n${topic} — Expert Guide & Tips | YourSite\n\n📋 OG Description:\nLearn about ${topic.toLowerCase()} with our comprehensive guide. Free resources, expert advice, and step-by-step tutorials.\n\n🔗 URL Slug Suggestion:\n/${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-')}\n\n🏷️ Suggested Keywords:\n${topic.toLowerCase()}, ${topic.toLowerCase()} guide, best ${topic.toLowerCase()}, ${topic.toLowerCase()} tips, ${topic.toLowerCase()} 2026`));
    };
}

function handleHashtagGen() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter topic', 'error');
        const count = parseInt(getVal('count')) || 20;
        simulate(() => {
            const words = topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
            const base = words.map(w => '#' + w.charAt(0).toUpperCase() + w.slice(1));
            const generic = ['#trending', '#viral', '#explore', '#fyp', '#instagood', '#photooftheday', '#love', '#follow', '#reels', '#contentcreator', '#motivation', '#inspiration', '#growth', '#success', '#tips', '#howto', '#learn', '#digital', '#creative', '#lifestyle'];
            const combined = [...base, ...words.map(w => '#' + w + 'tips'), ...words.map(w => '#best' + w), ...generic];
            typeOutput(`#️⃣ Hashtags for: "${topic}"\n\n${[...new Set(combined)].slice(0, count).join(' ')}\n\n📊 Copy all hashtags above and paste into your post!`);
        });
    };
}

function handleAdCopy() {
    window.toolGenerate = () => {
        const product = getInput(); if (!product) return showToast('Enter product info', 'error');
        const platform = getVal('platform'), goal = getVal('goal');
        simulate(() => typeOutput(`📢 ${platform} Ad Copy — ${goal}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔥 Headline 1:\nTransform Your Life with ${product.split(' ').slice(0,3).join(' ')}\n\n🔥 Headline 2:\nThe #1 ${product.split(' ').slice(0,2).join(' ')} Trusted by Thousands\n\n🔥 Headline 3:\nStop Wasting Time — Try ${product.split(' ')[0]} Today\n\n📝 Primary Text:\nReady to take your ${goal.toLowerCase()} to the next level? ${product} is here to help you achieve your goals faster and easier than ever.\n\n✅ What you get:\n• Instant results you can see\n• Easy setup in minutes\n• Trusted by 10,000+ users\n• 100% satisfaction guaranteed\n\n👉 ${goal === 'Sales' ? 'Shop Now' : goal === 'Lead Generation' ? 'Sign Up Free' : 'Learn More'}\n\n📝 Short Copy (Stories/Reels):\n${product.split(' ').slice(0,3).join(' ')} just changed everything 🚀\nTap to ${goal === 'Sales' ? 'shop' : 'learn more'} →`));
    };
}

function handleSocialPost() {
    window.toolGenerate = () => {
        const topic = getInput(); if (!topic) return showToast('Enter topic', 'error');
        const platform = getVal('platform'), tone = getVal('tone');
        simulate(() => {
            const posts = { Instagram: `📸 ${topic}\n\n${tone === 'Enthusiastic' ? '🔥🔥🔥' : '✨'} ${topic}!\n\nHere's what you need to know:\n\n1️⃣ Key insight about this topic\n2️⃣ Why it matters to you\n3️⃣ How to take action today\n\n💬 What are your thoughts? Drop a comment below!\n\n#${topic.replace(/\s+/g,'')} #trending`, Twitter: `${topic} 🧵\n\n${tone === 'Professional' ? 'Important:' : '🔥'} ${topic}\n\nHere's what I've learned:\n\n1/ The biggest takeaway\n2/ Why most people get it wrong\n3/ The simple fix\n\nRepost if this helped! ♻️`, LinkedIn: `${topic}\n\nI've been thinking about ${topic.toLowerCase()} and wanted to share my perspective.\n\nHere's what I've observed:\n\n→ ${topic} is transforming how we work\n→ Early adopters are seeing remarkable results\n→ The key is starting small and iterating\n\nWhat's your experience with this? I'd love to hear your thoughts in the comments.\n\n#${topic.replace(/\s+/g,'')} #ProfessionalDevelopment` };
            typeOutput(posts[platform] || posts.Instagram);
        });
    };
}

function handleProductDesc() {
    window.toolGenerate = () => {
        const product = getInput(); if (!product) return showToast('Enter product details', 'error');
        const platform = getVal('platform');
        simulate(() => typeOutput(`🛒 Product Description — ${platform}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📌 Title:\n${product.split('-')[0]?.trim() || product.split(' ').slice(0,5).join(' ')} — Premium Quality | Fast Shipping\n\n📝 Description:\nIntroducing ${product.split(' ').slice(0,3).join(' ')} — the perfect solution for your needs. Crafted with care and designed for excellence, this product delivers outstanding quality that you can trust.\n\n✨ Key Features:\n• Premium materials for lasting durability\n• Thoughtfully designed for maximum comfort\n• Perfect for everyday use\n• Makes an excellent gift\n\n📋 Specifications:\n${product}\n\n💡 Why Choose Us?\n✅ Fast & Free Shipping\n✅ 30-Day Money-Back Guarantee\n✅ 24/7 Customer Support\n✅ Thousands of Happy Customers\n\n⭐ Don't miss out — Add to cart today!`));
    };
}

// ===== UTILITY =====
function handleCodeGen() {
    window.toolGenerate = () => {
        const desc = getInput(); if (!desc) return showToast('Describe what to build', 'error');
        const lang = getVal('code-lang');
        simulate(() => {
            const code = generateCode(desc, lang);
            showOutput(`<pre style="color:#e6edf3;margin:0;white-space:pre-wrap;">${escapeHtml(code)}</pre>`, true);
        });
    };
}

function generateCode(desc, lang) {
    const samples = {
        JavaScript: `// ${desc}\n\nfunction solution(input) {\n  // Process input based on description\n  const result = input\n    .toString()\n    .split('')\n    .map(item => {\n      // Transform each element\n      return item;\n    })\n    .filter(Boolean);\n\n  console.log('Processing:', desc);\n  return result;\n}\n\n// Usage\nconst output = solution('example input');\nconsole.log('Result:', output);`,
        Python: `# ${desc}\n\ndef solution(input_data):\n    """\n    ${desc}\n    \n    Args:\n        input_data: The input to process\n    Returns:\n        Processed result\n    """\n    # Process input based on description\n    result = []\n    \n    for item in input_data:\n        # Transform each element\n        processed = item\n        result.append(processed)\n    \n    print(f"Processing: ${desc}")\n    return result\n\n\n# Usage\nif __name__ == "__main__":\n    output = solution(["example", "input"])\n    print(f"Result: {output}")`,
        'HTML/CSS': `<!-- ${desc} -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${desc}</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body { font-family: system-ui; background: #0a0a0f; color: #fff; }\n    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }\n    h1 { font-size: 2.5rem; margin-bottom: 1rem; }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <h1>${desc}</h1>\n    <p>Your content here</p>\n  </div>\n</body>\n</html>`,
    };
    return samples[lang] || samples.JavaScript;
}

function escapeHtml(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function handleTranslator() {
    window.swapLangs = () => {
        const from = document.getElementById('lang-from'), to = document.getElementById('lang-to');
        const tmp = from.value; from.value = to.value; to.value = tmp;
    };
    window.toolGenerate = () => {
        const text = getInput(); if (!text) return showToast('Enter text', 'error');
        const from = getVal('lang-from'), to = getVal('lang-to');
        simulate(() => {
            // Simple demo translation (reverses words and adds language tag)
            const words = text.split(' ');
            const translated = words.map(w => {
                if (to === 'Spanish') return w.replace(/tion$/,'ción').replace(/ly$/,'mente') + (Math.random() > 0.5 ? '' : '');
                if (to === 'French') return w.replace(/tion$/,'tion').replace(/ly$/,'ment');
                if (to === 'German') return w.charAt(0).toUpperCase() + w.slice(1);
                return w;
            }).join(' ');
            showOutput(`<div style="line-height:2;">${translated}</div><p style="margin-top:1rem;color:var(--text-muted);font-size:var(--text-sm);">Translated from ${from} to ${to}</p><p style="color:var(--accent-warning);font-size:var(--text-xs);margin-top:0.5rem;">⚠️ Demo mode — Connect an API key for accurate translations</p>`, true);
        });
    };
}

function handleColorPalette() {
    window.toolGenerate = () => {
        const mood = getVal('palette-mood'), count = parseInt(getVal('palette-count')) || 5;
        const colors = generatePalette(mood, count);
        const out = document.getElementById('tool-output');
        out.innerHTML = colors.map(c => `<div class="color-swatch" style="background:${c};" onclick="copyToClipboard('${c}')"><span class="color-swatch-label">${c}</span></div>`).join('');
        out.className = 'color-grid';
    };
    window.toolGenerate(); // Auto-generate on load
}

function generatePalette(mood, count) {
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
    return (palettes[mood] || (() => Array.from({length: count}, (_, i) => `hsl(${(base + i * (360/count)) % 360}, 70%, 55%)`)))();
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
            drawQR(ctx, content, size, fg, bg);
            const out = document.getElementById('tool-output');
            out.innerHTML = `<div style="text-align:center;"><canvas id="qr-canvas"></canvas><p style="margin-top:1rem;color:var(--text-muted);font-size:var(--text-sm);">${content.slice(0,50)}</p></div>`;
            const qc = document.getElementById('qr-canvas');
            qc.width = size; qc.height = size;
            qc.getContext('2d').drawImage(canvas, 0, 0);
            document.getElementById('output-actions').innerHTML = `<a href="${canvas.toDataURL()}" download="qrcode.png" class="btn btn-secondary btn-sm">💾 Download</a>`;
        });
    };
}

function drawQR(ctx, text, size, fg, bg) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
    const modules = 25, cellSize = size / modules;
    // Generate a deterministic pattern from text
    const hash = [...text].reduce((a, c, i) => a ^ (c.charCodeAt(0) << (i % 24)), 0);
    ctx.fillStyle = fg;
    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (x, y) => {
        ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = bg;
        ctx.fillRect((x+1) * cellSize, (y+1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = fg;
        ctx.fillRect((x+2) * cellSize, (y+2) * cellSize, 3 * cellSize, 3 * cellSize);
    };
    drawFinder(0, 0); drawFinder(modules - 7, 0); drawFinder(0, modules - 7);
    // Data modules
    for (let y = 0; y < modules; y++) {
        for (let x = 0; x < modules; x++) {
            if ((x < 8 && y < 8) || (x > modules-9 && y < 8) || (x < 8 && y > modules-9)) continue;
            const charCode = text.charCodeAt((x + y * modules) % text.length);
            if ((charCode ^ hash ^ (x * y)) % 3 === 0) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function handlePlaceholderText() {
    window.toolGenerate = () => {
        const topic = getInput() || 'Technology';
        const count = parseInt(getVal('paragraphs')) || 3;
        const style = getVal('style');
        simulate(() => {
            if (style === 'Lorem Ipsum') {
                const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
                typeOutput(Array(count).fill(lorem).join('\n\n'));
            } else {
                const sentences = [
                    `The evolution of ${topic.toLowerCase()} has transformed countless industries worldwide.`,
                    `Experts predict remarkable advancements in ${topic.toLowerCase()} within the next decade.`,
                    `Organizations leveraging ${topic.toLowerCase()} report significant improvements in efficiency.`,
                    `The intersection of innovation and ${topic.toLowerCase()} creates unprecedented opportunities.`,
                    `Understanding ${topic.toLowerCase()} is crucial for professionals in every field.`,
                    `Recent developments in ${topic.toLowerCase()} have exceeded all expectations.`,
                    `The global impact of ${topic.toLowerCase()} continues to grow at an exponential rate.`,
                    `Leading researchers are exploring new frontiers in ${topic.toLowerCase()}.`,
                ];
                const paragraphs = Array.from({length: count}, (_, i) => {
                    const start = (i * 3) % sentences.length;
                    return sentences.slice(start, start + 3).concat(sentences.slice(0, Math.max(0, start + 3 - sentences.length))).join(' ');
                });
                typeOutput(paragraphs.join('\n\n'));
            }
        });
    };
}
