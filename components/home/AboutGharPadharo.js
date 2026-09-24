import Image from "next/image";

/**
 * AboutGharPadharo Component
 * 
 * Editorial About section on the Career Portal root `/` page:
 * - Left (Desktop) / Top (Mobile): Large authentic visual panel showing a modern property environment in Uttarakhand.
 * - Right (Desktop) / Bottom (Mobile): Eyebrow, Heading, concise copy, and external link to official About page.
 */
export default function AboutGharPadharo() {
  return (
    <section
      id="about"
      className="w-full py-16 lg:py-24 bg-[#f8fafc] border-b border-border/60 scroll-mt-20"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Panel: Modern Property in Uttarakhand */}
          <div className="lg:col-span-6 order-1 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-xs group">
              <Image
                src="/images/about/about-property.jpg"
                alt="Modern residential living environment in Uttarakhand"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-103"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>

          {/* Narrative & External Link */}
          <div className="lg:col-span-6 order-2 lg:order-2 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              ABOUT GHARPADHARO
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-heading tracking-tight leading-[1.18]">
              Making housing simpler through technology.
            </h2>

            <p className="text-sm sm:text-base text-body leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              GharPadharo connects property seekers and owners, making it easier
              to discover and navigate housing opportunities in Uttarakhand.
            </p>

            <div className="pt-2 flex justify-center lg:justify-start">
              <a
                href="https://www.gharpadharo.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-semibold transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Learn more about GharPadharo</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
