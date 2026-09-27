import Link from "next/link";
import { mockApplications } from "@/lib/mockApplications";
import { mockJobs } from "@/lib/mockJobs";

/**
 * RecentActivityCard Component
 * 
 * Displays compact recruitment events derived from canonical mock datasets:
 * - Applications activities derived from @/lib/mockApplications
 * - Job publishing activity derived from @/lib/mockJobs
 * - Clearly marked with a "Demo activity" indicator
 */
export default function RecentActivityCard() {
  const jobsById = new Map(mockJobs.map((j) => [j.id, j]));

  // Derive approximately 4 recent mock activities deterministically
  const app1 = mockApplications[0]; // Rahul Sharma
  const app2 = mockApplications[1]; // Priya Rawat
  const app3 = mockApplications[2]; // Arjun Mehta

  const activities = [
    {
      id: "act-1",
      type: "New application",
      isNew: true,
      title: `${app1.candidate} applied for ${jobsById.get(app1.jobId)?.title || "Full Stack Developer"}`,
      time: app1.appliedText,
      badge: "New",
      badgeColor: "bg-[#525599]/10 text-primary border-[#525599]/25",
      href: `/admin/dashboard/applications/${app1.id}`,
      icon: (
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      id: "act-2",
      type: "New application",
      isNew: true,
      title: `${app2.candidate} applied for ${jobsById.get(app2.jobId)?.title || "Content Creator"}`,
      time: app2.appliedText,
      badge: "New",
      badgeColor: "bg-[#525599]/10 text-primary border-[#525599]/25",
      href: `/admin/dashboard/applications/${app2.id}`,
      icon: (
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      id: "act-3",
      type: "Application viewed",
      isNew: false,
      title: `${app3.candidate} — ${jobsById.get(app3.jobId)?.title || "Product Manager"}`,
      time: app3.appliedText,
      badge: "Viewed",
      badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
      href: `/admin/dashboard/applications/${app3.id}`,
      icon: (
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: "act-4",
      type: "Job active",
      isNew: false,
      title: "Data Scientist position active in Data Science",
      time: "4 days ago",
      badge: "Active",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
      href: "/admin/dashboard/jobs",
      icon: (
        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header with Demo Activity Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recruitment Activity
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Recent timeline of candidate and publishing events.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
          Demo activity
        </span>
      </div>

      {/* Activities List */}
      <div className="space-y-2">
        {activities.map((act) => (
          <div
            key={act.id}
            className={`p-3 sm:px-3.5 sm:py-3 flex items-start justify-between gap-3 text-sm rounded-xl transition-all ${
              act.isNew
                ? "bg-[#525599]/[0.04] border border-[#525599]/20 shadow-2xs hover:bg-[#525599]/[0.07]"
                : "bg-white border border-slate-100 hover:bg-slate-50/70"
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              {/* Subtle Unread / New Indicator Dot */}
              <div className="w-2 flex items-center justify-center shrink-0 pt-2.5">
                {act.isNew ? (
                  <span
                    className="w-2 h-2 rounded-full bg-primary shadow-xs"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="w-2 h-2" aria-hidden="true" />
                )}
              </div>

              {/* Event Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  act.isNew
                    ? "bg-white border border-[#525599]/25 text-primary shadow-2xs"
                    : "bg-slate-50 border border-slate-200/70 text-slate-500"
                }`}
              >
                {act.icon}
              </div>

              {/* Event Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      act.isNew
                        ? "font-bold text-slate-900"
                        : "font-medium text-slate-700"
                    }`}
                  >
                    {act.type}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${act.badgeColor}`}
                  >
                    {act.badge}
                  </span>
                </div>

                <Link
                  href={act.href}
                  className={`text-xs block sm:truncate mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none transition-colors ${
                    act.isNew
                      ? "font-semibold text-slate-900 hover:text-primary"
                      : "font-normal text-slate-600 hover:text-primary"
                  }`}
                >
                  {act.title}
                </Link>
              </div>
            </div>

            {/* Timestamp */}
            <span
              className={`text-xs whitespace-nowrap shrink-0 mt-1 ${
                act.isNew ? "text-slate-600 font-medium" : "text-muted"
              }`}
            >
              {act.time}
            </span>
          </div>
        ))}
      </div>

      {/* Sub-bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Derived from demo candidate dataset</span>
        <Link
          href="/admin/dashboard/applications"
          className="text-primary hover:underline font-semibold"
        >
          View all applications &rarr;
        </Link>
      </div>
    </div>
  );
}
