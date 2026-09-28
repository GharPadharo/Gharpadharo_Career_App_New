import Link from "next/link";

/**
 * GeneralApplicationCTA Component
 * 
 * Refined, compact CTA section rendered after the active job listings and pagination
 * on the public /jobs page. Directs candidates who didn't find a matching
 * opening to submit a general application.
 */
export default function GeneralApplicationCTA() {
  return (
    <section
      aria-labelledby="general-application-heading"
      className="w-full bg-[#f8fafc] pt-5 pb-9 sm:pt-6 sm:pb-12"
    >
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#525599]/[0.025] border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors p-6 sm:p-7 text-center max-w-2xl mx-auto space-y-3.5">
          {/* Subtle Decorative Detail: Delicate top accent glow & corner ambient accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary/[0.05] blur-2xl pointer-events-none"
          />

          {/* Heading (Primary Focal Point) */}
          <h2
            id="general-application-heading"
            className="relative z-10 text-xl sm:text-2xl lg:text-[26px] font-extrabold text-heading tracking-tight leading-snug"
          >
            Didn&apos;t find the right opportunity?
          </h2>

          {/* Call to Action Button */}
          <div className="relative z-10 pt-0.5">
            <Link
              href="/jobs/general-application"
              className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-primary hover:bg-[#46477f] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 cursor-pointer"
            >
              <span>Submit Your Resume</span>
              <svg
                className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
