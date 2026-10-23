import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/common/ScrollReveal";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

export default function CareersLandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 xl:pt-20 xl:pb-28">
      {/* High-Fidelity Office Collaboration Clean Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <Image
          src={WEBSITE_IMAGES.home.careersHeroBackground}
          alt="GharPadharo team collaborating in modern office"
          fill
          priority
          quality={95}
          className="object-cover object-[72%_center] sm:object-[78%_center] lg:object-[82%_center] xl:object-right"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>

      {/* Responsive CSS Lavender Gradient Overlay Layer (between Image and Content) */}
      <div
        className="hero-gradient-overlay absolute inset-0 w-full h-full pointer-events-none z-1"
        aria-hidden="true"
      />

      {/* Component-scoped responsive gradient styles */}
      <style>{`
        .hero-gradient-overlay {
          background: linear-gradient(180deg, rgba(222, 218, 255, 0.98) 0%, rgba(222, 218, 255, 0.92) 45%, rgba(222, 218, 255, 0.45) 70%, rgba(222, 218, 255, 0) 100%);
        }
        @media (min-width: 640px) {
          .hero-gradient-overlay {
            background: linear-gradient(90deg, rgba(222, 218, 255, 0.98) 0%, rgba(222, 218, 255, 0.92) 35%, rgba(222, 218, 255, 0.6) 55%, rgba(222, 218, 255, 0) 78%);
          }
        }
        @media (min-width: 1024px) {
          .hero-gradient-overlay {
            background: linear-gradient(90deg, rgba(222, 218, 255, 0.98) 0%, rgba(222, 218, 255, 0.92) 25%, rgba(222, 218, 255, 0.72) 40%, rgba(222, 218, 255, 0.25) 55%, rgba(222, 218, 255, 0) 70%);
          }
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
      `}</style>

      {/* Hero Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-xl lg:max-w-[560px] text-left">
          {/* Main Heading — Exactly 2 lines on desktop */}
          <ScrollReveal variant="fade-up">
            <h1 className="text-[36px] sm:text-[44px] md:text-[50px] lg:text-[54px] xl:text-[58px] font-extrabold tracking-tight leading-[1.05]">
              <span className="block text-[#0F1028]">Find your purpose.</span>
              <span className="block text-[#5929D6]">Fuel your future.</span>
            </h1>
          </ScrollReveal>

          {/* Supporting Text */}
          <ScrollReveal variant="fade-up" delay={90}>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-[18px] text-slate-700 sm:text-slate-800 leading-relaxed max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] font-semibold">
              Join passionate minds building technology that makes finding homes simpler, smarter, and more transparent.
            </p>
          </ScrollReveal>

          {/* Primary CTA with Left-to-Right Hover Sweep Animation */}
          <ScrollReveal variant="fade-up" delay={180}>
            <div className="mt-6 sm:mt-7">
              <Link
                href="/jobs"
                className="hero-cta-sweep group inline-flex items-center justify-center gap-2 text-white text-base sm:text-[17px] font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Explore Open Roles"
              >
                <span className="relative z-1">Explore Open Roles</span>
                <span
                  aria-hidden="true"
                  className="relative z-1 text-lg leading-none transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Curved Wave Transition — Broad organic lavender & white flowing transition */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-24 lg:h-32 xl:h-36 block"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Soft pale-lavender luminous gradient for the broad intermediate wave band */}
            <linearGradient id="softPaleLavender" x1="0%" y1="0%" x2="50%" y2="80%">
              <stop offset="0%" stopColor="#F5F3FE" stopOpacity="0.92" />
              <stop offset="35%" stopColor="#FAF8FF" stopOpacity="0.80" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Layer 1: Broad soft pale-lavender flowing wave cushion */}
          <path
            d="M0,52 C280,56 520,95 780,142 C940,165 1100,178 1260,180 L0,180 Z"
            fill="url(#softPaleLavender)"
          />

          {/* Layer 2: Main white organic wave transition into section below */}
          <path
            d="M0,105 C300,112 560,148 860,166 C1060,174 1260,165 1440,170 L1440,180 L0,180 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
