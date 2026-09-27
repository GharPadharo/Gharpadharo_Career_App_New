import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import CareersLandingHero from "@/components/home/CareersLandingHero";
import OpenPositionsPreview from "@/components/home/OpenPositionsPreview";
import WhyGharPadharo from "@/components/home/WhyGharPadharo";
import LifeAtGharPadharo from "@/components/home/LifeAtGharPadharo";
import AboutGharPadharo from "@/components/home/AboutGharPadharo";
import CareersCTA from "@/components/home/CareersCTA";

export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  let activeJobs = [];
  try {
    await connectDB();
    const docs = await Job.find({ status: "active" })
      .sort({ postedAt: -1, createdAt: -1 })
      .limit(3)
      .lean();
    activeJobs = docs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load featured jobs for homepage from database:", error);
    activeJobs = [];
  }

  return (
    <>
      {/* 1. Hero Section */}
      <CareersLandingHero />

      {/* 2. Open Positions Preview (3 compact roles from MongoDB) */}
      <OpenPositionsPreview jobs={activeJobs} />

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
