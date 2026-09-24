/**
 * AdminStats Component
 * 
 * 4 Summary Metrics Cards for Admin Dashboard:
 * - Active Jobs
 * - Draft Jobs
 * - Total Applications
 * - Published Jobs
 */
export default function AdminStats({
  activeCount = 6,
  draftCount = 0,
  applicationsCount = 0,
  publishedCount = 6,
}) {
  const cards = [
    {
      title: "Active Jobs",
      value: activeCount,
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: "bg-primary/10",
    },
    {
      title: "Draft Jobs",
      value: draftCount,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      bg: "bg-amber-50",
    },
    {
      title: "Total Applications",
      value: applicationsCount,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: "bg-blue-50",
    },
    {
      title: "Published Jobs",
      value: publishedCount,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-card rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              {card.title}
            </span>
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-heading tracking-tight">
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
