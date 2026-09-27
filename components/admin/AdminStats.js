/**
 * AdminStats Component
 * 
 * 4 Overview Stat Cards for Admin Dashboard:
 * 1. Active Jobs (currently active & accepting applications)
 * 2. Draft Jobs (saved internally but not active)
 * 3. Closed Jobs (archived positions closed to applications)
 * 4. Total Applications (applications received)
 * 
 * Clean, restrained design matching GharPadharo design tokens.
 */
export default function AdminStats({
  activeCount = 0,
  draftCount = 0,
  closedCount = 0,
  applicationsCount = 0,
  applicationBreakdown = null,
}) {
  const cards = [
    {
      title: "ACTIVE JOBS",
      value: activeCount,
      supporting: "Currently active and accepting applications",
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
      value: draftCount,
      supporting: "Jobs saved internally but not active",
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
      value: closedCount,
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
      value: applicationsCount,
      supporting: applicationBreakdown || "Applications received",
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

  return (
    <div className="space-y-3">
      {/* Top Meta Line with Demo Data Indicator */}
      <div className="flex items-center justify-between text-xs text-muted px-0.5">
        <span className="font-semibold uppercase tracking-wider text-slate-500">
          Platform Overview
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          Frontend preview data
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

              <div className="mt-3">
                <span className="text-3xl font-extrabold text-heading tracking-tight">
                  {card.value}
                </span>
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
