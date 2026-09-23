import Link from "next/link";

/**
 * CareersLandingHero Component
 * 
 * Clean, premium hero matching the GharPadharo reference design:
 * - Left: Eyebrow, H1 ("Build something meaningful with GharPadharo."), description, dual CTAs.
 * - Right: Single unified visual panel featuring Uttarakhand mountain illustration, 
 *   warm sun, atmospheric ridges, and signature typography ("People. Technology. Communities. a Better Tomorrow").
 */
export default function CareersLandingHero() {
  return (
    <section className="w-full bg-white border-b border-border/60 py-12 sm:py-16 lg:py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Copy, and CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              BUILD THE FUTURE WITH US
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-heading tracking-tight leading-[1.14]">
              Build something
              <br />
              meaningful with
              <br />
              <span className="text-primary">GharPadharo.</span>
            </h1>

            <p className="text-sm sm:text-base text-body leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
              Join a team of curious people building technology, products, and
              experiences that make a real difference.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/careers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm sm:text-base font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Explore Open Positions</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <Link
                href="/#life-at-gharpadharo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-semibold transition-all duration-200 shadow-2xs text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Life at GharPadharo</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Unified Visual Panel with Uttarakhand Mountain Art */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px] aspect-[16/11] rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden bg-gradient-to-b from-[#eef2ff] via-[#f1f5f9] to-[#e2e8f0]/60 p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Typography Elements */}
              <div className="flex justify-between items-start relative z-10">
                {/* Brand Callout */}
                <div className="font-serif italic text-slate-700 leading-tight">
                  <p className="text-sm sm:text-base font-medium text-slate-600">People.</p>
                  <p className="text-sm sm:text-base font-medium text-slate-600">Technology.</p>
                  <p className="text-sm sm:text-base font-medium text-slate-600">Communities.</p>
                  <div className="relative inline-block mt-0.5">
                    <p className="text-sm sm:text-base font-semibold text-primary">a Better Tomorrow</p>
                    <div className="h-0.5 w-12 bg-primary/60 rounded-full mt-0.5" />
                  </div>
                </div>

                {/* Sub-values */}
                <div className="text-right text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 space-y-1 uppercase font-sans">
                  <p>BELONG.</p>
                  <p>BUILD.</p>
                  <p>GROW.</p>
                </div>
              </div>

              {/* Sun & Himalayan Mountain Landscape Illustration (SVG) */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
                {/* Sun Rising behind Peaks */}
                <div className="absolute right-20 sm:right-28 bottom-20 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#fef08a] shadow-[0_0_40px_#fef08a] opacity-80" />

                {/* Distant Birds */}
                <svg className="absolute right-12 top-28 w-12 h-6 text-slate-400/80" viewBox="0 0 48 24" fill="none" stroke="currentColor">
                  <path d="M2,12 Q6,6 10,12 Q14,6 18,12" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M24,6 Q28,2 32,6 Q36,2 40,6" strokeWidth="1" strokeLinecap="round" />
                  <path d="M36,18 Q39,15 42,18 Q45,15 48,18" strokeWidth="0.8" strokeLinecap="round" />
                </svg>

                {/* Layered Mountain Peaks & Pine Forest */}
                <svg
                  className="absolute bottom-0 left-0 right-0 w-full h-[62%] text-slate-600"
                  viewBox="0 0 600 240"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  {/* Distant Snow Peaks (White/Pale Violet) */}
                  <polygon points="0,240 70,120 160,170 260,80 340,140 460,70 540,150 600,100 600,240" fill="#cbd5e1" fillOpacity="0.45" />
                  <polygon points="260,80 230,125 285,115" fill="#f8fafc" fillOpacity="0.9" />
                  <polygon points="460,70 435,115 485,110" fill="#f8fafc" fillOpacity="0.9" />

                  {/* Mid-range Ridge (Indigo/Slate) */}
                  <polygon points="0,240 40,160 140,130 220,175 320,120 420,165 520,115 600,160 600,240" fill="#94a3b8" fillOpacity="0.55" />

                  {/* Foreground Mountain (Deeper Blue/Purple) */}
                  <polygon points="0,240 100,160 210,210 330,155 450,205 570,145 600,170 600,240" fill="#64748b" fillOpacity="0.65" />

                  {/* Near Slope with Pine Trees Silhouette */}
                  <polygon points="0,240 0,195 180,240" fill="#475569" fillOpacity="0.8" />
                  <polygon points="360,240 500,185 600,200 600,240" fill="#334155" fillOpacity="0.85" />

                  {/* Pine Trees Silhouette on the Right */}
                  <g fill="#1e293b" opacity="0.9">
                    {/* Tree cluster 1 */}
                    <polygon points="560,240 550,215 555,215 548,195 553,195 545,175 555,175 550,155 560,175 570,175 563,195 568,195 560,215 565,215" />
                    {/* Tree cluster 2 */}
                    <polygon points="585,240 577,215 581,215 575,190 579,190 572,170 580,170 576,150 584,170 592,170 587,190 591,190 585,215 589,215" />
                    {/* Tree cluster 3 */}
                    <polygon points="530,240 523,220 527,220 521,200 525,200 518,180 526,180 522,165 530,180 538,180 533,200 537,200 531,220 535,220" />
                    {/* Left tree */}
                    <polygon points="40,240 35,225 38,225 33,210 36,210 30,195 38,195 35,180 42,195 50,195 44,210 47,210 42,225 45,225" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
