/**
 * In-Memory Rate Limiter for Cloudflare Workers
 * 
 * This implementation provides "soft" rate limiting that uses ZERO additional 
 * Cloudflare resources (no KV, no D1, no Cache API).
 * 
 * Logic:
 * - Uses a sliding window algorithm.
 * - Stores state in-memory (per isolate).
 * - High performance with O(1) average lookup.
 * 
 * Note: Since Cloudflare Workers are distributed and ephemeral, this limit 
 * applies per edge location/isolate. This is actually ideal for a free plan 
 * as it prevents any single client from abuse while scaling automatically 
 * with your traffic without hitting KV write limits (which are 1k/day on free).
 */

const RATE_LIMIT = 60; // Max requests
const WINDOW_MS = 60 * 1000; // Window size (1 minute)

// In-memory store (persists as long as the isolate is warm)
const ipStore = new Map();

/**
 * Clean up old entries from the store to prevent memory leaks
 */
function cleanupStore() {
    const now = Date.now();
    for (const [ip, timestamps] of ipStore.entries()) {
        // Remove timestamps older than the window
        const validTimestamps = timestamps.filter(t => now - t < WINDOW_MS);
        if (validTimestamps.length === 0) {
            ipStore.delete(ip);
        } else {
            ipStore.set(ip, validTimestamps);
        }
    }
}

// Run cleanup every 5 minutes if it was an active long-running environment,
// but in Workers we usually just rely on isolate recycling.
// However, a simple periodic check during requests is fine.
let lastCleanup = Date.now();

export function isRateLimited(ip) {
    if (!ip) return { limited: false };

    const now = Date.now();

    // Periodic cleanup (every 2 minutes)
    if (now - lastCleanup > 120000) {
        cleanupStore();
        lastCleanup = now;
    }

    let timestamps = ipStore.get(ip) || [];

    // Filter out timestamps outside the current window
    timestamps = timestamps.filter(t => now - t < WINDOW_MS);

    if (timestamps.length >= RATE_LIMIT) {
        return {
            limited: true,
            retryAfter: Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000),
            limitPerMin: RATE_LIMIT
        };
    }

    // Record this request
    timestamps.push(now);
    ipStore.set(ip, timestamps);

    return { limited: false };
}
