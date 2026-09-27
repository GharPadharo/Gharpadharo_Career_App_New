/**
 * CandidateActivity Component
 * 
 * Applications overview section with transparent empty state:
 * - Eyebrow: APPLICATIONS
 * - Heading: Candidate activity
 * - Heading: No applications yet
 * - Description: Candidate applications will appear here once application storage is connected.
 * - Disabled CTA: View Applications with "Coming soon" badge
 */
export default function CandidateActivity() {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1">
          APPLICATIONS
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-heading tracking-tight">
          Candidate activity
        </h2>
      </div>

      {/* Empty State Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-4 shadow-2xs">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4 0 2.25 2.25 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          No applications yet
        </h3>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mt-1.5 leading-relaxed font-normal">
          Candidate applications will appear here once application storage is
          connected.
        </p>

        {/* Disabled Secondary CTA */}
        <div className="mt-5">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs sm:text-sm font-semibold cursor-not-allowed shadow-2xs select-none"
            aria-disabled="true"
          >
            <span>View Applications</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-md">
              Coming soon
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
