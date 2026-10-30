import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Flag,
  GraduationCap,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Users,
  RefreshCw,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import LifeGallery from "@/components/careers/LifeGallery";
import OurStoriesSection from "@/components/careers/OurStoriesSection";
import ScrollReveal from "@/components/common/ScrollReveal";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

export const metadata = {
  title: {
    absolute: "Life at GharPadharo | Careers",
  },
  description:
    "Discover life at GharPadharo — build meaningful work with people who care. Explore career opportunities, our culture, and what you can expect.",
  alternates: {
    canonical: "https://career.gharpadharo.com/life-at-gharpadharo",
  },
  openGraph: {
    title: "Life at GharPadharo | Careers",
    description:
      "Discover life at GharPadharo — build meaningful work with people who care. Explore career opportunities, our culture, and what you can expect.",
    url: "https://career.gharpadharo.com/life-at-gharpadharo",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life at GharPadharo | Careers",
    description:
      "Discover life at GharPadharo — build meaningful work with people who care. Explore career opportunities, our culture, and what you can expect.",
  },
};

const whyJoinItems = [
  {
    title: "Meaningful Work",
    description:
      "Work on products and experiences designed to solve real problems for real people.",
    icon: Heart,
  },
  {
    title: "Real Ownership",
    description:
      "Take responsibility for your work, make decisions, and see your ideas through.",
    icon: Flag,
  },
  {
    title: "Learn & Grow",
    description:
      "Work alongside different disciplines, solve new problems, and keep improving.",
    icon: GraduationCap,
  },
  {
    title: "Make an Impact",
    description:
      "Your work has a visible connection to the product, the team, and the people we serve.",
    icon: Rocket,
  },
];

const principles = [
  {
    title: "Start with the real problem",
    description:
      "We begin with the experience we’re trying to improve, not the technology we want to use.",
    hoverMessage:
      "Understand people’s needs before building the solution.",
    icon: Search,
  },
  {
    title: "Keep it simple",
    description:
      "Good technology should remove friction, not add another layer of complexity.",
    hoverMessage:
      "Make every interaction clearer, faster, and easier.",
    icon: SlidersHorizontal,
  },
  {
    title: "Build together",
    description:
      "Good ideas get better when different perspectives are brought into the conversation.",
    hoverMessage:
      "Share ideas, challenge assumptions, and build better solutions together.",
    icon: Users,
  },
  {
    title: "Learn and improve",
    description:
      "We learn from what we build, what works, and what doesn’t.",
    hoverMessage:
      "Use feedback and experimentation to keep getting better.",
    icon: RefreshCw,
  },
];

const expectations = [
  {
    title: "Room to Learn",
    description:
      "Take on new challenges and build skills through real work.",
    icon: BookOpen,
  },
  {
    title: "Collaboration",
    description:
      "Work closely with people from different backgrounds and disciplines.",
    icon: Users,
  },
  {
    title: "Ownership",
    description:
      "Have a meaningful role in shaping the work you’re responsible for.",
    icon: ShieldCheck,
  },
  {
    title: "Growth",
    description:
      "Keep learning, take on more responsibility, and grow with the team.",
    icon: TrendingUp,
  },
];

export default function LifeAtGharPadharoPage() {
  return (
    <div className="w-full bg-white text-slate-800 antialiased">
      {/* ========================================================
          1. HERO — IMMERSIVE FULL-WIDTH BACKGROUND WITH GRADIENT OVERLAY
      ======================================================== */}
      <section className="relative w-full overflow-hidden bg-[#EDE9FE] min-h-0 sm:min-h-[520px] lg:min-h-[560px] xl:min-h-[580px] lg:h-[580px] flex items-center py-10 sm:py-14 lg:py-16 border-b border-[#E2DCF7]">
        {/* Full-width team collaboration whiteboard photo background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src={WEBSITE_IMAGES.life.teamCollaborationWhiteboard}
            alt="GharPadharo team collaborating around a whiteboard with sticky notes"
            fill
            priority
            quality={95}
            className="object-cover object-[68%_10%] sm:object-[center_18%] lg:object-[center_20%] xl:object-[center_20%] scale-135 sm:scale-100 origin-[70%_15%] sm:origin-center transition-transform duration-300"
            sizes="100vw"
          />
        </div>

        {/* Directional CSS Lavender Gradient Overlay Layer matching /jobs */}
        <div
          className="life-hero-gradient absolute inset-0 w-full h-full z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Component-scoped responsive gradient styles */}
        <style>{`
          .life-hero-gradient {
            background: linear-gradient(
              180deg,
              rgba(233, 229, 255, 0.97) 0%,
              rgba(237, 233, 254, 0.92) 45%,
              rgba(237, 233, 254, 0.50) 72%,
              rgba(237, 233, 254, 0.15) 100%
            );
          }
          @media (min-width: 640px) {
            .life-hero-gradient {
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
            .life-hero-gradient {
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
            .hero-cta-sweep::before {
              transition: none !important;
            }
          }

          @media (hover: hover) {
            .benefit-card:hover {
              background-color: #EAE2FB;
              border-color: #C4B5FD;
              transform: translateY(-3.5px);
              box-shadow: 0 10px 24px rgba(89, 41, 214, 0.08);
            }
            .benefit-card:hover .benefit-icon-container {
              background-color: #4D20BE;
              transform: scale(1.04);
              box-shadow: 0 4px 10px rgba(89, 41, 214, 0.22);
            }

            /* How We Work cards: keep card & icon stationary; animate content swap on hover */
            .principle-card {
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
            }

            .principle-card:hover {
              background-color: #F8F5FF;
              border-color: #C4B5FD;
              box-shadow: 0 6px 20px rgba(89, 41, 214, 0.06);
            }

            .principle-card:hover .principle-content-default {
              opacity: 0;
              transform: translateY(-12px);
              pointer-events: none;
            }
            .principle-card:hover .principle-content-hover {
              opacity: 1;
              transform: translateY(0);
              pointer-events: auto;
            }
          }

          .principle-content-swap {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: 1fr;
            align-items: center;
            position: relative;
            overflow: hidden;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          }
          .principle-content-default,
          .principle-content-hover {
            grid-column: 1 / -1;
            grid-row: 1 / -1;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          }
          .principle-content-default {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 320ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity, transform;
          }
          .principle-content-hover {
            opacity: 0;
            transform: translateY(14px);
            pointer-events: none;
            transition: opacity 320ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity, transform;
          }

          .gp-why-pill {
            transform: rotate(0deg);
            box-shadow: 0 8px 24px -4px rgba(89, 41, 214, 0.42), 0 2px 8px rgba(89, 41, 214, 0.20);
            transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
          }

          .gp-why-pill:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 28px -4px rgba(89, 41, 214, 0.52), 0 4px 12px rgba(89, 41, 214, 0.24);
          }

          @keyframes badgeLineTravelRight {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            20% {
              opacity: 0.9;
            }
            70% {
              opacity: 0.7;
            }
            100% {
              transform: translateX(350%);
              opacity: 0;
            }
          }

          @keyframes badgeLineTravelLeft {
            0% {
              transform: translateX(350%);
              opacity: 0;
            }
            20% {
              opacity: 0.9;
            }
            70% {
              opacity: 0.7;
            }
            100% {
              transform: translateX(-100%);
              opacity: 0;
            }
          }

          .badge-line-glow-right {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 35%;
            height: 100%;
            border-radius: 9999px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 30%,
              rgba(255, 255, 255, 0.95) 50%,
              rgba(222, 218, 255, 0.8) 70%,
              transparent 100%
            );
            animation: badgeLineTravelRight 2.5s ease-in-out infinite;
            animation-delay: 0.3s;
            pointer-events: none;
          }

          .badge-line-glow-left {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 35%;
            height: 100%;
            border-radius: 9999px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(222, 218, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.95) 50%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 100%
            );
            animation: badgeLineTravelLeft 2.5s ease-in-out infinite;
            animation-delay: 0.3s;
            pointer-events: none;
          }

          @media (hover: none) {
            .principle-content-hover {
              display: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .gp-why-pill,
            .benefit-card,
            .benefit-icon-container,
            .principle-content-default,
            .principle-content-hover {
              transition: none !important;
              transform: none !important;
            }
            .badge-line-glow-right,
            .badge-line-glow-left {
              animation: none !important;
              display: none !important;
            }
            .benefit-card:hover {
              transform: none !important;
            }
            .benefit-card:hover .benefit-icon-container {
              transform: none !important;
            }
            .principle-card:hover .principle-content-default {
              opacity: 1 !important;
              transform: none !important;
            }
            .principle-card:hover .principle-content-hover {
              display: none !important;
            }
          }
        `}</style>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up" className="max-w-xl lg:max-w-[560px] text-left space-y-4 sm:space-y-4.5">
            {/* Main Heading with "meaningful work" highlighted in exact brand purple #5929D6 */}
            <h1 className="text-[29px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-extrabold text-[#111827] tracking-tight leading-[1.14] sm:leading-[1.1]">
              Build <span className="text-[#5929D6]">meaningful</span>
              <br className="hidden sm:inline" />{" "}
              <span className="text-[#5929D6]">work</span> with people
              <br className="hidden sm:inline" />{" "}
              who care.
            </h1>

            {/* Description Paragraph in dark slate (#334155) */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#334155] font-semibold leading-relaxed max-w-lg">
              We’re building technology that makes everyday experiences simpler. Join a team where you take ownership, keep learning and work on things that reach real people.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/jobs"
                className="hero-cta-sweep group inline-flex items-center justify-center gap-2 text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-white w-full sm:w-auto min-h-[46px] sm:min-h-[48px]"
                aria-label="Explore Open Roles"
              >
                <span className="relative z-1">Explore Open Roles</span>
                <span
                  aria-hidden="true"
                  className="relative z-1 text-base sm:text-lg leading-none transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
              <a
                href="#why-join-us"
                className="inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white active:bg-[#F3F0FF] text-[#111827] hover:text-[#5929D6] text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl border border-[#C4B5FD] hover:border-[#5929D6]/60 shadow-sm transition-all duration-200 w-full sm:w-auto min-h-[46px] sm:min-h-[48px] text-center backdrop-blur-xs"
              >
                <span>Learn About Our Culture</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          2. WHY JOIN US (White Background with 2-Column Layout & 2x2 Lavender Cards)
      ======================================================== */}
      <section
        id="why-join-us"
        className="scroll-mt-24 w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-[#E8E2FA]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Eyebrow, Large Headline & Narrative (Col 5) */}
            <div className="lg:col-span-5 text-left space-y-4 sm:space-y-5">
              <ScrollReveal variant="fade-up">
                {/* Purple Capsule Badge: "WHY JOIN US" matching "HOW WE WORK?" section */}
                <div className="relative inline-flex items-center mb-4 sm:mb-5 select-none max-w-full">
                  {/* Subtle soft lavender ambient glow behind the badge */}
                  <div
                    className="absolute -inset-x-3 -inset-y-2 bg-[#7C3AED]/12 rounded-full blur-xl pointer-events-none -z-10"
                    aria-hidden="true"
                  />

                  {/* Straight purple pill with soft glow */}
                  <div
                    className="gp-why-pill inline-flex items-center justify-center px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#5929D6] via-[#5F30DE] to-[#6A3AE8] text-white shrink-0"
                    aria-label="WHY JOIN US"
                  >
                    <span className="text-xs sm:text-[14.5px] lg:text-[16px] font-bold tracking-wide text-white uppercase leading-none whitespace-nowrap">
                      WHY JOIN US
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
                  Work where your{" "}
                  <span className="text-[#5929D6] block">contribution</span>
                  matters.
                </h2>

                <p className="text-base sm:text-lg text-[#555A75] leading-relaxed font-normal max-w-md mt-3.5 sm:mt-4">
                  We&apos;re a growing team, which means your ideas can move quickly from conversation to execution.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: 2x2 Lavender Benefit Cards (Col 7) */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                {whyJoinItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal
                      key={item.title}
                      variant="fade-up"
                      delay={idx * 80}
                      className="h-full"
                    >
                      <div
                        className="benefit-card bg-[#F0ECFC] rounded-2xl sm:rounded-3xl border border-[#E4DCFB] p-6 sm:p-7 lg:p-8 flex flex-col justify-between h-full shadow-xs transition-all duration-300 ease-in-out cursor-default"
                      >
                        <div>
                          {/* Horizontal Row: Icon + Heading */}
                          <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5 sm:mb-4">
                            {/* Solid Purple Rounded-Square Container with White Icon */}
                            <div className="benefit-icon-container w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#5929D6] text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 ease-in-out">
                              <Icon className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
                            </div>

                            {/* Card Title in Bold Dark Navy */}
                            <h3 className="text-base sm:text-lg lg:text-[18px] font-bold text-[#11152F] tracking-tight">
                              {item.title}
                            </h3>
                          </div>

                          {/* Card Description Aligned with Left Edge */}
                          <p className="text-sm sm:text-[14.5px] text-[#555A75] leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. HOW WE WORK (Pale Lavender-to-White Gradient Background with Horizontal White Cards)
      ======================================================== */}
      <section
        id="how-we-work"
        className="scroll-mt-24 w-full max-w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-[#E8E2FA]/80 relative overflow-x-clip"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center w-full min-w-0">
            {/* Left Column: Eyebrow, Large Headline & Description */}
            <div className="w-full min-w-0 text-left space-y-4 sm:space-y-5">
              <ScrollReveal variant="fade-up" className="w-full min-w-0">
                {/* Purple Capsule Badge: "HOW WE WORK?" matching "Why GharPadharo?" section */}
                <div className="relative inline-flex items-center mb-4 sm:mb-5 select-none max-w-full">
                  {/* Subtle soft lavender ambient glow behind the badge */}
                  <div
                    className="absolute -inset-x-3 -inset-y-2 bg-[#7C3AED]/12 rounded-full blur-xl pointer-events-none -z-10"
                    aria-hidden="true"
                  />

                  {/* Straight purple pill with soft glow */}
                  <div
                    className="gp-why-pill inline-flex items-center justify-center px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#5929D6] via-[#5F30DE] to-[#6A3AE8] text-white shrink-0"
                    aria-label="HOW WE WORK?"
                  >
                    <span className="text-xs sm:text-[14.5px] lg:text-[16px] font-bold tracking-wide text-white uppercase leading-none whitespace-nowrap">
                      HOW WE WORK?
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
                  Simple principles. High ownership.
                </h2>

                <p className="text-base sm:text-lg text-[#555A75] leading-relaxed font-normal max-w-md mt-3.5 sm:mt-4">
                  We care about how we work together just as much as what we build.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: 4 Horizontally Long White Principle Cards Stacked Vertically */}
            <div className="w-full min-w-0">
              <div className="w-full min-w-0 flex flex-col gap-4 sm:gap-4.5">
                {principles.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal
                      key={item.title}
                      variant="fade-up"
                      delay={idx * 70}
                      className="w-full min-w-0"
                    >
                      <div
                        className="principle-card w-full min-w-0 box-border bg-white rounded-2xl sm:rounded-3xl border border-[#E4DCFB] p-5 sm:p-6 lg:p-6.5 shadow-xs transition-colors duration-300 ease-in-out cursor-default flex items-center gap-4 sm:gap-5"
                      >
                        {/* Solid Purple Rounded-Square Container with White Icon - Permanently Stationary */}
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#5929D6] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
                        </div>

                        {/* Content: Heading & Description swap with bold purple secondary message on hover */}
                        <div className="principle-content-swap min-w-0 flex-1">
                          {/* Default Content: Black Heading + Gray Description */}
                          <div className="principle-content-default min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight mb-1 sm:mb-1.5 break-words">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-[14.5px] text-[#555A75] leading-relaxed font-normal m-0 break-words">
                              {item.description}
                            </p>
                          </div>

                          {/* Hover Content: Bold GharPadharo Purple Secondary Message */}
                          <div
                            className="principle-content-hover min-w-0"
                            aria-hidden="true"
                          >
                            <p className="text-base sm:text-[17px] lg:text-lg font-bold text-[#5929D6] tracking-tight leading-snug m-0 break-words">
                              {item.hoverMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE PEOPLE (White Background)
      ======================================================== */}
      <section
        id="the-people"
        className="scroll-mt-24 w-full py-8 sm:py-10 md:py-12 lg:py-14 bg-white border-b border-[#E8E2FA]/60 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* Left Column on Desktop / Bottom on Mobile: Office Team Visual */}
            <div className="order-2 md:order-1 md:col-span-5 lg:col-span-5 w-full">
              <ScrollReveal variant="fade-up">
                <div className="group relative w-full max-w-lg md:max-w-none mx-auto md:mx-0 aspect-[16/10] md:aspect-[16/11] rounded-[18px] sm:rounded-[20px] md:rounded-[22px] overflow-hidden shadow-[0_10px_28px_rgba(89,41,214,0.07)] border border-[#E8E2FA] bg-white">
                  <Image
                    src={WEBSITE_IMAGES.life.teamWorkspaceWork}
                    alt="Five colleagues in business attire collaborating in a modern office"
                    fill
                    className="object-cover object-[center_25%] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 520px"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column on Desktop / Top on Mobile: Narrative */}
            <div className="order-1 md:order-2 md:col-span-7 lg:col-span-7 text-center md:text-left">
              <ScrollReveal variant="fade-up" delay={120} className="flex flex-col items-center md:items-start max-w-xl mx-auto md:max-w-none md:mx-0">
                {/* Symmetrical Pill Badge Flanked by Animated Gradient Lines on Both Sides - Centered within column */}
                <div className="w-full max-w-full flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 lg:gap-3.5 mb-4 sm:mb-4.5 lg:mb-5 select-none">
                  {/* Left horizontal line: outward travelling light towards the left */}
                  <div
                    className="relative overflow-hidden h-[2px] xs:h-[2.5px] rounded-full w-[28px] xs:w-[38px] sm:w-[70px] md:w-[90px] lg:w-[130px] xl:w-[150px] bg-gradient-to-r from-transparent via-[#A78BFA]/60 to-[#8561FF] shrink"
                    aria-hidden="true"
                  >
                    <div className="badge-line-glow-left" />
                  </div>

                  {/* Pill badge */}
                  <div className="inline-flex items-center justify-center px-3.5 xs:px-4 sm:px-5 lg:px-5.5 py-1.5 xs:py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#5929D6] to-[#8561FF] shadow-lg shadow-[#5929D6]/30 select-none shrink-0">
                    {/* Typography: Bold serif uppercase with generous letter spacing */}
                    <span className="font-serif font-bold text-[11px] xs:text-xs sm:text-[13px] lg:text-[13.5px] text-white tracking-[0.14em] xs:tracking-[0.16em] sm:tracking-[0.18em] lg:tracking-[0.22em] uppercase leading-none whitespace-nowrap text-center">
                      THE PEOPLE
                    </span>
                  </div>

                  {/* Right horizontal line: outward travelling light towards the right */}
                  <div
                    className="relative overflow-hidden h-[2px] xs:h-[2.5px] rounded-full w-[28px] xs:w-[38px] sm:w-[70px] md:w-[90px] lg:w-[130px] xl:w-[150px] bg-gradient-to-r from-[#8561FF] via-[#A78BFA]/60 to-transparent shrink"
                    aria-hidden="true"
                  >
                    <div className="badge-line-glow-right" />
                  </div>
                </div>

                <h2 className="text-[22px] xs:text-2xl sm:text-3xl md:text-[28px] lg:text-[34px] xl:text-[36px] font-extrabold text-[#11152F] tracking-tight leading-[1.25] sm:leading-[1.2] mb-3 sm:mb-3.5 lg:mb-4 text-center md:text-left">
                  Different skills. One shared purpose.
                </h2>

                <div className="space-y-3 sm:space-y-3.5 text-sm sm:text-base md:text-[15px] lg:text-[15.5px] text-[#555A75] leading-relaxed font-normal text-center md:text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                  <p>
                    Great products are built by people with different strengths. At GharPadharo, technology, product, operations, growth, marketing, and other disciplines come together to solve problems as a team.
                  </p>
                  <p>
                    We value curiosity, ownership, openness, and the willingness to help each other get better.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. OUR LIFE (IMAGE GALLERY / CAROUSEL) (Pale Lavender-to-White Gradient Background)
      ======================================================== */}
      <LifeGallery />

      {/* ========================================================
          6. WHAT YOU CAN EXPECT (White Background)
      ======================================================== */}
      <section
        id="what-you-can-expect"
        className="scroll-mt-24 w-full py-14 sm:py-18 lg:py-22 bg-white border-b border-[#E8E2FA]/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto mb-8 sm:mb-12 text-center">
              {/* Symmetrical Pill Badge Flanked by Animated Gradient Lines on Both Sides matching Explore Our Teams */}
              <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-4 sm:mb-5 max-w-full w-full mx-auto">
                {/* Left horizontal line: outward travelling light towards the left */}
                <div
                  className="relative overflow-hidden h-[2.5px] rounded-full w-[36px] sm:w-[90px] md:w-[130px] lg:w-[160px] bg-gradient-to-r from-transparent via-[#A78BFA]/60 to-[#8561FF] shrink"
                  aria-hidden="true"
                >
                  <div className="badge-line-glow-left" />
                </div>

                {/* Centered pill badge */}
                <div className="inline-flex items-center justify-center px-4.5 sm:px-5.5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#5929D6] to-[#8561FF] shadow-lg shadow-[#5929D6]/30 select-none shrink-0">
                  {/* Typography: Bold serif uppercase with generous letter spacing */}
                  <span className="font-serif font-bold text-xs sm:text-[13.5px] text-white tracking-[0.18em] sm:tracking-[0.22em] uppercase leading-none whitespace-nowrap text-center">
                    WHAT YOU CAN EXPECT
                  </span>
                </div>

                {/* Right horizontal line: outward travelling light towards the right */}
                <div
                  className="relative overflow-hidden h-[2.5px] rounded-full w-[36px] sm:w-[90px] md:w-[130px] lg:w-[160px] bg-gradient-to-r from-[#8561FF] via-[#A78BFA]/60 to-transparent shrink"
                  aria-hidden="true"
                >
                  <div className="badge-line-glow-right" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#11152F] tracking-tight leading-snug">
                An environment where you can do your best work.
              </h2>
            </div>
          </ScrollReveal>

          {/* 4 Concise Items / Cards in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {expectations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal
                  key={item.title}
                  variant="fade-up"
                  delay={idx * 80}
                  className="h-full"
                >
                  <div
                    className="benefit-card bg-[#F0ECFC] rounded-2xl sm:rounded-3xl border border-[#E4DCFB] p-6 sm:p-7 flex flex-col justify-start h-full shadow-xs transition-all duration-300 ease-in-out cursor-default"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5 sm:mb-4">
                      <div className="benefit-icon-container w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#5929D6] text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 ease-in-out">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-[14.5px] text-[#555A75] leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. OUR STORIES (Pale Lavender-to-White Gradient Background)
      ======================================================== */}
      <OurStoriesSection />

      {/* ========================================================
          8. CLOSING CTA SECTION (White Background with Centered Lavender Card)
      ======================================================== */}
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
                  <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[52px] font-extrabold tracking-tight leading-[1.1]">
                    <span className="text-[#11152F] block">
                      Build something meaningful.
                    </span>
                    <span className="text-[#5929D6] block mt-1">
                      Grow while you do it.
                    </span>
                  </h2>

                  <p className="text-base sm:text-lg lg:text-[18px] xl:text-[19px] text-[#64748B] font-normal leading-relaxed mt-3.5 sm:mt-4 max-w-[540px] xl:max-w-[580px]">
                    Explore opportunities at GharPadharo and find where you can contribute.
                  </p>
                </div>

                {/* Right Action Button (Vertically centered) */}
                <div className="shrink-0 pt-2 lg:pt-0">
                  <Link
                    href="/jobs"
                    className="hero-cta-sweep group inline-flex items-center justify-center gap-2.5 text-white text-[16px] sm:text-[17px] font-semibold px-8 sm:px-9 py-4 sm:py-4.5 rounded-full shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-white select-none"
                    aria-label="View Open Positions"
                  >
                    <span className="relative z-1">View Open Positions</span>
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
    </div>
  );
}
