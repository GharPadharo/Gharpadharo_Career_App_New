export default function HowWeHireSection() {
  const steps = [
    {
      num: "01",
      title: "Apply",
      description: "Submit your application for a role you're interested in.",
      isPrimary: true,
    },
    {
      num: "02",
      title: "Application Review",
      description: "We review your profile and get in touch.",
      isPrimary: false,
    },
    {
      num: "03",
      title: "Conversation",
      description: "A quick call to learn more about you.",
      isPrimary: false,
    },
    {
      num: "04",
      title: "Interview",
      description: "Role-specific discussions with the team.",
      isPrimary: false,
    },
    {
      num: "05",
      title: "Next Steps",
      description: "We'll share feedback and move forward.",
      isPrimary: false,
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 lg:py-18 bg-[#F8FAFC] border-b border-slate-200/60">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-2">
            HOW WE HIRE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-heading tracking-tight leading-snug">
            A straightforward and transparent process.
          </h2>
        </div>

        {/* 5-Step Horizontal Timeline on Desktop / Vertical Timeline on Mobile */}
        <div className="relative">
          {/* Subtle Horizontal Connector on Desktop */}
          <div
            className="hidden lg:block absolute top-6 left-[6%] right-[6%] h-px border-t border-dashed border-slate-300 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-9 lg:gap-7 relative z-10">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="flex lg:flex-col items-start lg:items-center text-left lg:text-center gap-4.5 lg:gap-4 relative"
              >
                {/* Step Circle Badge */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-extrabold text-sm sm:text-base shadow-2xs ${
                    s.isPrimary
                      ? "bg-primary text-white ring-4 ring-primary/10"
                      : "bg-white text-primary border border-slate-200/90"
                  }`}
                >
                  {s.num}
                </div>

                {/* Content */}
                <div className="space-y-1.5 pt-0.5 lg:pt-0">
                  <h3 className="text-base sm:text-lg font-bold text-heading tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-body font-normal leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
