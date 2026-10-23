import Link from "next/link";
import SectionBadge from "@/components/common/SectionBadge";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function CareersCTA() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Component-scoped styles for hero-matching CTA sweep effect & reduced motion */}
      <style>{`
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
          .hero-cta-sweep::before,
          .hero-cta-sweep span {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-[1360px] xl:max-w-[1400px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-14">
        <ScrollReveal variant="fade-up">
          <div className="rounded-[28px] sm:rounded-[32px] border border-[#E7DEFF] bg-gradient-to-r from-white via-[#F7F3FF] to-[#ECE3FE] px-6 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-14 xl:py-11 relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(89,41,214,0.12),0_8px_24px_rgba(89,41,214,0.06)]">
            {/* Subtle Abstract Organic Lavender Gradient Shapes */}
            <div
              className="absolute top-0 right-1/4 w-[360px] h-[360px] rounded-full bg-gradient-to-b from-[#E6D8FF]/50 to-transparent blur-2xl pointer-events-none z-0"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#E5D7FF]/40 blur-xl pointer-events-none z-0"
              aria-hidden="true"
            />
            <div
              className="absolute -right-20 -bottom-20 w-[380px] h-[380px] rounded-full bg-gradient-to-tl from-[#DDD0FE]/60 via-[#E8DEFF]/40 to-transparent blur-2xl pointer-events-none z-0"
              aria-hidden="true"
            />
            <div
              className="absolute -left-16 -bottom-16 w-[240px] h-[240px] rounded-full bg-[#F0EBFF]/50 blur-2xl pointer-events-none z-0"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10 xl:gap-14">
              {/* Left Content */}
              <div className="text-left max-w-2xl xl:max-w-3xl min-w-0">
                <SectionBadge className="mb-3.5">
                  WORK WITH US
                </SectionBadge>

                <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[52px] font-extrabold tracking-tight leading-[1.1]">
                  <span className="text-[#11152F] block">
                    Ready to build something
                  </span>
                  <span className="text-[#5929D6] block mt-1">
                    meaningful?
                  </span>
                </h2>

                <p className="text-base sm:text-lg lg:text-[18px] xl:text-[19px] text-[#64748B] font-normal leading-relaxed mt-3.5 sm:mt-4 max-w-[540px] xl:max-w-[580px]">
                  Explore open roles and be part of a team making finding a place
                  simpler for everyone.
                </p>
              </div>

              {/* Right Action Button (Vertically centered) */}
              <div className="shrink-0 pt-2 lg:pt-0">
                <Link
                  href="/jobs"
                  className="hero-cta-sweep group inline-flex items-center justify-center gap-2.5 text-white text-[16px] sm:text-[17px] font-semibold px-8 sm:px-9 py-4 sm:py-4.5 rounded-full shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-white select-none"
                  aria-label="Explore Open Roles"
                >
                  <span className="relative z-1">Explore Open Roles</span>
                  <span
                    aria-hidden="true"
                    className="relative z-1 text-lg sm:text-xl leading-none transition-transform duration-300 ease-out group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
