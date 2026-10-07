export default function WhatYouCanExpectSection() {
  const benefits = [
    {
      title: "Supportive Team",
      description:
        "Work in a collaborative and inclusive environment where your ideas are valued.",
      badgeBg: "bg-[#F3E8FF]",
      iconColor: "text-purple-600",
      renderIcon: (cls) => (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
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
    {
      title: "Learning & Growth",
      description:
        "Access to resources, mentorship and real opportunities to build new skills.",
      badgeBg: "bg-[#FEF3C7]",
      iconColor: "text-amber-500",
      renderIcon: (cls) => (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      ),
    },
    {
      title: "Well-being & Flexibility",
      description:
        "A healthy work-life balance with flexible work options and wellness support.",
      badgeBg: "bg-[#FFE4E6]",
      iconColor: "text-rose-500",
      renderIcon: (cls) => (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 117.5-6.566 5 5 0 117.5 6.572" />
          <path d="M3 12h3.5l2-3.5 3 7 2-4.5 1.5 1h5" />
        </svg>
      ),
    },
    {
      title: "Recognition & Transparency",
      description:
        "Your contributions are appreciated and we keep communication open.",
      badgeBg: "bg-[#EFF6FF]",
      iconColor: "text-blue-500",
      renderIcon: (cls) => (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: "Meaningful Impact",
      description:
        "Work on real problems that create value for communities and make a difference.",
      badgeBg: "bg-[#ECFDF5]",
      iconColor: "text-emerald-500",
      renderIcon: (cls) => (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 20A7 7 0 014 13C4 7 11 3 20 3c0 9-4 16-9 17z" />
          <path d="M11 20C11 14 15 8 20 3" />
        </svg>
      ),
    },
    {
      title: "Time Off & Benefits",
      description:
        "Generous leave policy and additional benefits to support you and your goals.",
      badgeBg: "bg-[#FFF7ED]",
      iconColor: "text-orange-500",
      renderIcon: (cls) => (
        <svg
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h7" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <circle cx="17.5" cy="17.5" r="3.5" />
          <path d="M17.5 16v1.5l1 1" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="what-we-offer"
      className="w-full py-14 sm:py-18 lg:py-24 bg-white border-b border-slate-200/60 overflow-hidden"
    >
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center">
          {/* Left Column: Heading & Narrative (4 cols ~33-35% on Desktop) */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-3.5 text-left">
            <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-1.5 sm:mb-2">
              WHAT WE OFFER
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-[40px] xl:text-[42px] font-extrabold text-heading tracking-tight leading-[1.18]">
              People, benefits
              <br />
              and support to
              <br className="hidden sm:inline" />
              {" "}do your best work.
            </h2>

            <p className="text-sm sm:text-base lg:text-[17px] text-body font-normal leading-relaxed pt-1 max-w-sm">
              We&apos;re committed to creating an environment where you can
              grow, stay healthy and build a meaningful career with us.
            </p>
          </div>

          {/* Right Column: Benefits Layout (8 cols ~65-67% on Desktop) */}
          <div className="lg:col-span-8 w-full min-w-0">
            {/* Desktop Editorial Grid (3 columns × 2 rows with subtle internal dividers) */}
            <div className="hidden lg:grid grid-cols-3">
              {benefits.map((item, idx) => (
                <div
                  key={item.title}
                  className={`
                    p-7 lg:py-8 lg:px-6 xl:py-9 xl:px-7 flex flex-col justify-start
                    ${idx < 3 ? "border-b border-slate-200/60" : ""}
                    ${idx % 3 !== 2 ? "border-r border-slate-200/60" : ""}
                  `}
                >
                  {/* Pastel rounded-2xl icon container (~56-64px) */}
                  <div
                    className={`w-14 h-14 xl:w-16 xl:h-16 ${item.badgeBg} rounded-2xl flex items-center justify-center shrink-0`}
                  >
                    {item.renderIcon(`w-6 h-6 ${item.iconColor}`)}
                  </div>

                  {/* Benefit Title & Description */}
                  <div className="mt-5 sm:mt-6 space-y-2">
                    <h3 className="text-lg xl:text-[19px] font-bold text-heading tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm xl:text-[14.5px] text-body font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile & Tablet Compact Card Grid (2 columns × 3 rows) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:hidden">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 shadow-2xs flex flex-col justify-start min-h-[148px] sm:min-h-[160px]"
                >
                  {/* Compact pastel icon container (~36-40px) */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 ${item.badgeBg} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`}
                  >
                    {item.renderIcon(`w-4.5 h-4.5 sm:w-5 sm:h-5 ${item.iconColor}`)}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-[13.5px] sm:text-[14.5px] font-bold text-heading leading-tight mt-2.5 sm:mt-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-body leading-relaxed mt-1 sm:mt-1.5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
