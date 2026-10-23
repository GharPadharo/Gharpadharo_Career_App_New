import Image from "next/image";
import Link from "next/link";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";
import SectionBadge from "@/components/common/SectionBadge";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function LifeAtGharPadharoSection() {
  return (
    <section
      id="life-at-gharpadharo"
      className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-slate-200/60 relative overflow-hidden"
    >
      {/* Component-scoped styles for subtle hover transitions and reduced motion */}
      <style>{`
        .life-photo-card {
          box-shadow: 0 6px 20px rgba(89, 41, 214, 0.05);
          transition:
            border-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .life-photo-card:hover {
          border-color: #DDD6FE;
          box-shadow: 0 12px 30px -4px rgba(89, 41, 214, 0.10);
        }

        .hero-cta-sweep {
          position: relative;
          overflow: hidden;
          background-color: #5929D6;
        }
        .hero-cta-sweep::before {
          content: '';
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: #4D20BE;
          transform: translateX(-100%);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          pointer-events-none;
        }
        .hero-cta-sweep:hover::before {
          transform: translateX(0);
        }
        .hero-cta-sweep:active::before {
          background-color: #3F189F;
        }

        @media (prefers-reduced-motion: reduce) {
          .life-photo-zoom,
          .hero-cta-sweep::before {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Soft organic lavender gradient shapes in background */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[580px] h-[580px] bg-gradient-to-l from-purple-50/40 to-transparent rounded-full blur-2xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12 lg:gap-12 xl:gap-16 w-full">
          {/* ============================================================
              1. LEFT CONTENT COLUMN (~38-40% width on desktop)
             ============================================================ */}
          <div className="w-full lg:w-[40%] xl:w-[39%] shrink-0 text-left space-y-5 sm:space-y-6">
            <ScrollReveal variant="fade-up">
              <div>
                <SectionBadge className="mb-3.5">
                  LIFE AT GHARPADHARO
                </SectionBadge>
                <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold tracking-tight leading-[1.12]">
                  <span className="text-[#5929D6] block">People first.</span>
                  <span className="text-[#11152F] block mt-1 xl:whitespace-nowrap">
                    Problems worth solving.
                  </span>
                </h2>
              </div>

              <p className="text-base sm:text-[16.5px] text-[#64748B] font-normal leading-relaxed max-w-[430px] mt-4">
                From team celebrations to deep work sessions, here&apos;s a
                glimpse of life at GharPadharo. We work hard, learn together, and
                celebrate the journey.
              </p>

              {/* Clean Purple Pill CTA Button */}
              <div className="pt-4 sm:pt-5">
                <Link
                  href="/life-at-gharpadharo"
                  className="hero-cta-sweep group inline-flex items-center justify-center gap-2 text-white text-[15px] sm:text-[16px] font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-white select-none"
                  aria-label="Explore Life at GharPadharo"
                >
                  <span className="relative z-1">Explore Life at GharPadharo</span>
                  <span
                    aria-hidden="true"
                    className="relative z-1 text-base sm:text-lg leading-none transition-transform duration-300 ease-out group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* ============================================================
              2. RIGHT PHOTO COLLAGE (~52-55% width on desktop)
             ============================================================ */}
          <div className="w-full lg:w-[54%] xl:w-[55%] max-w-[640px] lg:max-w-none">
            <ScrollReveal variant="fade-up" delay={120}>
              {/* Collage Grid:
                  - Desktop/Tablet (>= 640px): 58:42 width split with 2 rows (Left photo spans 2 rows)
                  - Mobile (< 640px): Large photo on top, two smaller photos side-by-side underneath
              */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-[58fr_42fr] sm:grid-rows-2 gap-3.5 sm:gap-4 items-stretch">
                {/* Photo 1: Large Team Photograph (Left column on desktop, spans 2 rows) */}
                <div className="col-span-2 sm:col-span-1 sm:row-span-2 sm:col-start-1 sm:row-start-1 relative aspect-[16/10] sm:aspect-auto sm:h-full min-h-[220px] sm:min-h-[360px] lg:min-h-[400px] xl:min-h-[430px] rounded-[18px] sm:rounded-[22px] overflow-hidden border border-slate-200/70 life-photo-card bg-white group">
                  <Image
                    src={WEBSITE_IMAGES.life.teamWorkingAtDesks}
                    alt="GharPadharo team members working on laptops at their office desks"
                    fill
                    className="life-photo-zoom object-cover object-[center_35%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 420px"
                    priority
                  />
                </div>

                {/* Photo 2: Coworking with Colleagues (Top-Right on desktop, Bottom-Left on mobile) */}
                <div className="col-span-1 sm:col-span-1 sm:col-start-2 sm:row-start-1 relative aspect-[16/10] min-h-[110px] sm:min-h-[170px] lg:min-h-[190px] xl:min-h-[205px] rounded-[18px] sm:rounded-[20px] overflow-hidden border border-slate-200/70 life-photo-card bg-white group">
                  <Image
                    src={WEBSITE_IMAGES.life.coworkingColleagues}
                    alt="GharPadharo colleagues collaborating at office desks"
                    fill
                    className="life-photo-zoom object-cover object-[center_55%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 42vw, 300px"
                  />
                </div>

                {/* Photo 3: Modern Office Team at Work (Bottom-Right on desktop, Bottom-Right on mobile) */}
                <div className="col-span-1 sm:col-span-1 sm:col-start-2 sm:row-start-2 relative aspect-[16/10] min-h-[110px] sm:min-h-[170px] lg:min-h-[190px] xl:min-h-[205px] rounded-[18px] sm:rounded-[20px] overflow-hidden border border-slate-200/70 life-photo-card bg-white group">
                  <Image
                    src={WEBSITE_IMAGES.life.modernOfficeTeamAtWork}
                    alt="GharPadharo team members working at office desks with wall branding"
                    fill
                    className="life-photo-zoom object-cover object-[center_48%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 42vw, 300px"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
