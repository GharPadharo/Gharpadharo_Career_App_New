import Image from "next/image";
import Link from "next/link";

export default function LifeAtGharPadharoSection() {
  return (
    <section id="life-at-gharpadharo" className="w-full py-16 sm:py-22 lg:py-26 bg-[#F8FAFC] border-b border-slate-200/60 overflow-hidden">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Narrative & Action (4-5 cols) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7 text-center lg:text-left">
            <div>
              <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-2">
                LIFE AT GHARPADHARO
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-heading tracking-tight leading-tight">
                People first.
                <br />
                Problems worth solving.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-body font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              From team celebrations to deep work sessions, here&apos;s a glimpse of life at GharPadharo. We work hard, learn together, and celebrate the journey.
            </p>

            <div className="pt-2">
              <Link
                href="/life-at-gharpadharo"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-base font-bold px-7 py-4 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Explore Life at GharPadharo</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3-Photo Editorial Composition (7 cols) */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[590px] xl:max-w-[620px] grid grid-cols-2 sm:grid-cols-[1.25fr_1fr] sm:grid-rows-2 gap-x-3 sm:gap-x-3.5 gap-y-3 sm:gap-y-3.5 items-stretch">
              {/* Image 1: Primary Team Photograph (Balanced ~55% width on desktop) */}
              <div className="col-span-2 sm:col-span-1 sm:row-span-2 sm:col-start-1 sm:row-start-1 relative aspect-[16/10] sm:aspect-auto sm:h-full min-h-[240px] sm:min-h-0 rounded-2xl lg:rounded-[22px] overflow-hidden border border-slate-200/80 shadow-xs bg-white">
                <Image
                  src="/images/life-at-gharpadharo/gallery/team-group-photo.jpg"
                  alt="GharPadharo team members together at office"
                  fill
                  className="object-cover object-[center_35%]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 380px"
                  priority
                />
              </div>

              {/* Image 2: Modern Coworking with Colleagues Photograph (Top-Right) */}
              <div className="col-span-1 sm:col-span-1 sm:col-start-2 sm:row-start-1 relative aspect-[16/10] rounded-2xl lg:rounded-[22px] overflow-hidden border border-slate-200/80 shadow-xs bg-white">
                <Image
                  src="/images/life-at-gharpadharo/gallery/coworking-colleagues.jpg"
                  alt="GharPadharo colleagues collaborating at office desks"
                  fill
                  className="object-cover object-[center_60%]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 280px"
                />
              </div>

              {/* Image 3: Hindu Havan Ceremony Photograph (Bottom-Right) */}
              <div className="col-span-1 sm:col-span-1 sm:col-start-2 sm:row-start-2 relative aspect-[16/10] rounded-2xl lg:rounded-[22px] overflow-hidden border border-slate-200/80 shadow-xs bg-white">
                <Image
                  src="/images/life-at-gharpadharo/gallery/havan-ceremony.jpg"
                  alt="GharPadharo team participating in cultural Havan ceremony"
                  fill
                  className="object-cover object-[center_40%]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 280px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
