import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Life at GharPadharo | Build. Learn. Grow.",
  description:
    "A glimpse into the people, places, and moments behind GharPadharo.",
  alternates: {
    canonical: "https://career.gharpadharo.com/life-at-gharpadharo",
  },
  openGraph: {
    title: "Life at GharPadharo | Build. Learn. Grow.",
    description:
      "A glimpse into the people, places, and moments behind GharPadharo.",
    url: "https://career.gharpadharo.com/life-at-gharpadharo",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life at GharPadharo | Build. Learn. Grow.",
    description:
      "A glimpse into the people, places, and moments behind GharPadharo.",
  },
};

/**
 * Centralized image configuration for the Life page.
 * Allows quick asset replacement without altering page structure.
 */
const lifeImages = {
  team: {
    src: "/images/life-at-gharpadharo/placeholder-collaboration.jpg",
    alt: "GharPadharo team collaborating around a workspace",
  },
  workspace: {
    src: "/images/life-at-gharpadharo/placeholder-workspace.jpg",
    alt: "Clean modern workspace desk with natural daylight",
  },
  mountains: {
    src: "/images/life-at-gharpadharo/placeholder-mountains.jpg",
    alt: "Mountain landscape in Uttarakhand",
  },
};

export default function LifeAtGharPadharoPage() {
  return (
    <div className="w-full bg-white text-slate-800">
      {/* 1. HERO — Image-Led, Clean & Editorial */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-linear-to-b from-slate-50/70 via-white to-white border-b border-border/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Copy & Single CTA */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
                LIFE AT GHARPADHARO
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-heading tracking-tight leading-[1.14]">
                Build. Learn. Grow.
              </h1>

              <p className="text-base sm:text-lg text-body leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
                A glimpse into the people, places, and moments behind GharPadharo.
              </p>

              <div className="pt-2 flex justify-center lg:justify-start">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span>View Open Positions</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual (Team Collaboration Image) */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 group bg-slate-100">
                <Image
                  src={lifeImages.team.src}
                  alt={lifeImages.team.alt}
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

      {/* 2 & 3. THE PEOPLE & LARGE EDITORIAL IMAGE GRID */}
      <section className="w-full py-16 lg:py-24 bg-white border-b border-border/60">
        <div className="container-custom">
          {/* Section Heading with Minimal Copy */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-12">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              THE PEOPLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              Good ideas happen together.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A look at the people and moments behind the work.
            </p>
          </div>

          {/* Asymmetric Editorial Gallery */}
          <div className="space-y-4 sm:space-y-5">
            {/* Row 1: Large Team Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group bg-slate-100">
              <Image
                src={lifeImages.team.src}
                alt={lifeImages.team.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-102"
                sizes="100vw"
              />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-medium uppercase tracking-wider bg-white/90 text-slate-800 px-3 py-1 rounded-md shadow-2xs backdrop-blur-xs">
                  People
                </span>
              </div>
            </div>

            {/* Row 2: Two Columns (Workspace & Mountains) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Workspace Card */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group bg-slate-100">
                <Image
                  src={lifeImages.workspace.src}
                  alt={lifeImages.workspace.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-medium uppercase tracking-wider bg-white/90 text-slate-800 px-3 py-1 rounded-md shadow-2xs backdrop-blur-xs">
                    Work
                  </span>
                </div>
              </div>

              {/* Mountains Card */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group bg-slate-100">
                <Image
                  src={lifeImages.mountains.src}
                  alt={lifeImages.mountains.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-medium uppercase tracking-wider bg-white/90 text-slate-800 px-3 py-1 rounded-md shadow-2xs backdrop-blur-xs">
                    Place
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE WORK — Minimal Split Section */}
      <section className="w-full py-16 lg:py-24 bg-slate-50/60 border-b border-border/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Large Workspace Image */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group bg-slate-100">
                <Image
                  src={lifeImages.workspace.src}
                  alt={lifeImages.workspace.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 650px"
                />
              </div>
            </div>

            {/* Right: Short Narrative */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
                THE WORK
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight leading-[1.18]">
                Ideas become something real.
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                From early ideas to finished products, there&apos;s always something new to build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLACE / UTTARAKHAND SECTION */}
      <section className="w-full py-16 lg:py-24 bg-white border-b border-border/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Short Narrative */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left order-2 lg:order-1">
              <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
                OUR SURROUNDINGS
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight leading-[1.18]">
                Inspired by where we are.
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                GharPadharo is built in Uttarakhand, with a strong connection to the places and communities around us.
              </p>
            </div>

            {/* Right: Large Mountain Image */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group bg-slate-100">
                <Image
                  src={lifeImages.mountains.src}
                  alt={lifeImages.mountains.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 650px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA — Clean, Focused & Direct */}
      <section className="w-full py-16 sm:py-20 bg-slate-50/80">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              Want to build what&apos;s next?
            </h2>

            <p className="text-slate-600 text-base sm:text-lg font-normal max-w-lg mx-auto">
              Explore our open positions and find your next opportunity.
            </p>

            <div className="pt-2 flex justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-base font-semibold px-7 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>View Open Positions</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
