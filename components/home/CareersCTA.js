import Link from "next/link";

/**
 * CareersCTA Component
 * 
 * Minimalist, high-impact CTA banner matching the reference design:
 * - Solid brand purple (#525599) rounded container.
 * - Left: "Ready to build something meaningful?" + subtitle.
 * - Right: White "Explore Open Positions →" button linking to /jobs.
 */
export default function CareersCTA() {
  return (
    <section className="w-full py-14 lg:py-20 bg-background">
      <div className="container-custom">
        <div className="rounded-3xl bg-[#525599] text-white p-8 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          {/* Left Text */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Ready to build something meaningful?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-normal leading-relaxed">
              Explore our open positions and find a role where you can make an impact.
            </p>
          </div>

          {/* Right Button */}
          <div className="shrink-0 w-full sm:w-auto text-center">
            <Link
              href="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Explore Open Positions</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
