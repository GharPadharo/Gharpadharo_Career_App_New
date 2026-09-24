/**
 * AboutGharPadharo Component
 * 
 * Split section (id="about") matching reference design:
 * - Left: Clean minimalist line-art illustration of mountains, sun, and pines.
 * - Right: Eyebrow, Heading ("We are building what comes next."), two concise paragraphs, 
 *   and an external "Learn more →" link to https://www.gharpadharo.com/.
 */
export default function AboutGharPadharo() {
  return (
    <section
      id="about"
      className="w-full py-16 lg:py-24 bg-background border-b border-border/60 scroll-mt-20"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Clean Mountain Line Art Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="w-full max-w-[420px] aspect-[4/3] rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 flex items-center justify-center relative overflow-hidden shadow-xs">
              <svg
                className="w-full h-full text-primary"
                viewBox="0 0 320 200"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                {/* Sun Circle */}
                <circle cx="110" cy="80" r="22" fill="#e0e7ff" stroke="#cbd5e1" strokeWidth="1" />

                {/* Birds */}
                <path d="M190,40 Q194,36 198,40 Q202,36 206,40" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <path d="M208,30 Q212,26 216,30 Q220,26 224,30" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />

                {/* Mountain Ridge Lines */}
                <path
                  d="M10,180 L80,120 L130,150 L190,70 L250,140 L310,170"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40,180 L100,135 L160,170 L220,115 L280,165"
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />

                {/* Left Pine Trees */}
                <g strokeWidth="1.4" strokeLinejoin="round">
                  <path d="M30,190 L30,160 M22,175 L30,165 L38,175 M24,185 L30,175 L36,185" />
                  <path d="M45,190 L45,168 M39,180 L45,172 L51,180" />
                </g>

                {/* Right Pine Trees */}
                <g strokeWidth="1.4" strokeLinejoin="round">
                  <path d="M265,190 L265,155 M256,172 L265,160 L274,172 M258,182 L265,172 L272,182" />
                  <path d="M285,190 L285,165 M278,178 L285,170 L292,178" />
                </g>
              </svg>
            </div>
          </div>

          {/* Right Column: Mission Narrative & External Link */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              ABOUT GHARPADHARO
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-heading tracking-tight leading-[1.18]">
              Technology with a purpose.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-body leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              <p>
                GharPadharo is a technology-driven platform focused on making housing
                simpler and more transparent. Our work brings together technology,
                people, and real-world needs.
              </p>
            </div>

            <div className="pt-2 flex justify-center lg:justify-start">
              <a
                href="https://www.gharpadharo.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Learn more about GharPadharo</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
