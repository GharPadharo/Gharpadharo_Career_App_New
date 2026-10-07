import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import CareersLandingHero from "@/components/home/CareersLandingHero";
import ValuePropositionStrip from "@/components/home/ValuePropositionStrip";
import OpenPositionsSection from "@/components/home/OpenPositionsSection";
import WhyGharPadharoSection from "@/components/home/WhyGharPadharoSection";
import ExploreTeamsSection from "@/components/home/ExploreTeamsSection";
import LifeAtGharPadharoSection from "@/components/home/LifeAtGharPadharoSection";
import WhatYouCanExpectSection from "@/components/home/WhatYouCanExpectSection";
import OurPeopleSection from "@/components/home/OurPeopleSection";
import CareersCTA from "@/components/home/CareersCTA";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute:
      "GharPadharo Careers | Build Technology That Makes Finding a Place Simpler",
  },
  description:
    "Join a team building technology that makes finding a place simpler. Explore career opportunities across engineering, product, design, growth, and operations.",
  alternates: {
    canonical: "https://career.gharpadharo.com/",
  },
  openGraph: {
    title:
      "GharPadharo Careers | Build Technology That Makes Finding a Place Simpler",
    description:
      "Join a team building technology that makes finding a place simpler. Explore career opportunities across engineering, product, design, growth, and operations.",
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
      "Join a team building technology that makes finding a place simpler. Explore career opportunities across engineering, product, design, growth, and operations.",
  },
};

export default async function HomePage() {
  let activeJobs = [];
  try {
    await connectDB();
    const docs = await Job.find({ status: "active" })
      .sort({ postedAt: -1, createdAt: -1 })
      .lean();
    activeJobs = docs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load active jobs for homepage from database:", error);
    activeJobs = [];
  }

  return (
    <>
      {/* 1. Hero Section */}
      <CareersLandingHero />

      {/* 2. Value Proposition Strip */}
      <ValuePropositionStrip />

      {/* 3. Open Positions with Search & Filter Bar */}
      <OpenPositionsSection jobs={activeJobs} />

      {/* 4. Why GharPadharo (Asymmetric editorial layout + principles) */}
      <WhyGharPadharoSection />

      {/* 5. Explore Our Teams (5 horizontal team cards) */}
      <ExploreTeamsSection />

      {/* 6. Life at GharPadharo (Editorial photo mosaic with real photos) */}
      <LifeAtGharPadharoSection />

      {/* 7. What We Offer (People, benefits and support) */}
      <WhatYouCanExpectSection />

      {/* 8. Our People (Team perspectives & culture voices) */}
      <OurPeopleSection />

      {/* 9. Work With Us / Final Careers CTA */}
      <CareersCTA />
    </>
  );
}
