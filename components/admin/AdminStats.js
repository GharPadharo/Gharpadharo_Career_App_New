/**
 * AdminStats Component
 * 
 * 4 Overview Stat Cards for Admin Dashboard:
 * 1. Active Jobs (currently active & accepting applications, with total count)
 * 2. Draft Jobs (saved internally but not active)
 * 3. Closed Jobs (archived positions closed to applications)
 * 4. Total Applications (applications received, with new/viewed breakdown)
 * 
 * Features:
 * - Real-time statistics queried from MongoDB Atlas
 * - Skeletons during loading to prevent misleading zero flashes
 * - Clean, restrained design matching GharPadharo design tokens
 */
export default function AdminStats({
  isLoading = false,
  jobs = null,
  applications = null,
  // Backward compatibility props if passed individually
  activeCount,
  draftCount,
  closedCount,
  applicationsCount,
  applicationBreakdown,
}) {
  const totalJobs = jobs?.total ?? (activeCount || 0) + (draftCount || 0) + (closedCount || 0);
  const activeJobs = jobs?.active ?? activeCount ?? 0;
  const draftJobs = jobs?.draft ?? draftCount ?? 0;
  const closedJobs = jobs?.closed ?? closedCount ?? 0;

  const totalApps = applications?.total ?? applicationsCount ?? 0;
  const newApps = applications?.new ?? 0;
  const viewedApps = applications?.viewed ?? 0;

  const appsBreakdown =
    applicationBreakdown ||
    (applications
      ? `${newApps} New · ${viewedApps} Viewed`
      : "Applications received");

  const cards = [
    {
      title: "ACTIVE JOBS",
      value: activeJobs,
      badgeText: `Total: ${totalJobs}`,
      supporting: `Active positions (${totalJobs} total listings)`,
      icon: (
        <svg
          className="w-5 h-5 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      badgeBg: "bg-emerald-50",
      accentBorder: "border-l-4 border-l-emerald-500",
    },
    {
      title: "DRAFT JOBS",
      value: draftJobs,
      supporting: "Jobs saved internally but not published",
      icon: (
        <svg
          className="w-5 h-5 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      badgeBg: "bg-amber-50",
      accentBorder: "border-l-4 border-l-amber-400",
    },
    {
      title: "CLOSED JOBS",
      value: closedJobs,
      supporting: "Archived positions closed to applications",
      icon: (
        <svg
          className="w-5 h-5 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      badgeBg: "bg-slate-100",
      accentBorder: "border-l-4 border-l-slate-400",
    },
    {
      title: "TOTAL APPLICATIONS",
      value: totalApps,
      supporting: appsBreakdown,
      icon: (
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      badgeBg: "bg-[#525599]/10",
      accentBorder: "border-l-4 border-l-primary",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Skeleton Top Meta Line */}
        <div className="flex items-center justify-between text-xs px-0.5 animate-pulse">
          <div className="h-3.5 w-32 bg-slate-200 rounded" />
          <div className="h-5 w-28 bg-slate-100 rounded-full" />
        </div>

        {/* Skeleton 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs animate-pulse flex flex-col justify-between h-[152px]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
                </div>
                <div className="mt-3">
                  <div className="h-8 w-14 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="h-3 w-36 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Meta Line with Live MongoDB Data Indicator */}
      <div className="flex items-center justify-between text-xs text-muted px-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-slate-500">
            Platform Overview
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-medium text-slate-600">
            {totalJobs} Total Jobs ({activeJobs} Active, {draftJobs} Draft, {closedJobs} Closed)
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Live MongoDB data
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${card.accentBorder}`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl ${card.badgeBg} flex items-center justify-center shrink-0`}
                >
                  {card.icon}
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-heading tracking-tight">
                  {card.value}
                </span>
                {card.badgeText && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {card.badgeText}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed mt-3 pt-3 border-t border-slate-100 font-normal">
              {card.supporting}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
