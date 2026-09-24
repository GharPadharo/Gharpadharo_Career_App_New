"use client";

/**
 * AdminHeader Component
 * 
 * Clean top header bar for the admin dashboard:
 * - Left: Mobile hamburger button, page title, and supporting subtitle
 * - Right: Admin profile placeholder (avatar circle + "Admin" badge)
 */
export default function AdminHeader({
  title = "Dashboard",
  subtitle = "Manage jobs and review career activity.",
  onMenuToggle,
}) {
  return (
    <header className="h-18 px-4 sm:px-8 bg-white border-b border-slate-200/90 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-heading tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted hidden sm:block mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Visual Admin Profile Placeholder */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors select-none">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            A
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline-block">
            Admin
          </span>
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
