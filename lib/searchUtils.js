/**
 * Search Utilities
 *
 * Safely escapes special regular expression characters in user-controlled input
 * to prevent Regular Expression Denial of Service (ReDoS) and syntax errors.
 */

/**
 * Escapes regex metacharacters in a search query string.
 * Special characters escaped: . * + ? ^ $ { } ( ) | [ ] \
 *
 * @param {string} text - User-provided search or filter string
 * @returns {string} Escaped string safe for literal matching in RegExp
 */
export function escapeRegex(text) {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
