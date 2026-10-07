import Image from "next/image";
import LifeGallery from "@/components/careers/LifeGallery";

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
  },
  {
    title: "Real Ownership",
    description:
      "Take responsibility for your work, make decisions, and see your ideas through.",
  },
  {
    title: "Learn & Grow",
    description:
      "Work alongside different disciplines, solve new problems, and keep improving.",
  },
  {
    title: "Make an Impact",
    description:
      "Your work has a visible connection to the product, the team, and the people we serve.",
  },
];

const principles = [
  {
    title: "Start with the real problem",
    description:
      "We begin with the experience we’re trying to improve, not the technology we want to use.",
  },
  {
    title: "Keep it simple",
    description:
      "Good technology should remove friction, not add another layer of complexity.",
  },
  {
    title: "Build together",
    description:
      "Good ideas get better when different perspectives are brought into the conversation.",
  },
  {
    title: "Learn and improve",
    description:
      "We learn from what we build, what works, and what doesn’t.",
  },
];

const expectations = [
  {
    title: "Room to Learn",
    description:
      "Take on new challenges and build skills through real work.",
  },
  {
    title: "Collaboration",
    description:
      "Work closely with people from different backgrounds and disciplines.",
  },
  {
    title: "Ownership",
    description:
      "Have a meaningful role in shaping the work you’re responsible for.",
  },
  {
    title: "Growth",
    description:
      "Keep learning, take on more responsibility, and grow with the team.",
  },
];

export default function LifeAtGharPadharoPage() {
  return (
    <div className="w-full bg-white text-slate-800 antialiased">
      {/* ========================================================
          1. HERO — LIFE AT GHARPADHARO
      ======================================================== */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/60">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
            {/* Left Column: Eyebrow, Heading & Narrative (50%) */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb400]" aria-hidden="true" />
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  LIFE AT GHARPADHARO
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[46px] font-extrabold text-heading tracking-tight leading-[1.14]">
                Build meaningful work with people who care.
              </h1>

              <p className="text-sm sm:text-base text-body leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                At GharPadharo, we’re building technology that makes everyday experiences simpler. Join a team where you can take ownership, learn continuously, and contribute to work that reaches real people.
              </p>
            </div>

            {/* Right Column: Workplace / Culture Photograph (50%) */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 group">
                <Image
                  src="/images/life-at-gharpadharo/team-gathering.jpg"
                  alt="GharPadharo team gathered together in the office"
                  fill
                  priority
                  className="object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 580px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. WHY JOIN GHARPADHARO
      ======================================================== */}
      <section
        id="why-join-us"
        className="scroll-mt-24 w-full py-14 sm:py-18 lg:py-20 bg-[#f8fafc] border-b border-slate-200/60"
      >
        <div className="container-custom max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              WHY JOIN US
            </span>
            <h2 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug">
              Work where your contribution matters.
            </h2>
            <p className="text-sm sm:text-base text-body mt-2 sm:mt-2.5 leading-relaxed font-normal max-w-2xl">
              We’re a growing team, which means your ideas can move quickly from conversation to execution.
            </p>
          </div>

          {/* 4 Concise Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {whyJoinItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-heading tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-body leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. HOW WE WORK
      ======================================================== */}
      <section
        id="how-we-work"
        className="scroll-mt-24 w-full py-14 sm:py-18 lg:py-20 bg-white border-b border-slate-200/60"
      >
        <div className="container-custom max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              HOW WE WORK
            </span>
            <h2 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug">
              Simple principles. High ownership.
            </h2>
            <p className="text-sm sm:text-base text-body mt-2 sm:mt-2.5 leading-relaxed font-normal max-w-2xl">
              We care about how we work together just as much as what we build.
            </p>
          </div>

          {/* 4 Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {principles.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-2 border-l-4 border-l-primary shadow-2xs h-full"
              >
                <h3 className="text-base font-bold text-heading tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-body leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE PEOPLE
      ======================================================== */}
      <section
        id="the-people"
        className="scroll-mt-24 w-full py-14 sm:py-18 lg:py-20 bg-[#f8fafc] border-b border-slate-200/60"
      >
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
            {/* Left Column: Team / Collaboration Visual (40–45%) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-white group">
                <Image
                  src="/images/life-at-gharpadharo/team-workspace-work.jpg"
                  alt="GharPadharo team members working together in the office"
                  fill
                  className="object-cover object-[center_55%] transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </div>

            {/* Right Column: Narrative (55–60%) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left order-1 lg:order-2">
              <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1">
                THE PEOPLE
              </span>

              <h2 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug">
                Different skills. One shared purpose.
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base text-body leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                <p>
                  Great products are built by people with different strengths. At GharPadharo, technology, product, operations, growth, marketing, and other disciplines come together to solve problems as a team.
                </p>
                <p>
                  We value curiosity, ownership, openness, and the willingness to help each other get better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. OUR LIFE (IMAGE GALLERY / CAROUSEL)
      ======================================================== */}
      <LifeGallery />

      {/* ========================================================
          6. WHAT YOU CAN EXPECT
      ======================================================== */}
      <section
        id="what-you-can-expect"
        className="scroll-mt-24 w-full py-14 sm:py-18 lg:py-20 bg-[#f8fafc] border-b border-slate-200/60"
      >
        <div className="container-custom max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              WHAT YOU CAN EXPECT
            </span>
            <h2 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug">
              An environment where you can do your best work.
            </h2>
          </div>

          {/* 4 Concise Items / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {expectations.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div>
                  <h3 className="text-base sm:text-[17px] font-bold text-heading tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-body leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. CLOSING STATEMENT — COMPACT, PURE TYPOGRAPHY, NO CTA
      ======================================================== */}
      <section className="w-full py-14 sm:py-18 lg:py-20 bg-white">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-snug">
              Build something meaningful.
              <br />
              Grow while you do it.
            </h2>

            <div className="w-8 h-0.5 bg-[#ffb400] rounded-full mx-auto my-3" aria-hidden="true" />

            <p className="text-base sm:text-lg text-body font-normal leading-relaxed">
              Explore opportunities at GharPadharo and find where you can contribute.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
