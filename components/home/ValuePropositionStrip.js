export default function ValuePropositionStrip() {
  const items = [
    {
      title: "Own meaningful work",
      description: "Take responsibility for problems that matter and see your ideas through.",
      icon: (
        <svg className="w-5.5 h-5.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      badgeBg: "bg-[#EDE9FE]/75 border border-purple-100/80",
    },
    {
      title: "Learn by doing",
      description: "Work on real challenges, experiment, and keep growing.",
      icon: (
        <svg className="w-5.5 h-5.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      badgeBg: "bg-blue-50/90 border border-blue-100/80",
    },
    {
      title: "Build with great people",
      description: "Collaborate closely, share ideas, and learn from each other.",
      icon: (
        <svg className="w-5.5 h-5.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      badgeBg: "bg-amber-50/90 border border-amber-100/80",
    },
    {
      title: "Make an impact",
      description: "Your work can improve how people find and experience a place.",
      icon: (
        <svg className="w-5.5 h-5.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      badgeBg: "bg-emerald-50/90 border border-emerald-100/80",
    },
  ];

  return (
    <section className="w-full bg-[#F8FAFC] border-b border-slate-200/60 py-6 sm:py-7 lg:py-8">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl sm:rounded-3xl py-6 sm:py-7 px-6 sm:px-8 lg:px-10 xl:px-12 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 xl:gap-9 items-start">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5 sm:gap-4">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${item.badgeBg} flex items-center justify-center shrink-0 shadow-2xs mt-0.5`}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm sm:text-[15px] lg:text-base font-bold text-heading tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-body font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
