import Link from "next/link";
import { mockJobs } from "@/lib/mockJobs";

const badgeColorMap = {
  "Full-time": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Part-time": "bg-purple-50 text-purple-700 border-purple-200/80",
  Internship: "bg-blue-50 text-blue-700 border-blue-200/80",
  Contract: "bg-amber-50 text-amber-700 border-amber-200/80",
};

/**
 * OpenPositionsPreview Component
 * 
 * Clean, compact preview of 3 current roles pulled directly from lib/mockJobs.js.
 * Matches reference layout with metadata icons and direct link to /careers/jobs/[id].
 */
export default function OpenPositionsPreview() {
  const previewJobs = mockJobs.slice(0, 3);

  return (
    <section className="w-full py-16 lg:py-20 bg-white border-b border-border/60">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1.5">
              OPPORTUNITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
              Find your next opportunity
            </h2>
            <p className="text-sm sm:text-base text-body mt-1.5 font-normal leading-relaxed">
              Explore open roles across technology, product, operations, marketing, and more.
            </p>
          </div>

          <Link
            href="/careers"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover hover:underline transition-colors shrink-0"
          >
            <span>View all open positions</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* 3 Compact Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewJobs.map((job) => {
            const badgeClasses =
              badgeColorMap[job.type] || "bg-slate-50 text-slate-700 border-slate-200";

            return (
              <article
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between gap-6 shadow-xs hover:shadow-md transition-shadow duration-200"
              >
                <div className="space-y-4">
                  {/* Title & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      <Link
                        href={`/careers/jobs/${job.id}`}
                        className="hover:text-primary transition-colors focus:outline-none focus:underline"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${badgeClasses}`}
                    >
                      {job.type}
                    </span>
                  </div>

                  {/* Metadata with Icons */}
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                    {/* Team */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.team}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{job.location}</span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                      </svg>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Date & Direct Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <time dateTime="2026-09-21" className="text-slate-400 text-xs">
                    {job.postedText}
                  </time>
                  <Link
                    href={`/careers/jobs/${job.id}`}
                    aria-label={`View role details for ${job.title}`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
                  >
                    <span>View role</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/careers"
            className="w-full inline-flex items-center justify-center gap-2 btn-primary px-6 py-3 rounded-xl shadow-xs text-sm font-bold"
          >
            <span>View all open positions</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
