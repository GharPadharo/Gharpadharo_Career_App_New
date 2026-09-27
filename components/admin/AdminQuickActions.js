import Link from "next/link";

/**
 * AdminQuickActions Component
 * 
 * Compact quick actions area near top of the Admin Dashboard:
 * 1. Add New Job (Primary) -> /admin/dashboard/jobs/new
 * 2. Manage Jobs (Secondary) -> /admin/dashboard/jobs
 * 3. View Careers Page (Secondary) -> /jobs
 */
export default function AdminQuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Quick actions
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Common recruitment and job management tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action: Add New Job */}
          <Link
            href="/admin/dashboard/jobs/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#46477f] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add New Job</span>
          </Link>

          {/* Secondary Action: Manage Jobs */}
          <Link
            href="/admin/dashboard/jobs"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shrink-0"
          >
            <svg
              className="w-4 h-4 text-slate-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span>Manage Jobs</span>
          </Link>

          {/* Secondary Action: View Careers Page */}
          <Link
            href="/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shrink-0"
          >
            <svg
              className="w-4 h-4 text-slate-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>View Careers Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
