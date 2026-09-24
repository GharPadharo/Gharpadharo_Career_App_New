import Image from "next/image";
import Link from "next/link";

/**
 * Centralized image configuration for homepage preview
 */
const previewImages = {
  team: {
    src: "/images/life-at-gharpadharo/placeholder-collaboration.jpg",
    alt: "GharPadharo team collaborating around a desk",
  },
  place: {
    src: "/images/life-at-gharpadharo/placeholder-mountains.jpg",
    alt: "Mountain landscape in Uttarakhand",
  },
};

/**
 * LifeAtGharPadharo Preview Component (Homepage)
 * 
 * Compact, image-led promotional teaser section linking to the dedicated `/life-at-gharpadharo` page.
 * Features:
 * - Eyebrow: LIFE AT GHARPADHARO
 * - Heading: Come build with us.
 * - Supporting copy: Get a glimpse of the people, places, and experiences behind the work.
 * - Primary CTA: Explore Life at GharPadharo →
 * - Compact visual preview with team and place imagery.
 */
export default function LifeAtGharPadharo() {
  return (
    <section
      id="life-at-gharpadharo"
      className="w-full py-10 sm:py-12 lg:py-16 bg-white border-b border-border/60 scroll-mt-20"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Copy & Action */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              LIFE AT GHARPADHARO
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-extrabold text-heading tracking-tight leading-[1.18]">
              Come build with us.
            </h2>

            <p className="text-sm sm:text-base text-body leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
              Get a glimpse of the people, places, and experiences behind the work.
            </p>

            <div className="pt-1 flex justify-center lg:justify-start">
              <Link
                href="/life-at-gharpadharo"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>Explore Life at GharPadharo</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Compact Visual Preview Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Collaboration Team Photo Card */}
              <div className="sm:col-span-7 relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 aspect-[4/3] group">
                <Image
                  src={previewImages.team.src}
                  alt={previewImages.team.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                    People
                  </span>
                </div>
              </div>

              {/* Uttarakhand Himalayan Landscape Photo Card */}
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 aspect-[4/3] group">
                <Image
                  src={previewImages.place.src}
                  alt={previewImages.place.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 35vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                    Place
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
