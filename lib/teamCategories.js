/**
 * Canonical Team / Department Categories Configuration
 * GharPadharo Career Portal
 *
 * Serves as the single source of truth across:
 * - Admin Add & Edit Job forms
 * - Admin job management filters
 * - Public career job listings and filters
 * - Backend API validation and MongoDB schema enforcement
 *
 * Safe for both client-side and server-side execution (zero external dependencies).
 */

/**
 * 10 Canonical Team Categories
 */
export const JOB_CATEGORIES = [
  "Technology",
  "Product Management",
  "Design",
  "Sales & Business Development",
  "Marketing",
  "Operations",
  "Customer Success & Support",
  "Data & Analytics",
  "Human Resources & Talent Acquisition",
  "Finance & Accounting",
];

/**
 * Historical / legacy categories to preserve full backward compatibility
 * with existing database records without breaking migrations or data loss.
 */
export const LEGACY_CATEGORIES = [
  "Data Science",
  "Sales",
  "Engineering",
  "Growth & Marketing",
];

/**
 * Alias mapping linking historical/legacy categories to canonical counterparts.
 */
export const CATEGORY_ALIASES = {
  "data science": "Data & Analytics",
  "datascience": "Data & Analytics",
  "sales": "Sales & Business Development",
  "engineering": "Technology",
  "growth & marketing": "Marketing",
  "growth and marketing": "Marketing",
};

/**
 * Validates whether a given team/category string is a recognized canonical or legacy category.
 *
 * @param {string} category - Category string to validate
 * @returns {boolean} True if category is valid, false otherwise
 */
export function isValidCategory(category) {
  if (!category || typeof category !== "string") return false;
  const trimmed = category.trim();
  if (!trimmed) return false;

  // 1. Direct match with canonical categories
  if (JOB_CATEGORIES.includes(trimmed)) return true;

  // 2. Case-insensitive canonical match
  const lower = trimmed.toLowerCase();
  if (JOB_CATEGORIES.some((c) => c.toLowerCase() === lower)) return true;

  // 3. Recognized legacy categories
  if (LEGACY_CATEGORIES.some((l) => l.toLowerCase() === lower)) return true;

  return false;
}

/**
 * Normalizes a category string to its canonical equivalent if known,
 * or preserves the recognized legacy category name.
 *
 * @param {string} category
 * @returns {string}
 */
export function normalizeCategory(category) {
  if (!category || typeof category !== "string") return "";
  const trimmed = category.trim();
  const lower = trimmed.toLowerCase();

  // Canonical match
  const canonicalMatch = JOB_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (canonicalMatch) return canonicalMatch;

  // Alias match
  if (CATEGORY_ALIASES[lower]) {
    return CATEGORY_ALIASES[lower];
  }

  // Legacy match
  const legacyMatch = LEGACY_CATEGORIES.find((l) => l.toLowerCase() === lower);
  if (legacyMatch) return legacyMatch;

  return trimmed;
}

/**
 * Returns an array of category strings that should match a given filter value.
 * For example, filtering by "Data & Analytics" also matches jobs tagged "Data Science".
 *
 * @param {string} filterValue - The selected filter string (e.g., from UI or query param)
 * @returns {string[]} Array of matching category names
 */
export function getFilterTeamMatchList(filterValue) {
  if (!filterValue || typeof filterValue !== "string") return [];
  const trimmed = filterValue.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "all" || lower === "all teams") {
    return [];
  }

  const matches = new Set([trimmed]);

  // Find canonical name if this is an alias or canonical
  let canonical = JOB_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (!canonical && CATEGORY_ALIASES[lower]) {
    canonical = CATEGORY_ALIASES[lower];
  }

  if (canonical) {
    matches.add(canonical);
    // Add any legacy categories that map to this canonical
    for (const [legacyLower, canonTarget] of Object.entries(CATEGORY_ALIASES)) {
      if (canonTarget.toLowerCase() === canonical.toLowerCase()) {
        const foundLegacy = LEGACY_CATEGORIES.find((l) => l.toLowerCase() === legacyLower);
        if (foundLegacy) {
          matches.add(foundLegacy);
        }
      }
    }
  }

  return Array.from(matches);
}

/**
 * Helper to determine if a job's team matches the selected filter value.
 * Supports legacy equivalence (e.g. "Data & Analytics" filter matches "Data Science" jobs).
 *
 * @param {string} selectedFilter - Currently selected team filter
 * @param {string} jobTeam - Team value stored on the job
 * @returns {boolean} True if the job matches the filter
 */
export function matchesTeamFilter(selectedFilter, jobTeam) {
  if (!selectedFilter) return true;
  const fLower = selectedFilter.toLowerCase().trim();
  if (fLower === "all" || fLower === "all teams" || fLower === "") return true;

  if (!jobTeam) return false;
  const jLower = jobTeam.toLowerCase().trim();

  // Direct match
  if (fLower === jLower) return true;

  // Match list check
  const allowed = getFilterTeamMatchList(selectedFilter).map((s) => s.toLowerCase());
  if (allowed.includes(jLower)) return true;

  // Normalized check
  const normFilter = normalizeCategory(selectedFilter).toLowerCase();
  const normJob = normalizeCategory(jobTeam).toLowerCase();
  return normFilter === normJob;
}
