import Link from "next/link";
import { formatAppliedText } from "@/lib/applicationSerializer";

/**
 * RecentActivityCard Component
 * 
 * Displays compact recruitment events derived from live MongoDB collections:
 * - Real-time application submissions
 * - Job publishing and status timeline
 * - Skeletons during data loading
 * - Marked with a "Live activity" indicator
 */
export default function RecentActivityCard({
  isLoading = false,
  recentApplications = [],
  recentJobs = [],
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 animate-pulse">
          <div className="space-y-1">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-24 bg-slate-100 rounded-lg" />
        </div>

        {/* Skeleton Activities List */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3 bg-white border border-slate-100 rounded-xl animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-2.5 w-48 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-16 bg-slate-100 rounded shrink-0" />
            </div>
          ))}
        </div>

        {/* Skeleton Sub-bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between animate-pulse">
          <div className="h-3 w-44 bg-slate-100 rounded" />
          <div className="h-3 w-28 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  // Synthesize events from real MongoDB data
  const applicationEvents = recentApplications.map((app) => {
    const isNew = app.status === "new";
    const eventTime = formatAppliedText(app.createdAt);

    return {
      id: `app-${app.id}`,
      type: isNew ? "New application" : "Application viewed",
      isNew,
      title: `${app.candidate} applied for ${app.jobTitle}`,
      time: eventTime,
      badge: isNew ? "New" : "Viewed",
      badgeColor: isNew
        ? "bg-[#525599]/10 text-primary border-[#525599]/25"
        : "bg-slate-100 text-slate-600 border-slate-200",
      href: `/admin/dashboard/applications/${app.id}`,
      timestamp: new Date(app.createdAt).getTime(),
      icon: (
        <svg
          className={`w-4 h-4 ${isNew ? "text-primary" : "text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isNew ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          )}
        </svg>
      ),
    };
  });

  const jobEvents = recentJobs.slice(0, 2).map((job) => {
    const isAct = job.status === "active";
    const isDraft = job.status === "draft";
    const statusLabel = job.status.charAt(0).toUpperCase() + job.status.slice(1);
    const eventTime = formatAppliedText(job.createdAt || job.postedAt);

    return {
      id: `job-${job.id}`,
      type: `Job ${job.status}`,
      isNew: false,
      title: `${job.title} position in ${job.team}`,
      time: eventTime,
      badge: statusLabel,
      badgeColor: isAct
        ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
        : isDraft
        ? "bg-amber-50 text-amber-700 border-amber-200/70"
        : "bg-slate-100 text-slate-600 border-slate-200",
      href: `/admin/dashboard/jobs/${job.slug}/edit`,
      timestamp: new Date(job.createdAt || job.postedAt || 0).getTime(),
      icon: (
        <svg
          className={`w-4 h-4 ${isAct ? "text-emerald-600" : isDraft ? "text-amber-600" : "text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isAct ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          )}
        </svg>
      ),
    };
  });

  // Combine and sort chronologically (most recent first), take top 5
  const combinedActivities = [...applicationEvents, ...jobEvents]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header with Live Activity Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recruitment Activity
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Real-time timeline of candidate submissions and job listings.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          Live activity
        </span>
      </div>

      {/* Activities List */}
      {combinedActivities.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted">
          No recent recruitment activity recorded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {combinedActivities.map((act) => (
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
      )}

      {/* Sub-bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Sourced in real-time from MongoDB Atlas</span>
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
