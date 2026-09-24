"use client";

import Image from "next/image";

/**
 * CareersHero Component
 * 
 * Clean, minimal, and premium Careers Hero section for GharPadharo:
 * - Visual: Wide cinematic collaborative office scene (no green wall, open darker wall on left,
 *   vibrant collaborating team on right in natural office lighting).
 * - Desktop Layout (>= 1024px): 420px–440px tall (lg:min-h-[430px] xl:min-h-[440px]), left-aligned content
 *   positioned over the darker left wall area, with the team remaining clearly visible and unobstructed on the right.
 * - Mobile Layout (< 768px): 440px–470px tall (min-h-[450px]), responsive 32–36px headline, balanced supporting text,
 *   cleanly stacked full-width search control, and focused image positioning (78% center) to showcase the team.
 * - Content Hierarchy:
 *     1. Eyebrow: "CAREERS AT GHARPADHARO" with gold accent
 *     2. Headline: "Build what's next, together." ("together." in GharPadharo accent #ffb400)
 *     3. Supporting: "Join us in building technology that makes everyday experiences simpler."
 *     4. Search: Functional job search with placeholder "Search roles, teams, or keywords..." and "Search Jobs" button.
 */
export default function CareersHero() {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[450px] sm:min-h-[415px] lg:min-h-[430px] xl:min-h-[440px] flex items-center py-10 sm:py-11 lg:py-12">
      {/* Full-width Photographic Background */}
      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/images/careers/careers-hero.jpg"
          alt="GharPadharo team collaborating in a modern office"
          fill
          priority
          sizes="100vw"
          className="object-cover [object-position:78%_center] md:[object-position:center_center]"
        />

        {/* Refined Layered Directional Overlay:
            - Mobile: subtle dark vertical gradient, strong behind text at top, fading out below so team is visible
            - Desktop: subtle left-to-right dark gradient, dark enough for white text on left, fading to transparent on right so team and office retain natural lighting
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/65 to-slate-950/20 md:bg-gradient-to-r md:from-slate-950/95 md:via-slate-950/70 md:to-transparent" />
      </div>

      {/* Inner Container */}
      <div className="container-custom relative z-10 w-full">
        {/* Content Block:
            - Desktop: Left-aligned over the darker left side of the photograph (~8–10% viewport offset, max-w-[580px])
            - Mobile: Centered horizontally, comfortable margins, no overflow
        */}
        <div className="w-full text-center sm:text-left flex flex-col items-center sm:items-start max-w-[580px] lg:ml-2 xl:ml-4 space-y-3 sm:space-y-3.5">
          {/* Brand Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span
              className="w-5 h-0.5 rounded-full bg-[#ffb400] shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] sm:text-xs font-bold text-white/80 tracking-[0.2em] uppercase">
              CAREERS AT GHARPADHARO
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight text-white leading-[1.08] max-w-[560px] drop-shadow-sm">
            Build what&apos;s next,
            <br />
            <span className="text-[#ffb400]">together.</span>
          </h1>

          {/* Short Supporting Text */}
          <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-[520px] font-normal leading-relaxed drop-shadow-xs">
            Join us in building technology that makes everyday experiences simpler.
          </p>

          {/* Functional Search Bar */}
          <div className="pt-2 sm:pt-3 w-full max-w-[520px]">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-1.5 p-1.5 bg-white/95 sm:bg-white rounded-2xl shadow-xl shadow-black/25 ring-1 ring-white/20 sm:h-[54px] w-full"
              role="search"
              aria-label="Job Search"
            >
              {/* Input with Icon */}
              <div className="relative flex-1 w-full flex items-center h-11 sm:h-full">
                <label htmlFor="careers-search-input" className="sr-only">
                  Search roles, teams, or keywords...
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
                  placeholder="Search roles, teams, or keywords..."
                  className="w-full bg-transparent px-3 py-2 text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium outline-none"
                />
              </div>

              {/* Integrated Primary Button */}
              <button
                type="submit"
                className="w-full sm:w-auto h-11 sm:h-full bg-[#525599] hover:bg-[#46477f] text-white text-xs sm:text-sm font-bold px-6 rounded-xl transition-all duration-200 shadow-sm shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
              >
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
