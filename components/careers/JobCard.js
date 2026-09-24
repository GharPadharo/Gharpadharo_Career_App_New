import Link from "next/link";

const badgeColorMap = {
  "Full-time": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Part-time": "bg-purple-50 text-purple-700 border-purple-200/80",
  Internship: "bg-blue-50 text-blue-700 border-blue-200/80",
  Contract: "bg-amber-50 text-amber-700 border-amber-200/80",
};

export default function JobCard({ job }) {
  const badgeClasses =
    badgeColorMap[job.type] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between gap-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            <Link
              href={`/jobs/${job.id}`}
              className="hover:text-primary transition-colors focus:outline-none focus:underline"
            >
              {job.title}
            </Link>
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}
          >
            {job.type}
          </span>
        </div>
        <time
          dateTime="2026-09-21"
          className="text-xs text-slate-400 font-medium whitespace-nowrap"
        >
          {job.postedText}
        </time>
      </div>

      {/* Meta Information: Team, Location & Experience */}
      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
        {/* Team */}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>{job.team}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{job.location}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <span>{job.experience}</span>
        </div>
      </div>

      {/* Short Job Description */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
        {job.description}
      </p>

      {/* Bottom Action Row: Skills tags on left, View full job details & Apply Now on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
        {/* Skills / Tags */}
        <div
          className="flex flex-wrap items-center gap-1.5"
          aria-label="Required skills"
        >
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-slate-100/90 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
          {/* Secondary Link: View full job details */}
          <Link
            href={`/jobs/${job.id}`}
            aria-label={`View full job details for ${job.title}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded py-1 px-1"
          >
            <span>View full job details</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>

          {/* Primary CTA: Apply Now */}
          <Link
            href={`/jobs/${job.id}/apply`}
            aria-label={`Apply for ${job.title}`}
            className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs transition-all duration-200 shrink-0 active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span>Apply Now</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
