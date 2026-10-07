import Link from "next/link";

function getTeamIcon(team = "") {
  const t = team.toLowerCase();
  if (t.includes("engineer") || t.includes("tech") || t.includes("dev")) {
    return {
      bg: "bg-blue-50 text-blue-600 border border-blue-100/70",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    };
  }
  if (t.includes("product")) {
    return {
      bg: "bg-indigo-50 text-indigo-600 border border-indigo-100/70",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    };
  }
  if (t.includes("design") || t.includes("brand")) {
    return {
      bg: "bg-purple-50 text-purple-600 border border-purple-100/70",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4c.7 0 1.36.17 1.94.48L17 5.42a2.5 2.5 0 113.54 3.54L12.48 17.06c.31.58.48 1.24.48 1.94a4 4 0 01-4 4H7z" />
        </svg>
      ),
    };
  }
  if (t.includes("growth") || t.includes("market")) {
    return {
      bg: "bg-amber-50 text-amber-600 border border-amber-100/70",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    };
  }
  if (t.includes("operation") || t.includes("communit")) {
    return {
      bg: "bg-emerald-50 text-emerald-600 border border-emerald-100/70",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    };
  }
  return {
    bg: "bg-purple-50 text-primary border border-purple-100/70",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };
}

export default function OpenPositionsSection({ jobs = [] }) {
  // Filter active jobs, sort by latest first, and display at most 3
  const activeJobs = (jobs || []).filter((j) => (j.status ? j.status === "active" : true));
  const sortedJobs = [...activeJobs].sort(
    (a, b) => new Date(b.postedAt || b.createdAt || 0) - new Date(a.postedAt || a.createdAt || 0)
  );
  const displayJobs = sortedJobs.slice(0, 3);

  return (
    <section id="open-positions" className="w-full py-20 lg:py-24 bg-white border-b border-slate-200/60 scroll-mt-20">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-2">
              OPEN POSITIONS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-extrabold text-heading tracking-tight leading-snug">
              Find your place at GharPadharo.
            </h2>
            <p className="text-base sm:text-lg text-body mt-2 font-normal leading-relaxed max-w-2xl">
              Explore opportunities across engineering, product, design, growth, and operations.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-primary hover:text-primary-hover hover:underline transition-colors shrink-0 pt-2 sm:pt-0"
          >
            <span>View all jobs</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Jobs Grid (3 cards in one horizontal row on desktop) or Wide Horizontal Empty State */}
        {displayJobs.length === 0 ? (
          <div className="w-full bg-[#F8FAFC] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-7 sm:p-9 lg:p-11 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 min-h-[180px] sm:min-h-[195px]">
            {/* Left Column: Icon + Text Stack */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 max-w-3xl">
              <div
                className="w-12 h-12 rounded-xl bg-purple-50 text-primary border border-purple-100/80 flex items-center justify-center shrink-0 shadow-2xs"
                aria-hidden="true"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-heading tracking-tight">
                  No open positions right now.
                </h3>
                <p className="text-sm sm:text-[15px] text-body leading-relaxed font-normal">
                  We&apos;re always interested in meeting thoughtful people. Submit your resume and we&apos;ll keep you in mind for future opportunities.
                </p>
              </div>
            </div>

            {/* Right Column: CTA Button */}
            <div className="shrink-0 w-full sm:w-auto pt-2 md:pt-0">
              <Link
                href="/jobs/general-application"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Submit Your Resume</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayJobs.map((job) => {
              const teamIconConfig = getTeamIcon(job.team);
              const locationStr = job.location || job.workMode || "Dehradun";
              const experienceStr = job.experience || "All levels";

              return (
                <article
                  key={job.id}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] hover:border-primary/40 p-5 sm:p-6 shadow-2xs hover:shadow-xs hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full"
                >
                  {/* Card Top: Icon Badge & Job Type Pill */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${teamIconConfig.bg} flex items-center justify-center shrink-0 shadow-2xs`}
                        aria-hidden="true"
                      >
                        {teamIconConfig.icon}
                      </div>

                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        {job.type || "Full-time"}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-base sm:text-lg font-bold text-heading tracking-tight group-hover:text-primary transition-colors">
                      <Link href={`/jobs/${job.id}`} className="focus:outline-hidden focus:underline">
                        {job.title}
                      </Link>
                    </h3>

                    {/* Job Metadata Stack */}
                    <div className="space-y-2 mt-4 text-xs sm:text-[13px] text-body font-normal">
                      {/* Team */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="truncate">{job.team}</span>
                      </div>

                      {/* Location / Work Mode */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{locationStr}</span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">{experienceStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Posted Date & View Role Link */}
                  <div className="border-t border-slate-100 pt-4 mt-5 sm:mt-6 flex items-center justify-between">
                    <span className="text-xs text-muted font-normal">
                      {job.postedText || "Recently posted"}
                    </span>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary group-hover:text-primary-hover group-hover:translate-x-0.5 transition-all"
                    >
                      <span>View role</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
