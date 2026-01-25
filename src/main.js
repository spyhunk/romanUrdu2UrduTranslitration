import { romanUrduConverter, isInDictionary } from './transliterator.js';

// ============================================
// DOM ELEMENTS
// ============================================
const inputArea = document.getElementById('input-area');
const outputArea = document.getElementById('output-area');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const wordCountEl = document.getElementById('word-count');
const charCountEl = document.getElementById('char-count');
const dictHitsEl = document.getElementById('dict-hits');
const toast = document.getElementById('toast');
const exampleCards = document.querySelectorAll('.example-card');
const runtimeBadge = document.getElementById('runtime-badge');

// ============================================
// CONFIGURATION
// ============================================
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Update badge to show where processing is happening
if (IS_DEV) {
    runtimeBadge.innerHTML = 'LOCAL';
} else {
    runtimeBadge.textContent = 'EDGE';
}

let debounceTimer;

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Update UI with results
 */
function updateUI(data) {
    outputArea.textContent = data.output;
    wordCountEl.textContent = data.wordCount;
    charCountEl.textContent = data.characterCount;
    dictHitsEl.textContent = data.dictionaryHits;
}

/**
 * Handle transliteration logic
 */
async function handleTransliteration() {
    const input = inputArea.value;

    if (!input.trim()) {
        updateUI({ output: '', wordCount: 0, characterCount: 0, dictionaryHits: 0 });
        return;
    }

    // LOCAL DEV MODE: Use the library directly to avoid local worker binary crashes
    if (IS_DEV) {
        const output = romanUrduConverter(input);
        const words = input.trim().split(/\s+/).filter(w => w.length > 0);
        let dictionaryHits = 0;
        words.forEach(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (cleanWord && isInDictionary(cleanWord)) dictionaryHits++;
        });

        updateUI({
            output,
            wordCount: words.length,
            characterCount: input.length,
            dictionaryHits
        });
        return;
    }

    // PRODUCTION MODE: Call the Cloudflare Pages Function API
    outputArea.classList.add('loading');
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input })
            });

            if (response.status === 429) {
                const data = await response.json();
                showToast(`Slow down! Retry in ${data.retryAfter}s`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                updateUI(data);
            }
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local processing if API fails
            const output = romanUrduConverter(input);
            outputArea.textContent = output;
        } finally {
            outputArea.classList.remove('loading');
        }
    }, 150);
}

/**
 * Show toast notification
 */
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

/**
 * Copy to clipboard helper
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

inputArea.addEventListener('input', handleTransliteration);

clearBtn.addEventListener('click', () => {
    inputArea.value = '';
    handleTransliteration();
    inputArea.focus();
});

copyBtn.addEventListener('click', async () => {
    const text = outputArea.textContent;
    if (!text) {
        showToast('Nothing to copy!');
        return;
    }
    const success = await copyToClipboard(text);
    if (success) {
        copyBtn.classList.add('copied');
        showToast('Copied to clipboard!');
        setTimeout(() => copyBtn.classList.remove('copied'), 2000);
    }
});

exampleCards.forEach(card => {
    card.addEventListener('click', () => {
        inputArea.value = card.getAttribute('data-text');
        handleTransliteration();
        // scroll to output area + top 100px
        window.scrollTo({
            top: outputArea.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// ============================================
// INITIALIZATION
// ============================================
// Run initial example
setTimeout(() => {
    if (!inputArea.value) {
        inputArea.value = 'Assalam o alaikum, kaise ho aap?';
        handleTransliteration();
    }
}, 300);
