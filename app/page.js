import CareersLandingHero from "@/components/home/CareersLandingHero";
import OpenPositionsPreview from "@/components/home/OpenPositionsPreview";
import WhyGharPadharo from "@/components/home/WhyGharPadharo";
import LifeAtGharPadharo from "@/components/home/LifeAtGharPadharo";
import AboutGharPadharo from "@/components/home/AboutGharPadharo";
import CareersCTA from "@/components/home/CareersCTA";

export const metadata = {
  title: {
    absolute:
      "GharPadharo Careers | Build Technology That Makes Finding a Place Simpler",
  },
  description:
    "GharPadharo is a property and rental technology platform connecting property seekers and owners. Explore career opportunities across technology, product, operations, and growth.",
  alternates: {
    canonical: "https://career.gharpadharo.com/",
  },
  openGraph: {
    title:
      "GharPadharo Careers | Build Technology That Makes Finding a Place Simpler",
    description:
      "GharPadharo is a property and rental technology platform connecting property seekers and owners. Explore career opportunities across technology, product, operations, and growth.",
    url: "https://career.gharpadharo.com/",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GharPadharo Careers | Build Technology That Makes Finding a Place Simpler",
    description:
      "GharPadharo is a property and rental technology platform connecting property seekers and owners. Explore career opportunities across technology, product, operations, and growth.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <CareersLandingHero />

      {/* 2. Open Positions Preview (3 compact roles) */}
      <OpenPositionsPreview />

      {/* 3. Why GharPadharo / Values (4 compact cards) */}
      <WhyGharPadharo />

      {/* 4. Life at GharPadharo (Asymmetric photo collage, id="life-at-gharpadharo") */}
      <LifeAtGharPadharo />

      {/* 5. About GharPadharo (Line art + narrative, id="about") */}
      <AboutGharPadharo />

      {/* 6. Final Hiring CTA Banner */}
      <CareersCTA />
    </>
  );
}
