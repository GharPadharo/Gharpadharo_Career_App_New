import Image from "next/image";
import { Rocket, ChartNoAxesCombined, UsersRound } from "lucide-react";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";
import SectionBadge from "@/components/common/SectionBadge";
import ScrollReveal from "@/components/common/ScrollReveal";

const VALUE_CARDS = [
  {
    title: "Make a Real Impact",
    description:
      "Work on meaningful challenges that simplify the home-finding journey and create value for people.",
    Icon: Rocket,
  },
  {
    title: "Grow Together",
    description:
      "Learn from experienced teammates, explore new ideas, and build skills that help you grow.",
    Icon: ChartNoAxesCombined,
  },
  {
    title: "Build as a Team",
    description:
      "Share ideas, solve problems together, and be part of a supportive, collaborative environment.",
    Icon: UsersRound,
  },
];

export default function WhyGharPadharoSection() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-slate-200/60 relative overflow-hidden">
      {/* Component-scoped styles for value cards & hover interactions */}
      <style>{`
        .gp-why-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #FDFCFF 100%);
          border: 1.5px solid #E7E2FF;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(89, 41, 214, 0.035);
          transition:
            border-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-why-card:hover,
        .gp-why-card:focus-visible,
        .gp-why-card:focus-within {
          border-color: #713BFF;
          box-shadow:
            0 12px 30px -6px rgba(113, 59, 255, 0.20),
            0 0 20px 0 rgba(113, 59, 255, 0.12);
          transform: translateY(-2px);
          outline: none;
        }

        .gp-why-card-glow {
          background: radial-gradient(
            120% 90% at 50% 0%,
            rgba(113, 59, 255, 0.11) 0%,
            rgba(113, 59, 255, 0.03) 55%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
          transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-why-card:hover .gp-why-card-glow,
        .gp-why-card:focus-visible .gp-why-card-glow,
        .gp-why-card:focus-within .gp-why-card-glow {
          opacity: 1;
        }

        .gp-why-card-icon {
          background-color: #EEE9FF;
          transition:
            background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-why-card:hover .gp-why-card-icon,
        .gp-why-card:focus-visible .gp-why-card-icon,
        .gp-why-card:focus-within .gp-why-card-icon {
          background-color: #E4DCFF;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(89, 41, 214, 0.14);
        }

        .gp-why-card-title {
          color: #11152F;
          transition: color 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-why-card:hover .gp-why-card-title,
        .gp-why-card:focus-visible .gp-why-card-title,
        .gp-why-card:focus-within .gp-why-card-title {
          color: #5929D6;
        }

        .gp-why-card-wave path {
          transition: fill 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-why-card:hover .gp-why-card-wave path,
        .gp-why-card:focus-visible .gp-why-card-wave path,
        .gp-why-card:focus-within .gp-why-card-wave path {
          fill: #EAE2FF;
        }

        @media (prefers-reduced-motion: reduce) {
          .gp-why-card,
          .gp-why-card-glow,
          .gp-why-card-icon,
          .gp-why-card-title,
          .gp-why-card-wave path {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Soft decorative background shapes */}
      <svg
        className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none z-0 opacity-70"
        viewBox="0 0 320 320"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 96C56 104 96 156 132 212C168 268 220 296 296 320H0V96Z"
          fill="#F3EFFF"
        />
      </svg>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Eyebrow, Heading, Supporting Text & 3 Compact Value Cards */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left min-w-0">
            <ScrollReveal variant="fade-up">
              <div>
                <SectionBadge className="mb-3.5">
                  WHY GHARPADHARO
                </SectionBadge>
                <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
                  Work where your
                  <br />
                  <span className="text-[#5929D6]">contribution</span> matters.
                </h2>
              </div>

              <p className="text-sm sm:text-base lg:text-[16.5px] text-[#64748B] font-normal leading-relaxed max-w-xl mt-3.5 sm:mt-4">
                We&apos;re a small, ambitious team that believes in ownership,
                curiosity, and collaboration. You&apos;ll work on real problems,
                with real people, and see the impact of your work.
              </p>
            </ScrollReveal>

            {/* 3 Equal-Width Value Cards */}
            <div className="pt-1 sm:pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
              {VALUE_CARDS.map(({ title, description, Icon }, idx) => (
                <ScrollReveal
                  key={title}
                  variant="fade-up"
                  delay={idx * 90}
                  className="h-full"
                >
                  <article
                    tabIndex={0}
                    className="gp-why-card relative overflow-hidden p-4 sm:p-5 flex flex-col justify-start text-left h-full min-w-0"
                  >
                    {/* Subtle top glow on hover */}
                    <div
                      className="gp-why-card-glow absolute inset-0 pointer-events-none z-0"
                      aria-hidden="true"
                    />

                    {/* Soft lavender decorative wave in the lower-left corner */}
                    <svg
                      className="gp-why-card-wave absolute bottom-0 left-0 w-36 h-20 pointer-events-none z-0"
                      viewBox="0 0 160 88"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 26C30 28 52 46 78 60C102 73 130 77 156 88H0V26Z"
                        fill="#F1ECFF"
                      />
                    </svg>

                    {/* Card Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div
                        className="gp-why-card-icon w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Icon
                          className="w-5 h-5 text-[#5929D6]"
                          strokeWidth={2}
                        />
                      </div>

                      <h3 className="gp-why-card-title text-[15px] sm:text-[15.5px] font-extrabold tracking-tight leading-snug mt-3.5">
                        {title}
                      </h3>

                      <p className="text-xs sm:text-[12.5px] text-[#64748B] leading-[1.55] font-normal mt-1.5">
                        {description}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Column: 3-Image Collage (1 Large Top + 2 Equal Bottom) */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end min-w-0">
            <ScrollReveal variant="fade-up" delay={150} className="w-full max-w-[640px]">
              <div className="w-full flex flex-col gap-3.5 sm:gap-4">
                {/* Top Large Image */}
                <div className="relative w-full aspect-[16/9] rounded-[20px] sm:rounded-[22px] overflow-hidden border border-[#E7E2FF] shadow-xs bg-slate-100">
                  <Image
                    src={WEBSITE_IMAGES.life.teamCelebration}
                    alt="GharPadharo team celebrating together"
                    fill
                    priority
                    className="object-cover object-[center_28%]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 620px"
                  />
                </div>

                {/* Bottom 2 Images Side-by-Side */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 w-full">
                  {/* Bottom Left: Team member working at desk with laptop */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[20px] sm:rounded-[22px] overflow-hidden border border-[#E7E2FF] shadow-xs bg-slate-100">
                    <Image
                      src={WEBSITE_IMAGES.life.officeDeskSingle}
                      alt="GharPadharo team member working at desk with laptop"
                      fill
                      className="object-cover object-[center_48%]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 305px"
                    />
                  </div>

                  {/* Bottom Right: Team members collaborating at office desk */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[20px] sm:rounded-[22px] overflow-hidden border border-[#E7E2FF] shadow-xs bg-slate-100">
                    <Image
                      src={WEBSITE_IMAGES.life.officeDeskDuo}
                      alt="GharPadharo team members collaborating at office desk"
                      fill
                      className="object-cover object-[40%_center]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 305px"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
