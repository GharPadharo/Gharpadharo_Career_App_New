import Link from "next/link";
import ScrollReveal from "@/components/common/ScrollReveal";

/**
 * GeneralApplicationCTA Component
 * 
 * Standalone General Application CTA panel matching the reference design:
 * - Purple panel: "Didn't find the right role?"
 * - White button: "Submit your resume" -> /jobs/general-application
 */
export default function GeneralApplicationCTA() {
  return (
    <section
      aria-labelledby="general-application-heading"
      className="w-full bg-[#F8F6FD] pb-12 sm:pb-16"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="w-full bg-[#4D2BD6] rounded-2xl sm:rounded-3xl p-7 sm:p-9 lg:p-11 shadow-[0_12px_36px_rgba(77,43,214,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5 sm:space-y-2 max-w-xl text-left">
              <h2
                id="general-application-heading"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                Didn&apos;t find the right role?
              </h2>
              <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed">
                Share your resume and we&apos;ll reach out when a fit opens up.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/jobs/general-application"
                className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#4D2BD6] text-sm sm:text-base font-bold px-6 sm:px-7 py-3 rounded-xl shadow-xs transition-all duration-200 active:scale-95"
              >
                <span>Submit your resume</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
