import Image from "next/image";

/**
 * Life at GharPadharo Image Data Structure
 * 
 * Future replacement is straightforward: simply update src, alt, and caption values below.
 * No component restructuring is needed when swapping temporary assets with production photography.
 */
const lifeAtImages = {
  featured: {
    src: "/images/life-at-gharpadharo/placeholder-mountains.jpg",
    alt: "Placeholder view of the Himalayan mountain landscape in Uttarakhand",
    caption: "A place to do meaningful work",
  },
  workspace: {
    src: "/images/life-at-gharpadharo/placeholder-workspace.jpg",
    alt: "Placeholder modern workspace desk with laptop and natural daylight",
    caption: "Learn. Collaborate. Create.",
  },
  collaboration: {
    src: "/images/life-at-gharpadharo/placeholder-collaboration.jpg",
    alt: "Placeholder team members collaborating around a work desk",
    caption: "Collaborate. Innovate. Build.",
  },
};

/**
 * LifeAtGharPadharo Component
 * 
 * Visual employer-brand section (id="life-at-gharpadharo") matching the reference design:
 * - Left: Eyebrow, Heading, description.
 * - Right: Asymmetric image collage (large focal mountain image on left, workspace & collaboration team stacked on right)
 *   with subtle typography overlays.
 */
export default function LifeAtGharPadharo() {
  return (
    <section
      id="life-at-gharpadharo"
      className="w-full py-16 lg:py-24 bg-white border-b border-border/60 scroll-mt-20"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading and Narrative */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              LIFE AT GHARPADHARO
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-heading tracking-tight leading-[1.16]">
              Life at{" "}
              <span className="text-primary">GharPadharo</span>
            </h2>

            <p className="text-sm sm:text-base text-body leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
              Great work happens when people have the space to learn, collaborate,
              experiment, and build together.
            </p>
          </div>

          {/* Right Column: Asymmetric Image Collage */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              {/* Left Tall Focal Image: Himalayan Landscape */}
              <div className="sm:col-span-7 relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 aspect-[4/5] sm:aspect-auto sm:h-full min-h-[300px] sm:min-h-[380px] group">
                <Image
                  src={lifeAtImages.featured.src}
                  alt={lifeAtImages.featured.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-serif italic text-lg sm:text-xl font-medium tracking-wide drop-shadow-sm">
                    {lifeAtImages.featured.caption}
                  </p>
                  <div className="h-0.5 w-12 bg-white/70 rounded-full mt-1.5" />
                </div>
              </div>

              {/* Right Stack: Workspace + Collaboration */}
              <div className="sm:col-span-5 flex flex-col gap-4 sm:gap-5 justify-between">
                {/* Top: Modern Workspace */}
                <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 aspect-[16/10] sm:aspect-[4/3] group">
                  <Image
                    src={lifeAtImages.workspace.src}
                    alt={lifeAtImages.workspace.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 30vw, 260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-serif italic text-sm sm:text-base font-medium tracking-wide drop-shadow-sm">
                      {lifeAtImages.workspace.caption}
                    </p>
                  </div>
                </div>

                {/* Bottom: Sunset Valley */}
                <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 aspect-[16/10] sm:aspect-[4/3] group">
                  <Image
                    src={lifeAtImages.collaboration.src}
                    alt={lifeAtImages.collaboration.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 30vw, 260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-serif italic text-sm sm:text-base font-medium tracking-wide drop-shadow-sm">
                      {lifeAtImages.collaboration.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
