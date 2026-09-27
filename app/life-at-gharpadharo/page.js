import Image from "next/image";

export const metadata = {
  title: {
    absolute: "Life at GharPadharo | Careers",
  },
  description:
    "Discover life at GharPadharo — the people, work, and shared mission behind building technology that makes finding and renting properties simpler.",
  alternates: {
    canonical: "https://career.gharpadharo.com/life-at-gharpadharo",
  },
  openGraph: {
    title: "Life at GharPadharo | Careers",
    description:
      "Discover life at GharPadharo — the people, work, and shared mission behind building technology that makes finding and renting properties simpler.",
    url: "https://career.gharpadharo.com/life-at-gharpadharo",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life at GharPadharo | Careers",
    description:
      "Discover life at GharPadharo — the people, work, and shared mission behind building technology that makes finding and renting properties simpler.",
  },
};

/**
 * Centralized image configuration for the Life page.
 * Uses only existing placeholder image assets available in the project.
 */
const lifeImages = {
  hero: {
    src: "/images/life-at-gharpadharo/placeholder-collaboration.jpg",
    alt: "GharPadharo team working together on rental technology solutions",
  },
  building: {
    src: "/images/life-at-gharpadharo/placeholder-workspace.jpg",
    alt: "Workspace environment at GharPadharo",
  },
  people: {
    src: "/images/life-at-gharpadharo/placeholder-collaboration.jpg",
    alt: "People at GharPadharo collaborating across disciplines",
  },
  surroundings: {
    src: "/images/life-at-gharpadharo/placeholder-mountains.jpg",
    alt: "Mountain landscape in Uttarakhand",
  },
};

const principles = [
  {
    title: "Start with the real problem",
    description:
      "We begin with the experience we're trying to improve, not the technology we want to use.",
  },
  {
    title: "Earn trust",
    description:
      "When people are making decisions about where they live, accuracy and transparency matter.",
  },
  {
    title: "Keep it simple",
    description:
      "Good technology should remove friction, not add another layer of complexity.",
  },
  {
    title: "Build, learn, improve",
    description:
      "Real problems rarely have perfect first solutions. We learn from what we build and keep improving the experience.",
  },
];

export default function LifeAtGharPadharoPage() {
  return (
    <div className="w-full bg-white text-slate-800 antialiased">
      {/* ========================================================
          1. HERO — EDITORIAL, BALANCED, NO CTA
      ======================================================== */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-linear-to-b from-slate-50/70 via-white to-white border-b border-slate-200/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Eyebrow, Heading & Narrative */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb400]" aria-hidden="true" />
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  LIFE AT GHARPADHARO
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-extrabold text-heading tracking-tight leading-[1.12]">
                Build something that helps people find a place to call home.
              </h1>

              <p className="text-base sm:text-lg text-body leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
                At GharPadharo, our work sits at the intersection of technology
                and everyday life. We build products and systems that make
                discovering and renting a place simpler, clearer and more
                trustworthy.
              </p>
            </div>

            {/* Right Column: Editorial Hero Photograph */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 group">
                <Image
                  src={lifeImages.hero.src}
                  alt={lifeImages.hero.alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 680px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. WHAT WE'RE BUILDING — SPLIT WITH WORKSPACE IMAGE
      ======================================================== */}
      <section className="w-full py-14 sm:py-18 lg:py-24 bg-white border-b border-slate-200/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading & Body */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
                WHAT WE&apos;RE BUILDING
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-[1.16]">
                A simpler way to navigate the rental experience.
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base text-body leading-relaxed font-normal">
                <p>
                  Finding a room or home should not require endless searching,
                  outdated information or unnecessary middlemen.
                </p>
                <p>
                  GharPadharo brings property seekers and owners onto one
                  platform, with a focus on verified information, real-time
                  property details and direct connections.
                </p>
                <p>
                  For the people building the product, that means solving
                  problems that have a real impact beyond the screen.
                </p>
              </div>
            </div>

            {/* Right Column: Existing Image */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 group">
                <Image
                  src={lifeImages.building.src}
                  alt={lifeImages.building.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 580px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHY THE WORK MATTERS — CLEAN TEXT-BASED EDITORIAL
      ======================================================== */}
      <section className="w-full py-14 sm:py-18 lg:py-24 bg-[#f8fafc] border-b border-slate-200/60">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              WHY THE WORK MATTERS
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-[1.16]">
              Every property has a person behind it.
            </h2>

            <div className="w-10 h-0.5 bg-primary/40 rounded-full mx-auto" aria-hidden="true" />

            <div className="space-y-4 pt-2 text-sm sm:text-base text-body leading-relaxed font-normal text-left sm:text-center">
              <p>
                Every property listing represents someone looking for a place
                to live, and every owner is looking to connect with the right
                tenant.
              </p>
              <p>
                Our work is about reducing friction between both sides —
                focusing on verified information, clear communication, and a
                more dependable rental journey.
              </p>
              <p>
                From accurate listings to direct connections, it is the small,
                thoughtful details that make finding a home feel simple and
                trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. OUR PRINCIPLES — 4 PRINCIPLE BLOCKS
      ======================================================== */}
      <section className="w-full py-14 sm:py-18 lg:py-24 bg-white border-b border-slate-200/60">
        <div className="container-custom space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              HOW WE THINK ABOUT THE WORK
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-[1.16]">
              A few principles guide what we build.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {principles.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] rounded-2xl border border-slate-200/80 p-6 space-y-2 border-l-4 border-l-primary shadow-2xs"
              >
                <h3 className="text-base font-bold text-heading tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-body leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. THE PEOPLE BEHIND THE PRODUCT — PRESERVED PEOPLE VISUAL
      ======================================================== */}
      <section className="w-full py-14 sm:py-18 lg:py-24 bg-[#f8fafc] border-b border-slate-200/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Preserved Visual */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-white group">
                <Image
                  src={lifeImages.people.src}
                  alt={lifeImages.people.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 580px"
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-1 lg:order-2">
              <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
                THE PEOPLE
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-[1.16]">
                Different skills. One shared purpose.
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base text-body leading-relaxed font-normal">
                <p>
                  GharPadharo brings together people working across technology,
                  product, operations, growth, marketing, and business development.
                </p>
                <p>
                  The work connects every discipline: engineering and product
                  build the experience, operations deepen our market
                  understanding, and growth connects the platform with the
                  people and owners who need it most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. OUR CONNECTION — MOUNTAIN LANDSCAPE
      ======================================================== */}
      <section className="w-full py-14 sm:py-18 lg:py-24 bg-white border-b border-slate-200/60">
        <div className="container-custom space-y-8 lg:space-y-10">
          <div className="max-w-2xl space-y-3 text-center sm:text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              OUR CONNECTION
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-[1.16]">
              Built close to the people and places we serve.
            </h2>

            <p className="text-sm sm:text-base text-body leading-relaxed font-normal">
              GharPadharo has its roots in Uttarakhand and is focused on
              improving how people discover and navigate housing opportunities.
              The places around us help keep the problem real: housing is not
              just a digital transaction. It is about people, communities and
              the places they are moving to.
            </p>
          </div>

          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 group">
            <Image
              src={lifeImages.surroundings.src}
              alt={lifeImages.surroundings.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-102"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          7. CLOSING STATEMENT — COMPACT, PURE TYPOGRAPHY, NO CTA
      ======================================================== */}
      <section className="w-full py-16 sm:py-20 bg-[#f8fafc]">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-snug">
              Build something useful.
              <br />
              Make it easier for someone else.
            </h2>

            <div className="w-8 h-0.5 bg-[#ffb400] rounded-full mx-auto my-3" aria-hidden="true" />

            <p className="text-base sm:text-lg text-body font-normal leading-relaxed">
              That&apos;s what we&apos;re working toward at GharPadharo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
