/**
 * WhyGharPadharo Component
 * 
 * Clean, compact values section matching the reference mockup:
 * - Eyebrow: WHY GHARPADHARO
 * - Heading: More than just a job
 * - Subtitle: We're building a culture where people can do their best work and make a real impact.
 * - 4 Cards: Purpose (heart), Learn (book), Ownership (bolt), Grow (team).
 */
export default function WhyGharPadharo() {
  const pillars = [
    {
      title: "Build with purpose",
      description:
        "Work on products and technology that solve meaningful problems.",
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      badgeBg: "bg-purple-50",
    },
    {
      title: "Learn continuously",
      description:
        "Grow through challenging projects and knowledge sharing.",
      icon: (
        <svg className="w-5 h-5 text-[#2058e4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      badgeBg: "bg-blue-50",
    },
    {
      title: "Own your work",
      description:
        "Take responsibility, contribute ideas, and create impact.",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      badgeBg: "bg-amber-50",
    },
    {
      title: "Grow together",
      description:
        "Work with people from different disciplines and learn from one another.",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      badgeBg: "bg-emerald-50",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-20 bg-background border-b border-border/60">
      <div className="container-custom">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1.5">
            WHY GHARPADHARO
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
            More than just a job
          </h2>
          <p className="text-sm sm:text-base text-body mt-2 font-normal leading-relaxed">
            We&apos;re building a culture where people can do their best work and make a real impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-start"
            >
              <div
                className={`w-11 h-11 rounded-xl ${pillar.badgeBg} flex items-center justify-center mb-5 shrink-0`}
              >
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-body mt-2 leading-relaxed font-normal">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
