import Link from "next/link";
import Image from "next/image";

export default function CareersLandingHero() {
  return (
    <section className="w-full bg-white border-b border-slate-200/60 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Messaging & CTAs (~45% width on desktop) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
            {/* Eyebrow */}
            <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase inline-block">
              CAREERS AT GHARPADHARO
            </span>

            {/* Main Heading */}
            <h1 className="text-[34px] sm:text-5xl lg:text-[54px] xl:text-[58px] font-extrabold text-heading tracking-tight leading-[1.02]">
              Help people find
              <br />
              their place.
              <br />
              <span className="text-primary">Build yours here.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-[17px] lg:text-lg text-body leading-relaxed max-w-lg font-normal">
              Join a team building technology that makes finding a place simpler.
              Take ownership, learn continuously, and work with people who care
              about solving real problems.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="#open-positions"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-base font-bold px-7 py-3.5 sm:py-4 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Explore Open Roles</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <Link
                href="/life-at-gharpadharo"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-3 sm:py-4 text-primary hover:text-primary-hover text-base font-semibold transition-colors text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 hover:underline"
              >
                <span>Life at GharPadharo</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Single Large Collaboration Image (~55% width on desktop) */}
          <div className="lg:col-span-7 relative flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0">
            <div className="relative w-full max-w-[620px]">
              {/* Single Primary Collaboration Image */}
              <div className="relative w-full aspect-[16/10] rounded-[22px] sm:rounded-[26px] lg:rounded-[28px] overflow-hidden border-[3px] border-white shadow-lg shadow-slate-900/5 bg-slate-100">
                <Image
                  src="/images/home/hero-office-team.jpg"
                  alt="GharPadharo team working at the office workspace"
                  fill
                  priority
                  className="object-cover object-[center_60%]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 620px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
