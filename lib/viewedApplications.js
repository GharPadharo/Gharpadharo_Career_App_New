/**
 * Client-side Session State for Viewed Applications
 * 
 * FRONTEND PROTOTYPE ONLY
 * Tracks which applications have been opened/viewed during the current browser session.
 * Does not communicate with any backend, database, or external service.
 */

const STORAGE_KEY = "gharpadharo_viewed_applications";

export function getViewedApplicationIds() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markApplicationAsViewed(id) {
  if (typeof window === "undefined" || !id) return;
  try {
    const set = getViewedApplicationIds();
    set.add(id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Graceful fallback for restricted storage environments
  }
}
