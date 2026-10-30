"use client";

import Image from "next/image";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";
import ScrollReveal from "@/components/common/ScrollReveal";

/**
 * CareersHero Component
 * 
 * Soft lavender-tinted hero banner with smooth translucent gradient:
 * - Heading: "Build what's next," in near-black (#111827) and "together." in brand purple (#5929D6)
 * - Description: Dark slate (#334155) for crisp readability
 * - Search bar: Placeholder "Search roles, teams or skills" with purple (#5929D6) "Search jobs" CTA
 * - Background: Soft lavender (#E9E5FF / #EDE9FE) translucent gradient overlay smoothly revealing office photography
 * - Bottom edge: Simple, straight horizontal border with no waves, curves, or dividers
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
    <section className="relative w-full overflow-hidden bg-[#EDE9FE] py-14 sm:py-18 lg:py-22 xl:py-24 min-h-[440px] lg:min-h-[480px] flex items-center border-b border-[#E2DCF7]">
      {/* Background Photographic Asset */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <Image
          src={WEBSITE_IMAGES.brand.careersHeroOffice}
          alt="GharPadharo team collaborating in modern office"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-[78%_center] lg:object-[82%_center] xl:object-right"
        />
      </div>

      {/* Responsive Translucent Soft Lavender Gradient Overlay */}
      <div
        className="jobs-hero-overlay absolute inset-0 w-full h-full pointer-events-none z-1"
        aria-hidden="true"
      />

      {/* Component-scoped responsive gradient styles */}
      <style>{`
        .jobs-hero-overlay {
          background: linear-gradient(
            180deg,
            rgba(233, 229, 255, 0.97) 0%,
            rgba(237, 233, 254, 0.92) 45%,
            rgba(237, 233, 254, 0.50) 72%,
            rgba(237, 233, 254, 0.15) 100%
          );
        }
        @media (min-width: 640px) {
          .jobs-hero-overlay {
            background: linear-gradient(
              90deg,
              rgba(233, 229, 255, 0.98) 0%,
              rgba(233, 229, 255, 0.93) 30%,
              rgba(233, 229, 255, 0.65) 52%,
              rgba(233, 229, 255, 0.20) 74%,
              rgba(233, 229, 255, 0) 90%
            );
          }
        }
        @media (min-width: 1024px) {
          .jobs-hero-overlay {
            background: linear-gradient(
              90deg,
              rgba(233, 229, 255, 0.98) 0%,
              rgba(233, 229, 255, 0.94) 25%,
              rgba(233, 229, 255, 0.70) 42%,
              rgba(233, 229, 255, 0.28) 60%,
              rgba(233, 229, 255, 0) 78%
            );
          }
        }
      `}</style>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full text-left max-w-xl lg:max-w-[580px] space-y-4 sm:space-y-4.5">
          <ScrollReveal variant="fade-up">
            {/* Heading: "Build what's next," in near-black (#111827) and "together." in brand purple (#5929D6) */}
            <h1 className="text-[34px] sm:text-[42px] md:text-[48px] lg:text-[54px] font-extrabold tracking-tight leading-[1.08]">
              <span className="text-[#111827]">
                Build what&apos;s next,
                <br />
              </span>
              <span className="text-[#5929D6]">together.</span>
            </h1>

            {/* Supporting Description in dark slate (#334155) */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#334155] font-semibold leading-relaxed max-w-[500px] mt-4">
              Join us in building technology that makes everyday experiences simpler.
            </p>
          </ScrollReveal>

          {/* Search Bar Input */}
          <ScrollReveal variant="fade-up" delay={80}>
            <div className="pt-2 sm:pt-3 w-full max-w-[520px]">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-[#E2DCF7] rounded-2xl shadow-lg shadow-[#5929D6]/5 w-full"
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
