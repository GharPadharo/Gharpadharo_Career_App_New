"use client";

export default function CareersHero() {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#2058e4] via-[#3b5ae8] to-[#525599] text-white py-8 sm:py-10 lg:py-12">
      {/* Subtle Background Decorative Line Art (Uttarakhand-inspired) */}
      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Ambient Top Corner Callouts (Desktop only) */}
        <div className="hidden lg:block absolute left-8 top-6 -rotate-6 text-left opacity-70">
          <p className="font-serif italic text-xs tracking-wider text-blue-100">
            Build
            <br />
            a better
            <br />
            tomorrow
          </p>
        </div>
        <div className="hidden lg:block absolute right-8 top-6 rotate-6 text-right opacity-70">
          <p className="font-serif italic text-xs tracking-wider text-blue-100">
            People
            <br />
            Places
            <br />
            Possibilities
          </p>
        </div>

        {/* Ambient Soft Glows */}
        <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute -bottom-16 right-1/4 h-64 w-64 rounded-full bg-indigo-400/15 blur-3xl" />

        {/* Subtle Silhouette & Ridge Vector Line Art */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-28 text-white/20"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Left Mountains & Pine Trees */}
          <path d="M0,120 L80,65 L150,90 L230,45 L320,85 L420,55 L500,105 L600,80 L700,105 L800,50 L920,95 L1020,40 L1120,80 L1200,55 L1200,120 Z" fill="currentColor" fillOpacity="0.03" />
          <path d="M0,110 L90,60 L160,85 L240,40 L330,80 L430,50 L520,95 L610,75 L710,100 L810,45 L930,90 L1030,35 L1130,75 L1200,50" />
          <path d="M140,95 L220,55 L280,85" strokeDasharray="3 2" />
          <path d="M960,95 L1040,50 L1100,85" strokeDasharray="3 2" />

          {/* Left Pine Trees */}
          <path d="M18,120 L28,102 L38,120 M28,102 L28,120 M23,110 L28,102 L33,110" />
          <path d="M42,120 L50,106 L58,120 M50,106 L50,120" />
          <path d="M62,120 L74,98 L86,120 M74,98 L74,120 M68,108 L74,98 L80,108" />
          <path d="M92,120 L102,104 L112,120 M102,104 L102,120" />

          {/* Right Temple Silhouette (Kedarnath-style stepped outline) */}
          <g transform="translate(1080, 48)">
            {/* Temple Spire / Kalash & Flag */}
            <path d="M35,6 L35,0 M35,0 L42,3 L35,6" />
            <path d="M30,12 L35,6 L40,12 Z" />
            <path d="M26,18 L35,12 L44,18 Z" />
            {/* Temple Body Tiers */}
            <path d="M22,26 L48,26 M25,26 L25,40 L45,40 L45,26" />
            <path d="M18,40 L52,40 M20,40 L20,72 L50,72 L50,40" />
            <path d="M31,72 L31,56 Q35,52 39,56 L39,72" />
            <path d="M12,72 L58,72" />
          </g>

          {/* Right Trees */}
          <path d="M1035,120 L1045,102 L1055,120 M1045,102 L1045,120" />
          <path d="M1060,120 L1070,98 L1080,120 M1070,98 L1070,120" />

          {/* Flying Birds */}
          <path d="M280,32 Q288,24 296,32 Q304,24 312,32" strokeLinecap="round" />
          <path d="M308,20 Q314,14 320,20 Q326,14 332,20" strokeLinecap="round" strokeWidth="0.8" />
          <path d="M880,26 Q888,18 896,26 Q904,18 912,26" strokeLinecap="round" />
          <path d="M908,16 Q914,10 920,16 Q926,10 932,16" strokeLinecap="round" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="container-custom relative z-10 text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold tracking-tight text-white leading-[1.18] max-w-3xl mx-auto">
          We&apos;re not hiring employees
          <br />
          we&apos;re assembling{" "}
          <span className="text-cyan-300">
            inventors.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-2.5 text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto font-medium leading-relaxed">
          At GharPadharo, we want you to build a career where you&apos;re
          challenged, valued, and learning from the best. Step in. Feel welcome.
          Leave a mark.
        </p>

        {/* Compact Search Bar */}
        <div className="mt-6 max-w-[620px] mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-1.5 p-1.5 bg-white rounded-2xl shadow-xl shadow-blue-950/20 border border-white/20 sm:h-[50px]"
            role="search"
            aria-label="Job Search"
          >
            {/* Input with Icon */}
            <div className="relative flex-1 w-full flex items-center h-full">
              <label htmlFor="careers-search-input" className="sr-only">
                Search job titles, teams, or keywords
              </label>
              <svg
                className="w-4 h-4 text-slate-400 ml-3.5 shrink-0 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <input
                id="careers-search-input"
                type="text"
                placeholder="Search job titles, teams, or keywords..."
                className="w-full bg-transparent px-3 py-2 text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto h-9 sm:h-auto bg-[#4a52c7] hover:bg-[#3f45b5] text-white text-xs sm:text-sm font-bold px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-200 shadow-sm shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
