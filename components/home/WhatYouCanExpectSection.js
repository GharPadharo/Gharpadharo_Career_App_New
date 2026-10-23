import {
  UsersRound,
  BookOpen,
  HeartPulse,
  Star,
  Leaf,
  CalendarClock,
} from "lucide-react";
import SectionBadge from "@/components/common/SectionBadge";
import ScrollReveal from "@/components/common/ScrollReveal";

const BENEFITS = [
  {
    title: "Supportive Team",
    description:
      "Work in a collaborative and inclusive environment where your ideas are valued.",
    hoverMessage:
      "Share ideas, challenge assumptions, and build better solutions together.",
    Icon: UsersRound,
  },
  {
    title: "Learning & Growth",
    description:
      "Access to resources, mentorship and real opportunities to build new skills.",
    hoverMessage:
      "Use feedback and experimentation to keep getting better.",
    Icon: BookOpen,
  },
  {
    title: "Well-being & Flexibility",
    description:
      "A healthy work-life balance with flexible work options and wellness support.",
    hoverMessage:
      "A healthy work-life balance with flexible work options and wellness support.",
    Icon: HeartPulse,
  },
  {
    title: "Recognition & Transparency",
    description:
      "Your contributions are appreciated and we keep communication open.",
    hoverMessage:
      "Make every interaction clearer, faster, and easier.",
    Icon: Star,
  },
  {
    title: "Meaningful Impact",
    description:
      "Work on real problems that create value for communities and make a difference.",
    hoverMessage:
      "Understand people’s needs before building the solution.",
    Icon: Leaf,
  },
  {
    title: "Time Off & Benefits",
    description:
      "Generous leave policy and additional benefits to support you and your goals.",
    hoverMessage:
      "Generous leave policy and additional benefits to support you and your goals.",
    Icon: CalendarClock,
  },
];

export default function WhatYouCanExpectSection() {
  return (
    <section
      id="what-we-offer"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60 relative overflow-hidden"
    >
      {/* Component-scoped styles for card hover state, content swap animation, and reduced motion */}
      <style>{`
        .benefit-card {
          transition:
            background 280ms cubic-bezier(0.4, 0, 0.2, 1),
            border-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .benefit-icon-container {
          transition:
            background-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (hover: hover) {
          .benefit-card:hover,
          .benefit-card:focus-visible,
          .benefit-card:focus-within {
            background-color: #5929D6 !important;
            background-image: none !important;
            border-color: #4D20BE !important;
            box-shadow: 0 12px 28px -4px rgba(89, 41, 214, 0.35), 0 4px 12px rgba(89, 41, 214, 0.2) !important;
          }

          .benefit-card:hover .benefit-icon-container,
          .benefit-card:focus-visible .benefit-icon-container,
          .benefit-card:focus-within .benefit-icon-container {
            background-color: rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          }

          .benefit-card:hover .benefit-content-default,
          .benefit-card:focus-visible .benefit-content-default,
          .benefit-card:focus-within .benefit-content-default {
            opacity: 0;
            transform: translateY(-12px);
            pointer-events: none;
          }

          .benefit-card:hover .benefit-content-hover,
          .benefit-card:focus-visible .benefit-content-hover,
          .benefit-card:focus-within .benefit-content-hover {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
        }

        .benefit-content-swap {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .benefit-content-default,
        .benefit-content-hover {
          grid-column: 1 / -1;
          grid-row: 1 / -1;
          width: 100%;
        }

        .benefit-content-default {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
        }

        .benefit-content-hover {
          opacity: 0;
          transform: translateY(14px);
          pointer-events: none;
          transition:
            opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
        }

        @media (hover: none) {
          .benefit-content-hover {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .benefit-card,
          .benefit-icon-container,
          .benefit-content-default,
          .benefit-content-hover {
            transition: none !important;
            transform: none !important;
          }
          .benefit-card:hover .benefit-content-default,
          .benefit-card:focus-visible .benefit-content-default,
          .benefit-card:focus-within .benefit-content-default {
            opacity: 1 !important;
            transform: none !important;
          }
          .benefit-card:hover .benefit-content-hover,
          .benefit-card:focus-visible .benefit-content-hover,
          .benefit-card:focus-within .benefit-content-hover {
            display: none !important;
          }
        }
      `}</style>

      {/* Subtle oversized organic lavender shapes in background */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 xl:gap-16 w-full">
          {/* ============================================================
              1. LEFT COLUMN (~30% width on Desktop)
             ============================================================ */}
          <div className="w-full lg:w-[32%] xl:w-[30%] shrink-0 text-left">
            <ScrollReveal variant="fade-up">
              <SectionBadge className="mb-3.5">
                WHAT WE OFFER
              </SectionBadge>

              <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold tracking-tight leading-[1.12]">
                <span className="text-[#5929D6]">
                  People, benefits
                  <br className="hidden lg:block" />{" "}
                  and support
                </span>{" "}
                <span className="text-[#0F172A]">
                  to
                  <br className="hidden lg:block" />{" "}
                  do your best
                  <br className="hidden lg:block" />{" "}
                  work.
                </span>
              </h2>

              <p className="text-sm sm:text-base lg:text-[16.5px] text-[#64748B] font-normal leading-relaxed mt-3.5 sm:mt-4 max-w-[340px] sm:max-w-[380px]">
                We&apos;re committed to creating an environment where you can
                grow, stay healthy and build a meaningful career with us.
              </p>
            </ScrollReveal>
          </div>

          {/* ============================================================
              2. RIGHT COLUMN: 2-COLUMN × 3-ROW GRID (~70% width)
             ============================================================ */}
          <div className="w-full lg:w-[65%] xl:w-[68%] grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-4.5 xl:gap-5">
              {BENEFITS.map(({ title, description, hoverMessage, Icon }, idx) => (
                <ScrollReveal
                  key={title}
                  variant="fade-up"
                  delay={idx * 70}
                  className="h-full"
                >
                  <div
                    tabIndex={0}
                    className="benefit-card bg-gradient-to-br from-[#F7F3FF] to-[#F2ECFF] border border-[#EBE4FF] rounded-[16px] p-5 sm:p-5.5 lg:p-6 shadow-[0_4px_16px_rgba(89,41,214,0.03)] cursor-default flex items-center gap-4 sm:gap-4.5 lg:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 h-full"
                  >
                    {/* Large circular purple icon container with white outline icon */}
                    <div
                      className="benefit-icon-container w-14 h-14 sm:w-15 sm:h-15 lg:w-16 lg:h-16 rounded-full bg-[#5929D6] text-white flex items-center justify-center shrink-0 shadow-xs"
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2]" />
                    </div>

                    {/* Benefit Title & Description with Hover Swap */}
                    <div className="benefit-content-swap min-w-0 flex-1">
                      {/* Default Content: Dark Navy Title & Muted Description */}
                      <div className="benefit-content-default">
                        <h3 className="benefit-card-title text-[17px] sm:text-[18px] font-bold text-[#0F172A] tracking-tight leading-snug">
                          {title}
                        </h3>
                        <p className="benefit-card-desc text-[13px] sm:text-[13.5px] lg:text-[14px] text-[#64748B] font-normal leading-relaxed mt-1 sm:mt-1.5">
                          {description}
                        </p>
                      </div>

                      {/* Hover Content: Alternative Description Only (Matching Image 2 Reference) */}
                      <div
                        className="benefit-content-hover"
                        aria-hidden="true"
                      >
                        <p className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-medium text-white leading-snug sm:leading-relaxed m-0">
                          {hoverMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
