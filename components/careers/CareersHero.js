"use client";

import Image from "next/image";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";
import ScrollReveal from "@/components/common/ScrollReveal";

/**
 * CareersHero Component
 * 
 * Deep navy hero banner matching the reference design:
 * - Eyebrow: "CAREERS AT GHARPADHARO" in warm yellow (#FFB400)
 * - Heading: "Build what's next, together." with "together." highlighted in warm yellow
 * - Supporting: "Join us in building technology that makes everyday experiences simpler."
 * - Search bar: Placeholder "Search roles, teams or skills" with purple "Search jobs" CTA
 * - Right side on desktop: Team photo blending seamlessly into deep navy background
 */
export default function CareersHero({ searchQuery = "", onSearchChange }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const openingsEl = document.getElementById("openings");
    if (openingsEl) {
      openingsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#11152F] py-14 sm:py-18 lg:py-22 xl:py-24 min-h-[440px] lg:min-h-[480px] flex items-center">
      {/* Right-aligned Photographic Asset on Desktop with Seamless Gradient Fade */}
      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden hidden sm:block"
        aria-hidden="true"
      >
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] lg:w-[50%] xl:w-[48%] h-full">
          <Image
            src={WEBSITE_IMAGES.brand.careersHeroOffice}
            alt="GharPadharo team collaborating in modern office"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 50vw, 48vw"
            className="object-cover object-center opacity-70 lg:opacity-85"
          />
          {/* Gradients to blend smoothly into the navy background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#11152F] via-[#11152F]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11152F] via-transparent to-[#11152F]/40" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full text-left max-w-xl lg:max-w-[580px] space-y-4 sm:space-y-4.5">
          <ScrollReveal variant="fade-up">
            {/* Eyebrow in warm yellow/gold */}
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-[#FFB400] tracking-[0.18em] uppercase block">
                CAREERS AT GHARPADHARO
              </span>
            </div>

            {/* Heading with "together." in warm yellow */}
            <h1 className="text-[34px] sm:text-[42px] md:text-[48px] lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.08] mt-4">
              Build what&apos;s next,
              <br />
              <span className="text-[#FFB400]">together.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base lg:text-[17px] text-white/85 font-normal leading-relaxed max-w-[500px] mt-4">
              Join us in building technology that makes everyday experiences simpler.
            </p>
          </ScrollReveal>

          {/* Search Bar Input */}
          <ScrollReveal variant="fade-up" delay={80}>
            <div className="pt-2 sm:pt-3 w-full max-w-[520px]">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white rounded-2xl shadow-xl w-full"
                role="search"
                aria-label="Job Search"
              >
                <div className="relative flex-1 w-full flex items-center h-11 sm:h-12">
                  <label htmlFor="careers-search-input" className="sr-only">
                    Search roles, teams or skills
                  </label>
                  <svg
                    className="w-4.5 h-4.5 text-slate-400 ml-3.5 shrink-0 pointer-events-none"
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
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search roles, teams or skills"
                    className="w-full bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 text-sm font-medium outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 sm:h-12 bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] text-white text-sm font-semibold px-6 rounded-xl transition-all duration-200 shrink-0 cursor-pointer active:scale-98 flex items-center justify-center whitespace-nowrap"
                >
                  Search jobs
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
