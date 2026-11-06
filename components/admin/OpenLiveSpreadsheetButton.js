import { ExternalLink } from "lucide-react";

export const LIVE_SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1ZSfB12Sb619plbDhhfRO-LrEw-AOMJ4lcGEOEdIkSxU/edit?gid=984341034#gid=984341034";

/**
 * OpenLiveSpreadsheetButton Component
 *
 * Provides authorized administrators with quick, one-click access to the live
 * Google Sheets spreadsheet containing incoming career applications.
 *
 * Design & Security Specifications:
 * - Secondary / outline button styling matching GharPadharo's admin design system
 * - Multi-tone Google Sheets SVG icon with subtle hover effect
 * - Opens securely in a new browser tab (`target="_blank"` with `rel="noopener noreferrer"`)
 * - Responsive: Full-width on mobile, auto-width side-by-side on tablet/desktop
 */
export default function OpenLiveSpreadsheetButton({
  href = LIVE_SPREADSHEET_URL,
  className = "",
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Live Applications Spreadsheet in Google Sheets"
      className={
        className ||
        "group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-semibold px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0 cursor-pointer min-h-[44px] no-underline"
      }
    >
      {/* Google Sheets Document Icon */}
      <svg
        className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
          fill="#0F9D58"
        />
        <path
          d="M14 2V8H20"
          fill="#87CEAC"
        />
        <path
          d="M7.5 12H16.5M7.5 15H16.5M7.5 18H16.5M11.5 12V18"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>

      <span>Open Live Spreadsheet</span>

      {/* Subtle External Link Arrow */}
      <ExternalLink
        className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 shrink-0 -ml-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
