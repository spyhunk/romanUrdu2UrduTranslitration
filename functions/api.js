import { romanUrduConverter, isInDictionary } from '../src/transliterator.js';
import { isRateLimited } from '../src/rateLimiter.js';

export async function onRequestPost(context) {
    const { request } = context;
    const ip = request.headers.get('cf-connecting-ip');

    // Apply Rate Limiting
    const rateLimitResult = isRateLimited(ip);
    if (rateLimitResult.limited) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Too Many Requests',
            retryAfter: rateLimitResult.retryAfter,
            limitPerMin: rateLimitResult.limitPerMin,
        }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': rateLimitResult.retryAfter.toString() }
        });
    }

    try {
        const body = await request.json();
        const text = body.text || body.input || '';

        if (!text || typeof text !== 'string') {
            return new Response(JSON.stringify({ success: false, error: 'Missing "text" field' }), { status: 400 });
        }

        const output = romanUrduConverter(text);

        // Stats
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        let dictionaryHits = 0;
        words.forEach(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (cleanWord && isInDictionary(cleanWord)) dictionaryHits++;
        });

        return new Response(JSON.stringify({
            success: true,
            input: text,
            output: output,
            wordCount: words.length,
            characterCount: text.length,
            dictionaryHits: dictionaryHits,
        }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Internal Error' }), { status: 500 });
    }
}

export async function onRequestGet() {
    return new Response(JSON.stringify({
        name: 'Roman Urdu to Urdu API (Pages)',
        version: '1.0.1',
        endpoints: { 'POST /api': 'Transliterate text' }
    }), { headers: { 'Content-Type': 'application/json' } });
}
