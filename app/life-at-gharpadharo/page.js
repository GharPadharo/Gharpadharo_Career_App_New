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
import SectionBadge from "@/components/common/SectionBadge";
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
      <section className="relative w-full overflow-hidden bg-[#090A1C] min-h-0 sm:min-h-[520px] lg:min-h-[560px] xl:min-h-[580px] lg:h-[580px] flex items-center py-10 sm:py-14 lg:py-16">
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

        {/* Directional CSS Dark Navy Gradient Overlay Layer */}
        <div
          className="life-hero-gradient absolute inset-0 w-full h-full z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Component-scoped responsive gradient styles */}
        <style>{`
          .life-hero-gradient {
            background: linear-gradient(
              180deg,
              rgba(9, 10, 28, 0.94) 0%,
              rgba(9, 10, 28, 0.86) 50%,
              rgba(9, 10, 28, 0.55) 75%,
              rgba(9, 10, 28, 0.20) 100%
            );
          }
          @media (min-width: 768px) {
            .life-hero-gradient {
              background: linear-gradient(
                90deg,
                rgba(9, 10, 28, 0.96) 0%,
                rgba(9, 10, 28, 0.90) 24%,
                rgba(9, 10, 28, 0.70) 40%,
                rgba(9, 10, 28, 0.35) 54%,
                rgba(9, 10, 28, 0.10) 68%,
                rgba(9, 10, 28, 0) 82%
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
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            align-items: center;
            position: relative;
            overflow: hidden;
          }
          .principle-content-default,
          .principle-content-hover {
            grid-column: 1 / -1;
            grid-row: 1 / -1;
            width: 100%;
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

          @media (hover: none) {
            .principle-content-hover {
              display: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .benefit-card,
            .benefit-icon-container,
            .principle-content-default,
            .principle-content-hover {
              transition: none !important;
              transform: none !important;
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
            {/* Eyebrow Badge */}
            <div>
              <SectionBadge>LIFE AT GHARPADHARO</SectionBadge>
            </div>

            {/* Main Heading with "meaningful work" highlighted in exact brand purple #5929D6 */}
            <h1 className="text-[29px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-extrabold text-white tracking-tight leading-[1.14] sm:leading-[1.1]">
              Build <span className="text-[#5929D6]">meaningful</span>
              <br className="hidden sm:inline" />{" "}
              <span className="text-[#5929D6]">work</span> with people
              <br className="hidden sm:inline" />{" "}
              who care.
            </h1>

            {/* Description Paragraph in soft-white */}
            <p className="text-sm sm:text-base lg:text-[17px] text-slate-200 font-normal leading-relaxed max-w-lg">
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
                className="inline-flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-white/10 active:bg-white/15 text-white text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl border border-white/80 hover:border-white transition-all duration-200 w-full sm:w-auto min-h-[46px] sm:min-h-[48px] text-center backdrop-blur-xs"
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
                <SectionBadge className="mb-1 sm:mb-2">WHY JOIN US</SectionBadge>

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
        className="scroll-mt-24 w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-[#E8E2FA]/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Eyebrow, Large Headline & Description (Col 5) */}
            <div className="lg:col-span-5 text-left space-y-4 sm:space-y-5">
              <ScrollReveal variant="fade-up">
                <SectionBadge className="mb-1 sm:mb-2">HOW WE WORK</SectionBadge>

                <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
                  Simple principles. High ownership.
                </h2>

                <p className="text-base sm:text-lg text-[#555A75] leading-relaxed font-normal max-w-md mt-3.5 sm:mt-4">
                  We care about how we work together just as much as what we build.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: 4 Horizontally Long White Principle Cards Stacked Vertically (Col 7) */}
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-4 sm:gap-4.5">
                {principles.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal
                      key={item.title}
                      variant="fade-up"
                      delay={idx * 70}
                    >
                      <div
                        className="principle-card bg-white rounded-2xl sm:rounded-3xl border border-[#E4DCFB] p-5 sm:p-6 lg:p-6.5 shadow-xs transition-colors duration-300 ease-in-out cursor-default flex items-center gap-4 sm:gap-5"
                      >
                        {/* Solid Purple Rounded-Square Container with White Icon - Permanently Stationary */}
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#5929D6] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
                        </div>

                        {/* Content: Heading & Description swap with bold purple secondary message on hover */}
                        <div className="principle-content-swap min-w-0 flex-1">
                          {/* Default Content: Black Heading + Gray Description */}
                          <div className="principle-content-default">
                            <h3 className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight mb-1 sm:mb-1.5">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-[14.5px] text-[#555A75] leading-relaxed font-normal m-0">
                              {item.description}
                            </p>
                          </div>

                          {/* Hover Content: Bold GharPadharo Purple Secondary Message */}
                          <div
                            className="principle-content-hover"
                            aria-hidden="true"
                          >
                            <p className="text-base sm:text-[17px] lg:text-lg font-bold text-[#5929D6] tracking-tight leading-snug m-0">
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
        className="scroll-mt-24 w-full py-12 sm:py-14 md:py-16 lg:py-20 bg-white border-b border-[#E8E2FA]/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-8 lg:gap-12 xl:gap-14 items-center">
            {/* Left Column: Office Team Visual (Image first on mobile, Left on tablet & desktop) */}
            <div className="md:col-span-5 lg:col-span-5 w-full">
              <ScrollReveal variant="fade-up">
                <div className="group relative w-full max-w-lg md:max-w-none mx-auto md:mx-0 aspect-[16/10] md:aspect-[4/3] rounded-[20px] md:rounded-[22px] overflow-hidden shadow-[0_12px_32px_rgba(89,41,214,0.08)] border border-[#E8E2FA] bg-white">
                  <Image
                    src={WEBSITE_IMAGES.life.teamWorkspaceWork}
                    alt="Five colleagues in business attire collaborating in a modern office"
                    fill
                    className="object-cover object-[center_25%] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 480px"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Narrative (Text after image on mobile, Right on tablet & desktop) */}
            <div className="md:col-span-7 lg:col-span-7 text-left space-y-3.5 sm:space-y-4">
              <ScrollReveal variant="fade-up" delay={120}>
                <div>
                  <SectionBadge>THE PEOPLE</SectionBadge>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-[28px] lg:text-[34px] xl:text-[36px] font-extrabold text-[#11152F] tracking-tight leading-[1.2]">
                  Different skills. One shared purpose.
                </h2>

                <div className="space-y-3 sm:space-y-3.5 text-sm sm:text-base md:text-[15px] lg:text-[15.5px] text-[#555A75] leading-relaxed font-normal">
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
            <div className="mb-8 sm:mb-12 text-center sm:text-left">
              <SectionBadge className="mb-3">WHAT YOU CAN EXPECT</SectionBadge>
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
