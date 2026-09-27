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
      title: "Trust matters",
      description:
        "We care about verified information and genuine property listings because people make important decisions based on what they see on the platform.",
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      badgeBg: "bg-purple-50",
    },
    {
      title: "Transparency by design",
      description:
        "We believe people should have clearer information about properties, availability and the rental experience.",
      icon: (
        <svg className="w-5 h-5 text-[#2058e4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badgeBg: "bg-blue-50",
    },
    {
      title: "People first",
      description:
        "Digital tools are only useful when they make a real experience easier for the people using them.",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      badgeBg: "bg-amber-50",
    },
    {
      title: "Direct connections",
      description:
        "We help property seekers and owners connect more directly, reducing unnecessary friction in the rental journey.",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
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
            Because finding a place should be simpler.
          </h2>
          <p className="text-sm sm:text-base text-body mt-2 font-normal leading-relaxed">
            Finding a room or home can involve outdated listings, unclear information, unnecessary brokerage and too many middlemen. GharPadharo is working to make that experience more direct, transparent and trustworthy.
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
