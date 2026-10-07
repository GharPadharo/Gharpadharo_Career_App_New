import Image from "next/image";
import Link from "next/link";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

export default function WhyGharPadharoSection() {
  const principles = [
    {
      title: "Ownership",
      description: "You own outcomes, not just tasks.",
      badgeBg: "bg-[#FEF9C3]",
      icon: (
        <svg
          className="w-5 h-5 text-amber-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: "Curiosity",
      description: "Ask questions, explore ideas, and keep learning.",
      badgeBg: "bg-[#EFF6FF]",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18h6M10 22h4M12 2v1M12 7a5 5 0 00-3.5 8.5c.7.7 1.5 1.5 1.5 2.5h4c0-1 .8-1.8 1.5-2.5A5 5 0 0012 7z" />
        </svg>
      ),
    },
    {
      title: "Collaboration",
      description: "Good ideas get better when we build together.",
      badgeBg: "bg-[#FFE4E6]",
      icon: (
        <svg
          className="w-5 h-5 text-rose-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/60 overflow-hidden">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">
          {/* Left Column: Heading, Narrative, CTA & 3 Equal Benefit Cards (~43% width) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
            <div>
              <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
                WHY GHARPADHARO
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-extrabold text-heading tracking-tight leading-[1.15]">
                Work where your
                <br />
                contribution matters.
              </h2>
            </div>

            <p className="text-base sm:text-[17px] text-body font-normal leading-relaxed max-w-lg">
              We&apos;re a small, ambitious team that believes in ownership,
              curiosity, and collaboration. You&apos;ll work on real problems,
              with real people, and see the impact of your work.
            </p>

            <div className="pt-1">
              <Link
                href="/life-at-gharpadharo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-heading text-sm font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95"
              >
                <span>Learn more about our culture</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {/* 3 Compact Benefit Cards (Equal width, equal height in 1 row) */}
            <div className="pt-2 sm:pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
              {principles.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-4.5 shadow-2xs text-left flex flex-col justify-start"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${p.badgeBg} flex items-center justify-center shrink-0`}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-sm sm:text-[15px] font-bold text-heading tracking-tight mt-3">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-[12.5px] text-body leading-relaxed mt-1">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3-Image Collage (1 Large Top + 2 Equal Bottom, ~57% width) */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0">
            <div className="w-full max-w-[620px] flex flex-col gap-3 sm:gap-3.5">
              {/* Top Large Image (Wide landscape ratio ~16:9) */}
              <div className="relative w-full aspect-[16/9] rounded-2xl lg:rounded-[22px] overflow-hidden border border-slate-200/80 shadow-2xs bg-slate-100">
                <Image
                  src={WEBSITE_IMAGES.life.teamCelebration}
                  alt="GharPadharo team celebrating together"
                  fill
                  priority
                  className="object-cover object-[center_28%]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 620px"
                />
              </div>

              {/* Bottom 2 Images (Side-by-side, equal width & equal height, ~4:3 aspect ratio) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5 w-full">
                {/* Bottom Left: Team member working at desk with laptop */}
                <div className="relative w-full aspect-[4/3] rounded-2xl lg:rounded-[22px] overflow-hidden border border-slate-200/80 shadow-2xs bg-slate-100">
                  <Image
                    src={WEBSITE_IMAGES.life.officeDeskSingle}
                    alt="GharPadharo team member working at desk with laptop"
                    fill
                    className="object-cover object-[center_48%]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 305px"
                  />
                </div>

                {/* Bottom Right: Team members collaborating at office desk */}
                <div className="relative w-full aspect-[4/3] rounded-2xl lg:rounded-[22px] overflow-hidden border border-slate-200/80 shadow-2xs bg-slate-100">
                  <Image
                    src={WEBSITE_IMAGES.life.officeDeskDuo}
                    alt="GharPadharo team members collaborating at office desk"
                    fill
                    className="object-cover object-[40%_center]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 305px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
