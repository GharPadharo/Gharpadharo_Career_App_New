import Link from "next/link";

/**
 * RecruitmentSnapshot Component
 * 
 * 2-Column Overview Section:
 * - Left: Open Positions list (first 4 active roles + View all jobs link)
 * - Right: Recent Activity (intentional, polished empty state)
 */
export default function RecruitmentSnapshot({ jobs = [] }) {
  const previewRoles = jobs.slice(0, 4);

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1">
          RECRUITMENT SNAPSHOT
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-heading tracking-tight">
          Your hiring overview
        </h2>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Open Positions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Open positions
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Currently active career postings
                </p>
              </div>
              <div className="flex items-baseline gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                <span className="text-lg font-extrabold text-heading">
                  {jobs.length}
                </span>
                <span className="text-xs font-semibold text-muted">
                  Active roles
                </span>
              </div>
            </div>

            {/* List of 4 preview roles */}
            <div className="divide-y divide-slate-100 mt-2">
              {previewRoles.map((job) => (
                <div
                  key={job.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                      <span className="truncate">{job.team}</span>
                      <span className="text-slate-300" aria-hidden="true">•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Link */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <Link
              href="/admin/dashboard/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-[#46477f] hover:underline transition-colors focus:outline-none focus:underline"
            >
              <span>View all jobs</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity (Intentional Empty State) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Recent activity
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Timeline of recruitment events
                </p>
              </div>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                Audit log
              </span>
            </div>

            {/* Empty State Presentation */}
            <div className="py-10 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-3.5 shadow-2xs">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                No recent activity
              </h4>
              <p className="text-xs text-muted max-w-sm mt-1.5 leading-relaxed font-normal">
                Recruitment activity will appear here once applications and job
                activity are connected to the backend.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Realtime updates disabled</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Standby
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
